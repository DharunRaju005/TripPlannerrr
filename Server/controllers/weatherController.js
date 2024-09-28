const { getWeatherForecast } = require("../services/weatherService");

const getWeather = async (req, res) => {
  const { date, lat, lng } = req.query;

  if (!date || !lat || !lng) {
    return res.status(400).json({message:"Date,latitude,and longitude are required"});
  }

  try {
    const data = await getWeatherForecast(date, lat, lng);  
    return res.status(200).json(data); 
  } catch (e) {
    console.error("Error fetching weather data:", e.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getWeather };
