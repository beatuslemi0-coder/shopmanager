const $ = (id) => document.getElementById(id);
const view = $("view");
const store = { user: null, business: null, products: [], customers: [], expenses: [], ads: [], section: "dashboard", editing: null, authMode: "login", language: localStorage.getItem("shopmanager_language") || "en" };

const swahili = {
  "Language": "Lugha", "Sign in": "Ingia", "Create your account": "Fungua akaunti yako", "Create account": "Fungua akaunti", "Manage your store operations.": "Simamia shughuli za duka lako.",
  "Create an account": "Fungua akaunti", "Start managing your business.": "Anza kusimamia biashara yako.",
  "Already have an account? Sign in": "Una akaunti tayari? Ingia", "Check API connection": "Angalia muunganisho wa API",
  "API URL": "Anwani ya API", "Full name": "Jina kamili", "Email": "Barua pepe", "Password": "Nenosiri",
  "Dashboard": "Dashibodi", "Inventory": "Bidhaa na stoku", "Sales": "Mauzo", "Expenses": "Matumizi",
  "Customers": "Wateja", "Reports": "Ripoti", "Advertisements": "Matangazo", "Public listings": "Matangazo ya umma",
  "Business profile": "Wasifu wa biashara", "Admin": "Msimamizi", "Sign out": "Toka", "Connected": "Imeunganishwa",
  "Loading": "Inapakia", "API error": "Hitilafu ya API", "Loading…": "Inapakia…", "Working...": "Inachakata...",
  "Revenue today": "Mapato ya leo", "Net profit": "Faida halisi", "Products": "Bidhaa", "Customers": "Wateja",
  "sales": "mauzo", "Margin": "Kiwango cha faida", "units sold today": "bidhaa zimeuzwa leo",
  "at or below minimum stock": "zimefikia au ziko chini ya kiwango cha chini cha stoku",
  "TODAY": "LEO", "Business activity": "Shughuli za biashara", "View reports": "Angalia ripoti",
  "Cost of goods": "Gharama ya bidhaa", "Gross profit": "Faida ghafi", "Recent sales": "Mauzo ya hivi karibuni",
  "Sale": "Muamala", "Date": "Tarehe", "Payment": "Malipo", "Revenue": "Mapato", "Profit": "Faida",
  "No sales recorded yet.": "Bado hakuna mauzo yaliyorekodiwa.", "Actions": "Vitendo", "Add product": "Ongeza bidhaa",
  "Edit product": "Hariri bidhaa", "Update product": "Sasisha bidhaa", "Product name": "Jina la bidhaa",
  "Buying price": "Bei ya kununua", "Selling price": "Bei ya kuuza", "Stock quantity": "Idadi ya stoku",
  "Minimum stock": "Stoku ya chini", "Product image": "Picha ya bidhaa", "Description": "Maelezo",
  "SKU": "SKU", "Price": "Bei", "Stock": "Stoku", "Status": "Hali", "Low stock": "Stoku ndogo",
  "In stock": "Ipo stokuni", "No products yet.": "Bado hakuna bidhaa.", "Search products": "Tafuta bidhaa",
  "Search products...": "Tafuta bidhaa...", "Edit": "Hariri", "Delete": "Futa", "Record sale": "Rekodi mauzo",
  "Customer": "Mteja", "Walk-in customer": "Mteja wa dukani", "Payment method": "Njia ya malipo",
  "Cash": "Taslimu", "Card": "Kadi", "Mobile Money": "Pesa kwa simu", "Bank Transfer": "Hamisho la benki",
  "Bank transfer": "Hamisho la benki", "Notes": "Maelezo ya ziada", "Add item": "Ongeza bidhaa",
  "Complete sale": "Kamilisha mauzo", "Sales history": "Historia ya mauzo", "Add expense": "Ongeza matumizi",
  "Edit expense": "Hariri matumizi", "Update expense": "Sasisha matumizi", "Category": "Aina", "Amount": "Kiasi",
  "No expenses recorded yet.": "Bado hakuna matumizi yaliyorekodiwa.", "Add customer": "Ongeza mteja",
  "Edit customer": "Hariri mteja", "Update customer": "Sasisha mteja", "Name": "Jina", "Phone": "Simu",
  "Address": "Anwani", "Customer directory": "Orodha ya wateja", "No customers yet.": "Bado hakuna wateja.",
  "REPORT SUMMARY": "MUHTASARI WA RIPOTI", "Period": "Kipindi", "Today": "Leo", "Yesterday": "Jana",
  "This week": "Wiki hii", "This month": "Mwezi huu", "This year": "Mwaka huu", "Period comparisons": "Ulinganisho wa vipindi",
  "Create advertisement": "Tengeneza tangazo", "Edit advertisement": "Hariri tangazo", "Update advertisement": "Sasisha tangazo",
  "Publish advertisement": "Chapisha tangazo", "Title": "Kichwa", "Linked product ID": "Namba ya bidhaa iliyounganishwa",
  "Published": "Imechapishwa", "Advertisement image": "Picha ya tangazo", "Your advertisements": "Matangazo yako",
  "Created": "Imetengenezwa", "Draft": "Rasimu", "No advertisements yet.": "Bado hakuna matangazo.",
  "Contact store": "Wasiliana na duka", "Store": "Duka", "There are no published listings.": "Hakuna matangazo yaliyochapishwa.",
  "Set up your business": "Sanidi biashara yako", "Save profile": "Hifadhi wasifu", "Create business": "Tengeneza biashara",
  "Business name": "Jina la biashara", "Owner name": "Jina la mmiliki", "Location": "Eneo", "Logo": "Nembo",
  "Total users": "Jumla ya watumiaji", "Active users": "Watumiaji hai", "Businesses": "Biashara",
  "Total products": "Jumla ya bidhaa", "Total sales": "Jumla ya mauzo", "Total advertisements": "Jumla ya matangazo",
  "Account controls": "Udhibiti wa akaunti", "User ID": "Namba ya mtumiaji", "Deactivate user": "Zima mtumiaji",
  "Remove advertisement": "Ondoa tangazo", "Advertisement ID": "Namba ya tangazo", "Cancel": "Ghairi",
  "Save": "Hifadhi", "Changes saved.": "Mabadiliko yamehifadhiwa.", "Sale recorded and stock updated.": "Mauzo yamerekodiwa na stoku imesasishwa.",
  "User deactivated.": "Mtumiaji amezimwa.", "Advertisement removed.": "Tangazo limeondolewa.", "Item deleted.": "Kipengee kimefutwa.",
  "Delete this item? This cannot be undone.": "Futa kipengee hiki? Hatua hii haiwezi kutenduliwa.", "Try again": "Jaribu tena",
  "Margin ": "Kiwango cha faida ", "available": "inapatikana", "Product": "Bidhaa", "Quantity": "Idadi",
  "No products available": "Hakuna bidhaa zinazopatikana", "Remove item": "Ondoa bidhaa", "Admin access required": "Unahitaji ruhusa ya msimamizi",
  "Checking…": "Inaangalia…", "API is reachable.": "API inapatikana.",
  "Open navigation menu": "Fungua menyu ya urambazaji", "Close navigation menu": "Funga menyu ya urambazaji",
  "User management": "Usimamizi wa watumiaji", "User accounts": "Akaunti za watumiaji", "Business": "Biashara",
  "Business owner": "Mmiliki wa biashara", "Role": "Jukumu", "Account": "Akaunti", "Active": "Hai",
  "Inactive": "Imesitishwa", "Joined": "Alijiunga", "Deactivate": "Sitisha", "Activate": "Washa",
  "Current account": "Akaunti ya sasa", "No users are registered.": "Hakuna watumiaji waliosajiliwa.",
  "Account status updated.": "Hali ya akaunti imesasishwa.",
  "Deactivate this account? The user will no longer be able to sign in.": "Sitisha akaunti hii? Mtumiaji hataweza tena kuingia.",
  "Change profile picture": "Badili picha ya wasifu", "Profile photo updated.": "Picha ya wasifu imesasishwa."
};

