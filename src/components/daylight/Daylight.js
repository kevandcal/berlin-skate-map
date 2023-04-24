import React from 'react';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import { WeatherDetails } from '../weather-details/WeatherDetails';
import { Spinner } from '../spinner/Spinner';
import { calculateCountdown } from '../../helperFunctions';
import './Daylight.css';

export function Daylight({ timeNow, sunriseToday, sunsetToday, sunriseTomorrow }) {
  const sunIsUp = sunriseToday < timeNow && timeNow < sunsetToday;
  const sunWasUpToday = !sunIsUp && timeNow >= sunsetToday;

  let endTime;
  if (sunIsUp) {
    endTime = sunsetToday;
  } else if (sunWasUpToday) {
    endTime = sunriseTomorrow;
  } else {
    endTime = sunriseToday;
  }

  const value = calculateCountdown(endTime, timeNow);
  const label = sunIsUp ? 'Daylight remaining' : 'Time until sunrise';

  return !value || !label ? <Spinner size='40px' /> : (
    <div id="daylight-container">
      <WeatherDetails icon={faHourglass} value={value} largerValue label={label} />
    </div>
  );
}
