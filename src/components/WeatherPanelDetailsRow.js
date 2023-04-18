import React from "react";
import { faUmbrella, faLungs, faWind } from '@fortawesome/free-solid-svg-icons';
import { WeatherDetails } from "./WeatherDetails";

const airQualityDict = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Terrible'
};

export function WeatherPanelDetailsRow({ chanceOfPrecip, windSpeed, airQuality }) {
  const weatherDetails = [
    { icon: faUmbrella, value: chanceOfPrecip, unit: '%', label: 'Chance rest of day' },
    { icon: faWind, value: windSpeed, unit: 'km/h', label: 'Wind speed' },
    { icon: faLungs, value: airQualityDict[airQuality], unit: null, label: 'Air quality' }
  ]

  return (
    <div id="weather-panel-details-row">
      {weatherDetails.map(({ icon, value, unit, label }) => (
        <WeatherDetails
          key={label}
          icon={icon}
          value={value}
          unit={unit}
          label={label}
        />
      ))}
    </div>
  );
}

