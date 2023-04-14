import React, { useEffect, useState } from "react";
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

export function Weather({ berlinCoordinates }) {
  const { lat, lng: lon } = berlinCoordinates;
  const [weatherNow, setWeatherNow] = useState();
  const [weatherForecast, setWeatherForecast] = useState();
  const [daylightNow, setDaylightNow] = useState(false);
  const [daylightRemaining, setDaylightRemaining] = useState(0);
  const [precipitationDetails, setPrecipitationDetails] = useState('');

  const handleDaylight = (sunriseTime, sunsetTime) => {
    const now = new Date().getTime();
    const sunIsUp = sunriseTime < now && now < sunsetTime;
    setDaylightNow(sunIsUp);
    if (sunIsUp) {
      const secondsLeft = Math.floor((sunsetTime - now) / 1000);
      const hours = Math.floor(secondsLeft / (60 * 60));
      const minutes = Math.floor((secondsLeft - (hours * 60 * 60)) / 60);
      const seconds = Math.floor(secondsLeft - (hours * 60 * 60) - (minutes * 60));
      const addZero = timeUnit => `${timeUnit < 10 ? '0' : ''}${timeUnit}`;
      const formattedTime = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
      setDaylightRemaining(formattedTime);
    }
  };

  const apiUrl = 'api.openweathermap.org/data/2.5';
  const apiQueryString = `?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`;
  const apiEndpointCurrentWeather = `https://${apiUrl}/weather${apiQueryString}`;
  const apiEndpointWeatherForecast = `http://${apiUrl}/forecast${apiQueryString}`;
  const apiEndpointAirQuality = `http://${apiUrl}/air_pollution${apiQueryString}`;

  const fetchAndSetWeatherNow = () => {
    fetch(apiEndpointCurrentWeather)
      .then(res => res.json())
      .then(({ data }) => {
        setWeatherNow({
          temperature: data.main.temp,
          description: data.weather[0].description,
          wind: data.wind.speed,
          icon: data.weather[0].icon,
        });
        // setInterval(() => {
        //   handleDaylight(data.sys.sunrise * 1000, data.sys.sunset * 1000);
        // }, 1000);
        handleDaylight(data.sys.sunrise * 1000, data.sys.sunset * 1000);
      })
      .catch(err => {
        console.log("GET api.openweathermap WEATHER catch err: ", err);
      });
  };

  const fetchAndSetWeatherForecast = () => {
    fetch(apiEndpointWeatherForecast)
      .then(res => res.json())
      .then(({ data }) => {
        setWeatherForecast({
          rainInThreeHours: data.list[0].rain,
          snowInThreeHours: data.list[0].snow,
          rainInSixHours: data.list[1].rain,
          snowInSixHours: data.list[1].snow
        });
      })
      .catch(err => {
        console.log("GET api.openweathermap FORECAST catch err: ", err);
      });
  };

  const windConditions = !weatherNow ? '' :
    weatherNow.wind <= 6 ? 'calm' :
      weatherNow.wind <= 15 ? 'light breeze' :
        weatherNow.wind <= 33 ? 'moderate breeze' :
          weatherNow.wind <= 49 ? 'strong breeze' :
            'strong wind';

  const handlePrecipitation = () => {
    if (!weatherNow || !weatherForecast) {
      return;
    }
    let precipDetails = '';
    const isRaining = weatherNow.icon.startsWith("09") || weatherNow.icon.startsWith("10");
    const isSnowing = weatherNow.icon.startsWith('13');
    if (!isRaining && !isSnowing) {
      if (weatherForecast.rainInThreeHours || weatherForecast.snowInThreeHours) {
        precipDetails = `${weatherForecast.rainInThreeHours ? 'Rain' : 'Snow'} expected in next 3h`;
      } else if (weatherForecast.rainInSixHours || weatherForecast.snowInSixHours) {
        precipDetails = `${weatherForecast.rainInSixHours ? 'Rain' : 'Snow'} expected in next 6h`;
      } else {
        precipDetails = 'No precipitation for at least 6h'
      }
    } else if (isRaining) {
      if (!weatherForecast.rainInThreeHours || !weatherForecast.rainInSixHours) {
        precipDetails = `Rain should stop in next ${weatherForecast.rainInThreeHours ? '3' : '6'}h`;
      } else {
        precipDetails = `Rain to continue for at least 6h`;
      }
    } else if (isSnowing) {
      if (!weatherForecast.snowInThreeHours || !weatherForecast.snowInSixHours) {
        precipDetails = `Snow should stop in next ${weatherForecast.snowInThreeHours ? '3' : '6'}h`;
      } else {
        precipDetails = `Snow to continue for at least 6h`;
      }
    }
    setPrecipitationDetails(precipDetails);
  }

  useEffect(fetchAndSetWeatherNow, [apiEndpointCurrentWeather]);
  useEffect(fetchAndSetWeatherForecast, [apiEndpointWeatherForecast]);
  useEffect(handlePrecipitation, [weatherNow, weatherForecast]);

  useEffect(() => {
    fetch(apiEndpointAirQuality)
      .then(res => res.json())
      .then(data => console.log('air pollution data:', data))
      .catch(err => console.log('air pollution error:', err));
  }, [apiEndpointAirQuality]);

  return !weatherNow || !weatherForecast ? null : (
    <div id="weather-component">
      <img
        src={`http://openweathermap.org/img/wn/${weatherNow.icon}@2x.png`}
        alt={weatherNow.description}
        title={weatherNow.description}
        id="weather-icon"
      />
      <p id="temperature">{weatherNow.temperature}&deg; C</p>
      <div id="weather-text">
        <p>Wind conditions: {windConditions}</p>
        {daylightNow && <p>Daylight remaining: {daylightRemaining}</p>}
        <p>{precipitationDetails}</p>
      </div>
    </div>
  );
}
