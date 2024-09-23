const express=require('express');
// const { getLatLong } = require('../services/locationService');
const { getAttraction } = require('../controllers/locationController');
const router=express.Router();

router.get("/getAttraction",getAttraction);

module.exports=router;