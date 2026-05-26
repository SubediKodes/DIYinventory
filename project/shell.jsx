/* global React, icons, Ic */
// Sidebar, Topbar, CommandPalette, Toasts

const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Sidebar({ page, setPage, partCounts, theme, setTheme, mobileOpen, setMobileOpen }) {
  return (
    <aside className={"sidebar" + (mobileOpen ? " open" : "")}>
      <div className="sidebar-brand">
        <div className="brand-mark"><span></span></div>
        <div className="brand-name">DIY<b>inv</b></div>
        <button
          className="icon-btn"
          style={{ marginLeft: "auto" }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? icons.sun : icons.moon}
        </button>
      </div>

      <NavItem ic="dashboard" label="Dashboard" active={page === "dashboard"} onClick={() => { setPage("dashboard"); setMobileOpen(false); }} />
      <NavItem ic="parts" label="Parts" count={partCounts.total} active={page === "parts"} onClick={() => { setPage({ name: "parts" }); setMobileOpen(false); }} />
      <NavItem ic="storage" label="Storage" active={page === "storage"} onClick={() => { setPage("storage"); setMobileOpen(false); }} />
      <NavItem ic="project" label="Projects" count={4} active={page === "projects"} onClick={() => { setPage("projects"); setMobileOpen(false); }} />

      <div className="sidebar-section">Categories</div>
      {window.CATEGORIES.map(c => (
        <button
          key={c.id}
          className={"nav-item" + (page && page.name === "parts" && page.cat === c.id ? " active" : "")}
          onClick={() => { setPage({ name: "parts", cat: c.id }); setMobileOpen(false); }}
        >
          <span className="cat-dot" style={{ background: c.color }}></span>
          <span style={{ flex: 1 }}>{c.label}</span>
          <span className="count">{partCounts.byCat[c.id] || 0}</span>
        </button>
      ))}

      <div className="sidebar-section">Smart lists</div>
      <button
        className={"nav-item" + (page && page.name === "parts" && page.filter === "low" ? " active" : "")}
        onClick={() => { setPage({ name: "parts", filter: "low" }); setMobileOpen(false); }}
      >
        <span className="icon" style={{ color: "var(--danger)" }}>{icons.alert}</span>
        <span style={{ flex: 1 }}>Low stock</span>
        <span className="count">{partCounts.low}</span>
      </button>
      <button
        className={"nav-item" + (page && page.name === "parts" && page.filter === "recent" ? " active" : "")}
        onClick={() => { setPage({ name: "parts", filter: "recent" }); setMobileOpen(false); }}
      >
        <span className="icon">{icons.history}</span>
        <span style={{ flex: 1 }}>Recently added</span>
      </button>

      <div className="sidebar-foot">
        <div className="avatar">CK</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
          <span style={{ fontWeight: 500 }}>Charlie K.</span>
          <span className="faint" style={{ fontSize: 11 }}>Maker · home lab</span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ ic, label, count, active, onClick }) {
  return (
    <button className={"nav-item" + (active ? " active" : "")} onClick={onClick}>
      <span className="icon">{icons[ic]}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && <span className="count">{count}</span>}
    </button>
  );
}

function Topbar({ crumbs, onOpenPalette, onAddPart, setMobileOpen }) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={() => setMobileOpen(x => !x)}>{icons.menu}</button>
      <nav className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? "now" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </nav>
      <div className="spacer"></div>
      <button className="k-input" onClick={onOpenPalette}>
        <span style={{ color: "var(--text-faint)" }}>{icons.search}</span>
        <span>Search parts, projects…</span>
        <span className="kbd">⌘K</span>
      </button>
      <button className="icon-btn">{icons.bell}</button>
      <button className="btn primary" onClick={onAddPart}>
        <span className="icon">{icons.plus}</span>
        Add part
      </button>
    </header>
  );
}

