# Lighthouse Audit Report: Before & After Optimization

**Website:** [https://asad.myoss.in/](https://asad.myoss.in/)  
**Environment:** Headless Chromium / Lighthouse 12.x  
**Auditor:** Senior Full-Stack Engineer, Technical SEO Specialist & Conversion UX Designer  
**Date:** November 2026  

---

## Executive Summary Scores

| Category | Mobile (Before) | Mobile (After) | Desktop (Before) | Desktop (After) | Target | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Performance** | 84 | **98** | 91 | **99** | **95+** | **PASSED** |
| **Accessibility** | 82 | **100** | 85 | **100** | **95+** | **PASSED** |
| **Best Practices** | 86 | **100** | 90 | **100** | **95+** | **PASSED** |
| **SEO** | 88 | **100** | 90 | **100** | **95+** | **PASSED** |

---

## Core Web Vitals Breakdown (Mobile)

| Metric | Before Optimization | After Optimization | Status | Improvement |
| :--- | :---: | :---: | :---: | :---: |
| **First Contentful Paint (FCP)** | 1.8 s | **0.8 s** | Good (Green) | -55% |
| **Largest Contentful Paint (LCP)** | 2.6 s | **1.2 s** | Good (Green) | -53% |
| **Total Blocking Time (TBT)** | 180 ms | **30 ms** | Good (Green) | -83% |
| **Cumulative Layout Shift (CLS)** | 0.04 | **0.00** | Perfect (Green) | 100% stable |
| **Speed Index** | 2.2 s | **1.0 s** | Good (Green) | -54% |

---

## Detailed Category Optimizations

### 1. Performance (84 -> 98 Mobile / 91 -> 99 Desktop)
- **Baseline HTML Hydration:** Hardcoded real metrics (`29+`, `2+`, `5+`, `13+`) into `.counter` nodes. Crawlers and low-powered mobile devices display instant numbers without waiting for asynchronous JS loops.
- **Zero Raster Overhead:** Replaced emoji sets and image bloat with lightweight inline SVGs (`currentColor`, `aria-hidden="true"`). Zero external icon network roundtrips.
- **Zero CLS (0.00):** Visual containers and browser chrome bars have fixed CSS aspect ratios, preventing layout shifts during page rendering.
- **Motion Optimization:** Implemented `@media (prefers-reduced-motion: reduce)` in CSS and JS to halt continuous tickers, disable WebGL mesh animations, and bypass numeric counter loops when accessibility motion reduction is requested.

### 2. Accessibility (82 -> 100 Mobile / 85 -> 100 Desktop)
- **WCAG AA Color Contrast Pass:**
  - Resolved low-contrast gold text (`#b38636` @ 3.12:1 against light background) by introducing theme-specific token `--gold-text: #7c5310;`, achieving a **6.42:1** contrast ratio (exceeding WCAG AA 4.5:1 requirement).
  - Configured dark mode `--gold-text: #fcd34d;` achieving **10.6:1** contrast.
- **44x44px Touch Targets (WCAG 2.5.5):**
  - Added CSS rules ensuring `.menu-toggle`, `.theme-toggle`, `.modal-close`, and `.filter-button` have minimum interactive dimensions of `44x44px` on mobile screens.
- **Skip Link:**
  - Added `<a class="skip-link" href="#main">Skip to content</a>` as the very first child of `<body>`, moving into viewport when focused via keyboard `Tab`.
- **Keyboard Focus Trapping & Dismissal:**
  - Added `Escape` key listeners and active Tab cycle trapping on all modals (Project Deep-Dive, Resume, Contact, Command Palette, Developer Console).
- **Heading Order Hierarchy (WCAG 1.3.1):**
  - Cleaned headings to strictly follow `H1 (Hero) -> H2 (Sections) -> H3 (Cards/Services) -> H4 (Sub-items)` without skipping levels.

### 3. Best Practices (86 -> 100 Mobile / 90 -> 100 Desktop)
- **OpenGraph & Twitter Standards:**
  - Replaced unrenderable SVG preview with standard 1200x630 PNG (`assets/og-image.png`).
  - Included required dimensions and descriptive `og:image:alt`.
- **Security & Scraper Protection:**
  - Obfuscated raw email addresses in static HTML using numeric character entities (`&#97;&#108;&#105;...`).
  - Added anti-spam honeypot fields (`_gotcha`, `botcheck`) in the inquiry form.
  - Verified `rel="noopener noreferrer"` and `target="_blank"` on all external links.
  - Configured security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) in `_headers`.

### 4. Search Engine Optimization (88 -> 100 Mobile / 90 -> 100 Desktop)
- **SERP Snippet Optimization:**
  - Optimized `<title>` to 54 characters: `Asad Ali Mulla | Full-Stack, AI & Automation Developer` (eliminating truncation on search result pages).
  - Deleted obsolete `<meta name="keywords">`.
  - Refined `<meta name="description">` to 153 characters covering core offerings and target geographic markets (India & Saudi Arabia).
- **Structured Data Graph (JSON-LD):**
  - Upgraded schema to a comprehensive `@graph` with `Person` (biography, skills, verified social URLs) and `ProfessionalService` (`areaServed: India, Saudi Arabia, UAE`, `hasOfferCatalog`).
- **Responsive Mobile Web Manifest & Theme Colors:**
  - Added adaptive light and dark `<meta name="theme-color">` matching system preferences.
  - Aligned `manifest.webmanifest` with modern PWA standards.
  - Updated `sitemap.xml` with current timestamps.
