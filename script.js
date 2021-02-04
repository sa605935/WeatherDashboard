var citiesArray = [];
var cityName = (localStorage.getItem('city'));
var cityLat = '29.76';
var cityLon = '-95.36';
var currentHour = moment().hours();
var windowWidth = this.innerWidth;

$('#current-date').text(moment().format('dddd, MMMM Do YYYY'));

getCurrentWeather();

function renderCityButtons () {
    $('.city-buttons').empty();
    var dataOptions = '';
    citiesArray.forEach(function(city) {
        var btnDiv = $('<div>');
        var cityBtn = $('<button>');
        cityBtn.addClass('cityBtn');
        cityBtn.attr('data-state', city);
        cityBtn.text(city);
        btnDiv.append(cityBtn);
        $('.city-buttons').prepend(btnDiv);
        if (windowWidth <= 991) {
            dataOptions += `<option value= '${city}'>`;
        }
    })
    $('#cities').html(dataOptions);
}

function retrieveCityInfo (event) {
    event.preventDefault();
    var userCity = $('#city-search-input').val().trim();
    cityName = userCity;
    localStorage.setItem('city', cityName);
    citiesArray.push(cityName);
    $('#city-search-input').val("");
    renderCityButtons();
    getCurrentWeather();
}

function getCurrentWeather () {
    if (cityName) {
        var apiKey = "96e27da4f61bebe5c6e5c7c18c453252";
        var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
        $.ajax({
            url: queryUrl,
            method: 'GET',
        }).then(renderCurrentWeather)
    } else {
        cityName = 'Houston';
        getCurrentWeather();
    }
}

function getForecast () {
            var apiKey = "f60223f1ece87aa55821b69a70f473df";
            var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,minutely&appid=${apiKey}&units=imperial`
            $.ajax({
                url: queryUrl,
                method: 'GET',
            }).then(function (data) {
                renderForecast(data);
                renderUVindex(data);
})
}

function renderCurrentWeather (data) {
    cityLat = data.coord.lat;
    cityLon = data.coord.lon;
    cityName = data.name;
    var currentWeather = data.weather[0].main;
    $('.city-name').text(cityName);
    var temp = Math.ceil(data.main.temp);
    $('.temp-data').text(`Temperature: ${temp}° F`);
    var humidity = data.main.humidity;
    $('.humidity-data').text(`Humidity: ${humidity}%`);
    var windSpeed = data.wind.speed;
    $('.wind-data').text(`Wind Speed: ${windSpeed} MPH`);
    if (currentWeather === "Clear") {
        if (currentHour < 20 && currentHour > 6) {
            $('#weather-icon').attr('src', './assets/images/sunny.png');
        } else {
            $('#weather-icon').attr('src', './assets/images/moon.png');
        }
    } else if (currentWeather === "Clouds") {
        $('#weather-icon').attr('src', './assets/images/cloudy.png');
    } else if (currentWeather === "Rain") {
        $('#weather-icon').attr('src', './assets/images/rainy.png');
    } else if (currentWeather === "Mist") {
        $('#weather-icon').attr('src', './assets/images/drizzle.png');
    } else if (currentWeather === "Thunderstorm") {
        $('#weather-icon').attr('src', './assets/images/thunderstorm.png');
    } else if (currentWeather === "Snow") {
        $('#weather-icon').attr('src', './assets/images/snowy.png');
    } else if (currentWeather === "Wind") {
        $('#weather-icon').attr('src', './assets/images/windy.png');
    } else {
        $('#weather-icon').attr('src', './assets/images/earth.png');
    }
    getForecast();
}

function renderForecast (data) {
    $('#bottom-row').empty();
    for (var i = 1; i < 6; i++) {
        var dayDiv = $('<div>');
        dayDiv.addClass('col-2-sm col-md mb-3 dayBlock');
        var pDate = $('<p>');
        pDate.addClass('row justify-content-center mt-3 tiny-date');
        var date = moment().add(i, 'days').format('l');
        pDate.text(date);
        var pDay = $('<p>');
        pDay.addClass('row justify-content-center mb-3 tiny-day');
        var day = moment().add(i, 'days').format('dddd');
        pDay.text(day);
        var dayWeather = data.daily[i].weather[0].main;
        var weatherImg = $('<img>');
        weatherImg.addClass('row justify-content-center mb-3 tiny-icon');
        if (dayWeather === "Clear") {
            weatherImg.attr('src', './assets/images/sunny.png');
        } else if (dayWeather === "Clouds") {
            weatherImg.attr('src','./assets/images/cloudy.png');
        } else if (dayWeather === "Rain") {
            weatherImg.attr('src','./assets/images/rainy.png');
        } else if (dayWeather === "Mist") {
            weatherImg.attr('src','./assets/images/drizzle.png');
        } else if (dayWeather === "Thunderstorm") {
            weatherImg.attr('src', './assets/images/thunderstorm.png');
        } else if (currentWeather === "Snow") {
            weatherImg.attr('src', './assets/images/snowy.png');
        } else if (currentWeather === "Wind") {
            weatherImg.attr('src', './assets/images/windy.png');
        } else {
            weatherImg.attr('src', './assets/images/earth.png');
        }
        var pTemp = $('<p>');
        pTemp.addClass('row justify-content-center mb-3 tiny-temp');
        var dayTemp = Math.ceil(data.daily[i].temp.day);
        pTemp.text(`Temp: ${dayTemp}° F`);
        var pHumidity = $('<p>');
        pHumidity.addClass('row justify-content-center mb-3 tiny-humid');
        var dayHumidity = data.daily[i].humidity;
        pHumidity.text(`Humid: ${dayHumidity}%`);
        dayDiv.append(pDate);
        dayDiv.append(pDay);
        dayDiv.append(weatherImg);
        dayDiv.append(pTemp);
        dayDiv.append(pHumidity);
        $('#bottom-row').append(dayDiv);
    }
}

function renderUVindex (data) {
    var currentUV = data.daily[0].uvi;
    $('#uv-index').text(currentUV);
    if (currentUV >= 11) {
        $('#uv-index').removeClass('very-high');
        $('#uv-index').removeClass('high');
        $('#uv-index').removeClass('moderate');
        $('#uv-index').removeClass('low');
        $('#uv-index').addClass('extreme');
    } else if (currentUV >= 8 && currentUV < 11) {
        $('#uv-index').removeClass('extreme');
        $('#uv-index').removeClass('high');
        $('#uv-index').removeClass('moderate');
        $('#uv-index').removeClass('low');
        $('#uv-index').addClass('very-high');
    } else if (currentUV >= 6 && currentUV < 8) {
        $('#uv-index').removeClass('extreme');
        $('#uv-index').removeClass('very-high');
        $('#uv-index').removeClass('moderate');
        $('#uv-index').removeClass('low');
        $('#uv-index').addClass('high');
    } else if (currentUV >= 3 && currentUV < 6) {
        $('#uv-index').removeClass('extreme');
        $('#uv-index').removeClass('very-high');
        $('#uv-index').removeClass('high');
        $('#uv-index').removeClass('low');
        $('#uv-index').addClass('moderate');
    } else {
        $('#uv-index').removeClass('extreme');
        $('#uv-index').removeClass('very-high');
        $('#uv-index').removeClass('high');
        $('#uv-index').removeClass('moderate');
        $('#uv-index').addClass('low');
    }
}

$(document).on("click", ".cityBtn", chooseCity);
$('.searchBtn').click(retrieveCityInfo);