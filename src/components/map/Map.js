import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
import { customMapStyle } from "../../data/customMapStyle";
import { skateSpots } from '../../data/skateSpots';
import './Map.css';
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const message = 'Hi there, thanks for inspecting my app. If you see "ERR_BLOCKED_BY_CLIENT" in your console, it is likely caused by your adblocker.';

export function Map({ berlinCoordinates }) {
  const [selectedSpot, setSelectedSpot] = useState(null);

  const closeInfoWindow = () => setSelectedSpot(null);

  useEffect(() => console.log(message), []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        id='google-map'
        center={berlinCoordinates}
        zoom={12}
        options={{ styles: customMapStyle }}
        onClick={closeInfoWindow}
      >
        {skateSpots.map(spot => (
          <Marker
            key={spot.id}
            position={{ lat: parseFloat(spot.lat), lng: parseFloat(spot.lng) }}
            onClick={() => setSelectedSpot(spot)}
          />
        ))}
        {selectedSpot && (
          <InfoWindow
            position={{ lat: parseFloat(selectedSpot.lat), lng: parseFloat(selectedSpot.lng) }}
            onCloseClick={closeInfoWindow}
          >
            <div id="info-window">
              <div id="info-window-name">{selectedSpot.name}</div>
              {selectedSpot.img && (
                <img id="info-window-img" src={selectedSpot.img} alt="skate spot" />
              )}
              <div id="info-window-description">
                {selectedSpot.description}
              </div>
              <a target="_blank" rel="noopener noreferrer" href={selectedSpot.directions}>
                <button id="info-window-address" title='click for directions'>
                  {selectedSpot.address}
                </button>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};