function translate(value) {
  if (store.language === "sw" && swahili[value]) return swahili[value];
  if (store.language === "en") {
    const swahiliMargin = value.match(/^Kiwango cha faida (.+)$/);
    if (swahiliMargin) return `Margin ${swahiliMargin[1]}`;
    const swahiliSales = value.match(/^(\d+) mauzo$/);
    if (swahiliSales) return `${swahiliSales[1]} sales`;
    const swahiliSold = value.match(/^(\d+) bidhaa zimeuzwa leo$/);
    if (swahiliSold) return `${swahiliSold[1]} units sold today`;
    const reverse = Object.entries(swahili).find(([, translated]) => translated === value);
    return reverse ? reverse[0] : value;
  }
  const margin = value.match(/^Margin (.+)$/);
  if (margin) return `Kiwango cha faida ${margin[1]}`;
  const match = value.match(/^(\d+) sales$/);
  if (match) return `${match[1]} mauzo`;
  const sold = value.match(/^(\d+) units sold today$/);
  if (sold) return `${sold[1]} bidhaa zimeuzwa leo`;
  return value;
}

function applyLanguage(root = document.body) {
  document.documentElement.lang = store.language;
  document.querySelectorAll(".language-select").forEach((select) => { select.value = store.language; });
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (parent && !["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) node.nodeValue = translate(node.nodeValue);
  }
  root.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
    for (const attribute of ["placeholder", "aria-label", "title"]) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, translate(element.getAttribute(attribute)));
    }
  });
}

