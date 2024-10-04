const dotenv=require('dotenv');
const axios=require('axios');
const { getLocalRestaurants } = require('./locationService');
dotenv.config();
const getWeatherForecast = async (date, lat, lng) => {
    const apiKey = process.env.OPEN_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    try {
        
        const res = await axios.get(url);
        const data = res.data.list; //contains weather with 3 hrs interval

        
        const startDate = new Date(date); 
        startDate.setHours(6, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(18, 0, 0, 0); 

        const filteredData = data.filter((item) => {
            const forecastDate = new Date(item.dt * 1000); // Convert UNIX timestamp to Date
            return (
                forecastDate.getTime() >= startDate.getTime() &&
                forecastDate.getTime() < endDate.getTime()
            );
        });

        if (filteredData.length === 0) {
            console.log("No data found within the specified date and time range.");
        }

        return filteredData;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error;
    }
};


// https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; 
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;
//     return distance;
// };

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers

    // Parse lat/lon as floats (if they're passed as strings)
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance; // Return distance in kilometers
};


const getOptimalPathTomTom = async (attractions) => {
    try {
        const tomtomApiKey = process.env.TOMTOM_API_KEY;  // Replace with your TomTom API Key

        // Extract latitude and longitude for each attraction
        const coordinates = attractions.map(attraction => 
            `${attraction.latitude},${attraction.longitude}`
        ).join(':');  // TomTom expects the format as lat,long:lat,long:lat,long...
        const coordinate = '37.7749,-122.4194:34.0522,-118.2437:36.1699,-115.1398';
        
        // Send the request to TomTom Routing API
        const response = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${coordinate}/json`, {
            params: {
                key: 'f3bIjpGOYx7wrEGGzd6yllmBAEK1Yu1i8kj',
                routeType: 'shortest',
                traffic: false,
                travelMode: 'car'
            },
            headers: {
                'Content-Type': 'application/json',
                // Add Origin or Referer header if needed
                // 'Origin': 'your-frontend-domain',
            }
        });
        
        console.log(response);
        
        // Check if the response contains valid route information
        if (response.data.routes && response.data.routes.length > 0) {
            return response.data.routes[0];  // Return the first route
        } else {
            console.error("No valid routes found.");
            return null;
        }
    } catch (error) {
        console.error('Error fetching optimal route from TomTom:', error);
        return null;
    }
};


const getSuggestionBasedOnWeather = async (weatherData, attractions) => {
    const suggestions = [];
    let visitedAttractions = new Set();  // Track visited attractions
    let visitedPlaces = new Set();       // Track visited restaurants

    // Store all attractions planned for the day
    const dailyAttractions = [];

    for (const weather of weatherData) {
        if (weather.weather && weather.weather.length > 0) {
            const weatherCondition = weather.weather[0].main.toLowerCase();
            const temp = weather.main.temp;
            const feelsLike = weather.main.feels_like;
            const lowTemp = weather.main.temp_min;
            const highTemp = weather.main.temp_max;
            const currentHour = new Date(weather.dt_txt).getHours(); 

            // Filter suggested attractions based on weather and restrictions
            const suggestedAttractions = attractions
                .filter(attraction => {
                    const idealWeather = attraction.ideal_weather.toLowerCase();
                    if (weatherCondition === 'clouds') {
                        return idealWeather.includes('cloud');
                    } else if (weatherCondition === 'rain') {
                        return idealWeather.includes('rain');
                    } else {
                        return true; 
                    }
                })
                .filter(attraction => {
                    // Restrict waterfalls to the 10 AM - 4 PM time range
                    if (attraction.category.toLowerCase() === 'waterfalls') {
                        return currentHour >= 10 && currentHour <= 16;
                    }
                    return true; 
                })
                .filter(attraction => !visitedAttractions.has(attraction.id)); 

            // Add the newly suggested attractions to the daily list
            dailyAttractions.push(...suggestedAttractions);
            suggestedAttractions.forEach(attraction => visitedAttractions.add(attraction.id));

            // Get restaurants for the attractions suggested
            const suggestionsForAttractions = await Promise.all(
                suggestedAttractions.map(async attraction => {
                    const res = await getLocalRestaurants(attraction.latitude, attraction.longitude);
                    console.log("res", attraction.name, res);

                    const nearestRestaurant = res
                        .filter(place => place.rating >= 3)  
                        .map(restaurant => ({
                            ...restaurant,
                            distance: calculateDistance(attraction.latitude, attraction.longitude, restaurant.latitude, restaurant.longitude)
                        }))
                        .sort((a, b) => a.distance - b.distance) 
                        .slice(0, 5); 

                    // Mark the restaurant as visited
                    if (nearestRestaurant.length > 0) {
                        visitedPlaces.add(nearestRestaurant[0].name); // Using name as ID for simplicity
                    }

                    return {
                        attraction,
                        restaurant: nearestRestaurant
                    };
                })
            );

            // Add the suggestions to the final output
            suggestions.push({
                date: new Date(weather.dt * 1000).toISOString().split('T')[0], // Format date
                weather: weatherCondition,
                day_temp: temp,
                feels_like: feelsLike,
                low_temp: `${lowTemp}°C`,
                high_temp: `${highTemp}°C`,
                attractions: suggestionsForAttractions,
                date_time: weather.dt_txt
            });
        } else {
            console.error('Weather data is missing or incomplete for:', weather);
            suggestions.push({
                date: new Date(weather.dt * 1000).toISOString().split('T')[0],
                weather: 'unknown',
                day_temp: 'N/A',
                feels_like: 'N/A',
                low_temp: 'N/A',
                high_temp: 'N/A',
                attractions: [],
            });
        }
    }

    console.log("hi",dailyAttractions);
    
    // const route = await getOptimalPathTomTom(dailyAttractions);

    // // Optionally, add the route to each day's suggestion or a summary at the end
    // suggestions.forEach(suggestion => {
    //     suggestion.optimal_route = route; // Add the calculated route
    // });

    return suggestions;
};


module.exports={getWeatherForecast,getSuggestionBasedOnWeather};