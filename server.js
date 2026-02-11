require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./models");

const app = express();

// CORS configuration (IMPORTANT)
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/plans", require("./routes/plans"));
app.use("/api/roi", require("./routes/roi"));

app.get("/", (req, res) => {
  res.json({ message: "Cloud ROI Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
