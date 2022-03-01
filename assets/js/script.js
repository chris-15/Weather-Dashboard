// api key for open weather
var apiKey = "0d0839b84e0e9b172f262c1df9ccb1a9";

var inputCityEl=  document.querySelector("#search");
var searchFormEl = document.querySelector("#search-form");
var currentWeatherEl = document.querySelector("#current-weather");
var currentWeatherCityEl =document.querySelector("#current-weathercityname");
var currentCityTitleEl = document.querySelector("#current-city-title");
var currentWeatherInfoEl = document.querySelector("#current-weather-info");
var forecastCardContainerEl = document.querySelector("#card-container");

// function to user input from search form
var formSubmitHandler = function (event) {
    event.preventDefault();
    var citySearch = inputCityEl.value.trim();

    if(citySearch) {
        getCity(citySearch)
        inputCityEl.value = "";
        cardDivEl.remove();
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
                            uvSpanEl.className = ("p-2 bg-warning rounded")
                        } else {
                            uvSpanEl.className = ("p-2 bg-danger rounded")                            
                        };

                        for (i=1; i<6; i++) {
                            //console.log(data.daily[i])
                            //create all items for weather card
                            var cardDivEl = document.createElement("div");
                            cardDivEl.className = ("card text-white bg-primary")
                            cardDivEl.setAttribute = ("style", "width: 18rem");
                            forecastCardContainerEl.appendChild(cardDivEl);
                            
                            //date for each day of forecast card
                            var cardHeaderEl = document.createElement("div");
                            cardHeaderEl.className = ("card-header border-0");
                            cardHeaderEl.textContent= moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
                            cardDivEl.appendChild(cardHeaderEl);

                            var cardListEl = document.createElement("ul");
                            cardListEl.className=("list-group list-group-flush");
                            cardDivEl.appendChild(cardListEl);
                            
                            //img icon for forecast
                            var imgListItemEl= document.createElement("li");
                            imgListItemEl.className = ("list-group-item border-0")
                            var forecastImgIconEl= document.createElement("img");
                            var forecastIcon = data.daily[i].weather[0].icon;
                            forecastImgIconEl.setAttribute("src", "http://openweathermap.org/img/wn/"+ forecastIcon + "@2x.png");
                            forecastImgIconEl.setAttribute("alt", data.daily[i].weather[0].description);
                            imgListItemEl.appendChild(forecastImgIconEl);
                            cardListEl.appendChild(imgListItemEl);

                            //temp for forecast
                            var tempListItemEl= document.createElement("li");
                            tempListItemEl.className = ("list-group-item border-0");
                            forecastTemp = data.daily[i].temp.max;
                            tempListItemEl.innerHTML= "Temp: " + forecastTemp + "&#8457";
                            cardListEl.appendChild(tempListItemEl);

                            //wind for forecast
                            var windListItemEl= document.createElement("li");
                            windListItemEl.className = ("list-group-item border-0");
                            forecastWind = data.daily[i].wind_speed;
                            windListItemEl.innerHTML= "Wind: " + forecastWind + "MPH";
                            cardListEl.appendChild(windListItemEl);

                            //humidity for forecast
                            var humidListItemEl= document.createElement("li");
                            humidListItemEl.className = ("list-group-item border-0");
                            forecastHumid = data.daily[i].humidity;
                            humidListItemEl.innerHTML= "Humidity: " + forecastHumid + "%";
                            cardListEl.appendChild(humidListItemEl);
                        }


                     })

            });
        } else{
            console.log("fetch didnt work")
        }
    });
    
}    


// event listener that searches for city weather data based on user input
searchFormEl.addEventListener("submit", formSubmitHandler)
