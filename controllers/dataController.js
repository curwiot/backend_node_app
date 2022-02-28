const db_connection = require('../database/pgPoolconnection')

const getStatus = async (req, res) => {
    station_list = await get_all_stations()
    station_data_set= await get_stations_last_records(station_list)
    
    //station_list_data = await get_stations_last_records(station_list)
    //console.log(station_list)
    //const station_data = station_list.reduce(async (data_array, element) => {
        //const station_data = await get_station_last_data(element.id)
        //console.log(typeof(data_array))
        //data_array.push(station_data)
        //return data_array
    //}, [])

    res.json(station_data_set)
}

async function get_metadata(value_id) {
    const meta_data = await db_connection.command("select * from run where station=$1", [value_id]);
    console.log(meta_data)
    return meta_data
}

async function get_all_stations() {
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,last_maintenance,station_type,domestic_contact from station order by station_id asc");
    return stations
}

async function get_station_last_data(station_id) {
    const data_object = await db_connection.command("select parameter,value from run left join parameter p on p.parameter_id = run.parameter_id where station=$1", [station_id])
    return data_object
}

async function get_stations_last_records (stations) {
    let data = [];
    await Promise.all(stations.map(async (station) => {
      station_data = await get_station_last_data(station.id);
      data.push(station_data);
    }));
    console.log(data);
    return data
}

// async function get_stations_last_records(stations) {
//     var station_status = {}
//     let station_data = []
//     await stations.forEach(async element => {
//         let temp_data = 


//         station_data = await get_station_last_data(element.id)
//         if (station_data.length == 0) {
//             const data_set = {
//                 station: element,
//                 "station_data": "not reported"
//             }
//             station_status = { ...station_status, data_set }
//         } else {
//             const data_set = {
//                 station: element,
//                 "station_data": station_data
//             }
//             station_status = { ...station_status, data_set }
//         }

//         console.log(JSON.stringify(station_status))
//     }
//     );
// }

module.exports = { getStatus }
