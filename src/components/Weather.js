import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUmbrella, faLungs, faWind } from '@fortawesome/free-solid-svg-icons';
import { Daylight } from './Daylight';
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

const airQualityDictionary = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very Poor'
};
const roundToOneDecimal = number => Math.round(number * 10) / 10;

export function Weather({ berlinCoordinates }) {
  const [weatherNow, setWeatherNow] = useState();
  const [weatherToday, setWeatherToday] = useState();
  const [timeNow, setTimeNow] = useState(Math.floor(Date.now() / 1000));
  const [isTopOfHour, setIsTopOfHour] = useState(false);
  const [airQuality, setAirQuality] = useState('');

  const timeRef = useRef();

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
  }, [apiEndpointWeatherNow]);

  const fetchAndSetWeatherForecast = useCallback(() => {
    fetch(apiEndpointWeatherForecast)
      .then(res => res.json())
      .then(({ list }) => {
        let chanceOfPrecip = 0;
        for (let i = 0; i <= 7; i++) {
          const { pop, dt_txt: time } = list[i];
          chanceOfPrecip = pop >= chanceOfPrecip ? pop : chanceOfPrecip;
          if (time.endsWith('00:00:00')) {
            break;
          }
        }
        setWeatherToday(prev => ({
          ...prev,
          chanceOfPrecipitation: chanceOfPrecip * 100 // decimal -> percent
        }));
      })
      .catch(err => {
        console.log("GET api.openweathermap FORECAST catch err: ", err);
      });
  }, [apiEndpointWeatherForecast]);

  const fetchAndSetAirQuality = useCallback(() => {
    fetch(apiEndpointAirQuality)
      .then(res => res.json())
      .then(({ list }) => setAirQuality(airQualityDictionary[list[0].main.aqi]))
      .catch(err => console.log('air pollution error:', err));
  }, [apiEndpointAirQuality]);

  const updateTimeNow = () => {
    const intervalId = setInterval(() => setTimeNow(prev => prev + 1), 1000);
    return () => clearInterval(intervalId);
  };

  const checkWhetherTopOfHour = () => {
    setIsTopOfHour(timeNow % 3600 === 0);
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
  useEffect(checkWhetherTopOfHour, [timeNow]);
  useEffect(fetchNewDataAtTopOfHour, [isTopOfHour, fetchAndSetWeatherNow, fetchAndSetWeatherForecast, fetchAndSetAirQuality]);

  return !weatherNow ? null : (
    <div id="weather-component">
      <img
        src={`http://openweathermap.org/img/wn/${weatherNow.icon}@2x.png`}
        alt={weatherNow.description}
        title={weatherNow.description}
        id="weather-icon"
      />
      <p id="temperature">{weatherNow.temperature}&deg;&thinsp;C</p>
      <div id="weather-text">
        <p>Max/min: {weatherToday.temperatureMax}&deg;&thinsp;C/{weatherToday.temperatureMin}&deg;&thinsp;C</p>
        <p>Wind speed: {weatherNow.windSpeed} km/h</p>
        {airQuality && <p>Air quality: {airQuality}</p>}
        {weatherToday.chanceOfPrecipitation && <p>Chance of precipitation rest of day: {weatherToday.chanceOfPrecipitation}%</p>}
        <FontAwesomeIcon icon={faUmbrella} />
        <FontAwesomeIcon icon={faWind} />
        <FontAwesomeIcon icon={faLungs} />
        <Daylight timeNow={timeNow} timeRef={timeRef} />
      </div>
    </div>
  );


  // return !weatherNow ? null : (
  //   <div id="weather-component">
  //     <div id="weather-panel">
  //       <div id="weather-panel-top-row">
  //         <img
  //           src={`http://openweathermap.org/img/wn/${weatherNow.icon}@2x.png`}
  //           alt={weatherNow.description}
  //           title={weatherNow.description}
  //           id="weather-icon"
  //         />
  //         <div id='temperature-container'>
  //           <p id="temperature-now">{weatherNow.temperature}&deg;&thinsp;C</p>
  //           <p id='temperature-range'>Max/min: {weatherToday.temperatureMax}&deg;&thinsp;C/{weatherToday.temperatureMin}&deg;&thinsp;C</p>
  //         </div>
  //       </div>
  //       <div id="weather-panel-bottom-row">
  //         <p>Wind speed: {weatherNow.windSpeed} km/h</p>
  //         {airQuality && <p>Air quality: {airQuality}</p>}
  //         {weatherToday.chanceOfPrecipitation && <p>Chance of precipitation rest of day: {weatherToday.chanceOfPrecipitation}%</p>}
  //         <FontAwesomeIcon icon={faUmbrella} />
  //         <FontAwesomeIcon icon={faWind} />
  //         <FontAwesomeIcon icon={faLungs} />
  //       </div>
  //     </div>
  //     <Daylight timeNow={timeNow} timeRef={timeRef} />
  //   </div>
  // );
}
