const opencage = require('opencage-api-client');
const {pool}=require("../config/postgresClient")
const axios=require('axios');
const dotenv=require('dotenv');
const { getJson } = require("serpapi");
dotenv.config();


const getLatLong = async (destination) => {
    try {
      const data = await opencage.geocode({ q: destination });
      console.log(data);
      
      if (data.status.code === 200 && data.results.length > 0) {
        return data.results[0].geometry;
      } else {
        return { message: "No results found" }; 
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      throw error; 
    }
  };

const getAttractionsWithinRadius=async(lat,lon,radius,cat=null)=>{
  let q=`select * from attractions where ST_DWithin(location::geography,ST_MakePoint($2,$1)::geography,$3*1000)`;
  if(cat){
    q+=`and category=$4`
  }
  q+=`ORDER BY ST_Y(location::geometry), ST_X(location::geometry)`
  const values=cat?[lat,lon,radius,cat]:[lat,lon,radius];
  try{
    const res=await pool.query(q,values);
    // console.log(res);
    return res.rows;
  }
  catch(e){
    console.error("Error:", e.message);
    throw new Error("Cannot Fetch the attraction");
  }
}

const getAttractionByName=async(name)=>{
    const q=`select * from attractions where name=$1`
    const value=[name];
    try{
      const data=await pool.query(q,value);
      return data.rows;
    }
    catch(e){
      console.error("Error:", e.message);
      throw new Error("Cannot fetch the details of the attractions");
    }
}





//https://serpapi.com/google-maps-api
const getLocalRestaurants = async (latitude, longitude, radiusInKm = 2) => {
  const apiKey = process.env.SERP_KEY;  
  const location = `@${latitude},${longitude},15.1z`;

  try {
    
    const restaurants = await new Promise((resolve, reject) => {
      getJson({
        engine: "google_maps",
        q: "restaurant",  
        radius: radiusInKm*1000,
        ll: location,     
        type: "search",
        api_key: apiKey
      }, (json) => {
        if (!json || !json.local_results) {
          return reject('No restaurants found');
        }

        
        const restaurantList = json.local_results.map((restaurant) => ({
          name: restaurant.title,
          address: restaurant.address,
          rating: restaurant.rating,
          phone: restaurant.phone || 'N/A',
          latitude: restaurant.gps_coordinates ? restaurant.gps_coordinates.latitude : 'N/A',
          longitude: restaurant.gps_coordinates ? restaurant.gps_coordinates.longitude : 'N/A',
        }));

        resolve(restaurantList);
      });
    });
    return (restaurants);
  } catch (error) {
    console.error('Error fetching local restaurants:', error);
    return res.status(500).json({ error: 'Failed to fetch local restaurants' });
  }
};






module.exports={getLatLong,getAttractionsWithinRadius,getAttractionByName,getLocalRestaurants};
  