# Berlin Skate Map

This React project, built exclusively using Hooks, features skateboarding spots in Berlin plotted on a custom-styled Google Map and displays current weather and daylight conditions.

## Demo (click to be redirected to the site)

[![Berlin Skate Map](public/img/berlin-skate-map-demo.gif)](http://berlinskatemap.herokuapp.com/)

## url

http://berlinskatemap.herokuapp.com/

## Built with

HTML, CSS, React (Hooks), Node.js, Open Weather Map API, Google Maps API, react-google-maps (package), PostgreSQL

## Features

-   A custom-styled Google Map is embedded on the page, centered on Berlin with skate spots plotted on it using markers
-   Clicking any marker initializes a pop-up window with the name, a description, a photo/gif if one is in the database, and the address of the skate spot, as well as a `directions` button that opens Google Maps in a new tab with the destination pre-filled in
-   Clicking on the photo/gif causes it to grow in size, reformatting the pop-up window in the process; clicking it again makes it return to its original size
-   Clicking on the `x` in the pop-up window or anywhere outside of the pop-up window closes it
-   Because weather and daylight conditions are also important factors for skateboarding, relevant data are pulled from the Open Weather Map API when React mounts
-   A general weather icon and the current temperature are always rendered, and additional information is conditionally rendered:
-   If it is raining or snowing, the precipitation's forecasted end is displayed
-   If it is not raining or snowing, it is displayed whether/when precipitation is forecasted in the following 12 h
-   If a user loads the page during daytime, a timer counting down remaining daylight is rendered

## Future

-   Adding more skate spots to the database
