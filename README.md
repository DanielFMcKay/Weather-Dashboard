![image](https://user-images.githubusercontent.com/123746582/232410962-dccd086c-c499-4359-8c2d-02e6577eb670.png)

![image](https://user-images.githubusercontent.com/123746582/232411314-ac2fb4b6-7c04-4699-8bf1-cee089653922.png)

# Weather-Dashboard

Overview: a weather app for displaying current weather and six day forecasts that saves and reloads cities that the user inputs.

# 06 Server-Side APIs: Weather Dashboard

## Live Site: [Weather Dashboard](https://danielfmckay.github.io/Weather-Dashboard/) 

This app is for the week 06 assignment for the UC Berkeley coding boot camp through Boot Camp Spot.

* This weather page will take a city name, and return a forecast with the temperature, wind speed, UV index, humidty, and current date, as well as a weather icon for the type of weather. It will also show today's high and low temperatures. All measurements use Imperial units, although there is an additional Celsius readout for the current temperature.

* It does this by contacting OpenWeatherMap.org through an API call to retrieve the information.

* It also shows the current day, date, and time on the top of the page beneath the header.

* Also, when a city is requested, a button is appended beneath the search field that is both part of the search history, and can be used to call up a forecast for that city again later. Technically, they are prepended, so that they will always display with the most recently called location at the top, whether it is freshly created or called from local storate when the page is loaded.

* However, if the city is not found, no button is appended or data retrieved, and there is a pop-up alert reading "City Not Found".

* Duplicate entries will also not append a button, but a duplicate request will still call that location's data.

* Additionally, the button persists in local storage, so it reloads when the page does. Only the 30 most recently called searches are displayed however, starting with the one at the end of the array. I felt this was a practical upper limit for now

* If a mouse is hovering over the search button, a history button, or the clear everything button, the button will automatically be highlighted.

* The selected location's current weather conditions, wind-chill, humidity, UV Index and local time and date are also displayed, as well as today's high and low temperatures.

* If the current heat is 100 degrees Fahrenheit or more, and/or the current UV index is 11 or more, an advisory will be displayed on the main weather info card in dark red text.

* Furthermore, a six day forecast on separate cards is shown along the bottom of the display to show same conditions for the next 6 days, including a high and low daily temperature in lieu of a current one.

* Finally, there is a button to both clear the local storage and reload the page, for easier use.

### Live Site: https://danielfmckay.github.io/Weather-Dashboard/

### © Dan McKay 2023

