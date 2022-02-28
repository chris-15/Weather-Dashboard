// api key for open weather
var apiKey = "0d0839b84e0e9b172f262c1df9ccb1a9";

var inputCityEl=  document.querySelector("#search");
var searchFormEl = document.querySelector("#search-form");


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
                     })

            });
        } else{
            console.log("fetch didnt work")
        }
    });
    
    

}    
// event listener that searches for city weather data based on user input
searchFormEl.addEventListener("submit", formSubmitHandler)
