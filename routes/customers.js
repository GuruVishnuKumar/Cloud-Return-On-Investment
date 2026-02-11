const express = require('express');
const router = express.Router();
const db = require('../models');

// POST /api/customers
// Simulate adding a customer (mostly for dashboard data populating)
router.post('/', async (req, res) => {
  const { name, email, company } = req.body;

  try {
    const newUser = await db.User.create({
      name,
      email,
      company
    });

    // Update Analytics for today
    const today = new Date().toISOString().split('T')[0];
    const [record] = await db.Analytics.findOrCreate({
      where: { date: today },
      defaults: { visitors: 0, registrations: 1 }
    });
    await record.increment('registrations');

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/customers
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
