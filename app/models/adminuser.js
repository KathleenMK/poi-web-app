"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const Boom = require("@hapi/boom");

const adminuserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

adminuserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

adminuserSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch");
  }
  return this;
};

module.exports = Mongoose.model("AdminUser", adminuserSchema);
