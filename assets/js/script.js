let searchBtn = document.getElementById('search-btn');
let searchText = document.getElementById('city');
searchBtn.addEventListener('click',searchCity);

function searchCity(){
    let cityToSearch=encodeURIComponent(searchText.value);

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityToSearch}&limit=1&appid=8ff1be0bee70c37c62ab2ef02c004244`)
        .then(response => response.json())
        .then(result => searchWeather(result));
}


function searchWeather(result){
    console.log(result[0].lat + '   ' + result[0].lon)
}