const express = require('express');
const router = express.Router();

router.route('/').get((req, res) => {
    var datetime = new Date();
    //console.log(datetime.toISOString().slice(0,10));
    res.status(200).json({
        "status": "working",
        "date_time":datetime.toISOString()
    })
})

module.exports = router