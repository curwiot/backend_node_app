const express = require('express');
require('dotenv').config(); //environmental variable configurations

const weatherData = require('./routes/weather/weatherData')
const station = require('./routes/station/station')
const data = require('./routes/data/data')
const status = require('./routes/server_status/status')
const app = express();

app.use(express.json())


//routes
app.use('/status',status);
app.use('/update',weatherData);
app.use('/stations',station);
app.use('/data',data);


//    /weatherstation/updateweatherstation [post]
//    /waterlevelgauge/updatewaterlevelgauge [post]
module.exports = app
