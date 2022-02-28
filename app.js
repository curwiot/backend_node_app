const express = require('express');
require('dotenv').config();
const weatherData = require('./routes/weather/weatherData')
const station = require('./routes/station/station')
const data = require('./routes/data/data')
const app = express();

app.use(express.json())


//routes
app.use('/update',weatherData);
app.use('/stations',station)
app.use('/data',data)

//    /weatherstation/updateweatherstation [post]
//    /waterlevelgauge/updatewaterlevelgauge [post]
module.exports = app
