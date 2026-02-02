// models/Task.js

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      default: null,
    },
    picture: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: [
        "Moving",
        "Gardening",
        "Painting",
        "Cleaning",
        "Delivery",
        "Other",
      ],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
