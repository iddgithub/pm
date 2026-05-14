# High-Fidelity Prototype Generator

## Overview
Generate high-fidelity HTML prototypes for mobile app screens. Output is a single self-contained HTML file that renders phone mockups in a browser, matching the project's existing design system.

## Trigger
Use this skill when the user asks to:
- 生成原型 / 做原型 / 出原型
- Create a prototype / mockup / wireframe
- Design screens for a feature
- Visualize a user flow

## Design System

### Colors (use CSS variables)
```css
:root {
  --brand: #13c9a2;
  --brand-deep: #0fb28e;
  --brand-bg: #eefaf6;
  --text: #20323a;
  --text-muted: #7c929b;
  --card-bg: #ffffff;
  --status-good: #2acb6d;
  --status-warn: #ffb33f;
  --status-bad: #ff6b6b;
  --line: #e8f0ee;
  --shadow: 0 18px 40px rgba(31, 71, 60, 0.12);
}
```

### Typography
- Font: `"SF Pro Display", "PingFang SC", "Noto Sans SC", sans-serif`
- Headings: 20–34px, weight 700–800
- Body: 13–15px
- Small/meta: 10–12px

### Layout Structure
```
.page (max-width: 1220px, centered)
  └─ .hero (title + description)
  └─ .screens (CSS grid, 3-col desktop / 2-col tablet / 1-col mobile)
      └─ .stage (flex column, label below)
          └─ .phone (dark frame: #11181d, 10px padding, 34px radius)
              └─ .screen (26px radius, min-height 664px, overflow hidden)
                  ├─ .topbar (brand gradient header)
                  │   ├─ .statusbar (time + icons, 12px)
                  │   └─ .nav (back arrow + title + action)
                  └─ .content (scrollable body, 14–16px padding)
```

### Key Components

**Cards**
```html
<div class="card">...</div>
```
```css
.card { background: #fff; border-radius: 18px; padding: 14px 16px; box-shadow: var(--shadow); border: 1px solid var(--line); }
```

**Primary Button**
```html
<button class="btn-primary">操作</button>
```
```css
.btn-primary { background: linear-gradient(135deg, #08b57f, #13c88f); color: #fff; border-radius: 14px; font-weight: 700; min-height: 44px; }
```

**Section Title with accent bar**
```html
<div class="section-title"><span class="accent"></span>标题</div>
```
```css
.accent { width: 4px; height: 14px; background: var(--brand); border-radius: 999px; }
.section-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; }
```

**Tags / Pills**
```html
<span class="tag">标签</span>
<span class="tag is-orange">警告</span>
<span class="tag is-red">异常</span>
```

**Segment Tabs**
```html
<div class="seg-tabs">
  <button class="seg active">选项一</button>
  <button class="seg">选项二</button>
</div>
```

**Status Badge**
- Good: `color: var(--status-good)`
- Warn: `color: var(--status-warn)`
- Bad: `color: var(--status-bad)`

## Output Requirements

1. **Single HTML file** — all CSS inline in `<style>`, no external dependencies
2. **Phone mockup frame** — dark frame (#11181d), brand gradient topbar, statusbar showing "9:41" and battery/signal icons
3. **Multiple screens** — show the full user flow, each screen as a separate phone mockup with a label below
4. **Responsive grid** — 3 columns on desktop, 2 on tablet, 1 on mobile
5. **Hero section** — page title, feature description, screen count
6. **Realistic content** — use plausible Chinese medical/health data, not "Lorem ipsum"
7. **Scrollable content** — `.content` area should overflow-y: auto with hidden scrollbar

## Process

### Step 1: Clarify scope
Ask the user:
- 这个功能的用户是谁？（患者 / 诊所医生 / 互联网医生）
- 需要展示哪些页面/步骤？
- 有没有已有的需求文档或流程描述？

### Step 2: Plan screens
List the screens you'll generate with a one-line description each. Confirm with user before writing code.

### Step 3: Generate HTML
Write the complete HTML file. Structure:
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Feature Name] 原型</title>
  <style>/* full design system CSS */</style>
</head>
<body>
  <div class="page">
    <div class="hero">...</div>
    <div class="screens">
      <!-- one .stage per screen -->
    </div>
  </div>
</body>
</html>
```

### Step 4: Save file
Save to: `04_workspace/prd/[端]/prototype/[序号]-[功能名称]原型.html`

### Step 5: Verify
Confirm the file was saved and tell the user the path to open it in a browser.

## Quality Checklist
- [ ] All screens have realistic Chinese content
- [ ] Brand colors (#13c9a2) used consistently
- [ ] Phone mockup frame renders correctly
- [ ] Topbar has gradient + statusbar + nav
- [ ] Cards have correct shadow and border-radius
- [ ] Responsive breakpoints at 860px and 1120px
- [ ] No external CSS/JS dependencies
- [ ] File saved to correct path
