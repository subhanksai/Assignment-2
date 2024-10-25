import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";

function AlertPage() {
  const [formData, setFormData] = useState({
    email: "",
    city: "",
    weather: "",
    temperature: "",
    temperature_condition: "",
    check: false,
  });

  const [storedData, setStoredData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const username = "__subhank__"; // Replace with your GeoNames username

  // Load stored data from localStorage on component mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    setStoredData(data);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Fetch city suggestions
    if (name === "city") {
      fetchCitySuggestions(value);
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://api.geonames.org/searchJSON?q=${query}&maxRows=10&username=${username}`
      );
      setSuggestions(response.data.geonames);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = [...storedData, formData];
    setStoredData(updatedData);
    localStorage.setItem("formData", JSON.stringify(updatedData));

    // Clear the form after submission
    setFormData({
      email: "",
      city: "",
      weather: "",
      temperature: "",
      temperature_condition: "",
      check: false,
    });
    setSuggestions([]); // Clear suggestions after submission
  };

  const handleDelete = (index) => {
    const updatedData = storedData.filter((_, i) => i !== index);
    setStoredData(updatedData);
    localStorage.setItem("formData", JSON.stringify(updatedData));
  };

  const handleSuggestionClick = (cityName) => {
    setFormData({ ...formData, city: cityName });
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="card p-4">
      <h1 className="mb-4">Weather Alert Form</h1>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 position-relative">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          {suggestions.length > 0 && (
            <ul
              className="list-group position-absolute suggestions"
              style={{ zIndex: 1000 }}
            >
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.geonameId}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  {suggestion.name}, {suggestion.countryCode}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="inputWeather" className="form-label">
            Alert if
          </label>
          <input
            type="text"
            className="form-control"
            id="inputWeather"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            placeholder="ex: haze, clouds, thunderstorm, rain"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="inputTemperature" className="form-label">
            Temperature
          </label>
          <input
            type="number"
            className="form-control"
            id="inputTemperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="inputCondition" className="form-label">
            Condition
          </label>
          <select
            id="inputCondition"
            className="form-select"
            name="temperature_condition"
            value={formData.temperature_condition}
            onChange={handleChange}
          >
            <option value="">Select Condition</option>
            <option value="None">None</option>
            <option value="increase">Increases than</option>
            <option value="decrease">Decreases than</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Alert
          </button>
        </div>
      </form>

      {/* Display stored data */}
      <div className="mt-4">
        <h2>Stored Alerts:</h2>
        {storedData.length === 0 ? (
          <p>No alerts found in localStorage.</p>
        ) : (
          <ul className="list-group">
            {storedData.map((data, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>Email:</strong> {data.email}, <strong>City:</strong>{" "}
                  {data.city}, <strong>Alert if:</strong> {data.weather},{" "}
                  <strong>Temperature:</strong> {data.temperature},{" "}
                  <strong>Condition:</strong> {data.temperature_condition}
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
        )}
      </div>
    </div>
  );
}

export default AlertPage;
