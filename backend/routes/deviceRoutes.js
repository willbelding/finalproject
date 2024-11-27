const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/deviceController');

router.get('/devices', deviceController.getAllDevices);

router.get('/devices/:id', deviceController.getDeviceById);

router.post('/devices', deviceController.addDevice);

router.put('/devices/:id', deviceController.updateDevice);

router.delete('/devices/:id', deviceController.deleteDevice);

module.exports = router;
