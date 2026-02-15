// console.log("Weather Forecast App is running...");

const API_KEY = "9062448c98008fa7e62324b7025422b1";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_CITY = "Mumbai"; // Starting city

let isCelsius = true;
let recentCities = []; // Array to store recent city searches

// Dom elements
const searchInput = document.getElementById("city-search");
const searchBtn = document.getElementById("search-btn");
const currentLocationBtn = document.getElementById("current-location-btn");
const celsiusLabel = document.getElementById("celsius-label");
const fahrenheitLabel = document.getElementById("fahrenheit-label");
const tempToggleSwitch = document.getElementById("temp-toggle-switch");
const weatherDisplay = document.getElementById("current-weather-display");
const forecastContainer = document.getElementById("forecast-cards-container");
const errorDisplay = document.getElementById("error-display");
const recentCitiesDropdown = document.getElementById("recent-cities-dropdown");
const extendedForecastTitle = document.getElementById("extended-forecast-title");

// Kelvin - Celsius converter
function kelvinToUnits(kelvin) {
  const celsius = kelvin - 273.15;
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

function displayCurrentWeather(data) {
  const temp = kelvinToUnits(data.main.temp);
  const description = data.weather[0].description.toUpperCase();
  const iconCode = data.weather[0].icon;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const weatherCondition = data.weather[0].main.toLowerCase();

  //Custom Weather Alert
  let alertMessage = "";
  const tempInC = data.main.temp - 273.15;
  if (tempInC > 40) {
    alertMessage =
      '<p class="text-xl font-semibold text-red-600 mt-4 p-2 bg-red-100 rounded-lg">⚠️ HEAT WAVE ALERT!</p>';
  }

  //Background change
  const currentDisplay = document.getElementById("current-weather-display");

  currentDisplay.classList.remove("bg-rainy", "bg-clear", "bg-clouds");
  currentDisplay.classList.add("text-white");

  if (
    weatherCondition.includes("rain") ||
    weatherCondition.includes("drizzle")
  ) {
    currentDisplay.classList.add("bg-rainy");
  } else if (weatherCondition.includes("clear")) {
    currentDisplay.classList.add("bg-clear");
  } else if (
    weatherCondition.includes("cloud") ||
    weatherCondition.includes("mist") ||
    weatherCondition.includes("smoke")
  ) {
    currentDisplay.classList.add("bg-clouds");
  } else {
    currentDisplay.classList.add("bg-clouds");
  }

  weatherDisplay.innerHTML = `
<div class="flex flex-col items-center">
<h2 class="text-5xl font-extrabold text-white">${data.name}, ${
    data.sys.country
  }</h2>
<p class="text-lg text-gray-200">${new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })}</p>
<img src="${getWeatherIconUrl(
    iconCode
  )}" alt="${description}" class="w-32 h-32 my-2">
<div class="flex items-start">
<p id="main-temp" class="text-8xl font-light text-white">${temp.replace(
    /°[CF]$/,
    ""
  )}</p>
<span id="temp-unit" class="text-3xl font-light text-white mt-4">${temp.slice(
    -2
  )}</span>
</div>
<p class="text-2xl font-semibold text-white mb-6">${description}</p> 
<div class="grid grid-cols-3 gap-4 text-center w-full max-w-sm">
<div class="p-3 bg-black/30 backdrop-blur-sm rounded-lg"> 
<span class="text-sm font-medium text-gray-200">💧 Humidity</span>
<p class="text-xl font-bold text-white">${humidity}%</p>
</div>
<div class="p-3 bg-black/30 backdrop-blur-sm rounded-lg"> 
<span class="text-sm font-medium text-gray-200">🍃 Wind</span>
<p class="text-xl font-bold text-white">${windSpeed} m/s</p>
</div>
<div class="p-3 bg-black/30 backdrop-blur-sm rounded-lg"> 
<span class="text-sm font-medium text-gray-200">🌡️ Feels Like</span>
<p class="text-xl font-bold text-white">${kelvinToUnits(
    data.main.feels_like
  )}</p>
</div>
</div>
${alertMessage}
</div>
`;
}

// display 5-days forecast

function displayExtendedForecast(list) {
  const dailyForecasts = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; //yyyy-mm-dd extraction

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temps: [],
        wind: item.wind.speed,
        humidity: item.main.humidity,
        timestamp: item.dt * 1000,
        icon: item.weather[0].icon,
      };
    }

    dailyForecasts[date].temps.push(item.main.temp); // get all temp for a given day

    if (item.dt_txt.includes("12:00:00") || item.dt_txt.includes("15:00:00")) {
      dailyForecasts[date].icon = item.weather[0].icon;
    }
  });

  // removed todays data cus its on the main card
  const todayKey = Object.keys(dailyForecasts)[0];

  delete dailyForecasts[todayKey];

  forecastContainer.innerHTML = "";

  Object.keys(dailyForecasts)
    .slice(0, 5)
    .forEach((dateKey) => {
      const dayData = dailyForecasts[dateKey];
      const minTemp = Math.min(...dayData.temps);
      const maxTemp = Math.max(...dayData.temps);

      const dateObj = new Date(dayData.timestamp);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

      const cardHTML = `
            <div class="bg-fuchsia-200/20 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center border border-gray-200 hover:shadow-xl hover:bg-fuchsia-300/50 transition duration-300">
                <p class="text-lg font-bold text-weather-dark mb-1">${dayName}</p>
                <img src="${getWeatherIconUrl(
                  dayData.icon ? dayData.icon : "01d"
                )}" alt="Weather Icon" class="w-12 h-12 mx-auto">
                <p class="text-xl font-bold text-weather-blue">
                ${kelvinToUnits(maxTemp)} / ${kelvinToUnits(minTemp)} </p>

                <div class="mt-2 text-sm text-gray-600">
                    <p>🍃 ${dayData.wind} m/s</p>
                    <p>💧 ${dayData.humidity}%</p>
                </div>
            </div>
        `;

      forecastContainer.insertAdjacentHTML("beforeend", cardHTML);
    });

  if (Object.keys(dailyForecasts).length > 0) {
    extendedForecastTitle.classList.remove("hidden");
  }
}

