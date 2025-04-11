import express from 'express';
import ScanHistory from '../models/ScanHistory';

const router = express.Router();

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
    res.status(500).json({ error: 'Failed to fetch scan history' });
  }
});

export default router;