function setupLanguage() {
  document.querySelectorAll(".language-select").forEach((select) => select.addEventListener("change", (event) => {
    store.language = event.target.value;
    localStorage.setItem("shopmanager_language", store.language);
    applyLanguage();
  }));
  applyLanguage();
}

const sections = [
  ["dashboard", "Dashboard"], ["products", "Inventory"], ["sales", "Sales"],
  ["expenses", "Expenses"], ["customers", "Customers"], ["reports", "Reports"],
  ["ads", "Advertisements"], ["public-ads", "Public listings"], ["business", "Business profile"],
];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function money(value) {
  const amount = new Intl.NumberFormat(store.language === "sw" ? "sw-TZ" : "en-TZ", { maximumFractionDigits: 2 }).format(Number(value || 0));
  return `TSh ${amount}`;
}

function toast(message, isError = false) {
  const element = $("toast");
  element.textContent = message;
  element.classList.toggle("toast--error", isError);
  element.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { element.hidden = true; }, 3600);
}

function setBusy(button, busy, label = "Working...") {
  if (!button) return;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = label;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.label || button.textContent;
    button.disabled = false;
  }
}

function showAuth() {
  $("app").hidden = true;
  $("authScreen").hidden = false;
  renderAuthFields();
}

function renderAuthFields() {
  const register = store.authMode === "register";
  $("authTitle").textContent = register ? "Create your account" : "Sign in";
  $("authCopy").textContent = register ? "Start managing your business." : "Manage your store operations.";
  $("authSubmit").textContent = register ? "Create account" : "Sign in";
  $("authSwitch").textContent = register ? "Already have an account? Sign in" : "Create an account";
  $("authFields").innerHTML = `${register ? '<label class="field field--wide"><span>Full name</span><input name="full_name" autocomplete="name" minlength="2" required></label>' : ""}
    <label class="field field--wide"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
    <label class="field field--wide"><span>Password</span><input name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="${register ? 6 : 1}" required></label>`;
  applyLanguage($("authScreen"));
}

async function enterWorkspace() {
  store.user = await api.me();
  try { store.business = await api.business(); } catch { store.business = null; }
  $("authScreen").hidden = true;
  $("app").hidden = false;
  $("userName").textContent = store.user.full_name;
  $("userEmail").textContent = store.user.email;
  renderProfileAvatar();
  renderNav();
  await navigate("dashboard");
}

function renderProfileAvatar() {
  const avatar = $("userAvatar");
  const image = store.user.profile_image_url
    ? `<img src="${escapeHtml(imageUrl(store.user.profile_image_url))}" alt="">`
    : `<span id="userAvatarInitial">${escapeHtml(store.user.full_name.charAt(0).toUpperCase())}</span>`;
  avatar.innerHTML = `${image}<span class="avatar-edit" aria-hidden="true">+</span>`;
}

function renderNav() {
  const items = [...sections];
  if (store.user.role === "admin") items.push(["admin", "Admin"]);
  $("nav").innerHTML = items.map(([id, label]) => `<button class="nav__item ${store.section === id ? "is-active" : ""}" type="button" data-nav="${id}"><span class="nav__mark"></span><span>${escapeHtml(label)}</span></button>`).join("");
}

async function navigate(section) {
  store.section = section;
  store.editing = null;
  renderNav();
  const title = [...sections, ["admin", "admin"]].find(([id]) => id === section)?.[1] || "Shop Manager";
  $("pageTitle").textContent = title;
  $("apiIndicator").textContent = "Loading";
  view.innerHTML = '<p class="loading-state">Loading…</p>';
  try {
    if (section === "dashboard") await renderDashboard();
    else if (section === "products") await renderProducts();
    else if (section === "sales") await renderSales();
    else if (section === "expenses") await renderExpenses();
    else if (section === "customers") await renderCustomers();
    else if (section === "reports") await renderReports();
    else if (section === "ads") await renderAdvertisements();
    else if (section === "public-ads") await renderPublicAds();
    else if (section === "business") await renderBusiness();
    else if (section === "admin") await renderAdmin();
    $("apiIndicator").textContent = "Connected";
  } catch (error) {
    $("apiIndicator").textContent = "API error";
    view.innerHTML = `<section class="empty-state"><h2>Could not load ${escapeHtml(title.toLowerCase())}</h2><p>${escapeHtml(error.message)}</p><button class="button button--secondary" data-action="reload">Try again</button></section>`;
  }
  applyLanguage(document.body);
}

