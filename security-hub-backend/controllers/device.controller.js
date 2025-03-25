const db = require("../models");
const Device = db.device;

exports.registerDevice = async (req, res) => {
  try {
    const device = await Device.create({
      deviceName: req.body.deviceName,
      deviceType: req.body.deviceType,
      userId: req.userId
    });
    res.status(200).send(device);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      where: { userId: req.userId }
    });
    res.status(200).send(devices);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateDeviceStatus = async (req, res) => {
  try {
    const deviceId = req.params.id;
    await Device.update(
      {
        status: req.body.status,
        lastScanned: new Date()
      },
      { where: { id: deviceId, userId: req.userId } }
    );
    res.status(200).send({ message: "Device updated!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ADD THIS → Scan device endpoint
exports.scanDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;

    // Check if device exists for this user
    const device = await Device.findOne({
      where: { id: deviceId, userId: req.userId }
    });

    if (!device) {
      return res.status(404).send({ message: "Device not found" });
    }

    // Simulate a scan process (basic version)
    device.status = "Scanned - Healthy";
    device.lastScanned = new Date();

    await device.save();

    res.status(200).send({
      message: "Scan complete",
      status: device.status
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};