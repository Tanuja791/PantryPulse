const mongoose = require("mongoose");

const pantryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "Other" },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "pcs" },
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model("PantryItem", pantryItemSchema);