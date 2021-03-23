"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  descshort: String,
  description: String,
  imageurl: String,
  imagepublicid: String,
  contributor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  latitude: Number,
  longitude: Number,
});

module.exports = Mongoose.model("Poi", poiSchema);
