const redis = require('redis')
require('dotenv').config();

class redis_class {
    async set_value(key, value, mins) {
        const url = `redis://${process.env.redisHost}:${process.env.redisPort}`;
        var client = redis.createClient({
            url:url
        }
        );
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect()
        await client.setEx(key, 60 * parseInt(mins), JSON.stringify(value))
        
    }

    //get value
    async get_value(key) {
        const url = `redis://${process.env.redisHost}:${process.env.redisPort}`;
        var client = redis.createClient({
            url:url
        }
        );
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        const value = await client.get(key)
        return JSON.parse(value)
    }
}

module.exports = { redis_class }