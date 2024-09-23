const mongoose = require('mongoose');
require('dotenv').config();

const makeConnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB CONNECTED");
    }
    catch(err){
        console.log(err.message);
    }
}
module.exports=makeConnection;