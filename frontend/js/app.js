const $ = (id) => document.getElementById(id);
const view = $("view");
const store = {
  user: null,
  business: null,
  products: [],
  customers: [],
  expenses: [],
  section: "dashboard",
  editing: null,
  authMode: "login",
  authEmail: "",
  language: localStorage.getItem("shopmanager_language") || "en",
};

const swahili = {
  Language: "Lugha",
  "Sign in": "Ingia",
  "Create your account": "Fungua akaunti yako",
  "Create account": "Fungua akaunti",
  "Manage your store operations.": "Simamia shughuli za duka lako.",
  "Welcome back": "Karibu tena",
  "Let's get you started": "Tuanze pamoja",
  "Account assistance": "Msaada wa akaunti",
  "Enter your details to continue to your business.":
    "Weka taarifa zako ili kuendelea na biashara yako.",
  "Join Shop Manager and grow your business.":
    "Jiunge na Shop Manager na uikuze biashara yako.",
  "Need help accessing your account?":
    "Unahitaji msaada kufikia akaunti yako?",
  "Your business, in focus": "Biashara yako, kwa uwazi",
  "Make every day a brighter business day.":
    "Fanya kila siku iwe siku bora zaidi ya biashara.",
  "Simple tools to keep your shop moving forward.":
    "Zana rahisi za kusaidia duka lako kusonga mbele.",
  "Dark mode": "Mwonekano wa giza",
  "Light mode": "Mwonekano wa mwanga",
  "Switch to light mode": "Badili kwenda mwonekano wa mwanga",
  "Switch to dark mode": "Badili kwenda mwonekano wa giza",
  "Create an account": "Fungua akaunti",
  "Start managing your business.": "Anza kusimamia biashara yako.",
  "Already have an account? Sign in": "Una akaunti tayari? Ingia",
  "Check API connection": "Angalia muunganisho wa API",
  "Forgot your password?": "Umesahau nenosiri lako?",
  "Password reset is not available yet. Please contact the administrator.":
    "Kubadilisha nenosiri bado hakupatikani. Tafadhali wasiliana na msimamizi.",
  "Reset password": "Badilisha nenosiri",
  "Send reset code": "Tuma msimbo wa kubadilisha nenosiri",
  "Enter your email address and we’ll send a reset code if the account exists.":
    "Weka barua pepe yako na tutatuma msimbo ikiwa akaunti ipo.",
  "Enter the 6-digit code sent to your email and choose a new password.":
    "Weka msimbo wa tarakimu 6 uliotumwa kwenye barua pepe na uchague nenosiri jipya.",
  "Reset code": "Msimbo wa kubadilisha nenosiri",
  "New password": "Nenosiri jipya",
  "Back to sign in": "Rudi kuingia",
  "If the account exists, a reset code will be sent.":
    "Ikiwa akaunti ipo, msimbo wa kubadilisha nenosiri utatumwa.",
  "Password has been reset successfully. You can now log in.":
    "Nenosiri limebadilishwa. Sasa unaweza kuingia.",
  "Download report PDF": "Pakua ripoti (PDF)",
  "Daily business report": "Ripoti ya biashara ya siku",
  "Yesterday business report": "Ripoti ya biashara ya jana",
  "Weekly business report": "Ripoti ya biashara ya wiki",
  "Monthly business report": "Ripoti ya biashara ya mwezi",
  "Yearly business report": "Ripoti ya biashara ya mwaka",
  "Products sold": "Bidhaa zilizouzwa",
  "API URL": "Anwani ya API",
  "Full name": "Jina kamili",
  Email: "Barua pepe",
  Password: "Nenosiri",
  Dashboard: "Dashibodi",
  Inventory: "Bidhaa na stoku",
  Sales: "Mauzo",
  Expenses: "Matumizi",
  Customers: "Wateja",
  Reports: "Ripoti",
  "Business profile": "Wasifu wa biashara",
  Subscription: "Kifurushi",
  "Current subscription": "Kifurushi cha sasa",
  "No active subscription.": "Huna kifurushi hai kwa sasa.",
  "Free trial is active.": "Kipindi cha majaribio bila malipo kinaendelea.",
  "Free trial": "Jaribio bila malipo",
  "Days remaining": "Siku zilizobaki",
  "Trial expires": "Jaribio linaisha",
  "Your free trial has expired. An active subscription is required to continue.":
    "Muda wa majaribio bila malipo umeisha. Unahitaji kifurushi hai ili kuendelea.",
  "View subscription plans": "Angalia vifurushi vya subscription",
  "Available plans": "Vifurushi vinavyopatikana",
  "Submit payment details": "Wasilisha taarifa za malipo",
  "Choose a plan": "Chagua kifurushi",
  "Phone number": "Namba ya simu",
  "M-Pesa transaction reference": "Namba ya muamala wa M-Pesa",
  "Submit payment": "Wasilisha malipo",
  "Payment history": "Historia ya malipo",
  "No subscription payments yet.": "Bado hujawasilisha malipo ya kifurushi.",
  "No plans available": "Hakuna vifurushi vinavyopatikana",
  "Duration (days)": "Muda (siku)",
  Starts: "Ilianza",
  Expires: "Inaisha",
  PENDING: "INASUBIRI",
  APPROVED: "IMEIDHINISHWA",
  REJECTED: "IMEKATALIWA",
  ACTIVE: "HAI",
  Admin: "Msimamizi",
  "Sign out": "Toka",
  Connected: "Imeunganishwa",
  Loading: "Inapakia",
  "API error": "Hitilafu ya API",
  "Loading…": "Inapakia…",
  "Working...": "Inachakata...",
  "Revenue today": "Mapato ya leo",
  "Net profit": "Faida halisi",
  Products: "Bidhaa",
  Customers: "Wateja",
  sales: "mauzo",
  Margin: "Kiwango cha faida",
  "units sold today": "bidhaa zimeuzwa leo",
  "at or below minimum stock":
    "zimefikia au ziko chini ya kiwango cha chini cha stoku",
  TODAY: "LEO",
  "Business activity": "Shughuli za biashara",
  "View reports": "Angalia ripoti",
  "Cost of goods": "Gharama ya bidhaa",
  "Gross profit": "Faida ghafi",
  "Recent sales": "Mauzo ya hivi karibuni",
  "Monthly business trend": "Mwenendo wa biashara kwa mwezi",
  "Choose month": "Chagua mwezi",
  "Daily financial overview": "Muhtasari wa fedha kwa siku",
  "Number of sales per day": "Idadi ya mauzo kwa siku",
  "Each bar shows one day. Select a bar to see its date and values.":
    "Kila pau inaonyesha siku moja. Chagua pau kuona tarehe na kiasi.",
  "No activity for this month.": "Hakuna shughuli za biashara mwezi huu.",
  "Each month shows revenue, expenses and net profit. Hover over a bar for details.":
    "Kila mwezi unaonyesha mapato, matumizi na faida halisi. Elekeza kipanya kwenye pau kuona maelezo.",
  "No monthly business data yet.": "Bado hakuna takwimu za biashara za mwezi.",
  Sale: "Muamala",
  Date: "Tarehe",
  Payment: "Malipo",
  Revenue: "Mapato",
  Profit: "Faida",
  "No sales recorded yet.": "Bado hakuna mauzo yaliyorekodiwa.",
  Actions: "Vitendo",
  "Add product": "Ongeza bidhaa",
  "Edit product": "Hariri bidhaa",
  "Update product": "Sasisha bidhaa",
  "Product name": "Jina la bidhaa",
  "Buying price": "Bei ya kununua",
  "Selling price": "Bei ya kuuza",
  "Stock quantity": "Idadi ya stoku",
  "Minimum stock": "Stoku ya chini",
  "Product image": "Picha ya bidhaa",
  Description: "Maelezo",
  SKU: "SKU",
  Price: "Bei",
  Stock: "Stoku",
  Status: "Hali",
  "Low stock": "Stoku ndogo",
  "In stock": "Ipo stokuni",
  "No products yet.": "Bado hakuna bidhaa.",
  "Search products": "Tafuta bidhaa",
  "Search products...": "Tafuta bidhaa...",
  "Search SKU": "Tafuta SKU",
  "Select product": "Chagua bidhaa",
  "No products match this SKU": "Hakuna bidhaa inayolingana na SKU hii",
  Edit: "Hariri",
  Delete: "Futa",
  "Record sale": "Rekodi mauzo",
  Customer: "Mteja",
  "Walk-in customer": "Mteja wa dukani",
  "Payment method": "Njia ya malipo",
  Cash: "Taslimu",
  Card: "Kadi",
  "Mobile Money": "Pesa kwa simu",
  "Bank Transfer": "Hamisho la benki",
  "Bank transfer": "Hamisho la benki",
  Notes: "Maelezo ya ziada",
  "Add item": "Ongeza bidhaa",
  "Complete sale": "Kamilisha mauzo",
  "Sales history": "Historia ya mauzo",
  "Add expense": "Ongeza matumizi",
  "Edit expense": "Hariri matumizi",
  "Update expense": "Sasisha matumizi",
  Category: "Aina",
  Amount: "Kiasi",
  "No expenses recorded yet.": "Bado hakuna matumizi yaliyorekodiwa.",
  "Add customer": "Ongeza mteja",
  "Edit customer": "Hariri mteja",
  "Update customer": "Sasisha mteja",
  Name: "Jina",
  Phone: "Simu",
  Address: "Anwani",
  "Customer directory": "Orodha ya wateja",
  "No customers yet.": "Bado hakuna wateja.",
  "REPORT SUMMARY": "MUHTASARI WA RIPOTI",
  Period: "Kipindi",
  Today: "Leo",
  Yesterday: "Jana",
  "This week": "Wiki hii",
  "This month": "Mwezi huu",
  "This year": "Mwaka huu",
  "Period comparisons": "Ulinganisho wa vipindi",
  "Set up your business": "Sanidi biashara yako",
  "Save profile": "Hifadhi wasifu",
  "Create business": "Tengeneza biashara",
  "Business name": "Jina la biashara",
  "Business details": "Taarifa za biashara",
  "Contact details": "Mawasiliano",
  "Location details": "Mahali biashara ilipo",
  Branding: "Utambulisho wa biashara",
  "Owner name": "Jina la mmiliki",
  Location: "Eneo",
  Logo: "Nembo",
  "Total users": "Jumla ya watumiaji",
  "Active users": "Watumiaji hai",
  Businesses: "Biashara",
  "Total products": "Jumla ya bidhaa",
  "Total sales": "Jumla ya mauzo",
  "Account controls": "Udhibiti wa akaunti",
  "User ID": "Namba ya mtumiaji",
  "Deactivate user": "Zima mtumiaji",
  Cancel: "Ghairi",
  Save: "Hifadhi",
  "Changes saved.": "Mabadiliko yamehifadhiwa.",
  "Sale recorded and stock updated.":
    "Mauzo yamerekodiwa na stoku imesasishwa.",
  "User deactivated.": "Mtumiaji amezimwa.",
  "Item deleted.": "Kipengee kimefutwa.",
  "Delete this item? This cannot be undone.":
    "Futa kipengee hiki? Hatua hii haiwezi kutenduliwa.",
  "Try again": "Jaribu tena",
  "Margin ": "Kiwango cha faida ",
  available: "inapatikana",
  Product: "Bidhaa",
  Quantity: "Idadi",
  "No products available": "Hakuna bidhaa zinazopatikana",
  "Remove item": "Ondoa bidhaa",
  "Admin access required": "Unahitaji ruhusa ya msimamizi",
  "Checking…": "Inaangalia…",
  "API is reachable.": "API inapatikana.",
  "Open navigation menu": "Fungua menyu ya urambazaji",
  "Close navigation menu": "Funga menyu ya urambazaji",
  "User management": "Usimamizi wa watumiaji",
  "User accounts": "Akaunti za watumiaji",
  Business: "Biashara",
  "Business owner": "Mmiliki wa biashara",
  Role: "Jukumu",
  Account: "Akaunti",
  Active: "Hai",
  Inactive: "Imesitishwa",
  Joined: "Alijiunga",
  Deactivate: "Sitisha",
  Activate: "Washa",
  "Current account": "Akaunti ya sasa",
  "No users are registered.": "Hakuna watumiaji waliosajiliwa.",
  "Pending subscription payments": "Malipo ya vifurushi yanayosubiri",
  "No pending subscription payments.": "Hakuna malipo ya vifurushi yanayosubiri.",
  "Plan": "Kifurushi",
  "Transaction reference": "Namba ya muamala",
  "Submitted": "Yamewasilishwa",
  "Approve": "Idhinisha",
  "Approve this payment and activate the subscription?":
    "Idhinisha malipo haya na uwashe kifurushi?",
  "Payment approved and subscription activated.":
    "Malipo yameidhinishwa na kifurushi kimewashwa.",
  "Account status updated.": "Hali ya akaunti imesasishwa.",
  "Deactivate this account? The user will no longer be able to sign in.":
    "Sitisha akaunti hii? Mtumiaji hataweza tena kuingia.",
  "Change profile picture": "Badili picha ya wasifu",
  "Profile photo updated.": "Picha ya wasifu imesasishwa.",
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
    const reverse = Object.entries(swahili).find(
      ([, translated]) => translated === value,
    );
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
  document.querySelectorAll(".language-select").forEach((select) => {
    select.value = store.language;
  });
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (parent && !["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName))
      node.nodeValue = translate(node.nodeValue);
  }
  root
    .querySelectorAll("[placeholder], [aria-label], [title]")
    .forEach((element) => {
      for (const attribute of ["placeholder", "aria-label", "title"]) {
        if (element.hasAttribute(attribute))
          element.setAttribute(
            attribute,
            translate(element.getAttribute(attribute)),
          );
      }
    });
}

function setupLanguage() {
  document.querySelectorAll(".language-select").forEach((select) =>
    select.addEventListener("change", (event) => {
      store.language = event.target.value;
      localStorage.setItem("shopmanager_language", store.language);
      applyLanguage();
    }),
  );
  applyLanguage();
}

const sections = [
  ["dashboard", "Dashboard"],
  ["business", "Business profile"],
  ["products", "Inventory"],
  ["sales", "Sales"],
  ["expenses", "Expenses"],
  ["customers", "Customers"],
  ["reports", "Reports"],
  ["subscription", "Subscription"],
];

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}

