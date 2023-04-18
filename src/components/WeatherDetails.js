import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function WeatherDetails({ icon, value, largerValue, unit, label }) {
  const valueClassName = `weather-details-value${largerValue ? ' larger' : null}`;

  return (
    <div className='weather-details-container'>
      <div className='weather-details-main-content'>
        <FontAwesomeIcon icon={icon} className='weather-details-icon' />
        <p className={valueClassName}>{value}&thinsp;{unit && unit}</p>
      </div>
      <p className='weather-details-label'>{label}</p>
    </div>
  );
}