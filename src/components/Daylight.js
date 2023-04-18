import React, { useEffect, useState } from 'react';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import { WeatherDetails } from './WeatherDetails';
import { Spinner } from './Spinner';

const addZero = timeUnit => `${timeUnit < 10 ? '0' : ''}${timeUnit}`;

export function Daylight({ timeRef, timeNow }) {
  const [daylightRemaining, setDaylightRemaining] = useState(null);

  const handleCountdown = () => {
    const sunIsUp = timeRef.current?.sunrise < timeNow && timeNow < timeRef.current?.sunset;
    if (sunIsUp) {
      const secondsLeft = Math.floor(timeRef.current?.sunset - timeNow);
      const hours = Math.floor(secondsLeft / (60 * 60));
      const minutes = Math.floor((secondsLeft - (hours * 60 * 60)) / 60);
      const seconds = Math.floor(secondsLeft - (hours * 60 * 60) - (minutes * 60));
      setDaylightRemaining(`${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`);
    } else {
      setDaylightRemaining(null);
    }
  };

  useEffect(handleCountdown, [timeNow, timeRef]);

  return !daylightRemaining ? <Spinner size='40px' /> : (
    <div id="daylight-container">
      <WeatherDetails icon={faHourglass} value={daylightRemaining} largerValue label='Daylight remaining' />
    </div>
  );
}
