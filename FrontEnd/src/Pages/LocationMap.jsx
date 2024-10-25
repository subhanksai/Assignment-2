// LocationMap.js
import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const center = { lat: 20.5937, lng: 78.9629 }; // Center of India

const LocationMap = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your Google Maps API key
    libraries: ["places"],
  });

  const onLoad = (map) => {
    setMap(map);
  };

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      setSuggestions(data.predictions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    onLocationSelect(suggestion.description); // Pass the selected suggestion
    setSuggestions([]); // Clear suggestions after selection
  };

  return isLoaded ? (
    <div style={{ position: "relative", height: "300px" }}>
      <input
        type="text"
        placeholder="Search for a location..."
        value={inputValue}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {suggestions.length > 0 && (
        <div
          style={{
            border: "1px solid #ccc",
            position: "absolute",
            zIndex: 1,
            width: "100%",
          }}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#fff",
              }}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
      <GoogleMap
        onLoad={onLoad}
        center={center}
        zoom={5}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {/* You can add additional markers or components here */}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default LocationMap;
