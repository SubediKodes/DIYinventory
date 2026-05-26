/* global React */
// Icons — minimal stroke icons used throughout the app

const Ic = ({ d, size = 16, stroke = 1.6, fill, style, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={fill || "none"}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
  >
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const icons = {
  dashboard: <Ic d="M3 12h7V3H3v9zm0 9h7v-6H3v6zm11 0h7v-9h-7v9zm0-18v6h7V3h-7z" />,
  parts: <Ic d={<g><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></g>} />,
  storage: <Ic d={<g><path d="M3 7h18v6H3zM3 13v7h18v-7M3 7l2-3h14l2 3" /><path d="M10 17h4" /></g>} />,
  project: <Ic d={<g><path d="M3 7h6l2 2h10v10H3z" /><path d="M3 12h18" /></g>} />,
  search: <Ic d={<g><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" /></g>} />,
  plus: <Ic d="M12 5v14M5 12h14" />,
  filter: <Ic d="M4 5h16l-6 8v6l-4-2v-4z" />,
  sort: <Ic d={<g><path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" /></g>} />,
  more: <Ic d={<g><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></g>} stroke={0} />,
  chev: <Ic d="m9 6 6 6-6 6" />,
  chevDown: <Ic d="m6 9 6 6 6-6" />,
  arrowUp: <Ic d="M12 19V5M5 12l7-7 7 7" />,
  arrowDown: <Ic d="M12 5v14M5 12l7 7 7-7" />,
  x: <Ic d="M6 6l12 12M18 6L6 18" />,
  check: <Ic d="m5 12 5 5L20 7" />,
  alert: <Ic d={<g><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" /></g>} />,
  link: <Ic d={<g><path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 10a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 20.07l1.71-1.71" /></g>} />,
  download: <Ic d="M12 3v12m-5-5 5 5 5-5M5 21h14" />,
  upload: <Ic d="M12 21V9m-5 5 5-5 5 5M5 3h14" />,
  pdf: <Ic d={<g><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></g>} />,
  sun: <Ic d={<g><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></g>} />,
  moon: <Ic d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  menu: <Ic d="M3 6h18M3 12h18M3 18h18" />,
  edit: <Ic d="M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />,
  trash: <Ic d={<g><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" /></g>} />,
  resistor: <Ic d={<g><path d="M2 12h3" /><path d="M19 12h3" /><path d="M5 8h14v8H5z" /><path d="M9 8v8M13 8v8" /></g>} />,
  capacitor: <Ic d={<g><path d="M2 12h7M15 12h7" /><path d="M9 6v12M15 4v16" /></g>} />,
  ic: <Ic d={<g><rect x="6" y="6" width="12" height="12" rx="1" /><path d="M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3" /></g>} />,
  sensor: <Ic d={<g><circle cx="12" cy="12" r="2.5" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M5.6 18.4 7.7 16.3M16.3 7.7l2.1-2.1" /></g>} />,
  board: <Ic d={<g><rect x="3" y="4" width="18" height="16" rx="1.5" /><circle cx="7" cy="8" r="0.7" fill="currentColor" /><circle cx="11" cy="8" r="0.7" fill="currentColor" /><circle cx="15" cy="8" r="0.7" fill="currentColor" /><circle cx="7" cy="16" r="0.7" fill="currentColor" /><circle cx="11" cy="16" r="0.7" fill="currentColor" /><circle cx="15" cy="16" r="0.7" fill="currentColor" /><path d="M9 12h6" /></g>} />,
  cable: <Ic d={<g><path d="M3 6c4 0 4 12 8 12s4-12 8-12" /><circle cx="3" cy="6" r="1.4" /><circle cx="19" cy="6" r="1.4" /></g>} />,
  tool: <Ic d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.4-.7-.7-2.4z" />,
  misc: <Ic d={<g><circle cx="12" cy="12" r="9" /><path d="M9 12h6M12 9v6" /></g>} />,
  folder: <Ic d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  cmd: <Ic d={<g><path d="M9 6H7a3 3 0 1 0 0 6h10a3 3 0 1 1 0 6h-2" /><path d="M9 6v12M15 6v12" /></g>} />,
  arrowRight: <Ic d="M5 12h14M13 5l7 7-7 7" />,
  cube: <Ic d={<g><path d="M21 7.5 12 3 3 7.5l9 4.5 9-4.5z" /><path d="M3 7.5v9L12 21l9-4.5v-9" /><path d="M12 12v9" /></g>} />,
  history: <Ic d={<g><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></g>} />,
  bell: <Ic d={<g><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></g>} />,
  command: <Ic d={<g><path d="M6 4a2 2 0 1 1-2 2V4zM18 4a2 2 0 1 0 2 2V4zM6 14a2 2 0 1 1-2 2v-2zM18 14a2 2 0 1 0 2 2v-2z" /><path d="M6 4h12v16H6z" fill="none" /></g>} />,
};

window.Ic = Ic;
window.icons = icons;
