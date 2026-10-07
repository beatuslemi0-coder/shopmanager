

// URL ya backend yetu ya FastAPI
const API_BASE = "https://shopmanager-wwn6.onrender.com/api/v1";


// Tunachukua lugha iliyohifadhiwa kwenye browser.
// Kama hakuna lugha iliyowahi kuchaguliwa, tunatumia English.
let currentLanguage =
    localStorage.getItem("shop_language") || "en";


const translations = {


    en: {

        // Navigation

        dashboard: "Dashboard",
        products: "Products",
        sales: "Sales",
        expenses: "Expenses",
        customers: "Customers",
        reports: "Reports",
        ads: "Ads",
        marketplace: "Marketplace",

        // Language

        language: "Language",
        english: "English",
        swahili: "Kiswahili",

        // General

        save: "Save",
        delete: "Delete",
        edit: "Edit",
        cancel: "Cancel",
        add: "Add",
        update: "Update",
        submit: "Submit",
        search: "Search",
        generate: "Generate",
        logout: "Logout",
        close: "Close",
        back: "Back",
        next: "Next",
        yes: "Yes",
        no: "No",
        loading: "Loading...",
        actions: "Actions",
        details: "Details",
        status: "Status",
        date: "Date",
        total: "Total",

        // -------------------------------
        // Dashboard
        // -------------------------------

        welcome: "Welcome",
        business_profile: "Business Profile",

        business_name: "Business name",
        owner_name: "Owner name",
        phone: "Phone",
        location: "Location",
        category: "Category",
        address: "Address",
        description: "Description",

        // Dashboard cards
        revenue: "Revenue",
        profit: "Profit",
        cost: "Cost",
        expenses_label: "Expenses",
        products_label: "Products",
        low_stock: "Low stock",
        customers_label: "Customers",

        // -------------------------------
        // Products
        // -------------------------------

        product: "Product",
        product_name: "Product name",
        buying_price: "Buying price",
        selling_price: "Selling price",
        stock_quantity: "Stock quantity",
        minimum_stock: "Minimum stock",
        product_description: "Product description",
        add_product: "Add Product",
        product_list: "Product List",
        stock: "Stock",

        // -------------------------------
        // Sales
        // -------------------------------

        record_sale: "Record Sale",
        quantity: "Quantity",
        payment_method: "Payment method",
        cash: "Cash",
        mobile_money: "Mobile Money",
        bank: "Bank",
        card: "Card",
        other: "Other",

        sales_history: "Sales History",
        sale: "Sale",
        sales_count: "Sales Count",
        products_sold: "Products Sold",

        // -------------------------------
        // Expenses
        // -------------------------------

        expense: "Expense",
        expense_category: "Category",
        amount: "Amount",
        expense_description: "Description",

        add_expense: "Add Expense",
        expense_list: "Expense List",

        // -------------------------------
        // Customers
        // -------------------------------

        customer: "Customer",
        customer_name: "Customer name",
        email: "Email",
        customer_address: "Address",
        notes: "Notes",

        add_customer: "Add Customer",
        customer_list: "Customer List",

        all_customers: "all customers",
        name: "Name",
        actions: "Actions",
        refresh: "Refresh",
        id: "Id",

        // -------------------------------
        // Reports
        // -------------------------------

        reports_title: "Reports",
        profit_loss: "Profit & Loss",

        today: "Today",
        yesterday: "Yesterday",
        week: "This Week",
        month: "This Month",
        year: "This Year",

        cogs: "COGS",
        gross_profit: "Gross Profit",
        net_profit: "Net Profit",
        margin: "Margin",
        transactions: "Transactions",

        report_summary: "Report Summary",
        daily_report: "Daily Report",
        weekly_report: "Weekly Report",
        monthly_report: "Monthly Report",
        yearly_report: "Yearly Report",

        // -------------------------------
        // Advertisements
        // -------------------------------

        advertisement: "Advertisement",
        advertisements: "Advertisements",
        title: "Title",
        price: "Price",
        image: "Image",
        publish: "Publish",
        create_advertisement: "Create Advertisement",
        select_product_image: "Select product image",
        my_advertisements: "My Advertisements",

        // -------------------------------
        // Marketplace
        // -------------------------------

        marketplace_title: "Marketplace",
        marketplace_description: "Browse products from different businesses",
        view_product: "View Product",
        contact_seller: "Contact Seller",

        // -------------------------------
        // Messages
        // -------------------------------

        saved_successfully: "Saved successfully",
        deleted_successfully: "Deleted successfully",
        updated_successfully: "Updated successfully",
        business_profile_saved: "Business profile saved",
        image_upload_failed: "Image upload failed",
        request_failed: "Request failed",
        server_response_error: "Server response error"
    },


    // KISWAHILI

    sw: {

        // -------------------------------
        // Navigation
        // -------------------------------

        dashboard: "Dashibodi",
        products: "Bidhaa",
        sales: "Mauzo",
        expenses: "Gharama",
        customers: "Wateja",
        reports: "Ripoti",
        ads: "Matangazo",
        marketplace: "Soko",

        // Language

        language: "Lugha",
        english: "English",
        swahili: "Kiswahili",

        // General

        save: "Hifadhi",
        delete: "Futa",
        edit: "Hariri",
        cancel: "Ghairi",
        add: "Ongeza",
        update: "Sasisha",
        submit: "Tuma",
        search: "Tafuta",
        generate: "Tengeneza",
        logout: "Ondoka",
        close: "Funga",
        back: "Rudi",
        next: "Endelea",
        yes: "Ndiyo",
        no: "Hapana",
        loading: "Inapakia...",
        actions: "Vitendo",
        details: "Maelezo",
        status: "Hali",
        date: "Tarehe",
        total: "Jumla",

        // Dashboard

        welcome: "Karibu",
        business_profile: "Taarifa za Biashara",

        business_name: "Jina la biashara",
        owner_name: "Jina la mmiliki",
        phone: "Simu",
        location: "Mahali",
        category: "Aina ya biashara",
        address: "Anwani",
        description: "Maelezo",

        // Dashboard cards
        revenue: "Mapato",
        profit: "Faida",
        cost: "Gharama za Bidhaa",
        expenses_label: "Matumizi",
        products_label: "Bidhaa",
        low_stock: "Bidhaa chache",
        customers_label: "Wateja",

        // Products

        product: "Bidhaa",
        product_name: "Jina la bidhaa",
        buying_price: "Bei ya kununua",
        selling_price: "Bei ya kuuza",
        stock_quantity: "Idadi ya bidhaa",
        minimum_stock: "Kiwango cha chini cha stock",
        product_description: "Maelezo ya bidhaa",
        add_product: "Ongeza Bidhaa",
        product_list: "Orodha ya Bidhaa",
        stock: "Stock",

        // Sales

        record_sale: "Rekodi Mauzo",
        quantity: "Idadi",
        payment_method: "Njia ya malipo",
        cash: "Fedha taslimu",
        mobile_money: "Pesa za simu",
        bank: "Benki",
        card: "Kadi",
        other: "Nyingine",

        sales_history: "Historia ya Mauzo",
        sale: "Mauzo",
        sales_count: "Idadi ya Mauzo",
        products_sold: "Bidhaa Zilizouzwa",

        // Expenses


        expense: "Matumizi",
        expense_category: "Aina ya matumizi",
        amount: "Kiasi",
        expense_description: "Maelezo",

        add_expense: "Ongeza Matumizi",
        expense_list: "Orodha ya Matumizi",

        // Customers

        customer: "Mteja",
        customer_name: "Jina la mteja",
        email: "Barua pepe",
        customer_address: "Anwani",
        notes: "Maelezo ya ziada",

        add_customer: "Ongeza Mteja",
        customer_list: "Orodha ya Wateja",

        all_customers: "wateja wote",
        name: "Jina",
        actions: "Vitendo",
        refresh: "Onyesha upya",
        id: "namba",

        // Reports

        reports_title: "Ripoti",
        profit_loss: "Faida na Hasara",

        today: "Leo",
        yesterday: "Jana",
        week: "Wiki Hii",
        month: "Mwezi Huu",
        year: "Mwaka Huu",

        cogs: "Gharama za Bidhaa Zilizouzwa",
        gross_profit: "Faida Ghafi",
        net_profit: "Faida Halisi",
        margin: "Asilimia ya Faida",
        transactions: "Miamala",

        report_summary: "Muhtasari wa Ripoti",
        daily_report: "Ripoti ya Kila Siku",
        weekly_report: "Ripoti ya Wiki",
        monthly_report: "Ripoti ya Mwezi",
        yearly_report: "Ripoti ya Mwaka",

        // Advertisements

        advertisement: "Tangazo",
        advertisements: "Matangazo",
        title: "Kichwa",
        price: "Bei",
        image: "Picha",
        publish: "Chapisha",
        create_advertisement: "Tengeneza Tangazo",
        select_product_image: "Chagua picha ya didhaa",
        my_advertisements: "Matangazo yangu",

        // -------------------------------
        // Marketplace
        // -------------------------------

        marketplace_title: "Soko",
        marketplace_description:
            "Angalia bidhaa kutoka kwenye biashara mbalimbali",
        view_product: "Angalia Bidhaa",
        contact_seller: "Wasiliana na Muuzaji",

        // -------------------------------
        // Messages
        // -------------------------------

        saved_successfully: "Imehifadhiwa kwa mafanikio",
        deleted_successfully: "Imefutwa kwa mafanikio",
        updated_successfully: "Imesasishwa kwa mafanikio",
        business_profile_saved:
            "Taarifa za biashara zimehifadhiwa",
        image_upload_failed:
            "Imeshindikana kupakia picha",
        request_failed:
            "Ombi limeshindwa",
        server_response_error:
            "Tatizo limetokea kwenye majibu ya server"
    }
};
// 4. TRANSLATION FUNCTION

