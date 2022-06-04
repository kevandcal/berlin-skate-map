import React from "react";
import { Weather } from "./Weather";

export function Header() {
  return (
    <header>
      <div id="berlin-letters">
        BERLIN <span id="skate-letters">SKATE</span> MAP
      </div>
      <Weather />
    </header>
  );
}