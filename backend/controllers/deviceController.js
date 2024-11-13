const deviceModel = require('../models/deviceModel');

exports.getDevices = async (req, res) => {
    try {
        const devices = await deviceModel.getAllDevices();
        res.status(200).json(devices);
    } catch (err) {
        res.status(500).send('Error retrieving devices');
    }
};

exports.addDevice = async (req, res) => {
    try {
        const device = req.body;
        await deviceModel.addDevice(device);
        res.status(201).send('Device added successfully');
    } catch (err) {
        res.status(500).send('Error adding device');
    }
};