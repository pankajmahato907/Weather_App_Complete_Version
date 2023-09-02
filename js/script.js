//Name: Pankaj Kumar Mahato
// Student ID : 2358577

// Define the default city for weather display
let defaultCity = "Halton";

// Function to display the weather for the default city when the page loads
function displayDefaultWeather() {
  fetchWeatherData(defaultCity); // Fetch weather data for the default city
}

displayDefaultWeather(); // Display default city weather when the page loads

// Function to search for weather when the user enters a city name
function searchWeather() {
  let cityInput = document.getElementById("city-input").value; // Get the entered city name from the input field

  // If the city name is empty, display an error message and clear weather data display
  if (cityInput.trim() === "") {
    displayErrorMessage("Please enter a city name.");
    clearWeatherData();
  } else {
    clearErrorMessage(); // Clear any previous error messages
    fetchWeatherData(cityInput); // Fetch weather data for the entered city
  }
}

// Function to display an error message
function displayErrorMessage(message) {
  clearWeatherData(); // Clear weather data display
  document.getElementById("error-message").textContent = message; // Set the error message content
}

// Function to clear the error message
function clearErrorMessage() {
  document.getElementById("error-message").textContent = ""; // Clear the error message content
}

// Function to clear the weather data display
function clearWeatherData() {
  document.getElementById("weather-info").innerHTML = ""; // Clear the weather data container
}

// Function to fetch weather data from the OpenWeatherMap API
function fetchWeatherData(city) {
  var apiKey = '682acabc5414ff4c86618f367fa2d926';
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  // Fetch data from the API
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error("Unable to fetch weather data. Please enter a valid city name.");
      }
    })
    .then(function (data) {
      displayWeatherData(city, data); // Display the fetched weather data
    })
    .catch(function (error) {
      displayErrorMessage(error.message); // Display an error message if there's an issue with fetching data
    });
}

// Function to display the weather data
function displayWeatherData(city, data) {
  let weatherInfoContainer = document.getElementById("weather-info");
  weatherInfoContainer.innerHTML = ""; // Clear any previous weather data

  // Extract relevant weather data from the API response
  let dayAndDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let weatherCondition = data.weather[0].description;
  let weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  let temperature = data.main.temp;
  let pressure = data.main.pressure;
  let windSpeed = data.wind.speed;
  let humidity = data.main.humidity;
  fetch('./php/insert.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // Sending fetched data as JSON to PHP
  })
  .then(response => response.text())
  .then(responseText => {
    console.log(responseText); // Log the response from PHP
  })
  .catch(error => {
    console.error('Error sending data to PHP:', error);
  });
  document.querySelector(".historyButton").addEventListener("click", () => {
    window.location.href = `history.html?city=${city}`;
  });
  // Create the HTML content to display the weather data
  let weatherData = `
    <h2 id="city">${city}</h2>
    <p id="day">${dayAndDate}</p>
    <p class="curr-temp">
    ${temperature} °C
    </p>
    <img src="${weatherIcon}" alt="Weather Icon" id=icon>
    <p id= "condition">${weatherCondition}</p>
    <div class="weather-box">
      <p class="box" id="pressure">Pressure: ${pressure} hPa</p>
    </div>
    <div class="weather-box">
      <p class="box" id="wind">Wind Speed: ${windSpeed} m/s</p>
    </div>
    <div class="weather-box">
      <p class="box" id="humidity">Humidity: ${humidity}%</p>
    </div>
  `;

  // Display the weather data in the designated container
  weatherInfoContainer.innerHTML = weatherData;
}

// Add event listener to trigger searchWeather() function when the enter key is pressed
document.getElementById("city-input").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});