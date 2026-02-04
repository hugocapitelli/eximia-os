---
title: "Fix Galaxy Colors - Troubleshooting Guide"
galaxy: "CORE"
document-type: "documentation"
status: "production"
tags:
  - "galaxy-core"
  - "troubleshooting"
---

# 🔧 Fix Galaxy Colors - Troubleshooting Guide

**Status:** Colors not showing? Follow these steps!

---

## ✅ What We Did

1. ✅ Added YAML frontmatter to 1,428 files
2. ✅ Added visible tags (#galaxy-*) to all files
3. ✅ Updated .obsidian/graph.json with 7 color configurations
4. ✅ Adjusted graph settings to show tags and colors

---

## 🚀 How to Fix It

### Step 1: Completely Close Obsidian

**Important:** Not just minimize - fully close the application.

**Windows/Linux:**
- Click X to close
- Make sure it's not running in system tray

**Mac:**
- CMD+Q to quit
- Ensure completely closed

---

### Step 2: Delete Obsidian Cache (Optional but Recommended)

The Obsidian cache sometimes prevents color updates. Delete:

**Windows:**
```
C:\Users\[YourUsername]\AppData\Local\Obsidian\Cache
```

**Mac:**
```
~/Library/Caches/Obsidian
```

**Linux:**
```
~/.cache/Obsidian
```

---

### Step 3: Reopen Obsidian

Open Obsidian and let it load completely (wait 5-10 seconds).

---

### Step 4: Open Graph View

Click the **Graph icon** on the left sidebar, or press:
- **Windows/Linux:** `Ctrl+G`
- **Mac:** `Cmd+G`

---

### Step 5: Configure Graph Settings

In Graph View, look for the settings panel on the **RIGHT SIDE**:

1. **Expand "Display" section**
   - Look for filter icons or settings

2. **Ensure these are enabled:**
   - ✅ "Show tags" = ON
   - ✅ "Color groups" = showing 7 colors
   - ✅ Filters NOT collapsed

3. **Enable Color Groups:**
   - Look for "Color" section
   - You should see 7 color options listed:
     - 👑 Purple (CORE)
     - 💼 Green (SPECIALIST)
     - 🧬 Orange (CREATION)
     - 📚 Gray (CODEX)
     - ⚙️ Blue (RUNTIME)
     - 🛠️ Pink (OPERATIONAL)
     - 🔧 Yellow (TOOLS)

4. **If color groups don't show:**
   - Try toggling filters on/off
   - Close and reopen graph view
   - Restart Obsidian completely

---

## 🔍 Verification Checklist

After following steps above, check:

- [ ] Graph View opens without errors
- [ ] Right panel shows color groups
- [ ] At least some colored nodes appear
- [ ] Can see multiple colors (not just white/gray)
- [ ] Nodes cluster by color (similar colors group together)

---

## ❌ If Still Not Working

### Issue: No color groups appear in Graph settings

**Solution:**
1. Delete `.obsidian/workspaces.json` (if exists)
2. Completely restart Obsidian
3. Open Graph View again
4. Go to Settings → Core Plugins → Graph (disable, wait 5s, enable)
5. Reopen Graph View

### Issue: All nodes same color (white/gray)

**Solution:**
1. Check `.obsidian/graph.json` exists and has `colorGroups`
2. In Graph View, right-click and clear any filters
3. Check that files have tags - open a file and scroll to bottom
4. Should see `#galaxy-*` tag at end

### Issue: Colorful but not grouped by galaxy

**Solution:**
This is normal if nodes aren't connected. The 7 colors should still be visible:
- Click on nodes to see galaxy assignment
- Use search `tag:galaxy-core` to filter by color
- Zoom in to see individual clusters

---

## 📋 Manual File Verification

To confirm tags were added correctly:

1. Open any markdown file from the project
2. Scroll to the **very end** of the file
3. You should see: `#galaxy-[galaxyname]`

**Example:**
```
... rest of file content ...

#galaxy-core
```

If you see this, tags are properly added! ✅

---

## 🔧 Force Refresh Graph

If colors still not showing after all steps:

**Option 1: Reload Vault**
- In Obsidian: `Ctrl+K` (Cmd+K on Mac)
- Type "Reload"
- Select "Reload app without saving"

**Option 2: Clear Graph Cache**
1. Close Obsidian
2. Navigate to vault folder
3. Delete `.obsidian/cache` folder
4. Reopen Obsidian

**Option 3: Edit graph.json Manually**
Edit `.obsidian/graph.json` and ensure:
```json
{
  "showTags": true,
  "collapse-filter": false,
  "collapse-display": false,
  "collapse-color-groups": false,
  "colorGroups": [
    {
      "query": "tag:galaxy-core",
      "color": { "a": 1, "rgb": 9124491 }
    },
    // ... 6 more color groups ...
  ]
}
```

---

## 📸 What You Should See

After successful setup, in Graph View you'll see:

**Left Panel (Filters):**
- 7 colored dots/checkboxes
- Each with a galaxy name
- Can click to filter

**Center (Graph):**
- Nodes in 7 different colors
- Nodes grouped loosely by color
- Connected lines between related docs

**Right Panel (Settings):**
- Display options
- Color legend with 7 colors
- Filter controls

---

## 🎓 Understanding Tag-Based Colors

The color system works by matching **tags** in files:

```
File has tag: #galaxy-core
↓
Obsidian checks graph.json
↓
Finds rule: "tag:galaxy-core" → Purple color
↓
Node renders in Purple
```

So colors depend on:
1. ✅ Files having correct tags (we added these)
2. ✅ graph.json having color rules (we configured this)
3. ✅ Obsidian showing tags (we enabled this)
4. ✅ Obsidian recognizing colorGroups (needs full restart)

---

## 🚨 Last Resort

If nothing works:

1. **Backup your work**
   ```bash
   cp -r eximia-os eximia-os.backup
   ```

2. **Delete all Obsidian config**
   - Close Obsidian
   - Delete entire `.obsidian` folder
   - Reopen Obsidian (it will recreate with defaults)
   - Settings will reset, but vault is safe

3. **Rerun color configuration**
   ```bash
   node scripts/generate-obsidian-graph-config.js
   ```

4. **Restart Obsidian completely**

---

## 📞 Still Need Help?

Check these in order:

1. **Verify tags are in files:**
   ```bash
   # Unix/Linux/Mac
   grep -l "#galaxy-core" The_Maestro/*.md

   # Windows (PowerShell)
   Select-String -Path "The_Maestro\*.md" -Pattern "#galaxy-core"
   ```

2. **Verify graph.json has colors:**
   ```bash
   grep "colorGroups" .obsidian/graph.json
   ```

3. **Read full guide:**
   - See `scripts/GALAXY_SETUP_README.md`

4. **Review logs:**
   - Check `.metrics/galaxy-setup/EXECUTION_REPORT.md`

---

## Summary

**The colors should work after:**
1. ✅ Full Obsidian restart (close completely)
2. ✅ Clearing cache (optional but helps)
3. ✅ graph.json configured correctly (we did this)
4. ✅ Tags visible in files (we added these)
5. ✅ Graph settings showing tags enabled

**If still not working:** The Obsidian cache may need clearing. Try:
- Close Obsidian
- Delete `.obsidian/cache`
- Reopen Obsidian
- Open Graph View

**Still issues?** Contact support or check Obsidian's color group documentation.

---

**Generated:** 2026-02-02
**Status:** Troubleshooting Guide
