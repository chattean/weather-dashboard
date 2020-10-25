function myFunction() {
    var citySearch = document.querySelector('#citySearch').value;
    // var citySearchHistory = localStorage.setItem(citySearch)


    //fectching the open weather API
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q='+ citySearch +',&units=imperial&APPID=39b0a25dae6521c5e83d59fd95abf165'
    )
      .then(function(weatherResponse) {
        return weatherResponse.json();
      })
      .then(function(weatherResponse) {
        // a variable to hold the wether data that we need
        cityName = weatherResponse.name;
        currentTemp = weatherResponse.main.temp;
        currentHumidity = weatherResponse.main.humidity;



        console.log(weatherResponse, cityName, currentTemp,currentHumidity)
  
    //     var wikiTitle = wikiResponse.query.random[0].title
    //     // Display the article title above the GIF as a <h2> heading
    //     // YOUR CODE HERE
    //     //
    //     var responseHeader = document.querySelector('#response-header');
    //     var h2Title = document.createElement('h2');
    //     h2Title.innerHTML = wikiTitle;
    //     responseHeader.appendChild(h2Title);
    
  
    //     var rating = document.getElementById('rating').value;
    //     // Return a fetch request to the Giphy search API with the article title and rating parameters
    //     // YOUR CODE HERE
    //     //
    //     return fetch(
    //       'https://api.giphy.com/v1/gifs/search?q=' +
    //         wikiTitle + '&rating=' + rating + '&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN'
    //     )
    //   })
    //   .then(function(response) {
    //     return response.json();
    //   })
    //   .then(function(response) {
    //     if (response.data.length === 0) {
    //       console.log('Giphy could not find anything for that.');
    //     } else {
    //       console.log(response.data[0]);
    //       var responseContainerEl = document.querySelector('#response-container');
    //       responseContainerEl.innerHTML = '';
    //       var gifImg = document.createElement('img');
    //       gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
    //       responseContainerEl.appendChild(gifImg);
    //     }
      });
  }
  