// api key for open weather
var apiKey = "0d0839b84e0e9b172f262c1df9ccb1a9";

var inputCityEl=  document.querySelector("#search");
var searchFormEl = document.querySelector("#search-form");
var currentWeatherEl = document.querySelector("#current-weather");
var currentWeatherCityEl =document.querySelector("#current-weathercityname");
var currentCityTitleEl = document.querySelector("#current-city-title");
var currentWeatherInfoEl = document.querySelector("#current-weather-info");


// function to user input from search form
var formSubmitHandler = function (event) {
    event.preventDefault();
    var citySearch = inputCityEl.value.trim();

    if(citySearch) {
        getCity(citySearch)
        inputCityEl.value = "";
    } else{
        alert("Please enter a city name")
    }
    console.log(event);
}

// function to fetch city information
var getCity = function (cityName) {
  var cityApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

  fetch(cityApiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log("fetch worked")
            response.json()
            .then(function(data){
                console.log(data)

                var cityLat = data.coord.lat;
                var cityLon =  data.coord.lon;
                var nameOfInputCity= data.name;
                //console.log(cityLat);
                //console.log(cityLon);

                 // var for weather api url
                 var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon="+ cityLon +"&appid=" + apiKey + "&units=imperial";
                 fetch(weatherApiUrl)
                     .then(function(response) {
                         return response.json();
                     })
                     .then(function(data) {
                         console.log(data);
                         //console.log(nameOfInputCity);

                         // get current weather info and add to DOM
                        var currentDate = moment.unix(data.current.dt).format("MM/DD/YYYY");
                        var currentIcon = data.current.weather[0].icon;
                        var iconImgEl = document.createElement("img");
                        iconImgEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ currentIcon + "@2x.png");
                        iconImgEl.setAttribute("alt", data.current.weather[0].description);
                        //current city and date
                        currentCityTitleEl.textContent= nameOfInputCity + " " + "(" + currentDate + ")";

                        currentCityTitleEl.appendChild(iconImgEl);

                        // current city weather info- temp, wind, humidity, uv 

                        //temp
                        var tempSpanEl = document.querySelector("#temp-span");
                        var currentTempInfo = data.current.temp;
                        tempSpanEl.innerHTML= + currentTempInfo + "&#8457";

                        //wind
                        var windSpanEl = document.querySelector("#wind-span");
                        var currentWindInfo = data.current.wind_speed;
                        windSpanEl.innerHTML = + currentWindInfo + " MPH";

                        // humidity
                        var humidSpanEl = document.querySelector("#humidity-span");
                        var currentHumidInfo = data.current.humidity;
                        humidSpanEl.innerHTML = + currentHumidInfo + " %"

                        //uv
                        var uvSpanEl = document.querySelector("#uv-span");
                        var currentUvInfo = data.current.uvi;
                        uvSpanEl.innerHTML = + currentUvInfo;

                        // background for uv index depending on condition strength
                        if (currentUvInfo <= 2) {
                            uvSpanEl.className = ("p-2 bg-success rounded")
                        } else if (currentUvInfo >= 3 && currentUvInfo <=5) {
                            uvSpanEl.className = ("p-2 bg-warning")
                        } else {
                            uvSpanEl.className = ("p-2 bg-danger")                            
                        }


                    



                        





                     })

            });
        } else{
            console.log("fetch didnt work")
        }
    });
    
}    

    //city name, date, weather icon
    // temp
    //wind
    // humidity
    // uv index with color for severity




// event listener that searches for city weather data based on user input
searchFormEl.addEventListener("submit", formSubmitHandler)
