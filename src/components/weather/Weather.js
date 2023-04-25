import React, { useCallback, useEffect, useRef, useState } from "react";
import { Daylight } from "../daylight/Daylight";
import { WeatherPanelDetailsRow } from "../weather-panel-details-row/WeatherPanelDetailsRow";
import { Spinner } from '../spinner/Spinner';
import { WeatherPanelTopRow } from '../weather-panel-top-row/WeatherPanelTopRow';
import { roundToOneDecimal, handlePrecipitation } from "../../helperFunctions";
import './Weather.css';
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
  const apiUrl = 'https://api.openweathermap.org/data/';
  const apiQueryString = `?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`;
  const apiEndpointAirQuality = `${apiUrl}2.5/air_pollution${apiQueryString}`;
  const apiEndpointWeather = `${apiUrl}3.0/onecall${apiQueryString}&exclude=alerts,minutely`;

  const fetchWeather = useCallback(() => {
    fetch(apiEndpointWeather)
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
  }, [apiEndpointWeather])

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
      fetchWeather();
      fetchAirQuality();
    }
  };

  useEffect(fetchWeather, [fetchWeather]);
  useEffect(fetchAirQuality, [fetchAirQuality]);
  useEffect(updateTimeNow, []);
  useEffect(fetchNewDataAtTopOfHour, [isTopOfHour, fetchWeather, fetchAirQuality]);

  const content = !dataReady ? <Spinner size='120px' /> : (
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

  return (
    <div id='weather-container'>
      {content}
    </div>
  );
}

