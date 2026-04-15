const express = require('express');
const router = express.Router();

// Add your routes here
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
