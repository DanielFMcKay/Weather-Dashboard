// Javascript goes here.

const citySidebar = $("#city-sidebar");

// modal
const notFound = document.getElementById("placeNotFound");
notFound.style.display = "none";
const closeError = $(".close-error")[0];

closeError.onclick = function () {
    notFound.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == notFound) {
        notFound.style.display = "none";
    }
}

// allows Esc to close the Not Found modal if still in the city input text field
$('#fetch-field').keydown(function(event) { 
    if (event.key === 'Escape' ) { 
      notFound.style.display = "none";
    }
  });

// this is my API key
const APIKey = "&appid=e34df904642594e0e3f3151760f273a4";

// the input field. The reason I kept "citInputField" is it's easier to track in de-bugging.
let cityInputField = $("#fetch-field").val();

// for use with directly pressing the Enter button
let cityInput = $("#fetch-field")[0];


const searchBtn = $("#searchBtn")[0];

// jsdays makes time formatting easier and also flexible. Even if I'm just using it for the local time clock.
const currentDateTime = dayjs().format('dddd, MMMM DD YYYY, hh:mm a');
console.log(currentDateTime);
const dateTimeDisplay = $('#currentDateTime');
dateTimeDisplay.text(currentDateTime);



const multiDayDisplay = $("#multiDayForecast");
const clearEverything = $("#clearStorageBtn")[0];

const clearLast = $(".clear-last")[0];
const clearOldest = $(".clear-oldest");
clearOldest.hide();
// Links the constant cityStored to the array of places stored in local storage. Can also be an empty array if none are stored.
var cityStored = JSON.parse(localStorage.getItem('citySearch')) || [];
// const deleteStored = JSON.parse(localStorage.getItem('deleteSearch')) || [];

// function below worked, but was creating a feedback loop in the button attributes as they were being created

// setWeatherBtnAttributes is the function that gives all created or recalled buttons the attribute to be 
// clicked and call the weather
// function setWeatherBtnAttributes() {
//     let presetCityButtons = document.querySelectorAll(".historyBtn");
//     presetCityButtons.forEach(function (historyBtn) {
//         historyBtn.addEventListener("click", function (e) {
//             cityInputField = e.target.innerText;
//             console.log("button created once");
//             weatherForecast(cityInputField);
//         });
//     });
// }

