"use strict";

const Pois = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add something" });
    },
  },
  report: {
    handler: function (request, h) {
      return h.view("report", {
        title: "So far...",
        pois: this.pois,
      });
    },
  },
  add: {
    handler: function (request, h) {
      let data = request.payload;
      var contributorEmail = request.auth.credentials.id;
      data.contributor = this.users[contributorEmail];
      this.pois.push(data);
      return h.redirect("/report");
    },
  },
};

module.exports = Pois;
