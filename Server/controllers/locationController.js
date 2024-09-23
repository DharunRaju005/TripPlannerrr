const { getLatLong,getAttractionsWithinRadius } = require("../services/locationService");

const getAttraction=async(req,res)=>{
  const{destination,days,cat}=req.query;
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
    console.log("Hi");
    
    const attractions=await getAttractionsWithinRadius(location.lat,location.lng,radius,cat);
    console.log(attractions);
    
    return res.status(200).json(attractions);
  }
  catch(e){
    return res.status(500).json({message:"Internal Server Error",error:e.message});
  }
}

module.exports={getAttraction}