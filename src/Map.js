import React, { memo, useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
import { customMapStyle } from "./custommapstyle";
import { skatespots } from './skatespots';
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const Map = memo(() => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [largerImage, setLargerImage] = useState(null);

  const containerStyle = {
    height: "100%",
    border: "5px #6e769e solid"
  };

  const closeInfoWindow = () => {
    setSelectedSpot(null);
    setLargerImage(null);
  };

  const handleImgClick = () => {
    setLargerImage(prev => !prev && window.innerWidth <= 1800 ? "larger" : null);
  };

  useEffect(() => console.log('Hi there, thanks for inspecting my app. If you see an "ERR_BLOCKED_BY_CLIENT" error in the console, it is likely caused by your adblocker.'), []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 52.520008, lng: 13.404954 }}
        zoom={12}
        options={{ styles: customMapStyle }}
        onClick={closeInfoWindow}
      >
        {skatespots.map(spot => (
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
            <div id="info-window" className={largerImage}>
              <div id="info-window-name">{selectedSpot.name}</div>
              {selectedSpot.img && (
                <img
                  id="info-window-img"
                  onClick={handleImgClick}
                  src={selectedSpot.img}
                  className={largerImage}
                  alt="skate spot"
                />
              )}
              <div id="info-window-description">
                {selectedSpot.description}
              </div>
              <div id="info-window-address-directions-container">
                <div id="info-window-address">
                  {selectedSpot.address}
                </div>{" "}
                <a target={"_blank"} rel="noopener noreferrer" href={selectedSpot.directions}>
                  <button id="info-window-directions">
                    Directions
                  </button>
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
});