// Loads the search history and the buttons to check the weather for it. Maximum 32 buttons.
// Only the 32 most recent searches are called and the buttons are displayed from most to least recent.
// If that number is exceeded, then in another part of the script the oldest one is removed as the newest one is created.
function loadHistoryButtons() {
    for (let i = cityStored.length - 1; i > (cityStored.length - 32) && i >= 0; i--) {
        const buttonPair = document.createElement("div");
        const historyButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        historyButton.setAttribute("class", "historyBtn");
        deleteButton.setAttribute("class", "deleteBtn");
        deleteButton.textContent = '✕';
        buttonPair.setAttribute("class", "row")
        buttonPair.setAttribute("class", "historyBtnRow")
        historyButton.textContent = cityStored[i];
        console.log("location " + (i + 1) + " is " + cityStored[i] + ".");
        
        $("#storedCity").append(buttonPair);
        buttonPair.append(deleteButton);
        buttonPair.append(historyButton);

        historyButton.addEventListener("click", function (e) {
            cityInputField = e.target.innerText;
            console.log("history button(s) created");
            weatherForecast(cityInputField);
        });

        let deleteName = cityStored[i];
        deleteButton.addEventListener("click", function () {

            console.log(deleteName + " deleted");
            let newCityStored = cityStored.filter(item => item !== deleteName);
            cityStored = newCityStored;
            buttonPair.remove();
            localStorage.setItem('citySearch', JSON.stringify(cityStored));
         });
    }
};


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
            let weekdayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let localWeekday = weekdayArray[localUnixWeekday];



            // Celsius conversions for select readouts
            let currentCelsius = Math.round(parseFloat(((data.current.temp - 32) * 5 / 9)));
            let hiCelsius = Math.round(parseFloat(((Math.round(parseFloat(data.daily[0].temp.max)) - 32) * 5 / 9)));
            let loCelsius = Math.round(parseFloat(((Math.round(parseFloat(data.daily[0].temp.min)) - 32) * 5 / 9)));
            let feelsLikeCelsius = Math.round(parseFloat(((Math.round(parseFloat(data.current.feels_like)) - 32) * 5 / 9)));



            // rounding UVI to one decimal point, also putting it in a variable to more easily trigger an advisory alert
            let currentUvi = (Math.round(data.current.uvi * 10) / 10);
            let bigTemp = Math.round(parseFloat(data.current.temp));
            let windGust = Math.round(parseFloat(data.hourly[0].wind_gust));

            let sunriseRawData = new Date((data.current.sunrise + data.timezone_offset + 25200) * 1000);
            let sunriseTime = sunriseRawData.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
            console.log("The sun rises today at " + sunriseTime);
            let sunsetRawData = new Date((data.current.sunset + data.timezone_offset + 25200) * 1000);
            // console.log("sunsetRawData is " + sunsetRawData)
            let sunsetTime = sunsetRawData.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
            console.log("The sun sets today at " + sunsetTime);

            // polar winter / polar summer exception
            if (sunsetTime === 'Invalid Date') { sunsetTime = 'N/A' };
            if (sunriseTime === 'Invalid Date') { sunriseTime = 'N/A' };


            $('.weather-icon').html(`<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png"/>`)


            // Wind Direction
            let compass;
            windDirect = data.current.wind_deg;
            // console.log("wind_deg is " + windDirect);

            if (windDirect >= 349) { compass = "S" }
            else if (windDirect >= 327) { compass = "SSE" }
            else if (windDirect >= 304) { compass = "SE" }
            else if (windDirect >= 282) { compass = "ESE" }
            else if (windDirect >= 259) { compass = "E" }
            else if (windDirect >= 237) { compass = "ENE" }
            else if (windDirect >= 214) { compass = "NE" }
            else if (windDirect >= 192) { compass = "NNE" }
            else if (windDirect >= 169) { compass = "N" }
            else if (windDirect >= 147) { compass = "NNW" }
            else if (windDirect >= 124) { compass = "NW" }
            else if (windDirect >= 102) { compass = "WNW" }
            else if (windDirect >= 79) { compass = "W" }
            else if (windDirect >= 57) { compass = "WSW" }
            else if (windDirect >= 34) { compass = "SW" }
            else if (windDirect >= 12) { compass = "SSW" }
            else if (windDirect <= 11) { compass = "S" }
            else console.log("wtf wind");

            let currentConditions = data.current.weather[0].description
            if (data.current.weather[0].description === "overcast clouds") {
                currentConditions = "Overcast"
            } else if (data.current.weather[0].description === "broken clouds") {
                currentConditions = "Mostly Cloudy"
            } else if (data.current.weather[0].description === "scattered clouds") {
                currentConditions = "Partly Cloudy"
            } else if (data.current.weather[0].description === "few clouds") {
                currentConditions = "Mostly Clear"
            } else if (data.current.weather[0].description === "clear sky") {
                currentConditions = "Clear Skies"
            } else if (data.current.weather[0].description === "haze") {
                currentConditions = "Hazy"
            } else if (data.current.weather[0].description === "smoke") {
                currentConditions = "Smoke"
            } else if (data.current.weather[0].description === "fog") {
                currentConditions = "Fog"
            } else if (data.current.weather[0].description === "mist") {
                currentConditions = "Mist"
            } else if (data.current.weather[0].description === "dust") {
                currentConditions = "Dust Storms"
            } else if (data.current.weather[0].description === "light intensity shower rain") {
                currentConditions = "Light Showers"
            } else if (data.current.weather[0].description === "shower rain") {
                currentConditions = "Showers"
            } else if (data.current.weather[0].description === "light rain") {
                currentConditions = "Light Rain"
            } else if (data.current.weather[0].description === "moderate rain") {
                currentConditions = "Rain"
            } else if (data.current.weather[0].description === "heavy intensity rain") {
                currentConditions = "Heavy Rain"
            } else if (data.current.weather[0].description === "extreme rain") {
                currentConditions = "Torrential Rain"
            } else if (data.current.weather[0].description === "freezing rain") {
                currentConditions = "Freezing Rain"
            } else if (data.current.weather[0].description === "thunderstorm with rain") {
                currentConditions = "Thunderstorms"
            } else if (data.current.weather[0].description === "thunderstorm") {
                currentConditions = "Thunderstorms"
            } else if (data.current.weather[0].description === "snow") {
                currentConditions = "Snow"
            } else if (data.current.weather[0].description === "light snow") {
                currentConditions = "Light Snow"
            } else if (data.current.weather[0].description === "sleet") {
                currentConditions = "Sleet"
            } else if (data.current.weather[0].description === "tornado") {
                currentConditions = "Tornado Warning"
                $('.heat-warning').append('<h6>/!&#92; Tornado Warning /!&#92;</h6>');
            }



            //  local Date
            $('.local-date').html(localTime.toLocaleDateString("en-US"));
            $('.local-weekday').text(localWeekday);
            $('.big-temp').html("<p class='big-temp'>" + Math.round(parseFloat(data.current.temp)) + '<small>°F</small>');
            $('.temperature').html("<h3>Currently: " + bigTemp + "<small>°F</small> (" + currentCelsius + "<small>°C</small>)</h3>");
            // Heat advisory
            if (bigTemp >= 100) {
                $('.heat-warning').html("Extreme Heat Advisory");
            }
            $('.wind-speed').text("Wind: " + Math.round(parseFloat(data.current.wind_speed)) + " mph (" + compass + ")");
            $('.humidity').text("Humidity: " + Math.round(parseFloat(data.current.humidity)) + "%");
            $('.uv-index').html("UV Index: " + currentUvi);
            if (currentUvi >= 11) {
                $('.uvi-warning').append("<h6>Extreme UVI Warning</h6>");
            }

            // timezone-offset is not currently called
            // Why does unix time start in PST???? Anyway, I added 7 hours worth of seconds before the offset.
            $('.timezone-offset').html("Location's Timezone: UTC " + ((data.timezone_offset) / 3600));

            // local Time
            $('.local-time').html("<p class='altShade'>Local Time: " + localTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true }) + "</p>");
            $('.current-conditions').html("<p class='altShade'>Current Conditions: " + currentConditions + "</p>");
            $('.hi-temp').html("<p class='altShade'>Today's High Temp: " + Math.round(parseFloat(data.daily[0].temp.max)) + "<small>°F</small> (" + hiCelsius + "<small>°C</small>)</p>");
            $('.lo-temp').html("<p class='altShade'>Today's Low Temp: " + Math.round(parseFloat(data.daily[0].temp.min)) + "<small>°F</small> (" + loCelsius + "<small>°C</small>)</p>");
            $('.feels-like').html("<p class='altShade'>Currently Feels Like: " + Math.round(parseFloat(data.current.feels_like)) + "<small>°F</small> (" + feelsLikeCelsius + "<small>°C</small>)</p>");
            $('.wind-note').text("");

            // Not Yet called
            // Info Column 3
            $('.wind-gust').text("Wind Gusts up to: " + Math.round(parseFloat(data.hourly[0].wind_gust)) + " mph")
            if (windGust >= 50) {
                $('.uvi-warning').append("<h6>Extreme Wind Gust Warning</h6>");
            }
            $('.sunrise').html("Sunrise: " + sunriseTime);
            $('.sunset').text("Sunset: " + sunsetTime);



            if (cityStored.length >= 2) {
                clearOldest.show();
            }
            multiHourForecast(data);
            multiDayForecast(data);
        })
}



