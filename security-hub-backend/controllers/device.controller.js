const db = require("../models");
const Device = db.device;
const ScanHistory = db.scanHistory;

exports.registerDevice = async (req, res) => {
  try {
    console.log('Token userId:', req.userId);
    if (!req.userId) {
      return res.status(401).send({ message: 'Invalid or missing user token.' });
    }
    const existing = await Device.findOne({
      where: { id: req.body.deviceId, userId: req.userId }
    });
    if (existing) {
      console.log('Device already registered:', existing.deviceName);
      return res.status(200).send(existing);
    }
    const device = await Device.create({
      id: req.body.deviceId,
      deviceName: req.body.deviceName,
      deviceType: req.body.deviceType,
      userId: req.userId
    });
    console.log('Device created:', device.deviceName);
    res.status(201).send(device);
  } catch (err) {
    console.error('Error in registerDevice:', err);
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

exports.scanDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await Device.findOne({
      where: { id: deviceId, userId: req.userId }
    });
    if (!device) {
      return res.status(404).send({ message: "Device not found" });
    }
    const { scanData } = req.body;
    const hasRisk = scanData?.suspiciousApps?.length > 0 || scanData?.emulator === true;
    const newStatus = hasRisk ? "Scanned - Issues Found" : "Scanned - Healthy";
    await device.update({
      status: newStatus,
      lastScanned: new Date(),
      scanReport: JSON.stringify(scanData)
    });
    res.status(200).send({
      message: "Scan data stored successfully",
      status: newStatus,
      scanReport: scanData
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.submitScanFromMobile = async (req, res) => {
  try {
    console.log('[MOBILE SCAN RECEIVED]');
    const { deviceId, ...scanData } = req.body;

    if (!deviceId) {
      return res.status(400).send({ message: "Missing deviceId in scan data" });
    }

    const device = await Device.findOne({
      where: { id: deviceId, userId: req.userId }
    });

    if (!device) {
      return res.status(404).send({ message: "Device not found for this user" });
    }

    const hasRisk = scanData.suspiciousApps?.length > 0 || scanData.emulator === true;
    const newStatus = hasRisk ? "Scanned - Issues Found" : "Scanned - Healthy";

    await device.update({
      status: newStatus,
      lastScanned: new Date(),
      scanReport: JSON.stringify(scanData)
    });

    await ScanHistory.create({
      deviceId: device.id,
      scanResult: scanData
    });

    res.status(200).send({
      message: "Scan submitted successfully from mobile device",
      status: newStatus,
      scanReport: scanData
    });
  } catch (err) {
    console.error('Scan submission failed:', err);
    res.status(500).send({ message: err.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!device) {
      return res.status(404).send({ message: 'Device not found' });
    }
    await device.destroy();
    res.send({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
};