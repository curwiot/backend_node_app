const { station } = require("./stationModel");
const db_connection = require('../database/pgPoolconnection')

class dataPoint {
    /*
    ID
    PASSWORD
    action
    softwareType
    version
    health [BAT,RSSI]
    data [dateist,waterlevel]
    */
    constructor(dataObject) {

        this.ID = dataObject.ID;
        this.PASSWORD = dataObject.PASSWORD;

        //weather station
        this.dailyrain = dataObject.data[0].dailyrainMM;
        this.rain = dataObject.data[0].rain;
        this.temperature = dataObject.data[0].tempc;
        this.windDirection = dataObject.data[0].winddir;
        this.windspeed = dataObject.data[0].windspeedkmh;
        this.humidity = dataObject.data[0].humidity;
        this.pressure = dataObject.data[0].baromMM;

        //water level station
        this.waterlevel = dataObject.data[0].waterlevelm;

        //general 
        this.date = dataObject.data[0].dateist;
        this.battery = dataObject.health.BAT;
        this.network = dataObject.health.network;
        this.RSSI = dataObject.health.RSSI;

        //station
        this.station = null;
    }

    //password validation
    async password_validation() {
        const new_station = new station(this.ID, this.PASSWORD);
        await new_station.validate_station();
        if (new_station.station_name == undefined) {
            return false;
        } else {
            this.station = new_station;
            return true;
        }
    }

    async meta_data_generate() {
       return await this.station.station_metadata();
    }

    //last reading 
    async upsert_data() {
        //const data = await db_connection.command('select * from station where station_id=$1 AND station_password=$2', [this.station_ID, this.station_PASSWROD]);
        if (this.station.station_type == 0) {
            //daily rain -3
            if (this.dailyrain != undefined) {
                this.upsert_executor(this.station.meta_data[2], this.dailyrain, this.date, 2)
            }

            //temperature - 0
            if (this.temperature != undefined) {
                this.upsert_executor(this.station.meta_data[0], this.temperature, this.date, 0)
            }

            //humidity -1
            if (this.humidity != undefined) {
                this.upsert_executor(this.station.meta_data[1], this.humidity, this.date, 1)
            }

            //wind_direction - 5
            if (this.windDirection != undefined) {
                this.upsert_executor(this.station.meta_data[5], this.windDirection, this.date, 5)
            }

            //humidity -7
            if (this.windspeed != undefined) {
                this.upsert_executor(this.station.meta_data[6], this.windspeed, this.date, 6)
            }

            //pressure -8
            if (this.pressure != undefined) {
                this.upsert_executor(this.station.meta_data[7], this.pressure, this.date, 7)
            }

            //rain -5
            if (this.rain != undefined) {
                this.upsert_executor(this.station.meta_data[4], this.rain, this.date, 4)
                //insert into rainticks
                try {
                    for (const [key, value] of Object.entries(this.rain)) {
                        const run = await db_connection.command('insert into rain_ticks (id, rain_tick_no, rain_tick_time) values ($1,$2,$3) on conflict (id,rain_tick_time) DO UPDATE SET rain_tick_time=$3 ,rain_tick_no=$2 ', [this.station.meta_data[4], key, value]);
                    }
                } catch (error) {
                   // console.log(error)
                }
            }
        }

        if (this.station.station_type == 1) {
            //water level 
            if (this.waterlevel != undefined) {
                this.upsert_executor(this.station.meta_data[9], this.waterlevel, this.date, 9)
            }
        }

        //geenral data
        //battery
        if (this.battery != undefined) {
            this.upsert_executor(this.station.meta_data[8], this.battery, this.date, 8)
        }
        //network
        if (this.network != undefined) {
            this.upsert_executor(this.station.meta_data[9], this.network, this.date, 9)
        }
        //RSSI
        if (this.RSSI != undefined) {
            this.upsert_executor(this.station.meta_data[10], this.RSSI, this.date, 10)
        }

    }

    async upsert_executor(hashid, value, time, parameter) {
        //insert into run table
        try {
            const run = await db_connection.command('INSERT INTO run(id,station,originate_time,parameter_id,value) VALUES($1,$2,$3,$4,$5) ON CONFLICT (id) DO UPDATE SET originate_time =$3,value=$5', [hashid, this.station.id, time, parameter, value]);
        } catch (error) {
          //  console.log(error)
        }

        //insert into data table
        try {
            const data = await db_connection.command('INSERT INTO data(id,time,value) VALUES($1,$2,$3) ON CONFLICT DO NOTHING', [hashid, time, value]);
        } catch (error) {
           // console.log(error)
        }
    }
}

module.exports = { dataPoint }