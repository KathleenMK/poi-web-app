"use strict";

const Adminuser = require("../models/adminuser");
const Boom = require("@hapi/boom");
const utils = require("./utils.js");
const bcrypt = require("bcrypt"); //added for password security
const saltRounds = 13;

const Adminusers = {
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        console.log("in authenticate users.js");
        const adminuser = await Adminuser.findOne({ email: request.payload.email });
        if (!adminuser) {
          return Boom.unauthorized("User not found");
        } else if (!adminuser.comparePassword(request.payload.password)) {
          return Boom.unauthorized("Invalid password");
        } else {
          const token = utils.createToken(adminuser);
          return h
            .response({
              success: true,
              token: token,
              id: adminuser.id,
              firstName: adminuser.firstName,
              lastName: adminuser.lastName,
              password: adminuser.password,
            })
            .code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure - admin");
      }
    },
  },
};

module.exports = Adminusers;
