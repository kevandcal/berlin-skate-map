# Berlin Skate Map

This React project features skateboarding spots in Berlin plotted on a custom-styled Google Map and displays current weather, air quality, and daylight conditions.

## Demo

[<img src="src/img/berlinskatemap-demo.gif" width="600px" height="auto" />](https://kevandcal.github.io/berlin-skate-map/)

Click image to try for yourself

## Built with

React, CSS3, Open Weather Map API, Google Maps API, react-google-maps/api (library), Font Awesome icons

## Features

* A custom-styled Google Map is embedded on the page, centered on Berlin with skate spots plotted on it using markers
* Clicking any marker initializes a pop-up window featuring the name, a description, a photo or gif if one is in the database, and a button that displays the address of the respective skate spot
* Clicking the address button in a pop-up window opens the Google Maps directions interface in a new tab with the destination already filled in
* Pop-up windows can be closed by clicking on the `x` in their top right corner or anywhere on the map
* Using real-time data from the Open Weather Map API, the following skateboading-relevant information is displayed above the map:
  * A large icon representings general weather conditions (e.g. cloudy, sunny, or raining) 
  * The current temperature as well as the daily high and low temperatures
  * The chance of precipitation for the rest of the day (i.e. from now until midnight)
  * The current wind speed measured in kilometers per hour 
  * The current air quality in the form of a one-word string: good, fair, moderate, poor, or terrible
  * A countdown of either daylight remaining or time until sunrise, depending on wether it is currently daytime or nighttime in Berlin
* New data are fetched from the Open Weather Map API at the start of each hour to perpetually keep the app up to date even if it is never refreshed
* A spinner is rendered while data are being fetched

