// ======================================================
// SHOPMANAGER API + LANGUAGE SYSTEM
// ======================================================

// URL ya backend yetu ya FastAPI
const API_BASE = " https://shopmanager-wwn6.onrender.com";


// ======================================================
// API FUNCTION
// ======================================================

async function api(path, opt = {}) {

    // Helper huyu ndiye bridge kati ya HTML/JS na FastAPI
    const h = {
        "Content-Type": "application/json",
        ...(opt.headers || {})
    };

    // Tunapata token ya user aliyelogin
    const t = localStorage.getItem("shop_token");

    // Tunaweka token kwenye request kama user amelogin
    if (opt.auth !== false && t) {
        h.Authorization = "Bearer " + t;
    }

    // Tunatuma request kwenda FastAPI
    const cleanPath = (typeof path === "string" && path.startsWith('/')) ? path : '/' + (path || '');
    const cleanBase = (typeof API_BASE === "string" && API_BASE.endsWith('/')) ? API_BASE.slice(0,-1) : API_BASE;
    const r = await fetch(cleanBase + cleanPath, {

        method: opt.method || "GET",

        headers: h,

        body:
            opt.body && typeof opt.body !== "string"
                ? JSON.stringify(opt.body)
                : opt.body,
    });

    // Tunapata response kutoka backend
    const d = await r.json().catch(() => ({
        detail: "Server response error"
    }));

    // Kama backend imerudisha error
    if (!r.ok) {
        throw Error(d.detail || "Request failed");
    }

    return d;
}


// ======================================================
// LOGIN
// ======================================================

async function login(e, p) {

    // Tunatuma login details kwenda FastAPI
    const x = await api("v1/auth/login", {

        method: "POST",

        auth: false,

        body: {
            email: e,
            password: p
        }

    });

    // Tunahifadhi access token
    localStorage.setItem("shop_token", x.access_token);

    // Tunahifadhi taarifa za user
    localStorage.setItem(
        "shop_user",
        JSON.stringify(x.user)
    );
}


// ======================================================
// REGISTER
// ======================================================

async function register(n, e, p) {

    // Tunatuma registration details kwenda backend
    const x = await api("v1/auth/register", {

        method: "POST",

        auth: false,

        body: {
            full_name: n,
            email: e,
            password: p
        }

    });

    // Tunahifadhi token
    localStorage.setItem(
        "shop_token",
        x.access_token
    );

    // Tunahifadhi user
    localStorage.setItem(
        "shop_user",
        JSON.stringify(x.user)
    );
}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    // Tunaondoa taarifa za login
    localStorage.removeItem("shop_token");
    localStorage.removeItem("shop_user");

    // Tunaenda login page
    location.href = "login.html";
}


// ======================================================
// LANGUAGE SYSTEM
// ======================================================

// Lugha ya default ni Kiswahili
// Kama user hajawahi kuchagua lugha, tutatumia English
// Hapa tumechagua English kama default ya mfumo.
let currentLanguage =
    localStorage.getItem("shop_language") || "en";


// Maneno ya navigation kwa lugha zote mbili
const translations = {

    en: {

        dashboard: "Dashboard",
        products: "Products",
        sales: "Sales",
        expenses: "Expenses",
        customers: "Customers",
        reports: "Reports",
        ads: "Ads",
        marketplace: "Marketplace",

        language: "Language",
        swahili: "Kiswahili",
        english: "English"

    },


    sw: {

        dashboard: "Dashibodi",
        products: "Bidhaa",
        sales: "Mauzo",
        expenses: "Gharama",
        customers: "Wateja",
        reports: "Ripoti",
        ads: "Matangazo",
        marketplace: "Soko",

        language: "Lugha",
        swahili: "Kiswahili",
        english: "English"
    

    }

};


// ======================================================
// GET TRANSLATION
// ======================================================

function t(key) {

    // Tunatafuta neno kwenye lugha iliyochaguliwa
    return translations[currentLanguage][key] || key;
}


// ======================================================
// CHANGE LANGUAGE
// ======================================================

function changeLanguage(language) {

    // Tunaangalia kama lugha ipo kwenye mfumo
    if (language !== "en" && language !== "sw") {
        return;
    }

    // Tunahifadhi lugha kwenye browser
    localStorage.setItem(
        "shop_language",
        language
    );

    location.reload();
}


// ======================================================
// APPLY LANGUAGE
// ======================================================

function applyLanguage() {

    // Elements zote zenye data-i18n
    const elements =
        document.querySelectorAll("[data-i18n]");

    elements.forEach(element => {

        const key =
            element.getAttribute("data-i18n");

        element.textContent = t(key);

    });


    // Tunatafsiri placeholders pia
    const placeholders =
        document.querySelectorAll("[data-i18n-placeholder]");

    placeholders.forEach(element => {

        const key =
            element.getAttribute(
                "data-i18n-placeholder"
            );

        element.placeholder = t(key);

    });


    // Tunafanya language selector ionyeshe lugha iliyopo
    const languageSelect =
        document.getElementById("languageSelect");

    if (languageSelect) {

        languageSelect.value =
            currentLanguage;

    }

}


// ======================================================
// NAVIGATION
// ======================================================

function nav() {

    // Tunatafuta sehemu ya navigation
    const n =
        document.getElementById("nav");

    // Kama page haina nav, tunatoka
    if (!n) {
        return;
    }


    // Tunatengeneza navigation
    n.innerHTML = `

        <header class="header">

            <b>SHOPMANAGER</b>

            <nav>

                <a href="dashboard.html">
                    ${t("dashboard")}
                </a>

                <a href="products.html">
                    ${t("products")}
                </a>

                <a href="sales.html">
                    ${t("sales")}
                </a>

                <a href="expenses.html">
                    ${t("expenses")}
                </a>

                <a href="customers.html">
                    ${t("customers")}
                </a>

                <a href="reports.html">
                    ${t("reports")}
                </a>

                <a href="advertisements.html">
                    ${t("ads")}
                </a>

                <a href="marketplace.html">
                    ${t("marketplace")}
                </a>

            </nav>


            <div class="language-box">

                <label for="languageSelect">
                    ${t("language")}:
                </label>

                <select
                    id="languageSelect"
                    onchange="changeLanguage(this.value)"
                >

                    <option value="en">
                        English
                    </option>

                    <option value="sw">
                        Kiswahili
                    </option>

                </select>

            </div>

        </header>

    `;


    // Tunaweka lugha iliyochaguliwa
    const languageSelect =
        document.getElementById("languageSelect");

    if (languageSelect) {

        languageSelect.value =
            currentLanguage;

    }

}


// ======================================================
// IMAGE UPLOAD
// ======================================================

async function uploadImage(file) {

    // FormData inahitajika wakati tunatuma file
    const formData = new FormData();

    // Tunaweka picha ndani ya FormData
    formData.append("file", file);

    // Tunapata token ya seller
    const token =
        localStorage.getItem("shop_token");


    // Tunatuma picha kwenda FastAPI
    const response = await fetch(
        API_BASE + "/uploads/image",
        {

            method: "POST",

            headers: token
                ? {
                    Authorization: "Bearer " + token
                }
                :{},
            body: formData
        }
    );

    // Tunapata response
    const data =
        await response.json();


    // Kama kuna error
    if (!response.ok) {

        throw new Error(
            data.detail || "Image upload failed"
        );

    }


    // Tunairudisha image URL
    return data.image_url;
}


// ======================================================
// RUN LANGUAGE SYSTEM
// ======================================================

// Tunatengeneza navigation
nav();

// Tunatumia language iliyochaguliwa
applyLanguage();