const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.get('/devices', deviceController.getDevices);
router.post('/devices', deviceController.addDevice);

module.exports = router;