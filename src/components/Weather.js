import React, { useCallback, useEffect, useState } from "react";
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

const airQualityDictionary = {
  1: 'Good',
  2: 'Fair',
  3: 'Moderate',
  4: 'Poor',
  5: 'Very Poor'
};

const addZero = timeUnit => `${timeUnit < 10 ? '0' : ''}${timeUnit}`;

export function Weather({ berlinCoordinates }) {
  const [weatherNow, setWeatherNow] = useState();
  const [sunriseTime, setSunriseTime] = useState();
  const [sunsetTime, setSunsetTime] = useState();
  const [daylightRemaining, setDaylightRemaining] = useState(null);
  const [timeUntilDaylight, setTimeUntilDaylight] = useState(null);
  const [chanceOfPrecipitation, setChanceOfPrecipitation] = useState(0);
  const [chanceOfSnow, setChanceOfSnow] = useState(false);
  const [airQuality, setAirQuality] = useState('');

  const { lat, lng: lon } = berlinCoordinates;
  const apiUrl = 'api.openweathermap.org/data/2.5';
  const apiQueryString = `?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`;
  const apiEndpointCurrentWeather = `https://${apiUrl}/weather${apiQueryString}`;
  const apiEndpointWeatherForecast = `http://${apiUrl}/forecast${apiQueryString}`;
  const apiEndpointAirQuality = `http://${apiUrl}/air_pollution${apiQueryString}`;

  const fetchAndSetWeatherNow = () => {
    fetch(apiEndpointCurrentWeather)
      .then(res => res.json())
      .then(({ main, weather, wind, sys }) => {
        const windSpeedKmPerH = Math.round(wind.speed * 3.6); // wind speed is given in meters per second
        setWeatherNow({
          temperature: main.temp,
          description: weather[0].description,
          wind: windSpeedKmPerH,
          icon: weather[0].icon,
        });
        setSunriseTime(sys.sunrise * 1000);
        setSunsetTime(sys.sunset * 1000);
      })
      .catch(err => {
        console.log("GET api.openweathermap WEATHER catch err: ", err);
      });
  };

  const fetchAndSetWeatherForecast = () => {
    fetch(apiEndpointWeatherForecast)
      .then(res => res.json())
      .then(({ list }) => {
        let chanceOfPrecip = 0;
        for (let i = 0; i <= 7; i++) {
          const { pop } = list[i];
          chanceOfPrecip = pop >= chanceOfPrecip ? pop : chanceOfPrecip;
          if (list[i].snow) {
            setChanceOfSnow(true);
          }
        }
        setChanceOfPrecipitation(chanceOfPrecip);
      })
      .catch(err => {
        console.log("GET api.openweathermap FORECAST catch err: ", err);
      });
  };

  const fetchAndSetAirQuality = () => {
    fetch(apiEndpointAirQuality)
      .then(res => res.json())
      .then(({ list }) => {
        const wordValue = airQualityDictionary[list[0].main.aqi];
        setAirQuality(wordValue);
      })
      .catch(err => console.log('air pollution error:', err));
  };

  const handleDaylight = useCallback(() => {
    if (!sunriseTime || !sunsetTime) {
      return;
    }
    const timeNow = new Date().getTime();
    const sunIsUp = sunriseTime < timeNow && timeNow < sunsetTime;
    const timeInFuture = sunIsUp ? sunsetTime : sunriseTime;
    const secondsLeft = Math.floor((timeInFuture - timeNow) / 1000);
    const hours = Math.floor(secondsLeft / (60 * 60));
    const minutes = Math.floor((secondsLeft - (hours * 60 * 60)) / 60);
    const seconds = Math.floor(secondsLeft - (hours * 60 * 60) - (minutes * 60));
    const formattedTime = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
    setDaylightRemaining(sunIsUp ? formattedTime : null);
    setTimeUntilDaylight(sunIsUp ? null : formattedTime);
  }, [sunriseTime, sunsetTime]);

  const handleDaylightInterval = () => {
    const intervalId = setInterval(handleDaylight, 1000);
    return () => clearInterval(intervalId);
  };

  useEffect(fetchAndSetWeatherNow, [apiEndpointCurrentWeather]);
  useEffect(fetchAndSetWeatherForecast, [apiEndpointWeatherForecast]);
  useEffect(fetchAndSetAirQuality, [apiEndpointAirQuality]);
  useEffect(handleDaylightInterval, [handleDaylight]);

  return !weatherNow ? null : (
    <div id="weather-component">
      <img
        src={`http://openweathermap.org/img/wn/${weatherNow.icon}@2x.png`}
        alt={weatherNow.description}
        title={weatherNow.description}
        id="weather-icon"
      />
      <p id="temperature">{weatherNow.temperature}&deg; C</p>
      <div id="weather-text">
        <p>{weatherNow.description}</p>
        <p>Wind speed: {weatherNow.wind} km/h</p>
        {airQuality && <p>Air quality: {airQuality}</p>}
        {chanceOfPrecipitation && <p>Chance of rain {chanceOfSnow && 'or snow'} next 24h: {chanceOfPrecipitation * 100}%</p>}
        {daylightRemaining && <p>Daylight remaining: {daylightRemaining}</p>}
        {timeUntilDaylight && <p>Time until daylight: {timeUntilDaylight}</p>}
      </div>
    </div>
  );
}
