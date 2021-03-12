"use strict";

const Poi = require("../models/poi");
const User = require("../models/user");

const Pois = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add something" });
    },
  },
  report: {
    handler: async function (request, h) {
      const pois = await Poi.find().populate("contributor").lean();
      return h.view("report", {
        title: "So far...",
        pois: pois,
      });
    },
  },
  add: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newPoi = new Poi({
        name: data.name,
        description: data.description,
        contributor: user._id,
      });
      await newPoi.save();
      return h.redirect("/report");
    },
  },
};

module.exports = Pois;
