import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../css/detailed.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHigh,
  faTint,
  faWind,
  faCloudSun,
  faClock,
  faThermometerHalf,
} from "@fortawesome/free-solid-svg-icons";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const DetailedPage = () => {
  const location = useLocation();
  const { cityName } = location.state || {};
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (cityName) {
      console.log(cityName);

      axios
        .post("http://localhost:8080/getCity", { cityName })
        .then((result) => {
          setWeatherData(result.data);
        })
        .catch((err) => console.error(err));
    }

    return () => {
      setWeatherData(null);
    };
  }, [cityName]);

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className="detailed-page-container">
      <div className="card">
        <div className="row mt-4 text-center">
          <h1 className="city-name">{weatherData.name}</h1>
          <div className="col">
            <div className="row main">
              <div className="col">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  className="weather-icon"
                  style={{
                    backgroundColor: "rgba(169, 169, 169, 0.484) ",
                    borderRadius: "10px",
                  }}
                  alt={weatherData.weather[0].description}
                />
              </div>
              <div className="col" style={{ textAlign: "center" }}>
                <h2>
                  {capitalizeFirstLetter(weatherData.weather[0].description)}
                </h2>
              </div>
            </div>
          </div>

          <div className="col" style={{ position: "relative", top: "40px" }}>
            <FontAwesomeIcon
              icon={faTemperatureHigh}
              className="weather-icon"
            />
            <h3>{weatherData.main.temp} °C</h3>
            <h5>Temperature</h5>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon icon={faTint} className="weather-icon" />
            <h2>{weatherData.main.humidity}%</h2>
            <h5>Humidity</h5>
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon icon={faWind} className="weather-icon" />
            <h2>{weatherData.wind.speed} m/s</h2>
            <h5>Wind Speed</h5>
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon icon={faCloudSun} className="weather-icon" />
            <h2>{weatherData.main.pressure} hPa</h2>
            <h5>Pressure</h5>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faThermometerHalf}
              className="weather-icon"
            />
            <h2>{weatherData.main.feels_like} °C</h2>
            <h5>Feels Like</h5>
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faThermometerHalf}
              className="weather-icon"
            />
            <h2>{weatherData.main.temp_min} °C</h2>
            <h5>Min Temp</h5>
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faThermometerHalf}
              className="weather-icon"
            />
            <h2>{weatherData.main.temp_max} °C</h2>
            <h5>Max Temp</h5>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col" style={{ textAlign: "center" }}>
            <FontAwesomeIcon icon={faClock} className="weather-icon" />
            <h5>
              {new Date(weatherData.dt * 1000).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </h5>
            <h5>Time</h5>
          </div>
        </div>
      </div>
      <footer>
        <p>Data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
};

export default DetailedPage;
