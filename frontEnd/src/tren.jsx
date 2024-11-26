import React, { useState, useEffect } from "react";
import "./latlongbox.css"; 
import axios from "axios";

function Tren() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const fetchTrainData = async () => {
    try {
      const response = await axios.get("http://localhost:1220/api/users");
      setLatitude(response.data.train_position[0]);
      setLongitude(response.data.train_position[1]);
    } catch (error) {
      console.error("Error fetching train data:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchTrainData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="tren-container">
        <h2>Train Position</h2>
        <p>Longitude: {latitude !== null ? latitude : "Loading..."}</p>
        <p>Latitude: {longitude !== null ? longitude : "Loading..."}</p>
      </div>
    </>
  );
}

export default Tren;