function t(key) {

    // Tunatafuta translation kulingana
    // na lugha iliyochaguliwa.

    return translations[currentLanguage]?.[key] || key;
}

// 5. API HELPER

async function api(path, opt = {}) {

    // Helper huyu ndiye bridge kati ya HTML/JS
    // na FastAPI backend.

    const h = {
        "Content-Type": "application/json",
        ...(opt.headers || {})
    };


    // Tunapata token ya user aliyelogin.

    const token =
        localStorage.getItem("shop_token");


    // Kama request inahitaji authentication,
    // tunaweka JWT token.

    if (opt.auth !== false && token) {

        h.Authorization = "Bearer " + token;

    }


    // Tunahakikisha path inaanza na /

    const cleanPath =
        typeof path === "string" && path.startsWith("/")
            ? path
            : "/" + (path || "");


    // Tunahakikisha API_BASE haina /
    // mbili mwishoni.

    const cleanBase =
        typeof API_BASE === "string" &&
        API_BASE.endsWith("/")
            ? API_BASE.slice(0, -1)
            : API_BASE;


    // Tunatuma request kwenda FastAPI.

    const response = await fetch(
        cleanBase + cleanPath,
        {
            method: opt.method || "GET",
            headers: h,

            body:
                opt.body &&
                typeof opt.body !== "string"
                    ? JSON.stringify(opt.body)
                    : opt.body
        }
    );


    // Tunapata response kutoka backend.

    const data =
        await response.json().catch(() => ({
            detail: t("server_response_error")
        }));


    // Kama backend imerudisha error.

    if (!response.ok) {

        throw new Error(
            data.detail || t("request_failed")
        );

    }


    return data;
}

