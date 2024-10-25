const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  mainWeather: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    unique: true,
  },
});
const WeatherData = mongoose.model(
  "WeatherData",
  weatherDataSchema,
  "WeatherData"
); // Collection name here

module.exports = WeatherData;
