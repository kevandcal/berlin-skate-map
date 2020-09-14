import React from "react";
import { Map } from "./Map";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import { Header } from "./Header";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div id="app-container">
      <Header />
      <div
        style={{
          width: "90vw",
          height: "90vh",
          marginBottom: "6vh"
        }}
      >
        <WrappedMap
          id="wrappedmap"
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_MAPS_API_KEY}`}
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={
            <div
              style={{
                height: "100%",
                border: "0.6vh #6e769e solid"
              }}
            />
          }
          mapElement={<div style={{ height: "100%" }} />}
        />
      </div>
    </div>
  );
}
