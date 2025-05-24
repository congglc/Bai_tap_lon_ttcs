const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

// GET /api/qr?text=NOIDUNG
router.get('/', async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const qr = await QRCode.toDataURL(text);
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ error: 'Error generating QR' });
  }
});

module.exports = router; 