// this function gets makes the initial call to get the city's geographic coordinates
const weatherForecast = function (cityInputField) {
    // console.log("weatherForecast's cityInputField is");
    // console.log(cityInputField);


    const openWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputField + '&units=imperial&lang=en' + APIKey;
    // console.log(openWeather);
    // console.log("is openWeather")



    fetch(openWeather)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            if (data.cod !== "200") {
                console.log("Place Not Found");

                notFound.style.display = "block";;

                // window.alert("Place Not Found");
                return;
            }
            console.log("a call was made");

            $('.heat-warning').empty();
            $('.uvi-warning').empty();

            retrieveCity(data.city.coord.lat, data.city.coord.lon);
            let placeName = data.city.name;

            let nationName = data.city.country;

            // Country code conversion for select nations.
            // I'd probably actually wanna put this in another file in the future.
            // Most people don't know ISO-2 country codes, and I wanted to make the readout more accessible at least
            if (data.city.country === "US") {
                nationName = "United States"
            } else if (data.city.country === "CA") {
                nationName = "Canada"
            } else if (data.city.country === "AF") {
                nationName = "Afghanistan"
            } else if (data.city.country === "DZ") {
                nationName = "Algeria"
            } else if (data.city.country === "AQ") {
                nationName = "Antarctica"
            } else if (data.city.country === "AR") {
                nationName = "Argentina"
            } else if (data.city.country === "AU") {
                nationName = "Australia"
            } else if (data.city.country === "BD") {
                nationName = "Bangladesh"
            } else if (data.city.country === "BS") {
                nationName = "The Bahamas"
            } else if (data.city.country === "BE") {
                nationName = "Belgium"
            } else if (data.city.country === "BR") {
                nationName = "Brazil"
            } else if (data.city.country === "CL") {
                nationName = "Chile"
            } else if (data.city.country === "CN") {
                nationName = "China"
            } else if (data.city.country === "CZ") {
                nationName = "Czechia"
            } else if (data.city.country === "CO") {
                nationName = "Colombia"
            } else if (data.city.country === "CD") {
                nationName = "Congo, DR"
            } else if (data.city.country === "CI") {
                nationName = "Côte D'Ivoire"
            } else if (data.city.country === "CU") {
                nationName = "Cuba"
            } else if (data.city.country === "DK") {
                nationName = "Denmark"
            } else if (data.city.country === "EG") {
                nationName = "Egypt"
            } else if (data.city.country === "ET") {
                nationName = "Ethiopia"
            } else if (data.city.country === "FR") {
                nationName = "France"
            } else if (data.city.country === "DE") {
                nationName = "Germany"
            } else if (data.city.country === "GT") {
                nationName = "Guatemala"
            } else if (data.city.country === "FI") {
                nationName = "Finland"
            } else if (data.city.country === "IS") {
                nationName = "Iceland"
            } else if (data.city.country === "IN") {
                nationName = "India"
            } else if (data.city.country === "ID") {
                nationName = "Indonesia"
            } else if (data.city.country === "IR") {
                nationName = "Iran"
            } else if (data.city.country === "IQ") {
                nationName = "Iraq"
            } else if (data.city.country === "IE") {
                nationName = "Ireland"
            } else if (data.city.country === "IL") {
                nationName = "Israel"
            } else if (data.city.country === "IT") {
                nationName = "Italy"
            } else if (data.city.country === "JM") {
                nationName = "Jamaica"
            } else if (data.city.country === "JP") {
                nationName = "Japan"
            } else if (data.city.country === "KE") {
                nationName = "Kenya"
            } else if (data.city.country === "LY") {
                nationName = "Libya"
            } else if (data.city.country === "MY") {
                nationName = "Malaysia"
            } else if (data.city.country === "MX") {
                nationName = "Mexico"
            } else if (data.city.country === "NL") {
                nationName = "The Netherlands"
            } else if (data.city.country === "NZ") {
                nationName = "New Zealand"
            } else if (data.city.country === "NG") {
                nationName = "Nigeria"
            } else if (data.city.country === "NO") {
                nationName = "Norway"
            } else if (data.city.country === "PK") {
                nationName = "Pakistan"
            } else if (data.city.country === "PE") {
                nationName = "Peru"
            } else if (data.city.country === "PH") {
                nationName = "Philippines"
            } else if (data.city.country === "PL") {
                nationName = "Poland"
            } else if (data.city.country === "PT") {
                nationName = "Portugal"
            } else if (data.city.country === "PR") {
                nationName = "Puerto Rico"
            } else if (data.city.country === "RO") {
                nationName = "Romania"
            } else if (data.city.country === "RU") {
                nationName = "Russia"
            } else if (data.city.country === "SA") {
                nationName = "Saudi Arabia"
            } else if (data.city.country === "ZA") {
                nationName = "South Africa"
            } else if (data.city.country === "KR") {
                nationName = "South Korea"
            } else if (data.city.country === "ES") {
                nationName = "Spain"
            } else if (data.city.country === "SD") {
                nationName = "Sudan"
            } else if (data.city.country === "SE") {
                nationName = "Sweden"
            } else if (data.city.country === "CH") {
                nationName = "Switzerland"
            } else if (data.city.country === "TH") {
                nationName = "Thailand"
            } else if (data.city.country === "TW") {
                nationName = "Taiwan"
            } else if (data.city.country === "TZ") {
                nationName = "Tanzania"
            } else if (data.city.country === "TR") {
                nationName = "Turkey"
            } else if (data.city.country === "UA") {
                nationName = "Ukraine"
            } else if (data.city.country === "GB") {
                nationName = "United Kingdom"
            } else if (data.city.country === "VN") {
                nationName = "Vietnam"
            }

            $('.city-info').html(placeName + ", " + nationName);

            // catch for duplicate entries below
            for (let i = 0; i < cityStored.length; i++) {
                // console.log(cityStored[i]);
                if (cityInputField === cityStored[i]) {
                    console.log("no duplicates allowed!");
                    return;
                }
            }

            // below pushes the new location to the array of stored locations and makes a new button for it
            cityStored.push(cityInputField);

            const buttonPair = document.createElement("div");
            const historyButton = document.createElement("button");
            const deleteButton = document.createElement("button");
            historyButton.setAttribute("class", "historyBtn");
            deleteButton.setAttribute("class", "deleteBtn");
            deleteButton.textContent = '✕';
            buttonPair.setAttribute("class", "row")
            buttonPair.setAttribute("class", "historyBtnRow")
            historyButton.textContent = cityInputField;
            $("#storedCity").prepend(buttonPair);

            buttonPair.append(deleteButton);
            buttonPair.append(historyButton);

            historyButton.addEventListener("click", function (e) {
                cityInputField = e.target.innerText;
                weatherForecast(cityInputField);
            });
            console.log("a new button was created");

            localStorage.setItem('citySearch', JSON.stringify(cityStored));


            deleteButton.addEventListener("click", function () {
                let deleteName = cityInputField;
                
                console.log(deleteName + " deleted");
                let newCityStored = cityStored.filter(item => item !== deleteName);
                cityStored = newCityStored;
                buttonPair.remove();
                localStorage.setItem('citySearch', JSON.stringify(cityStored));
             });
             
            // if there are more than 32 buttons, the oldest one will be removed
            if (cityStored.length > 32) {
                cityStored.splice(0, 1)
                localStorage.setItem('citySearch', JSON.stringify(cityStored));
                console.log("oldest search automatically removed due to cap");
                $('.historyBtn')[32].remove();
            }
        });
};

