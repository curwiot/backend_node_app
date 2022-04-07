const express = require('express');
const fs = require('fs');
var path = require('path')
var morgan = require('morgan');
const rfs = require('rotating-file-stream');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const helmet = require("helmet");



require('dotenv').config(); //environmental variable configurations

const weatherData = require('./routes/weather/weatherData')
const station = require('./routes/station/station')
const data = require('./routes/data/data')
const status = require('./routes/server_status/status')

//app initialization
const app = express();

//helmet 
app.use(helmet());
//express json
app.use(express.json())

//morgan
app.use(bodyParser.json());
var accessLogStream = rfs.createStream('access.log', {
    size: '1G',
    interval: '1M', // rotate daily
    path: path.join(__dirname, 'log'),
    compress: true
})
// setup the logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] :method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream }))
app.use(morgan(':remote-addr - :remote-user [:date[clf]] :method :url :status :res[content-length] - :response-time ms'))
morganBody(app, { noColors: true, stream: accessLogStream });

//routes
app.use('/status', status);
app.use('/weatherstation', weatherData); // accoring to the previous end points this settings has been changed
app.use('/waterlevelgauge', weatherData); // accoring to the previous end points this settings has been changed
app.use('/stations', station);

//currently developing 
app.use('/data', data);

//has to be updated

//user route
//login
//signup
//signout

//notification route
//previous notifications 
//inactive stations

//maintenances
//record maintain
//CRUD

//    /weatherstation/updateweatherstation [post]
//    /waterlevelgauge/updatewaterlevelgauge [post]



//Reading errors finding ex:- -9.99 
// rain calculating function 
// notification system
module.exports = app
