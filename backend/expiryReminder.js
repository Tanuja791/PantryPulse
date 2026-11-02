const cron = require("node-cron");
const PantryItem = require("./models/PantryItem");
const Notification = require("./models/Notification");
const ReminderLog = require("./models/ReminderLog");
const { messaging } = require("./firebaseAdmin");

async function sendExpiryReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderDate = 
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const items = await PantryItem.find();
  const notifications = await Notification.find();

  for (const item of items) {
    const expiry = new Date(item.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const daysLeft = Math.round(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if ([3, 1, 0].includes(daysLeft)) {
      for (const notification of notifications) {
        const alreadySent = await ReminderLog.findOne({
          itemId: item._id,
          token: notification.token,
          daysBefore: daysLeft,
          reminderDate: reminderDate
        });

        if (!alreadySent) {
          const body = daysLeft === 0
            ? `${item.name} expires today!`
            : `${item.name} expires in ${daysLeft} day(s)!`;

          await messaging.send({
            notification: {
              title: "PantryPulse Expiry Reminder",
              body: body
            },
            token: notification.token
          });

          await ReminderLog.create({
            itemId: item._id,
            token: notification.token,
            daysBefore: daysLeft,
            reminderDate: reminderDate
          });
        }
      }
    }
  }
}

cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Checking pantry expiry dates...");
    await sendExpiryReminders();
    console.log("Expiry reminder check completed.");
  } catch (error) {
    console.log("Expiry reminder error:", error);
  }
}, {
  timezone: "Asia/Kolkata"
});

module.exports = sendExpiryReminders;