
// "use strict";

const API_KEY = "8e16790ceae5673f54e156a21b9625bf";
const unit = 'metric'; 

const getWeather = async (cityName) => {
    const WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`;
    const FORECAST_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(WEATHER_ENDPOINT),
            fetch(FORECAST_ENDPOINT)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) throw new Error('City not found');

        const [weatherData, forecastData] = await Promise.all([
            weatherResponse.json(),
            forecastResponse.json() 
        ]);

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
    } catch (error) {
        alert(error.message);
    }
}


const updateWeatherUI = (data) => {
    document.querySelector('.weather_temp').textContent = `${data.main.temp}°C`;
    document.querySelector('.cloudtxt').textContent = data.weather[0].description;
    document.querySelector('.default_day').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    document.querySelector('.default_date').textContent = new Date().toLocaleDateString();
    document.querySelector('.default_info img').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.querySelector('.day_info .content:nth-child(1) .value').textContent = data.name;
    document.querySelector('.day_info .content:nth-child(2) .value').textContent = `${data.main.temp}°C`;
    document.querySelector('.day_info .content:nth-child(3) .value').textContent = `${data.main.humidity}%`;
    document.querySelector('.day_info .content:nth-child(4) .value').textContent = `${data.wind.speed} km/h`;
}

const updateForecastUI = (data) => {
    const listItems = document.querySelectorAll('.list_content ul li');
    const forecastData = data.list.reduce((acc, curr) => {
        const date = curr.dt_txt.split(' ')[0];
        if (!acc[date]) {
            acc[date] = {
                date: date,
                temp: curr.main.temp,
                icon: curr.weather[0].icon,
                description: curr.weather[0].description
            };
        }
        return acc;
    }, {});

    const forecastEntries = Object.values(forecastData);
    forecastEntries.slice(0, 7).forEach((forecast, index) => {
        const listItem = listItems[index];
        listItem.querySelector('img').src = `http://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
        listItem.querySelector('span').textContent = new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short' });
        listItem.querySelector('.day_temp').textContent = `${forecast.temp}°C`;
    });
}

document.querySelector('.btn_search').addEventListener('click', function(event) {
    event.preventDefault(); 

    const city = document.querySelector('.input_field').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name');
    }
});



document.querySelector('.input_field').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const city = document.querySelector('.input_field').value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name');
        }
    }
});
