/* global React */
// Seed data for the prototype.

const CATEGORIES = [
  { id: "resistor", label: "Resistors", color: "#d97706", icon: "resistor" },
  { id: "capacitor", label: "Capacitors", color: "#2563eb", icon: "capacitor" },
  { id: "ic", label: "ICs", color: "#7c3aed", icon: "ic" },
  { id: "sensor", label: "Sensors", color: "#059669", icon: "sensor" },
  { id: "module", label: "Modules", color: "#db2777", icon: "board" },
  { id: "cable", label: "Cables", color: "#0891b2", icon: "cable" },
  { id: "tool", label: "Tools", color: "#475569", icon: "tool" },
  { id: "misc", label: "Misc", color: "#6b7280", icon: "misc" },
];

// Storage hierarchy: workshop -> shelf -> drawer -> bin
const LOCATIONS = [
  {
    id: "lab",
    name: "Lab Bench",
    children: [
      {
        id: "lab-a",
        name: "Shelf A",
        children: [
          { id: "lab-a-1", name: "Drawer A1", children: [
            { id: "bin-r-1k", name: "Bin R-1k" },
            { id: "bin-r-10k", name: "Bin R-10k" },
            { id: "bin-r-220", name: "Bin R-220" },
          ]},
          { id: "lab-a-2", name: "Drawer A2", children: [
            { id: "bin-c-cer", name: "Bin C-CER" },
            { id: "bin-c-elec", name: "Bin C-ELEC" },
          ]},
        ],
      },
      {
        id: "lab-b",
        name: "Shelf B",
        children: [
          { id: "lab-b-1", name: "Drawer B1", children: [
            { id: "bin-ic-logic", name: "Bin IC-LOG" },
            { id: "bin-ic-op", name: "Bin IC-OP" },
          ]},
        ],
      },
    ],
  },
  {
    id: "wkshp",
    name: "Workshop",
    children: [
      { id: "wkshp-tools", name: "Tool Pegboard", children: [
        { id: "bin-tool-hand", name: "Hand Tools" },
        { id: "bin-tool-iron", name: "Soldering Stn" },
      ]},
      { id: "wkshp-c", name: "Cabinet C", children: [
        { id: "bin-mod-mcu", name: "MCU Bin" },
        { id: "bin-mod-radio", name: "Radio Bin" },
        { id: "bin-cable", name: "Cable Spool" },
      ]},
    ],
  },
  {
    id: "antistat",
    name: "Antistatic Box",
    children: [
      { id: "antistat-1", name: "Tray 1", children: [
        { id: "bin-sens-imu", name: "IMU Tray" },
        { id: "bin-sens-env", name: "Env Sensors" },
      ]},
    ],
  },
];

// Build a flat lookup of location path strings
function buildLocIndex(nodes, trail = [], out = {}) {
  for (const n of nodes) {
    const path = [...trail, n.name];
    out[n.id] = { id: n.id, name: n.name, path };
    if (n.children) buildLocIndex(n.children, path, out);
  }
  return out;
}
const LOC_INDEX = buildLocIndex(LOCATIONS);

let _idc = 0;
const uid = () => `p${(++_idc).toString().padStart(3, "0")}`;

