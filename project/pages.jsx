/* global React, icons, Ic, CATEGORIES, LOC_INDEX, PARTS, PROJECTS, genHistory */
// Page-level components: Dashboard, PartsList, PartDetail, Storage, Projects/BOM

const { useState, useEffect, useRef, useMemo } = React;

// ---------- helpers ----------

function statusOf(p) {
  if (p.qty === 0) return { kind: "danger", label: "Out" };
  if (p.qty < p.min) return { kind: "danger", label: "Short" };
  if (p.qty < p.min * 1.5) return { kind: "warn", label: "Low" };
  return { kind: "ok", label: "OK" };
}

function CatChip({ cat }) {
  const c = window.CATEGORIES.find(x => x.id === cat);
  if (!c) return null;
  return (
    <span className="chip" style={{ background: "transparent" }}>
      <span className="dot" style={{ background: c.color }}></span>
      {c.label}
    </span>
  );
}

function LocPath({ id }) {
  const l = LOC_INDEX[id];
  if (!l) return <span className="path">—</span>;
  return (
    <span className="path">
      {l.path.map((seg, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">›</span>}
          <span className={i === l.path.length - 1 ? "seg" : ""}>{seg}</span>
        </React.Fragment>
      ))}
    </span>
  );
}

// ---------- Dashboard ----------

