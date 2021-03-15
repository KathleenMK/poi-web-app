"use strict";

const cloudinary = require("cloudinary").v2; //addition of .v2 as per https://github.com/cloudinary/cloudinary_npm visited 14Mar21
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function () {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret,
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function () {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    await writeFile("./public/temp.img", imagefile);
    const uploadDetails = await cloudinary.uploader.upload("./public/temp.img");
    return uploadDetails;
  },

  deleteImage: async function (id) {
    await cloudinary.v2.uploader.destroy(id, {});
  },
};

module.exports = ImageStore;
