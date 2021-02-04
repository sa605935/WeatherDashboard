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