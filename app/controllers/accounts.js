"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const AdminUser = require("../models/adminuser");
const Poi = require("../models/poi");
const Category = require("../models/category");
const sanitizeHtml = require("sanitize-html");

const Accounts = {
  // main displays the POI images
  index: {
    auth: false,
    handler: async function (request, h) {
      const pois = await Poi.find().populate("contributor").lean();
      return h.view("main", {
        title: "Beaches",
        pois: pois,
      });
    },
  },

  // Sigup form
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Join Us" });
    },
  },

  // Validates the sign up inputs and creates a new user
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string()
          .regex(/^[A-Z][a-z]{1+}$/) //must start with a capital letter, followed by 1 or more lowercase letters
          .required(),
        lastName: Joi.string()
          .regex(/^[A-Z][A-Za-z -']{1+}/) //must start with a capital letter, followed by 1 or more of: letters of either case; spaces, hyphens or apostrophes
          .required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/[A-Z]{1,}/) //password must contain at least 1 upper case letter
          .regex(/[a-z]{1,}/) //password must contain at least 1 lower case letter
          .regex(/[0-9]{1,}/) //password must contain at least 1 digit
          .regex(/[A-Za-z0-9]{7,30}/) //password minimum of 7, max of 30
          .required(),
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
          firstName: sanitizeHtml(payload.firstName),
          lastName: sanitizeHtml(payload.lastName),
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

  // Login form
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login" });
    },
  },

  // Validates login inputs and continues into the app
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

  //logout
  logout: {
    //auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  //admin user dashboard
  admin: {
    handler: async function (request, h) {
      const users = await User.find().lean();
      const categories = await Category.find().lean();
      const countUsers = await User.find().countDocuments();
      const countPois = await Poi.find().countDocuments();
      const countCategories = await Category.find().countDocuments();
      return h.view("admin", {
        title: "Admin",
        users: users,
        categories: categories,
        countUsers: countUsers,
        countPois: countPois,
        countCategories: countCategories,
      });
    },
  },

  // show user setting for update
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

  // validates and updates settings for a user
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string()
          .regex(/^[A-Z][a-z]{1+}$/) //must start with a capital letter, followed by 1 or more lowercase letters
          .required(),
        lastName: Joi.string()
          .regex(/^[A-Z][A-Za-z -']{1+}/) //must start with a capital letter, followed by 1 or more of: letters of either case; spaces, hyphens or apostrophes
          .required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/[A-Z]{1,}/) //password must contain at least 1 upper case letter
          .regex(/[a-z]{1,}/) //password must contain at least 1 lower case letter
          .regex(/[0-9]{1,}/) //password must contain at least 1 digit
          .regex(/[A-Za-z0-9]{7,30}/) //password minimum of 7, max of 30
          .required(),
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
        user.firstName = sanitizeHtml(userEdit.firstName);
        user.lastName = sanitizeHtml(userEdit.lastName);
        user.email = userEdit.email;
        user.password = userEdit.password;
        await user.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

  // admin user can delete a user
  delete: {
    handler: async function (request, h) {
      try {
        await User.findByIdAndDelete(request.params.id); //is used to find a matching document, removes it, and passing the found document (if any) to the callback. https://www.geeksforgeeks.org/mongoose-findbyidanddelete-function/ 13Mar21
        return h.redirect("/admin");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
};

module.exports = Accounts;
