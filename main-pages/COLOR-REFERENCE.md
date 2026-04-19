# Website Color Reference

This document lists where colors are defined in **styles.css** and which part of the website each one controls. Use Find (Ctrl+F / Cmd+F) to jump to a section.

---

## 1. Page background (dot grid)

**Location:** `body` and `html:not(.dark-mode) body`, `html.dark-mode body`

| What it controls | Variable / property | Light mode | Dark mode |
|------------------|---------------------|------------|-----------|
| Background color of entire site | `--dot-bg` | `#d8d8d8` (light gray) | `#242424` (dark gray) |
| Dot color in grid pattern | `--dot-color` | `#ffffff` (white) | `#151515` (darker gray) |

Dot size and spacing: `--dot-size: 2px`, `--dot-space: 20px` (in `body`).

---

## 2. Body text (default)

**Location:** `body`, `html.dark-mode body`

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Default text color for the whole site | `color` | `#333` | `#e5e5e5` |

---

## 3. Top navbar (home page – over hero)

**Location:** `.navbar-top:not(.on-white-page) .nav-container` and related

| What it controls | Property | Value |
|------------------|----------|--------|
| Nav bar background (transparent over hero) | `background-color` | `transparent` |
| Nav link text | `.navbar-top .tab-link` `color` | `rgba(255,255,255,0.8)` default, `#ffffff` hover |
| Fixed navbar link text (when scrolled) | `.navbar-fixed .tab-link` `color` | `#333` / `#000` hover |

---

## 4. Top navbar (inner pages – light bar)

**Location:** `.navbar-top.on-white-page .nav-container` and children

| What it controls | Property | Light mode |
|------------------|----------|------------|
| Nav bar background | `background-color` | `#f2f3f3` |
| Bar border | `border` | `1px solid rgba(0,0,0,0.1)` |
| Nav links, dark-mode icon, menu button text | `color` | `#000` |

---

## 5. Fixed navbar (scroll-down pill) – light mode

**Location:** `.navbar-fixed .nav-container` (and when not `html.dark-mode`)

| What it controls | Property | Value |
|------------------|----------|--------|
| Pill background (slightly transparent) | `background-color` | `rgba(242,243,243,0.95)` |
| Pill border | `border` | `1px solid rgba(0,0,0,0.12)` |
| Pill shadow | `box-shadow` | `0 2px 12px rgba(0,0,0,0.04)` |
| Nav links, icons | `color` | `#000` |

---

## 6. Fixed navbar (scroll-down pill) – dark mode

**Location:** `html.dark-mode .navbar-fixed .nav-container` and children

| What it controls | Property | Value |
|------------------|----------|--------|
| Pill background | `background-color` | `rgba(24,24,24,0.95)` |
| Pill border | `border-color` | `rgba(255,255,255,0.2)` |
| Nav links, icons | `color` | `rgba(255,255,255,0.9)` / `#fff` hover |

---

## 7. Dark mode toggle button (circle)

**Location:** `.dark-mode-toggle`, `.navbar-fixed .dark-mode-toggle`, `html.dark-mode .dark-mode-toggle`, etc.

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Icon color | `color` | `#000` (on white/light bar) | `rgba(255,255,255,0.9)` |
| Circle border | `border-color` | `rgba(0,0,0,0.2)` / `0.35` hover | `rgba(255,255,255,0.3)` / `0.5` hover |

On dark hero (home): `color` `rgba(255,255,255,0.85)`, `border` `rgba(255,255,255,0.35)`.

---

## 8. Search button (magnifying glass circle)

**Location:** `.nav-search-btn`, `.navbar-top.on-white-page .nav-search-btn`, `html.dark-mode .nav-search-btn`, etc.

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Icon color | `color` | `#000` | `rgba(255,255,255,0.9)` / `#fff` hover |
| Circle border | `border-color` | `rgba(0,0,0,0.2)` / `0.35` hover | `rgba(255,255,255,0.3)` / `0.5` hover |

---

## 9. Search bar (when open) – input and results panel

**Location:** `.nav-search-row`, `.nav-search-input`, `.nav-search-suggestion`, `.nav-search-close`, etc.

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Search row background | `background` | `rgba(255,255,255,0.88)` / `0.92` | `rgba(42,42,42,0.92)` |
| Input placeholder | `::placeholder` `color` | (inherited / black) | `rgba(255,255,255,0.5)` |
| Suggestion text | `color` | `#222` / `#666` | `#e5e5e5` / `rgba(255,255,255,0.55)` |
| Close (X) button | `background`, `color` | `rgba(255,255,255,0.88)`, `#000` | `rgba(42,42,42,0.92)`, `#fff` |

---

## 10. Main content area

**Location:** `.main-content`, `.content-wrapper`, `.content-wrapper h1`, `.content-wrapper p`

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Main content background | `background-color` | `transparent` | `transparent` |
| Content card background | `background-color` | `transparent` | `transparent` |
| Page title (h1) | `color` | `#222` | `#f0f0f0` |
| Body text in content | `color` | `#666` | `#c0c0c0` |

