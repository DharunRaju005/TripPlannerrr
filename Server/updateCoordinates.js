const dotenv=require('dotenv');  
const axios = require('axios');
const { Pool } = require('pg');
dotenv.config()

const pool = new Pool({
  connectionString: process.env.PS_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
}  
});

const updateAttractionCoordinates = async (attractionId, attractionName) => {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;  // Use your OpenCage API key from .env
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${attractionName}&key=${apiKey}`);
    const { lat, lng } = response.data.results[0].geometry;

    // Update the database with the correct lat/long
    await pool.query(
      'UPDATE attractions SET latitude = $1, longitude = $2 WHERE id = $3',
      [lat, lng, attractionId]
    );

    console.log(`Updated ${attractionName} with lat: ${lat}, long: ${lng}`);
  } catch (error) {
    console.error(`Failed to update ${attractionName}:`, error.message);
  }
};

const updateAllAttractions = async () => {
  try {
    const result = await pool.query('SELECT id, name FROM attractions');  // Fetch all attractions
    const attractions = result.rows;

    for (const attraction of attractions) {
      await updateAttractionCoordinates(attraction.id, attraction.name);  // Update each attraction's lat/long
    }

    console.log('All attractions updated');
  } catch (error) {
    console.error('Error updating attractions:', error);
  } finally {
    pool.end();  // Close the pool connection
  }
};

updateAllAttractions();