// 6. LOGIN

async function login(email, password) {

    const data = await api(
        "/auth/login",
        {
            method: "POST",
            auth: false,

            body: {
                email: email,
                password: password
            }
        }
    );


    // Tunahifadhi JWT token.

    localStorage.setItem(
        "shop_token",
        data.access_token
    );


    // Tunahifadhi taarifa za user.

    localStorage.setItem(
        "shop_user",
        JSON.stringify(data.user)
    );

}
// 7. REGISTER

async function register(
    fullName,
    email,
    password
) {

    const data = await api(
        "/auth/register",
        {
            method: "POST",
            auth: false,

            body: {
                full_name: fullName,
                email: email,
                password: password
            }
        }
    );


    // Tunahifadhi token.

    localStorage.setItem(
        "shop_token",
        data.access_token
    );


    // Tunahifadhi user.

    localStorage.setItem(
        "shop_user",
        JSON.stringify(data.user)
    );

}
// 8. LOGOUT

function logout() {

    // Tunaondoa token.

    localStorage.removeItem(
        "shop_token"
    );


    // Tunaondoa user.

    localStorage.removeItem(
        "shop_user"
    );


    // Tunaenda login page.

    location.href = "login.html";
}
// 9. CHANGE LANGUAGE

function changeLanguage(language) {

    // Tunakubali lugha mbili tu.

    if (
        language !== "en" &&
        language !== "sw"
    ) {
        return;
    }


    // Tunahifadhi lugha.

    localStorage.setItem(
        "shop_language",
        language
    );


    // Tunabadilisha current language.

    currentLanguage = language;


    // Tunatumia translation kwenye page.

    applyLanguage();


    // Tunajenga navigation upya.

    nav();


    // Refresh page ili content inayotengenezwa
    // na JavaScript nayo ipate lugha mpya.

    location.reload();
}
// 10. APPLY LANGUAGE

