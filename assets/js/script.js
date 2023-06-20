// api key for open weather
var apiKey = "0d0839b84e0e9b172f262c1df9ccb1a9";

var inputCityEl = document.querySelector("#search");
var searchFormEl = document.querySelector("#search-form");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastTitleDivEl= document.querySelector("#forecast-title");
var forecastCardContainerEl = document.querySelector("#card-container");
var searchHistoryContainerEl = document.querySelector("#search-history");

// holds array for searches stored in local storage
var historyCityList= localStorage.getItem("userSearchTerm")?JSON.parse(localStorage.getItem("userSearchTerm")):[ ];

// function to handle user input from search form
// also save to local storage and add button to history section
var formSubmitHandler = function (event) {
  event.preventDefault();
  var citySearch = inputCityEl.value.trim();

  // only pushes to array if it has a value, blanks not added to array
  if (citySearch){
    historyCityList.push(citySearch)
  }
  
  
  localStorage.setItem("userSearchTerm", JSON.stringify(historyCityList));

  if (citySearch) {
    getCity(citySearch);
    newSearchAddButton(citySearch);
    inputCityEl.value = "";
  } else {
    alert("Please enter a city name");
  }
  //console.log(event);
};

//function to handle history button click
var historyButtonClickHandler = function(event) {
  console.log(event.target.textContent)
  cityBtn= event.target.textContent;
  getCity(cityBtn)
}



// function to add new button to history div when search is conducted
var newSearchAddButton = function() {
  var newSearchButtonEl = document.createElement("button");
  newSearchButtonEl.setAttribute("type","click");
  newSearchButtonEl.className = "col-12 btn-lg btn-secondary mt-2"
  newSearchButtonEl.textContent= inputCityEl.value.trim();
  searchHistoryContainerEl.appendChild(newSearchButtonEl);
}

//function to load local storage
var loadSearchHistory = function() {
  for (i=0; i<historyCityList.length; i++) {
    var historyItemEl = document.createElement("button");
    historyItemEl.setAttribute("type","click");
    historyItemEl.className= "col-12 btn-lg btn-secondary mt-2"
    searchHistoryContainerEl.appendChild(historyItemEl);
    historyItemEl.textContent=(historyCityList[i]);
  }
}