function money(value) {
  const amount = new Intl.NumberFormat(
    store.language === "sw" ? "sw-TZ" : "en-TZ",
    { maximumFractionDigits: 2 },
  ).format(Number(value || 0));
  return `TSh ${amount}`;
}

function toast(message, isError = false) {
  const element = $("toast");
  element.textContent = message;
  element.classList.toggle("toast--error", isError);
  element.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    element.hidden = true;
  }, 3600);
}

function setBusy(button, busy, label = "Working...") {
  if (!button) return;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = label;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.label || button.textContent;
    delete button.dataset.label;
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
  const forgot = store.authMode === "forgot";
  const reset = store.authMode === "reset";
  const emailField = `<label class="field field--wide"><span>Email</span><input name="email" type="email" autocomplete="email" value="${escapeHtml(store.authEmail)}" required></label>`;
  $("authTitle").textContent = register
    ? "Create your account"
    : forgot || reset
      ? "Reset password"
      : "Sign in";
  $("authGreeting").textContent = register
    ? "Let's get you started"
    : forgot || reset
      ? "Account assistance"
      : "Welcome back";
  $("authCopy").textContent = register
    ? "Join Shop Manager and grow your business."
    : forgot
      ? "Need help accessing your account?"
      : reset
      ? "Enter the 6-digit code sent to your email and choose a new password."
      : "Enter your details to continue to your business.";
  $("authSubmit").textContent = register
    ? "Create account"
    : forgot
      ? "Send reset code"
      : reset
        ? "Reset password"
        : "Sign in";
  $("authSwitch").textContent = forgot || reset
    ? "Back to sign in"
    : register
      ? "Already have an account? Sign in"
      : "Create an account";
  $("forgotPassword").hidden = register || forgot || reset;
  $("authFields").innerHTML = register
    ? `<label class="field field--wide"><span>Full name</span><input name="full_name" autocomplete="name" minlength="2" required></label>${emailField}<label class="field field--wide"><span>Password</span><input name="password" type="password" autocomplete="new-password" minlength="6" required></label>`
    : forgot
      ? emailField
      : reset
        ? `${emailField}<label class="field field--wide"><span>Reset code</span><input name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" minlength="6" maxlength="6" required></label><label class="field field--wide"><span>New password</span><input name="new_password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required></label>`
        : `${emailField}<label class="field field--wide"><span>Password</span><input name="password" type="password" autocomplete="current-password" minlength="1" required></label>`;
  applyLanguage($("authScreen"));
}

