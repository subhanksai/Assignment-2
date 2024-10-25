// src/MapComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const MapComponent = ({ city }) => {
  const [coordinates, setCoordinates] = useState(null);
  const username = "__subhank__"; // Replace with your GeoNames username

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (city) {
        try {
          const response = await axios.get(
            `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`
          );
          const { lat, lng } = response.data.geonames[0];
          setCoordinates({ lat, lng });
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      }
    };

    fetchCoordinates();
  }, [city, username]);

  return (
    <div>
      {coordinates ? (
        <div>
          <h3>Coordinates for {city}:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      ) : (
        <p>Loading coordinates...</p>
      )}
    </div>
  );
};

export default MapComponent;
