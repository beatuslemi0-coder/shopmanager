// ============================================================
// SHOPMANAGER OFFLINE DATABASE + AUTOMATIC SYNC
// ============================================================

const DB_NAME = "SHOPMANAGER_OFFLINE";
const DB_VERSION = 1;

let dbInstance = null;
let productSyncRunning = false;


// ============================================================
// 1. KUFUNGUA DATABASE
// ============================================================

function openOfflineDB() {

    if (dbInstance) {
        return Promise.resolve(dbInstance);
    }

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {

            const db = event.target.result;

            if (!db.objectStoreNames.contains("products")) {
                db.createObjectStore("products", {
                    keyPath: "id"
                });
            }

            if (!db.objectStoreNames.contains("customers")) {
                db.createObjectStore("customers", {
                    keyPath: "id"
                });
            }

            if (!db.objectStoreNames.contains("sales")) {
                db.createObjectStore("sales", {
                    keyPath: "offline_id"
                });
            }

            if (!db.objectStoreNames.contains("expenses")) {
                db.createObjectStore("expenses", {
                    keyPath: "offline_id"
                });
            }

            if (!db.objectStoreNames.contains("sync_queue")) {
                db.createObjectStore("sync_queue", {
                    keyPath: "id",
                    autoIncrement: true
                });
            }

            if (!db.objectStoreNames.contains("app_data")) {
                db.createObjectStore("app_data", {
                    keyPath: "key"
                });
            }

            console.log("SHOPMANAGER Offline Database created!");
        };

        request.onsuccess = (event) => {

            dbInstance = event.target.result;

            dbInstance.onversionchange = () => {
                dbInstance.close();
                dbInstance = null;
            };

            console.log("Offline Database opened successfully!");

            resolve(dbInstance);
        };

        request.onerror = () => {
            reject(request.error);
        };

        request.onblocked = () => {
            console.warn("Database upgrade is blocked.");
        };

    });
}


// ============================================================
// 2. KUHIFADHI TAARIFA
// ============================================================

async function saveOfflineData(storeName, data) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(storeName, "readwrite");

        const request = transaction.objectStore(storeName).put(data);

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

        transaction.onerror = () => reject(transaction.error);

        transaction.onabort = () => reject(transaction.error);

    });
}


// ============================================================
// 3. KUSOMA TAARIFA ZOTE
// ============================================================

async function getAllOfflineData(storeName) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(storeName, "readonly");

        const request = transaction.objectStore(storeName).getAll();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });
}


// ============================================================
// 4. KUSOMA TAARIFA MOJA
// ============================================================

async function getOfflineData(storeName, id) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(storeName, "readonly");

        const request = transaction.objectStore(storeName).get(id);

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });
}


// ============================================================
// 5. KUFUTA TAARIFA
// ============================================================

async function deleteOfflineData(storeName, id) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(storeName, "readwrite");

        const request = transaction.objectStore(storeName).delete(id);

        request.onsuccess = () => resolve(true);

        request.onerror = () => reject(request.error);

        transaction.onerror = () => reject(transaction.error);

    });
}


// ============================================================
// 6. KUHIFADHI TAARIFA NYINGI
// ============================================================

async function saveMultipleOfflineData(storeName, items) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(storeName, "readwrite");

        const store = transaction.objectStore(storeName);

        items.forEach((item) => {
            store.put(item);
        });

        transaction.oncomplete = () => resolve(items.length);

        transaction.onerror = () => reject(transaction.error);

        transaction.onabort = () => reject(transaction.error);

    });
}


// ============================================================
// 7. KUONGEZA KAZI KWENYE SYNC QUEUE
// ============================================================

async function addToSyncQueue(item) {

    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction("sync_queue", "readwrite");

        const request = transaction.objectStore("sync_queue").add({
            ...item,
            status: "pending",
            created_at: item.created_at || new Date().toISOString()
        });

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });
}


// ============================================================
// 8. KUSAFISHA PAYLOAD ZA PRODUCTS NA CUSTOMERS
// ============================================================

function cleanOfflinePayload(data) {

    const payload = { ...data };

    delete payload.id;
    delete payload.offline;
    delete payload.updated_at;
    delete payload.offline_id;

    return payload;
}


function cleanProductPayload(product) {

    return cleanOfflinePayload(product);

}


// ============================================================
// 9. KUSAFISHA PAYLOAD ZA SALES
// ============================================================

function cleanSalePayload(sale) {

    const payload = { ...sale };

    delete payload.id;
    delete payload.offline;
    delete payload.sync_status;
    delete payload.offline_created_at;

    // Muhimu:
    // Hatuondoi offline_id.
    // Backend inaitumia kuzuia duplicate sales.

    return payload;

}


