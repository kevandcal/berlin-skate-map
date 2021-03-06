import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "react-google-maps";
import customMapStyle from "./custommapstyle";
import skatespots from './skatespots';

export function Map() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [largerImage, setLargerImage] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(null);


  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{
        lat: 52.520008,
        lng: 13.404954
      }}
      defaultOptions={{ styles: customMapStyle }}
      onClick={() => {
        setSelectedSpot(null);
        setLargerImage(null);
      }}
    >
      {skatespots.map(spot => (
        <Marker
          key={spot.id}
          position={{
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng)
          }}
          onClick={() => {
            setSelectedSpot(spot);
          }}
        />
      ))}

      {selectedSpot && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedSpot.lat),
            lng: parseFloat(selectedSpot.lng)
          }}
          onCloseClick={() => {
            setSelectedSpot(null);
            setLargerImage(null);
          }}
        >
          <div id="info-window" className={largerImage}>
            <div id="info-window-name">{selectedSpot.name}</div>
            {selectedSpot.img !== "" && (
              <img
                id="info-window-img"
                onClick={() => {
                  setViewportWidth(window.innerWidth);
                  largerImage === null && viewportWidth <= 1800
                    ? setLargerImage("larger")
                    : setLargerImage(null)
                }}
                src={"img/skate-spots/" + selectedSpot.img}
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
  );
}
