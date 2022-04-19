const express = require('express');
const { get_status,get_data_station, get_all_stations_data } = require('../../controllers/dataController');
const router = express.Router();


router.route('/status').get(get_status);
router.route('/station/:id').get(get_data_station)
router.route('/station').get(get_all_stations_data)



//get station data 
    // specify parameters and time duration 
    // select wanted stations

//get maintenance data
    // * battery and gsm status of all stations 
    // get previous battery records 


module.exports = router