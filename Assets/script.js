// Javascript goes here


const citySidebar = $("#city-sidebar");

const APIKey = "&appid=e34df904642594e0e3f3151760f273a4";
// const cityListContainer = $("#city-list-container");
var cityInputField = $("#fetch-field").val();

const searchBtn = $("#searchBtn")[0];

const currentDateTime = dayjs().format('dddd, MMMM DD YYYY, hh:mm a');
console.log(currentDateTime);
const dateTimeDisplay = $('#currentDateTime');
dateTimeDisplay.text(currentDateTime);
const currentDay = dayjs().format('dddd, MMMM DD YYYY');
console.log(currentDay);
const currentDayDisplay = $('.current-date');
currentDayDisplay.text(currentDay);
// const clearTheWeather = $('#clearEverything')[0];
// const cityHistory = $('storedCity');

var cityStored = JSON.parse(localStorage.getItem("citySearch")) || [];



// saved for later for 5-day forecast
// var OpenForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputField + '&units=imperial' + APIKey;

// function below is not called
function storeCitySearch() {
    var citySearched = cityInputField.text;
    localStorage.setItem('citySearch', JSON.stringify(citySearched));
}



function createWeatherButton() {
    var presetCityButtons = document.querySelectorAll(".cityName");
    presetCityButtons.forEach(function (historyBtn) {
        historyBtn.addEventListener("click", function (e) {
            cityInputField = e.target.innerText;
            weatherForecast(cityInputField);
        });
    });
}

function loadHistoryButtons() {
    for (let i = 0; i < cityStored.length; i++) {
        var citySearchHistory = document.createElement("button");
        citySearchHistory.setAttribute("class", "cityName historyBtn");
        citySearchHistory.textContent = cityStored[i];
        console.log("stored city is " + cityStored[i]);
        $("#storedCity").append(citySearchHistory);
        createWeatherButton();
    }
}


var retrieveCity = function (lat, lon) {
    var cityCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=908d66bc443a59edcf38648405a06695' + '&units=imperial'
    fetch(cityCall)
    .then(function (response) {
        return response.json();
    })
        .then(function (data) {
            $('.weather-icon').html(`<img src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png" />`)
            $('.city-info').html(cityInputField + " - " + currentDay);
            $('.temperature').text("Temperature: " + data.current.temp + " °F");
            $('.wind-speed').text("Wind Speed: " + data.current.wind_speed + " mph");
            $('.humidity').text("Humidity: " + data.current.wind_speed + " %");
            $('.uv-index').html ("UV Index: " + data.current.uvi);
        })

}


var weatherForecast = function (cityInputField) {
    console.log("weatherForecast's cityInputField is");
    console.log(cityInputField);
    // storeCitySearch();
    var OpenWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputField + '&units=imperial' + APIKey;
    console.log (OpenWeather);

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

// 5-day Forecast to be added


searchBtn.addEventListener("click", function () {
    cityInputField = $("#fetch-field").val();
    console.log(cityInputField);
    console.log("is cityInputField");
    weatherForecast(cityInputField);
    console.log(cityStored);
    console.log ("is CityStored");
    cityStored.push(cityInputField);

    var historyButton = document.createElement("button");
    historyButton.setAttribute("class", "cityName historyBtn");
    historyButton.textContent = cityInputField;
    $("#storedCity").append(historyButton);

    localStorage.setItem('citySearch', JSON.stringify(cityStored));
});

loadHistoryButtons();

// clearTheWeather.addEventListener("click", function () {
//     localStorage.clear();
//     cityHistory.innerHTML = "";
//   });
