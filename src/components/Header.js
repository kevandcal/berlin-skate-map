import React from "react";
import { Weather } from "./Weather";

export function Header({ berlinCoordinates }) {
  return (
    <header>
      <div id="header-content">
        <div id="berlin-letters">
          BERLIN <span id="skate-letters">SKATE</span> MAP
        </div>
        <Weather berlinCoordinates={berlinCoordinates} />
      </div>
    </header>
  );
}