function applyLanguage() {

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.getAttribute("data-i18n");

            element.textContent = t(key);

        });


    // --------------------------------------------------------
    // B. Input placeholders
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-placeholder"
                );

            element.placeholder = t(key);

        });


    // --------------------------------------------------------
    // C. Title attributes
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "[data-i18n-title]"
        )
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-title"
                );

            element.title = t(key);

        });


    // --------------------------------------------------------
    // D. Language selector
    // --------------------------------------------------------

    const languageSelect =
        document.getElementById(
            "languageSelect"
        );


    if (languageSelect) {

        languageSelect.value =
            currentLanguage;

    }
}


// ============================================================
// 11. NAVIGATION
// ============================================================

function nav() {

    const n = document.getElementById("nav");

    if (!n) return;


    n.innerHTML = `

        <header class="header">

            <!-- LOGO -->
            <div class="brand">

                <a href="dashboard.html" class="brand-link">

                    <img
                        src="images/shopmanager-logo.png"
                        alt="SHOPMANAGER"
                        class="site-logo"
                    >

                </a>

            </div>


            <!-- Navigation -->
            <nav class="main-nav">

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


            <!-- Language -->
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


    const languageSelect =
        document.getElementById("languageSelect");


    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

// ============================================================
// 12. UPLOAD IMAGE
// ============================================================

async function uploadImage(file) {

    // FormData inahitajika wakati
    // tunatuma file.

    const formData =
        new FormData();


    // Tunaweka picha ndani ya FormData.

    formData.append(
        "file",
        file
    );


    // Tunapata token ya seller.

    const token =
        localStorage.getItem(
            "shop_token"
        );


    // Tunatuma picha kwenda FastAPI.

    const response = await fetch(
        API_BASE + "/uploads/image",
        {
            method: "POST",

            headers: token
                ? {
                    Authorization:
                        "Bearer " + token
                }
                : {},

            // MUHIMU:
            // Hatuweki Content-Type hapa.
            // Browser itaweka multipart/form-data
            // yenye boundary yenyewe.

            body: formData
        }
    );


    // Tunapata response.

    const data =
        await response.json();


    // Kama kuna error.

    if (!response.ok) {

        throw new Error(
            data.detail ||
            t("image_upload_failed")
        );

    }


    // Tunairudisha image URL.

    return data.image_url;
}

// 13. START SHOPMANAGER

// Tunajenga navigation.
nav();

// Tunatumia lugha iliyohifadhiwa.
applyLanguage();