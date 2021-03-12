"use strict";

const Accounts = {
  index: {
    handler: function (request, h) {
      return h.view("main", { title: "Beaches" });
    },
  },
  showSignup: {
    handler: function (request, h) {
      return h.view("signup", { title: "Join Us" });
    },
  },
  signup: {
    handler: function (request, h) {
      const user = request.payload;
      this.users[user.email] = user;
      this.currentUser = user;
      return h.redirect("/home");
    },
  },
  showLogin: {
    handler: function (request, h) {
      return h.view("login", { title: "Login" });
    },
  },
  login: {
    handler: function (request, h) {
      const user = request.payload;
      if (user.email in this.users && user.password === this.users[user.email].password) {
        this.currentUser = this.users[user.email];
        return h.redirect("/home");
      }
      return h.redirect("/");
    },
  },
  logout: {
    handler: function (request, h) {
      return h.redirect("/");
    },
  },
};

module.exports = Accounts;
