const express = require('express');
const { getStatus } = require('../../controllers/dataController');
const router = express.Router();

router.route('/status').get(getStatus);


module.exports = router