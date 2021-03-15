"use strict";

const Poi = require("../models/poi");
const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const cloudinary = require("cloudinary");
const ImageStore = require("../utils/image-store");

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
          //imageUrl: "https://res.cloudinary.com/dzkcnbv7p/image/upload/v1615736612/vp4hhjb0rzse2wjcs6oa.jpg",
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

  addImage: {
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

  uploadFile: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const answer = await ImageStore.uploadImage(request.payload.imagefile); //https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/return-a-value-from-a-function-with-return 14Mar21
          console.log(answer); //secure_url is what's required
          const poi = await Poi.findByIdAndUpdate(request.params.id, {
            imageUrl: answer.secure_url,
            imagePublicId: answer.public_id,
          });
          return h.redirect("/report");
        }
        return h.view("gallery", {
          title: "Cloudinary Gallery",
          error: "No file selected",
        });
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        return h.redirect("/report");
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = Pois;
