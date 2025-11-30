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
const extendedForecastTitle = document.getElementById("extended-forecast-title");


// Kelvin - Celsius converter
function kelvinToUnits(kelvin){
    const celsius = kelvin - 273;
    const fahrenheit = (celsius * 9/5) + 32;


    if(isCelsius){
        return`${celsius.toFixed(1)}°C`;
    }
    else{
        return `${fahrenheit.toFixed(1)}°F`;
    }
}


function displayError(message){
    errorDisplay.textContent = `Error: ${message}`;
    errorDisplay.classList.remove('hidden');
    weatherDisplay.innerHTML = `<p class="text-center text-xl text-red-500">${message}</p>`;
    forecastContainer.innerHTML = '';
    extendedForecastTitle.classList.add('hidden');
}

function clearError() {
    errorDisplay.classList.add('hidden');
    errorDisplay.textContent = '';

}

// Getting weather icon
function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}


async function fetchCurrentWeather(city) {
    clearError();


    // Loading message

    weatherDisplay.innerHTML = `<p class = "text-center text-xl text-gray-500 animate-pulse">
    Fetching weather for ${city}...
    </p>
    
    `;

    try{
const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
const response = await fetch(url);



// Error for city not found

if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Could not fetch weather data. Status: ${response.status}`);}


const data = await response.json();
        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon); 
        updateRecentCities(data.name);
    







    }


catch(error){
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
            throw new Error(`Could not fetch extended forecast. Status: ${response.status}`);
        }


        const data = await response.json();
        displayExtendedForecast(data.list); // 3 hour forecast data 
        
    } 
    catch (error) {
        console.error("Fetch forecast error:", error);
    displayError("Could not fetch 5-day forecast.");
    }
}
