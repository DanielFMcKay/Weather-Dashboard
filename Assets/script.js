// Javascript goes here

const citySidebar = $("#city-sidebar");

const APIKey = "&appid=e34df904642594e0e3f3151760f273a4";
// const cityListContainer = $("#city-list-container");
const cityInputField = $("#fetch-field");

const searchBtn = $("#searchBtn")[0];

const currentDateTime = dayjs().format('dddd, MMMM DD YYYY, hh:mm a');
console.log(currentDateTime);
const dateTimeDisplay = $('#currentDateTime');
dateTimeDisplay.text(currentDateTime);
const currentDay = dayjs().format('dddd, MMMM DD YYYY');
console.log(currentDay);
const currentDayDisplay = $('.current-date');
currentDayDisplay.text(currentDay);


// saved for later for 5-day forecast
// var OpenForecast = "https://api.openweathermap.org/data/3.0/forecast?q=" + cityInputField + '&units=imperial' + APIKey;

function storeCitySearch() {
    var citySearched = cityInputField.text;
    localStorage.setItem('city-search', citySearched);
}



function createWeatherButton() {
    var presetCityButtons = document.querySelectorAll(".cityName");
    presetCityButtons.forEach(function (historyBtn) {
        historyBtn.addEventListener("click", function (event) {
            cityName = event.target.innerText;
            fetchWeather(cityName);
        });
    });
}

function loadHistoryButtons() {
    var cityStored = localStorage.getItem('city-search');
    for (let i = 0; i < storedCity.length; i++) {
        var citySearchHistory = document.createElement("button");
        citySearchHistory.setAttribute("class", "cityName");
        citySearchHistory.textContent = cityStored[i];
        console.log("stored city is " + cityStored[i]);
        $("#storedCity").append(citySearchHistory);
        createWeatherButton();
    }
}


var retrieveCity = function (lat, lon) {
    var targetCall = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&appid=908d66bc443a59edcf38648405a06695' + '&units=imperial'
    fetch(targetCall);
        then(function (response) {
        return response.json();
    })
    .then(function (weatherCall) {
        citySearched = cityInputField.value;
        $('.city-name').html(citySearched + " - " + currentDay.val + " " + `<img src="https://openweathermap.org/img/w/${weatherCall.current.weather[0].icon}.png" />`);

    }

    )

}


function weatherForecast() {
    storeCitySearch();
    var OpenWeather = "https://api.openweathermap.org/data/3.0/weather?q=" + cityInputField + '&units=imperial' + APIKey;

    fetch(OpenWeather)
        .then(function (response) {
            return response.json();
        })

        .then(function (weatherCall) {
            if (weatherCall.cod !== "200") {
                console.log("City not found.");
                return;
            }
            retrieveCity(weatherCall.city.coord.lat, weatherCall.city.coord.lon);
        });

}


loadHistoryButtons();
searchBtn.addEventListener('click', weatherForecast());

