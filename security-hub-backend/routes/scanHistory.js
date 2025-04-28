// This file handles the scan history API for creating, listing
// and deleting the scan history for a device.
const express = require('express');
const router = express.Router();
const db = require('../models');
const ScanHistory = db.scanHistory;

console.log('ScanHistory value:', ScanHistory);

router.post('/scan-history', async (req, res) => {
  try {
    // This attempts to save a new scan record for a device to the
    // scan history page.
    const { deviceId, scanResult } = req.body;
    const history = await ScanHistory.create({ deviceId, scanResult });
    res.status(201).json(history);
    // If this couldn't be completed, an error message is displayed.
  } catch (err) {
    res.status(500).json({ error: 'Failed to save scan history' });
  }
});

// This section is responsible for getting all the scan history
// for a device on an account.
router.get('/scan-history/:deviceId', async (req, res) => {
  // Attempts to find all whole scan history for a device.
  try {
    const history = await ScanHistory.findAll({
      where: { deviceId: req.params.deviceId },
      order: [['createdAt', 'DESC']], // In descending order.
    });
    res.json(history);
    // Otherwise, an error message is displayed according to the
    // type of issue.
  } catch (err) {
    console.error('Error fetching scan history of device:', err);
    res.status(500).json({ error: 'Failed to fetch scan history of the device' });
  }
});

// This section carries out a deletion on the entire scan history
// of a device.
router.delete('/scan-history/:deviceId', async (req, res) => {
  try {
    // Find scan history and "destroy" it.
    const count = await ScanHistory.destroy({
      where: { deviceId: req.params.deviceId }
    });
    // Display message confirming deletion.
    res.status(200).json({ message: `Deleted ${count} scan records from device.` });
    //Otherwise display relevant error message.
  } catch (err) {
    console.error('Error deleting scan history:', err);
    res.status(500).json({ error: 'Failed to delete scan history' });
  }
});
module.exports = router;