import React from "react";
import { Map } from "./components/map/Map";
import { Header } from "./components/header/Header";

const berlinCoordinates = { lat: 52.520008, lng: 13.404954 };

export default function App() {
  return (
    <>
      <Header berlinCoordinates={berlinCoordinates} />
      <Map berlinCoordinates={berlinCoordinates} />
    </>
  );
}