// ============================================================
// 10. KUPATA RECORD KUTOKA API RESPONSE
// ============================================================

function getCreatedProductFromResponse(response) {

    if (response?.id !== undefined) {
        return response;
    }

    if (response?.data?.id !== undefined) {
        return response.data;
    }

    if (response?.product?.id !== undefined) {
        return response.product;
    }

    if (response?.sale?.id !== undefined) {
        return response.sale;
    }

    if (response?.expense?.id !== undefined) {
        return response.expense;
    }

    return null;

}


// ============================================================
// 11. KUBADILISHA TEMPORARY IDs KWENYE SALES
// ============================================================

async function updatePendingSaleReferences(entity, localId, realId) {

    const queueItems = await getAllOfflineData("sync_queue");

    for (const job of queueItems) {

        if (job.entity !== "sale" || !job.payload) {
            continue;
        }

        let updated = false;

        const payload = { ...job.payload };

        // Badilisha customer ID
        if (
            entity === "customer" &&
            Number(payload.customer_id) === Number(localId)
        ) {

            payload.customer_id = realId;
            updated = true;

        }

        // Badilisha product IDs ndani ya sale items
        if (entity === "product" && Array.isArray(payload.items)) {

            payload.items = payload.items.map(item => {

                if (Number(item.product_id) === Number(localId)) {

                    updated = true;

                    return {
                        ...item,
                        product_id: realId
                    };

                }

                return item;

            });

        }

        if (updated) {

            await saveOfflineData("sync_queue", {
                ...job,
                payload
            });

        }

    }

}


// ============================================================
// 12. SYNCHRONIZATION YA PRODUCTS NA CUSTOMERS
// ============================================================

async function syncPendingProductsAndCustomers() {

    const queueItems = await getAllOfflineData("sync_queue");

    const pendingItems = queueItems
        .filter(item =>
            ["product", "customer"].includes(item.entity) &&
            item.status !== "failed"
        )
        .sort((a, b) => {

            const order = {
                product: 1,
                customer: 2
            };

            return order[a.entity] - order[b.entity];

        });

    let syncedCount = 0;

    for (const job of pendingItems) {

        if (!navigator.onLine) {
            break;
        }

        try {

            const entity = job.entity;

            const storageName = entity === "product"
                ? "products"
                : "customers";

            const createFunction = entity === "product"
                ? api.createProduct.bind(api)
                : api.createCustomer.bind(api);

            const updateFunction = entity === "product"
                ? api.updateProduct.bind(api)
                : api.updateCustomer.bind(api);

            const getFunction = entity === "product"
                ? api.product?.bind(api)
                : null;

            const payload = cleanOfflinePayload(job.payload || {});

            if (job.operation === "create") {

                const response = await createFunction(payload);

                const serverRecord =
                    getCreatedProductFromResponse(response);

                if (!serverRecord || serverRecord.id === undefined) {

                    throw new Error(
                        `${entity} API response haina ID halisi.`
                    );

                }

                const realId = serverRecord.id;

                const localRecord = await getOfflineData(
                    storageName,
                    job.local_id
                );

                await saveOfflineData(storageName, {
                    ...(localRecord || {}),
                    ...serverRecord,
                    id: realId,
                    offline: false
                });

                if (job.local_id !== realId) {

                    await updatePendingSaleReferences(
                        entity,
                        job.local_id,
                        realId
                    );

                    await deleteOfflineData(
                        storageName,
                        job.local_id
                    );

                }

            } else if (job.operation === "update") {

                const response = await updateFunction(
                    job.local_id,
                    {
                        ...job.payload,
                        id: undefined
                    }
                );

                let updatedRecord =
                    getCreatedProductFromResponse(response);

                if (!updatedRecord && getFunction) {

                    updatedRecord = await getFunction(job.local_id);

                }

                const localRecord = await getOfflineData(
                    storageName,
                    job.local_id
                );

                await saveOfflineData(storageName, {
                    ...(localRecord || {}),
                    ...(updatedRecord || {}),
                    id: job.local_id,
                    offline: false
                });

            } else {

                console.warn(
                    "Unknown sync operation:",
                    job.operation
                );

                continue;

            }

            await deleteOfflineData("sync_queue", job.id);

            syncedCount++;

            console.log(
                `${entity} synchronized successfully:`,
                job.local_id
            );

        } catch (error) {

            console.error(
                `${job.entity} synchronization failed:`,
                error
            );

        }

    }

    return syncedCount;

}


// ============================================================
// 13. SYNCHRONIZATION YA OFFLINE EXPENSES
// ============================================================

