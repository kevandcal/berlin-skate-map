import React from "react";
import { Weather } from "../weather/Weather";
import './Header.css';

export function Header({ berlinCoordinates }) {

  return (
    <header>
      <div id="header-content">
        <div id="logo">
          BERLIN
          <span id="skate-letters">SKATE</span>
          MAP
        </div>
        <Weather berlinCoordinates={berlinCoordinates} />
      </div>
    </header>
  );
}