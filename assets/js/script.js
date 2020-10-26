// If there is nothing in 'localStorage', sets the 'list' to an empty array
var searchListArray = JSON.parse(localStorage.getItem('searchlist')) || [];
renderSearch(searchListArray);
// redering search History 
function renderSearch(searchListArray) {

    var searchHistory = document.querySelector('#search-history');
    //Creating a UL element 
    var searchHistoryUL = document.createElement('ul');
    searchHistoryUL.setAttribute('class', 'list-group');        //Bootstrap Styling

    for (var i = 0; i < searchListArray.length; i++) {
        var searchHistoryLI = document.createElement('li');
        searchHistoryLI.setAttribute('class', 'list-group-item');    //Bootstrap Styling
        searchHistoryLI.setAttribute('id', 'search-list');
        searchHistoryLI.append(searchListArray[i]);                 // making a list of cities searched
        searchHistoryUL.appendChild(searchHistoryLI);
    };
    searchHistory.appendChild(searchHistoryUL);
}

console.log(searchListArray);

function myFunction() {
    var citySearch = document.querySelector('#citySearch').value;
    console.log(citySearch);
    //fectching the open weather API
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + ',&units=imperial&APPID=39b0a25dae6521c5e83d59fd95abf165'
    )
        .then(function (weatherResponse) {
            return weatherResponse.json();
        })
        .then(function (weatherResponse) {
            // a variable to hold the wether data that we need
            var cityName = weatherResponse.name;

            // Populating the search History
            searchListArray.push(cityName);
            localStorage.setItem('searchlist', JSON.stringify(searchListArray));


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
            displayUvIndex.innerHTML = 'UV Index: ' + currentUvIndex;
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
$('#search-list').each(function(){
    $(this).on('click', function(event){
        var city = $(this).value;
        console.log(city);
    });
});