function cleanExpensePayload(expense, includeOfflineId = false) {

    const payload = { ...expense };

    delete payload.id;
    if (!includeOfflineId) {
        delete payload.offline_id;
    }
    delete payload.offline;
    delete payload.sync_status;
    delete payload.created_at;
    delete payload.updated_at;

    return payload;

}


async function syncPendingExpenses() {

    const queueItems = await getAllOfflineData("sync_queue");
    const pendingExpenses = queueItems
        .filter(item =>
            item.entity === "expense" &&
            item.status !== "failed"
        )
        .sort((a, b) => a.id - b.id);

    let syncedCount = 0;

    for (const job of pendingExpenses) {

        if (!navigator.onLine) {
            break;
        }

        try {

            const offlineId =
                job.offline_id || job.payload?.offline_id;

            if (!offlineId) {
                throw new Error("Expense haina offline_id.");
            }

            if (job.operation === "create") {

                const response = await api.createExpense(
                    cleanExpensePayload(job.payload || {}, true)
                );
                const serverExpense =
                    getCreatedProductFromResponse(response);

                if (!serverExpense || serverExpense.id === undefined) {
                    throw new Error(
                        "Expense API response haijarudisha ID halisi."
                    );
                }

                const localExpense = await getOfflineData(
                    "expenses",
                    offlineId
                );

                await saveOfflineData("expenses", {
                    ...(localExpense || {}),
                    ...serverExpense,
                    offline_id: offlineId,
                    offline: false,
                    sync_status: "synced"
                });

            } else if (job.operation === "update") {

                const response = await api.updateExpense(
                    job.local_id,
                    cleanExpensePayload(job.payload || {})
                );
                const serverExpense =
                    getCreatedProductFromResponse(response);
                const localExpense = await getOfflineData(
                    "expenses",
                    offlineId
                );

                await saveOfflineData("expenses", {
                    ...(localExpense || {}),
                    ...(serverExpense || {}),
                    id: job.local_id,
                    offline_id: offlineId,
                    offline: false,
                    sync_status: "synced"
                });

            } else if (job.operation === "delete") {

                await api.deleteExpense(job.local_id);
                await deleteOfflineData("expenses", offlineId);

            } else {

                throw new Error(
                    `Unknown expense sync operation: ${job.operation}`
                );

            }

            await deleteOfflineData("sync_queue", job.id);
            syncedCount++;

            console.log(
                "Expense synchronized successfully:",
                job.local_id
            );

        } catch (error) {

            console.error("Expense synchronization failed:", error);

        }

    }

    return syncedCount;

}


// ============================================================
// 14. SYNCHRONIZATION YA OFFLINE SALES
// ============================================================

async function syncPendingSales() {

    const queueItems = await getAllOfflineData("sync_queue");

    // Kama product au customer bado hazijasawazishwa,
    // sales zitasubiri kwanza.

    const pendingDependencies = queueItems.filter(job =>
        ["product", "customer"].includes(job.entity)
    );

    if (pendingDependencies.length > 0) {

        console.log(
            "Sales zinasubiri Products/Customers kusawazishwa."
        );

        return 0;

    }

    const pendingSales = queueItems.filter(job =>
        job.entity === "sale" &&
        job.operation === "create" &&
        job.status !== "failed"
    );

    let syncedCount = 0;

    for (const job of pendingSales) {

        if (!navigator.onLine) {
            break;
        }

        try {

            const payload = cleanSalePayload(job.payload || {});

            const offlineId = job.offline_id || payload.offline_id;

            if (!offlineId) {

                throw new Error(
                    "Sale haina offline_id. Haiwezi kusawazishwa."
                );

            }

            if (!Array.isArray(payload.items) || !payload.items.length) {

                throw new Error(
                    "Sale haina bidhaa (items)."
                );

            }

            // Tuma sale kwenda backend
            const response = await api.createSale(payload);

            const serverSale =
                getCreatedProductFromResponse(response);

            if (!serverSale) {

                throw new Error(
                    "Sale API response haijarudisha taarifa za sale."
                );

            }

            // Soma sale ya awali kwenye IndexedDB
            const localSale = await getOfflineData(
                "sales",
                offlineId
            );

            // Hifadhi sale iliyosawazishwa
            await saveOfflineData("sales", {

                ...(localSale || {}),
                ...serverSale,

                // Hifadhi offline_id kwa sababu ni keyPath
                offline_id: offlineId,

                offline: false,
                sync_status: "synced"

            });

            // Ondoa kazi iliyofanikiwa kwenye queue
            await deleteOfflineData(
                "sync_queue",
                job.id
            );

            syncedCount++;

            console.log(
                "Sale synchronized successfully:",
                offlineId
            );

        } catch (error) {

            console.error(
                "Sale synchronization failed:",
                error
            );

            // Usifute job.
            // Itajaribiwa tena mtandao ukiwa tayari.

        }

    }

    return syncedCount;

}


