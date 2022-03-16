const redis = require('redis')
require('dotenv').config();

class redis_class {
    constructor() {
        this.client = null
    }
    async create_client() {
        var client = redis.createClient({
            url: process.env.REDIS_URL
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        this.client = client
    }
    //set value with time
    async set_value(key, value, mins) {
        await this.client.setEx(key, 60 * parseInt(mins), JSON.stringify(value))
    }

    //get value
    async get_value(key) {
        const value = await this.client.get(key)
        return JSON.parse(value)
    }
}

module.exports = { redis_class }