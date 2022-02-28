const express = require('express');
const router = express.Router();
const { getAllStations, getStationById, findStationByName,insert_station } = require('../../controllers/stationController')
const {validStationData} = require('./stationValidation')
//getting all the stations list
router.route('/').get(getAllStations).post(validStationData,insert_station)
router.route('/:id').get(getStationById)
router.route('/findbyname/:name').get(findStationByName)


module.exports = router