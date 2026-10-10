/* =====================================================
   data.js
   All the information shown on the dashboard lives here.
   To change a number or a name, edit it in this file only.
   ===================================================== */

const dashboardData = {
  user: {
    name: "Nirmal Kumar P",
    firstName: "Nirmal",
    email: "nirmalcnm10@gmail.com",
  },

  // The four cards in the "Over View" section.
  // `type` decides the card colour (see .stat--* in style.css).
  overview: [
    { label: "Total Products", value: 5483, icon: "box",   type: "green" },
    { label: "Orders",         value: 2859, icon: "layers", type: "green" },
    { label: "Total Stock",    value: 5483, icon: "trend", type: "green" },
    { label: "Out of Stock",   value: 38,   icon: "alert", type: "red", info: true },
  ],

  totalCustomers: "583 K",

  // Pie chart: percentages must add up to 100
  inventory: { soldPercent: 32, totalPercent: 68 },

  // Sales per store (in thousands). Sorted automatically in main.js.
  stores: [
    { name: "Gateway str",      sales: 874 },
    { name: "The Rustic Fox",   sales: 721 },
    { name: "Velvet Vine",      sales: 598 },
    { name: "Blue Harbor",      sales: 586 },
    { name: "Nebula Novelties", sales: 395 },
    { name: "Crimson Crafters", sales: 344 },
    { name: "Tidal Treasures",  sales: 274 },
    { name: "Whimsy Wild",      sales: 213 },
    { name: "Mercantile",       sales: 183 },
    { name: "Emporium",         sales: 176 },
  ],

  // Line chart data (one value per month, in dollars)
  chart: {
    labels:  ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    expense: [20000, 24000, 18000, 22000, 29000, 25000, 27000],
    profit:  [17000, 22000, 19000, 21000, 26000, 30000, 33000],
    min: 10000,
    max: 40000,
    step: 10000,
  },

  // Sidebar menu
  menu: [
    { label: "Dashboard", icon: "dashboard" },
    { label: "Inventory", icon: "inventory" },
    { label: "Orders",    icon: "layers" },
    { label: "Purchase",  icon: "cart" },
    { label: "Reporting", icon: "report" },
    { label: "Support",   icon: "wrench" },
    { label: "Settings",  icon: "gear" },
  ],
};

/* Small inline SVG icons (24x24, drawn with currentColor so CSS can recolour them) */
const icons = {
  box:       '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.4 3.5L12 11.2 5.6 7.7 12 4.200ZM5 9.4l6 3.3v6.6l-6-3.300V9.400Zm8 9.900v-6.600l6-3.300v6.600l-6 3.300Z"/>',
  layers:    '<path d="m12 3 10 5-10 5L2 8l10-5Zm-8.200 9.200L12 16.300l8.200-4.100L22 13l-10 5-10-5 1.800-.800Zm0 4L12 20.300l8.200-4.100L22 17l-10 5-10-5 1.800-.800Z"/>',
  trend:     '<path d="m3.500 17.500 6-6 4 4 7-7.500-1.400-1.400-5.600 6-4-4-7.400 7.400 1.400 1.500Z"/><path d="M15 6.500h6.500V13H20V8H15V6.500Z"/>',
  alert:     '<path d="M12 3 2 20h20L12 3Zm0 5 5.800 10H6.200L12 8Zm-1 3v4h2v-4h-2Zm0 5v2h2v-2h-2Z"/>',
  users:     '<path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3 0-7 1.500-7 4.500V21h14v-2.500C16 15.500 12 14 9 14Zm7-2a3.500 3.500 0 1 0-1.500-6.700A5.500 5.500 0 0 1 15.500 9c0 1.200-.4 2.300-1 3.200.5.500 1 .800 1.500.800Zm1 3.500c1.300.800 2 1.900 2 3V21h3v-2.500c0-2-2.200-3.100-5-3Z"/>',
  dashboard: '<path d="M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10-3h8v11h-8V10Z"/>',
  inventory: '<path d="M3 3h18v5H3V3Zm1 6h16v12H4V9Zm5 2v2h6v-2H9Z"/>',
  cart:      '<path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.600 7.600-1.400 2.400C4.500 15.300 5.500 17 7 17h12v-2H7.400l1.100-2h7.500c.700 0 1.400-.4 1.700-1l3.600-6.500A1 1 0 0 0 20.400 4H5.200l-.9-2H1Z"/>',
  report:    '<path d="M4 20h16v2H2V2h2v18Zm3-2v-7h3v7H7Zm5 0V7h3v11h-3Zm5 0v-5h3v5h-3Z"/>',
  wrench:    '<path d="M22 6.500a5.500 5.500 0 0 1-7.400 5.200L6.800 19.500a2.100 2.100 0 0 1-3-3l7.800-7.800A5.500 5.500 0 0 1 17.500 2l-3.300 3.300 1 3.500 3.500 1L22 6.500Z"/>',
  gear:      '<path d="M12 8.500a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7Zm8.500 5.200c.100-.500.100-1 .100-1.700s0-1.200-.100-1.700l2-1.600a.5.500 0 0 0 .1-.600l-1.900-3.300a.5.500 0 0 0-.600-.2l-2.400 1a7.400 7.400 0 0 0-2.900-1.700L14.400 2.400a.5.500 0 0 0-.500-.400h-3.800a.5.500 0 0 0-.500.400l-.400 2.600A7.400 7.400 0 0 0 6.300 6.700l-2.400-1a.5.500 0 0 0-.600.200L1.400 9.200a.5.500 0 0 0 .1.600l2 1.600c-.100.500-.100 1-.100 1.700s0 1.200.1 1.700l-2 1.600a.5.500 0 0 0-.1.600l1.900 3.300c.100.200.400.300.600.200l2.400-1a7.400 7.400 0 0 0 2.900 1.700l.4 2.600c0 .200.200.400.500.400h3.800c.300 0 .500-.200.500-.400l.4-2.600a7.400 7.400 0 0 0 2.900-1.700l2.400 1c.200.100.500 0 .600-.200l1.900-3.300a.5.500 0 0 0-.100-.600l-2-1.600Z"/>',
  power:     '<path d="M11 2h2v10h-2V2Zm6.400 3.600A9 9 0 1 1 6.600 5.600l1.400 1.400a7 7 0 1 0 8 0l1.400-1.400Z"/>',
  search:    '<path d="M10 2a8 8 0 1 0 4.900 14.300l5.400 5.400 1.400-1.400-5.400-5.400A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/>',
  bell:      '<path d="M12 22a2.500 2.500 0 0 0 2.400-2h-4.800A2.500 2.500 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.500-6.800V3.500a1.500 1.500 0 0 0-3 0v.700A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z"/>',
};
