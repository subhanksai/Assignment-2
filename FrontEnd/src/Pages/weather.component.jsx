import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

const WeatherGraph = () => {
  const [city, setCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const date = new Date().toISOString().split("T")[0];

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Make API call to fetch weather summary data
      const response = await axios.get(`http://localhost:8080/graph`, {
        params: { city, date },
      });
      const weatherData = response.data;
      console.log("Graph", weatherData);

      // Process the data to get the last 5 temperature readings spaced 1 hour apart
      const lastFiveReadings = [];
      let lastReadingTime = null;

      for (let i = weatherData.length - 1; i >= 0; i--) {
        const currentReading = weatherData[i];
        const currentTime = new Date(currentReading.time);

        if (
          !lastReadingTime ||
          lastReadingTime - currentTime >= 60 * 60 * 1000
        ) {
          // Push the reading if it's the first or spaced by 1 hour
          lastFiveReadings.push({
            time: currentReading.time,
            temperature: currentReading.temperature,
          });
          lastReadingTime = currentTime; // Update the last reading time

          // Stop after collecting 5 readings
          if (lastFiveReadings.length === 5) break;
        }
      }

      console.log(
        "Filtered last 5 readings with 1-hour difference",
        lastFiveReadings
      );

      // Update state with the processed data
      setWeatherData(lastFiveReadings.reverse()); // Reverse to maintain chronological order
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city, date]); // Add 'date' if needed

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        marginTop: "10px",
      }}
    >
      {/* Dropdown for city selection */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="Delhi">Delhi</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Chennai">Chennai</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Kolkata">Kolkata</option>
        <option value="Hyderabad">Hyderabad</option>
        {/* Add more city options as needed */}
      </select>

      {/* Display loading state or error message */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <LineChart
          width={600}
          height={300}
          data={weatherData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#333" }} />
          <YAxis tick={{ fontSize: 12, fill: "#333" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: 12,
              color: "#666",
            }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={{ stroke: "#8884d8", strokeWidth: 2 }}
          >
            <LabelList dataKey="temperature" position="top" />
          </Line>
        </LineChart>
      )}
    </div>
  );
};

export default WeatherGraph;
