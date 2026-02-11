const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

// POST /api/analytics/visit
// Log a visitor for today
router.post('/visit', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Find or create record for today
    const [record, created] = await db.Analytics.findOrCreate({
      where: { date: today },
      defaults: { visitors: 1, registrations: 0 }
    });

    if (!created) {
      await record.increment('visitors');
    }

    res.json({ message: 'Visit recorded', visitors: record.visitors });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
