/* global React, icons, Ic, CATEGORIES, LOCATIONS, LOC_INDEX, PARTS, PROJECTS, genHistory, statusOf, CatChip, LocPath */
// Detail pages: PartDetail, Storage, Projects list, Project detail, AddPartDrawer

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Part Detail ----------

function PartDetail({ part, parts, navigate, updatePart, deletePart, addToast }) {
  const [dragHover, setDragHover] = useState(false);
  const [images, setImages] = useState([]); // user-uploaded images
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(part.notes || "");

  const onDrop = (e) => {
    e.preventDefault();
    setDragHover(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length === 0) return;
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    }));
    Promise.all(readers).then(urls => {
      setImages(prev => [...prev, ...urls]);
      addToast({ title: `${files.length} image${files.length>1?"s":""} added`, desc: part.name });
    });
  };

  const cat = window.CATEGORIES.find(c => c.id === part.cat);
  const history = useMemo(() => genHistory(part), [part.id, part.qty]);
  const maxH = Math.max(...history.map(h => h.qty));

  return (
    <div className="content-inner">
      <div className="page-head">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="row" style={{ marginBottom: 6, color: "var(--text-muted)" }}>
            <button className="btn ghost sm" onClick={() => navigate({ name: "parts" })}>
              <span className="icon">{icons.chev}</span> Back to parts
            </button>
            <span className="sep faint">·</span>
            <CatChip cat={part.cat} />
            <span className="chip mono">{part.mpn}</span>
          </div>
          <h1>{part.name}</h1>
          <div className="sub">{part.mfg} · <LocPath id={part.loc} /></div>
        </div>
        <div className="actions">
          <button className="btn"><span className="icon">{icons.pdf}</span>Datasheet</button>
          <button className="btn"><span className="icon">{icons.edit}</span>Edit</button>
          <button className="btn" style={{ color: "var(--danger)" }} onClick={() => { deletePart(part.id); navigate({ name: "parts" }); addToast({ kind: "warn", title: "Part deleted", desc: part.name }); }}>
            <span className="icon">{icons.trash}</span>
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="card" style={{ padding: 14 }}>
            <div
              className={"dropzone" + (dragHover ? " hover" : "")}
              onDragOver={(e) => { e.preventDefault(); setDragHover(true); }}
              onDragLeave={() => setDragHover(false)}
              onDrop={onDrop}
              style={{ aspectRatio: "4/3", padding: 0, overflow: "hidden", display: "grid", placeItems: "center" }}
            >
              {images.length > 0 ? (
                <img src={images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="placeholder" style={{ width: "100%", height: "100%" }}>
                  <div>
                    <div className="big" style={{ color: "var(--text)" }}>Drop images here</div>
                    <div style={{ marginTop: 4 }}>or click to browse · png · jpg · webp</div>
                  </div>
                </div>
              )}
            </div>
            <div className="thumbs">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="image-frame" style={{ aspectRatio: 1, cursor: "pointer" }}>
                  {images[i] ? (
                    <img src={images[i]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div className="placeholder" style={{ width: "100%", height: "100%", fontSize: 10 }}>
                      {i === 0 ? "front" : i === 1 ? "back" : i === 2 ? "pinout" : "schematic"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-12">
            <div className="card-head">
              <h3>Quantity history</h3>
              <span className="sub">last 12 months</span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
                <span className="muted" style={{ fontSize: 12 }}>Current</span>
                <span className="mono" style={{ fontSize: 20, fontWeight: 500 }}>{part.qty}</span>
              </span>
            </div>
            <div className="bars" style={{ height: 100, padding: "16px 14px 8px" }}>
              {history.map((h, i) => (
                <div key={i} className="b" title={`${h.m}: ${h.qty}`} style={{ height: (h.qty / maxH * 100) + "%" }}></div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 16px 10px", fontFamily: "Geist Mono", fontSize: 10.5, color: "var(--text-faint)" }}>
              {history.map(h => <span key={h.m}>{h.m}</span>)}
            </div>
            <div className="history" style={{ padding: "8px 16px 14px", borderTop: "1px solid var(--border)" }}>
              {history.slice(-5).reverse().map((h, i) => (
                <div className="h-row" key={i}>
                  <span className="date">{h.m} '26</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {h.d > 0 ? "Restock — added to inventory" : h.d < 0 ? "Used in project" : "No change"}
                  </span>
                  <span className={"delta " + (h.d > 0 ? "up" : h.d < 0 ? "down" : "")}>{h.d > 0 ? "+" : ""}{h.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-head">
              <h3>Specifications</h3>
            </div>
            <div style={{ padding: "8px 16px 14px" }}>
              <table className="spec-tbl">
                <tbody>
                  <tr><td>Value</td><td>{part.value}</td></tr>
                  <tr><td>Package</td><td>{part.pkg}</td></tr>
                  <tr><td>Tolerance</td><td>{part.tol}</td></tr>
                  <tr><td>Manufacturer</td><td style={{ fontFamily: "Geist, sans-serif" }}>{part.mfg}</td></tr>
                  <tr><td>MPN</td><td>{part.mpn}</td></tr>
                  <tr><td>Unit price</td><td>${(part.price || 0).toFixed(3)}</td></tr>
                  <tr><td>Min stock</td><td>{part.min}</td></tr>
                  <tr><td>Storage</td><td><LocPath id={part.loc} /></td></tr>
                  <tr><td>Added</td><td>{part.added}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-12">
            <div className="card-head">
              <h3>Notes</h3>
              {!editingNotes ? (
                <button className="btn sm ghost" style={{ marginLeft: "auto" }} onClick={() => { setNotesDraft(part.notes || ""); setEditingNotes(true); }}>
                  <span className="icon">{icons.edit}</span> Edit
                </button>
              ) : (
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <button className="btn sm" onClick={() => setEditingNotes(false)}>Cancel</button>
                  <button className="btn sm primary" onClick={() => { updatePart(part.id, { notes: notesDraft }); setEditingNotes(false); addToast({ title: "Notes saved" }); }}>Save</button>
                </div>
              )}
            </div>
            <div style={{ padding: "12px 16px" }}>
              {editingNotes ? (
                <textarea className="textarea" style={{ width: "100%" }} value={notesDraft} onChange={e => setNotesDraft(e.target.value)} />
              ) : (
                <div style={{ color: "var(--text-muted)", fontSize: 13, whiteSpace: "pre-wrap" }}>
                  {part.notes || <span className="faint">No notes yet. Click Edit to add some.</span>}
                </div>
              )}
            </div>
          </div>

          <div className="card mt-12">
            <div className="card-head">
              <h3>Used in projects</h3>
            </div>
            <div>
              {window.PROJECTS.filter(pr => pr.bom.some(b => b.partId === part.id)).map(pr => {
                const b = pr.bom.find(x => x.partId === part.id);
                return (
                  <div key={pr.id} className="list-row" style={{ cursor: "pointer" }} onClick={() => navigate({ name: "project", id: pr.id })}>
                    <span className="icon" style={{ color: "var(--text-muted)" }}>{icons.project}</span>
                    <span className="name" style={{ flex: 1 }}>{pr.name}</span>
                    <span className="mono">{b.need} needed</span>
                  </div>
                );
              })}
              {window.PROJECTS.filter(pr => pr.bom.some(b => b.partId === part.id)).length === 0 && (
                <div style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)", textAlign: "center" }}>
                  Not used in any project yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Storage ----------

function Storage({ parts, navigate }) {
  const [selected, setSelected] = useState("bin-r-1k");
  const [open, setOpen] = useState({ lab: true, "lab-a": true, "lab-a-1": true });

  const countAt = (nodeId) => {
    const collectIds = (id) => {
      const ids = [id];
      const node = findNode(LOCATIONS, id);
      if (node && node.children) node.children.forEach(c => ids.push(...collectIds(c.id)));
      return ids;
    };
    const ids = collectIds(nodeId);
    return parts.filter(p => ids.includes(p.loc)).reduce((a, b) => a + b.qty, 0);
  };

  const inBin = useMemo(() => parts.filter(p => p.loc === selected), [parts, selected]);
  const selNode = LOC_INDEX[selected];

  return (
    <div className="content-inner">
      <div className="page-head">
        <div>
          <h1>Storage</h1>
          <div className="sub">Workshop → Shelf → Drawer → Bin · everything has a place</div>
        </div>
        <div className="actions">
          <button className="btn"><span className="icon">{icons.plus}</span>New location</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 10 }}>
          <div className="tree">
            {LOCATIONS.map(n => (
              <TreeNode key={n.id} node={n} depth={0} open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} countAt={countAt} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>{selNode ? selNode.name : "—"}</h3>
              <LocPath id={selected} />
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button className="btn sm"><span className="icon">{icons.edit}</span>Rename</button>
              <button className="btn sm"><span className="icon">{icons.plus}</span>Sub-location</button>
            </div>
          </div>

          <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <MiniStat label="Direct parts" value={inBin.length} />
            <MiniStat label="Total quantity" value={inBin.reduce((a, p) => a + p.qty, 0).toLocaleString()} />
            <MiniStat label="Low stock here" value={inBin.filter(p => p.qty < p.min).length} />
          </div>

          <div className="card-head" style={{ borderTop: "1px solid var(--border)" }}>
            <h3>Parts here</h3>
            <span className="sub">{inBin.length} items</span>
          </div>
          <div className="tbl-scroll" style={{ maxHeight: 380 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th></th>
                  <th>Part</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inBin.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: 30, textAlign: "center", color: "var(--text-faint)" }}>No parts in this location</td></tr>
                )}
                {inBin.map(p => {
                  const cat = window.CATEGORIES.find(c => c.id === p.cat);
                  const st = statusOf(p);
                  return (
                    <tr key={p.id} onClick={() => navigate({ name: "part", id: p.id })} style={{ cursor: "pointer" }}>
                      <td><span className="cat-dot" style={{ background: cat.color }}></span></td>
                      <td><span style={{ fontWeight: 500 }}>{p.name}</span> <span className="mono faint" style={{ fontSize: 11, marginLeft: 6 }}>{p.mpn}</span></td>
                      <td><CatChip cat={p.cat} /></td>
                      <td className="cell-num">{p.qty}</td>
                      <td><span className={"chip " + st.kind}>{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ background: "var(--bg-sunk)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{label}</div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

function TreeNode({ node, depth, open, setOpen, selected, setSelected, countAt }) {
  const isOpen = !!open[node.id];
  const has = node.children && node.children.length;
  const isLeaf = !has;
  const ic = depth === 0 ? "storage" : depth === 1 ? "folder" : depth === 2 ? "folder" : "cube";
  return (
    <>
      <div
        className={"tree-node" + (selected === node.id ? " active" : "")}
        onClick={() => {
          setSelected(node.id);
          if (has) setOpen(o => ({ ...o, [node.id]: !o[node.id] }));
        }}
      >
        {has ? (
          <span className={"chev" + (isOpen ? " open" : "")}>{icons.chev}</span>
        ) : <span style={{ width: 14 }}></span>}
        <span className="ic">{icons[ic]}</span>
        <span style={{ fontWeight: depth === 0 ? 600 : 500 }}>{node.name}</span>
        <span className="count">{countAt(node.id)}</span>
      </div>
      {has && isOpen && (
        <div className="tree-children">
          {node.children.map(c => (
            <TreeNode key={c.id} node={c} depth={depth + 1} open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} countAt={countAt} />
          ))}
        </div>
      )}
    </>
  );
}

// ---------- Projects ----------

function ProjectsPage({ projects, parts, navigate, addToast }) {
  return (
    <div className="content-inner">
      <div className="page-head">
        <div>
          <h1>Projects</h1>
          <div className="sub">Track BOMs and what you can build right now.</div>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => addToast({ title: "New project", desc: "(stub) Project creation coming soon" })}><span className="icon">{icons.plus}</span>New project</button>
        </div>
      </div>

      <div className="proj-grid">
        {projects.map(pr => {
          const total = pr.bom.reduce((a, b) => a + b.need, 0);
          const have = pr.bom.reduce((a, b) => {
            const part = parts.find(p => p.id === b.partId);
            return a + Math.min(b.need, part ? part.qty : 0);
          }, 0);
          const pct = total ? Math.round(have / total * 100) : 0;
          const short = pr.bom.filter(b => {
            const part = parts.find(p => p.id === b.partId);
            return !part || part.qty < b.need;
          }).length;
          return (
            <div key={pr.id} className="card project-card" onClick={() => navigate({ name: "project", id: pr.id })}>
              <div className="row">
                <span className="icon" style={{ color: "var(--text-muted)" }}>{icons.project}</span>
                <div className="title" style={{ flex: 1 }}>{pr.name}</div>
                <ProjectChip status={pr.status} />
              </div>
              <div className="desc">{pr.desc}</div>
              <div className="bom-bar"><div className={pct < 100 ? "short" : ""} style={{ width: pct + "%" }}></div></div>
              <div className="stats">
                <span><b>{pr.bom.length}</b> parts</span>
                <span><b>{pct}%</b> ready</span>
                {short > 0 && <span style={{ color: "var(--danger)" }}><b style={{ color: "var(--danger)" }}>{short}</b> short</span>}
                <span style={{ marginLeft: "auto" }} className="faint">{pr.updated}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectChip({ status }) {
  const m = { "Done": "ok", "In progress": "warn", "Designing": "info", "Backlog": "" };
  return <span className={"chip " + (m[status] || "")}>{status}</span>;
}

function ProjectDetail({ project, parts, navigate, addToast }) {
  const total = project.bom.reduce((a, b) => a + b.need, 0);
  const have = project.bom.reduce((a, b) => {
    const part = parts.find(p => p.id === b.partId);
    return a + Math.min(b.need, part ? part.qty : 0);
  }, 0);
  const pct = total ? Math.round(have / total * 100) : 0;
  const short = project.bom.filter(b => {
    const part = parts.find(p => p.id === b.partId);
    return !part || part.qty < b.need;
  });

  return (
    <div className="content-inner">
      <div className="page-head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ marginBottom: 6, color: "var(--text-muted)" }}>
            <button className="btn ghost sm" onClick={() => navigate("projects")}>
              <span className="icon">{icons.chev}</span> Back to projects
            </button>
            <span className="sep faint">·</span>
            <ProjectChip status={project.status} />
            <span className="faint" style={{ fontSize: 12 }}>updated {project.updated}</span>
          </div>
          <h1>{project.name}</h1>
          <div className="sub">{project.desc}</div>
        </div>
        <div className="actions">
          <button className="btn"><span className="icon">{icons.download}</span>Export BOM</button>
          <button className="btn primary" disabled={short.length > 0} onClick={() => addToast({ title: "Reserved", desc: `${total} parts moved to project` })}>
            {short.length > 0 ? `${short.length} parts short` : "Reserve parts"}
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCardMini label="Build readiness" value={pct + "%"} sub={short.length === 0 ? "ready to build" : `${short.length} parts short`} good={short.length === 0} />
        <StatCardMini label="Unique parts" value={project.bom.length} sub="line items" />
        <StatCardMini label="Total components" value={total} sub="parts needed" />
        <StatCardMini label="Estimated cost" value={"$" + project.bom.reduce((a, b) => {
          const part = parts.find(p => p.id === b.partId);
          return a + (part ? part.price * b.need : 0);
        }, 0).toFixed(2)} sub="parts only" />
      </div>

      <div className="tbl-wrap mt-16">
        <div className="card-head">
          <h3>Bill of Materials</h3>
          <span className="sub">{project.bom.length} line items</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn sm"><span className="icon">{icons.plus}</span>Add line</button>
          </span>
        </div>
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th></th>
                <th>Part</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Need</th>
                <th style={{ textAlign: "right" }}>Have</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Line cost</th>
              </tr>
            </thead>
            <tbody>
              {project.bom.map(b => {
                const part = parts.find(p => p.id === b.partId);
                if (!part) return null;
                const cat = window.CATEGORIES.find(c => c.id === part.cat);
                const enough = part.qty >= b.need;
                return (
                  <tr key={b.partId} onClick={() => navigate({ name: "part", id: part.id })} style={{ cursor: "pointer" }}>
                    <td><span className="cat-dot" style={{ background: cat.color }}></span></td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{part.name}</span>
                      <span className="mono faint" style={{ fontSize: 11, marginLeft: 6 }}>{part.mpn}</span>
                    </td>
                    <td><CatChip cat={part.cat} /></td>
                    <td className="cell-num">{b.need}</td>
                    <td className="cell-num">
                      <span className={enough ? "" : "mono"} style={{ color: enough ? "var(--text)" : "var(--danger)" }}>{part.qty}</span>
                    </td>
                    <td><LocPath id={part.loc} /></td>
                    <td>
                      {enough ? <span className="chip ok">Ready</span> : <span className="chip danger">Need {b.need - part.qty} more</span>}
                    </td>
                    <td className="cell-num">${(part.price * b.need).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCardMini({ label, value, sub, good }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value tabular" style={good ? { color: "var(--success)" } : {}}>{value}</div>
      <div className="delta">{sub}</div>
    </div>
  );
}

// ---------- Add Part Drawer ----------

function AddPartDrawer({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "", cat: "resistor", qty: 0, min: 5, loc: "bin-r-1k", mfg: "", mpn: "", value: "", pkg: "", notes: "", price: 0,
  });
  useEffect(() => { if (open) setForm({ name: "", cat: "resistor", qty: 0, min: 5, loc: "bin-r-1k", mfg: "", mpn: "", value: "", pkg: "", notes: "", price: 0 }); }, [open]);
  if (!open) return null;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const flatLocs = Object.values(LOC_INDEX);
  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <aside className="drawer">
        <div className="drawer-head">
          <h3>Add part</h3>
          <span className="muted" style={{ fontSize: 12 }}>Quick capture · expand later</span>
          <button className="icon-btn" style={{ marginLeft: "auto" }} onClick={onClose}>{icons.x}</button>
        </div>
        <div className="drawer-body">
          <div className="field">
            <label>Part name</label>
            <input className="input" placeholder="e.g. 1kΩ ¼W" value={form.name} onChange={e => set("name", e.target.value)} autoFocus />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Category</label>
              <select className="select" value={form.cat} onChange={e => set("cat", e.target.value)}>
                {window.CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Manufacturer</label>
              <input className="input" value={form.mfg} onChange={e => set("mfg", e.target.value)} placeholder="Yageo, TI…" />
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label>MPN</label>
              <input className="input mono" value={form.mpn} onChange={e => set("mpn", e.target.value)} placeholder="CFR-25JB-52-1K" style={{ fontFamily: "Geist Mono" }} />
            </div>
            <div className="field">
              <label>Value</label>
              <input className="input mono" value={form.value} onChange={e => set("value", e.target.value)} placeholder="1 kΩ" style={{ fontFamily: "Geist Mono" }} />
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label>Quantity</label>
              <input className="input mono" type="number" value={form.qty} onChange={e => set("qty", parseInt(e.target.value || "0", 10))} />
            </div>
            <div className="field">
              <label>Min stock</label>
              <input className="input mono" type="number" value={form.min} onChange={e => set("min", parseInt(e.target.value || "0", 10))} />
            </div>
          </div>
          <div className="field">
            <label>Location</label>
            <select className="select" value={form.loc} onChange={e => set("loc", e.target.value)}>
              {flatLocs.map(l => <option key={l.id} value={l.id}>{l.path.join(" › ")}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="textarea" value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Pull-up workhorse · 5% carbon film…" />
          </div>
          <div className="dropzone" style={{ marginTop: 8 }}>
            <div className="big">Drop datasheet & images here</div>
            <div>PDF, PNG, JPG · max 10 MB</div>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!form.name} onClick={() => { onCreate(form); onClose(); }}>
            <span className="icon">{icons.plus}</span> Create part
          </button>
        </div>
      </aside>
    </>
  );
}

Object.assign(window, { PartDetail, Storage, ProjectsPage, ProjectDetail, AddPartDrawer });
