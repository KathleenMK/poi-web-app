"use strict";

const Poi = require("../models/poi");
const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const cloudinary = require("cloudinary");
const ImageStore = require("../utils/image-store");
const Category = require("../models/category");
const Weather = require("../utils/weather");

const Pois = {
  //form to add a POI
  home: {
    handler: async function (request, h) {
      const categories = await Category.find().lean();
      return h.view("home", { title: "Add something", categories: categories });
    },
  },

  //shows a table of POIs
  report: {
    handler: async function (request, h) {
      const pois = await Poi.find().populate("contributor").lean();
      const categories = await Category.find().lean();
      const countUsers = await User.find().countDocuments();
      const countPois = await Poi.find().countDocuments();
      const countCategories = await Category.find().countDocuments();
      return h.view("report", {
        title: "So far...",
        pois: pois,
        categories: categories,
        countUsers: countUsers,
        countPois: countPois,
        countCategories: countCategories,
      });
    },
  },

  // Filters the report by category
  reportFilter: {
    handler: async function (request, h) {
      const pois = await Poi.find({ category: request.params.id }).populate("contributor").lean();
      const categories = await Category.find().lean();
      const countUsers = await User.find().countDocuments();
      const countPois = await Poi.find().countDocuments();
      const countCategories = await Category.find().countDocuments();
      return h.view("report", {
        title: "So far...",
        pois: pois,
        categories: categories,
        countUsers: countUsers,
        countPois: countPois,
        countCategories: countCategories,
      });
    },
  },

  // Users can add POIs, Joi validates entries
  add: {
    validate: {
      payload: {
        name: Joi.string().required(),
        descshort: Joi.string().required(),
        description: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        category: Joi.required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("home", {
            title: "error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const category = await Category.findById(data.category);
        console.log(data);
        const newPoi = new Poi({
          name: data.name,
          descshort: data.descshort,
          description: data.description,
          category: data.category,
          contributor: user._id,
          latitude: data.latitude,
          longitude: data.longitude,
        });
        await newPoi.save();
        const poi = await Poi.findById(newPoi.id).lean();
        const poiid = newPoi.id;
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

  // Displays the form for adding a category
  categoryForm: {
    handler: function (request, h) {
      return h.view("category", { title: "Add something" });
    },
  },

  // Users can add a category
  categoryAdd: {
    handler: async function (request, h) {
      try {
        const data = request.payload;
        const newCategory = new Category({
          name: data.name,
          description: data.description,
        });
        await newCategory.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

  // admin user can delete a category
  categoryDelete: {
    handler: async function (request, h) {
      try {
        await Category.findByIdAndDelete(request.params.id); //is used to find a matching document, removes it, and passing the found document (if any) to the callback. https://www.geeksforgeeks.org/mongoose-findbyidanddelete-function/ 13Mar21
        return h.redirect("/admin");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

  // Shows the POI details, includes the current weather request using lat and long of the POI
  // includes variables for the specific POIs category and contributor so corresponding details could be displayed
  // unclear whether handlebars dot notation could work for an object within an object, where poi also needed to
  // be included to distinguish from the categories being included also
  show: {
    handler: async function (request, h) {
      try {
        const poi = await Poi.findById(request.params.id).populate("category").populate("user").lean();
        const latitude = poi.latitude;
        const longitude = poi.longitude;
        const contributor = poi.contributor;
        const category = poi.category;
        const categories = await Category.find().lean();
        const readWeather = await Weather.readWeather(latitude, longitude);
        console.log(readWeather);
        const weather = {
          temperature: Math.round(readWeather.main.temp - 273.15),
          feelsLike: Math.round(readWeather.main.feels_like - 273.15),
          clouds: readWeather.weather[0].description,
          windSpeed: readWeather.wind.speed,
          windDirection: readWeather.wind.deg,
          visibility: readWeather.visibility / 1000,
          humidity: readWeather.main.humidity,
        };
        return h.view("poi", {
          title: "Make Changes Again",
          poi: poi,
          categories: categories,
          weather: weather,
          category: category,
          contributor: contributor,
        });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },

  //updates an existing POI, JOI validates the entries
  update: {
    validate: {
      payload: {
        name: Joi.string().required(),
        descshort: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
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
        const category = await Category.findById(poiEdit.category);
        const poi = await Poi.findByIdAndUpdate(request.params.id, {
          name: poiEdit.name,
          descshort: poiEdit.descshort,
          description: poiEdit.description,
          category: poiEdit.category,
          latitude: poiEdit.latitude,
          longitude: poiEdit.longitude,
        });
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

  // deletes a POI
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

  // uploadFile uses the image-store util to upload to cloudinary,
  // the POI is updated with the resultant image url and public id
  uploadFile: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const answer = await ImageStore.uploadImage(request.payload.imagefile); //https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/return-a-value-from-a-function-with-return 14Mar21
          console.log(answer.secure_url); //secure_url is what's required
          console.log(answer.public_id);
          const poi = await Poi.findByIdAndUpdate(request.params.id, {
            imageurl: answer.secure_url,
            imagepublicid: answer.public_id,
          });
          return h.redirect("/report");
        }
        return h.redirect("/report");
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

  // Delete an image NOT IMPLEMENTED
  deleteImage: {
    handler: async function (request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        return h.redirect("/");
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = Pois;
