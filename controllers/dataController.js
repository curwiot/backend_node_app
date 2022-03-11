const db_connection = require('../database/pgPoolconnection')
const {redis_class} = require('../redis/redis_client')

const get_status = async (req, res) => {
    //creating redist client 
    var redis_object = new redis_class();
    await redis_object.create_client();
    // await redis_object.set_value('key',{'test':'rajantha '},1);
    // await redis_object.get_value('key')
    const cache_status = await redis_object.get_value('station_status')
    if( cache_status == null ){
        station_list = await get_all_stations()
        station_data_set = await get_stations_last_records(station_list)
        await redis_object.set_value('station_status',station_data_set,1)
        res.json(station_data_set)
    }else{
        res.json(cache_status);
    }
}

async function get_metadata(value_id) {
    const meta_data = await db_connection.command("select * from run where station=$1", [value_id]);
    console.log(meta_data)
    return meta_data
}

async function get_all_stations() {
    const stations = await db_connection.command("select id,station_id,station_name,latitude,longitude,description,place,station_type,domestic_contact from station order by station_id asc");
    return stations
}

async function get_station_last_data(station_id) {
    var data_object = await db_connection.command("select parameter,value from run left join parameter p on p.parameter_id = run.parameter_id where station=$1", [station_id])
    let data_object_send = []
    if(data_object.length != 0){
        data_object.forEach((element)=>{
            const parameter_temp = element.parameter
            const value_temp  = element.value;
            data_object_temp = {[parameter_temp] : value_temp};
            data_object_send.push(data_object_temp);
        })
  
    }
    return data_object_send
}

async function get_stations_last_records(stations) {
    let data = [];
    await Promise.all(stations.map(async (station) => {
        var station_data = await get_station_last_data(station.id);
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


const get_data = async (req, res) => {

}
module.exports = { get_status,get_data }
