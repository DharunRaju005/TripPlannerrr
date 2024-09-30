const dotenv=require('dotenv');
const axios=require('axios')
dotenv.config();
const getWeatherForecast = async (date, days, lat, lng) => {
    const apiKey = process.env.OPEN_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    try {
        const res = await axios.get(url);
        const data = res.data.list;

        // Convert user-provided date to a Date object
        const startDate = new Date(date); // Assuming date is a string like "2024-09-30"
        const endDate = new Date(startDate); // Clone the start date
        endDate.setDate(startDate.getDate() + days); // Add the number of days

        // Filter the weather data based on the provided start and end dates
        const filteredData = data.filter((item) => {
            const forecastDate = new Date(item.dt * 1000); // Convert UNIX timestamp to Date
            
            // Get the hours from the forecastDate (0-23 format)
            const hours = forecastDate.getUTCHours();

            // Check if the date is within the specified range AND time is between 6 AM (6) and 6 PM (18)
            return (
                forecastDate.getTime() >= startDate.getTime() &&
                forecastDate.getTime() < endDate.getTime() &&
                hours >= 6 && hours <= 18
            );
        });

        // If no data is found within the date range, log for debugging
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
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const getSuggestionBasedOnWeather = async (weatherData, attractions, places) => {
    const suggestions = [];
    let visitedAttractions = new Set();  // Track visited attractions
    let visitedPlaces = new Set();       // Track visited hotels/restaurants

    weatherData.forEach(weather => {
        if (weather.weather && weather.weather.length > 0) {
            const weatherCondition = weather.weather[0].main.toLowerCase();
            const temp = weather.main.temp;
            const feelsLike = weather.main.feels_like;
            const lowTemp = weather.main.temp_min;
            const highTemp = weather.main.temp_max;
            const currentHour = new Date(weather.dt_txt).getHours(); 

            // Filter attractions based on weather, time, and avoid repeating suggestions
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
                .filter(attraction => !visitedAttractions.has(attraction.id)) 
                .slice(0, 2); // Limit to 2 attractions per time slot

            suggestedAttractions.forEach(attraction => visitedAttractions.add(attraction.id));

            // For each attraction, find the nearest hotel and restaurant
            const suggestionsForAttractions = suggestedAttractions.map(attraction => {
                const nearestHotel = places
                    .filter(place => place.type === 'Hotel')
                    .map(hotel => ({
                        ...hotel,
                        distance: calculateDistance(attraction.latitude, attraction.longitude, hotel.latitude, hotel.longitude)
                    }))
                    .sort((a, b) => a.distance - b.distance)  // Sort by distance
                    .slice(0, 1)[0]; // Get the nearest hotel

                const nearestRestaurant = places
                    .filter(place => place.type === 'Restaurant')
                    .map(restaurant => ({
                        ...restaurant,
                        distance: calculateDistance(attraction.latitude, attraction.longitude, restaurant.latitude, restaurant.longitude)
                    }))
                    .sort((a, b) => a.distance - b.distance)  // Sort by distance
                    .slice(0, 1)[0]; // Get the nearest restaurant

                // Mark them as visited
                if (nearestHotel) visitedPlaces.add(nearestHotel.id);
                if (nearestRestaurant) visitedPlaces.add(nearestRestaurant.id);

                return {
                    attraction,
                    hotel: nearestHotel,
                    restaurant: nearestRestaurant
                };
            });

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
                hotel_or_restaurant: [] // No hotels or restaurants in case of missing weather data
            });
        }
    });

    return suggestions;
};

module.exports={getWeatherForecast,getSuggestionBasedOnWeather};