function Dashboard({ parts, projects, navigate }) {
  const total = parts.reduce((a, p) => a + p.qty, 0);
  const unique = parts.length;
  const low = parts.filter(p => p.qty < p.min).length;
  const value = parts.reduce((a, p) => a + (p.qty * (p.price || 0)), 0);
  const recent = [...parts].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 6);
  const lowList = parts.filter(p => p.qty < p.min).sort((a, b) => (a.qty / a.min) - (b.qty / b.min)).slice(0, 6);

  // category breakdown bars
  const cats = window.CATEGORIES.map(c => ({
    ...c,
    n: parts.filter(p => p.cat === c.id).length,
    q: parts.filter(p => p.cat === c.id).reduce((a, p) => a + p.qty, 0),
  }));
  const maxQ = Math.max(...cats.map(c => c.q));

  return (
    <div className="content-inner">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">Welcome back. Here's what's in the lab today.</div>
        </div>
        <div className="actions">
          <button className="btn"><span className="icon">{icons.download}</span>Export CSV</button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total parts" value={total.toLocaleString()} delta="+218 this month" up icon="cube" />
        <StatCard label="Unique SKUs" value={unique} delta={`across ${cats.filter(c => c.n).length} categories`} icon="parts" />
        <StatCard label="Low stock" value={low} delta={low > 0 ? "needs attention" : "all healthy"} down={low > 0} icon="alert" onClick={() => navigate({ name: "parts", filter: "low" })} />
        <StatCard label="Estimated value" value={"$" + value.toFixed(0)} delta="parts only, excl. tools" icon="cube" />
      </div>

      <div className="mt-16" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <h3>Low stock — order soon</h3>
            <span className="sub">below safety threshold</span>
            <span style={{ marginLeft: "auto" }}>
              <button className="btn sm ghost" onClick={() => navigate({ name: "parts", filter: "low" })}>
                View all <span className="icon">{icons.arrowRight}</span>
              </button>
            </span>
          </div>
          <div>
            {lowList.length === 0 && (
              <div style={{ padding: 28, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                Nothing low — all stocked.
              </div>
            )}
            {lowList.map(p => {
              const pct = Math.min(100, (p.qty / p.min) * 100);
              const cat = window.CATEGORIES.find(c => c.id === p.cat);
              return (
                <div key={p.id} className="list-row" onClick={() => navigate({ name: "part", id: p.id })} style={{ cursor: "pointer" }}>
                  <span className="cat-dot" style={{ background: cat.color }}></span>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                    <div className="name" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      <span className="chip danger">{p.qty}/{p.min}</span>
                    </div>
                    <div className="bom-bar" style={{ marginTop: 5 }}><div className="short" style={{ width: pct + "%" }}></div></div>
                  </div>
                  <div className="time mono">{p.mpn}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>By category</h3>
            <span className="sub">total quantity</span>
          </div>
          <div style={{ padding: "10px 14px" }}>
            {cats.map(c => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 56px", gap: 8, alignItems: "center", padding: "6px 0", cursor: "pointer" }} onClick={() => navigate({ name: "parts", cat: c.id })}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5 }}>
                  <span className="cat-dot" style={{ background: c.color }}></span>{c.label}
                </div>
                <div className="bom-bar" style={{ height: 6 }}>
                  <div style={{ width: (maxQ ? (c.q / maxQ * 100) : 0) + "%", background: c.color }}></div>
                </div>
                <div className="mono tabular" style={{ textAlign: "right", fontSize: 12.5, color: "var(--text-muted)" }}>{c.q.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <h3>Recently added</h3>
            <span style={{ marginLeft: "auto" }}>
              <button className="btn sm ghost" onClick={() => navigate({ name: "parts", filter: "recent" })}>
                View all <span className="icon">{icons.arrowRight}</span>
              </button>
            </span>
          </div>
          <div>
            {recent.map(p => {
              const cat = window.CATEGORIES.find(c => c.id === p.cat);
              return (
                <div key={p.id} className="list-row" style={{ cursor: "pointer" }} onClick={() => navigate({ name: "part", id: p.id })}>
                  <span className="cat-dot" style={{ background: cat.color }}></span>
                  <div className="col" style={{ flex: 1 }}>
                    <div className="name">{p.name}</div>
                    <div className="meta">{p.mfg} · <span className="mono">{p.mpn}</span></div>
                  </div>
                  <div className="time">{p.added}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Active projects</h3>
            <span style={{ marginLeft: "auto" }}>
              <button className="btn sm ghost" onClick={() => navigate("projects")}>
                View all <span className="icon">{icons.arrowRight}</span>
              </button>
            </span>
          </div>
          <div>
            {projects.slice(0, 4).map(pr => {
              const total = pr.bom.reduce((a, b) => a + b.need, 0);
              const have = pr.bom.reduce((a, b) => {
                const part = parts.find(p => p.id === b.partId);
                return a + Math.min(b.need, part ? part.qty : 0);
              }, 0);
              const pct = total ? Math.round(have / total * 100) : 0;
              return (
                <div key={pr.id} className="list-row" style={{ cursor: "pointer" }} onClick={() => navigate({ name: "project", id: pr.id })}>
                  <span className="icon" style={{ color: "var(--text-muted)" }}>{icons.project}</span>
                  <div className="col" style={{ flex: 1 }}>
                    <div className="name">{pr.name}</div>
                    <div className="bom-bar" style={{ marginTop: 4 }}>
                      <div className={pct < 100 ? "short" : ""} style={{ width: pct + "%" }}></div>
                    </div>
                  </div>
                  <div className="time">{pr.status} · {pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, up, down, icon, onClick }) {
  return (
    <div className="stat" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="label">
        <span style={{ color: "var(--text-faint)" }}>{icons[icon]}</span>
        {label}
      </div>
      <div className="value tabular">{value}</div>
      <div className={"delta" + (up ? " up" : "") + (down ? " down" : "")}>
        {up && <span className="icon">{icons.arrowUp}</span>}
        {down && <span className="icon">{icons.arrowDown}</span>}
        {delta}
      </div>
    </div>
  );
}

// ---------- Parts List ----------

function PartsList({ parts, navigate, updatePart, deletePart, openAdd, initialCat, initialFilter, addToast }) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState(initialCat || null);
  const [locFilter, setLocFilter] = useState(null);
  const [stockFilter, setStockFilter] = useState(initialFilter === "low" ? "low" : null);
  const [sortKey, setSortKey] = useState(initialFilter === "recent" ? "added" : "name");
  const [sortDir, setSortDir] = useState(initialFilter === "recent" ? "desc" : "asc");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null); // { id, field }

  useEffect(() => {
    setCatFilter(initialCat || null);
    if (initialFilter === "low") { setStockFilter("low"); setSortKey("name"); setSortDir("asc"); }
    else if (initialFilter === "recent") { setStockFilter(null); setSortKey("added"); setSortDir("desc"); }
    else { setStockFilter(null); }
  }, [initialCat, initialFilter]);

  const filtered = useMemo(() => {
    let r = parts;
    if (catFilter) r = r.filter(p => p.cat === catFilter);
    if (locFilter) r = r.filter(p => p.loc === locFilter);
    if (stockFilter === "low") r = r.filter(p => p.qty < p.min);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.mfg.toLowerCase().includes(q) ||
        p.mpn.toLowerCase().includes(q) ||
        (p.notes || "").toLowerCase().includes(q) ||
        (p.value || "").toLowerCase().includes(q)
      );
    }
    r = [...r].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") { av = av.toLowerCase(); bv = (bv || "").toLowerCase(); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return r;
  }, [parts, query, catFilter, locFilter, stockFilter, sortKey, sortDir]);

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sortIcon = key => {
    if (sortKey !== key) return <span style={{ opacity: 0.3 }}>{icons.sort}</span>;
    return sortDir === "asc" ? icons.arrowUp : icons.arrowDown;
  };

  const catLabel = catFilter ? window.CATEGORIES.find(c => c.id === catFilter)?.label : null;
  const locLabel = locFilter ? LOC_INDEX[locFilter]?.name : null;

  return (
    <div className="content-inner">
      <div className="page-head">
        <div>
          <h1>Parts</h1>
          <div className="sub">{filtered.length} of {parts.length} parts · click any cell to edit inline</div>
        </div>
        <div className="actions">
          <button className="btn"><span className="icon">{icons.upload}</span>Import</button>
          <button className="btn primary" onClick={openAdd}><span className="icon">{icons.plus}</span>Add part</button>
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="filter-bar">
          <div className="search">
            <span style={{ color: "var(--text-faint)" }}>{icons.search}</span>
            <input
              placeholder="Search name, MPN, manufacturer, notes…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <button className="icon-btn" style={{ width: 18, height: 18 }} onClick={() => setQuery("")}>{icons.x}</button>}
          </div>

          {catLabel ? (
            <button className="pill active" onClick={() => setCatFilter(null)}>
              Category: <b style={{ marginLeft: 4, color: "var(--text)" }}>{catLabel}</b>
              <span className="x">{icons.x}</span>
            </button>
          ) : (
            <CatDropdown setCat={setCatFilter} />
          )}
          {locLabel ? (
            <button className="pill active" onClick={() => setLocFilter(null)}>
              Location: <b style={{ marginLeft: 4, color: "var(--text)" }}>{locLabel}</b>
              <span className="x">{icons.x}</span>
            </button>
          ) : (
            <button className="pill" onClick={() => addToast({ kind: "warn", title: "Filter from sidebar", desc: "Pick a bin in Storage to filter here." })}>
              <span className="icon">{icons.storage}</span> Location
            </button>
          )}
          <button
            className={"pill" + (stockFilter === "low" ? " active" : "")}
            onClick={() => setStockFilter(stockFilter === "low" ? null : "low")}
          >
            <span className="icon" style={{ color: stockFilter === "low" ? "var(--danger)" : "inherit" }}>{icons.alert}</span>
            Low stock
            {stockFilter === "low" && <span className="x">{icons.x}</span>}
          </button>

          <div className="spacer"></div>
          <div className="count">{filtered.length} rows</div>
        </div>

        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 30 }}></th>
                <th style={{ minWidth: 200 }}>
                  <span className="sort" onClick={() => toggleSort("name")}>Part name <span className="icon">{sortIcon("name")}</span></span>
                </th>
                <th style={{ width: 130 }}>
                  <span className="sort" onClick={() => toggleSort("cat")}>Category <span className="icon">{sortIcon("cat")}</span></span>
                </th>
                <th style={{ width: 100, textAlign: "right" }}>
                  <span className="sort" onClick={() => toggleSort("qty")}>Qty <span className="icon">{sortIcon("qty")}</span></span>
                </th>
                <th style={{ minWidth: 200 }}>Location</th>
                <th style={{ width: 140 }}>
                  <span className="sort" onClick={() => toggleSort("mfg")}>Manufacturer <span className="icon">{sortIcon("mfg")}</span></span>
                </th>
                <th style={{ minWidth: 200 }}>Notes</th>
                <th style={{ width: 80 }}>Datasheet</th>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="9" style={{ padding: 40, textAlign: "center", color: "var(--text-faint)" }}>
                  No parts match your filters.
                </td></tr>
              )}
              {filtered.map(p => {
                const cat = window.CATEGORIES.find(c => c.id === p.cat);
                const st = statusOf(p);
                const isEdit = (k) => editing && editing.id === p.id && editing.field === k;
                return (
                  <tr key={p.id} className={selected === p.id ? "selected" : ""} onClick={() => setSelected(p.id)}>
                    <td>
                      <span className="cat-dot" style={{ background: cat.color }}></span>
                    </td>
                    <td>
                      {isEdit("name") ? (
                        <input
                          className="cell-input"
                          autoFocus
                          defaultValue={p.name}
                          onBlur={(e) => { updatePart(p.id, { name: e.target.value }); setEditing(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(null); }}
                        />
                      ) : (
                        <div onDoubleClick={() => setEditing({ id: p.id, field: "name" })} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <a style={{ fontWeight: 500, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); navigate({ name: "part", id: p.id }); }}>{p.name}</a>
                          <span className="mono faint" style={{ fontSize: 11 }}>{p.value}</span>
                        </div>
                      )}
                    </td>
                    <td><CatChip cat={p.cat} /></td>
                    <td className="cell-num">
                      {isEdit("qty") ? (
                        <input
                          className="cell-input cell-num" type="number" autoFocus
                          defaultValue={p.qty}
                          onBlur={(e) => { updatePart(p.id, { qty: parseInt(e.target.value || "0", 10) }); setEditing(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(null); }}
                        />
                      ) : (
                        <span className="qty" onDoubleClick={() => setEditing({ id: p.id, field: "qty" })}>
                          <button className="step" onClick={(e) => { e.stopPropagation(); updatePart(p.id, { qty: Math.max(0, p.qty - 1) }); }}>−</button>
                          <span className="v">{p.qty}</span>
                          <button className="step" onClick={(e) => { e.stopPropagation(); updatePart(p.id, { qty: p.qty + 1 }); }}>+</button>
                          {st.kind !== "ok" && <span style={{ marginLeft: 6 }} className={"chip " + st.kind}>{st.label}</span>}
                        </span>
                      )}
                    </td>
                    <td><LocPath id={p.loc} /></td>
                    <td>
                      {isEdit("mfg") ? (
                        <input
                          className="cell-input" autoFocus defaultValue={p.mfg}
                          onBlur={(e) => { updatePart(p.id, { mfg: e.target.value }); setEditing(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(null); }}
                        />
                      ) : (
                        <span onDoubleClick={() => setEditing({ id: p.id, field: "mfg" })}>{p.mfg}</span>
                      )}
                    </td>
                    <td style={{ color: "var(--text-muted)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {isEdit("notes") ? (
                        <input
                          className="cell-input" autoFocus defaultValue={p.notes || ""}
                          onBlur={(e) => { updatePart(p.id, { notes: e.target.value }); setEditing(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditing(null); }}
                        />
                      ) : (
                        <span onDoubleClick={() => setEditing({ id: p.id, field: "notes" })}>{p.notes || <span className="faint">—</span>}</span>
                      )}
                    </td>
                    <td>
                      {p.datasheet ? (
                        <a className="chip info" onClick={(e) => { e.stopPropagation(); addToast({ title: "Opening datasheet", desc: p.mpn + ".pdf" }); }} style={{ cursor: "pointer" }}>
                          <span className="icon" style={{ width: 11, height: 11 }}>{icons.pdf}</span> PDF
                        </a>
                      ) : <span className="faint">—</span>}
                    </td>
                    <td>
                      <RowMenu onView={() => navigate({ name: "part", id: p.id })} onDelete={() => { deletePart(p.id); addToast({ kind: "warn", title: "Part deleted", desc: p.name }); }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 muted" style={{ fontSize: 12, padding: "0 4px" }}>
        Tip: double-click any cell to edit. Use <span className="kbd" style={{ fontFamily: "Geist Mono", padding: "1px 5px", border: "1px solid var(--border)", borderRadius: 3 }}>⌘K</span> to jump anywhere.
      </div>
    </div>
  );
}

function CatDropdown({ setCat }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="pill" onClick={() => setOpen(o => !o)}>
        <span className="icon">{icons.filter}</span> Category
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "var(--shadow-md)", padding: 6, zIndex: 10, minWidth: 160 }}>
          {window.CATEGORIES.map(c => (
            <button key={c.id} className="cmd-row" style={{ width: "100%", padding: "6px 10px", borderRadius: 5 }} onClick={() => { setCat(c.id); setOpen(false); }}>
              <span className="cat-dot" style={{ background: c.color }}></span>
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RowMenu({ onView, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>{icons.more}</button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "var(--shadow-md)", padding: 4, zIndex: 10, minWidth: 140 }}>
          <button className="cmd-row" style={{ width: "100%", padding: "6px 10px", borderRadius: 5 }} onClick={(e) => { e.stopPropagation(); setOpen(false); onView(); }}>
            <span className="icon">{icons.arrowRight}</span> Open
          </button>
          <button className="cmd-row" style={{ width: "100%", padding: "6px 10px", borderRadius: 5, color: "var(--danger)" }} onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}>
            <span className="icon">{icons.trash}</span> Delete
          </button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Dashboard, PartsList, StatCard, CatChip, LocPath, statusOf });
