import React, { useCallback, useEffect, useRef, useState } from "react";
import { Daylight } from "./Daylight";
import { WeatherPanelDetailsRow } from "./WeatherPanelDetailsRow";
import { Spinner } from './Spinner';
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

const roundToOneDecimal = number => Math.round(number * 10) / 10;

export function Weather({ berlinCoordinates }) {
  const [weatherNow, setWeatherNow] = useState();
  const [weatherToday, setWeatherToday] = useState();
  const [airQuality, setAirQuality] = useState();
  const [timeNow, setTimeNow] = useState(Math.floor(Date.now() / 1000));
  const timeRef = useRef();

  const isTopOfHour = timeNow % 3600 === 0;
  const dataReady = weatherNow && weatherToday;

  const { lat, lng: lon } = berlinCoordinates;
  const apiUrl = 'api.openweathermap.org/data/2.5';
  const apiQueryString = `?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`;
  const apiEndpointWeatherNow = `https://${apiUrl}/weather${apiQueryString}`;
  const apiEndpointWeatherForecast = `http://${apiUrl}/forecast${apiQueryString}`;
  const apiEndpointAirQuality = `http://${apiUrl}/air_pollution${apiQueryString}`;

  const fetchAndSetWeatherNow = useCallback(() => {
    fetch(apiEndpointWeatherNow)
      .then(res => res.json())
      .then(({ main, weather, wind, sys }) => {
        const windSpeed = Math.round(wind.speed * 3.6); // m/s -> km/h
        setWeatherNow({
          temperature: roundToOneDecimal(main.temp),
          description: main.description,
          windSpeed,
          icon: weather[0].icon,
        });
        setWeatherToday(prev => ({
          ...prev,
          temperatureMax: roundToOneDecimal(main.temp_max),
          temperatureMin: roundToOneDecimal(main.temp_min),
        }));
        timeRef.current = { sunrise: sys.sunrise, sunset: sys.sunset }
      })
      .catch(err => {
        console.log("GET api.openweathermap WEATHER catch err: ", err);
      });
  }, [apiEndpointWeatherNow, timeRef]);

  const fetchAndSetWeatherForecast = useCallback(() => {
    fetch(apiEndpointWeatherForecast)
      .then(res => res.json())
      .then(({ list }) => {
        let chance = 0;
        for (let i = 0; i <= 7; i++) {
          const { pop, dt_txt: time } = list[i];
          chance = pop >= chance ? pop : chance;
          if (time.endsWith('00:00:00')) {
            break;
          }
        }
        setWeatherToday(prev => ({
          ...prev,
          chanceOfPrecip: chance * 100 // decimal -> percent
        }));
      })
      .catch(err => {
        console.log("GET api.openweathermap FORECAST catch err: ", err);
      });
  }, [apiEndpointWeatherForecast]);

  const fetchAndSetAirQuality = useCallback(() => {
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
      fetchAndSetWeatherNow();
      fetchAndSetWeatherForecast();
      fetchAndSetAirQuality();
    }
  };

  useEffect(fetchAndSetWeatherNow, [fetchAndSetWeatherNow]);
  useEffect(fetchAndSetWeatherForecast, [fetchAndSetWeatherForecast]);
  useEffect(fetchAndSetAirQuality, [fetchAndSetAirQuality]);
  useEffect(updateTimeNow, []);
  useEffect(fetchNewDataAtTopOfHour, [isTopOfHour, fetchAndSetWeatherNow, fetchAndSetWeatherForecast, fetchAndSetAirQuality]);

  return !dataReady ? <Spinner size='120px' /> : (
    <div id="weather-panel">
      <WeatherPanelTopRow
        icon={weatherNow?.icon}
        description={weatherNow?.description}
        tempNow={weatherNow.temperature}
        tempMax={weatherToday.temperatureMax}
        tempMin={weatherToday.temperatureMin}
      />
      <WeatherPanelDetailsRow
        chanceOfPrecip={weatherToday?.chanceOfPrecip}
        windSpeed={weatherNow?.windSpeed}
        airQuality={airQuality}
      />
      <Daylight timeRef={timeRef} timeNow={timeNow} />
    </div>
  );
}

function WeatherPanelTopRow({ icon, description, tempNow, tempMax, tempMin }) {
  const src = `http://openweathermap.org/img/wn/${icon}@2x.png`

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