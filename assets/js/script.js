// api key for open weather
const apiKey = "0d0839b84e0e9b172f262c1df9ccb1a9";

const inputCityEl = document.querySelector("#search");
const searchFormEl = document.querySelector("#search-form");
const currentWeatherEl = document.querySelector("#current-weather");
const forecastTitleDivEl = document.querySelector("#forecast-title");
const forecastCardContainerEl = document.querySelector("#card-container");
const searchHistoryContainerEl = document.querySelector("#search-history");

// holds array for searches stored in local storage
const historyCityList = localStorage.getItem("userSearchTerm")
  ? JSON.parse(localStorage.getItem("userSearchTerm"))
  : [];

const capitalizeFirstLetter = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// function to handle user input from search form
// also save to local storage and add button to history section
const formSubmitHandler =  (event) => {
  event.preventDefault();
  const citySearch = capitalizeFirstLetter(inputCityEl.value.trim());

  // only pushes to array if it has a value, blanks not added to array
  if (citySearch && !historyCityList.includes(citySearch)) {
    if (historyCityList.length >= 5) {
      historyCityList.shift();
    }
    historyCityList.push(citySearch);
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
const historyButtonClickHandler = (event) => {
  console.log(event.target.textContent);
  let cityBtn = event.target.textContent;
  getCity(cityBtn);
};

// function to add new button to history div when search is conducted
const newSearchAddButton = () => {
  searchHistoryContainerEl.innerHTML = "";
  loadSearchHistory();
};

//function to load local storage
const loadSearchHistory = () =>{
  for (let i = historyCityList.length - 1; i >= 0; i--) {
    const historyItemEl = document.createElement("button");
    historyItemEl.setAttribute("type", "click");
    historyItemEl.className = "col-12 btn-lg btn-secondary mt-2";
    searchHistoryContainerEl.appendChild(historyItemEl);
    historyItemEl.textContent = historyCityList[i];
  }
};

// function to fetch weather information and add content dynamically
const getCity =  (cityName) => {
  const cityApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;

  fetch(cityApiUrl).then((response) =>{
    if (response.ok) {
      console.log("fetch workded");
      response.json().then((data)=> {
        console.log(data);

        const cityLat = data.coord.lat;
        const cityLon = data.coord.lon;
        const nameOfInputCity = data.name;
        //console.log(cityLat);
        //console.log(cityLon);

        // var for weather api url
        const weatherApiUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&appid=" +
          apiKey +
          "&units=imperial";

        fetch(weatherApiUrl)
          .then((response) => {
            return response.json();
          })
          .then((data)=> {
            console.log(data);
            //console.log(nameOfInputCity);

            // clears dynamically created elements in forecast when new search is conducted
            currentWeatherEl.innerHTML = "";
            forecastCardContainerEl.innerHTML = "";
            forecastTitleDivEl.innerHTML = "";

            // get current weather info and add to DOM
            // add border for current weather
            currentWeatherEl.className = "border border-dark mt-2 p-3";

            //use moment to get date formatted
            const currentDate = moment.unix(data.current.dt).format("MM/DD/YYYY");
            const currentIcon = data.current.weather[0].icon;
            const iconImgEl = document.createElement("img");
            iconImgEl.setAttribute(
              "src",
              "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png"
            );
            iconImgEl.setAttribute("alt", data.current.weather[0].description);

            //display current city and date
            const currentCityDivEl = document.createElement("div");
            currentCityDivEl.className =
              "d-flex justify-content-start align-items-center mb-3";
            currentWeatherEl.appendChild(currentCityDivEl);
            const currentCityTitleEl = document.createElement("h1");
            currentCityTitleEl.textContent =
              nameOfInputCity + " " + "(" + currentDate + ")";
            currentCityDivEl.appendChild(currentCityTitleEl);
            currentCityTitleEl.appendChild(iconImgEl);

            // current city weather info- temp, wind, humidity, uv
            const currentWeatherInfoDivEl = document.createElement("div");
            currentWeatherEl.appendChild(currentWeatherInfoDivEl);
            //temp
            const tempEl = document.createElement("p");
            const currentTempInfo = data.current.temp;
            tempEl.innerHTML = "Temp: " + currentTempInfo + "&#8457";
            tempEl.className = "col-12 col-md-3";
            currentWeatherInfoDivEl.appendChild(tempEl);
            //wind
            const windEl = document.createElement("p");
            const currentWindInfo = data.current.wind_speed;
            windEl.innerHTML = "Wind: " + currentWindInfo + " MPH";
            windEl.className = "col-12 col-md-3";
            currentWeatherInfoDivEl.appendChild(windEl);
            //humidity
            const humidEl = document.createElement("p");
            const currentHumidInfo = data.current.humidity;
            humidEl.innerHTML = "Humidity: " + currentHumidInfo + " %";
            humidEl.className = "col-12 col-md-3";
            currentWeatherInfoDivEl.appendChild(humidEl);
            //uv
            const uvEl = document.createElement("p");
            const currentUvInfo = data.current.uvi;
            uvEl.innerHTML = "UV Index: ";
            const uvSpanEl = document.createElement("span");
            uvSpanEl.textContent = currentUvInfo;
            uvEl.appendChild(uvSpanEl);
            uvEl.className = "col-12 col-md-3";
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
            const fiveDayTitleEl = document.createElement("h2");
            fiveDayTitleEl.innerHTML = "5 Day Forecast";
            forecastTitleDivEl.appendChild(fiveDayTitleEl);

            // for loop for 5 day forecast
            for (let i = 1; i < 6; i++) {
              //create all items for weather card
              const cardDivEl = document.createElement("div");
              cardDivEl.className = "card text-white bg-primary mb-2";
              cardDivEl.setAttribute =
                ("style", "width: 100%; max-width: 18rem;");
              forecastCardContainerEl.appendChild(cardDivEl);

              //date for each day of forecast card
              const cardHeaderEl = document.createElement("div");
              cardHeaderEl.className = "card-header border-0";
              cardHeaderEl.textContent = moment
                .unix(data.daily[i].dt)
                .format("MM/DD/YYYY");
              cardDivEl.appendChild(cardHeaderEl);

              const cardListEl = document.createElement("ul");
              cardListEl.className = "list-group list-group-flush";
              cardDivEl.appendChild(cardListEl);

              //img icon for forecast
              const imgListItemEl = document.createElement("li");
              imgListItemEl.className = "list-group-item border-0";
              const forecastImgIconEl = document.createElement("img");
              const forecastIcon = data.daily[i].weather[0].icon;
              forecastImgIconEl.setAttribute(
                "src",
                "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
              );
              forecastImgIconEl.setAttribute(
                "alt",
                data.daily[i].weather[0].description
              );
              imgListItemEl.appendChild(forecastImgIconEl);
              cardListEl.appendChild(imgListItemEl);

              //temp for forecast
              const tempListItemEl = document.createElement("li");
              tempListItemEl.className = "list-group-item border-0";
              forecastTemp = data.daily[i].temp.max;
              tempListItemEl.innerHTML = "Temp: " + forecastTemp + "&#8457";
              cardListEl.appendChild(tempListItemEl);

              //wind for forecast
              const windListItemEl = document.createElement("li");
              windListItemEl.className = "list-group-item border-0";
              forecastWind = data.daily[i].wind_speed;
              windListItemEl.innerHTML = "Wind: " + forecastWind + "MPH";
              cardListEl.appendChild(windListItemEl);

              //humidity for forecast
              const humidListItemEl = document.createElement("li");
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
  });
};

// event listener that searches for city weather data based on user input
searchFormEl.addEventListener("submit", formSubmitHandler);

// event listenr for buttons on search history
searchHistoryContainerEl.addEventListener("click", historyButtonClickHandler);

loadSearchHistory();
