const express = require('express');
const { get_status } = require('../../controllers/dataController');
const router = express.Router();

router.route('/status').get(get_status);
router.route('/getdata').get()


//get station data 
    // specify parameters and time duration 
    // select wanted stations

//get maintenance data
    // * battery and gsm status of all stations 
    // get previous battery records 


module.exports = router