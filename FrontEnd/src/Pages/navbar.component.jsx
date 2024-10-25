import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    if (location) {
      console.log("Searching for location:", location);
      navigate("/detailed", { state: { cityName: location } });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && location) {
      handleSearch();
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value) {
      try {
        const response = await axios.get(`http://api.geonames.org/searchJSON`, {
          params: {
            q: value,
            maxRows: 10,
            username: "__subhank__", // Replace with your actual GeoNames username
          },
        });
        const filteredSuggestions = response.data.geonames.map(
          (city) => city.name
        );
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setSuggestions([]);
    navigate("/detailed", { state: { cityName: suggestion } });
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">WeatherApp</Link>
      </div>

      <div className="search">
        <div className="searchbar">
          <input
            id="bar"
            type="text"
            placeholder="Enter Location or Area"
            value={location}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          <div
            className="searchbutton"
            onClick={location ? handleSearch : null}
            style={{
              cursor: location ? "pointer" : "not-allowed",
              opacity: location ? 1 : 0.5,
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
          </div>
        </div>
      </div>

      <div className="nav-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={isOpen ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/alert" onClick={() => setIsOpen(false)}>
            Alerts
          </Link>
        </li>
        <li>
          <Link to="/articles" onClick={() => setIsOpen(false)}>
            Articles
          </Link>
        </li>
        <li>
          <Link to="/summary" onClick={() => setIsOpen(false)}>
            Summary
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
