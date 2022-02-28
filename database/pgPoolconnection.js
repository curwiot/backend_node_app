
require('dotenv').config();
const { Client } = require('pg');


module.exports.command = async function (query, values) {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.DB_PORT,
    })
    try {
        var connection = client.connect()
        await console.log(connection)
    } catch (error) {
        await console.log(error)
    }

    try {
        const res = await client.query(query, values)
        //console.log(res)
        return res.rows;
    } catch (err) {
        // console.log(err.stack)
    }
}