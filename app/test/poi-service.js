"use strict";

const axios = require("axios");

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      //console.log("in createUser, e is: " + e);
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCategory(newCategory) {
    try {
      const response = await axios.post(this.baseUrl + "/api/categories", newCategory);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllCategories() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/categories");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneCategory(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/categories/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async addPoi(id, poi) {
    try {
      const response = await axios.post(this.baseUrl + "/api/categories/" + id + "/pois", poi);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getPois(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories/" + id + "/pois");
      return response.data;
    } catch (e) {
      //console.log("in getPois, e is: " + e);
      return null;
    }
  }

  async getAllPois() {
    try {
      const response = await axios.get(this.baseUrl + "/api/pois");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllPois() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/pois");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users/authenticate", user);
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common["Authorization"] = "";
  }

  async addReview(id, review) {
    try {
      const response = await axios.post(this.baseUrl + "/api/reviews/" + id + "/pois", review);
      return response.data;
    } catch (e) {
      //console.log("in addReview e: " + e);
      return null;
    }
  }

  async getReviewsPoi(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/reviews/" + id + "/pois");
      console.log(response.data);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllReviews() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/reviews");
      return response.data;
    } catch (e) {
      //console.log("in deleteAllReviews, e is: " + e);
      return null;
    }
  }

  async deleteOneReview(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/reviews/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  async getReview(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/reviews/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getAllReviews() {
    try {
      const response = await axios.get(this.baseUrl + "/api/reviews");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async updateUser(id, userDetails) {
    try {
      const response = await axios.put(this.baseUrl + "/api/users/" + id, userDetails);
      return response.data;
    } catch (e) {
      //console.log("in update user, e is: " + e);
      return null;
    }
  }

  async updatePoi(id, poiDetails) {
    try {
      const response = await axios.put(this.baseUrl + "/api/pois/" + id, poiDetails);
      return response.data;
    } catch (e) {
      //console.log("in update poi, e is: " + e);
      return null;
    }
  }
  async getOnePoi(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/pois/" + id);
      return response.data;
    } catch (e) {
      //console.log("in get One Pois, e is: " + e);
      return null;
    }
  }

  async deleteOnePoi(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/pois/" + id);
      return response.data;
    } catch (e) {
      //console.log("in delete One Pois, e is: " + e);
      return null;
    }
  }
}

module.exports = PoiService;
