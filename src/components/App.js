import React from "react";
import { Map } from "./Map";
import { Header } from "./Header";

export default function App() {
  return (
    <div id="app-container">
      <Header />
      <div id='map-container'>
        <Map />
      </div>
    </div>
  );
}
