const { dataPoint } = require("../model/dataPoint");
const { Response_object } = require("../model/ResponseModel");
const {redis_class} = require('../redis/redis_client');

const insertDataWeatherStation = async (req, res) => {
    let newData = new dataPoint(req.body);
    let password_validation = await newData.password_validation()
    if (password_validation == false) {
        res.status(404).json(new Response_object(null, 404, 'Station has not been found in the database'));
        return
    } else {
        //CHECK META DATA IS AVAILABLE
        //create staion var
        var station_redis_string = "update_"+newData.station.id
        const cache_station = await new redis_class().get_value(station_redis_string);
        if(cache_station == null){
            await newData.meta_data_generate();
            await new redis_class().set_value(station_redis_string,newData.station.meta_data,3600); // 1 hour time delay
        }else{
            newData.station.meta_data = cache_station;
        }
        newData.upsert_data();
        res.status(201).json(new Response_object(null, 201, 'Station has been recorded into the database'));
    }
}
module.exports = { insertDataWeatherStation }