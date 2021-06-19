let searchBtn = document.getElementById('search-btn');
let searchText = document.getElementById('city');
let searchForm = document.getElementById('search-form');
let currCity;
let currDate;
searchBtn.addEventListener("click",searchCity);
function searchCity(e){
    e.preventDefault();
    let cityToSearch=encodeURIComponent(searchText.value);

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityToSearch}&limit=1&appid=8ff1be0bee70c37c62ab2ef02c004244`)
        .then(response => response.json())
        .then(result => searchWeather(result));
    }


function searchWeather(result){
    if(result.length===0){
        searchText.value = 'Invalid City';
        return;
    }
    currCity = result[0].name;
    let lat = result[0].lat;
    let lon = result[0].lon;

    weatherResults(lat,lon);

}


function weatherResults(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=8ff1be0bee70c37c62ab2ef02c004244`)
    .then(response => response.json())
    .then(result => weatherDisplay(result));
}

function weatherDisplay(result) {
    currDate = moment.unix(result.current.dt);
    console.log(currDate);
}