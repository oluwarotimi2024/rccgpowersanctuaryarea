const mongoose = require("mongoose");

const PrayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    request: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prayer", PrayerSchema);
