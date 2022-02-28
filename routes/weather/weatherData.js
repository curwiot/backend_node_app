const express = require('express');
const { validateWeatherData } = require('./weatherValidation');
const {insertDataWeatherStation }  = require('../../controllers/weatherController')
const router = express.Router();

router.route('/updateweatherstation').post(validateWeatherData, insertDataWeatherStation)

module.exports = router