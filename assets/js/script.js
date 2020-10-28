// If there is nothing in 'localStorage', sets the 'list' to an empty array
var searchListArray = JSON.parse(localStorage.getItem('searchlist')).slice(-10) || [];
renderSearch(searchListArray);

// redering search History 
function renderSearch(searchListArray) {

    var searchHistory = $('#search-history');
    $('#search-history').empty();
    var searchListArray = JSON.parse(localStorage.getItem('searchlist')).slice(-10) || [];

    //Creating a UL element 
    var searchHistoryUL = document.createElement('ul');
    searchHistoryUL.setAttribute('class', 'list-group');        //Bootstrap Styling

    for (var i = 0; i < searchListArray.length; i++) {
        var searchHistoryLI = document.createElement('li');
        searchHistoryLI.setAttribute('class', 'list-group-item search-list');    //Bootstrap Styling
        searchHistoryLI.append(searchListArray[i]);                 // making a list of cities searches
        searchHistoryUL.appendChild(searchHistoryLI);
    };
    searchHistory.append(searchHistoryUL);

}


function myFunction() {
    var citySearch = document.querySelector('#citySearch').value;
    renderweather(citySearch);

}
function renderweather(citySearch){    
    //fectching the open weather API
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&units=imperial&appid=39b0a25dae6521c5e83d59fd95abf165'
    )
        .then(function (weatherResponse) {
            return weatherResponse.json();
        })
        .then(function (weatherResponse) {
            // a variable to hold the wether data that we need
            var cityName = weatherResponse.name;
            var countryName = weatherResponse.sys.country

            // Populating the search History
            if ((cityName ==undefined || cityName == null || cityName == "") || (countryName ==undefined || countryName == null || countryName == "")){
                $('#error-msg').empty();
                var errorMsg = $('#error-msg')
                var displayError = document.createElement('p');
                displayError.setAttribute('style','color:red');
                displayError.innerHTML = "Your Entry is invalid or there might be one or more cities, Please enter state or country (i.e. city,state or country)";
                errorMsg.append(displayError);
            }else{
                var fullCityName = cityName+","+countryName;
                searchListArray.push(fullCityName);
                searchListArray = [...new Set(searchListArray)];
                // searcgListArray = searchListArray.slice(0,10);
                localStorage.setItem('searchlist', JSON.stringify(searchListArray));
                $('#error-msg').empty();
            }
            

            renderSearch(searchListArray) 


            var currentTemp = weatherResponse.main.temp;
            var currentWeatherIconID = weatherResponse.weather[0].icon;
            var currentHumidity = weatherResponse.main.humidity;
            var currentWindSpeed = weatherResponse.wind.speed;

            //This is to get the current date
            var unixtime = weatherResponse.dt
            var date = new Date(unixtime * 1000);
            var datenow = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var todaysDate = " (" + month + "/" + datenow + "/" + year + ") "
            // This is to send to another promise to get UV info   
            var currentLon = weatherResponse.coord.lon;
            var currentLat = weatherResponse.coord.lat;

            // Title displayed
            var todaysForecast = document.querySelector('#todays-forecast');
            todaysForecast.innerHTML = ""
            var cityTitle = document.createElement('h2');
            var currentWeatherIcon = document.createElement('img');
            currentWeatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + currentWeatherIconID + '.png')
            cityTitle.innerHTML = cityName + todaysDate;
            todaysForecast.appendChild(cityTitle);
            todaysForecast.appendChild(currentWeatherIcon);

            //Current Temp
            var displayTemp = document.createElement('p');
            displayTemp.innerHTML = 'Temperature: ' + currentTemp + ' °F';
            todaysForecast.appendChild(displayTemp);

            //Current Humidity
            var displayHumidity = document.createElement('p');
            displayHumidity.innerHTML = 'Humidity: ' + currentHumidity + '%';
            todaysForecast.appendChild(displayHumidity);

            //Current Wind Speed
            var displayWindSpeed = document.createElement('p');
            displayWindSpeed.innerHTML = 'Wind Speed: ' + currentWindSpeed + ' MPH';
            todaysForecast.appendChild(displayWindSpeed);

            //Current UV
            return fetch('https://api.openweathermap.org/data/2.5/uvi?lat=' + currentLat + '&lon=' + currentLon + '&appid=39b0a25dae6521c5e83d59fd95abf165'
            )
        })
        .then(function (UvResponse) {
            return UvResponse.json();
        })
        .then(function (UvResponse) {
            var todaysForecast = document.querySelector('#todays-forecast');
            var currentUvIndex = UvResponse.value;
            var displayUvIndex = document.createElement('p');
            var uvIndexSpan = document.createElement('span')
            uvIndexSpan.innerHTML = currentUvIndex;

            if (parseInt(currentUvIndex) <= 3){
                uvIndexSpan.setAttribute('class','low');
            }else if(parseInt(currentUvIndex) >3 && currentUvIndex <= 6){
                uvIndexSpan.setAttribute('class','moderate');
            }else if(parseInt(currentUvIndex) >6 && currentUvIndex <= 8){
                uvIndexSpan.setAttribute('class','high');
            }else if(parseInt(currentUvIndex) >8 && currentUvIndex <= 10){
                uvIndexSpan.setAttribute('class','veryHigh')
            }else{
                uvIndexSpan.setAttribute('class','extreme');
            }

            displayUvIndex.innerHTML = 'UV Index: ';
            displayUvIndex.append(uvIndexSpan);
            todaysForecast.appendChild(displayUvIndex);
            var currentLon = UvResponse.lon;
            var currentLat = UvResponse.lat;
            // 5 Day Forecast
            return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + currentLat + '&lon=' + currentLon + '&units=imperial&appid=39b0a25dae6521c5e83d59fd95abf165'
            )
                .then(function (forecastResponse) {
                    return forecastResponse.json();
                })
                .then(function (forecastResponse) {
                    var futureForecast = document.querySelector('#future-forecast');
                    futureForecast.innerHTML = "";
                    var futureTitle = document.createElement('h2');
                    futureTitle.innerHTML = "5 Day Forecast";
                    futureForecast.appendChild(futureTitle);
                    var forecastCardContainer = document.createElement('div');
                    forecastCardContainer.setAttribute('class', 'card container');
                    // forecastCardContainer.setAttribute('class', 'cointainer');
                    var forecastCardrow = document.createElement('div');
                    forecastCardrow.setAttribute('class', 'row justify-content-center');
                    // forecastCardContainer.append(forecastCardrow);
                    // futureForecast.appendChild(forecastCardContainer);
                    for (var i = 0; i < 5; i++) {
                        var forecastCard = document.createElement('div');
                        forecastCard.setAttribute('class','card-body col-sm-2.5')
                        // forecastCard.setAttribute('class','col')
                        var cardTitle =document.createElement('h5');
                        cardTitle.setAttribute('class', 'card-title');

                        //Forecast Dates 
                        var unixtime = forecastResponse.list[8 * i].dt;
                        var date = new Date(unixtime * 1000);
                        var datefuture = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();
                        var futureDate = month + "/" + datefuture + "/" + year;

                        cardTitle.append(futureDate);

                        //Forecast weather icon
                        var forecastWeatherIcon = document.createElement('img');
                        forecastWeatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + forecastResponse.list[8 * i].weather[0].icon + '.png')
                        var iconParagraph = document.createElement('p');
                        // iconParagraph.setAttribute('class', 'card-text')
                        iconParagraph.append(forecastWeatherIcon)

                        //Forecast Temp
                        var forecastTemp = forecastResponse.list[8 * i].main.temp;
                        var tempParagraph = document.createElement('p');
                        tempParagraph.setAttribute('class','card-text');
                        tempParagraph.innerHTML = 'Temp: ' + forecastTemp + ' °F';
                        // tempParagraph.append(forecastTemp);

                        //Forecast Humidity
                        var forecastHumidity = forecastResponse.list[8 * i].main.humidity;
                        var humidityParagraph = document.createElement('p');
                        humidityParagraph.setAttribute('class','card-text');
                        humidityParagraph.innerHTML = 'Humidity: ' + forecastHumidity + '%';
                        forecastCard.append(cardTitle, iconParagraph, tempParagraph, humidityParagraph);
                        // Add Forecast card to diplay on page by adding it to future Forecast div
                        forecastCardrow.append(forecastCard)
                        forecastCardContainer.append(forecastCardrow)
                        futureForecast.appendChild(forecastCardContainer);
                    };
                });

        });
}


$(document).on('click', '.search-list', function(){
    // This is to get the city text
    var city = $(this).text();
    console.log(city);
    renderweather(city);
});