async function enterWorkspace() {
  store.user = await api.me();
  try {
    store.business = await api.business();
  } catch {
    store.business = null;
  }
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
  $("nav").innerHTML = items
    .map(
      ([id, label]) =>
        `<button class="nav__item ${store.section === id ? "is-active" : ""}" type="button" data-nav="${id}"><span class="nav__mark"></span><span>${escapeHtml(label)}</span></button>`,
    )
    .join("");
}

async function navigate(section) {
  store.section = section;
  store.editing = null;
  renderNav();
  const title =
    [...sections, ["admin", "admin"]].find(([id]) => id === section)?.[1] ||
    "Shop Manager";
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
    else if (section === "subscription") await renderSubscription();
    else if (section === "business") await renderBusiness();
    else if (section === "admin") await renderAdmin();
    $("apiIndicator").textContent = "Connected";
  } catch (error) {
    $("apiIndicator").textContent = "API error";
    const subscriptionRequired = error.message.includes(
      "active subscription is required",
    );
    view.innerHTML = `<section class="empty-state"><h2>Could not load ${escapeHtml(title.toLowerCase())}</h2><p>${escapeHtml(error.message)}</p>${subscriptionRequired ? '<button class="button button--primary" data-nav="subscription">View subscription plans</button>' : '<button class="button button--secondary" data-action="reload">Try again</button>'}</section>`;
  }
  applyLanguage(document.body);
}

