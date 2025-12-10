# 🌤️ Weather Forecast App

It is a modern, responsive web application designed to provide **real-time and accurate weather forecasts** for any location worldwide. It implements all specified features, including current conditions, a 5-day's extended forecast, and a user-friendly search interface.

## Features

- Current Weather Conditions
- Multi-Day Extended Forecast
- Location Search
- Unit Conversion (C/F)
- Geolocation Detection

## Installation

Follow these steps to set up and run the project locally.

### 1. Download and Extract the Project

```bash
# Clone the repository to your local machine
git clone [Your GitHub Repository URL Here]
```

### 2. Obtain an API Key

This application uses the **OpenWeatherMap API**.

- Sign up for a free account at OpenWeatherMap.
- Navigate to the API Keys section and obtain your unique **API Key**.

### 3. API Key Configuration

**IMPORTANT:** THE KEY BELOW IS INACTIVE/REVOKED.

- **const API_KEY = "253527e6bb138d2127973c8361ebda7b";**

To run the project replace this value with your own active OpenWeatherMap API Key.

- **const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE";**

### 4. Run the Application

Once the key is updated, simply open the **index.html** file in any web browser to run the application.

```bash
# Open the file directly from your operating system's file explorer.
open index.html
```

## Usage Guide

### 1. Searching for Weather

- **By City Name:** Type the desired city name into the input field and click the **Search** button.

- **By Current Location:** Click the location pin button 📍. Your browser will prompt you to grant location access.

  
### 2. Temperature Unit Toggle

To switch between **Celsius (°C)** and **Fahrenheit (°F)**, use the toggle switch located next to the location pin.

### 3. Accessing Recent Searches

- The **Recently searched...** dropdown will appear below the search bar after you have successfully searched for a city.

- Clicking a city in this dropdown will instantly update the weather forecast. The application saves the last 5 unique cities using your browser's **Local Storage**.

## Tech Stack

**HTML5**

**JavaScript**

**Tailwind CSS**

**OpenWeatherMap API**

**Font Awesome**

## Authors

- Prathamesh Giradkar

- [GitHub](https://github.com/Prathamesh910)
