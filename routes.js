"use strict";

const Accounts = require("./app/controllers/accounts");
const Pois = require("./app/controllers/pois");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: "GET", path: "/settings", config: Accounts.showSettings },
  { method: "POST", path: "/settings", config: Accounts.updateSettings },

  { method: "GET", path: "/home", config: Pois.home },
  { method: "POST", path: "/add", config: Pois.add },
  { method: "GET", path: "/report", config: Pois.report },
  { method: "GET", path: "/deletepoi/{id}", config: Pois.delete },
  { method: "GET", path: "/poi/{id}", config: Pois.show },
  { method: "POST", path: "/poi/{id}", config: Pois.update },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
