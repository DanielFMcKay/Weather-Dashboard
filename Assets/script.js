// Javascript goes here


const citySidebar = $("#city-sidebar");

// this is my API key
const APIKey = "&appid=e34df904642594e0e3f3151760f273a4";

// the input field. The reason I kept "citInputField" so much is it's easier to track in de-bugging
var cityInputField = $("#fetch-field").val();


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
var fiveDayDisplay = $("#fiveDayForecast");
const clearEverything = $("#clearStorageBtn")[0];

var oneDayOut = dayjs().add(1, 'day').weekday;
console.log(oneDayOut);
console.log("is tomorrow");


// gets the array of cities stored in local storage
var cityStored = JSON.parse(localStorage.getItem("citySearch")) || [];



// saved for later for 5-day forecast
// var OpenForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputField + '&units=imperial' + APIKey;


// function below is not called, just leaving it in case I change my mind. Obviously this would be deleted if optimized
// function storeCitySearch() {
//     var citySearched = cityInputField.text;
//     localStorage.setItem('citySearch', JSON.stringify(citySearched));
// }



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

// loads the search history and the buttons to check the weather for it. Maximum 20 buttons (I think).
function loadHistoryButtons() {
    for (let i = 0; i < cityStored.length && i < 21; i++) {
        var citySearchHistory = document.createElement("button");
        citySearchHistory.setAttribute("class", "cityName historyBtn");
        citySearchHistory.textContent = cityStored[i];
        console.log("stored city is " + cityStored[i]);
        $("#storedCity").append(citySearchHistory);
        createWeatherButton();
    }
}


// this works in concert with the weatherForecast function to target the specific city requested and return the data for it
var retrieveCity = function (lat, lon) {
    var cityCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=908d66bc443a59edcf38648405a06695' + '&units=imperial'
    fetch(cityCall)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // by the way, you can change the icon size somewhat by adding "@2x" or "@4x" before the ".png"
            $('.weather-icon').html(`<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png" />`)
            $('.city-info').html(cityInputField + " - " + currentDay);
            $('.temperature').text("Temperature: " + data.current.temp + " °F");
            $('.wind-speed').text("Wind Speed: " + data.current.wind_speed + " mph");
            $('.humidity').text("Humidity: " + data.current.humidity + "%");
            $('.uv-index').html("UV Index: " + data.current.uvi);
            fiveDayForecast(data);

        })
}



// this function gets makes the initial call to get the city's geographic coordinates
var weatherForecast = function (cityInputField) {
    console.log("weatherForecast's cityInputField is");
    console.log(cityInputField);

    var OpenWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputField + '&units=imperial' + APIKey;
    console.log(OpenWeather);

    fetch(OpenWeather)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            if (data.cod !== "200") {
                console.log("City not found.");
                return;
            }
            retrieveCity(data.city.coord.lat, data.city.coord.lon);
        });

};

// making the functions come from variables allows more flexibility in the order in how I list them, by the way

var fiveDayForecast = function (data) {
    $('#fiveDayForecast').empty();
    var unixDate = data.current.dt;
    for (let i = 0; i < 5; i++) {
        var dayCard = $("<div class='row forecast5Card'><div/>");
        $(fiveDayDisplay).append(dayCard);
        var dayPlus = new Date((unixDate + (86400 * [i])) * 1000);
        $(dayCard).append('<h4>' + dayPlus.toLocaleDateString("en-US") + '</h4>');
        $(dayCard).append(`<img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@4x.png"/>`);
        $(dayCard).append("<h5>High temp: " + data.daily[i].temp.max + " °F</h5>");
        console.log([i]);
        $(dayCard).append("<h5>Low temp: " + data.daily[i].temp.min + " °F</h5>");
        $(dayCard).append("<h5>Wind: " + data.daily[i].wind_speed + " mph</h5>");
        $(dayCard).append("<h5>Humidity: " + data.daily[i].humidity + "%</h5>");
        $(dayCard).append("<h5>UV Index: " + data.daily[i].uvi + "%</h5>");
    }
}



searchBtn.addEventListener("click", function () {
    cityInputField = $("#fetch-field").val();
    console.log(cityInputField);
    console.log("is cityInputField");
    weatherForecast(cityInputField);
    console.log(cityStored);
    console.log("is CityStored");
    cityStored.push(cityInputField);

    var historyButton = document.createElement("button");
    historyButton.setAttribute("class", "cityName historyBtn");
    historyButton.textContent = cityInputField;
    $("#storedCity").append(historyButton);

    localStorage.setItem('citySearch', JSON.stringify(cityStored));
});

// this loads the buttons from local storage. I think.
loadHistoryButtons();

// ngl, I added this button so I could show this one to my dad
clearEverything.addEventListener("click", function () {
    localStorage.clear();
    $('#fiveDayForecast').innerHTML="";
  });
