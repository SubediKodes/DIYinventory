# DIYinventory

A single-file web app for managing a personal electronics parts inventory. No installation, no server, no build step — open the HTML file in any browser and it works.

---

## How to run

```
open DIYinventory.html
```

That's it. Works in Chrome, Firefox, Safari, or any modern browser.

---

## What it does

### Pages

**Dashboard**
Overview of your inventory — total parts, unique SKUs, estimated value, low-stock alerts, a category breakdown chart, and recently added parts.

**Parts**
Full parts table with inline editing. Click any cell (name, qty, notes) to edit it directly. Use the +/- buttons to adjust quantity. Filter by category, location, or stock level. Sort by any column.

**Storage**
Visual map of your physical storage locations (drawers, bins, boxes). Click a location to see which parts are stored there.

**Projects**
Bill of materials for each project. See how many parts are needed, which are short, and what percentage of a build is ready to go.

### Part fields

Each part has: name, category, manufacturer, MPN, value, package, quantity, minimum stock, location, price, tolerance, notes, and image URL.

### Smart lists (sidebar)

- **Low stock** — parts where current qty is below the minimum
- **Recently added** — parts sorted by date added

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette (search + navigate) |
| `⌘N` | Add new part |

---

## Adding and editing parts

**Add a part** — click `+ Add part` in the top-right or press `⌘N`. Fill in the name and any other fields, then click Create.

**Edit inline** — on the Parts page, click any cell in the table to edit it in place. Press Enter or click away to save.

**Edit full detail** — click a part's name to open its detail page, where you can also add an image URL, view quantity history, and see which projects use it.

**Delete a part** — open the part detail page and click the trash icon.

---

## Data & saving

Changes are saved automatically to **browser localStorage** — no manual save needed. Your data persists across page refreshes as long as you use the same browser.

### Export / Import

Use the **↓ / ↑ icons** in the topbar to back up or restore your data:

- **Export** — downloads a `diy-parts-YYYY-MM-DD.json` file
- **Import** — loads a previously exported JSON file, replacing the current data

### GitHub Gist sync

Optionally sync your parts to a secret GitHub Gist so data is safe across browsers and devices.

**Setup:**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic)
2. Enable only the **gist** scope → copy the token and save it somewhere safe (GitHub only shows it once)
3. In the app, click the **⚙ gear icon** in the bottom-left corner of the sidebar
4. Paste your token → leave Gist ID blank → click Save

On your first edit the app creates a secret Gist called `parts.json` automatically. Every subsequent change is pushed to it after a short delay. When you open the app it fetches the latest version from the Gist.

**Sync status** (shown in the sidebar footer):

- Green cloud-check — saved to Gist successfully
- Grey cloud-up — sync in progress
- Red alert — something went wrong (check your token)

**Notes:**
- The token is only stored in your browser — it is never written to any file
- Deleting browser data removes the token from this browser, but your Gist on GitHub is unaffected — just re-enter your token and Gist ID to reconnect
- Regenerating your GitHub token does not affect your data

---

## Theming

Click the **sun/moon icon** in the top-right of the sidebar to toggle light/dark mode. Accent color and other display options are available in the tweaks panel (bottom-right corner).
