import React, { useEffect, useState } from "react";
import axios from "axios";
const OPEN_WEATHER_MAP_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_KEY;

export function Weather() {
  const [weatherNow, setWeatherNow] = useState();
  const [weatherForecast, setWeatherForecast] = useState();
  const [daylightNow, setDaylightNow] = useState(false);
  const [daylightRemaining, setDaylightRemaining] = useState(0);

  const handleDaylight = (sunriseTime, sunsetTime) => {
    const now = new Date().getTime();
    const sunIsUp = sunriseTime < now && now < sunsetTime;
    setDaylightNow(sunIsUp);
    if (sunIsUp) {
      const secondsLeft = Math.floor((sunsetTime - now) / 1000);
      // const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));
      // const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
      // const seconds = Math.floor(secondsLeft % 60);
      const hours = Math.floor(secondsLeft / (60 * 60));
      const minutes = Math.floor((secondsLeft - (hours * 60 * 60)) / 60);
      const seconds = Math.floor(secondsLeft - (hours * 60 * 60) - (minutes * 60));
      const addZero = timeUnitVar => `${timeUnitVar < 10 ? '0' : ''}${timeUnitVar}`;
      const formattedTime = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
      setDaylightRemaining(formattedTime);
    }
  };

  const weatherApiEndpoint = path => `https://api.openweathermap.org/data/2.5/${path}?id=2950159&APPID=${OPEN_WEATHER_MAP_KEY}&units=metric`;

  const fetchAndHandleCurrentWeather = () => {
    const endpoint = weatherApiEndpoint('weather');
    axios.get(endpoint)
      .then(({ data }) => {
        setWeatherNow({
          currentTemp: data.main.temp,
          currentDescription: data.weather[0].description,
          currentWindSpeed: data.wind.speed,
          currentIcon: data.weather[0].icon,
          sunset: data.sys.sunset,
          sunrise: data.sys.sunrise
        });
        setInterval(() => {
          handleDaylight(data.sys.sunrise * 1000, data.sys.sunset * 1000);
        }, 1000);
      })
      .catch(err => {
        console.log("GET api.openweathermap WEATHER catch err: ", err);
      });
  };

  const fetchAndHandleWeatherForecast = () => {
    const endpoint = weatherApiEndpoint('forecast');
    axios.get(endpoint)
      .then(({ data }) => {
        setWeatherForecast({
          rainInThreeHours: data.list[0].rain,
          rainInSixHours: data.list[1].rain,
          rainInNineHours: data.list[2].rain,
          rainInTwelveHours: data.list[3].rain
        });
      })
      .catch(err => {
        console.log("GET api.openweathermap FORECAST catch err: ", err);
      });
  };

  useEffect(fetchAndHandleCurrentWeather, []);
  useEffect(fetchAndHandleWeatherForecast, []);

  function currentIcon(arg) {
    return (
      <img
        src={`http://openweathermap.org/img/wn/${arg}@2x.png`}
        alt={weatherNow.currentDescription}
        title={weatherNow.currentDescription}
        id="weather-icon"
      />
    );
  }

  function currentWindSpeed(arg) {
    if (arg <= 6) {
      return "calm";
    } else if (arg <= 15) {
      return "light breeze";
    } else if (arg <= 33) {
      return "moderate breeze";
    } else if (arg <= 49) {
      return "strong breeze";
    } else {
      return "strong wind";
    }
  }

  function willItRain(
    currentIcon,
    rainInThreeHours,
    rainInSixHours,
    rainInNineHours,
    rainInTwelveHours
  ) {
    if (!currentIcon.startsWith("09") && !currentIcon.startsWith("10")) {
      if (rainInThreeHours) {
        return <div>Rain expected within the next 3 h</div>;
      } else if (rainInSixHours) {
        return <div>Rain expected in approximately 6 h</div>;
      } else if (rainInNineHours) {
        return <div>Rain expected in approximately 9 h</div>;
      } else if (rainInTwelveHours) {
        return <div>Rain expected in approximately 12 h</div>;
      } else if (!currentIcon.startsWith("13")) {
        return (
          <React.Fragment>
            <div>No rain expected</div>
          </React.Fragment>
        );
      }
    }
    if (currentIcon.startsWith("09") || currentIcon.startsWith("10")) {
      if (!rainInThreeHours) {
        return <div>Rain expected to stop within 3 h</div>;
      } else if (!rainInSixHours) {
        return <div>Rain expected to stop in approx. 6 h</div>;
      } else if (!rainInNineHours) {
        return <div>Rain expected to stop in approx. 9 h</div>;
      } else if (!rainInTwelveHours) {
        return <div>Rain expected to stop in approx. 12 h</div>;
      } else {
        return <div>Rain expected for at least another 12 h</div>;
      }
    }
  }

  return (
    <div id="weather-component-container">
      {weatherNow && weatherForecast && (
        <div id="weather-component">
          {currentIcon && currentIcon(weatherNow.currentIcon)}
          <div id="temperature">{weatherNow.currentTemp + "° C"}</div>

          <br />
          {currentWindSpeed && (
            <div>
              Wind conditions:{" "}
              {currentWindSpeed(weatherNow.currentWindSpeed)}
            </div>
          )}
          {daylightNow && <div>Daylight remaining: {daylightRemaining}</div>}
          <div>
            {willItRain &&
              willItRain(
                weatherNow.currentIcon,
                weatherForecast.rainInThreeHours,
                weatherForecast.rainInSixHours,
                weatherForecast.rainInNineHours,
                weatherForecast.rainInTwelveHours
              )}
          </div>
        </div>
      )}
    </div>
  );
}
