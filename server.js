require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./models");

const app = express();

/* 🔥 CORS FIRST */
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

/* ROUTES AFTER CORS */
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/plans", require("./routes/plans"));
app.use("/api/roi", require("./routes/roi"));

app.get("/", (req, res) => {
  res.json({ message: "Cloud ROI Backend Running 🚀" });
});

/* ------------------ DATABASE + SERVER START ------------------ */

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected ✅");

    await db.sequelize.sync();
    console.log("Database synced ✅");

    // Auto seed plans if empty
    const planCount = await db.Plan.count();

    if (planCount === 0) {
      await db.Plan.bulkCreate([
        { name: "Basic", minUsers: 1, maxUsers: 100, pricePerUser: 500 },
        { name: "Pro", minUsers: 101, maxUsers: 500, pricePerUser: 400 },
        { name: "Enterprise", minUsers: 501, maxUsers: 3000, pricePerUser: 300 },
      ]);

      console.log("Default Plans Inserted ✅");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (error) {
    console.error("Startup Error ❌:", error);
  }
}

startServer();
