const API_KEY = "eb9a4f14a0b0eaa35e2a45e52d59aeb8";
const searchButton = document.querySelector(".search-button");
const cityInput = document.querySelector(".city-input");
const weatherDisplay = document.querySelector(".weather-display"); // Define this selector properly
const historyList = document.querySelector(".history");

// Event listener for search button
searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        saveToHistory(city);
        cityInput.value = "";
    }
});

// Function to fetch weather data
async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        console.log(`Fetching weather data from: ${url}`); // Debug: log the URL
        const response = await fetch(url);

        // Check if the response is valid
        if (!response.ok) {
            throw new Error('City not found');
        }

        const weatherData = await response.json();
        console.log(weatherData); // Debug: Check if data is being fetched
        displayWeatherData(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to retrieve weather data. Please check the city name.');
    }
}

// Function to display weather data on the page
function displayWeatherData(data) {
    const { name } = data;
    const { temp, humidity } = data.main;
    const { description, icon } = data.weather[0];

    weatherDisplay.innerHTML = `
        <h3>${name}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Forecast: ${description}</p>
    `;
}

// Function to save search history
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("weatherHistory", JSON.stringify(history));
        displayHistory();
    }
}

// Function to display search history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    historyList.innerHTML = "";

    history.forEach(city => {
        const listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", () => getWeatherData(city));
        historyList.appendChild(listItem);
    });
}

// Load search history when the page loads
window.addEventListener("load", displayHistory);
