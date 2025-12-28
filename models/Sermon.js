const mongoose = require("mongoose");

const SermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    preacher: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    description: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sermon", SermonSchema);
