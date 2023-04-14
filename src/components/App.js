import React from "react";
import { Map } from "./Map";
import { Header } from "./Header";

const berlinCoordinates = { lat: 52.520008, lng: 13.404954 };

export default function App() {
  return (
    <div id="app-container">
      <Header berlinCoordinates={berlinCoordinates} />
      <div id='map-container'>
        <Map berlinCoordinates={berlinCoordinates} />
      </div>
    </div>
  );
}
