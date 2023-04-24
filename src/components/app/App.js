import React from "react";
import { Map } from "../map/Map";
import { Header } from "../header/Header";
import './App.css';

const berlinCoordinates = { lat: 52.520008, lng: 13.404954 };

export default function App() {
  return (
    <div id="app-container">
      <Header berlinCoordinates={berlinCoordinates} />
      <Map berlinCoordinates={berlinCoordinates} />
    </div>
  );
}