function stat(label, value, detail = "") {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></article>`;
}

async function renderDashboard() {
  const currentMonth = new Date();
  const selectedMonth = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
  const [data, recentSales, monthlyTrend] = await Promise.all([
    api.dashboard(),
    api.sales(),
    api.monthlyTrend(selectedMonth),
  ]);
  const today = [
    ["Revenue today", money(data.revenue), `${data.sales_count} sales`],
    [
      "Net profit",
      money(data.net_profit),
      `Margin ${Number(data.profit_margin).toFixed(1)}%`,
    ],
    [
      "Products",
      data.total_products,
      `${data.low_stock_products} at or below minimum stock`,
    ],
    [
      "Customers",
      data.total_customers,
      `${data.products_sold} units sold today`,
    ],
  ];
  view.innerHTML = `<section class="metrics-grid">${today.map((item) => stat(...item)).join("")}</section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">TODAY</p><h2>Business activity</h2></div><button class="button button--secondary" data-nav="reports">View reports</button></div>
    <div class="summary-grid">${stat("Cost of goods", money(data.cost_of_goods))}${stat("Expenses", money(data.expenses))}${stat("Gross profit", money(data.gross_profit))}</div></section>
    ${tablePanel(
      "Recent sales",
      ["Sale", "Date", "Payment", "Revenue", "Profit"],
      recentSales
        .slice(0, 8)
        .map((sale) => [
          `#${sale.id}`,
          new Date(sale.created_at).toLocaleString(),
          sale.payment_method,
          money(sale.total_amount),
          money(sale.profit),
        ]),
      "No sales recorded yet.",
    )}
    ${monthlyActivityChart(monthlyTrend, selectedMonth)}`;
}

function dailyActivityChart(days, series, formatValue) {
  const width = Math.max(900, days.length * 30 + 80);
  const height = 300;
  const margin = { top: 22, right: 18, bottom: 48, left: 86 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const values = days.flatMap((day) =>
    series.map(({ key }) => Number(day[key]) || 0),
  );
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const padding = maximum === minimum ? 1 : (maximum - minimum) * 0.1;
  const minValue = minimum - padding;
  const maxValue = maximum + padding;
  const y = (value) =>
    margin.top + ((maxValue - value) / (maxValue - minValue)) * plotHeight;
  const zeroY = y(0);
  const groupWidth = plotWidth / Math.max(days.length, 1);
  const barGap = series.length > 1 ? 2 : 0;
  const barWidth = Math.max(
    3,
    Math.min(
      16,
      (groupWidth * 0.76 - barGap * (series.length - 1)) / series.length,
    ),
  );
  const locale = store.language === "sw" ? "sw-TZ" : "en-TZ";
  const grid = Array.from({ length: 5 }, (_, index) => {
    const value = maxValue - ((maxValue - minValue) * index) / 4;
    const position = y(value);
    return `<g class="trend-gridline"><line x1="${margin.left}" y1="${position}" x2="${width - margin.right}" y2="${position}"></line><text x="${margin.left - 10}" y="${position + 4}" text-anchor="end">${escapeHtml(formatValue(value))}</text></g>`;
  }).join("");
  const dateLabels = days
    .map((day, index) => {
      const date = new Date(`${day.date}T00:00:00`);
      const label = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
      return `<text class="trend-month" x="${margin.left + groupWidth * (index + 0.5)}" y="${height - 18}" text-anchor="middle">${escapeHtml(label)}</text>`;
    })
    .join("");
  const dayHitTargets = days
    .map((day, dayIndex) => {
      const dateLabel = new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
      }).format(new Date(`${day.date}T00:00:00`));
      const details = `${dateLabel} · ${series
        .map(({ key, label }) => {
          const value = Number(day[key]) || 0;
          const displayValue =
            key === "sales_count" ? String(value) : money(value);
          return `${translate(label)}: ${displayValue}`;
        })
        .join(" · ")}`;
      const x = margin.left + groupWidth * dayIndex;
      return `<rect class="trend-day-hit" x="${x}" y="${margin.top}" width="${groupWidth}" height="${plotHeight}" role="button" tabindex="${dayIndex === 0 ? 0 : -1}" aria-pressed="false" aria-label="${escapeHtml(details)}" data-tooltip="${escapeHtml(details)}"><title>${escapeHtml(details)}</title></rect>`;
    })
    .join("");
  const bars = days
    .map((day, dayIndex) => {
      const groupStart =
        margin.left +
        groupWidth * (dayIndex + 0.5) -
        (barWidth * series.length + barGap * (series.length - 1)) / 2;
      return series
        .map(({ key, label, color }, seriesIndex) => {
          const value = Number(day[key]) || 0;
          const valueY = y(value);
          const barY = Math.min(zeroY, valueY);
          const barHeight = Math.max(Math.abs(zeroY - valueY), 1);
          const barX = groupStart + seriesIndex * (barWidth + barGap);
          const displayValue =
            key === "sales_count" ? String(value) : money(value);
          const dateLabel = new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
          }).format(new Date(`${day.date}T00:00:00`));
          return `<rect class="trend-bar" x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="2" fill="${color}"><title>${escapeHtml(dateLabel)}: ${escapeHtml(translate(label))} ${escapeHtml(displayValue)}</title></rect>`;
        })
        .join("");
    })
    .join("");
  const mobileWidth = Math.ceil(days.length * 44 + margin.left + margin.right);
  return `<div class="trend-chart-wrap"><svg class="trend-chart" style="--trend-mobile-width:${mobileWidth}px" viewBox="0 0 ${width} ${height}" role="group" aria-label="${escapeHtml(series.map(({ label }) => translate(label)).join(", "))}">${grid}<line class="trend-zero-line" x1="${margin.left}" y1="${zeroY}" x2="${width - margin.right}" y2="${zeroY}"></line>${bars}${dayHitTargets}${dateLabels}</svg><p class="trend-touch-details" aria-live="polite" hidden></p></div>`;
}

function monthlyActivityChart(days, month) {
  const financialSeries = [
    { key: "revenue", label: "Revenue", color: "#287a67" },
    { key: "expenses", label: "Expenses", color: "#d58a36" },
    { key: "net_profit", label: "Net profit", color: "#5176c2" },
  ];
  const salesSeries = [
    { key: "sales_count", label: "Sales", color: "#b34f78" },
  ];
  const locale = store.language === "sw" ? "sw-TZ" : "en-TZ";
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(`${month}-01T00:00:00`));
  const today = new Date();
  const maxMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const legend = (series) =>
    series
      .map(
        ({ label, color }) =>
          `<span class="trend-legend-item" style="--series-color:${color}"><i></i>${escapeHtml(translate(label))}</span>`,
      )
      .join("");
  const hasActivity = days.some(
    (day) =>
      Number(day.revenue) ||
      Number(day.expenses) ||
      Number(day.net_profit) ||
      Number(day.sales_count),
  );
  const emptyMessage = hasActivity
    ? ""
    : `<p class="empty-inline">${escapeHtml(translate("No activity for this month."))}</p>`;
  const moneyAxis = (value) =>
    `TSh ${new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)}`;

  return `<section class="panel" id="monthlyActivity"><div class="panel-heading"><div><h2>${escapeHtml(translate("Monthly business trend"))}</h2><p class="trend-help">${escapeHtml(monthLabel)} · ${escapeHtml(translate("Each bar shows one day. Select a bar to see its date and values."))}</p></div><label class="field field--compact trend-month-picker"><span>${escapeHtml(translate("Choose month"))}</span><input id="dashboardMonth" type="month" value="${escapeHtml(month)}" max="${maxMonth}"></label></div><div id="monthlyTrendCharts">${emptyMessage || `<h3 class="trend-section-title">${escapeHtml(translate("Daily financial overview"))}</h3><div class="trend-legend">${legend(financialSeries)}</div>${dailyActivityChart(days, financialSeries, moneyAxis)}<h3 class="trend-section-title">${escapeHtml(translate("Number of sales per day"))}</h3><div class="trend-legend">${legend(salesSeries)}</div>${dailyActivityChart(days, salesSeries, (value) => new Intl.NumberFormat(locale).format(value))}`}</div></section>`;
}

function tablePanel(title, headers, rows, emptyText, actions = [], tools = "") {
  const table = rows.length
    ? `<div class="table-wrap"><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}${actions.length ? "<th>Actions</th>" : ""}</tr></thead><tbody>${rows.map((row, rowIndex) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}${actions.length ? `<td class="row-actions">${actions.map((button) => button(row, rowIndex)).join("")}</td>` : ""}</tr>`).join("")}</tbody></table></div>`
    : `<p class="empty-inline">${escapeHtml(emptyText)}</p>`;
  return `<section class="panel"><div class="panel-heading"><h2>${escapeHtml(title)}</h2>${tools}</div>${table}</section>`;
}

