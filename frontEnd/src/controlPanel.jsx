import React, { useState, useEffect } from 'react';
import './Estilos.css'; 
import stationsData from './stations.json';

const ControlPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stationNames, setStationNames] = useState([]);

  useEffect(() => {
    const names = stationsData.stationsData.map(station => station.name);
    setStationNames(names);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isMouseDown) {
        setPosition({
          x: position.x + e.movementX,
          y: position.y + e.movementY 
        });
      }
    };

    function handleMouseUp() {
      setIsMouseDown(false);
    }

    if (isVisible && isMouseDown) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isVisible, isMouseDown, position]);

  function toggleVisibility() {
    setIsVisible(!isVisible);
  }

  function handleMouseDown() {
    setIsMouseDown(true);
  }

  return (
    <>
      <div className="floating-panel" style={{ display: isVisible ? 'block' : 'none', top: position.y, left: position.x }} onMouseDown={handleMouseDown}>
        
        <div className="panel-header">
          ¿Dónde está mi tren?
        </div>

        <div className="panel-body">

          <datalist id="stations">
            {stationNames.map((station, index) => (
            <option key={index} value={station} />
            ))}
          </datalist>

          <div className="input-group">
            <label htmlFor="stationInput"></label>
            <input type="text" id="stationInput" list="stations" placeholder="Selecciona una estación" />
            <button type='button'>↔</button>
            <label htmlFor="station"></label>
            <input type="text" id="station" placeholder="Estación de Llegada" list="stations" />
          </div>

          <div>
            <select className='Selector' placeholder="Hora de salida programada...">
              <option value="05:00">05:00-05:59</option>
              <option value="06:00">06:00-06:59</option>
              <option value="07:00">07:00-07:59</option>
              <option value="08:00">08:00-08:59</option>
              <option value="09:00">09:00-09:59</option>
              <option value="10:00">10:00-10:59</option>
              <option value="11:00">11:00-11:59</option>
              <option value="12:00">12:00-12:59</option>
              <option value="13:00">13:00-13:59</option>
              <option value="14:00">14:00-14:59</option>
              <option value="15:00">15:00-15:59</option>
              <option value="16:00">16:00-16:59</option>
              <option value="17:00">17:00-17:59</option>
              <option value="18:00">18:00-18:59</option>
              <option value="19:00">19:00-19:59</option>
              <option value="20:00">20:00-20:59</option>
              <option value="21:00">21:00-21:59</option>
              <option value="22:00">22:00-22:59</option>
              <option value="23:00">23:00-23:59</option>
            </select>
          </div>

          <div>
            <label className="label-checkbox" for="iryo">Iryo</label>
            <input type="checkbox" id="iryo" name="iryo"></input>
            <label className="label-checkbox" for="AVE">AVE</label>
            <input type="checkbox" id="AVE" name="AVE"></input>
            <label className="label-checkbox" for="OUIGO">OUIGO</label>
            <input type="checkbox" id="OUIGO" name="OUIGO"></input>
          </div>


        </div>
      </div>
      <button className='close-button' onClick={toggleVisibility}>⚙️</button>
    </>
  );
};

export default ControlPanel;