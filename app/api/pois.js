"use strict";

const Poi = require("../models/poi");
const Category = require("../models/category");
const Boom = require("@hapi/boom");
const utils = require("./utils.js");

const Pois = {
  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const pois = await Poi.find().populate("contributor").populate("category");
      return pois;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const poi = await Poi.findOne({ _id: request.params.id }).populate("contributor").populate("category"); //find().populate("contributor").populate("category");
      return poi;
    },
  },

  findByCategory: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const pois = await Poi.find({ category: request.params.id });
      return pois;
    },
  },
  addPoi: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userId = utils.getUserIdFromRequest(request);
      let poi = new Poi(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category) {
        return Boom.notFound("No Category found with this id");
      }
      poi.category = category._id;
      poi.contributor = userId;
      poi = await poi.save();
      return poi;
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const poiEdit = request.payload;
      const poi = await Poi.findById(poiEdit._id);
      poi.name = poiEdit.name;
      poi.descshort = poiEdit.descshort;
      poi.description = poiEdit.description;
      poi.latitude = poiEdit.latitude;
      poi.longitude = poiEdit.longitude;
      poi.category = poiEdit.category;
      await poi.save();
      if (poi) {
        return { success: true };
      }
      return Boom.notFound("poi id not found");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Poi.deleteMany({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: false,
    //{
    //  strategy: "jwt",
    //},
    handler: async function (request, h) {
      const poi = await Poi.deleteOne({ _id: request.params.id });
      if (poi) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },
};

module.exports = Pois;