const PARTS = [
  // Resistors
  { id: uid(), name: "1kΩ ¼W", cat: "resistor", qty: 412, min: 50, loc: "bin-r-1k", mfg: "Yageo", mpn: "CFR-25JB-52-1K", notes: "5% carbon film through-hole", value: "1 kΩ", pkg: "Axial DIP", tol: "5%", added: "2025-11-12", price: 0.012, datasheet: true },
  { id: uid(), name: "10kΩ ¼W", cat: "resistor", qty: 187, min: 50, loc: "bin-r-10k", mfg: "Yageo", mpn: "CFR-25JB-52-10K", notes: "Pull-up workhorse", value: "10 kΩ", pkg: "Axial DIP", tol: "5%", added: "2025-10-22", price: 0.012, datasheet: true },
  { id: uid(), name: "220Ω ¼W", cat: "resistor", qty: 23, min: 30, loc: "bin-r-220", mfg: "Yageo", mpn: "CFR-25JB-52-220R", notes: "LED current limiting", value: "220 Ω", pkg: "Axial DIP", tol: "5%", added: "2025-09-10", price: 0.012, datasheet: true },
  { id: uid(), name: "470Ω SMD 0805", cat: "resistor", qty: 1840, min: 200, loc: "bin-r-220", mfg: "Panasonic", mpn: "ERJ-6GEYJ471V", notes: "Reel of 5k, ~half used", value: "470 Ω", pkg: "0805", tol: "5%", added: "2026-01-04", price: 0.008, datasheet: true },
  { id: uid(), name: "4.7kΩ ¼W", cat: "resistor", qty: 75, min: 50, loc: "bin-r-10k", mfg: "Yageo", mpn: "CFR-25JB-52-4K7", notes: "", value: "4.7 kΩ", pkg: "Axial DIP", tol: "5%", added: "2025-08-14", price: 0.012, datasheet: true },

  // Capacitors
  { id: uid(), name: "100nF Ceramic", cat: "capacitor", qty: 612, min: 100, loc: "bin-c-cer", mfg: "Murata", mpn: "RDER71H104K2K1H03B", notes: "Decoupling default", value: "100 nF", pkg: "Radial 5mm", tol: "10%", added: "2025-12-01", price: 0.04, datasheet: true },
  { id: uid(), name: "10µF Electrolytic 25V", cat: "capacitor", qty: 88, min: 40, loc: "bin-c-elec", mfg: "Nichicon", mpn: "UVR1E100MDD", notes: "", value: "10 µF", pkg: "Radial 5x11", tol: "20%", added: "2025-11-30", price: 0.11, datasheet: true },
  { id: uid(), name: "470µF Electrolytic 16V", cat: "capacitor", qty: 12, min: 25, loc: "bin-c-elec", mfg: "Panasonic", mpn: "EEU-FR1C471", notes: "Low ESR, for buck reg", value: "470 µF", pkg: "Radial 10x16", tol: "20%", added: "2025-10-02", price: 0.32, datasheet: true },
  { id: uid(), name: "22pF Ceramic", cat: "capacitor", qty: 240, min: 50, loc: "bin-c-cer", mfg: "Kemet", mpn: "C320C220K1G5TA", notes: "Crystal load caps", value: "22 pF", pkg: "Radial 5mm", tol: "10%", added: "2026-02-11", price: 0.05, datasheet: true },

  // ICs
  { id: uid(), name: "NE555 Timer", cat: "ic", qty: 14, min: 5, loc: "bin-ic-op", mfg: "Texas Instruments", mpn: "NE555P", notes: "PDIP-8", value: "555", pkg: "PDIP-8", tol: "—", added: "2025-09-22", price: 0.45, datasheet: true },
  { id: uid(), name: "LM358 Op-Amp", cat: "ic", qty: 6, min: 8, loc: "bin-ic-op", mfg: "Texas Instruments", mpn: "LM358P", notes: "Dual op-amp, common", value: "LM358", pkg: "PDIP-8", tol: "—", added: "2025-09-22", price: 0.38, datasheet: true },
  { id: uid(), name: "74HC595 Shift Reg", cat: "ic", qty: 19, min: 6, loc: "bin-ic-logic", mfg: "Nexperia", mpn: "74HC595N", notes: "8-bit serial-in parallel-out", value: "74HC595", pkg: "PDIP-16", tol: "—", added: "2025-12-19", price: 0.52, datasheet: true },
  { id: uid(), name: "ATmega328P", cat: "ic", qty: 4, min: 3, loc: "bin-ic-logic", mfg: "Microchip", mpn: "ATMEGA328P-PU", notes: "Bare AVR for Arduino on breadboard", value: "ATmega328P", pkg: "PDIP-28", tol: "—", added: "2025-08-04", price: 3.10, datasheet: true },
  { id: uid(), name: "AMS1117-3.3", cat: "ic", qty: 32, min: 10, loc: "bin-ic-op", mfg: "AMS", mpn: "AMS1117-3.3", notes: "LDO 3.3V 1A", value: "3.3V LDO", pkg: "SOT-223", tol: "—", added: "2025-11-04", price: 0.18, datasheet: true },

  // Sensors
  { id: uid(), name: "DHT22 Temp/Humidity", cat: "sensor", qty: 5, min: 2, loc: "bin-sens-env", mfg: "Aosong", mpn: "AM2302", notes: "1-wire, 2s sample rate", value: "DHT22", pkg: "Module 4-pin", tol: "±0.5°C", added: "2025-12-30", price: 4.20, datasheet: true },
  { id: uid(), name: "MPU-6050 6-axis IMU", cat: "sensor", qty: 8, min: 3, loc: "bin-sens-imu", mfg: "TDK InvenSense", mpn: "MPU-6050", notes: "Accel + gyro, I²C", value: "MPU-6050", pkg: "Breakout", tol: "—", added: "2025-10-18", price: 2.80, datasheet: true },
  { id: uid(), name: "BME280 Env Sensor", cat: "sensor", qty: 3, min: 3, loc: "bin-sens-env", mfg: "Bosch", mpn: "BME280", notes: "Pressure, humidity, temp", value: "BME280", pkg: "Breakout", tol: "±1 hPa", added: "2026-02-08", price: 6.10, datasheet: true },
  { id: uid(), name: "HC-SR04 Ultrasonic", cat: "sensor", qty: 11, min: 4, loc: "bin-sens-env", mfg: "Generic", mpn: "HC-SR04", notes: "2–400 cm range", value: "HC-SR04", pkg: "Module 4-pin", tol: "±3 mm", added: "2025-07-12", price: 1.20, datasheet: true },

  // Modules
  { id: uid(), name: "Arduino Uno R3", cat: "module", qty: 3, min: 2, loc: "bin-mod-mcu", mfg: "Arduino", mpn: "A000066", notes: "Classic ATmega328 board", value: "Uno R3", pkg: "Board", tol: "—", added: "2025-06-10", price: 23.00, datasheet: true },
  { id: uid(), name: "ESP32-WROOM-32 DevKit", cat: "module", qty: 7, min: 3, loc: "bin-mod-radio", mfg: "Espressif", mpn: "ESP32-DevKitC", notes: "Dual-core, WiFi+BT", value: "ESP32", pkg: "DevKit", tol: "—", added: "2025-11-18", price: 8.50, datasheet: true },
  { id: uid(), name: "Raspberry Pi Pico", cat: "module", qty: 5, min: 3, loc: "bin-mod-mcu", mfg: "Raspberry Pi", mpn: "SC0915", notes: "RP2040, no wireless", value: "Pico", pkg: "Board", tol: "—", added: "2025-09-05", price: 4.00, datasheet: true },
  { id: uid(), name: "ESP8266 NodeMCU", cat: "module", qty: 2, min: 3, loc: "bin-mod-radio", mfg: "AI-Thinker", mpn: "ESP-12E", notes: "Low on stock", value: "NodeMCU", pkg: "Board", tol: "—", added: "2025-05-22", price: 3.40, datasheet: true },
  { id: uid(), name: "nRF24L01+ Radio", cat: "module", qty: 9, min: 4, loc: "bin-mod-radio", mfg: "Nordic", mpn: "nRF24L01P", notes: "2.4 GHz SPI radio", value: "nRF24L01+", pkg: "Module", tol: "—", added: "2025-08-29", price: 2.10, datasheet: true },

  // Cables
  { id: uid(), name: "Jumper M-M ×40", cat: "cable", qty: 6, min: 3, loc: "bin-cable", mfg: "Adafruit", mpn: "AF-758", notes: "Rainbow ribbon, 20cm", value: "20cm", pkg: "Set/40", tol: "—", added: "2025-12-04", price: 3.50 },
  { id: uid(), name: "Jumper M-F ×40", cat: "cable", qty: 4, min: 3, loc: "bin-cable", mfg: "Adafruit", mpn: "AF-826", notes: "Rainbow ribbon, 20cm", value: "20cm", pkg: "Set/40", tol: "—", added: "2025-12-04", price: 3.50 },
  { id: uid(), name: "USB-A → USB-C 1m", cat: "cable", qty: 8, min: 2, loc: "bin-cable", mfg: "Anker", mpn: "A8186", notes: "ESP32/Pico programming", value: "1 m", pkg: "Cable", tol: "—", added: "2025-10-01", price: 6.00 },
  { id: uid(), name: "Hookup wire 22AWG", cat: "cable", qty: 12, min: 6, loc: "bin-cable", mfg: "Remington", mpn: "16859", notes: "6-color spool set", value: "22 AWG", pkg: "Spool", tol: "—", added: "2025-07-18", price: 22.00 },

  // Tools
  { id: uid(), name: "Hakko FX-888D", cat: "tool", qty: 1, min: 1, loc: "bin-tool-iron", mfg: "Hakko", mpn: "FX888D-23BY", notes: "Calibrated 2025-11", value: "Iron", pkg: "Station", tol: "—", added: "2024-12-01", price: 110.00 },
  { id: uid(), name: "Fluke 117 DMM", cat: "tool", qty: 1, min: 1, loc: "bin-tool-hand", mfg: "Fluke", mpn: "117", notes: "True-RMS", value: "DMM", pkg: "Handheld", tol: "—", added: "2024-08-10", price: 220.00 },
  { id: uid(), name: "Wire strippers 30-10AWG", cat: "tool", qty: 2, min: 1, loc: "bin-tool-hand", mfg: "Klein", mpn: "11061", notes: "", value: "Strippers", pkg: "Hand tool", tol: "—", added: "2024-06-02", price: 28.00 },
  { id: uid(), name: "Tip cleaner brass", cat: "tool", qty: 1, min: 2, loc: "bin-tool-iron", mfg: "Hakko", mpn: "599B-02", notes: "Running low on coils", value: "Brass wool", pkg: "Holder", tol: "—", added: "2025-03-15", price: 6.50 },

  // Misc
  { id: uid(), name: "Breadboard 830-pt", cat: "misc", qty: 6, min: 2, loc: "bin-mod-mcu", mfg: "Generic", mpn: "MB-102", notes: "Half white, half black", value: "830 pt", pkg: "Breadboard", tol: "—", added: "2025-09-12", price: 4.80 },
  { id: uid(), name: "LED 5mm Red", cat: "misc", qty: 220, min: 30, loc: "bin-c-cer", mfg: "Lite-On", mpn: "LTL-4231N", notes: "Diffused, Vf 2V", value: "Red LED", pkg: "5mm THT", tol: "—", added: "2025-08-20", price: 0.06 },
  { id: uid(), name: "Tactile switch 6mm", cat: "misc", qty: 88, min: 20, loc: "bin-r-220", mfg: "Omron", mpn: "B3F-1000", notes: "Through-hole", value: "Tactile", pkg: "6×6×5", tol: "—", added: "2025-11-09", price: 0.18 },
  { id: uid(), name: "Pin headers 1×40", cat: "misc", qty: 1, min: 6, loc: "bin-mod-mcu", mfg: "Sullins", mpn: "PRPC040SAAN-RC", notes: "Critical: order more!", value: "2.54mm", pkg: "Strip", tol: "—", added: "2025-04-14", price: 0.30 },
];

