// Javascript goes here


const citySidebar = $("#city-sidebar");


// this is my API key
const APIKey = "&appid=e34df904642594e0e3f3151760f273a4";

// the input field. The reason I kept "citInputField" so much is it's easier to track in de-bugging
let cityInputField = $("#fetch-field").val();

// for use with directly pressing the Enter button
let cityInput = $("#fetch-field")[0];


const searchBtn = $("#searchBtn")[0];

// jsdays makes time formatting easier and also flexible
const currentDateTime = dayjs().format('dddd, MMMM DD YYYY, hh:mm a');
console.log(currentDateTime);
const dateTimeDisplay = $('#currentDateTime');
dateTimeDisplay.text(currentDateTime);
const currentDay = dayjs().format('dddd, MMMM DD');
console.log(currentDay);
const currentDayDisplay = $('.current-date');
currentDayDisplay.text(currentDay);
var multiDayDisplay = $("#multiDayForecast");
const clearEverything = $("#clearStorageBtn")[0];

// gets the array of cities stored in local storage
var cityStored = JSON.parse(localStorage.getItem('citySearch')) || [];



// Since the site requires new buttons for each city in the history, we need a function to create that
function createWeatherButton() {
    var presetCityButtons = document.querySelectorAll(".cityName");
    presetCityButtons.forEach(function (historyBtn) {
        historyBtn.addEventListener("click", function (e) {
            cityInputField = e.target.innerText;
            weatherForecast(cityInputField);
        });
    });
}

// Loads the search history and the buttons to check the weather for it. Maximum 30 buttons.
// Only the 30 most recent searches are called and the buttons are displayed from most to least recent.
function loadHistoryButtons() {
    for (let i = cityStored.length - 1; i > (cityStored.length - 30) && i >= 0; i--) {
        var citySearchHistory = document.createElement("button");
        citySearchHistory.setAttribute("class", "cityName historyBtn");
        citySearchHistory.textContent = cityStored[i];
        console.log("location stored is " + cityStored[i] + " " + i);
        $("#storedCity").append(citySearchHistory);
        createWeatherButton();
    }
}


// this works in concert with the weatherForecast function to target the specific city requested and return the data for it
const retrieveCity = function (lat, lon) {
    var cityCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +
        '&appid=908d66bc443a59edcf38648405a06695' + '&units=imperial' + '&lang=en';
    fetch(cityCall)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // by the way, you can change the icon size somewhat by adding "@2x" or "@4x" before the ".png"
            // Below populates the Weather Card with the target location's information, then calls the 5-day forecast function
            let localTime = new Date((data.current.dt + data.timezone_offset + 25200) * 1000);
            let localUnixWeekday = localTime.getDay();
            let weekdayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            let localWeekday = weekdayArray[localUnixWeekday];
            
            let currentCelsius = Math.round(parseFloat(((data.current.temp - 32) * 5 / 9)));
            // console.log(localWeekday);
            // console.log("is localWeekday")

            // console.log(currentCelsius);
            // console.log("is currentCelsius");

            // console.log(localTime.toLocaleTimeString("en-US"));
            // console.log("is the Unix-rendered local time");
            // console.log(localTime.toLocaleDateString("en-US"));
            // console.log("is the Unix-rendered local date");
            $('.weather-icon').html(`<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png"/>`)
            //  local Date
            $('.city-info').html(cityInputField + "<br>" + localTime.toLocaleDateString("en-US"));
            $('.local-weekday').text(localWeekday);
            $('.big-temp').text(Math.round(parseFloat(data.current.temp)) + " °F");
            $('.temperature').text("Currently: " + Math.round(parseFloat(data.current.temp)) + " °F (" + currentCelsius + " °C)");
            $('.wind-speed').text("Wind Speed: " + Math.round(parseFloat(data.current.wind_speed)) + " mph");
            $('.humidity').text("Humidity: " + Math.round(parseFloat(data.current.humidity)) + "%");
            $('.uv-index').html("UV Index: " + data.current.uvi);
            // local Time
            $('.current-conditions').text("Current conditions: " + data.current.weather[0].description);
            $('.timezone-offset').html("Location's Timezone: UTC " + ((data.timezone_offset) / 3600));
            // Why does unix time start in PST???? Anyway, I added 7 hours worth of seconds before the offset.

            $('.local-time').html("Local time is: " + localTime.toLocaleTimeString("en-US"));
            $('.hi-temp').text("Today's High Temp: " + Math.round(parseFloat(data.daily[0].temp.max)) + " °F");
            $('.lo-temp').text("Today's Low Temp: " + Math.round(parseFloat(data.daily[0].temp.min)) + " °F");
            $('.feels-like').text("Currently Feels Like: " + Math.round(parseFloat(data.current.feels_like)) + " °F");

            console.log("current weather parameters:");
            console.log(data.current.weather);

            multiDayForecast(data);
        })
}



