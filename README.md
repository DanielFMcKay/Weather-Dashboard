![image](https://user-images.githubusercontent.com/123746582/229811666-eada1fef-3fbd-4233-8f8c-f159b45fd9b8.png)

# Weather-Dashboard

Overview: a weather app for displaying current weather and five day forecasts that saves and reloads cities that the user inputs.

# 06 Server-Side APIs: Weather Dashboard

## Live Site: [Weather Dashboard](https://danielfmckay.github.io/Weather-Dashboard/) 

This app is for the week 06 assignment for the UC Berkeley coding boot camp through Boot Camp Spot.

* This weather page will take a city name, and return a forecast with the temperature, wind speed, UV index, humidty, and current date, as well as a weather icon for the type of weather. It will also show today's high and low temperatures.

* It does this by contacting OpenWeatherMap.org through an API call to retrieve the information.

* It also shows the current day, date, and time on the top of the page beneath the header.

* Additionally, it shows a five day forecast on card along the bottom of the display to show same conditions for the next 5 days, including a high and low daily temperature in lieu of a current one.

* Also, when a city is requested, a button is appended beneath the search field that is both part of the search history, and can be used to call up a forecast for that city again later. Technically, they are prepended, so that they display with the most recently called location at the top.

* However, if the city is not found, no button is appended or data retrieved, and there is a pop-up alert reading "City Not Found".

* Duplicate entries will also not append a button, but will still call that location's data.

* Additionally, the button persists in local storage, so it reloads when the page does.

* The selected location's current wind-chill and local time are also displayed.

* Finally, there is a button to both clear the local storage and reload the page, for easier use.

### Live Site: https://danielfmckay.github.io/Weather-Dashboard/
