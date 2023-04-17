import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUmbrella, faLungs, faWind } from '@fortawesome/free-solid-svg-icons';
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

const airQualityDictionary = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Terrible'
};
const roundToOneDecimal = number => Math.round(number * 10) / 10;

export function Weather({ berlinCoordinates, timeRef, timeNow }) {
  const [weatherNow, setWeatherNow] = useState();
  const [weatherToday, setWeatherToday] = useState();
  const [airQuality, setAirQuality] = useState('');

  const isTopOfHour = timeNow % 3600 === 0;

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
  useEffect(fetchNewDataAtTopOfHour, [isTopOfHour, fetchAndSetWeatherNow, fetchAndSetWeatherForecast, fetchAndSetAirQuality]);

  return !weatherNow ? null : (
    <div id="weather-panel">
      <div id="weather-panel-top-row">
        <img
          src={`http://openweathermap.org/img/wn/${weatherNow.icon}@2x.png`}
          alt={weatherNow.description}
          title={weatherNow.description}
          id="weather-icon"
        />
        <div id='temperature-container'>
          <p id="temperature-now">{weatherNow.temperature}&deg;&thinsp;C</p>
          <div id='temperature-range'>
            <p>H: {weatherToday.temperatureMax}&deg;&thinsp;C</p>
            <div id='temperature-range-divider' />
            <p>L: {weatherToday.temperatureMin}&deg;&thinsp;C</p>
          </div>
        </div>
      </div>
      <div id="weather-panel-bottom-row">
        <WeatherDetails icon={faUmbrella} value={weatherToday.chanceOfPrecipitation} unit='%' subtitle='Chance rest of day' />
        <WeatherDetails icon={faWind} value={weatherNow.windSpeed} unit='km/h' subtitle='Wind speed' />
        <WeatherDetails icon={faLungs} value={airQuality} unit={null} subtitle='Air quality' />
      </div>
    </div>
  );
}


function WeatherDetails({ icon, value, unit, subtitle }) {
  return (
    <div className='weather-details-container'>
      <div className='weather-details-main-content'>
        <FontAwesomeIcon icon={icon} className='weather-details-icon' />
        <p className='weather-details-value'>{value}&thinsp;{unit && unit}</p>
      </div>
      <p className='weather-details-subtitle'>{subtitle}</p>
    </div>
  );
}