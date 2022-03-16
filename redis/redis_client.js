const redis = require('redis')
require('dotenv').config();

class redis_class {
    async set_value(key, value, mins) {
        var client = redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        });
        client['auth']=null
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        this.client = client
        await this.client.setEx(key, 60 * parseInt(mins), JSON.stringify(value))
    }

    //get value
    async get_value(key) {
        var client = redis.createClient({
            //url: process.env.REDIS_URL
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        this.client = client
        const value = await this.client.get(key)
        return JSON.parse(value)
    }
}

module.exports = { redis_class }