function field(name, label, type = "text", value = "", options = {}) {
  const required = options.required ? "required" : "";
  const placeholder = options.placeholder
    ? `placeholder="${escapeHtml(options.placeholder)}"`
    : "";
  const wide = options.wide ? " field--wide" : "";
  const safe = escapeHtml(value);
  let control;
  if (type === "textarea")
    control = `<textarea name="${name}" ${required} ${placeholder}>${safe}</textarea>`;
  else if (type === "select")
    control = `<select name="${name}" ${required}>${options.choices.map(([v, text]) => `<option value="${escapeHtml(v)}" ${String(v) === String(value) ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select>`;
  else if (type === "checkbox")
    control = `<input name="${name}" type="checkbox" ${value ? "checked" : ""}>`;
  else if (type === "image")
    control = `<input name="${name}" type="url" value="${safe}" placeholder="https://..."><input class="file-input" type="file" name="image_file" accept="image/jpeg,image/png,image/webp" aria-label="Upload image">`;
  else
    control = `<input name="${name}" type="${type}" value="${safe}" ${required} ${placeholder} ${options.min != null ? `min="${options.min}"` : ""} ${options.step ? `step="${options.step}"` : ""}>`;
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
  const formFields = [
    field("name", "Product name", "text", product.name || "", {
      required: true,
    }),
    field("sku", "SKU", "text", product.sku || ""),
    field(
      "buying_price",
      "Buying price",
      "number",
      product.buying_price || "",
      { required: true, min: 0, step: "0.01" },
    ),
    field(
      "selling_price",
      "Selling price",
      "number",
      product.selling_price || "",
      { required: true, min: 0, step: "0.01" },
    ),
    field(
      "stock_quantity",
      "Stock quantity",
      "number",
      product.stock_quantity ?? 0,
      { required: true, min: 0 },
    ),
    field(
      "minimum_stock",
      "Minimum stock",
      "number",
      product.minimum_stock ?? 5,
      { required: true, min: 0 },
    ),
    field("description", "Description", "textarea", product.description || "", {
      wide: true,
    }),
  ];
  view.innerHTML = `${editor(store.editing ? "Edit product" : "Add product", formFields, store.editing ? "Update product" : "Add product")}
    ${tablePanel(
      "Inventory",
      ["Product", "SKU", "Price", "Stock", "Status"],
      store.products.map((item) => [
        escapeHtml(item.name),
        escapeHtml(item.sku || "—"),
        money(item.selling_price),
        item.stock_quantity,
        item.stock_quantity <= item.minimum_stock
          ? '<span class="status status--low">Low stock</span>'
          : '<span class="status">In stock</span>',
      ]),
      "No products yet.",
      [
        (row, index) =>
          actionButton("edit-product", store.products[index]?.id, "Edit"),
        (row, index) =>
          actionButton(
            "delete-product",
            store.products[index]?.id,
            "Delete",
            true,
          ),
      ],
      `<label class="inline-search"><span class="visually-hidden">Search products</span><input id="productSearch" type="search" value="${escapeHtml(search)}" placeholder="Search products"></label>`,
    )}`;
}

async function renderSales() {
  const [sales, products, customers] = await Promise.all([
    api.sales(),
    api.products(),
    api.customers(),
  ]);
  store.products = products;
  const rows = sales.map((sale) => [
    `#${sale.id}`,
    new Date(sale.created_at).toLocaleString(),
    escapeHtml(sale.payment_method),
    money(sale.total_amount),
    money(sale.profit),
  ]);
  view.innerHTML = `<form class="panel editor-form" data-form="sale"><div class="panel-heading"><h2>Record sale</h2></div><div class="form-grid">
    ${field("customer_id", "Customer", "select", "", { choices: [["", "Walk-in customer"], ...customers.map((item) => [item.id, item.name])] })}
    ${field("payment_method", "Payment method", "select", "Cash", {
      choices: [
        ["Cash", "Cash"],
        ["Card", "Card"],
        ["Mobile Money", "Mobile Money"],
        ["Bank Transfer", "Bank transfer"],
      ],
    })}
    </div><div class="sale-lines" id="saleLines">${saleLine(products)}</div>
    <div class="form-actions"><button class="button button--secondary" type="button" data-action="add-sale-line">Add item</button><button class="button button--primary" type="submit">Complete sale</button></div></form>
    ${tablePanel("Sales history", ["Sale", "Date", "Payment", "Revenue", "Profit"], rows, "No sales recorded yet.")}`;
}

function saleProductOptions(products, noMatch = false) {
  const placeholder = noMatch
    ? "No products match this SKU"
    : products.length
      ? "Select product"
      : "No products available";
  return `<option value="">${translate(placeholder)}</option>${products
    .map(
      (item) =>
        `<option value="${item.id}">${escapeHtml(item.name)}${item.sku ? ` · SKU ${escapeHtml(item.sku)}` : ""} (${item.stock_quantity} available, ${money(item.selling_price)})</option>`,
    )
    .join("")}`;
}

function saleLine(products) {
  const searchLabel = translate("Search SKU");
  return `<div class="sale-line"><label class="field"><span>${searchLabel}</span><input name="sku_search" type="search" placeholder="${searchLabel}" autocomplete="off"></label><label class="field"><span>${translate("Product")}</span><select name="product_id" required>${saleProductOptions(products)}</select></label><button class="mini-button mini-button--danger" type="button" data-action="remove-sale-line" aria-label="Remove item">Remove</button></div>`;
}

async function renderExpenses() {
  store.expenses = await api.expenses();
  const expense = store.editing?.type === "expense" ? store.editing.record : {};
  const fields = [
    field("category", "Category", "text", expense.category || "", {
      required: true,
    }),
    field("amount", "Amount", "number", expense.amount || "", {
      required: true,
      min: 0.01,
      step: "0.01",
    }),
    field(
      "payment_method",
      "Payment method",
      "select",
      expense.payment_method || "Cash",
      {
        choices: [
          ["Cash", "Cash"],
          ["Card", "Card"],
          ["Mobile Money", "Mobile Money"],
          ["Bank Transfer", "Bank transfer"],
        ],
      },
    ),
    field("description", "Description", "textarea", expense.description || "", {
      wide: true,
    }),
  ];
  view.innerHTML = `${editor(store.editing ? "Edit expense" : "Add expense", fields, store.editing ? "Update expense" : "Add expense")}${tablePanel(
    "Expenses",
    ["Category", "Description", "Date", "Payment", "Amount"],
    store.expenses.map((item) => [
      escapeHtml(item.category),
      escapeHtml(item.description || "—"),
      new Date(item.created_at).toLocaleDateString(),
      escapeHtml(item.payment_method),
      money(item.amount),
    ]),
    "No expenses recorded yet.",
    [
      (row, index) =>
        actionButton("edit-expense", store.expenses[index]?.id, "Edit"),
      (row, index) =>
        actionButton(
          "delete-expense",
          store.expenses[index]?.id,
          "Delete",
          true,
        ),
    ],
  )}`;
}

async function renderCustomers() {
  store.customers = await api.customers();
  const customer =
    store.editing?.type === "customer" ? store.editing.record : {};
  const fields = [
    field("name", "Name", "text", customer.name || "", { required: true }),
    field("phone", "Phone", "tel", customer.phone || ""),
    field("email", "Email", "email", customer.email || ""),
    field("address", "Address", "text", customer.address || ""),
    field("notes", "Notes", "textarea", customer.notes || "", { wide: true }),
  ];
  view.innerHTML = `${editor(store.editing ? "Edit customer" : "Add customer", fields, store.editing ? "Update customer" : "Add customer")}${tablePanel(
    "Customer directory",
    ["Name", "Phone", "Email", "Address"],
    store.customers.map((item) => [
      escapeHtml(item.name),
      escapeHtml(item.phone || "—"),
      escapeHtml(item.email || "—"),
      escapeHtml(item.address || "—"),
    ]),
    "No customers yet.",
    [
      (row, index) =>
        actionButton("edit-customer", store.customers[index]?.id, "Edit"),
      (row, index) =>
        actionButton(
          "delete-customer",
          store.customers[index]?.id,
          "Delete",
          true,
        ),
    ],
  )}`;
}

async function renderReports() {
  const [today, daily, weekly, monthly, yearly] = await Promise.all([
    api.report("today"),
    api.dailyReport(),
    api.weeklyReport(),
    api.monthlyReport(),
    api.yearlyReport(),
  ]);
  const options = [
    ["today", "Today"],
    ["yesterday", "Yesterday"],
    ["week", "This week"],
    ["month", "This month"],
    ["year", "This year"],
  ];
  const periods = [
    ["Today", daily],
    ["This week", weekly],
    ["This month", monthly],
    ["This year", yearly],
  ];
  let selectedReport = today;
  let selectedPeriod = "today";
  view.innerHTML = `<section class="panel"><div class="panel-heading"><div><p class="eyebrow">REPORT SUMMARY</p><h2 id="reportDateRange">${escapeHtml(today.date_from)} to ${escapeHtml(today.date_to)}</h2></div><div class="topbar__actions"><button class="button button--secondary" id="downloadReport" type="button">${escapeHtml(translate("Download report PDF"))}</button><label class="field field--compact"><span>Period</span><select id="reportPeriod">${options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label></div></div><div class="metrics-grid metrics-grid--reports" id="reportMetrics">${reportMetrics(today)}</div></section>
    <section class="panel"><div class="panel-heading"><h2>Period comparisons</h2></div><div class="summary-grid">${periods.map(([label, item]) => stat(label, money(item.net_profit), `${item.sales_count} sales · ${money(item.revenue)} revenue`)).join("")}</div></section>`;
  $("downloadReport").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    setBusy(button, true);
    try {
      await downloadReportPdf(selectedReport, selectedPeriod);
    } catch (error) {
      toast(error.message, true);
    } finally {
      setBusy(button, false);
    }
  });
  $("reportPeriod").addEventListener("change", async (event) => {
    try {
      selectedReport = await api.report(event.target.value);
      selectedPeriod = event.target.value;
      $("reportMetrics").innerHTML = reportMetrics(selectedReport);
      $("reportDateRange").textContent = `${selectedReport.date_from} to ${selectedReport.date_to}`;
    } catch (error) {
      event.target.value = selectedPeriod;
      toast(error.message, true);
    }
  });
}

