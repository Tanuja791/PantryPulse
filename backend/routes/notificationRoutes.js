const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const testExpiryReminder = require("../expiryReminder");
router.post("/save-token", async (req, res) => {
  try {
    const { token } = req.body;

    console.log("Received notification token:", token ? "Yes" : "No");

    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    await Notification.findOneAndUpdate(
      { token },
      { token },
      { upsert: true, returnDocument: "after" }
    );

    console.log("Token saved in MongoDB");

    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.log("Notification error:", error);
    res.status(500).json({ message: "Error saving token" });
  }
});

router.post("/test", async (req, res) => {
  try {
    const notification = await Notification.findOne();

    if (!notification) {
      return res.status(404).json({ message: "No notification token found" });
    }

    const admin = require("../firebaseAdmin");

    const message = {
      notification: {
        title: "PantryPulse",
        body: "Your test notification is working!"
      },
      token: notification.token
    };

    const response = await admin.messaging.send(message);

    res.status(200).json({ message: "Notification sent!", response });
  } catch (error) {
    console.log("Notification sending error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/test-expiry", async (req, res) => {
  try {
    await testExpiryReminder();
    res.json({ message: "Expiry reminder test completed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;