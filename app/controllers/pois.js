"use strict";

const Poi = require("../models/poi");
const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

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
      try {
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
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  show: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const poi = await Poi.findById(request.params.id).lean();
        //const user = await User.findById(id).lean();
        return h.view("poi", { title: "Make Changes Again", poi: poi }); //, user: user });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  updateOld: {
    handler: async function (request, h) {
      try {
        const poiUpdate = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id); //.lean();
        const poi = await Poi.findById(request.params.id); //.lean();
        poi.name = poiUpdate.name;
        poi.description = poiUpdate.description;
        poi.contributor = user._id;
        await poi.save();
        return h.view("poi", { title: "Make Changes Again", poi: poi }); //, user: user });
      } catch (err) {
        return h.view("poi", { errors: [{ message: err.message }] });
      }
    },
  },
  update: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        //contributor: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("poi", {
            title: "error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const poiEdit = request.payload;
        //const id = request.auth.credentials.id;
        //const user = await User.findById(id);
        //const id = request.params.id;
        const poi = await Poi.findByIdAndUpdate(request.params.id, {
          name: poiEdit.name,
          description: poiEdit.description,
        });
        //poi.name = poiEdit.name;
        //poi.name = poiEdit.name;
        //await poi.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  delete: {
    handler: async function (request, h) {
      try {
        //const removePoi =
        await Poi.findByIdAndDelete(request.params.id); //is used to find a matching document, removes it, and passing the found document (if any) to the callback. https://www.geeksforgeeks.org/mongoose-findbyidanddelete-function/ 13Mar21
        //await Poi.findByIdAndDelete()
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
};

module.exports = Pois;