function stat(label, value, detail = "") {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></article>`;
}

async function renderDashboard() {
  const data = await api.dashboard();
  const recentSales = await api.sales();
  const today = [
    ["Revenue today", money(data.revenue), `${data.sales_count} sales`],
    ["Net profit", money(data.net_profit), `Margin ${Number(data.profit_margin).toFixed(1)}%`],
    ["Products", data.total_products, `${data.low_stock_products} at or below minimum stock`],
    ["Customers", data.total_customers, `${data.products_sold} units sold today`],
  ];
  view.innerHTML = `<section class="metrics-grid">${today.map((item) => stat(...item)).join("")}</section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">TODAY</p><h2>Business activity</h2></div><button class="button button--secondary" data-nav="reports">View reports</button></div>
    <div class="summary-grid">${stat("Cost of goods", money(data.cost_of_goods))}${stat("Expenses", money(data.expenses))}${stat("Gross profit", money(data.gross_profit))}</div></section>
    ${tablePanel("Recent sales", ["Sale", "Date", "Payment", "Revenue", "Profit"], recentSales.slice(0, 8).map((sale) => [
      `#${sale.id}`, new Date(sale.created_at).toLocaleString(), sale.payment_method, money(sale.total_amount), money(sale.profit),
    ]), "No sales recorded yet.")}`;
}

function tablePanel(title, headers, rows, emptyText, actions = [], tools = "") {
  const table = rows.length ? `<div class="table-wrap"><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}${actions.length ? "<th>Actions</th>" : ""}</tr></thead><tbody>${rows.map((row, rowIndex) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}${actions.length ? `<td class="row-actions">${actions.map((button) => button(row, rowIndex)).join("")}</td>` : ""}</tr>`).join("")}</tbody></table></div>` : `<p class="empty-inline">${escapeHtml(emptyText)}</p>`;
  return `<section class="panel"><div class="panel-heading"><h2>${escapeHtml(title)}</h2>${tools}</div>${table}</section>`;
}

function field(name, label, type = "text", value = "", options = {}) {
  const required = options.required ? "required" : "";
  const placeholder = options.placeholder ? `placeholder="${escapeHtml(options.placeholder)}"` : "";
  const wide = options.wide ? " field--wide" : "";
  const safe = escapeHtml(value);
  let control;
  if (type === "textarea") control = `<textarea name="${name}" ${required} ${placeholder}>${safe}</textarea>`;
  else if (type === "select") control = `<select name="${name}" ${required}>${options.choices.map(([v, text]) => `<option value="${escapeHtml(v)}" ${String(v) === String(value) ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select>`;
  else if (type === "checkbox") control = `<input name="${name}" type="checkbox" ${value ? "checked" : ""}>`;
  else if (type === "image") control = `<input name="${name}" type="url" value="${safe}" placeholder="https://..."><input class="file-input" type="file" name="image_file" accept="image/jpeg,image/png,image/webp" aria-label="Upload image">`;
  else control = `<input name="${name}" type="${type}" value="${safe}" ${required} ${placeholder} ${options.min != null ? `min="${options.min}"` : ""} ${options.step ? `step="${options.step}"` : ""}>`;
  return `<label class="field${wide}"><span>${escapeHtml(label)}</span>${control}</label>`;
}

function editor(title, fields, submitText = "Save") {
  return `<form class="panel editor-form" data-form="record"><div class="panel-heading"><h2>${escapeHtml(title)}</h2></div><div class="form-grid">${fields.join("")}</div><div class="form-actions"><button class="button button--primary" type="submit">${escapeHtml(submitText)}</button>${store.editing ? '<button class="button button--secondary" type="button" data-action="cancel-edit">Cancel</button>' : ""}</div></form>`;
}

function actionButton(action, id, label, danger = false) {
  return `<button class="mini-button ${danger ? "mini-button--danger" : ""}" type="button" data-action="${action}" data-id="${id}">${label}</button>`;
}

async function renderProducts(search = "") {
  store.products = await api.products(search);
  const product = store.editing?.type === "product" ? store.editing.record : {};
  const formFields = [field("name", "Product name", "text", product.name || "", { required: true }), field("sku", "SKU", "text", product.sku || ""),
    field("buying_price", "Buying price", "number", product.buying_price || "", { required: true, min: 0, step: "0.01" }), field("selling_price", "Selling price", "number", product.selling_price || "", { required: true, min: 0, step: "0.01" }),
    field("stock_quantity", "Stock quantity", "number", product.stock_quantity ?? 0, { required: true, min: 0 }), field("minimum_stock", "Minimum stock", "number", product.minimum_stock ?? 5, { required: true, min: 0 }),
    field("image_url", "Product image", "image", product.image_url || "", { wide: true }), field("description", "Description", "textarea", product.description || "", { wide: true })];
  view.innerHTML = `${editor(store.editing ? "Edit product" : "Add product", formFields, store.editing ? "Update product" : "Add product")}
    ${tablePanel("Inventory", ["Product", "SKU", "Price", "Stock", "Status"], store.products.map((item) => [escapeHtml(item.name), escapeHtml(item.sku || "—"), money(item.selling_price), item.stock_quantity, item.stock_quantity <= item.minimum_stock ? '<span class="status status--low">Low stock</span>' : '<span class="status">In stock</span>']), "No products yet.", [
      (row, index) => actionButton("edit-product", store.products[index]?.id, "Edit"),
      (row, index) => actionButton("delete-product", store.products[index]?.id, "Delete", true),
    ], `<label class="inline-search"><span class="visually-hidden">Search products</span><input id="productSearch" type="search" value="${escapeHtml(search)}" placeholder="Search products"></label>`)}`;
}

async function renderSales() {
  const [sales, products, customers] = await Promise.all([api.sales(), api.products(), api.customers()]);
  store.products = products;
  const productOptions = products.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${item.stock_quantity} available, ${money(item.selling_price)})</option>`).join("");
  const rows = sales.map((sale) => [`#${sale.id}`, new Date(sale.created_at).toLocaleString(), escapeHtml(sale.payment_method), money(sale.total_amount), money(sale.profit)]);
  view.innerHTML = `<form class="panel editor-form" data-form="sale"><div class="panel-heading"><h2>Record sale</h2></div><div class="form-grid">
    ${field("customer_id", "Customer", "select", "", { choices: [["", "Walk-in customer"], ...customers.map((item) => [item.id, item.name])] })}
    ${field("payment_method", "Payment method", "select", "Cash", { choices: [["Cash", "Cash"], ["Card", "Card"], ["Mobile Money", "Mobile Money"], ["Bank Transfer", "Bank transfer"]] })}
    ${field("notes", "Notes", "text", "", { wide: true })}</div><div class="sale-lines" id="saleLines">${saleLine(productOptions)}</div>
    <div class="form-actions"><button class="button button--secondary" type="button" data-action="add-sale-line">Add item</button><button class="button button--primary" type="submit">Complete sale</button></div></form>
    ${tablePanel("Sales history", ["Sale", "Date", "Payment", "Revenue", "Profit"], rows, "No sales recorded yet.")}`;
}

