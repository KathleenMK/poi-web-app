const Categories = require("./app/api/categories");
const Users = require("./app/api/users");
const Pois = require("./app/api/pois");

module.exports = [
  { method: "GET", path: "/api/categories", config: Categories.find },
  { method: "GET", path: "/api/categories/{id}", config: Categories.findOne },
  { method: "POST", path: "/api/categories", config: Categories.create },
  { method: "DELETE", path: "/api/categories/{id}", config: Categories.deleteOne },
  { method: "DELETE", path: "/api/categories", config: Categories.deleteAll },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
  { method: "PUT", path: "/api/users/{id}", config: Users.update },

  { method: "GET", path: "/api/pois", config: Pois.findAll },
  { method: "GET", path: "/api/pois/{id}", config: Pois.findOne },
  { method: "GET", path: "/api/categories/{id}/pois", config: Pois.findByCategory },
  { method: "POST", path: "/api/categories/{id}/pois", config: Pois.addPoi },
  { method: "PUT", path: "/api/pois/{id}", config: Pois.update },
  { method: "DELETE", path: "/api/pois", config: Pois.deleteAll },
  { method: "DELETE", path: "/api/pois/{id}", config: Pois.deleteOne },

  { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },
];
