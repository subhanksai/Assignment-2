const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const FormSchema = require("./Sign&Login/Mongo/SignUpschema");
// Adjust the path as needed

const weatherDataSchema = require("./Sign&Login/Mongo/weather.Schema");
const axios = require("axios");
require("./weatherData");

const CurrentsAPI = require("currentsapi");

const currentsapi = new CurrentsAPI(
  "KtEuP4fqwuRXCgsoS3dacYex2nqO02SZNsYx7WOylBA5-4uZ"
);

const server = express(); // Initialize the server

// Enable CORS for all requests
server.use(cors());
server.use(express.json()); // Middleware to parse JSON body

const uri =
  "mongodb+srv://admin:admin@backend.3fn3q.mongodb.net/WeatherApp?retryWrites=true&w=majority&appName=BackEnd";

// Connect to MongoDB using Mongoose
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

function convertUnixToDateTimeIST(unixTime) {
  // Create a new Date object from the Unix timestamp (in milliseconds)
  const dateObject = new Date(unixTime * 1000);

  // IST offset (5 hours 30 minutes ahead of UTC)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

  // Adjust the dateObject to IST by adding the IST offset
  const istDateObject = new Date(dateObject.getTime() + istOffset);

  // Extract the date part
  const date = istDateObject.toISOString().split("T")[0]; // YYYY-MM-DD format

  // Extract the time part (without the milliseconds and Z)
  const time = istDateObject.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS format

  return { date, time };
}
async function saveWeatherDataToDB(weather) {
  if (!weather) {
    console.error("No weather data provided.");
    return;
  }

  const { date, time } = convertUnixToDateTimeIST(weather.dt);
  console.log(
    `Checking if weather data for city ${weather.name} and time ${time} already exists...`
  );

  try {
    // Check if weather data for the same city and Unix timestamp already exists
    const existingEntry = await weatherDataSchema.findOne({
      city: weather.name,
      time: time,
    });

    console.log("Existing entry found:", existingEntry); // Debugging log

    if (existingEntry) {
      console.log(
        `Weather data already exists for city: ${weather.name} on Time: ${time}. Skipping save.`
      );
      return;
    }

    console.log(
      `No existing entry found for city: ${weather.name} on Date: ${time}. Saving new data...`
    );

    // Create a new weather data entry if no duplicates are found
    const newWeatherData = new weatherDataSchema({
      city: weather.name,
      mainWeather: weather.weather[0]?.main,
      temperature: weather.main?.temp,
      date: date, // Corrected to lowercase 'date' for consistency
      time: time,
    });

    // Save the new document to MongoDB
    await newWeatherData.save();
    console.log("Weather data saved to MongoDB:", newWeatherData);
  } catch (error) {
    console.error("Error saving weather data to MongoDB:", error.message);
    // Log specific error details for debugging
    if (error.name === "ValidationError") {
      console.error("Validation Error:", error.errors);
    } else {
      console.error("Database Error:", error);
    }
  }
}

server.get("/summary", async (req, res) => {
  const { date } = req.query; // Get the date from the query parameters
  console.log("Here");

  try {
    const query = date ? { date: date } : {}; // If date is provided, filter by it
    const weatherData = await weatherDataSchema.find(query); // Fetch all records
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Error fetching weather data." });
  }
});

server.get("/graph", async (req, res) => {
  const { city, date } = req.query; // Get the city and date from the query parameters
  console.log("Here");

  try {
    // Build query object based on provided query parameters
    const query = {};
    if (city) query.city = city;
    if (date) query.date = date;

    // Fetch weather data based on the query
    const weatherData = await weatherDataSchema.find(query); // Fetch records based on city and/or date
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Error fetching weather data." });
  }
});

/* ---------------------------------------------------------------------------------------------------------*/
const newsapiapiKey = "35cc0ff31b1d47ea94a33af6e1afd540"; // Your API key
server.post("/getArticle", async (req, res) => {
  const now = new Date();

  // Format the current date
  const toDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD format

  now.setHours(now.getHours() - 24); // Subtract 24 hours
  const fromDate = now.toISOString().split("T")[0]; // Date from 24 hours ago in YYYY-MM-DD format

  const URL = `https://newsapi.org/v2/everything?q=weather&from=${fromDate}&to=${toDate}&sortBy=popularity&language=en&apiKey=${newsapiapiKey}`;

  try {
    const response = await axios.get(URL);
    console.log("Article data fetched successfully");
    res.status(200).json(response.data.articles); // Return the articles directly
  } catch (error) {
    console.error("Error fetching article data:", error.message);
    res.status(500).json({ error: "Error fetching article data" });
  }
});

/* ---------------------------------------------------------------------------------------------------------*/
const weatherapikey = "d3765294bb933a82d9c6fa89f2f9cfbf";

server.post("/", async (req, res) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=london&appid=${weatherapikey}&units=metric`;
  console.log(`Making request to: ${URL}`);

  try {
    const response = await axios.get(URL);
    console.log("Weather data fetched successfully");

    // Call the function to save the data into MongoDB

    // Send the weather data back as a response
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// Endpoint to fetch weather data
server.get("/weather", async (req, res) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=london&appid=${weatherapikey}&units=metric`;
  console.log(`Making request to: ${URL}`);

  try {
    const response = await axios.get(URL);
    console.log("Weather data fetched successfully");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

server.post("/getCity", async (req, res) => {
  const { cityName } = req.body;
  console.log(cityName);

  // Log received city name
  console.log(`Received city name: ${cityName}`);

  // Check if cityName was provided in the request
  if (!cityName) {
    return res.status(400).json({ error: "City name is required" });
  }

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherapikey}&units=metric`;

  // Log the URL being requested
  console.log(`Making request to: ${URL}`);
  const count = 0;
  try {
    const response = await axios.get(URL);

    // Handle the case where no data is returned (invalid city, for example)
    if (!response.data || response.data.cod === "404") {
      console.error(`City not found: ${cityName}`);
      return res.status(404).json({ error: "City not found" });
    }

    // Log success and return weather data
    console.log("Weather data fetched successfully");
    res.status(200).json(response.data);

    await saveWeatherDataToDB(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);

    // Return a more descriptive error message
    res
      .status(500)
      .json({ error: `Error fetching weather data: ${error.message}` });
  }
});

server.listen(8080, () => {
  console.log("Server listening at 8080");
});

module.exports = { saveWeatherDataToDB };