// making the functions come from variables allows more flexibility in the order in how I list them, it would seem

// this is for the Five Day Forecast
const multiDayForecast = function (data) {
    $('#multiDayForecast').empty();
    $('.multiDayTitle').text("6 Day Forecast")
    const unixDate = data.current.dt;
    for (let i = 0; i < 6; i++) {
        const dayCard = $("<div class='row forecastMultiCard'><div/>");
        $(multiDayDisplay).append(dayCard);
        const dayPlus = new Date((unixDate + data.timezone_offset + 25200 + (86400 * [i + 1])) * 1000);
        let localTime = new Date((data.current.dt + data.timezone_offset + 25200) * 1000);
        let localUnixWeekday = localTime.getDay();
        let weekdayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let unixForecastDay = (parseInt(localUnixWeekday) + i + 1) % 7;

        let forecastDay = weekdayArray[unixForecastDay];

        let dailyMaxUvi = (Math.round(data.daily[i].uvi * 10) / 10);

        let dailyHiTemp = Math.round(parseFloat(data.daily[i].temp.max));

        $(dayCard).append('<h4>' + dayPlus.toLocaleDateString("en-US") + '</h4><br><p class="forecast-day">' + forecastDay + '</p>');
        $(dayCard).append(`<img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@4x.png" width='10px'/>`);
        $(dayCard).append("<h5>High Temp: " + dailyHiTemp + " °F</h5>");
        // console.log([i]);
        $(dayCard).append("<h5>Low Temp: " + Math.round(parseFloat(data.daily[i].temp.min)) + " °F</h5>");
        $(dayCard).append("<h5>Wind: " + Math.round(parseFloat(data.daily[i].wind_speed)) + " mph</h5>");
        $(dayCard).append("<h5>Humidity: " + data.daily[i].humidity + "%</h5>");
        $(dayCard).append("<h5>Max UV Index: " + dailyMaxUvi + "</h5>");


    }
}

