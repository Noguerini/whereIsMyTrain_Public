import React, { useEffect, useState, useRef } from "react";
import "./Map.css";
import mapboxgl from "mapbox-gl";
import stationsData from "./stations.json";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://127.0.0.1:5225";
const accessToken =
  "pk.eyJ1Ijoibm9ndWVyaW5pIiwiYSI6ImNsdG81dTM2eTA2bTUycXFkd3hqcmhpYjIifQ.vbgP32F3d3qNBrZfBUK-Fw";

function Map() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);

  mapboxgl.accessToken = accessToken;

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/noguerini/cluzx4hix002u01pfbql1411g",
      center: [-3.703790, 40.416775],
      zoom: 5,
    });

    stationsData.stationsData.forEach((station) => {
      new mapboxgl.Marker()
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current);
    });

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("position_update", (data) => {
      const [lat, long] = data.split(",").map(Number);
      setLatitude(lat);
      setLongitude(long);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null && mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      mapRef.current.flyTo({
        center: [longitude, latitude],
        essential: true,
        speed: 1.2,
      });
    }
  }, [latitude, longitude]);

  return <div className="map-container" ref={mapContainerRef} />;
}

export default Map;