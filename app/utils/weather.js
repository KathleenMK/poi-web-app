const axios = require("axios");
const apiKey = "1e722a157a2e0a67274af0dc9e5ee19a";

const Weather = {
  readWeather: async function (latitude, longitude) {
    let weather = null;
    const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    try {
      const response = await axios.get(weatherRequest);
      if (response.status == 200) {
        weather = response.data;
      }
    } catch (error) {
      console.log(error);
      //renderError();
    }
    return weather;
  },
};

module.exports = Weather;