function saleLine(options) {
  return `<div class="sale-line"><label class="field"><span>Product</span><select name="product_id" required>${options || '<option value="">No products available</option>'}</select></label><label class="field"><span>Quantity</span><input name="quantity" type="number" min="1" value="1" required></label><button class="mini-button mini-button--danger" type="button" data-action="remove-sale-line" aria-label="Remove item">Remove</button></div>`;
}

async function renderExpenses() {
  store.expenses = await api.expenses();
  const expense = store.editing?.type === "expense" ? store.editing.record : {};
  const fields = [field("category", "Category", "text", expense.category || "", { required: true }), field("amount", "Amount", "number", expense.amount || "", { required: true, min: 0.01, step: "0.01" }),
    field("payment_method", "Payment method", "select", expense.payment_method || "Cash", { choices: [["Cash", "Cash"], ["Card", "Card"], ["Mobile Money", "Mobile Money"], ["Bank Transfer", "Bank transfer"]] }),
    field("description", "Description", "textarea", expense.description || "", { wide: true }), field("notes", "Notes", "text", expense.notes || "", { wide: true })];
  view.innerHTML = `${editor(store.editing ? "Edit expense" : "Add expense", fields, store.editing ? "Update expense" : "Add expense")}${tablePanel("Expenses", ["Category", "Description", "Date", "Payment", "Amount"], store.expenses.map((item) => [escapeHtml(item.category), escapeHtml(item.description || "—"), new Date(item.created_at).toLocaleDateString(), escapeHtml(item.payment_method), money(item.amount)]), "No expenses recorded yet.", [
    (row, index) => actionButton("edit-expense", store.expenses[index]?.id, "Edit"),
    (row, index) => actionButton("delete-expense", store.expenses[index]?.id, "Delete", true),
  ])}`;
}

async function renderCustomers() {
  store.customers = await api.customers();
  const customer = store.editing?.type === "customer" ? store.editing.record : {};
  const fields = [field("name", "Name", "text", customer.name || "", { required: true }), field("phone", "Phone", "tel", customer.phone || ""),
    field("email", "Email", "email", customer.email || ""), field("address", "Address", "text", customer.address || ""), field("notes", "Notes", "textarea", customer.notes || "", { wide: true })];
  view.innerHTML = `${editor(store.editing ? "Edit customer" : "Add customer", fields, store.editing ? "Update customer" : "Add customer")}${tablePanel("Customer directory", ["Name", "Phone", "Email", "Address"], store.customers.map((item) => [escapeHtml(item.name), escapeHtml(item.phone || "—"), escapeHtml(item.email || "—"), escapeHtml(item.address || "—")]), "No customers yet.", [
    (row, index) => actionButton("edit-customer", store.customers[index]?.id, "Edit"),
    (row, index) => actionButton("delete-customer", store.customers[index]?.id, "Delete", true),
  ])}`;
}

