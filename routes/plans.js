const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/plans
router.get('/', async (req, res) => {
  try {
    const plans = await db.Plan.findAll();
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
