const db_connection = require('../database/pgPoolconnection')
require('dotenv').config();
let crypto = require('crypto');

class station {
    constructor(object) {
        //id,station_id,station_password,station_name,latitude,longitude, description, station_type, domestic_contact,place
        this.id = object.id;
        this.station_ID =object.station_id
        this.station_PASSWROD = object.station_password;
        this.station_name = object.station_name;
        this.station_latitude = object.latitude;
        this.station_longitude = object.longitude;
        this.station_description = object.description;
        this.station_type = object.station_type;
        this.domestic_contact = object.domestic_contact;
        this.place=object.place;
        
    }

    async validate_station() {
        //validate station from the database
        const data = await db_connection.command('select * from station where station_id=$1 AND station_password=$2', [this.station_ID, this.station_PASSWROD]);
        if (data[0] != undefined) {
            this.station_details(data[0])
        }

    }

    station_details(object) {
        this.id = object.id
        this.station_name = object.station_name;
        this.station_latitude = object.latitude;
        this.station_longitude = object.longitude;
        this.station_description = object.description;
        this.station_lastMaintenance = object.last_maintenance;
        this.station_type = object.station_type;
        this.domestic_contact = object.domestic_contact;
    }

    async station_metadata() {
        const data = await db_connection.command('select * from meta_data where station_id=$1 ', [this.station_ID]);
        if (data.length == 0) {
            await this.generate_station_metadata();
        }
        await this.hash_assign();

    }
    async hash_assign() {
        var data = await db_connection.command('select * from meta_data where station_id=$1 ', [this.station_ID]);
        var temp_meta_data = {};
        data.forEach((value, index) => {
            temp_meta_data[value.parameter_id] = value.hash_key
        })
        this.meta_data = temp_meta_data
    }

    async generate_station_metadata() {
        var data = null;
        if (this.station_type == 0) {
            data = await db_connection.command('select * from parameter where type=0 or type=2');
        }
        if (this.station_type == 1) {
            data = await db_connection.command('select * from parameter where type=1 or type=2');
        }
        var meta_data = {}
        data.forEach((item, index) => {
            meta_data[item.parameter_id] =
            {
                'hash': this.hasher((item.parameter + this.station_ID + this.station_name), process.env.SECRET_KEY).hashedpassword,
                'parameter': item.parameter
            };
        })
        this.meta_data = meta_data;
        await this.hashInsert();
    }

    hasher(password, salt) {
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        let value = hash.digest('hex');
        return {
            salt: salt,
            hashedpassword: value
        };
    };

    async hashInsert() {
        for (const [key, value] of Object.entries(this.meta_data)) {
            const data = await db_connection.command('insert into meta_data (station_id, parameter_id, hash_key) values ($1, $2, $3)', [this.station_ID, key, value.hash]);
        }
    }


}


module.exports = { station }