//  Event listeners

function init() {
  updateToggleLabels();
  //weather for default coty
  fetchCurrentWeather(DEFAULT_CITY);

  //Search input
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  //search btn

  searchBtn.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
      fetchCurrentWeather(city);
      searchInput.value = "";
    } else {
      displayError("Please enter a city name...");
    }
  });

  //current location btn

  currentLocationBtn.addEventListener("click", getCurrentLocationWeather);

  //temperature toggle

  tempToggleSwitch.addEventListener("change", toggleTemperatureUnit);

  //Recent searchs
  recentCitiesDropdown.addEventListener("change", (e) => {
    const city = e.target.value;
    if (city) {
      fetchCurrentWeather(city);
      e.target.value = "";
    }
  });

  loadRecentCities();
}
init();

//Temperature Toggle

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  updateToggleLabels();

  const cityElement = weatherDisplay.querySelector("h2");

  if (cityElement) {
    const currentCity = cityElement.textContent.split(",")[0].trim();
    fetchCurrentWeather(currentCity);
  }
}
function updateToggleLabels() {
  if (isCelsius) {
    celsiusLabel.classList.remove("text-purple-400");
    celsiusLabel.classList.add("text-white");
    fahrenheitLabel.classList.remove("text-white");
    fahrenheitLabel.classList.add("text-purple-400");
  } else {
    fahrenheitLabel.classList.remove("text-purple-400");
    fahrenheitLabel.classList.add("text-white");
    celsiusLabel.classList.remove("text-white");
    celsiusLabel.classList.add("text-purple-400");
  }

  tempToggleSwitch.checked = !isCelsius;
}

//Geolocation

function getCurrentLocationWeather() {
  clearError();

  if (navigator.geolocation) {
    weatherDisplay.innerHTML = `
<p class="text-center text-xl text-gray-500 animate-pulse">
Requesting location...
</p>
 `;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetchWeatherByCoords(latitude, longitude);
      },

      (error) => {
        console.error("Geolocation Error Code:", error.code);
        let errorMessage = "Unable to retrive your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += "Enable location permission.";
        }
        displayError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 600000,
      }
    );
  } else {
    displayError("Geolocation is not supported on your current browser.");
  }
}

async function fetchWeatherByCoords(lat, lon) {
  clearError();
  weatherDisplay.innerHTML = `
<p class="text-center text-xl text-gray-500 animate-pulse">
Fetching weather for your location...
</p>
`;

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Unable to fetch weather data for coordinates. Status: ${response.status}`
      );
    }
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(lat, lon);
    updateRecentCities(data.name);
  } catch (error) {
    console.error("Fetch weather by coords error:", error);
    displayError(error.message);
  }
}

// loade recent cities

function loadRecentCities() {
  const storedCities = localStorage.getItem("recentCities");
  if (storedCities) {
    recentCities = JSON.parse(storedCities);
    renderRecentCitiesDropdown();
  }
}

function updateRecentCities(city) {
  const normalizedCity = city.trim();
  recentCities = recentCities.filter(
    (c) => c.toLowerCase() !== normalizedCity.toLowerCase()
  ); //remove if already exists

  recentCities.unshift(normalizedCity);
  recentCities = recentCities.slice(0, 5);

  localStorage.setItem("recentCities", JSON.stringify(recentCities)); //saving the recent cities to local storage
  renderRecentCitiesDropdown();
}

function renderRecentCitiesDropdown() {
  recentCitiesDropdown.innerHTML =
    '<option value="" disabled selected>Recently searched...</option>';

  if (recentCities.length > 0) {
    recentCitiesDropdown.classList.remove("hidden");
    recentCities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      recentCitiesDropdown.appendChild(option);
    });
  } else {
    recentCitiesDropdown.classList.add("hidden");
  }
}