// ============================================================
// 14. FUNCTION KUU YA AUTOMATIC SYNCHRONIZATION
// ============================================================

async function syncPendingData() {

    if (productSyncRunning) {
        return;
    }

    if (!navigator.onLine) {

        console.log("SHOPMANAGER is offline.");

        return;

    }

    if (
        typeof api === "undefined" ||
        typeof api.createProduct !== "function" ||
        typeof api.createCustomer !== "function" ||
        typeof api.createSale !== "function" ||
        typeof api.createExpense !== "function" ||
        typeof api.updateExpense !== "function" ||
        typeof api.deleteExpense !== "function"
    ) {

        console.warn("API haijawa tayari.");

        return;

    }

    if (!localStorage.getItem("shopmanager_token")) {

        console.log(
            "Ingia kwenye akaunti kabla ya synchronization."
        );

        return;

    }

    productSyncRunning = true;

    try {

        let totalSynced = 0;

        // Hatua ya kwanza: Products na Customers
        const productsCustomersSynced =
            await syncPendingProductsAndCustomers();

        totalSynced += productsCustomersSynced;

        // Hatua ya pili: Expenses
        if (navigator.onLine) {

            const expensesSynced = await syncPendingExpenses();

            totalSynced += expensesSynced;

        }

        // Hatua ya tatu: Sales
        if (navigator.onLine) {

            const salesSynced = await syncPendingSales();

            totalSynced += salesSynced;

        }

        console.log(
            `Total synchronized items: ${totalSynced}`
        );

        if (totalSynced > 0) {

            window.dispatchEvent(
                new CustomEvent("shopmanager:sync-complete", {

                    detail: {
                        syncedCount: totalSynced
                    }

                })
            );

        }

    } catch (error) {

        console.error(
            "SHOPMANAGER synchronization error:",
            error
        );

    } finally {

        productSyncRunning = false;

    }

}


// ============================================================
// 15. KUSAWAZISHA BIDHAA ZA SERVER NA LOCAL
// ============================================================

async function syncProductsToLocal() {

    if (!navigator.onLine) {

        console.log("Offline: Using local products.");

        return await getAllOfflineData("products");

    }

    try {

        const response = await api.products();

        const serverProducts = Array.isArray(response)
            ? response
            : response?.data;

        if (!Array.isArray(serverProducts)) {

            throw new Error(
                "Invalid products response."
            );

        }

        const localProducts =
            await getAllOfflineData("products");

        const pendingQueue =
            await getAllOfflineData("sync_queue");

        const pendingLocalIds = new Set(

            pendingQueue
                .filter(item => item.entity === "product")
                .map(item => item.local_id)

        );

        const serverIds = new Set(
            serverProducts.map(product => product.id)
        );

        await saveMultipleOfflineData(
            "products",
            serverProducts
        );

        // Linda bidhaa ambazo bado hazijatumwa server.
        const productsToPreserve = localProducts.filter(
            product =>
                pendingLocalIds.has(product.id) &&
                !serverIds.has(product.id)
        );

        if (productsToPreserve.length) {

            await saveMultipleOfflineData(
                "products",
                productsToPreserve
            );

        }

        return [
            ...serverProducts,
            ...productsToPreserve
        ];

    } catch (error) {

        console.error(
            "Product sync failed:",
            error
        );

        return await getAllOfflineData("products");

    }

}


// ============================================================
// 16. KUHESABU KAZI ZINAZOSUBIRI
// ============================================================

async function getPendingSyncCount() {

    const pendingItems =
        await getAllOfflineData("sync_queue");

    return pendingItems.length;

}


// ============================================================
// 17. KUANGALIA INTERNET
// ============================================================

function isDeviceOnline() {

    return navigator.onLine;

}


// ============================================================
// 18. KUANZISHA AUTOMATIC SYNC
// ============================================================

function startAutomaticSync() {

    window.addEventListener("online", () => {

        console.log(
            "Internet imerudi. Synchronization inaanza..."
        );

        syncPendingData();

    });

    // Jaribu pia kama ukurasa umefunguliwa online.
    window.setTimeout(() => {

        if (navigator.onLine) {

            syncPendingData();

        }

    }, 2500);

}


// ============================================================
// 19. KUANZISHA DATABASE
// ============================================================

openOfflineDB()

    .then(() => {

        console.log(
            "SHOPMANAGER Offline Database is ready!"
        );

        startAutomaticSync();

    })

    .catch(error => {

        console.error(
            "Database initialization failed:",
            error
        );

    });


console.log(
    "SHOPMANAGER Offline Database module loaded!"
);