// Hourly Forecast function for up to 12 hours out
const multiHourForecast = function (data) {
    $(".hourlyForecast1").empty();
    $(".hourlyForecast2").empty();
    $(".hourlyTemp1").empty();
    $(".hourlyTemp2").empty();
    $(".hourlyIcon1").empty();
    $(".hourlyIcon2").empty();


    $(".hourlyTitle").text("12 Hour Forecast");
    const hourlyForecast1 = $(".hourlyForecast1");
    const hourlyForecast2 = $(".hourlyForecast2");
    const hourlyTemp1 = $(".hourlyTemp1");
    const hourlyTemp2 = $(".hourlyTemp2");
    const hourlyIcon1 = $(".hourlyIcon1");
    const hourlyIcon2 = $(".hourlyIcon2");
    for (let i = 1; i < 13; i++) {
        let unixNextHour = ((data.hourly[i].dt + data.timezone_offset + 25200));
        let nextHumanHour = new Date((unixNextHour) * 1000);
        let nextMetricHour = nextHumanHour.getHours();
        // changes to 12-hour format with AM and PM
        let nextImperialHour = nextMetricHour % 12 || 12;
        let antiPostMeridian = nextMetricHour < 12 ? 'AM' : 'PM';

        // I wantet two columns and also for the temperature reading to stand out, so it became four columns
        if (i < 7) {
            $(hourlyForecast1).append("<h5>" + nextImperialHour + " <small>" + antiPostMeridian + "</small>: </h5>");
            $(hourlyTemp1).append("<h5><strong>" + Math.round(parseFloat(data.hourly[i].temp)) + "<small>°F</small></strong></h5>")
            $(hourlyIcon1).append(`<img src="https://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@4x.png" width='30px' class='icon-align'/>`)
        }
        else if (i < 13) {
            $(hourlyForecast2).append("<h5>" + nextImperialHour + " <small>" + antiPostMeridian + "</small>: </h5>");
            $(hourlyTemp2).append("<h5><strong>" + Math.round(parseFloat(data.hourly[i].temp)) + "<small>°F</small></strong></h5>")
            $(hourlyIcon2).append(`<img src="https://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@4x.png" width='27px' class='icon-align'/>`)
        }
    }
}


