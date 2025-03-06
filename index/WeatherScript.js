document.getElementById("searchBtn").addEventListener("click", async () => {
    let countryName = document.getElementById("searchBox").value.trim();
    if (!countryName) return alert("❗ אנא הזן שם מדינה!");

    // 🔄 תרגום אם הקלט בעברית
    if (/[\u0590-\u05FF]/.test(countryName)) {
        countryName = await translateToEnglish(countryName);
    }

    fetchWeather(countryName);
});

// ✅ פונקציה לשליפת מזג האוויר
async function fetchWeather(countryName) {
    const weatherAPIKey = "c39a1fb6be4e8d27925a42d034b26995"; // 🔑 API חינמי
    const geoAPI = `https://restcountries.com/v3.1/name/${countryName}?fields=name,cca2`;

    try {
        // 1️⃣ שליפת קוד המדינה
        const countryResponse = await fetch(geoAPI);
        if (!countryResponse.ok) throw new Error("❌ המדינה לא נמצאה!");
        const countryData = await countryResponse.json();
        const country = countryData.find(c => c.cca2); // מחפשים קוד מדינה
        if (!country) throw new Error("❌ לא נמצאו תוצאות למדינה שחיפשת.");

        const countryCode = country.cca2;

        // 2️⃣ שליפת מזג אוויר
        const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${weatherAPIKey}&units=metric&lang=he`;
        const weatherResponse = await fetch(weatherAPI);
        if (!weatherResponse.ok) throw new Error("❌ מזג האוויר לא נמצא!");

        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);
    } catch (error) {
        document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

// ✅ הצגת נתוני מזג האוויר
function displayWeather(weather) {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;
    const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    const description = weather.weather[0].description;

    document.getElementById("weatherResult").innerHTML = `
        <h2>${weather.name}</h2>
        <img class="weather-icon" src="${icon}" alt="סמל מזג אוויר">
        <p><strong>🌡 טמפרטורה:</strong> ${temp}°C</p>
        <p><strong>💧 לחות:</strong> ${humidity}%</p>
        <p><strong>💨 מהירות רוח:</strong> ${windSpeed} קמ"ש</p>
        <p><strong>🌤 תיאור:</strong> ${description}</p>
    `;
}

// ✅ פונקציה לתרגום עברית לאנגלית עם MyMemory API (חינם!)
async function translateToEnglish(hebrewText) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(hebrewText)}&langpair=he|en`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.responseData?.translatedText || hebrewText;
    } catch {
        return hebrewText;
    }
}
