const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");

// POST /api/roi/calculate
router.post("/calculate", async (req, res) => {
  const { users, cloudCost } = req.body;

  // Better validation
  if (users == null || cloudCost == null) {
    return res.status(400).json({
      message: "Please provide users count and cloud cost",
    });
  }

  try {
    // Find matching plan safely
    const plan = await db.Plan.findOne({
      where: {
        minUsers: { [Op.lte]: users },
        maxUsers: { [Op.gte]: users },
      },
    });

    if (!plan) {
      return res.status(400).json({
        message: "No suitable plan found for this user count",
      });
    }

    const revenue = users * plan.pricePerUser;
    const roi = ((revenue - cloudCost) / cloudCost) * 100;

    let statusMessage = "";
    let recommendations = [];

    if (roi < 25) {
      statusMessage = "Cloud infrastructure cost too high. Optimize resources.";
      recommendations = [
        "Right-sizing instances",
        "Enable auto-scaling",
        "Use reserved instances",
        "Consider serverless workloads",
      ];
    } else {
      statusMessage = "Cloud operations healthy and profitable.";
      recommendations = [
        "Scale marketing efforts",
        "Target enterprise customers",
        "Expand to new regions",
      ];
    }

    await db.CalculationHistory.create({
      usersCount: users,
      cloudCost: parseFloat(cloudCost),
      revenue,
      roiPercentage: roi,
    });

    res.json({
      plan: plan.name,
      pricePerUser: plan.pricePerUser,
      revenue,
      cloudCost: parseFloat(cloudCost),
      roiPercentage: roi.toFixed(2),
      statusMessage,
      recommendations,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