---

## 11. About page

**Location:** `.about-title`, `.about-text-box`, `.about-image-placeholder`, `.about-social-link`, etc.

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Section title | `color` | (inherited / #222) | `#f0f0f0` |
| Text in about box | `color` | `#666` | `#c0c0c0` |
| Image placeholder background | `background-color` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` |
| Image placeholder border | `border-color` | `rgba(0,0,0,0.15)` | `rgba(255,255,255,0.2)` |

---

## 12. Music / gallery (and Sports / Events panels)

**Location:** `.music-photo`, `.music-gallery`, `.music-lightbox-close`, etc. The same gallery and lightbox styles apply to the **Music**, **Portraiture**, **Design**, **Automotive**, **Sports**, and **Events** category panels on the Works page (`works.html`).

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Photo cell background (before load) | `background-color` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` |
| Photo image background | `background-color` | — | `rgba(255,255,255,0.04)` |
| Lightbox close button | `color` | `#fff` | — |

---

## 13. Image buttons section

**Location:** `.image-buttons-section`, `.image-button p`

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Section background | `background-color` | `transparent` | `transparent` |
| Button label text | `color` | `#333` | `#e5e5e5` |

---

## 14. Contact page / form

**Location:** `.contact-form label`, `.contact-form input`, `.contact-form textarea`, `.contact-form .contact-submit`, `.contact-form .required`

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Label text | `color` | `#222` | `#e0e0e0` |
| Required asterisk | `color` | `red` | `#ff8080` |
| Input/textarea background | `background-color` | `#fff` | `#1a1a1a` |
| Input/textarea text | `color` | `#333` | `#e5e5e5` |
| Input border | `border-color` | `rgba(0,0,0,0.2)` / focus `#333` | `rgba(255,255,255,0.2)` / focus `rgba(255,255,255,0.5)` |
| Submit button background | `background-color` | `#222` | `#e5e5e5` |
| Submit button text | `color` | `#fff` | `#111` |
| Submit hover background | `background-color` | `#000` | `#fff` |

---

## 15. Footer

**Location:** `.footer`, `.footer p`

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Footer background | `background-color` | `transparent` | `transparent` |
| Footer text | `color` | `#333` | `#a0a0a0` |

---

## 16. Mobile menu (full-screen overlay)

**Location:** `body.menu-open .navbar-top .nav-tabs`, `.nav-menu-close`, etc.

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Menu overlay background | `background` | `#ffffff` | `#242424` |
| Menu link text | `color` | (black) | `#e5e5e5` / `#fff` hover |
| Close (X) button | `color` | (black) | `#fff` |

---

## 17. Extra / “Everything” page

**Location:** `.extra-stack-item` (Everything page stack: Photography, Design, Drawings)

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| “Coming soon” text | `color` | (inherited) | `#e5e5e5` |

---

## 18. Works page (category buttons)

**Location:** `.works-category-buttons`, `.works-category-btn` (Music, Portraiture, Design, Automotive, Sports, Event, Index links on the right of `works.html`)

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| Category link text | `color` | `#222` | `#e5e5e5` |
| Category link hover | `color` | `#fff` | `#fff` |

The category panels (`.works-music-panel`, `.works-design-panel`, `.works-portraiture-panel`, `.works-automotive-panel`, `.works-sports-panel`, `.works-events-panel`) use visibility/opacity transitions only; no separate background or text colors. Gallery images inside them use the same styles as section 12.

---

## 19. Works Index page (Soon™)

**Location:** `works/index.html` — `.works-index-main`, `.works-index-soon` (centered "Soon™" text)

| What it controls | Property | Light mode | Dark mode |
|------------------|----------|------------|-----------|
| "Soon™" text | `color` | `#222` | `#e5e5e5` |

Font size: `4rem`, font weight: `700` (bold). The main area uses flexbox to center the text.

---

## Quick reference: main hex colors

| Color | Typical use |
|-------|---------------------|
| `#ffffff` | White (dots, icons, text on dark) |
| `#f2f3f3` | Light nav bar / off-white |
| `#e5e5e5` | Dark mode body text, inputs |
| `#d8d8d8` | Light mode dot grid background |
| `#c0c0c0` | Dark mode paragraph text |
| `#a0a0a0` | Dark mode footer text |
| `#666` | Light mode secondary text |
| `#333` | Light mode body/default text |
| `#242424` | Dark mode background, mobile menu |
| `#222` | Headings, form labels (light) |
| `#1a1a1a` | Dark inputs, dark search submit |
| `#151515` | Dark mode dot grid dots |
| `#000` / `#000000` | Black (text, borders, hover) |

All of these are in **styles.css**. Search for the hex code or the selector name to find the exact line.
