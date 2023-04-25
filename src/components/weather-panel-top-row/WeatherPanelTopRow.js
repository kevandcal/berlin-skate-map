import React from 'react';
import './WeatherPanelTopRow.css';

export function WeatherPanelTopRow({ iconCode, description, tempNow, tempMax, tempMin }) {
  const src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div id="weather-panel-top-row">
      <img src={src} alt={description} title={description} id="weather-icon" />
      <div id='temperature-container'>
        <p id="temperature-now">{tempNow}&deg;&thinsp;C</p>
        <div id='temperature-range'>
          <p>H: {tempMax}&deg;</p>
          <div id='temperature-range-divider' />
          <p>L: {tempMin}&deg;</p>
        </div>
      </div>
    </div>
  )
}