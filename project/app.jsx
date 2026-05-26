/* global React, ReactDOM, icons, Sidebar, Topbar, CommandPalette, Toasts, Dashboard, PartsList, PartDetail, Storage, ProjectsPage, ProjectDetail, AddPartDrawer, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, useTweaks */

const { useState, useEffect, useMemo, useCallback, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ca8a04",
  "density": "comfortable",
  "monoNums": true
}/*EDITMODE-END*/;

// Accent presets: hex → (oklch chroma, hue) used to derive --accent variants.
const ACCENT_PRESETS = {
  "#ca8a04": { hue: 75,  chroma: 0.16 },   // amber (default)
  "#2563eb": { hue: 255, chroma: 0.18 },   // blue
  "#16a34a": { hue: 150, chroma: 0.14 },   // green
  "#9333ea": { hue: 300, chroma: 0.18 },   // violet
  "#dc2626": { hue: 25,  chroma: 0.19 },   // red
  "#475569": { hue: 250, chroma: 0.02 },   // neutral slate
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("diy-theme") || "light");
  const [page, setPage] = useState("dashboard");
  const [parts, setParts] = useState(window.PARTS);
  const [projects] = useState(window.PROJECTS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("diy-theme", theme);
  }, [theme]);

  // Apply tweaks
  useEffect(() => {
    const preset = ACCENT_PRESETS[tweaks.accent] || ACCENT_PRESETS["#ca8a04"];
    const { hue, chroma } = preset;
    const isDark = theme === "dark";
    document.documentElement.style.setProperty("--accent", `oklch(${isDark ? 0.78 : 0.74} ${chroma} ${hue})`);
    document.documentElement.style.setProperty("--accent-soft", `oklch(${isDark ? 0.3 : 0.94} ${isDark ? chroma * 0.4 : chroma * 0.3} ${hue})`);
    document.documentElement.style.setProperty("--accent-strong", `oklch(${isDark ? 0.85 : 0.66} ${chroma + 0.01} ${hue})`);
    document.documentElement.style.setProperty("--accent-fg", `oklch(${isDark ? 0.16 : 0.22} ${chroma * 0.3} ${hue})`);
  }, [tweaks.accent, theme]);

  // Cmd+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n" && !e.shiftKey) {
        e.preventDefault();
        setAddOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const addToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(arr => [...arr, { id, ...t }]);
    setTimeout(() => {
      setToasts(arr => arr.map(x => x.id === id ? { ...x, exit: true } : x));
      setTimeout(() => setToasts(arr => arr.filter(x => x.id !== id)), 200);
    }, 3200);
  }, []);

  const dismissToast = useCallback(id => {
    setToasts(arr => arr.map(x => x.id === id ? { ...x, exit: true } : x));
    setTimeout(() => setToasts(arr => arr.filter(x => x.id !== id)), 200);
  }, []);

  const updatePart = useCallback((id, patch) => {
    setParts(arr => arr.map(p => p.id === id ? { ...p, ...patch } : p));
  }, []);
  const deletePart = useCallback((id) => {
    setParts(arr => arr.filter(p => p.id !== id));
  }, []);
  const createPart = useCallback((form) => {
    const id = "p" + Math.random().toString(36).slice(2, 6);
    setParts(arr => [{
      id,
      added: new Date().toISOString().slice(0, 10),
      datasheet: false,
      tol: "—",
      ...form,
    }, ...arr]);
    addToast({ title: "Part created", desc: form.name });
  }, [addToast]);

  // Counts for sidebar
  const partCounts = useMemo(() => {
    const byCat = {};
    parts.forEach(p => { byCat[p.cat] = (byCat[p.cat] || 0) + 1; });
    return {
      total: parts.length,
      low: parts.filter(p => p.qty < p.min).length,
      byCat,
    };
  }, [parts]);

  // Crumbs
  const crumbs = useMemo(() => {
    if (page === "dashboard") return ["Dashboard"];
    if (page === "storage") return ["Storage"];
    if (page === "projects") return ["Projects"];
    if (typeof page === "object") {
      if (page.name === "parts") {
        const out = ["Parts"];
        if (page.cat) out.push(window.CATEGORIES.find(c => c.id === page.cat)?.label || "");
        if (page.filter === "low") out.push("Low stock");
        if (page.filter === "recent") out.push("Recently added");
        return out;
      }
      if (page.name === "part") {
        const p = parts.find(x => x.id === page.id);
        return ["Parts", p ? p.name : "Part"];
      }
      if (page.name === "project") {
        const p = projects.find(x => x.id === page.id);
        return ["Projects", p ? p.name : "Project"];
      }
    }
    return ["DIYinv"];
  }, [page, parts, projects]);

  let content;
  if (page === "dashboard") content = <Dashboard parts={parts} projects={projects} navigate={setPage} />;
  else if (page === "storage") content = <Storage parts={parts} navigate={setPage} />;
  else if (page === "projects") content = <ProjectsPage projects={projects} parts={parts} navigate={setPage} addToast={addToast} />;
  else if (typeof page === "object" && page.name === "parts") {
    content = <PartsList
      parts={parts}
      navigate={setPage}
      updatePart={updatePart}
      deletePart={deletePart}
      openAdd={() => setAddOpen(true)}
      initialCat={page.cat}
      initialFilter={page.filter}
      addToast={addToast}
    />;
  }
  else if (typeof page === "object" && page.name === "part") {
    const part = parts.find(p => p.id === page.id);
    if (!part) content = <div className="content-inner"><div className="muted">Part not found.</div></div>;
    else content = <PartDetail part={part} parts={parts} navigate={setPage} updatePart={updatePart} deletePart={deletePart} addToast={addToast} />;
  }
  else if (typeof page === "object" && page.name === "project") {
    const proj = projects.find(p => p.id === page.id);
    content = <ProjectDetail project={proj} parts={parts} navigate={setPage} addToast={addToast} />;
  }

  return (
    <div className="app" data-density={tweaks.density}>
      {mobileOpen && <div className="mobile-scrim" onClick={() => setMobileOpen(false)}></div>}
      <Sidebar
        page={typeof page === "object" ? page : page}
        setPage={setPage}
        partCounts={partCounts}
        theme={theme}
        setTheme={setTheme}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="main">
        <Topbar
          crumbs={crumbs}
          onOpenPalette={() => setPaletteOpen(true)}
          onAddPart={() => setAddOpen(true)}
          setMobileOpen={setMobileOpen}
        />
        <div className="content">{content}</div>
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        parts={parts}
        projects={projects}
        navigate={setPage}
        theme={theme}
        setTheme={setTheme}
        addPart={() => setAddOpen(true)}
      />

      <AddPartDrawer open={addOpen} onClose={() => setAddOpen(false)} onCreate={createPart} />

      <Toasts toasts={toasts} dismiss={dismissToast} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Mode"
            value={theme}
            onChange={v => setTheme(v)}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={v => setTweak("accent", v)}
            options={Object.keys(ACCENT_PRESETS)}
          />
        </TweakSection>
        <TweakSection label="Table">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={v => setTweak("density", v)}
            options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfy" }]}
          />
          <TweakToggle
            label="Mono numbers"
            value={tweaks.monoNums}
            onChange={v => setTweak("monoNums", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Density tweak — apply via CSS
const densityStyle = document.createElement("style");
densityStyle.textContent = `
  [data-density="compact"] .tbl tbody td { padding: 4px 12px; height: 30px; }
  [data-density="compact"] .list-row { padding: 6px 14px; }
  [data-density="compact"] .tbl thead th { padding: 6px 12px; }
`;
document.head.appendChild(densityStyle);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
