const urlBase = `https://api.openweathermap.org/data/2.5/weather`;
const API_KEY = 'TU_CLAVE_DE_API_AQUI';
const diffKelvin = 273.15;

document.getElementById("searchButton").addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();

    if (city) {
        // Llamar a la API para obtener la información del clima
        fetchWeather(city);
    } else {
        showNotification("Por favor, ingrese una ciudad válida", "warning");
    }
});

function fetchWeather(city) {
    fetch(`${urlBase}?q=${city}&appid=${API_KEY}&lang=es`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ciudad no encontrada o problema con la solicitud');
            }
            return response.json();
        })
        .then(data => showWeatherData(data))
        .catch(error => showNotification(error.message, "error"));
}

function showWeatherData(data) {
    const divResponseData = document.getElementById("responseData");
    divResponseData.innerHTML = "";

    const { name: cityName, sys: { country: countryName }, main: { temp, humidity }, weather } = data;
    const { description, icon } = weather[0];

    const cityInfo = createParagraph(`${cityName}, ${countryName}`, "h2");
    const tempInfo = createParagraph(`Temperatura: ${Math.floor(temp - diffKelvin)}°C`);
    const humidityInfo = createParagraph(`Humedad: ${humidity}%`);
    const descriptionInfo = createParagraph(`Descripción: ${description}`);
    const iconInfo = document.createElement("img");
    iconInfo.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconInfo.alt = description;

    divResponseData.append(cityInfo, tempInfo, humidityInfo, iconInfo, descriptionInfo);
}

function createParagraph(text, tag = "p") {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

