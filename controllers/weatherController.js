const { dataPoint } = require("../model/dataPoint")

const insertDataWeatherStation =async (req, res) => {
    let newData = new dataPoint(req.body);
    let password_validation = await newData.password_validation() 
    if(password_validation == false){
        res.status(404).json({
            'Message' : 'Station not found',
        });
        return 
    }
    await newData.meta_data_generate();
    newData.upsert_data();

    res.status(201).json({
        "Station Validation": "Success",
        "Meta data":"Success",
        "Insert Data" : "Success"
    })
}




module.exports = {insertDataWeatherStation}