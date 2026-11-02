const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const admin = require("./firebaseAdmin");
const app = express();
require("./expiryReminder");
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/api/items", require("./routes/pantryRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

mongoose
  .connect("mongodb+srv://tanujakolla0529_db_user:tanuja2111@cluster0.iwhei74.mongodb.net/pantrypulse")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((error) => console.log("Connection failed:", error));