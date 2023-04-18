import React, { useCallback, useEffect, useRef, useState } from "react";
import { Daylight } from "./Daylight";
import { WeatherPanelDetailsRow } from "./WeatherPanelDetailsRow";
import { Spinner } from './Spinner';
import { roundToOneDecimal, handlePrecipitation } from "../helperFunctions";
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

export function Weather({ berlinCoordinates }) {
  const [weatherIcon, setWeatherIcon] = useState();
  const [temperature, setTemperature] = useState();
  const [chanceOfPrecip, setChanceOfPrecip] = useState();
  const [windSpeed, setWindSpeed] = useState();
  const [airQuality, setAirQuality] = useState();
  const [timeNow, setTimeNow] = useState(Math.floor(Date.now() / 1000));
  const timeRef = useRef();

  const isTopOfHour = timeNow % 3600 === 0;
  const dataReady = weatherIcon && temperature && typeof chanceOfPrecip === 'number' && typeof windSpeed === 'number' && airQuality;

  const { lat, lng: lon } = berlinCoordinates;
  const apiUrl = 'api.openweathermap.org/data/';
  const apiQueryString = `?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`;
  const apiEndpointAirQuality = `http://${apiUrl}2.5/air_pollution${apiQueryString}`;
  const apiEndpointOneCall = `https://${apiUrl}3.0/onecall${apiQueryString}&exclude=alerts,minutely`;

  const fetchOneCall = useCallback(() => {
    fetch(apiEndpointOneCall)
      .then(res => res.json())
      .then(({ current, daily, hourly }) => {
        const { sunrise, sunset, temp: tempNow, weather } = current;
        const { max: tempMax, min: tempMin } = daily[0].temp;
        setWeatherIcon({ code: weather[0].icon, description: weather[0].description });
        setWindSpeed(Math.round(current.wind_speed * 3.6)); // m/s -> km/h
        setTemperature({
          now: roundToOneDecimal(tempNow),
          max: roundToOneDecimal(tempMax),
          min: roundToOneDecimal(tempMin)
        });
        handlePrecipitation(hourly, setChanceOfPrecip);
        timeRef.current = { today: { sunrise, sunset }, tomorrow: { sunrise: daily[1].sunrise } }
      })
      .catch(err => console.log('one call api err:', err));
  }, [apiEndpointOneCall])

  const fetchAirQuality = useCallback(() => {
    fetch(apiEndpointAirQuality)
      .then(res => res.json())
      .then(({ list }) => setAirQuality(list[0].main.aqi))
      .catch(err => console.log('air pollution error:', err));
  }, [apiEndpointAirQuality]);

  const updateTimeNow = () => {
    const intervalId = setInterval(() => setTimeNow(prev => prev + 1), 1000);
    return () => clearInterval(intervalId);
  };

  const fetchNewDataAtTopOfHour = () => {
    if (isTopOfHour) {
      fetchOneCall();
      fetchAirQuality();
    }
  };

  useEffect(fetchOneCall, [fetchOneCall]);
  useEffect(fetchAirQuality, [fetchAirQuality]);
  useEffect(updateTimeNow, []);
  useEffect(fetchNewDataAtTopOfHour, [isTopOfHour, fetchOneCall, fetchAirQuality]);

  return !dataReady ? <Spinner size='120px' /> : (
    <div id="weather-panel">
      <WeatherPanelTopRow
        iconCode={weatherIcon.code}
        description={weatherIcon.description}
        tempNow={temperature.now}
        tempMax={temperature.max}
        tempMin={temperature.min}
      />
      <WeatherPanelDetailsRow
        chanceOfPrecip={chanceOfPrecip}
        windSpeed={windSpeed}
        airQuality={airQuality}
      />
      <Daylight
        timeNow={timeNow}
        sunriseToday={timeRef.current?.today?.sunrise}
        sunsetToday={timeRef.current?.today?.sunset}
        sunriseTomorrow={timeRef.current?.tomorrow?.sunrise}
      />
    </div>
  );
}

function WeatherPanelTopRow({ iconCode, description, tempNow, tempMax, tempMin }) {
  const src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div id="weather-panel-top-row">
      <img src={src} alt={description} title={description} id="weather-icon" />
      <div id='temperature-container'>
        <p id="temperature-now">{tempNow}&deg;&thinsp;C</p>
        <div id='temperature-range'>
          <p>H: {tempMax}&deg;</p>
          <div id='temperature-range-divider' />
          <p>L: {tempMin}&deg;</p>
        </div>
      </div>
    </div>
  )
}