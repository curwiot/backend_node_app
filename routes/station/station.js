const express = require('express');
const router = express.Router();
const { getAllStations, getStationById, findStationByName,insert_station,delete_station_by_id, update_station } = require('../../controllers/stationController')
const {validStationData} = require('./stationValidation')
//getting all the stations list
router.route('/').get(getAllStations).post(validStationData,insert_station)
router.route('/:id').get(getStationById).delete(delete_station_by_id).put(update_station)
router.route('/findbyname/:name').get(findStationByName)


module.exports = router