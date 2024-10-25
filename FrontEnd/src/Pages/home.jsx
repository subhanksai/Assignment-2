import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap"; // Import Dropdown
import "../css/home.css"; // Make sure this file exists and is correctly linked
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import { useNavigate } from "react-router-dom";
import DetailedPage from "./detailed";

import { useState, useEffect } from "react";
import axios from "axios";
import WeatherGraph from "./weather.component";
import Alertprocessing from "./alertprocessing";
import ArticlePage from "./articlePage";

function Home(props) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const [article, SetArticlesData] = useState([]);
  const [tempUnit, setTempUnit] = useState("C");
  const [weatherData, setWeatherData] = useState([]);
  const [temperatureHistory, setTemperatureHistory] = useState({});
  const [sample, setsampleData] = useState([]);

  // const handleSearch = () => {
  //   handleCityClick(location); // Log the current input value
  //   setLocation(""); // Reset the input field
  // };

  const handleCityClick = (cityName) => {
    navigate("/detailed", { state: { cityName } });
  };
  const handleArticleClick = (article) => {
    navigate("/articles", { state: { article } });
  };
  function convertUnixToISTHours(unixTime) {
    // Create a Date object from the Unix time
    const date = new Date(unixTime * 1000); // Multiply by 1000 to convert seconds to milliseconds

    // Calculate IST hours
    const istHours = (date.getUTCHours() + 5) % 24; // Add 5 hours for IST
    const istMinutes = (date.getUTCMinutes() + 30) % 60; // Add 30 minutes for IST

    // Adjust the hours if minutes overflow
    const finalHours =
      (istHours + Math.floor((date.getUTCMinutes() + 30) / 60)) % 24;

    return {
      hours: finalHours,
      minutes: istMinutes,
    };
  }
  const ArticleComponent = ({ article }) => {
    const navigate = useNavigate();

    // Automatically navigate to the article page when the article data is available
    useEffect(() => {
      if (article) {
        navigate("/articles", { state: { article } });
      }
    }, [article, navigate]); // Dependency array includes 'article' to trigger on change
  };
  ArticleComponent(article);
  const DataFetch = () => {
    // State to store weather data for each city

    // List of cities
    const cities = [
      "Delhi",
      "Mumbai",
      "Chennai",
      "Bangalore",
      "Kolkata",
      "Hyderabad",
    ];

    useEffect(() => {
      const apiKey = "d3765294bb933a82d9c6fa89f2f9cfbf";

      const fetchData = async () => {
        try {
          const fetchedData = await Promise.all(
            cities.map(async (cityName) => {
              // Fetching data from your local server
              const localResponse = await axios.post(
                "http://localhost:8080/getCity",
                { cityName }
              );

              // Ensure the response from the local server is valid
              if (!localResponse || !localResponse.data) {
                console.error(
                  `No data returned for ${cityName} from local server`
                );
                return null; // Skip this city if no data is found
              }

              const data = localResponse.data; // Assuming you want to do something with this
              // console.log("Local Data:", data);

              // Extract temperature, main weather, and icon
              const cityData = {
                city: data?.name,
                temperature: data?.main.temp,
                weather: data?.weather[0].main,
                icon: `https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`,
                time: convertUnixToISTHours(data?.dt), // Unix timestamp from API
              };

              // Update temperature history
              setTemperatureHistory((prevHistory) => {
                const newHistory = { ...prevHistory };

                if (!newHistory[cityName]) {
                  newHistory[cityName] = []; // Initialize array if it doesn't exist
                }

                // If there are already 5 entries, pop the first one
                if (newHistory[cityName].length === 5) {
                  newHistory[cityName].shift(); // Remove the oldest entry
                }

                // Add the new temperature record at the end
                newHistory[cityName].push({
                  temperature: cityData.temperature,
                  time: cityData.time,
                });

                return newHistory;
              });

              return cityData; // Return the city data
            })
          );

          setWeatherData(fetchedData); // Save all fetched data
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchData(); // Initial fetch
      const intervalId = setInterval(fetchData, 300000); // Set interval for every 5 minutes (300,000 ms)

      return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);
  };
  DataFetch();

  function ArticleDataFetch() {
    // State to hold the article data

    // useEffect to fetch data when the component mounts
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await axios.post("http://localhost:8080/getArticle");

          result.data.forEach((article) => {
            SetArticlesData((prevArticles) => [...prevArticles, article]);
          });
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 10800000);

      return () => clearInterval(intervalId);
    }, []);
  }

  const toggleTempUnit = () => {
    setTempUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  const getTemperature = (temperatureInC) => {
    return tempUnit === "C" ? temperatureInC : (temperatureInC * 9) / 5 + 32; // Convert to Fahrenheit
  };

  ArticleDataFetch();

  return (
    <div className="container">
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "white", // Color for city name
          textAlign: "center", // Center the text horizontally
        }}
      ></h1>
      {/* Main Section */}
      <div className="main-section">
        <div
          className="title"
          style={{
            width: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Use space-between for better distribution
          }}
        >
          <h1 style={{ marginBottom: "40px" }}>India Weather Conditions</h1>
          {/* Toggle Button */}
          <div
            className="toggle-container"
            style={{ position: "relative", right: "100px", bottom: "16px" }}
          >
            <label className="switch">
              <input
                type="checkbox"
                checked={tempUnit === "F"}
                onChange={toggleTempUnit}
              />
              <span className="slider"></span>
            </label>
            <span
              className="unit-label"
              style={{ minWidth: "100px", marginLeft: "10px" }}
            >
              Switch to {tempUnit === "C" ? "Fahrenheit" : "Celsius"}
            </span>
          </div>
        </div>

        <div className="row" style={{ width: "1500px" }}>
          <div
            className="col-md-7"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <div className="row">
              {weatherData.slice(0, 6).map((data, index) => (
                <div
                  className="col-6"
                  style={{ marginBottom: "50px" }}
                  key={index}
                >
                  <div
                    onClick={() => handleCityClick(data?.city)}
                    role="button"
                    tabIndex="0"
                  >
                    <div>
                      <div
                        className="row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="col">
                          <div className="weather-text cont">
                            <h3>{data?.city}</h3>
                          </div>
                        </div>
                        <div className="col">
                          <div className="weather-temperature cont">
                            <h3>
                              {getTemperature(data?.temperature)?.toFixed(1)}°
                              {tempUnit}
                            </h3>
                            <h5>{data?.weather}</h5>
                          </div>
                        </div>
                        <div className="col">
                          <img
                            className="weather-temperature cont"
                            src={data?.icon}
                            alt="Weather Icon"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            {/* Right Rail - Adjusted Width */}
            <div className="col-md- right-rail">
              {" "}
              {/* Adjusted to 4 out of 12 columns */}
              <h2>Top Stories Around World</h2>
              <div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="right-rail-article">
                    <a
                      href={article[i]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="article-link"
                    >
                      <div className="article-arrange">
                        <h5>{article[i]?.title}</h5>
                        <p>{article[i]?.author}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="right-rail-ga" role="button" tabIndex="0">
                <a href="/articles">
                  <p>Additional content or advertisements can go here.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 style={{ textAlign: "center", marginTop: "150px" }}>
            Weather Graph
          </h1>
          <WeatherGraph />
        </div>
      </div>

      <Alertprocessing weatherData={weatherData}></Alertprocessing>
    </div>
  );
}

export default Home;
