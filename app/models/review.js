"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const reviewSchema = new Schema({
  poi: {
    type: Schema.Types.ObjectId,
    ref: "Poi",
  },
  text: String,
  rating: Number,
  contributor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: String,
});

module.exports = Mongoose.model("Review", reviewSchema);
