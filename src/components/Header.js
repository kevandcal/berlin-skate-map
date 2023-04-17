import React, { useEffect, useRef, useState } from "react";
import { Weather } from "./Weather";
import { Daylight } from './Daylight';

export function Header({ berlinCoordinates }) {
  const [timeNow, setTimeNow] = useState(Math.floor(Date.now() / 1000));
  const timeRef = useRef();

  const updateTimeNow = () => {
    const intervalId = setInterval(() => setTimeNow(prev => prev + 1), 1000);
    return () => clearInterval(intervalId);
  };

  useEffect(updateTimeNow, []);

  return (
    <header>
      <div id="header-content">
        <div id="berlin-letters">
          BERLIN <span id="skate-letters">SKATE</span> MAP
        </div>
        <div id='header-right'>
          <Weather berlinCoordinates={berlinCoordinates} timeRef={timeRef} timeNow={timeNow} />
          <Daylight timeRef={timeRef} timeNow={timeNow} />
        </div>
      </div>
    </header>
  );
}