async function renderReports() {
  const [today, daily, weekly, monthly, yearly] = await Promise.all([api.report("today"), api.dailyReport(), api.weeklyReport(), api.monthlyReport(), api.yearlyReport()]);
  const options = [["today", "Today"], ["yesterday", "Yesterday"], ["week", "This week"], ["month", "This month"], ["year", "This year"]];
  const periods = [["Today", daily], ["This week", weekly], ["This month", monthly], ["This year", yearly]];
  view.innerHTML = `<section class="panel"><div class="panel-heading"><div><p class="eyebrow">REPORT SUMMARY</p><h2>${escapeHtml(today.date_from)} to ${escapeHtml(today.date_to)}</h2></div><label class="field field--compact"><span>Period</span><select id="reportPeriod">${options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label></div><div class="metrics-grid metrics-grid--reports" id="reportMetrics">${reportMetrics(today)}</div></section>
    <section class="panel"><div class="panel-heading"><h2>Period comparisons</h2></div><div class="summary-grid">${periods.map(([label, item]) => stat(label, money(item.net_profit), `${item.sales_count} sales · ${money(item.revenue)} revenue`)).join("")}</div></section>`;
  $("reportPeriod").addEventListener("change", async (event) => {
    try { $("reportMetrics").innerHTML = reportMetrics(await api.report(event.target.value)); }
    catch (error) { toast(error.message, true); }
  });
}

function reportMetrics(report) {
  return [["Revenue", money(report.revenue)], ["Cost of goods", money(report.cost_of_goods)], ["Gross profit", money(report.gross_profit)], ["Expenses", money(report.expenses)], ["Net profit", money(report.net_profit)], ["Profit margin", `${Number(report.profit_margin).toFixed(1)}%`], ["Sales", report.sales_count], ["Products sold", report.products_sold]].map(([label, value]) => stat(label, value)).join("");
}

async function renderAdvertisements() {
  store.ads = await api.advertisements();
  const ad = store.editing?.type === "ad" ? store.editing.record : {};
  const fields = [field("title", "Title", "text", ad.title || "", { required: true }), field("price", "Price", "number", ad.price || "", { min: 0, step: "0.01" }),
    field("product_id", "Linked product ID", "number", ad.product_id || "", { min: 1 }), field("is_published", "Published", "checkbox", ad.is_published ?? true),
    field("image_url", "Advertisement image", "image", ad.image_url || "", { wide: true }), field("description", "Description", "textarea", ad.description || "", { wide: true })];
  view.innerHTML = `${editor(store.editing ? "Edit advertisement" : "Create advertisement", fields, store.editing ? "Update advertisement" : "Publish advertisement")}${tablePanel("Your advertisements", ["Title", "Price", "Status", "Created"], store.ads.map((item) => [escapeHtml(item.title), item.price == null ? "—" : money(item.price), item.is_published ? "Published" : "Draft", new Date(item.created_at).toLocaleDateString()]), "No advertisements yet.", [
    (row, index) => actionButton("edit-ad", store.ads[index]?.id, "Edit"),
    (row, index) => actionButton("delete-ad", store.ads[index]?.id, "Delete", true),
  ])}`;
}

async function renderPublicAds() {
  const ads = await api.publicAdvertisements();
  view.innerHTML = `<section class="listing-grid">${ads.length ? ads.map((ad) => `<article class="listing"><div class="listing__image">${ad.image_url ? `<img src="${escapeHtml(imageUrl(ad.image_url))}" alt="">` : "<span>SHOP</span>"}</div><div class="listing__content"><p class="eyebrow">${escapeHtml(ad.business_name || "Store")}</p><h2>${escapeHtml(ad.title)}</h2><p>${escapeHtml(ad.description || "")}</p><div class="listing__meta"><strong>${ad.price == null ? "Contact store" : money(ad.price)}</strong><span>${escapeHtml(ad.location || "")}</span></div>${ad.phone ? `<a href="tel:${escapeHtml(ad.phone)}">${escapeHtml(ad.phone)}</a>` : ""}</div></article>`).join("") : '<p class="empty-inline">There are no published listings.</p>'}</section>`;
}

function imageUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = api.baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function renderBusiness() {
  store.business = await api.business();
  const business = store.business || {};
  const fields = [field("name", "Business name", "text", business.name || "", { required: true }), field("owner_name", "Owner name", "text", business.owner_name || "", { required: true }),
    field("phone", "Phone", "tel", business.phone || ""), field("email", "Email", "email", business.email || ""), field("category", "Category", "text", business.category || ""),
    field("location", "Location", "text", business.location || ""), field("address", "Address", "text", business.address || "", { wide: true }),
    field("logo_url", "Logo", "image", business.logo_url || "", { wide: true }), field("description", "Description", "textarea", business.description || "", { wide: true })];
  view.innerHTML = `${editor(business.id ? "Business profile" : "Set up your business", fields, business.id ? "Save profile" : "Create business")}`;
}

