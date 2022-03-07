const res = require("express/lib/response");
const { station } = require("../model/stationModel")
const { Response_object } = require("../model/ResponseModel")
var stringSimilarity = require("string-similarity");
const db_connection = require('../database/pgPoolconnection')

//get all the sations
const getAllStations = async (req, res) => {
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,station_type,domestic_contact,place from station");
    stations_array = []
    stations.forEach((element) => {
        stations_array = [...stations_array, new station(element)]
    })
    if (stations.length == 0) {
        res.status(204)
    }
    res.status(200).json(new Response_object(stations_array, 200, "Success request"))

}


//get stations by ID
const getStationById = async (req, res) => {
    const station_id = req.params.id;
    const station_selected = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,station_type,domestic_contact,place from station where station_id =$1", [station_id]);
    if (station_selected.length !== 0) {
        station_object = new station(station_selected[0])
        res.status(200).json(new Response_object(station_object, 200, "Success request"))
    }else{
        res.status(204).json({})
    }
}

//find stations by name
const findStationByName = async (req, res) => {
    let matches = []
    const station_name = req.params.name
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,station_type,domestic_contact,place from station");
    stations.forEach((value, index) => {
        var similarity = stringSimilarity.compareTwoStrings(station_name, value.station_id)
        matches[index] = similarity
    })
    var max = Math.max.apply(null, matches)
    if (max > 0.2) {
        var index = matches.indexOf(max)
        res.status(200).json(new Response_object(stations[index], 200, "station has been found"))
    }else{
        res.status(204).json({})
    }
}

//insert station to the database
const insert_station = async (req, res) => {
    const dataObject = req.body;
    //check whether station is available
    const available_status = await db_connection.command("select * from station where station.station_id= $1 OR station.station_name=$2", [dataObject.station_id, dataObject.station_name])
    if (available_status.length == 0) {
        //inserting into the data base
        const station = await db_connection.command("insert into station (id,station_id, station_password, station_name, latitude, longitude, description,station_type, domestic_contact,place) values (0,$1,$2,$3,$4,$5,$6,$7,$8,$9)",
            [
                dataObject.station_id,
                dataObject.station_password,
                dataObject.station_name,
                dataObject.latitude,
                dataObject.longitude,
                dataObject.description,
                dataObject.station_type,
                dataObject.domestic_contact,
                dataObject.place
            ]
        );
        const available_inserted_stations = await db_connection.command("select * from station where station.station_id= $1 OR station.station_name=$2", [dataObject.station_id, dataObject.station_name]);
        if (available_inserted_stations.length != 0) {
            res.status(201).json(
                new Response_object(available_inserted_stations, 201, "The station has been inserted into the database")
            )
        } else {
            res.status(500).json(
                new Response_object(null, 500, "The station record is not available in the database but failed to insert into the database")
            )
        }
    } else {
        res.status(208).json(
            new Response_object(null, 200, "Station is already available in the database")
        )
    }

}

//delete station by id
const delete_station_by_id = async (req, res) => {
    const station_id = req.params.id;
    const station_selected_to_delete = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,station_type,domestic_contact,place from station where station.station_id =$1", [station_id]);
    if (station_selected_to_delete.length == 0) {
        res.status(204).json(new Response_object(null, 500, "The station has not been found in the database"))
    } else {
        const station_selected = new station(station_selected_to_delete[0])
        const station_deleted = await db_connection.command("delete from station where station.station_id = $1", [station_id])
        res.status(200).json(new Response_object(station_selected, 410, "This station has been deleted from the database"))
    }
}

//update station
const update_station = async (req, res) => {
    const update_body = req.body
    const station_id = req.params.id;
    const station_selected_to_update = await db_connection.command("select id,station_password,station_id,station_name,latitude,longitude,description,station_type,domestic_contact,place from station where station.station_id =$1", [station_id]);
    if (station_selected_to_update.length != 0) {
        //sation is available in the database
        var updating_station = new station(station_selected_to_update[0])
        var request_station = new station(update_body)
        for (const [key, value] of Object.entries(request_station)) {
            if (typeof (value) !== 'undefined') {
                updating_station[key] = value;
            }
        }
        //updating station
        const updated_station = await db_connection.command("update station set station_id = $1,station_password=$2,station_name=$3,latitude=$4,longitude=$5,description=$6,station_type=$7,domestic_contact=$8,place=$9 where station_id=$10", [
            updating_station.station_ID,
            updating_station.station_PASSWROD,
            updating_station.station_name,
            updating_station.station_latitude,
            updating_station.station_longitude,
            updating_station.station_description,
            updating_station.station_type,
            updating_station.domestic_contact,
            updating_station.place,
            station_id
        ]);

        //checking newly updated station
        const station_selected = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,station_type,domestic_contact,place from station where station.station_id =$1", [updating_station.station_ID]);
        if (station_selected[0].length != 0) {
            //station successfuly updated
            res.status(200).json(new Response_object(station_selected[0], 200, "The station record has been updated in the database"))
        } else {
            res.status(200).json(new Response_object(null, 500, "Data has not been updated in the database"))
        }
    } else {
        //station is not available in the database
        res.status(204).json(new Response_object(null, 500, "The station was not found in the datbaase"))
    }

}



module.exports = { getAllStations, getStationById, findStationByName, insert_station, delete_station_by_id, update_station }