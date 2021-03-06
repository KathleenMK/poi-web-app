"use strict";

const User = require("../models/user");
const AdminUser = require("../models/adminuser");
const Boom = require("@hapi/boom");
const utils = require("./utils.js");
const bcrypt = require("bcrypt"); //added for password security
const saltRounds = 13;

const Users = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      console.log("in findOne handler users.js");
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this id");
      }
    },
  },
  /*
  const hash = await bcrypt.hash(payload.password, saltRounds); // Added to hash and salt the password that has been input
  const newUser = new User({
    firstName: sanitizeHtml(payload.firstName),
    lastName: sanitizeHtml(payload.lastName),
    email: payload.email,
    password: hash, //hash as calculated above
  });
  */

  create: {
    auth: false,
    handler: async function (request, h) {
      let usercheck = await User.findByEmail(request.payload.email);
      let adminUsercheck = await AdminUser.findByEmail(request.payload.email);
      if (usercheck || adminUsercheck) {
        const message = "Email address is already registered";
        throw Boom.badData(message);
      }
      const hash = await bcrypt.hash(request.payload.password, saltRounds); // Added to hash and salt the password that has been input
      const newUser = new User({
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: hash, //hash as calculated above
      });
      const user = await newUser.save();
      if (user) {
        const token = utils.createToken(user);
        console.log(user);
        console.log(token);
        return h
          .response({
            success: true,
            token: token,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            email: user.email,
          })
          .code(201);
        //return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating user");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await User.deleteMany({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userEdit = request.payload;
      const user = await User.findById(userEdit._id);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      if (user.password !== userEdit.password) {
        //only if the user password has been changed should it be hashed, otherwise hashing an already hashed value
        const hash = await bcrypt.hash(userEdit.password, saltRounds); // Added to hash and salt the password that has been input
        user.password = hash;
      }
      await user.save();
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        console.log("in authenticate users.js");
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (!(await user.comparePassword(request.payload.password))) {
          return Boom.unauthorized("Invalid password");
        } else {
          const token = utils.createToken(user);
          return h
            .response({
              success: true,
              token: token,
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              password: user.password,
            })
            .code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  /*authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (!user.comparePassword(request.payload.password)) {
          return Boom.unauthorized("Invalid password");
        } else {
          return user;
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  }, */
};

module.exports = Users;