// function to fetch weather information and add content dynamically
var getCity = function (cityName) {
  var cityApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;

  fetch(cityApiUrl).then(function (response) {
    if (response.ok) {
      console.log("fetch workded");
      response.json().then(function (data) {
        console.log(data);

        var cityLat = data.coord.lat;
        var cityLon = data.coord.lon;
        var nameOfInputCity = data.name;
        //console.log(cityLat);
        //console.log(cityLon);

        // var for weather api url
        var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey + "&units=imperial";
        
        fetch(weatherApiUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            //console.log(nameOfInputCity);

            // clears dynamically created elements in forecast when new search is conducted
            currentWeatherEl.innerHTML = "";
            forecastCardContainerEl.innerHTML = "";
            forecastTitleDivEl.innerHTML = "";

            // get current weather info and add to DOM
            // add border for current weather
            currentWeatherEl.className= "border border-dark mt-2"

            //use moment to get date formatted 
            var currentDate = moment.unix(data.current.dt).format("MM/DD/YYYY");
            var currentIcon = data.current.weather[0].icon;
            var iconImgEl = document.createElement("img");
            iconImgEl.setAttribute("src","http://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
            iconImgEl.setAttribute("alt", data.current.weather[0].description);
            
            //display current city and date
            var currentCityDivEl= document.createElement("div");
            currentCityDivEl.className = "d-flex justify-content-start align-items-center";
            currentWeatherEl.appendChild(currentCityDivEl);
            var currentCityTitleEl= document.createElement("h1");
            currentCityTitleEl.textContent = nameOfInputCity + " " + "(" + currentDate + ")";
            currentCityDivEl.appendChild(currentCityTitleEl);
            currentCityTitleEl.appendChild(iconImgEl);


            // current city weather info- temp, wind, humidity, uv
            var currentWeatherInfoDivEl= document.createElement("div");
            currentWeatherEl.appendChild(currentWeatherInfoDivEl);
            //temp
            var tempEl = document.createElement("p");
            var currentTempInfo = data.current.temp;
            tempEl.innerHTML= "Temp: "+ currentTempInfo + "&#8457";
            currentWeatherInfoDivEl.appendChild(tempEl);
            //wind
            var windEl = document.createElement("p");
            var currentWindInfo = data.current.wind_speed;
            windEl.innerHTML = "Wind: " + currentWindInfo + " MPH";
            currentWeatherInfoDivEl.appendChild(windEl);
            //humidity
            var humidEl = document.createElement("p");
            var currentHumidInfo = data.current.humidity;
            humidEl.innerHTML = "Humidity: " + currentHumidInfo + " %"
            currentWeatherInfoDivEl.appendChild(humidEl);
            //uv
            var uvEl = document.createElement("p");
            var currentUvInfo = data.current.uvi;
            uvEl.innerHTML = "UV Index: ";
            var uvSpanEl= document.createElement("span");
            uvSpanEl.textContent = currentUvInfo;
            uvEl.appendChild(uvSpanEl);
            currentWeatherInfoDivEl.appendChild(uvEl);

            // background for uv index depending on condition strength
            if (currentUvInfo <= 2) {
              uvSpanEl.className = "p-2 bg-success rounded";
            } else if (currentUvInfo > 2 && currentUvInfo <= 5) {
              uvSpanEl.className = "p-2 bg-warning rounded";
            } else {
              uvSpanEl.className = "p-2 bg-danger rounded";
            }

            //add title for 5 day forecast
            var fiveDayTitleEl = document.createElement("h2");
            fiveDayTitleEl.innerHTML = "5 Day Forecast"
            forecastTitleDivEl.appendChild(fiveDayTitleEl);


            // for loop for 5 day forecast
            for (i = 1; i < 6; i++) {
              //create all items for weather card
              var cardDivEl = document.createElement("div");
              cardDivEl.className = "card text-white bg-primary mb-2";
              cardDivEl.setAttribute = ("style", "width: 18rem");
              forecastCardContainerEl.appendChild(cardDivEl);

              //date for each day of forecast card
              var cardHeaderEl = document.createElement("div");
              cardHeaderEl.className = "card-header border-0";
              cardHeaderEl.textContent = moment
                .unix(data.daily[i].dt)
                .format("MM/DD/YYYY");
              cardDivEl.appendChild(cardHeaderEl);

              var cardListEl = document.createElement("ul");
              cardListEl.className = "list-group list-group-flush";
              cardDivEl.appendChild(cardListEl);

              //img icon for forecast
              var imgListItemEl = document.createElement("li");
              imgListItemEl.className = "list-group-item border-0";
              var forecastImgIconEl = document.createElement("img");
              var forecastIcon = data.daily[i].weather[0].icon;
              forecastImgIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
              forecastImgIconEl.setAttribute("alt", data.daily[i].weather[0].description);
              imgListItemEl.appendChild(forecastImgIconEl);
              cardListEl.appendChild(imgListItemEl);

              //temp for forecast
              var tempListItemEl = document.createElement("li");
              tempListItemEl.className = "list-group-item border-0";
              forecastTemp = data.daily[i].temp.max;
              tempListItemEl.innerHTML = "Temp: " + forecastTemp + "&#8457";
              cardListEl.appendChild(tempListItemEl);

              //wind for forecast
              var windListItemEl = document.createElement("li");
              windListItemEl.className = "list-group-item border-0";
              forecastWind = data.daily[i].wind_speed;
              windListItemEl.innerHTML = "Wind: " + forecastWind + "MPH";
              cardListEl.appendChild(windListItemEl);

              //humidity for forecast
              var humidListItemEl = document.createElement("li");
              humidListItemEl.className = "list-group-item border-0";
              forecastHumid = data.daily[i].humidity;
              humidListItemEl.innerHTML = "Humidity: " + forecastHumid + "%";
              cardListEl.appendChild(humidListItemEl);
            }
          });
      });
    } else {
      console.log("fetch didnt work");
      alert("Please enter a valid city!");
    }
  })
};


// event listener that searches for city weather data based on user input
searchFormEl.addEventListener("submit", formSubmitHandler);

// event listenr for buttons on search history 
searchHistoryContainerEl.addEventListener("click", historyButtonClickHandler);

loadSearchHistory();