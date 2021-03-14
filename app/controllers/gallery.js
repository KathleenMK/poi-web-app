"use strict";

const ImageStore = require("../utils/image-store");
const Poi = require("../models/poi");

const Gallery = {
  index: {
    handler: async function (request, h) {
      try {
        const allImages = await ImageStore.getAllImages();
        return h.view("gallery", {
          title: "Cloudinary Gallery",
          images: allImages,
        });
      } catch (err) {
        console.log(err);
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

module.exports = Gallery;
