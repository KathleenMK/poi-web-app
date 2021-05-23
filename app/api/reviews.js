"use strict";

const Poi = require("../models/poi");
const Category = require("../models/category");
const Review = require("../models/review");
const Boom = require("@hapi/boom");
const utils = require("./utils.js");
const Weather = require("../utils/weather");

const Reviews = {
  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const reviews = await Review.find().populate("contributor").populate("poi");
      return reviews;
    },
  },

  findByPoi: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const reviews = await Review.find({ poi: request.params.id }).populate("contributor").populate("poi");
      return reviews;
    },
  },

  addReview: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userId = utils.getUserIdFromRequest(request);
      let review = new Review(request.payload);
      const poi = await Poi.findOne({ _id: request.params.id });
      if (!poi) {
        return Boom.notFound("No Poi found with this id");
      }
      review.poi = poi._id;
      review.contributor = userId;
      review = await review.save();
      return review;
    },
  },
};

module.exports = Reviews;
