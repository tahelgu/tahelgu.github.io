const translations = {
    en: {
        title: "LETS FIND A COUNTRY",
        search: "Search 👇",
        errorNoCountry: "❗ Please enter a country name!",
        errorNotFound: "❌ Country not found! Please check the name.",
        placeholder: "Enter country name here"
    },
    he: {
        title: "בואו נחפש ונמצא מדינות",
        search: "חפש 👇",
        errorNoCountry: "❗ אנא הזן שם מדינה!",
        errorNotFound: "❌ המדינה לא נמצאה! ודא שהשם נכון.",
        placeholder: "הקלד שם מדינה כאן..."
    }
};

const countryCache = {};

document.getElementById("searchBtn").addEventListener("click", async () => {
    let countryName = document.getElementById("searchBox").value.trim();
    if (!countryName) return alert(translations[document.documentElement.lang].errorNoCountry);

    if (/[\u0590-\u05FF]/.test(countryName)) {
        countryName = await translateToEnglish(countryName);
    }

    fetchCountry(countryName);
});

function changeLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.getElementById("searchBox").placeholder = translations[lang].placeholder;

    document.body.setAttribute("lang", lang === "he" ? "he" : "en");
    localStorage.setItem("selectedLanguage", lang);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    changeLanguage(savedLanguage);
});

async function fetchCountry(countryName) {
    if (countryCache[countryName]) {
        return displayCountry(countryCache[countryName]);
    }

    const apiURL = `https://restcountries.com/v3.1/name/${countryName}?fields=name,flags,capital,population,region,translations,cca2`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error(translations[document.documentElement.lang].errorNotFound);

        const data = await response.json();
        if (!data.length) throw new Error(translations[document.documentElement.lang].errorNotFound);

        const country = data.find(c => c.cca2 === "CN") || data[0];
        countryCache[countryName] = country;
        displayCountry(country);
    } catch (error) {
        document.getElementById("result").innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

function displayCountry(country) {
    const countryNameHebrew = country.translations?.heb?.common || country.name.common;
    const capital = country.capital?.[0] || "אין מידע";
    const population = country.population?.toLocaleString() || "אין מידע";
    const region = country.region || "אין מידע";

    document.getElementById("result").innerHTML = `
        <h2>${countryNameHebrew} (${country.cca2})</h2>
        <img class="flag" src="${country.flags.svg}" alt="דגל">
        <p><strong>בירה:</strong> ${capital}</p>
        <p><strong>אוכלוסייה:</strong> ${population}</p>
        <p><strong>אזור:</strong> ${region}</p>
    `;
}


async function translateToEnglish(hebrewText) {
    const cachedTranslation = localStorage.getItem(`translate-${hebrewText}`);
    if (cachedTranslation) return cachedTranslation;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(hebrewText)}&langpair=he|en`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const translatedText = data.responseData?.translatedText || hebrewText;

        localStorage.setItem(`translate-${hebrewText}`, translatedText);
        return translatedText;
    } catch {
        return hebrewText;
    }


}
