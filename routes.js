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
  { method: "GET", path: "/admin", config: Accounts.admin },
  { method: "GET", path: "/deleteuser/{id}", config: Accounts.delete },

  { method: "GET", path: "/home", config: Pois.home },
  { method: "POST", path: "/add", config: Pois.add },
  { method: "GET", path: "/report", config: Pois.report },
  { method: "GET", path: "/deletepoi/{id}", config: Pois.delete },
  { method: "GET", path: "/poi/{id}", config: Pois.show },
  { method: "POST", path: "/poi/{id}", config: Pois.update },
  { method: "POST", path: "/uploadfile/{id}", config: Pois.uploadFile },
  { method: "GET", path: "/deleteimage/{id}", config: Pois.deleteImage },
  { method: "GET", path: "/reportfilter/{id}", config: Pois.reportFilter },
  { method: "GET", path: "/categoryform", config: Pois.categoryForm },
  { method: "POST", path: "/addcategory", config: Pois.categoryAdd },

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
