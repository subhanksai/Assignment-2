import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Alertprocessing({ weatherData }) {
  const [storedData, setStoredData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [shownAlerts, setShownAlerts] = useState([]); // Track already shown alerts

  useEffect(() => {
    // Retrieve stored data from local storage
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    setStoredData(data);
  }, []);

  useEffect(() => {
    // Check for alerts whenever weatherData or storedData changes
    alertManager();
  }, [weatherData, storedData]);

  function alertManager() {
    const weatherCities = weatherData.map((item) => item.city?.toLowerCase());

    const newAlerts = storedData.filter((data) => {
      const { city, weather, temperature, temperature_condition } = data;

      const isCityMatch = weatherCities.includes(city?.toLowerCase());

      // Weather check: If weather is provided and matches current data
      const weatherMatch =
        weather &&
        weatherCities.some((weatherCity) => {
          const weatherDataItem = weatherData.find(
            (item) => item.city?.toLowerCase() === weatherCity
          );
          return (
            weatherDataItem &&
            weatherDataItem.weather?.toLowerCase() === weather?.toLowerCase()
          );
        });

      // Temperature check: If temperature is provided and condition matches
      const temperatureAlert =
        temperature &&
        temperature_condition &&
        weatherCities.some((weatherCity) => {
          const weatherDataItem = weatherData.find(
            (item) => item.city?.toLowerCase() === weatherCity
          );
          return (
            weatherDataItem &&
            ((temperature_condition === ">" &&
              weatherDataItem.temperature >= parseFloat(temperature)) || // Use >= for 'greater than or equal to'
              (temperature_condition === "<" &&
                weatherDataItem.temperature <= parseFloat(temperature))) // Use <= for 'less than or equal to'
          );
        });

      // If both weather and temperature are provided, both should match. If only one is provided, that one must match.
      return (
        isCityMatch &&
        ((weather && temperature && weatherMatch && temperatureAlert) || // Both conditions
          (!weather && temperature && temperatureAlert) || // Only temperature condition
          (weather && !temperature && weatherMatch)) // Only weather condition
      );
    });

    // Ensure unique new alerts (no duplicates)
    const uniqueNewAlerts = newAlerts.filter(
      (alert) =>
        !shownAlerts.find(
          (shownAlert) =>
            shownAlert.city === alert.city &&
            shownAlert.weather === alert.weather &&
            shownAlert.temperature_condition === alert.temperature_condition
        )
    );

    // Update both alerts and shownAlerts state to include new unique alerts
    setAlerts((prevAlerts) => [...prevAlerts, ...uniqueNewAlerts]);
    setShownAlerts((prevShownAlerts) => [
      ...prevShownAlerts,
      ...uniqueNewAlerts,
    ]);

    // Trigger alert for all new unique alerts
    uniqueNewAlerts.forEach((alert) => showAlertOnHomeScreen(alert));
  }
  const handleDelete = (index) => {
    const updatedData = storedData.filter((_, i) => i !== index);
    setStoredData(updatedData);
    localStorage.setItem("formData", JSON.stringify(updatedData));
  };

  function showAlertOnHomeScreen(alert) {
    const weatherDataItem = weatherData.find(
      (item) => item.city.toLowerCase() === alert.city.toLowerCase()
    );
    if (weatherDataItem) {
      let message = `Alert: ${alert.city.toUpperCase()} `;
      if (alert.weather) {
        message += `has ${alert.weather.toUpperCase()}`;
      }
      if (alert.temperature) {
        message += ` with temperature ${
          alert.temperature_condition === ">" ? "above" : "below"
        } ${alert.temperature}°C.`;
      }
      window.alert(message);
    }
  }

  return (
    <div style={{ marginTop: "400px" }}>
      <h1 className="mb-4">Triggers</h1>
      {storedData.length > 0 ? (
        <ul className="list-group">
          {storedData.map((alert, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-start mb-3"
            >
              <div>
                <p className="font-weight-bold mb-1">City: {alert.city}</p>
                {alert.weather && (
                  <p className="text-info mb-1">Weather: {alert.weather}</p>
                )}
                {alert.temperature && (
                  <p className="d-inline mb-0">
                    <span className="font-weight-bold">Temperature:</span>{" "}
                    {alert.temperature}{" "}
                    <span className="text-danger">
                      ({alert.temperature_condition})
                    </span>
                  </p>
                )}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No alerts to display.</p>
      )}
    </div>
  );
}

export default Alertprocessing;
