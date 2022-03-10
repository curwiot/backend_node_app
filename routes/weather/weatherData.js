const express = require('express');
const { validateWeatherData } = require('./weatherValidation');
const {insertDataWeatherStation }  = require('../../controllers/weatherController');
const { validateWaterLevelData } = require('./waterlevelValidation');
const router = express.Router();

router.route('/updateweatherstation').post(validateWeatherData, insertDataWeatherStation)
router.route('/updatewaterlevel').post(validateWaterLevelData,insertDataWeatherStation)

module.exports = router