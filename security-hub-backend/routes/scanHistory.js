const express = require('express');
const router = express.Router();
const db = require('../models');
const ScanHistory = db.scanHistory;

console.log('ScanHistory value:', ScanHistory);

router.post('/scan-history', async (req, res) => {
  try {
    const { deviceId, scanResult } = req.body;
    const history = await ScanHistory.create({ deviceId, scanResult });
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save scan history' });
  }
});

router.get('/scan-history/:deviceId', async (req, res) => {
  try {
    const history = await ScanHistory.findAll({
      where: { deviceId: req.params.deviceId },
      order: [['createdAt', 'DESC']],
    });
    res.json(history);
  } catch (err) {
    console.error('Error fetching scan history:', err);
    res.status(500).json({ error: 'Failed to fetch scan history' });
  }
});

router.delete('/scan-history/:deviceId', async (req, res) => {
  try {
    const count = await ScanHistory.destroy({
      where: { deviceId: req.params.deviceId }
    });
    res.status(200).json({ message: `Deleted ${count} scan records.` });
  } catch (err) {
    console.error('Error deleting scan history:', err);
    res.status(500).json({ error: 'Failed to delete scan history' });
  }
});

module.exports = router;