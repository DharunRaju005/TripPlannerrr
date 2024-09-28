const express=require('express');
// const { getLatLong } = require('../services/locationService');
const { getAttraction, getAttractionDetails } = require('../controllers/locationController');
// const { getAttractionDetail } = require('../services/locationService');
const router=express.Router();

router.get("/getAttraction",getAttraction);
router.get("/getAttractionDetails",getAttractionDetails);

module.exports=router;