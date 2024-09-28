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
const getSuggestionBasedOnWeather = async (weatherData, attractions, userLocation, maxTravelDistance) => {
    const suggestions = [];
    let visitedAttractions = new Set();

    weatherData.forEach(weather => {
        if (weather.weather && weather.weather.length > 0) {
            const weatherCondition = weather.weather[0].main.toLowerCase();
            console.log("Weather Condition:", weatherCondition);

            const temp = weather.main.temp;
            const feelsLike = weather.main.feels_like;
            const lowTemp = weather.main.temp_min;
            const highTemp = weather.main.temp_max;
            const suggested = attractions
                .filter(attraction => {
                    const idealWeather = attraction.ideal_weather.toLowerCase();  
                    if (weatherCondition === 'clouds') {
                        return idealWeather.includes('cloud'); 
                    } else if (weatherCondition === 'rain') {
                        return idealWeather.includes('clear');
                    } else {
                        return true;
                    }
                })
                .filter(attraction => !visitedAttractions.has(attraction.id))
                .slice(0, 2);

            
            suggested.forEach(attraction => visitedAttractions.add(attraction.id));

            suggestions.push({
                date: new Date(weather.dt * 1000).toISOString().split('T')[0], // Format date
                weather: weatherCondition,  // Weather condition for the time slot
                day_temp: temp,
                feels_like: feelsLike,
                low_temp: `${lowTemp}°C`,   
                high_temp: `${highTemp}°C`,
                attractions: suggested,     
                date: weather.dt_txt       
            });
        } else {
            console.error('Weather data is missing or incomplete for:', weather);
            suggestions.push({
                date: new Date(weather.dt * 1000).toISOString().split('T')[0], // Format date
                weather: 'unknown',        
                day_temp: 'N/A',
                feels_like: 'N/A',
                low_temp: 'N/A',         
                high_temp: 'N/A',        
                attractions: []             
            });
        }
    });

    return suggestions;
};



module.exports={getWeatherForecast,getSuggestionBasedOnWeather};