async function downloadReportPdf(report, period) {
  let JsPDF = window.jspdf?.jsPDF;
  if (!JsPDF) {
    JsPDF = await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "js/vendor/jspdf.umd.min.js";
      script.onload = () => {
        if (window.jspdf?.jsPDF) resolve(window.jspdf.jsPDF);
        else reject(new Error("The local PDF generator could not be initialized."));
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("Could not load the local PDF generator. Refresh the page and try again."));
      };
      document.head.append(script);
    });
  }

  const pdf = new JsPDF({ unit: "mm", format: "a4" });
  pdf.setFillColor(25, 87, 78);
  pdf.rect(0, 0, 210, 38, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Shop Manager", 16, 17);
  pdf.setFontSize(12);
  const titles = {
    today: "Daily business report",
    yesterday: "Yesterday business report",
    week: "Weekly business report",
    month: "Monthly business report",
    year: "Yearly business report",
  };
  pdf.text(translate(titles[period]), 16, 28);

  const date = report.date_from === report.date_to
    ? report.date_from
    : `${report.date_from} - ${report.date_to}`;
  const rows = [
    ["Revenue", money(report.revenue)],
    ["Cost of goods", money(report.cost_of_goods)],
    ["Gross profit", money(report.gross_profit)],
    ["Expenses", money(report.expenses)],
    ["Net profit", money(report.net_profit)],
    ["Profit margin", `${Number(report.profit_margin).toFixed(1)}%`],
    ["Sales", String(report.sales_count)],
    ["Products sold", String(report.products_sold)],
  ];

  pdf.setTextColor(40, 52, 54);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(`${translate("Date")}: ${date}`, 16, 51);
  let y = 63;
  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      pdf.setFillColor(240, 245, 243);
      pdf.rect(16, y - 6, 178, 11, "F");
    }
    pdf.text(translate(label), 20, y + 1);
    pdf.text(value, 190, y + 1, { align: "right" });
    y += 12;
  });
  pdf.save(`${period}-report-${report.date_from}.pdf`);
}

function reportMetrics(report) {
  return [
    ["Revenue", money(report.revenue)],
    ["Cost of goods", money(report.cost_of_goods)],
    ["Gross profit", money(report.gross_profit)],
    ["Expenses", money(report.expenses)],
    ["Net profit", money(report.net_profit)],
    ["Profit margin", `${Number(report.profit_margin).toFixed(1)}%`],
    ["Sales", report.sales_count],
    ["Products sold", report.products_sold],
  ]
    .map(([label, value]) => stat(label, value))
    .join("");
}

async function renderSubscription() {
  const [plans, subscription, payments] = await Promise.all([
    api.subscriptionPlans(),
    api.mySubscription(),
    api.mySubscriptionPayments(),
  ]);
  const planOptions = plans.length
    ? plans
        .map(
          (plan) =>
            `<option value="${plan.id}">${escapeHtml(plan.name)} — ${money(plan.price)} / ${plan.duration_days} ${escapeHtml(translate("Duration (days)").toLowerCase())}</option>`,
        )
        .join("")
    : `<option value="">${escapeHtml(translate("No plans available"))}</option>`;
  const dateLocale = store.language === "sw" ? "sw-TZ" : "en-TZ";
  const activeSubscription = subscription.active
    ? `<p><strong>${escapeHtml(subscription.plan)}</strong> · <span class="status">${escapeHtml(subscription.status)}</span></p><p>${escapeHtml(translate("Starts"))}: ${new Date(subscription.starts_at).toLocaleDateString(dateLocale)} · ${escapeHtml(translate("Expires"))}: ${new Date(subscription.expires_at).toLocaleDateString(dateLocale)}</p>`
    : subscription.trial_active
      ? `<p><strong>${escapeHtml(translate("Free trial"))}</strong> · <span class="status">${escapeHtml(translate("Active"))}</span></p><p>${escapeHtml(translate("Days remaining"))}: ${Math.max(1, Math.ceil((new Date(subscription.trial_expires_at) - Date.now()) / 86400000))} · ${escapeHtml(translate("Trial expires"))}: ${new Date(subscription.trial_expires_at).toLocaleDateString(dateLocale)}</p>`
      : `<p>${escapeHtml(subscription.message || translate("No active subscription."))}</p>`;

  view.innerHTML = `<section class="panel"><div class="panel-heading"><h2>Current subscription</h2></div>${activeSubscription}</section>
    <section class="panel"><div class="panel-heading"><h2>Available plans</h2></div>${plans.length ? `<div class="summary-grid">${plans.map((plan) => stat(plan.name, money(plan.price), `${plan.duration_days} ${translate("Duration (days)").toLowerCase()}`)).join("")}</div>` : `<p class="empty-inline">${escapeHtml(translate("No plans available"))}</p>`}</section>
    <section class="panel"><div class="panel-heading"><h2>Submit payment details</h2></div><form class="form-grid" data-form="subscription-payment"><label class="field"><span>Choose a plan</span><select name="plan_id" required ${plans.length ? "" : "disabled"}>${planOptions}</select></label>${field("phone_number", "Phone number", "tel", "", { required: true, placeholder: "+255..." })}${field("transaction_reference", "M-Pesa transaction reference", "text", "", { required: true })}<div class="form-actions"><button class="button button--primary" type="submit" ${plans.length ? "" : "disabled"}>Submit payment</button></div></form></section>
    ${tablePanel(
      "Payment history",
      ["Plan", "Amount", "Phone number", "Transaction reference", "Status", "Date"],
      payments.map((payment) => [
        escapeHtml(payment.plan),
        money(payment.amount),
        escapeHtml(payment.phone_number),
        escapeHtml(payment.transaction_reference),
        escapeHtml(payment.status),
        new Date(payment.created_at).toLocaleDateString(
          store.language === "sw" ? "sw-TZ" : "en-TZ",
        ),
      ]),
      "No subscription payments yet.",
    )}`;
}

function imageUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = api.baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function renderBusiness() {
  store.business = await api.business();
  const business = store.business || {};
  const fields = [
    '<div class="form-section-title"><h3>Business details</h3></div>',
    field("name", "Business name", "text", business.name || "", {
      required: true,
    }),
    field("category", "Category", "text", business.category || ""),
    field(
      "description",
      "Description",
      "textarea",
      business.description || "",
      { wide: true },
    ),
    '<div class="form-section-title"><h3>Contact details</h3></div>',
    field("owner_name", "Owner name", "text", business.owner_name || "", {
      required: true,
    }),
    field("phone", "Phone", "tel", business.phone || ""),
    field("email", "Email", "email", business.email || ""),
    '<div class="form-section-title"><h3>Location details</h3></div>',
    field("location", "Location", "text", business.location || ""),
    field("address", "Address", "text", business.address || "", { wide: true }),
    '<div class="form-section-title"><h3>Branding</h3></div>',
    field("logo_url", "Logo", "image", business.logo_url || "", { wide: true }),
  ];
  view.innerHTML = `${editor(business.id ? "Business profile" : "Set up your business", fields, business.id ? "Save profile" : "Create business")}`;
}

async function renderAdmin() {
  if (store.user.role !== "admin") throw new Error("admin access required");
  const [stats, users, pendingPayments] = await Promise.all([
    api.adminStats(),
    api.adminUsers(),
    api.pendingSubscriptionPayments(),
  ]);
  store.adminUsers = users;
  view.innerHTML = `<section class="metrics-grid metrics-grid--reports">${Object.entries(
    {
      "Total users": stats.total_users,
      "Active users": stats.active_users,
      Businesses: stats.total_businesses,
      Products: stats.total_products,
      Sales: stats.total_sales,
    },
  )
    .map(([label, value]) => stat(label, value))
    .join("")}</section>
    ${tablePanel(
    "Pending subscription payments",
    [
      "User ID",
      "Plan",
      "Amount",
      "Phone number",
      "Transaction reference",
      "Submitted",
    ],
    pendingPayments.map((payment) => [
      `#${payment.user_id}`,
      escapeHtml(payment.plan_name),
      money(payment.amount),
      escapeHtml(payment.phone_number),
      escapeHtml(payment.transaction_reference),
      new Date(payment.created_at).toLocaleDateString(
        store.language === "sw" ? "sw-TZ" : "en-TZ",
      ),
    ]),
    "No pending subscription payments.",
    [
      (row, index) =>
        actionButton(
          "approve-payment",
          pendingPayments[index]?.id,
          "Approve",
        ),
    ],
  )}
  ${tablePanel(
      "User management",
      [
        "Name",
        "Email",
        "Business",
        "Role",
        "Account",
        "Joined",
        "Products",
        "Sales",
      ],
      users.map((user) => [
        escapeHtml(user.full_name),
        escapeHtml(user.email),
        escapeHtml(user.business_name || "—"),
        user.role === "admin" ? "admin" : "Business owner",
        user.is_active
          ? '<span class="status">Active</span>'
          : '<span class="status status--low">Inactive</span>',
        new Date(user.created_at).toLocaleDateString(
          store.language === "sw" ? "sw-TZ" : "en-TZ",
        ),
        user.products_count,
        user.sales_count,
      ]),
      "No users are registered.",
      [
        (row, index) => {
          const user = users[index];
          const isCurrentUser = user.id === store.user.id;
          const label = isCurrentUser
            ? "Current account"
            : user.is_active
              ? "Deactivate"
              : "Activate";
          return `<button class="mini-button ${user.is_active ? "mini-button--danger" : ""}" type="button" data-action="toggle-user" data-id="${user.id}" ${isCurrentUser ? "disabled" : ""}>${label}</button>`;
        },
      ],
    )}`;
}

function formObject(form) {
  return Object.fromEntries(
    [...new FormData(form)]
      .filter(([key]) => key !== "image_file")
      .map(([key, value]) => [key, value]),
  );
}

function payloadFor(form) {
  const payload = formObject(form);
  for (const [key, value] of Object.entries(payload)) {
    if (value === "" || value === "None") payload[key] = null;
  }
  for (const input of form.querySelectorAll(
    'input[type="number"], select[name="product_id"]',
  )) {
    if (!input.name) continue;
    if (
      payload[input.name] === null ||
      payload[input.name] === undefined ||
      payload[input.name] === ""
    )
      continue;
    payload[input.name] = Number(payload[input.name]);
  }
  for (const input of form.querySelectorAll('input[type="checkbox"]'))
    payload[input.name] = input.checked;
  return payload;
}

async function attachUploads(form, payload) {
  const file = form.querySelector('input[name="image_file"]')?.files?.[0];
  if (file) {
    const uploaded = await api.uploadImage(file);
    const fieldName = form.querySelector(
      'input[name="image_url"],input[name="logo_url"]',
    )?.name;
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
      } else if (store.section === "business") {
        store.business = await api.saveBusiness(
          payload,
          Boolean(store.business?.id),
        );
      }
      store.editing = null;
      toast("Changes saved.");
      await navigate(store.section);
    } else if (type === "sale") {
      const data = formObject(form);
      const customerId = data.customer_id ? Number(data.customer_id) : null;
      const items = [...form.querySelectorAll(".sale-line")].map((line) => ({
        product_id: Number(line.querySelector('[name="product_id"]').value),
        quantity: 1,
      }));
      await api.createSale({
        customer_id: customerId,
        payment_method: data.payment_method,
        notes: data.notes || null,
        items,
      });
      toast("Sale recorded and stock updated.");
      await navigate("sales");
    } else if (type === "subscription-payment") {
      const data = formObject(form);
      const result = await api.submitSubscriptionPayment({
        plan_id: Number(data.plan_id),
        phone_number: data.phone_number.trim(),
        transaction_reference: data.transaction_reference.trim(),
      });
      toast(result.message || "Payment submitted.");
      await navigate("subscription");
    } else if (type === "deactivate") {
      await api.deactivateUser(Number(new FormData(form).get("user_id")));
      toast("User deactivated.");
      form.reset();
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
    if (action === "approve-payment") {
      if (
        !confirm(
          translate(
            "Approve this payment and activate the subscription?",
          ),
        )
      )
        return;
      const result = await api.approveSubscriptionPayment(id);
      toast(
        result.message === "Payment approved and subscription activated"
          ? "Payment approved and subscription activated."
          : result.message,
      );
      return navigate("admin");
    }
    if (action === "toggle-user") {
      const user = store.adminUsers.find((item) => item.id === Number(id));
      if (!user) return;
      if (
        user.is_active &&
        !confirm(
          translate(
            "Deactivate this account? The user will no longer be able to sign in.",
          ),
        )
      )
        return;
      if (user.is_active) await api.deactivateUser(id);
      else await api.activateUser(id);
      toast("Account status updated.");
      return navigate("admin");
    }
    if (action === "reload") return navigate(store.section);
    if (action === "cancel-edit") {
      store.editing = null;
      return navigate(store.section);
    }
    if (action === "add-sale-line") {
      $("saleLines").insertAdjacentHTML("beforeend", saleLine(store.products));
      return;
    }
    if (action === "remove-sale-line") {
      if (view.querySelectorAll(".sale-line").length > 1)
        button.closest(".sale-line").remove();
      return;
    }
    const collection = {
      "edit-product": store.products,
      "edit-customer": store.customers,
      "edit-expense": store.expenses,
    }[action];
    if (collection) {
      const type = action.replace("edit-", "");
      const record =
        type === "product"
          ? await api.product(id)
          : collection.find((item) => item.id === Number(id));
      store.editing = { type, id: Number(id), record };
      return navigate(store.section);
    }
    const remove = {
      "delete-product": () => api.deleteProduct(id),
      "delete-customer": () => api.deleteCustomer(id),
      "delete-expense": () => api.deleteExpense(id),
    }[action];
    if (remove && confirm("Delete this item? This cannot be undone.")) {
      await remove();
      toast("Item deleted.");
      await navigate(store.section);
    }
  } catch (error) {
    toast(error.message, true);
  }
}

function setupAuth() {
  $("authForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    $("authError").hidden = true;
    $("authError").classList.remove("auth-error--success");
    const button = $("authSubmit");
    setBusy(button, true);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      store.authEmail = values.email || store.authEmail;
      if (store.authMode === "forgot") {
        const result = await api.forgotPassword({ email: values.email });
        setBusy(button, false);
        store.authMode = "reset";
        renderAuthFields();
        $("authError").textContent = translate(result.message);
        $("authError").classList.add("auth-error--success");
        $("authError").hidden = false;
        return;
      }
      if (store.authMode === "reset") {
        const result = await api.resetPassword(values);
        setBusy(button, false);
        store.authMode = "login";
        renderAuthFields();
        $("authError").textContent = translate(result.message);
        $("authError").classList.add("auth-error--success");
        $("authError").hidden = false;
        return;
      }
      const result = store.authMode === "register"
        ? await api.register(values)
        : await api.login(values);
      api.setToken(result.access_token);
      await enterWorkspace();
    } catch (error) {
      $("authError").textContent = error.message;
      $("authError").hidden = false;
    } finally {
      setBusy(button, false);
    }
  });
  $("authSwitch").addEventListener("click", () => {
    store.authMode = store.authMode === "login" ? "register" : "login";
    $("authError").hidden = true;
    renderAuthFields();
  });
  $("forgotPassword").addEventListener("click", () => {
    const email = $("authFields").querySelector('[name="email"]');
    store.authEmail = email?.value || "";
    store.authMode = "forgot";
    $("authError").hidden = true;
    renderAuthFields();
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
  const toggle = $("themeToggle");
  const updateToggle = () => {
    const darkMode =
      document.documentElement.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-pressed", String(darkMode));
    toggle.setAttribute(
      "aria-label",
      translate(darkMode ? "Switch to light mode" : "Switch to dark mode"),
    );
  };
  updateToggle();
  toggle.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateToggle();
  });
}

function setupAuthTheme() {
  const screen = $("authScreen");
  const toggle = $("authThemeToggle");
  const legacyPreference = localStorage.getItem("shopmanager_auth_lamp");
  const savedTheme =
    localStorage.getItem("shopmanager_auth_theme") ||
    (legacyPreference === "off"
      ? "light"
      : legacyPreference === "on"
        ? "dark"
        : "dark");
  screen.dataset.authTheme = savedTheme;

  const updateToggle = () => {
    const lightMode = screen.dataset.authTheme === "light";
    toggle.setAttribute("aria-pressed", String(lightMode));
    toggle.setAttribute(
      "aria-label",
      translate(lightMode ? "Switch to dark mode" : "Switch to light mode"),
    );
    $("authThemeLabel").textContent = lightMode ? "Light mode" : "Dark mode";
    applyLanguage(screen);
  };

  updateToggle();
  toggle.addEventListener("click", () => {
    screen.dataset.authTheme =
      screen.dataset.authTheme === "light" ? "dark" : "light";
    localStorage.setItem("shopmanager_auth_theme", screen.dataset.authTheme);
    updateToggle();
  });
}

function setMobileMenu(open) {
  const app = $("app");
  const toggle = $("menuToggle");
  const wasOpen = toggle.getAttribute("aria-expanded") === "true";
  app.classList.toggle("is-menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute(
    "aria-label",
    translate(open ? "Close navigation menu" : "Open navigation menu"),
  );
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
view.addEventListener("click", (event) => {
  const target = event.target.closest(".trend-day-hit");
  if (!target) return;
  const chart = target.closest(".trend-chart-wrap");
  chart.querySelectorAll(".trend-day-hit").forEach((hit) => {
    hit.classList.remove("is-selected");
    hit.setAttribute("aria-pressed", "false");
  });
  target.classList.add("is-selected");
  target.setAttribute("aria-pressed", "true");
  const details = chart.querySelector(".trend-touch-details");
  details.textContent = target.dataset.tooltip;
  details.hidden = false;
});
view.addEventListener("keydown", (event) => {
  const target = event.target.closest(".trend-day-hit");
  if (!target) return;
  const hits = [...target.closest(".trend-chart").querySelectorAll(".trend-day-hit")];
  const index = hits.indexOf(target);
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    hits[(index + offset + hits.length) % hits.length].focus();
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});
view.addEventListener("submit", handleFormSubmit);
view.addEventListener("input", (event) => {
  const skuSearch = event.target.closest('.sale-line [name="sku_search"]');
  if (skuSearch) {
    const line = skuSearch.closest(".sale-line");
    const select = line.querySelector('[name="product_id"]');
    const currentProductId = select.value;
    const query = skuSearch.value.trim().toLocaleLowerCase();
    const matches = store.products.filter((product) =>
      String(product.sku || "")
        .toLocaleLowerCase()
        .includes(query),
    );
    const exactMatches = matches.filter(
      (product) =>
        String(product.sku || "").trim().toLocaleLowerCase() === query &&
        query,
    );
    const exactProductId =
      exactMatches.length === 1 ? String(exactMatches[0].id) : "";
    const retainedProductId = matches.some(
      (product) => String(product.id) === currentProductId,
    )
      ? currentProductId
      : "";
    select.innerHTML = saleProductOptions(matches, Boolean(query) && !matches.length);
    select.value = exactProductId || retainedProductId;
    return;
  }
  if (event.target.id !== "productSearch") return;
  clearTimeout(view.searchTimer);
  view.searchTimer = setTimeout(
    () =>
      renderProducts(event.target.value).catch((error) =>
        toast(error.message, true),
      ),
    220,
  );
});
view.addEventListener("change", (event) => {
  if (event.target.id === "dashboardMonth") {
    const month = event.target.value;
    const charts = $("monthlyTrendCharts");
    if (!month || !charts) return;
    charts.innerHTML = `<p class="loading-state">${escapeHtml(translate("Loading…"))}</p>`;
    api
      .monthlyTrend(month)
      .then((days) => {
        const activity = $("monthlyActivity");
        if (activity) activity.outerHTML = monthlyActivityChart(days, month);
      })
      .catch((error) => {
        charts.innerHTML = `<p class="empty-inline">${escapeHtml(error.message)}</p>`;
        toast(error.message, true);
      });
    return;
  }
  if (!event.target.matches('.sale-line [name="product_id"]')) return;
  const product = store.products.find(
    (item) => String(item.id) === event.target.value,
  );
  event.target
    .closest(".sale-line")
    .querySelector('[name="sku_search"]').value = product?.sku || "";
});
$("logoutBtn").addEventListener("click", () => {
  api.setToken("");
  store.user = null;
  store.business = null;
  showAuth();
});

setupAuth();
setupTheme();
setupAuthTheme();
setupMobileMenu();
setupLanguage();
setupProfilePhoto();
if (api.token)
  enterWorkspace().catch(() => {
    api.setToken("");
    showAuth();
  });
else showAuth();
