import React, { useEffect, useState } from 'react';
import './Map.css'; 
import mapboxgl from 'mapbox-gl';
import stationsData from './stations.json';
import axios from "axios";


const accessToken = 'pk.eyJ1Ijoibm9ndWVyaW5pIiwiYSI6ImNsdG81dTM2eTA2bTUycXFkd3hqcmhpYjIifQ.vbgP32F3d3qNBrZfBUK-Fw';


let Map = ({initialCenter }) => {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  let newMap = {}

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    newMap = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/noguerini/cluzx4hix002u01pfbql1411g',
      center: initialCenter || [-3.703790, 40.416775],
      zoom: 5,
    });


    stationsData.stationsData.forEach(station => {
      new mapboxgl.Marker()
        .setLngLat([station.longitude, station.latitude])
        .addTo(newMap);
    });


    return () => newMap.remove();

  }, [initialCenter]);

  let fetchTrainData = async () => {

      const response = await axios.get("http://localhost:1220/api/users");
      setLongitude(response.data.train_position[1]);
      setLatitude(response.data.train_position[0]);

      let el = document.createElement('div');
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.backgroundColor = 'red';
      el.style.borderRadius = '50%'; 
  
      new mapboxgl.Marker({ element: el })
        .setLngLat([latitude, longitude])
        .addTo(newMap);

  };

  useEffect(() => {
    let intervalId = setInterval(fetchTrainData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="map-container" id="map-container" />
  );
};

export default Map;