async function renderAdmin() {
  if (store.user.role !== "admin") throw new Error("admin access required");
  const [stats, users] = await Promise.all([api.AdminStats(), api.adminUsers()]);
  store.adminUsers = users;
  view.innerHTML = `<section class="metrics-grid metrics-grid--reports">${Object.entries({ "Total users": stats.total_users, "Active users": stats.active_users, "Businesses": stats.total_businesses, "Products": stats.total_products, "Sales": stats.total_sales, "Advertisements": stats.total_advertisements }).map(([label, value]) => stat(label, value)).join("")}</section>
    ${tablePanel("User management", ["Name", "Email", "Business", "Role", "Account", "Joined", "Products", "Sales"], users.map((user) => [
      escapeHtml(user.full_name), escapeHtml(user.email), escapeHtml(user.business_name || "—"),
      user.role === "admin" ? "admin" : "Business owner",
      user.is_active ? '<span class="status">Active</span>' : '<span class="status status--low">Inactive</span>',
      new Date(user.created_at).toLocaleDateString(store.language === "sw" ? "sw-TZ" : "en-TZ"),
      user.products_count, user.sales_count,
    ]), "No users are registered.", [
      (row, index) => {
        const user = users[index];
        const isCurrentUser = user.id === store.user.id;
        const label = isCurrentUser ? "Current account" : user.is_active ? "Deactivate" : "Activate";
        return `<button class="mini-button ${user.is_active ? "mini-button--danger" : ""}" type="button" data-action="toggle-user" data-id="${user.id}" ${isCurrentUser ? "disabled" : ""}>${label}</button>`;
      },
    ])}
    <section class="panel"><div class="panel-heading"><h2>Remove advertisement</h2></div><form class="form-grid admin-form" data-form="remove-ad"><label class="field"><span>Advertisement ID</span><input name="ad_id" type="number" min="1" required></label><div class="form-actions"><button class="button button--danger" type="submit">Remove advertisement</button></div></form></section>`;
}

function formObject(form) {
  return Object.fromEntries([...new FormData(form)].filter(([key]) => key !== "image_file").map(([key, value]) => [key, value]));
}

function payloadFor(form) {
  const payload = formObject(form);
  for (const [key, value] of Object.entries(payload)) {
    if (value === "") payload[key] = null;
  }
  for (const input of form.querySelectorAll('input[type="number"]')) {
    if (input.name && payload[input.name] !== null) payload[input.name] = Number(payload[input.name]);
  }
  for (const input of form.querySelectorAll('input[type="checkbox"]')) payload[input.name] = input.checked;
  return payload;
}

async function attachUploads(form, payload) {
  const file = form.querySelector('input[name="image_file"]')?.files?.[0];
  if (file) {
    const uploaded = await api.uploadImage(file);
    const fieldName = form.querySelector('input[name="image_url"],input[name="logo_url"]')?.name;
    if (fieldName) payload[fieldName] = uploaded.image_url;
  }
}

async function handleFormSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  setBusy(button, true);
  try {
    const type = form.dataset.form;
    if (type === "record") {
      const payload = payloadFor(form);
      await attachUploads(form, payload);
      if (store.section === "products") {
        if (store.editing) await api.updateProduct(store.editing.id, payload);
        else await api.createProduct(payload);
      } else if (store.section === "customers") {
        if (store.editing) await api.updateCustomer(store.editing.id, payload);
        else await api.createCustomer(payload);
      } else if (store.section === "expenses") {
        if (store.editing) await api.updateExpense(store.editing.id, payload);
        else await api.createExpense(payload);
      } else if (store.section === "ads") {
        if (store.editing) await api.updateAdvertisement(store.editing.id, payload);
        else await api.createAdvertisement(payload);
      } else if (store.section === "business") {
        store.business = await api.saveBusiness(payload, Boolean(store.business?.id));
      }
      store.editing = null;
      toast("Changes saved.");
      await navigate(store.section);
    } else if (type === "sale") {
      const data = formObject(form);
      const customerId = data.customer_id ? Number(data.customer_id) : null;
      const items = [...form.querySelectorAll(".sale-line")].map((line) => ({ product_id: Number(line.querySelector('[name="product_id"]').value), quantity: Number(line.querySelector('[name="quantity"]').value) }));
      await api.createSale({ customer_id: customerId, payment_method: data.payment_method, notes: data.notes || null, items });
      toast("Sale recorded and stock updated.");
      await navigate("sales");
    } else if (type === "deactivate") {
      await api.deactivateUser(Number(new FormData(form).get("user_id")));
      toast("User deactivated.");
      form.reset();
    } else if (type === "remove-ad") {
      await api.removeAdvertisement(Number(new FormData(form).get("ad_id")));
      toast("Advertisement removed.");
      await navigate("admin");
    }
  } catch (error) {
    toast(error.message, true);
  } finally {
    setBusy(button, false);
  }
}

