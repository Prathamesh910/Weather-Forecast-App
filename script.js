// console.log("Weather Forecast App is running...");

const API_KEY = "253527e6bb138d2127973c8361ebda7b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEAFAULT_CITY = "Mumbai"; // Starting city

let isCelsius = true;
let recentCities = []; // Array to store recent city searches

// Dom elements
const searchInput = document.getElementById("city-search");
const searchBtn = document.getElementById("search-btn");
const currentLocationBtn = document.getElementById("current-location-btn");
const tempToggleBtn = document.getElementById("temp-toggle-btn");
const weatherDisplay = document.getElementById("current-weather-display");
const forecastContainer = document.getElementById("forecast-cards-container");
const errorDisplay = document.getElementById("error-display");
const recentCitiesDropdown = document.getElementById("recent-cities-dropdown");
const extendedForecastTitle = document.getElementById(
  "extended-forecast-title"
);

// Kelvin - Celsius converter
function kelvinToUnits(kelvin) {
  const celsius = kelvin - 273;
  const fahrenheit = (celsius * 9) / 5 + 32;

  if (isCelsius) {
    return `${celsius.toFixed(1)}°C`;
  } else {
    return `${fahrenheit.toFixed(1)}°F`;
  }
}

function displayError(message) {
  errorDisplay.textContent = `Error: ${message}`;
  errorDisplay.classList.remove("hidden");
  weatherDisplay.innerHTML = `<p class="text-center text-xl text-red-500">${message}</p>`;
  forecastContainer.innerHTML = "";
  extendedForecastTitle.classList.add("hidden");
}

function clearError() {
  errorDisplay.classList.add("hidden");
  errorDisplay.textContent = "";
}

// Getting weather icon
function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function fetchCurrentWeather(city) {
  clearError();

  // Loading message

  weatherDisplay.innerHTML = `<p class = "text-center text-xl text-gray-500 animate-pulse">
    Fetching weather forecast for ${city}...
    </p>
    
    `;

  try {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
    const response = await fetch(url);

    // Error for city not found

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Could not fetch weather data. Status: ${response.status}`
      );
    }

    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
    updateRecentCities(data.name);
  } catch (error) {
    console.error("Fetch current weather error:", error);
    displayError(error.message);
  }
}

// fetch extended forecast data

async function fetchForecast(lat, lon) {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Could not fetch extended forecast. Status: ${response.status}`
      );
    }

    const data = await response.json();
    displayExtendedForecast(data.list); // 3 hour forecast data
  } catch (error) {
    console.error("Fetch forecast error:", error);
    displayError("Could not fetch 5-day forecast.");
  }
}



function displayCurrentWeather(data){
    const temp = kelvinToUnits(data.main.temp);
    const description = data.weather[0].description.toUpperCase();
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherCondition = data.weather[0].main.toLowerCase();

//Custom Weather Alert
let alertMessage = '';
    const tempInC = data.main.temp - 273.15; 
    if (tempInC > 40) {
        alertMessage = '<p class="text-xl font-semibold text-red-600 mt-4 p-2 bg-red-100 rounded-lg">⚠️ HEAT WAVE ALERT!</p>';
    }


    //Background change
const body = document.body;
    body.classList.remove('bg-rainy', 'bg-clear', 'bg-clouds');
    
    if (weatherCondition.includes('rain')) {
        body.classList.add('bg-rainy');
        body.classList.remove('bg-gray-100'); 
    } else if (weatherCondition.includes('clear')) {
        body.classList.add('bg-clear');
        body.classList.remove('bg-gray-100');
    } else if (weatherCondition.includes('clouds')) {
        body.classList.add('bg-clouds');
        body.classList.remove('bg-gray-100');
    } else {
        body.classList.add('bg-gray-100'); 
    }


    weatherDisplay.innerHTML = `
        <div class="flex flex-col items-center">
            <h2 class="text-5xl font-extrabold text-weather-dark">${data.name}, ${data.sys.country}</h2>
            <p class="text-lg text-gray-500">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            
            <img src="${getWeatherIconUrl(iconCode)}" alt="${description}" class="w-32 h-32 my-2">
            
            <div class="flex items-start">
                <p id="main-temp" class="text-8xl font-light text-weather-blue">${temp.replace(/°[CF]$/, '')}</p>
                <span id="temp-unit" class="text-3xl font-light text-weather-blue mt-4">${temp.slice(-2)}</span>
            </div>

            <p class="text-2xl font-semibold text-gray-600 mb-6">${description}</p>
            
            <div class="grid grid-cols-3 gap-4 text-center w-full max-w-sm">
                <div class="p-3 bg-weather-light rounded-lg">
                    <span class="text-sm font-medium text-gray-500">Humidity</span>
                    <p class="text-xl font-bold text-weather-dark">${humidity}%</p>
                </div>
                <div class="p-3 bg-weather-light rounded-lg">
                    <span class="text-sm font-medium text-gray-500">Wind</span>
                    <p class="text-xl font-bold text-weather-dark">${windSpeed} m/s</p>
                </div>
                <div class="p-3 bg-weather-light rounded-lg">
                    <span class="text-sm font-medium text-gray-500">Feels Like</span>
                    <p class="text-xl font-bold text-weather-dark">${kelvinToUnits(data.main.feels_like)}</p>
                </div>
            </div>
            ${alertMessage}
        </div>
    `;
  
    updateTempDisplay();
  }