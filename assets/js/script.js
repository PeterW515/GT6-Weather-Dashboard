//Create global variables for important elements
let searchBtn = document.getElementById('search-button');
let searchText = document.getElementById('city-to-search');
let currentHeader = document.getElementById('city-date-icon');
let currentTemperature = document.getElementById('current-temp');
let currentWind = document.getElementById('current-wind');
let currentHumidity = document.getElementById('current-humidity');
let currentUV = document.getElementById('current-UV');
let fiveDay = document.getElementById('five-day-forecast-row');

//call this function on page load to check 
//local storage for recently searched cities
loadCityButtons();

//Add event listener to run searchCity function when search button is clicked
searchBtn.addEventListener("click",searchCityBtnClicked);

//this function runs when search button is clicked
function searchCityBtnClicked(){
    //store search text in variable
    let cityToSearch = searchText.value;

    //check if empty
    if(!cityToSearch) return;

    //pass search value to searchCity function
    searchCity(cityToSearch);

}

//this function runs when weather for a city is requested
function searchCity(cityToSearch){

    //encode city in case name has spaces
    let encodedCity = encodeURIComponent(cityToSearch);

    //call first openweathermap to get lat/lon of city and 
    //pass results to function to evaluate validity
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityToSearch}&limit=1&appid=8ff1be0bee70c37c62ab2ef02c004244`)
    .then(response => response.json())
    .then(result => evalLatLong(cityToSearch,result));
}


//this function checks to make sure city is valid
//if city is valid, get weather data
function evalLatLong(cityToSearch,result){
    //if no city data is returned, do nothing
    if(result.length ===0) return;

    let lat = result[0].lat;
    let lon = result[0].lon;

    getWeatherForCoords(cityToSearch,lat,lon);

}

//this function gets weather results from openweathermap
function getWeatherForCoords(cityToSearch,lat,lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=8ff1be0bee70c37c62ab2ef02c004244`)
    .then(response => response.json())
    .then(result => displayWeather(cityToSearch,result));
}


//this function displays the weather results
function displayWeather(cityToSearch,result){

    console.log(result);
    //store results in variables to then add to page
    let currCity = cityToSearch;
    let currTemp = result.current.temp;
    let currWind = result.current.wind_speed;
    let currHumid = result.current.humidity;
    let currUV = result.current.uvi;

    //add icon string to image url
    let weatherIcon = `https://openweathermap.org/img/wn/${result.current.weather[0].icon}@2x.png`

    //convert unix timestamp to formatted date
    let unixTimpestamp = result.current.dt;
    let date = new Date(unixTimpestamp*1000);
    let month = date.getMonth();
    //months start from 0 so need to add one for display purposes
    month++;
    let day = date.getDate();
    let year = date.getFullYear();
    let formattedDateString = `(${month}/${day}/${year})`;

    //display results for current weather
    currentHeader.innerHTML = `${currCity} ${formattedDateString}<span id="test"><img src=${weatherIcon} alt="weather icon" /></span>`;
    currentTemperature.innerHTML = `Temp: ${currTemp}<span>\&#176;</span>F`;
    currentWind.innerText = `Wind: ${currWind} MPH`;
    currentHumidity.innerText =`Humidity: ${currHumid}%`;
    currentUV.innerText = `UV Index: ${currUV}`;

    //remove existing forecast cards
    // and create and display cards for the next five days
    fiveDay.innerHTML='';
    for(let i=0;i<5;i++){
        //create elements for cards
        let mainDiv = document.createElement('div');
        let cardDiv = document.createElement('div');
        let dateHeader = document.createElement('h6');
        let weatherImg = document.createElement('img');
        let temp = document.createElement('p');
        let wind = document.createElement('p');
        let humid = document.createElement('p');

        //append elements to correct divs
        cardDiv.appendChild(dateHeader);
        cardDiv.appendChild(weatherImg);
        cardDiv.appendChild(temp);
        cardDiv.appendChild(wind);
        cardDiv.appendChild(humid);

        mainDiv.appendChild(cardDiv);

        fiveDay.appendChild(mainDiv);

        //set classes for elements
        mainDiv.className = 'col';
        cardDiv.className = 'card-panel blue';
        dateHeader.className='white-text';
        temp.className='white-text';
        wind.className='white-text';
        humid.className='white-text';

        //determine proper date and format date string
        let futureDate = date;
        futureDate.setDate(date.getDate()+i);
        let futureMonth = futureDate.getMonth();
        //months start from 0 so need to add one for display purposes
        month++;
        let futureDay = futureDate.getDate();
        let futureYear = futureDate.getFullYear();
        let futureFormattedDateString = `${futureMonth}/${futureDay}/${futureYear}`;
        
        //set content of elements
        dateHeader.innerText = futureFormattedDateString;
        weatherImg.src = `http://openweathermap.org/img/wn/${result.daily[i].weather[0].icon}@2x.png`
        temp.innerHTML = `Temp: ${result.daily[i].temp.day}<span>\&#176;</span>F`;
        wind.innerText = `Wind: ${result.daily[i].wind_speed} MPH`;
        humid.innerText = `Humidity: ${result.daily[i].humidity}%`;
        
    }
}

//this function determines whether to load cities from
//local storage or pre populate
function loadCityButtons() {
    if(!localStorage.getItem('recentlySearched')){
        prePopulateCityButtons();
    } else populateCityButtons(JSON.parse(localStorage.getItem('recentlySearched')));
}

//if user has not visited page before,
//prepopulate cities with 8 largest cities in
//United States
function prePopulateCityButtons(){
    let cities = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego'];
    
    localStorage.setItem('recentlySearched',JSON.stringify(cities));
    
    for(let city in cities){
        let mainDiv = document.createElement('div');
        mainDiv.className = 'col s12';
        let btn = document.createElement('button');
        btn.className = 'btn waves-effect waves-light';
        btn.setAttribute('type','button');
        btn.setAttribute('id',cities[city]+'')
    }
}

function populateCityButtons(cities) {

}