function CommandPalette({ open, onClose, parts, projects, navigate, theme, setTheme, addPart }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    }
  }, [open]);

  const items = useMemo(() => {
    const Q = q.trim().toLowerCase();
    const actions = [
      { id: "act:add", t: "Add new part", section: "Actions", icon: "plus", run: () => { onClose(); addPart(); } },
      { id: "act:dashboard", t: "Go to Dashboard", section: "Actions", icon: "dashboard", run: () => { onClose(); navigate("dashboard"); } },
      { id: "act:parts", t: "Go to Parts", section: "Actions", icon: "parts", run: () => { onClose(); navigate({ name: "parts" }); } },
      { id: "act:storage", t: "Go to Storage", section: "Actions", icon: "storage", run: () => { onClose(); navigate("storage"); } },
      { id: "act:projects", t: "Go to Projects", section: "Actions", icon: "project", run: () => { onClose(); navigate("projects"); } },
      { id: "act:theme", t: theme === "dark" ? "Switch to light mode" : "Switch to dark mode", section: "Actions", icon: theme === "dark" ? "sun" : "moon", run: () => { onClose(); setTheme(theme === "dark" ? "light" : "dark"); } },
      { id: "act:low", t: "Show low-stock parts", section: "Actions", icon: "alert", run: () => { onClose(); navigate({ name: "parts", filter: "low" }); } },
    ];
    const partItems = parts.map(p => ({
      id: "p:" + p.id,
      t: p.name,
      meta: p.mpn,
      section: "Parts",
      icon: window.CATEGORIES.find(c => c.id === p.cat)?.icon || "misc",
      run: () => { onClose(); navigate({ name: "part", id: p.id }); },
    }));
    const projItems = projects.map(p => ({
      id: "pr:" + p.id,
      t: p.name,
      section: "Projects",
      icon: "project",
      run: () => { onClose(); navigate({ name: "project", id: p.id }); },
    }));
    const all = [...actions, ...partItems, ...projItems];
    if (!Q) return all.slice(0, 8).concat(partItems.slice(0, 6));
    return all.filter(it =>
      it.t.toLowerCase().includes(Q) || (it.meta || "").toLowerCase().includes(Q)
    ).slice(0, 14);
  }, [q, parts, projects, theme]);

  useEffect(() => { setIdx(0); }, [q]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(items.length - 1, i + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); items[idx] && items[idx].run(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, items, idx]);

  if (!open) return null;

  // Group by section preserving order
  const grouped = [];
  let last = null;
  items.forEach((it, i) => {
    if (it.section !== last) { grouped.push({ section: it.section, items: [] }); last = it.section; }
    grouped[grouped.length - 1].items.push({ ...it, i });
  });

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <div className="cmd" onClick={e => e.stopPropagation()}>
        <div className="cmd-input">
          <span style={{ color: "var(--text-faint)" }}>{icons.search}</span>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Type a command or search…" />
          <span style={{ fontSize: 11, color: "var(--text-faint)", fontFamily: "Geist Mono" }}>esc</span>
        </div>
        <div className="cmd-list">
          {grouped.length === 0 && (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-faint)", fontSize: 13 }}>
              No matches
            </div>
          )}
          {grouped.map((g, gi) => (
            <div key={gi}>
              <div className="cmd-section">{g.section}</div>
              {g.items.map(it => (
                <div
                  key={it.id}
                  className={"cmd-row" + (it.i === idx ? " active" : "")}
                  onMouseEnter={() => setIdx(it.i)}
                  onClick={() => it.run()}
                >
                  <span className="icon">{icons[it.icon]}</span>
                  <span>{it.t}</span>
                  {it.meta && <span className="meta mono">{it.meta}</span>}
                  {it.i === idx && <span className="meta">↵</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cmd-foot">
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> select</span>
          <span><span className="kbd">esc</span> close</span>
          <span style={{ marginLeft: "auto" }}>{items.length} results</span>
        </div>
      </div>
    </div>
  );
}

function Toasts({ toasts, dismiss }) {
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={"toast" + (t.kind ? " " + t.kind : "") + (t.exit ? " exit" : "")}>
          <div className="ic">
            {t.kind === "err" ? icons.x : t.kind === "warn" ? icons.alert : icons.check}
          </div>
          <div style={{ flex: 1 }}>
            <div className="t">{t.title}</div>
            {t.desc && <div className="d">{t.desc}</div>}
          </div>
          <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => dismiss(t.id)}>{icons.x}</button>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, CommandPalette, Toasts });
