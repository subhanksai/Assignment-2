import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/detailed.css";

const SummaryPage = () => {
  const [cityWeatherMap, setCityWeatherMap] = useState({});
  const [cityAvgTempMap, setCityAvgTempMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today

  useEffect(() => {
    if (!selectedDate) return;

    const fetchWeatherData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:8080/summary`, {
          params: { date: selectedDate },
        });
        const weatherData = response.data;

        const cityMap = {};
        const cityTempMap = {};

        weatherData.forEach(({ city, mainWeather, temperature }) => {
          if (!cityMap[city]) {
            cityMap[city] = {};
          }
          cityMap[city][mainWeather] = (cityMap[city][mainWeather] || 0) + 1;

          if (!cityTempMap[city]) {
            cityTempMap[city] = { totalTemp: 0, count: 0 };
          }
          cityTempMap[city].totalTemp += temperature;
          cityTempMap[city].count += 1;
        });

        const dominantWeather = {};
        for (const city in cityMap) {
          dominantWeather[city] = Object.entries(cityMap[city]).reduce(
            (prev, curr) => (curr[1] > prev[1] ? curr : prev),
            ["", 0]
          )[0];
        }

        setCityWeatherMap(dominantWeather);

        const avgTempMap = {};
        for (const city in cityTempMap) {
          avgTempMap[city] = (
            cityTempMap[city].totalTemp / cityTempMap[city].count
          ).toFixed(2);
        }

        setCityAvgTempMap(avgTempMap);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedDate]);

  if (loading)
    return (
      <div className="text-center">
        <div className="spinner"></div>
      </div>
    );
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div
      className="container main-section"
      style={{ width: "900px", height: "700px", marginTop: "200px" }}
    >
      <h1 className="text mb-4">Weather Summary</h1>

      <div className="mb-4">
        <label htmlFor="datePicker" className="form-label">
          Select Date:
        </label>
        <input
          type="date"
          id="datePicker"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-primary">
            <div className="card-header text-white bg-primary">
              <h5 className="mb-0">Dominant Weather Conditions</h5>
            </div>
            <ul className="list-group list-group-flush">
              {Object.entries(cityWeatherMap).map(([city, condition]) => (
                <li key={city} className="list-group-item">
                  {city}: <strong>{condition}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-success">
            <div className="card-header text-white bg-success">
              <h5 className="mb-0">Average Temperatures</h5>
            </div>
            <ul className="list-group list-group-flush">
              {Object.entries(cityAvgTempMap).map(([city, avgTemp]) => (
                <li key={city} className="list-group-item">
                  {city}: <strong>{avgTemp} °C</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
