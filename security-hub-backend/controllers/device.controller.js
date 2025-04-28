// This file handles the registration, scanning, updating, listing and
// deletion of devices for an account. 
const db = require("../models");
const Device = db.device;
const ScanHistory = db.scanHistory;

// This sections handles device registration and also retrieves existing
// devices from an account.
exports.registerDevice = async (req, res) => {
  try {
    // A check to see if the device is valid through a user token. If not,
    // an error message is displayed.
    console.log('Token userId:', req.userId);
    if (!req.userId) {
      return res.status(401).send({ message: 'User token is invalid or missing.' });
    }

    // A check to see whether the device already exists. If so, then a message is
    // displayed stating the identity of the device.
    const existing = await Device.findOne({
      where: { id: req.body.deviceId, userId: req.userId }
    });
    if (existing) {
      console.log('Device already registered:', existing.deviceName); // Device name is provided.
      return res.status(200).send(existing);
    }

    // If the device doesn't already exist, then the device a new device is created
    // for an account and the information associated with device is stored.
    const device = await Device.create({
      id: req.body.deviceId,
      deviceName: req.body.deviceName,
      deviceType: req.body.deviceType,
      userId: req.userId
    });
    // Success message displayed when the device is created. Details the device name.
    console.log('Device created:', device.deviceName);
    res.status(201).send(device);
  } catch (err) {
    // Any errors in carrying out this task is accompanied with this error message to
    // make sure problem areas in the code can be easily located.
    console.error('Error in registerDevice:', err);
    res.status(500).send({ message: err.message });
  }
};

// This section is responsible for returning all the devices
// that are registered to an account.
exports.getDevices = async (req, res) => {
  try {
    // All the devices are fetched and displayed.
    const devices = await Device.findAll({
      where: { userId: req.userId }
    });
    res.status(200).send(devices);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// This section is responsible for updating the security status
// of devices (for example, when a scan is carried out).
exports.updateDeviceStatus = async (req, res) => {
  try {
    // This gathers the current data for a device and attempts to
    // replace it with the most recent data.
    const deviceId = req.params.id;
    await Device.update(
      {
        status: req.body.status, // define device security status.
        lastScanned: new Date() // define time of the latest scan.
      },
      { where: { id: deviceId, userId: req.userId } }
    );
    // A success message is displayed if this update was carried out.
    // If not, an error message is displayed. 
    res.status(200).send({ message: "Device status updated!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// This section handles the scanning feature within the mobile app by managing
// the scan submission from a device and saves the scan results to the history. 
exports.submitScanFromMobile = async (req, res) => {
  try {
    // Retrieves the scan data through the deviceId and scanData,
    console.log('[MOBILE SCAN RECEIVED]');
    const { deviceId, ...scanData } = req.body;

    // If the deviceId in the scan results submission doesnt match a curent deviceId
    // or doesn't exist, then an error message is displayed.
    if (!deviceId) {
      return res.status(400).send({ message: "deviceId error in the scan data..." });
    }
    // Otherwise, a check to see which account the device is registered to.
    const device = await Device.findOne({
      where: { id: deviceId, userId: req.userId }
    });
    // If the device isn't registered to the account, then an error message is displayed
    // saying that the device was not found for that user. 
    if (!device) {
      return res.status(404).send({ message: "Device not found for user..." });
    }
    // A check is carried out to see whether the most recent scan on a device matches
    // the criteria for a positive or negative scan result and sets the status accordingly.
    const hasRisk = scanData.suspiciousApps?.length > 0 || scanData.emulator === true;
    const newStatus = hasRisk ? "Scanned: Malware Found" : "Scanned: Safe";
    // The latest scan information is updated.
    await device.update({
      status: newStatus, // New status is set
      lastScanned: new Date(), // The time of the latest scan is set.
      scanReport: JSON.stringify(scanData) // Detailed scan data report is provided.
    });
    // This data is then saved to the Scan History page.
    await ScanHistory.create({
      deviceId: device.id,
      scanResult: scanData
    });
    // Once this is all carried out, a success message is displayed.
    res.status(200).send({
      message: "Scan was submitted successfully from the device",
      status: newStatus, // New status displayed
      scanReport: scanData // New scan data displayed
    });
  } catch (err) {
    console.error('Scan submission failed:', err);
    res.status(500).send({ message: err.message });
  }
};

// This section provides the user with the ability to delete a device from their account
// through the online dashboard.
exports.deleteDevice = async (req, res) => {
  try {
    // When clicked, the device is found.
    const device = await Device.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    // If the device doesn't exist, an error message is displayed.
    if (!device) {
      return res.status(404).send({ message: 'The device was not found' });
    }
    // Otherwise, the device is then deleted and a message is displayed
    // confirming the deletion.
    await device.destroy();
    res.send({ message: 'Your Device has been deleted' });
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
};