const express = require('express');
const router = express.Router();
const db = require('../models');

// POST /api/roi/calculate
router.post('/calculate', async (req, res) => {
  const { users, cloudCost } = req.body;

  if (!users || !cloudCost) {
    return res.status(400).json({ message: 'Please provide users count and cloud cost' });
  }

  try {
    // Determine Plan based on users
    const plan = await db.Plan.findOne({
      where: db.Sequelize.literal(`"minUsers" <= ${users} AND "maxUsers" >= ${users}`)
    });

    if (!plan) {
      return res.status(400).json({ message: 'No suitable plan found for this user count (50-3000 users)' });
    }

    // Calculate Revenue
    const revenue = users * plan.pricePerUser;

    // Calculate ROI
    // ROI = (Revenue - Cloud Cost) / Cloud Cost * 100
    const roi = ((revenue - cloudCost) / cloudCost) * 100;

    // Generate Recommendations & Status
    let statusMessage = "";
    let recommendations = [];

    if (roi < 25) {
        statusMessage = "Cloud infrastructure cost too high. Optimize resources.";
        recommendations = [
            "Right-sizing instances: Switch to smaller instance types if utilization is low.",
            "Auto-scaling: Implement auto-scaling to match demand peaks.",
            "Reserved instances: Purchase reserved capacity for steady-state workloads.",
            "Serverless: Migrate sporadic workloads to serverless functions."
        ];
    } else {
        statusMessage = "Cloud operations healthy and profitable.";
        recommendations = [
            "Scale Marketing: ROI is healthy, invest in customer acquisition.",
            "Enterprise Targeting: Focus on high-value enterprise features.",
            "Expand Regions: Consider deploying to new geographic regions."
        ];
    }

    // Save calculation history
    await db.CalculationHistory.create({
      usersCount: users,
      cloudCost: parseFloat(cloudCost),
      revenue: revenue,
      roiPercentage: roi
    });

    res.json({
      plan: plan.name,
      pricePerUser: plan.pricePerUser,
      revenue,
      cloudCost: parseFloat(cloudCost),
      roiPercentage: roi.toFixed(2),
      statusMessage,
      recommendations
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
