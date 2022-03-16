const express = require('express');
const { get_status } = require('../../controllers/dataController');
const router = express.Router();

router.route('/status').get(get_status);
router.route('/getdata').get()


module.exports = router