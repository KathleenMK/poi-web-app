"use strict";

const User = require("../models/user");

const Accounts = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Beaches" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Join Us" });
    },
  },
  signup: {
    auth: false,
    handler: async function (request, h) {
      const payload = request.payload;
      const newUser = new User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
      });
      const user = await newUser.save();
      request.cookieAuth.set({ id: user.id });
      return h.redirect("/home");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login" });
    },
  },
  login: {
    auth: false,
    handler: async function (request, h) {
      const { email, password } = request.payload;
      let user = await User.findByEmail(email);
      if (!user) {
        return h.redirect("/");
      }
      if (user.comparePassword(password)) {
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      }
      return h.redirect("/");
    },
  },
  logout: {
    //auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
};

module.exports = Accounts;
