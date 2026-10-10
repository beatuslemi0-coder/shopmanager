/* =====================================================
   main.js
   Reads the data from data.js and builds the dashboard.
   Each section of the page has its own small function.
   ===================================================== */

/* ---------- Helpers ---------- */

// Returns an <svg> string for an icon name (see `icons` in data.js)
function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
}

// 5483 -> "5,483"
function formatNumber(n) {
  return n.toLocaleString("en-US");
}

// Shortcut for document.getElementById
const $ = (id) => document.getElementById(id);


/* ---------- Sidebar + profile ---------- */

function renderProfile() {
  const { name, email } = dashboardData.user;
  $("userName").textContent = name;
  $("userEmail").textContent = email;
  $("userAvatar").textContent = name.charAt(0);       // simple initial instead of a photo
  $("welcomeTitle").textContent = `Welcome ${dashboardData.user.firstName} !`;
}

function renderNav() {
  const nav = $("nav");

  nav.innerHTML = dashboardData.menu
    .map((item, index) => `
      <button class="nav__item ${index === 0 ? "is-active" : ""}">
        <span class="nav__icon">${iconSvg(item.icon)}</span>
        <span>${item.label}</span>
      </button>`)
    .join("");

  // Clicking an item makes it the active one
  nav.addEventListener("click", (event) => {
    const clicked = event.target.closest(".nav__item");
    if (!clicked) return;

    nav.querySelectorAll(".nav__item").forEach((el) => el.classList.remove("is-active"));
    clicked.classList.add("is-active");
  });

  // Icons used outside the menu
  $("logoutIcon").innerHTML = iconSvg("power");
  $("searchIcon").innerHTML = iconSvg("search");
  $("bellBtn").innerHTML = iconSvg("bell");
  $("usersIcon").innerHTML = iconSvg("users");
}


/* ---------- Overview cards ---------- */

function renderOverview() {
  $("overviewGrid").innerHTML = dashboardData.overview
    .map((stat) => `
      <div class="stat stat--${stat.type}">
        <span class="stat__icon">${iconSvg(stat.icon)}</span>
        <div>
          <p class="stat__value">${formatNumber(stat.value)}</p>
          <p class="stat__label">${stat.label}</p>
        </div>
        ${stat.info ? '<span class="stat__info" title="Items that need restocking">i</span>' : ""}
      </div>`)
    .join("");
}


/* ---------- Users + pie chart ---------- */

function renderUsers() {
  $("customersValue").textContent = dashboardData.totalCustomers;
}

function renderPie() {
  const { soldPercent, totalPercent } = dashboardData.inventory;

  // The CSS conic-gradient reads this variable
  $("pie").style.setProperty("--sold", `${soldPercent}%`);
  $("pieSoldLabel").textContent = `${soldPercent}%`;
  $("pieTotalLabel").textContent = `${totalPercent}%`;
}


/* ---------- Top 10 stores (bars + search) ---------- */

function renderStores(searchText = "") {
  const list = $("storesList");
  const query = searchText.trim().toLowerCase();

  // Sort from best to worst, then keep only the stores matching the search
  const stores = [...dashboardData.stores]
    .sort((a, b) => b.sales - a.sales)
    .filter((store) => store.name.toLowerCase().includes(query));

  // Bar widths are relative to the best store overall (not the filtered list)
  const best = Math.max(...dashboardData.stores.map((s) => s.sales));

  list.innerHTML = stores
    .map((store) => `
      <li class="store">
        <span class="store__name">${store.name}</span>
        <div class="store__track">
          <div class="store__bar" data-width="${(store.sales / best) * 100}"></div>
        </div>
        <span class="store__value">${store.sales}k</span>
      </li>`)
    .join("");

  $("storesEmpty").hidden = stores.length > 0;

  // Set widths on the next frame so the CSS transition animates the bars
  requestAnimationFrame(() => {
    list.querySelectorAll(".store__bar").forEach((bar) => {
      bar.style.width = `${bar.dataset.width}%`;
    });
  });
}

function setupSearch() {
  $("searchInput").addEventListener("input", (event) => {
    renderStores(event.target.value);
  });
}


/* ---------- Line chart: Expense vs Profit ---------- */

// Chart size and inner margins (SVG units; the SVG scales to its container)
const CHART = { width: 1000, height: 220, left: 46, right: 30, top: 30, bottom: 30 };

