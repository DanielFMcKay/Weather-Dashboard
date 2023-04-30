# Weather-Dashboard

![image](https://img.shields.io/badge/License-GNU_GPL_v3.0-slateblue.svg)

#### Desktop Screenshots
![image](https://user-images.githubusercontent.com/123746582/235308513-0ace5506-6290-4d7c-9bcb-49bac47377f7.png)

![image](https://user-images.githubusercontent.com/123746582/235349801-f5c005c4-59ba-4778-a51e-516c29ecdcf4.png)

#### Mobile Screenshots
![image](https://user-images.githubusercontent.com/123746582/235350508-be3d2b57-f77f-450f-aeaa-2f254c580ae8.png) ![image](https://user-images.githubusercontent.com/123746582/235350491-9be534d6-6ff1-4c6f-bb9b-b6caa6ad92b5.png)
![image](https://user-images.githubusercontent.com/123746582/235350403-232fae95-ac37-406b-8009-7b048d790d1b.png) ![image](https://user-images.githubusercontent.com/123746582/235350188-2897fdb6-6b92-4626-a3a4-82368b14e91e.png)

## Overview
* This is a weather app for displaying current weather and six day forecasts that saves and reloads cities that the user inputs.

## Live Site: [Weather Dashboard](https://danielfmckay.github.io/Weather-Dashboard/) 

### Development

* This app was originally for the week 06 assignment for the UC Berkeley coding boot camp through Boot Camp Spot.

* As I considered it the first thing I built that I could show family members, it has been extensively updated and polished since then as a tool for self-training.

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

* Furthermore there is one button each to remove only the most recently added history button and the oldest history button, respectively. The button will also be removed from local storage. However, the page will still display any currently displayed information.


#### Element Highlighting

* Lastly, if the mouse is hovering over the search button, a history button, or a deletion or clear everything button, the button will automatically be highlighted with the use of darker or lighter background colors, as well as larger box shadows for the first two. The search field will also become very slightly brighter if the mouse is hovering over it.

#### Mobile Resizing

* The site will also compress and move around elements to display on smaller screen sizes, with main breakpoints at 768px and 476px.

### Live Site
* Direct Link: https://danielfmckay.github.io/Weather-Dashboard/

## License
This site is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/). Feel free to share and modify it, but if you do so, please just give accurate attribution to the source and the writer and state any significant changes, and please don't change the license under which it is exported.

### © Dan McKay 2023
