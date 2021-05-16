"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt"); //added for password security

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password); //updated compare password to use bcrypt.compare
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch");
  }
  return this;
};

module.exports = Mongoose.model("User", userSchema);