// Converts a data value (dollars) into an SVG y-coordinate
function yPos(value) {
  const { min, max } = dashboardData.chart;
  const usable = CHART.height - CHART.top - CHART.bottom;
  return CHART.top + (1 - (value - min) / (max - min)) * usable;
}

// Converts a month index into an SVG x-coordinate
function xPos(index) {
  const count = dashboardData.chart.labels.length;
  const usable = CHART.width - CHART.left - CHART.right;
  return CHART.left + (index * usable) / (count - 1);
}

// Builds a smooth curve (cubic Bezier) through a list of {x, y} points
function smoothPath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[i - 1] || points[i];
    const current = points[i];
    const next = points[i + 1];
    const after = points[i + 2] || next;

    // Control points make the curve flow through neighbouring points
    const c1x = current.x + (next.x - prev.x) / 6;
    const c1y = current.y + (next.y - prev.y) / 6;
    const c2x = next.x - (after.x - current.x) / 6;
    const c2y = next.y - (after.y - current.y) / 6;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${next.x} ${next.y}`;
  }
  return d;
}

// Closes a line path down to the x-axis so it can be filled as an area
function areaPath(points) {
  const baseY = yPos(dashboardData.chart.min);
  const last = points[points.length - 1];
  const first = points[0];
  return `${smoothPath(points)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
}

// Small label ("Highest Profit") that sits above a point
function tagSvg(text, point, color) {
  const w = text.length * 4.6 + 12;
  const x = Math.min(Math.max(point.x - w / 2, 2), CHART.width - w - 2);   // keep inside the chart
  const y = point.y - 22;

  return `
    <g class="tag">
      <rect class="tag__box" x="${x}" y="${y}" width="${w}" height="13" fill="${color}"/>
      <text class="tag__text" x="${x + w / 2}" y="${y + 9.5}">${text}</text>
    </g>
    <circle cx="${point.x}" cy="${point.y}" r="3.5" fill="${color}"/>`;
}

function renderLineChart() {
  const { labels, expense, profit, min, max, step } = dashboardData.chart;

  const toPoints = (values) => values.map((v, i) => ({ x: xPos(i), y: yPos(v) }));
  const expensePoints = toPoints(expense);
  const profitPoints = toPoints(profit);

  // Horizontal grid lines + y labels (10k, 20k, 30k, 40k)
  let grid = "";
  for (let value = min; value <= max; value += step) {
    const y = yPos(value);
    grid += `
      <line class="grid-line" x1="${CHART.left}" x2="${CHART.width - CHART.right}" y1="${y}" y2="${y}"/>
      <text class="axis-label" x="${CHART.left - 8}" y="${y + 4}" text-anchor="end">${value / 1000}k</text>`;
  }

  // Month names along the bottom
  const months = labels
    .map((label, i) => `<text class="axis-label" x="${xPos(i)}" y="${CHART.height - 8}" text-anchor="middle">${label}</text>`)
    .join("");

  // Find the peak month of each series
  const maxExpenseIndex = expense.indexOf(Math.max(...expense));
  const maxProfitIndex = profit.indexOf(Math.max(...profit));

  $("lineChart").innerHTML = `
    <svg viewBox="0 0 ${CHART.width} ${CHART.height}" role="img" aria-label="Expense versus profit for the last months">
      ${grid}
      ${months}

      <path class="area--expense" d="${areaPath(expensePoints)}"/>
      <path class="area--profit"  d="${areaPath(profitPoints)}"/>
      <path class="line line--expense" d="${smoothPath(expensePoints)}"/>
      <path class="line line--profit"  d="${smoothPath(profitPoints)}"/>

      ${tagSvg("Highest Expense", expensePoints[maxExpenseIndex], "#c97b4a")}
      ${tagSvg("Highest Profit", profitPoints[maxProfitIndex], "#3f8a6b")}
    </svg>`;
}


/* ---------- Light / dark theme ---------- */

function setupTheme() {
  const root = document.documentElement;

  // Remember the user's choice between visits
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);

  $("themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}


/* ---------- Start everything once the page is ready ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderNav();
  renderOverview();
  renderUsers();
  renderPie();
  renderStores();
  setupSearch();
  renderLineChart();
  setupTheme();
});
