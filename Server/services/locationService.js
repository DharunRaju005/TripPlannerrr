const opencage = require('opencage-api-client');
const {pool}=require("../config/postgresClient")

const getLatLong = async (destination) => {
    try {
      const data = await opencage.geocode({ q: destination });
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

module.exports={getLatLong,getAttractionsWithinRadius}
  