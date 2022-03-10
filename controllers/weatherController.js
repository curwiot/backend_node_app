const { dataPoint } = require("../model/dataPoint")
const { Response_object } = require("../model/ResponseModel")

const insertDataWeatherStation =async (req, res) => {
    let newData = new dataPoint(req.body);
    let password_validation = await newData.password_validation() 
    if(password_validation == false){
        res.status(404).json(new Response_object(null,404,'The station has not been found in the database'));
        return 
    }
    await newData.meta_data_generate();
    newData.upsert_data();

    res.status(201).json(new Response_object(null, 201, "Station has been recorded into the database "))
}
module.exports = {insertDataWeatherStation}