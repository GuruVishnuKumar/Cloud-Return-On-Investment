const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    // 1. KPI Cards Data
    const totalCustomers = await db.User.count();
    const totalCalculations = await db.CalculationHistory.count();
    
    // Analytics Aggregation
    const analytics = await db.Analytics.findAll();
    const totalVisitors = analytics.reduce((sum, record) => sum + record.visitors, 0);
    const totalRegistrations = analytics.reduce((sum, record) => sum + record.registrations, 0);
    const conversionRate = totalVisitors > 0 ? ((totalRegistrations / totalVisitors) * 100).toFixed(2) : 0;

    // Financials (Mocked based on plans for now, assuming standard distribution if no real subscriptions)
    // In a real app, we would query a Subscriptions table.
    // Let's assume a distribution for demonstration:
    // Basic: 20%, Pro: 32%, Enterprise: 48% of total revenue roughly matches user request example
    // We will calculate "Potential Revenue" from CalculationHistory as a proxy for "Active Interest"
    
    const calculations = await db.CalculationHistory.findAll();
    let totalRevenue = 0;
    let totalCloudCost = 0;
    let basicRevenue = 0;
    let proRevenue = 0;
    let enterpriseRevenue = 0;

    calculations.forEach(calc => {
        totalRevenue += calc.revenue;
        totalCloudCost += calc.cloudCost;
        
        // Naive categorization based on revenue amount per calc to simulate plan bucket
        // Basic < 50k, Pro < 120k, Enterprise > 120k (Just for viz)
        // Better: Fetch plan from DB based on user count in history if we stored it, 
        // but for now let's use the revenue magnitude to bucket them.
        if (calc.revenue < 50000) basicRevenue += calc.revenue;
        else if (calc.revenue < 120000) proRevenue += calc.revenue;
        else enterpriseRevenue += calc.revenue;
    });

    // If no data, use mock data to show UI capabilities as requested
    if (totalRevenue === 0) {
        totalRevenue = 250000;
        totalCloudCost = 100000;
        basicRevenue = 50000;
        proRevenue = 80000;
        enterpriseRevenue = 120000;
    }

    const profit = totalRevenue - totalCloudCost;
    const roi = totalCloudCost > 0 ? ((profit / totalCloudCost) * 100).toFixed(2) : 0;
    const avgRevenuePerCustomer = totalCustomers > 0 ? (totalRevenue / totalCustomers).toFixed(2) : 0;

    // 2. Predictions (Next 3 Months)
    // Simple linear growth model: 10% month-over-month
    const growthRate = 0.10;
    const predictions = [
        { month: 'Month 1', revenue: totalRevenue * (1 + growthRate) },
        { month: 'Month 2', revenue: totalRevenue * (1 + growthRate) ** 2 },
        { month: 'Month 3', revenue: totalRevenue * (1 + growthRate) ** 3 },
    ];

    // 3. Revenue Distribution
    const revenueDistribution = [
        { name: 'Basic', value: basicRevenue },
        { name: 'Pro', value: proRevenue },
        { name: 'Enterprise', value: enterpriseRevenue },
    ];

    // 4. Recent Activity
    const recentActivity = await db.CalculationHistory.findAll({
        limit: 10,
        order: [['timestamp', 'DESC']]
    });

    res.json({
        kpi: {
            totalVisitors,
            totalCustomers,
            totalRevenue,
            totalCloudCost,
            profit,
            roiPercentage: roi,
            avgRevenuePerCustomer,
            conversionRate
        },
        predictions,
        revenueDistribution,
        recentActivity
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
