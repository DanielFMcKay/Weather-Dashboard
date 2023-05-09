# Weather-Dashboard

![image](https://img.shields.io/badge/License-GNU_GPL_v3.0-slateblue.svg)

## Live Site: [Weather Dashboard](https://danielfmckay.github.io/Weather-Dashboard/) 

#### Desktop Screenshots
![image](https://user-images.githubusercontent.com/123746582/236685173-99062e84-22e7-4764-8b0f-8e5d5cd1cea9.png)

![image](https://user-images.githubusercontent.com/123746582/236685213-0087528d-1273-415e-b9a6-164cd7d6b6e1.png)

#### Mobile Screenshots
![image](https://user-images.githubusercontent.com/123746582/237044553-aa6bb828-d234-469c-807f-a1b099f4e5f8.png) ![image](https://user-images.githubusercontent.com/123746582/237044701-0837becf-e3f4-405c-b38f-4fb898a01e2a.png) ![image](https://user-images.githubusercontent.com/123746582/237044873-61fe4b4e-8559-4f27-9f84-7c411b856608.png)

## Overview
* This is a weather app for displaying current weather and six day forecasts that saves and reloads cities that the user inputs.

## Live Site: [Weather Dashboard](https://danielfmckay.github.io/Weather-Dashboard/) 

### Development

* This app was originally for the week 06 assignment for the UC Berkeley coding boot camp through Boot Camp Spot.

* As I considered it the first thing I built that I could show family members, it has been extensively updated and polished since then, and also used as a tool for self-training.

### Core Functions

* This weather page will take a city name, with the option of adding an ISO 2-digit country code, and return a forecast with the temperature, wind speed, wind direction, UV index, humidty, and current date, as well as a weather icon for the type of weather. It will also show today's high and low temperatures , as well as the time of today's sunset and sunrise, and maximum hourly wind gust. All measurements use Imperial units, although there is an additional Celsius readout for the current temperature.

* It does this by contacting OpenWeatherMap.org with an API call to retrieve the information.

* It also shows the current day, date, and time on the top of the page beneath the header. It also shows the city name and ISO 2-digit country code in the info display  as returned by the API call. If it is one of several dozen countries which I've added to a conversion for, it will display the full country name as well.

* Also, when a city is requested, a button is appended beneath the search field that is both part of the search history, and can be used to call up a forecast for that city again later. Technically, they are prepended, so that they will always display with the most recently called location at the top, whether it is freshly created or called from local storate when the page is loaded.

* Duplicate entries will also not append a button, but a duplicate request will still call that location's data.

* Additionally, the buttons persist in local storage, so they reload when the page does. Only the 32 most recently called searches are displayed however, starting with the one at the end of the array. I felt this was a practical upper limit for now. The oldest searches and buttons are automatically removed as the newest one is created if that limit has been reached.

* The selected location's current weather conditions, wind-chill, humidity, and local time and date are also displayed, as well as today's high and low temperatures.

* However, if the targeted location is not found, no button is appended or data retrieved, and there is a pop-up alert reading "City Not Found".

#### Forecasts

* A 12-hour hourly forecast will also display for the temperature in 2 columns of 6 each.

* Furthermore, a six day forecast on separate cards is shown along the bottom of the display to show same conditions for the next 6 days, including a high and low daily temperature in lieu of a current one.

#### Weather Warnings

* If the current heat is 100 degrees Fahrenheit or more, or the current UV index is 11 or more, or wind gusts are 50 mph or higher, or the returned weather condition is "tornados", then a warning or advisory will be displayed on the main weather info card in dark red text for each type of event.

#### Button and Storage Deletion

* Additionally, there is a button to both clear the local storage and reload the page, for easier use.

* Furthermore, each search has a paired button that removes both the button for that previously searched location and itself, by removing the div that contains both of them, as well as removing its storage from the array so it won't reload from local storage.

* Finally there are a pair of buttons that remove the most recent and oldest searches respectively. These are vestigial with the addition of the paired deletion buttons, but they're not hurting anything and are styled very nicely so I'm leaving them in for now.

#### Element Highlighting

* Lastly, if the mouse is hovering over the search button, a history button, or a deletion or clear everything button, the button will automatically be highlighted with the use of darker or lighter background colors, as well as larger box shadows for the first two. The search field will also become very slightly brighter if the mouse is hovering over it.

#### Mobile Resizing

* The site will also compress and move around elements to display on smaller screen sizes, with main breakpoints at 768px and 476px.

### Live Site
* Direct Link: https://danielfmckay.github.io/Weather-Dashboard/

## License
This site is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/). Feel free to share and modify it, but please just give accurate attribution to the source and the writer and state any significant changes, and please don't change the license under which it is exported.

### © Dan McKay 2023
