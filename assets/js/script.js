// api key for open weather 
var apiKey = "0d0839b84e0e9b172f262c1df9ccb1a9"

// function to fetch city information
var getCity= function(cityName){
    var cityApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=" + apiKey;

    fetch(cityApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        } else {
            alert("this didnt work!")
        }
    });
}

//testing to see output of console log of the fetch response
getCity("Boston");
