const { getLatLong,getAttractionsWithinRadius,getAttractionByName } = require("../services/locationService");
const{getWeatherForecast,getSuggestionBasedOnWeather} =require('../services/weatherService')
const getAttraction=async(req,res)=>{
  const{destination,days,cat,date}=req.query;
  if(!destination || !days){
    return res.status(400).json({message:"Destination and Days are required"});
  }
  try{
    const location=await getLatLong(destination);
    console.log(location);
    let radius;
    if(days>=2){
      radius=20;
    }
    else{
      radius=5;
    }
    // console.log("Hi");
    
    const attractions=await getAttractionsWithinRadius(location.lat,location.lng,radius,cat);
    // console.log(attractions);
    const weatherData=await getWeatherForecast(date,days,location.lat,location.lng);
    const suggestions=await getSuggestionBasedOnWeather(weatherData,attractions,location);
    return res.status(200).json(suggestions);
  }
  catch(e){
    return res.status(500).json({message:"Internal Server Error",error:e.message});
  }
}

const getAttractionDetails=async(req,res)=>{
  const {destination}=req.query;
  
  try{
    const data =await getAttractionByName(destination);
    if(data.length==0){
      return res.status(404).json({message:"No such attraction found"});
    }
  }
  catch(e){
    return res.status(500).json({message:"Internal Server Error",error:e.message});
  }
}

module.exports={getAttraction,getAttractionDetails}