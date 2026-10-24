const API_DEFAULT_URL = "https://shopmanager-wwn6.onrender.com/api/v1";

class ShopApi {
  constructor() {
    this.baseUrl = (
      localStorage.getItem("shopmanager_api_url") || API_DEFAULT_URL
    ).replace(/\/$/, "");
    this.token = localStorage.getItem("shopmanager_token") || "";
  }

  setBaseUrl(url) {
    this.baseUrl = url.trim().replace(/\/$/, "");
    localStorage.setItem("shopmanager_api_url", this.baseUrl);
  }

  setToken(token) {
    this.token = token || "";
    if (this.token) localStorage.setItem("shopmanager_token", this.token);
    else localStorage.removeItem("shopmanager_token");
  }

  async request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (this.token && options.auth !== false)
      headers.set("Authorization", `Bearer ${this.token}`);
    const isForm = options.body instanceof FormData;
    if (options.body != null && !isForm && typeof options.body !== "string") {
      headers.set("Content-Type", "application/json");
      options.body = JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    } catch {
      throw new Error(
        `Could not reach the API at ${this.baseUrl}. Start the backend and check the API URL.`,
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    if (!response.ok) {
      const detail = typeof result === "object" ? result.detail : result;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg || JSON.stringify(item)).join("; ")
        : detail;
      if (response.status === 401 && options.auth !== false) this.setToken("");
      throw new Error(message || `Request failed (${response.status})`);
    }
    return result;
  }

  get(path, options) {
    return this.request(path, options);
  }
  post(path, body, options = {}) {
    return this.request(path, { ...options, method: "POST", body });
  }
  put(path, body) {
    return this.request(path, { method: "PUT", body });
  }
  delete(path) {
    return this.request(path, { method: "DELETE" });
  }

  login(data) {
    return this.post("/auth/login", data, { auth: false });
  }
  register(data) {
    return this.post("/auth/register", data, { auth: false });
  }
  forgotPassword(data) {
    return this.post("/auth/forgot-password", data, { auth: false });
  }
  resetPassword(data) {
    return this.post("/auth/reset-password", data, { auth: false });
  }
  me() {
    return this.get("/auth/me");
  }
  updateProfileImage(profileImageUrl) {
    return this.put("/auth/me/profile-image", {
      profile_image_url: profileImageUrl,
    });
  }
  business() {
    return this.get("/businesses/me");
  }
  saveBusiness(data, exists) {
    return exists
      ? this.put("/businesses/me", data)
      : this.post("/businesses/me", data);
  }
  products(search = "") {
    return this.get(
      `/products${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    );
  }
  product(id) {
    return this.get(`/products/${id}`);
  }
  createProduct(data) {
    return this.post("/products", data);
  }
  updateProduct(id, data) {
    return this.put(`/products/${id}`, data);
  }
  deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }
  sales() {
    return this.get("/sales");
  }
  createSale(data) {
    return this.post("/sales", data);
  }
  expenses() {
    return this.get("/expenses");
  }
  createExpense(data) {
    return this.post("/expenses", data);
  }
  updateExpense(id, data) {
    return this.put(`/expenses/${id}`, data);
  }
  deleteExpense(id) {
    return this.delete(`/expenses/${id}`);
  }
  customers() {
    return this.get("/customers");
  }
  createCustomer(data) {
    return this.post("/customers", data);
  }
  updateCustomer(id, data) {
    return this.put(`/customers/${id}`, data);
  }
  deleteCustomer(id) {
    return this.delete(`/customers/${id}`);
  }
  report(period) {
    return this.get(`/reports/summary?period=${encodeURIComponent(period)}`);
  }
  dailyReport() {
    return this.get("/reports/daily");
  }
  weeklyReport() {
    return this.get("/reports/weekly");
  }
  monthlyReport() {
    return this.get("/reports/monthly");
  }
  yearlyReport() {
    return this.get("/reports/yearly");
  }
  dashboard() {
    return this.get("/reports/dashboard");
  }
  monthlyTrend(month) {
    return this.get(`/reports/monthly-trend?month=${encodeURIComponent(month)}`);
  }
  subscriptionPlans() {
    return this.get("/subscriptions/plans", { auth: false });
  }
  submitSubscriptionPayment(data) {
    const params = new URLSearchParams({
      plan_id: String(data.plan_id),
      phone_number: data.phone_number,
      transaction_reference: data.transaction_reference,
    });
    return this.request(`/subscriptions/payments?${params}`, {
      method: "POST",
    });
  }
  mySubscriptionPayments() {
    return this.get("/subscriptions/my-payments");
  }
  mySubscription() {
    return this.get("/subscriptions/my-subscription");
  }
  uploadImage(file) {
    const form = new FormData();
    form.append("file", file);
    return this.post("/uploads/image", form);
  }
  adminStats() {
    return this.get("/admin/stats");
  }
  adminUsers() {
    return this.get("/admin/users");
  }
  pendingSubscriptionPayments() {
    return this.get("/admin/payments/pending");
  }
  approveSubscriptionPayment(id) {
    return this.post(`/admin/payments/${id}/approve`, {});
  }
  deactivateUser(id) {
    return this.post(`/admin/users/${id}/deactivate`, {});
  }
  activateUser(id) {
    return this.post(`/admin/users/${id}/activate`, {});
  }
  async health() {
    const origin = this.baseUrl.replace(/\/api\/v1\/?$/, "");
    const response = await fetch(`${origin}/health`);
    if (!response.ok)
      throw new Error(`Health check failed (${response.status})`);
    return response.json();
  }
}

const api = new ShopApi();