// this function gets makes the initial call to get the city's geographic coordinates
const weatherForecast = function (cityInputField) {
    // console.log("weatherForecast's cityInputField is");
    // console.log(cityInputField);


    const openWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputField + '&units=imperial' + APIKey;
    // console.log(openWeather);
    // console.log("is openWeather")



    fetch(openWeather)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            if (data.cod !== "200") {
                console.log("Location not found.");
                window.alert("Place Not Found");
                return;
            }
            retrieveCity(data.city.coord.lat, data.city.coord.lon);
            console.log(data.city.country);
            console.log("is country of origin");

            // catch for duplicate entries below
            for (let i = 0; i < cityStored.length; i++) {
                // console.log(cityStored[i]);
                if (cityInputField === cityStored[i]) {
                    console.log(cityStored.length);
                    console.log("is number of locations stored")
                    return;
                }
            }

            // below pushes the new location to the array of stored locations and makes a new button for it
            cityStored.push(cityInputField);

            var historyButton = document.createElement("button");
            historyButton.setAttribute("class", "cityName historyBtn");
            historyButton.textContent = cityInputField;
            $("#storedCity").prepend(historyButton);

            localStorage.setItem('citySearch', JSON.stringify(cityStored));
        });

};

// making the functions come from variables allows more flexibility in the order in how I list them, it would seem


// this is for the Five Day Forecast
const multiDayForecast = function (data) {
    $('#multiDayForecast').empty();
    const unixDate = data.current.dt;
    for (let i = 0; i < 6; i++) {
        const dayCard = $("<div class='row forecastMultiCard'><div/>");
        $(multiDayDisplay).append(dayCard);
        const dayPlus = new Date((unixDate + data.timezone_offset + 25200 + (86400 * [i + 1])) * 1000);
        let localTime = new Date((data.current.dt + data.timezone_offset + 25200) * 1000);
        let localUnixWeekday = localTime.getDay();
        let weekdayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        let unixForecastDay = (parseInt(localUnixWeekday) + i + 1) % 7;

        let forecastDay = weekdayArray[unixForecastDay];
        
        // console.log(dayPlus);
        // console.log("is 24 hours from now at the selected location");
        $(dayCard).append('<h4>' + dayPlus.toLocaleDateString("en-US") + '</h4><br><p class="forecast-day">' + forecastDay + '</p>');
        $(dayCard).append(`<img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@4x.png" width='10px'/>`);
        $(dayCard).append("<h5>High Temp: " + Math.round(parseFloat(data.daily[i].temp.max)) + " °F</h5>");
        // console.log([i]);
        $(dayCard).append("<h5>Low Temp: " + Math.round(parseFloat(data.daily[i].temp.min)) + " °F</h5>");
        $(dayCard).append("<h5>Wind: " + Math.round(parseFloat(data.daily[i].wind_speed)) + " mph</h5>");
        $(dayCard).append("<h5>Humidity: " + data.daily[i].humidity + "%</h5>");
        $(dayCard).append("<h5>UV Index: " + data.daily[i].uvi + "%</h5>");
    }
}


// this is the search button and it's operation
searchBtn.addEventListener("click", function () {
    cityInputField = $("#fetch-field").val();
    // console.log(cityInputField);
    // console.log("is cityInputField");
    // stops process if nothing is entered
    if (cityInputField === "") {
        return;
    } else {
        weatherForecast(cityInputField);
        console.log(cityStored);
        console.log("is CityStored");
    }
});


// add the Enter button as an alternative to pressing the search button
cityInput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        // event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("searchBtn").click();
    }
});


// this loads the buttons from local storage. I think.
loadHistoryButtons();

// ngl, I added this button so I could show this one to my dad
clearEverything.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});
