"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const AdminUser = require("../models/adminuser");
const Poi = require("../models/poi");
const Category = require("../models/category");

const Accounts = {
  index: {
    auth: false,
    handler: async function (request, h) {
      const pois = await Poi.find().populate("contributor").lean();
      return h.view("main", {
        title: "Beaches",
        pois: pois,
      });
      //return h.view("main", { title: "Beaches" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Join Us" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        let adminUser = await AdminUser.findByEmail(payload.email);
        if (user || adminUser) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/report");
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login" });
    },
  },
  login: {
    auth: false,
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          let adminUser = await AdminUser.findByEmail(email);
          if (!adminUser) {
            const message = "Email address is not registered";
            throw Boom.unauthorized(message);
          }
          adminUser.comparePassword(password);
          request.cookieAuth.set({ id: adminUser.id });
          return h.redirect("/admin");
        }
        user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/report");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  logout: {
    //auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  admin: {
    handler: async function (request, h) {
      const users = await User.find().lean();
      const categories = await Category.find().lean();
      return h.view("admin", { title: "Admin", users: users, categories: categories });
    },
  },
  showSettings: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view("settings", { title: "Donation Settings", user: user });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("settings", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = userEdit.password;
        await user.save();
        return h.redirect("/settings");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  delete: {
    handler: async function (request, h) {
      try {
        //const removePoi =
        await User.findByIdAndDelete(request.params.id); //is used to find a matching document, removes it, and passing the found document (if any) to the callback. https://www.geeksforgeeks.org/mongoose-findbyidanddelete-function/ 13Mar21
        //await Poi.findByIdAndDelete()
        return h.redirect("/admin");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
};

module.exports = Accounts;
