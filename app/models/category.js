"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  description: String,
});

module.exports = Mongoose.model("Category", categorySchema);