async function handleViewClick(event) {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    setMobileMenu(false);
    return navigate(navButton.dataset.nav);
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  try {
    if (action === "toggle-user") {
      const user = store.adminUsers.find((item) => item.id === Number(id));
      if (!user) return;
      if (user.is_active && !confirm(translate("Deactivate this account? The user will no longer be able to sign in."))) return;
      if (user.is_active) await api.deactivateUser(id);
      else await api.activateUser(id);
      toast("Account status updated.");
      return navigate("admin");
    }
    if (action === "reload") return navigate(store.section);
    if (action === "cancel-edit") { store.editing = null; return navigate(store.section); }
    if (action === "add-sale-line") {
      const options = store.products.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${item.stock_quantity} available, ${money(item.selling_price)})</option>`).join("");
      $("saleLines").insertAdjacentHTML("beforeend", saleLine(options));
      return;
    }
    if (action === "remove-sale-line") {
      if (view.querySelectorAll(".sale-line").length > 1) button.closest(".sale-line").remove();
      return;
    }
    const collection = { "edit-product": store.products, "edit-customer": store.customers, "edit-expense": store.expenses, "edit-ad": store.ads }[action];
    if (collection) {
      const type = action.replace("edit-", "");
      const record = type === "product" ? await api.product(id) : collection.find((item) => item.id === Number(id));
      store.editing = { type, id: Number(id), record };
      return navigate(store.section);
    }
    const remove = {
      "delete-product": () => api.deleteProduct(id), "delete-customer": () => api.deleteCustomer(id),
      "delete-expense": () => api.deleteExpense(id), "delete-ad": () => api.deleteAdvertisement(id),
    }[action];
    if (remove && confirm("Delete this item? This cannot be undone.")) {
      await remove();
      toast("Item deleted.");
      await navigate(store.section);
    }
  } catch (error) { toast(error.message, true); }
}

function setupAuth() {
  $("authForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    $("authError").hidden = true;
    const button = $("authSubmit");
    setBusy(button, true);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const result = store.authMode === "register" ? await api.register(values) : await api.login(values);
      api.setToken(result.access_token);
      await enterWorkspace();
    } catch (error) {
      $("authError").textContent = error.message;
      $("authError").hidden = false;
    } finally { setBusy(button, false); }
  });
  $("authSwitch").addEventListener("click", () => {
    store.authMode = store.authMode === "register" ? "login" : "register";
    renderAuthFields();
  });
  $("healthCheck").addEventListener("click", async () => {
    $("connectionState").textContent = "Checking…";
    try {
      await api.health();
      $("connectionState").textContent = "API is reachable.";
    } catch (error) { $("connectionState").textContent = error.message; }
  });
}

function setupProfilePhoto() {
  const avatar = $("userAvatar");
  const input = $("profileImageInput");
  avatar.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    avatar.disabled = true;
    try {
      const uploaded = await api.uploadImage(file);
      store.user = await api.updateProfileImage(uploaded.image_url);
      renderProfileAvatar();
      toast("Profile photo updated.");
    } catch (error) {
      toast(error.message, true);
    } finally {
      avatar.disabled = false;
      input.value = "";
    }
  });
}

function setupTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  $("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function setMobileMenu(open) {
  const app = $("app");
  const toggle = $("menuToggle");
  const wasOpen = toggle.getAttribute("aria-expanded") === "true";
  app.classList.toggle("is-menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", translate(open ? "Close navigation menu" : "Open navigation menu"));
  $("menuBackdrop").hidden = !open;
  if (!open && wasOpen) toggle.focus();
}

function setupMobileMenu() {
  $("menuToggle").addEventListener("click", () => {
    setMobileMenu($("menuToggle").getAttribute("aria-expanded") !== "true");
  });
  $("menuBackdrop").addEventListener("click", () => setMobileMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileMenu(false);
  });
}

$("nav").addEventListener("click", handleViewClick);
view.addEventListener("click", handleViewClick);
view.addEventListener("submit", handleFormSubmit);
view.addEventListener("input", (event) => {
  if (event.target.id !== "productSearch") return;
  clearTimeout(view.searchTimer);
  view.searchTimer = setTimeout(() => renderProducts(event.target.value).catch((error) => toast(error.message, true)), 220);
});
$("logoutBtn").addEventListener("click", () => {
  api.setToken("");
  store.user = null;
  store.business = null;
  showAuth();
});

setupAuth();
setupTheme();
setupMobileMenu();
setupLanguage();
setupProfilePhoto();
if (api.token) enterWorkspace().catch(() => { api.setToken(""); showAuth(); });
else showAuth();