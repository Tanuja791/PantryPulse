const mongoose = require("mongoose");

const reminderLogSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  daysBefore: {
    type: Number,
    required: true
  },
  reminderDate: {
    type: String,
    required: true
  }
});

reminderLogSchema.index(
  { itemId: 1, token: 1, daysBefore: 1, reminderDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("ReminderLog", reminderLogSchema);