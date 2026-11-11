
// SHOPMANAGER OFFLINE DATABASE
const DB_NAME = "SHOPMANAGER_OFFLINE";
const DB_VERSION = 1;

let dbInstance = null;

// 1. KUFUNGUA DATABASE YA KIFAA

function openOfflineDB() {

    // Kama database tayari imefunguliwa, itumie
    if (dbInstance) {
        return Promise.resolve(dbInstance);
    }

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Kutengeneza database na stores zake
        request.onupgradeneeded = (event) => {

            const db = event.target.result;

            // Products
            if (!db.objectStoreNames.contains("products")) {
                db.createObjectStore("products", {
                    keyPath: "id"
                });
            }

            // Customers
            if (!db.objectStoreNames.contains("customers")) {
                db.createObjectStore("customers", {
                    keyPath: "id"
                });
            }

            // Sales
            if (!db.objectStoreNames.contains("sales")) {
                db.createObjectStore("sales", {
                    keyPath: "offline_id"
                });
            }

            // Expenses
            if (!db.objectStoreNames.contains("expenses")) {
                db.createObjectStore("expenses", {
                    keyPath: "offline_id"
                });
            }

            // Sync Queue
            if (!db.objectStoreNames.contains("sync_queue")) {
                db.createObjectStore("sync_queue", {
                    keyPath: "id",
                    autoIncrement: true
                });
            }

            // General App Data
            if (!db.objectStoreNames.contains("app_data")) {
                db.createObjectStore("app_data", {
                    keyPath: "key"
                });
            }

            console.log("SHOPMANAGER Offline Database created!");
        };

        // Database ikifunguka
        request.onsuccess = (event) => {

            dbInstance = event.target.result;

            // Kufunga connection kama database version itabadilika
            dbInstance.onversionchange = () => {
                dbInstance.close();
                dbInstance = null;
            };

            console.log("Offline Database opened successfully!");

            resolve(dbInstance);
        };

        // Database ikishindwa kufunguka
        request.onerror = () => {

            console.error("IndexedDB Error:", request.error);

            reject(request.error);
        };

        request.onblocked = () => {

            console.warn("Database upgrade is blocked.");
        };

    });
}

// 2. KUHIFADHI TAARIFA KWENYE INDEXEDDB

async function saveOfflineData(storeName, data) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        try {

            const transaction = db.transaction(storeName, "readwrite");

            const store = transaction.objectStore(storeName);

            const request = store.put(data);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };

        } catch (error) {

            reject(error);
        }

    });
}

// 3. KUSOMA TAARIFA ZOTE

async function getAllOfflineData(storeName) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        try {

            const transaction = db.transaction(storeName, "readonly");

            const store = transaction.objectStore(storeName);

            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };

        } catch (error) {

            reject(error);
        }

    });
}

// 4. KUSOMA TAARIFA MOJA KWA ID

async function getOfflineData(storeName, id) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        try {

            const transaction = db.transaction(storeName, "readonly");

            const store = transaction.objectStore(storeName);

            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };

        } catch (error) {

            reject(error);
        }

    });
}

// 5. KUFUTA TAARIFA

async function deleteOfflineData(storeName, id) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        try {

            const transaction = db.transaction(storeName, "readwrite");

            const store = transaction.objectStore(storeName);

            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };

        } catch (error) {

            reject(error);
        }

    });
}
// 6. KUHIFADHI BIDHAA NYINGI

async function saveMultipleOfflineData(storeName, items) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        try {

            const transaction = db.transaction(storeName, "readwrite");

            const store = transaction.objectStore(storeName);

            items.forEach((item) => {
                store.put(item);
            });

            transaction.oncomplete = () => {
                resolve(items.length);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };

            transaction.onabort = () => {
                reject(transaction.error);
            };

        } catch (error) {

            reject(error);
        }

    });
}

// 7. KUSAWAZISHA BIDHAA KUTOKA FASTAPI KWENDA INDEXEDDB

async function syncProductsToLocal() {

    try {

        // Angalia kama internet ipo
        if (!navigator.onLine) {

            console.log("Offline: Using locally saved products.");

            return await getAllOfflineData("products");
        }

        // Hakikisha API ipo
        if (typeof api === "undefined" ||
            typeof api.products !== "function") {

            throw new Error("Products API function is not available.");
        }

        // Pata bidhaa kutoka FastAPI
        const response = await api.products();

        // Hakikisha response ni array ya bidhaa
        const products = Array.isArray(response)
            ? response
            : response?.data;

        if (!Array.isArray(products)) {

            throw new Error("Invalid products response from API.");
        }

        // Hifadhi bidhaa zote kwenye IndexedDB
        await saveMultipleOfflineData("products", products);

        console.log(
            `${products.length} products saved locally successfully!`
        );

        return products;

    } catch (error) {

        console.error("Product synchronization failed:", error);

        // Kama API imeshindwa, jaribu kutumia bidhaa zilizopo local
        if (!navigator.onLine) {

            return await getAllOfflineData("products");
        }

        throw error;
    }
}

// 8. KUHESABU TAARIFA ZINAZOSUBIRI

async function getPendingSyncCount() {

    const pendingItems = await getAllOfflineData("sync_queue");

    return pendingItems.length;
}

// 9. KUANGALIA HALI YA INTERNET

function isDeviceOnline() {

    return navigator.onLine;
}
// SHOPMANAGER OFFLINE DATABASE READY

console.log("SHOPMANAGER Offline Database module loaded!");