// this is the search button and its operation (it's pretty simple)
searchBtn.addEventListener("click", function () {
    cityInputField = $("#fetch-field").val();
    // stops process if nothing is entered
    if (cityInputField === "") {
        return;
    } else {
        weatherForecast(cityInputField);
    }
});


// adds the Enter key as an alternative to clicking the search button
cityInput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Trigger the button element with a click
        document.getElementById("searchBtn").click();
    }
});


// this loads the buttons from local storage. I think.
loadHistoryButtons();

console.log("There are " + cityStored.length + " locations stored.");
console.log("Your array of stored cities is below");
console.log(cityStored);



// clears all buttons and storage and reloads the page
clearEverything.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});

// clears most recent search including its button and reloads the page
// button is now obsolete, but not hurting anything plus it looks nice, so I'm keeping it for now
clearLast.addEventListener("click", function () {
    cityStored.splice((cityStored.length - 1), 1);
    localStorage.setItem('citySearch', JSON.stringify(cityStored));
    $('.historyBtn')[0].remove();
    $('.deleteBtn')[0].remove();
    console.log("most recent button removed");
});

if (cityStored.length >= 2) {
    clearOldest.show();
}

// clears oldest search in the array and button at the bottom of the list
// button is now obsolete, but not hurting anything plus it looks nice, so I'm keeping it for now
clearOldest[0].addEventListener("click", function () {
    let i = cityStored.length;
    cityStored.splice(0, 1);
    localStorage.setItem('citySearch', JSON.stringify(cityStored));
    $('.historyBtn')[i - 1].remove();
    $('.deleteBtn')[i - 1].remove();
    console.log("oldest button removed");
});
