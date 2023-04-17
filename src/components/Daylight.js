import React, { useEffect, useState } from 'react'

const addZero = timeUnit => `${timeUnit < 10 ? '0' : ''}${timeUnit}`;

const styles = {
  container: {
    fontSize: '20px',
    height: '80px',
    width: '300px',
    backgroundColor: '#1b3d15',
    // backgroundColor: '#353c47',
    // backgroundColor: 'rgba(53, 60, 71, 0.8)',
    // backgroundColor: 'rgba(184, 195, 212, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px'
    // width: '100%'
  }
}

export function Daylight({ timeNow, timeRef }) {
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

  return !daylightRemaining ? null : (
    <div style={styles.container}>Daylight remaining: {daylightRemaining}</div>
  )
}
