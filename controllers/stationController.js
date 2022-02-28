var stringSimilarity = require("string-similarity");
const db_connection = require('../database/pgPoolconnection')
const getAllStations = async (req, res) => {
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,last_maintenance,station_type,domestic_contact from station");
    res.status(200).json(stations)
}

const getStationById = async (req, res) => {
    const station_id = req.params.id
    const station = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,last_maintenance,station_type,domestic_contact from station where station.station_id =$1", [station_id]);
    res.status(200).json(station)
}

const findStationByName = async (req, res) => {
    let matches = []
    const station_name = req.params.name
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,last_maintenance,station_type,domestic_contact from station");
    stations.forEach((value, index) => {
        var similarity = stringSimilarity.compareTwoStrings(station_name, value.station_id)
        matches[index] = similarity
    })
    var max = Math.max.apply(null, matches)
    if (max > 0.3) {
        var index = matches.indexOf(max)
        res.status(200).json(stations[index])
    } else {
        res.status(404).json({
            "Message": "No station found for the given name"
        })
    }
}

const insert_station = async (req, res) => {
    const dataObject = req.body;
    try {
        const station = await db_connection.command("insert into station (id,station_id, station_password, station_name, latitude, longitude, description,station_type, domestic_contact) values (nextval('station_id_seq'),$1,$2,$3,$4,$5,$6,$7,$8)",
            [
                dataObject.station_id,
                dataObject.station_password,
                dataObject.station_name,
                dataObject.latitude,
                dataObject.longitude,
                dataObject.description,
                dataObject.station_type,
                dataObject.domestic_contact,
            ]
        );
        res.status(201).json({
            "Message" : "Station has been inserted into the database"
        })
    } catch (error) {
        res.status(505).json({
            "Message" : error
        })
    }
}



module.exports = { getAllStations, getStationById, findStationByName, insert_station }