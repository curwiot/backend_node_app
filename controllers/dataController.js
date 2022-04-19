const db_connection = require('../database/pgPoolconnection');
const { redis_class } = require('../redis/redis_client');

const get_status = async (req, res) => {
    const cache_status = await new redis_class().get_value('station_status');
    if (cache_status == null) {
        station_list = await get_all_stations();
        station_data_set = await get_stations_last_records(station_list);
        await new redis_class().set_value('station_status', station_data_set, 1);
        res.json(station_data_set);
    } else {
        res.json(cache_status);
    }
}

async function get_all_stations() {
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,place,station_type,domestic_contact from station order by station_id asc");
    return stations
}

async function get_station_last_data(station_id) {
    var data_object = await db_connection.command("select parameter,value from run left join parameter p on p.parameter_id = run.parameter_id where station_id=$1", [station_id])
    let data_object_send = []
    if (data_object.length != 0) {
        data_object.forEach((element) => {
            const parameter_temp = element.parameter
            const value_temp = element.value;
            data_object_temp = { [parameter_temp]: value_temp };
            data_object_send.push(data_object_temp);
        })

    }
    return data_object_send
}

async function get_stations_last_records(stations) {
    let data = [];
    await Promise.all(stations.map(async (station) => {
        var station_data = await get_station_last_data(station.id);
        console.log(station_data);
        if (station_data.length != 0) {
            const pushing_obj = {
                station_data: station_data,
                station: station
            }
            data.push(pushing_obj);
        }
    }));
    return data
}

const get_data_station = async (req, res) => {
    const station_id = req.params.id;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const parameters = req.body.parameters;
    //test printing 
    //console.log(start_time);
    //console.log(end_time);

    const data = await generate_db_string(station_id, parameters, start_time, end_time);


    //rain_values5 = await db_connection.command("select * from data where meta_id=$1 and time between ($2) and ($3) order by time DESC ", [element.meta_id, time_1, time_2]);

    res.send(data);
}

async function generate_db_string(station_id, parameters, start_time, end_time) {
    var data_values = await db_connection.command("(select d.time,p.parameter,d.value,p.unit from data d inner join (select m.meta_id,p.parameter,p.unit from meta_data m inner join parameter p on m.parameter_id = p.parameter_id where m.station_id=$1) p on d.meta_id = p.meta_id where time between $2 and $3)order by 1,2", [station_id, start_time, end_time])
    //for all the parameters create arrays
    var Temperature = []
    var Humidity = []
    var Daily_rain = []
    var Wind_direction = []
    var Wind_speed = []
    var Pressure = []
    var BAT = []
    var Network = []
    var RSSI = []
    var Water_level = []
    var dates_times= []

    data_values.map(record=>{
        dates_times.push(new Date(record.time).toISOString());
    })
    var new_dates=removeDuplicates(dates_times)
    function removeDuplicates(arr) {
        return arr.filter((item, 
            index) => arr.indexOf(item) === index);
    }
    data_values.map(record => {
        switch (record.parameter) {
            case "Temperature":
                if (parameters['Temperature'] == true) {
                    Temperature.push(record.value)
                }
                break;
            case "Humidity":
                if (parameters['Humidity'] == true) {
                    Humidity.push(record.value)
                }
                break;
            case "Daily_rain":
                if (parameters['Daily_rain'] == true) {
                    Daily_rain.push(record.value)
                }
                break;
            case "Wind_direction":
                if (parameters['Wind_direction'] == true) {
                    Wind_direction.push(record.value)
                }
                break;
            case "Wind_speed":
                if (parameters['Wind_speed'] == true) {
                    Wind_speed.push(record.value)
                }
                break;
            case "Pressure":
                if (parameters['Pressure'] == true) {
                    Pressure.push(record.value)
                }
                break;
            case "BAT":
                if (parameters['BAT'] == true) {
                    BAT.push(record.value)
                }
                break;
            case "Network":
                if (parameters['Network'] == true) {
                    Network.push(record.value)
                }
                break;
            case "RSSI":
                if (parameters['RSSI'] == true) {
                    RSSI.push(record.value)
                }
                break;
            case "Water_level":
                if (parameters['Water_level'] == true) {
                    Water_level.push(record.value)
                }
                break;
            default:
                break;
        }
    })
    var output = {
        "DateTime":new_dates,
        "Temperature": Temperature,
        "Humidity": Humidity,
        "Daily_rain": Daily_rain,
        "Wind_direction": Wind_direction,
        "Wind_speed": Wind_speed,
        "Pressure": Pressure,
        "BAT": BAT,
        "Network": Network,
        "RSSI": RSSI,
        "Water_level": Water_level
    }
    for (parameter in parameters) {
        console.log(parameters[parameter])
        if (parameters[parameter] != true) {
            delete output[parameter]
        }
    }
    console.log(output)
    console.log(JSON.stringify(output))
    return output
}
module.exports = { get_status, get_data_station }