const PROJECTS = [
  {
    id: "proj-1",
    name: "Greenhouse Monitor v2",
    desc: "ESP32 reading BME280 + soil moisture, posting to MQTT.",
    status: "In progress",
    updated: "2 days ago",
    bom: [
      { partId: PARTS.find(p => p.mpn === "ESP32-DevKitC").id, need: 1 },
      { partId: PARTS.find(p => p.mpn === "BME280").id, need: 1 },
      { partId: PARTS.find(p => p.name === "10kΩ ¼W").id, need: 2 },
      { partId: PARTS.find(p => p.name === "100nF Ceramic").id, need: 4 },
      { partId: PARTS.find(p => p.name === "AMS1117-3.3").id, need: 1 },
      { partId: PARTS.find(p => p.name === "LED 5mm Red").id, need: 2 },
    ],
  },
  {
    id: "proj-2",
    name: "Desk clock w/ shift register",
    desc: "7-segment LED clock driven by 74HC595, DS3231 RTC.",
    status: "Designing",
    updated: "1 week ago",
    bom: [
      { partId: PARTS.find(p => p.name === "ATmega328P").id, need: 1 },
      { partId: PARTS.find(p => p.name === "74HC595 Shift Reg").id, need: 4 },
      { partId: PARTS.find(p => p.name === "220Ω ¼W").id, need: 32 },
      { partId: PARTS.find(p => p.name === "Tactile switch 6mm").id, need: 3 },
      { partId: PARTS.find(p => p.name === "22pF Ceramic").id, need: 2 },
      { partId: PARTS.find(p => p.name === "Pin headers 1×40").id, need: 1 },
    ],
  },
  {
    id: "proj-3",
    name: "Soldering iron tip-temp logger",
    desc: "Pico + thermocouple over SPI, OLED display.",
    status: "Backlog",
    updated: "3 weeks ago",
    bom: [
      { partId: PARTS.find(p => p.name === "Raspberry Pi Pico").id, need: 1 },
      { partId: PARTS.find(p => p.name === "LM358 Op-Amp").id, need: 1 },
      { partId: PARTS.find(p => p.name === "470Ω SMD 0805").id, need: 6 },
    ],
  },
  {
    id: "proj-4",
    name: "RC car telemetry",
    desc: "nRF24L01+ telemetry from car to base, IMU on board.",
    status: "Done",
    updated: "Last month",
    bom: [
      { partId: PARTS.find(p => p.name === "nRF24L01+ Radio").id, need: 2 },
      { partId: PARTS.find(p => p.name === "MPU-6050 6-axis IMU").id, need: 1 },
      { partId: PARTS.find(p => p.name === "Arduino Uno R3").id, need: 2 },
    ],
  },
];

// Synthetic quantity history for chart
function genHistory(p) {
  // 12 month deltas
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const seed = p.id.charCodeAt(1) + p.id.charCodeAt(2);
  let qty = Math.max(0, p.qty - Math.round(seed % 30));
  const rows = [];
  for (let i = 0; i < 12; i++) {
    const r = ((seed + i * 31) % 17) - 7;
    const delta = i < 6 ? Math.abs(r) : r;
    qty = Math.max(0, qty + delta);
    rows.push({ m: months[i], qty, d: delta });
  }
  // Force end to match current
  rows[rows.length - 1].qty = p.qty;
  return rows;
}

window.CATEGORIES = CATEGORIES;
window.LOCATIONS = LOCATIONS;
window.LOC_INDEX = LOC_INDEX;
window.PARTS = PARTS;
window.PROJECTS = PROJECTS;
window.genHistory = genHistory;
