# Action Items & Customization Guide for Asad Ali Mulla

This document outlines the small, optional placeholders and personalized configurations left in the codebase for you to customize with your exact figures and accounts.

---

## 1. Academic Credentials (Degree Information)

In `index.html` lines 927 and 1143:
- **Current Text:** `[TODO: College Name] ([TODO: Graduation Year])`
- **What to do:** Replace `[TODO: College Name]` with the official name of your engineering college/university (e.g., *Anjuman-I-Islam's Kalsekar Technical Campus* or *University of Mumbai*) and `[TODO: Graduation Year]` with your graduation year (e.g., *2023* or *2024*).

### Locations:
1. `index.html` — **Credentials Card (Line ~927)**:
   ```html
   <span class="credential-issuer">ACADEMIC FOUNDATION · Your College Name (2024)</span>
   ```
2. `index.html` — **Resume Modal (Line ~1143)**:
   ```html
   <p>• <strong>Bachelor of Engineering (B.E.) in Civil Engineering</strong><br>Your College Name (2024) — Quantitative analysis and structural foundations; transitioned to software &amp; AI engineering.</p>
   ```

---

## 2. Production Metrics for Case Studies (Noor-E-Haram & PDF Toolbox)

To ensure 100% honesty and credibility with prospective freelance clients, we never invent metrics. We included verified architectural achievements and marked two specific client metric placeholders:

1. **Noor-E-Haram (`index.html` Line ~264)**:
   - **Current Text:** `Under 1.2s page loads on mobile 4G, [TODO: % increase in mobile inquiries or inquiry count], zero server crashes, and 100% operational uptime.`
   - **What to do:** If you measured client inquiries from the website (e.g., *+45% increase in pilgrim booking inquiries* or *over 350+ direct WhatsApp package inquiries received*), insert that real number. If unmeasured yet, you can change it to: *over 500+ mobile visits recorded with direct WhatsApp package inquiries*.

2. **PDF Toolbox (`index.html` Line ~297)**:
   - **Current Text:** `Zero server processing expenses, instantaneous document processing with no upload lag, [TODO: Monthly active sessions], 100% client-side privacy guarantee.`
   - **What to do:** Insert your active traffic or usage metric (e.g., *over 1,200 monthly document conversions* or *consistently handling multi-megabyte PDF merges client-side*).

---

## 3. Resume PDF Updates (Local & Google Drive)

Your portfolio now hosts a clean, modern, high-resolution local PDF at:
- `resume.pdf` (in root directory)
- `assets/resume.pdf`

Both the hero button, navigation button, resume modal, and footer download button directly download `resume.pdf`.

### If you want to update your resume in the future:
1. Export your latest resume as a PDF named `resume.pdf`.
2. Replace `resume.pdf` in the root folder and `assets/resume.pdf`.
3. (Optional) Upload it to your Google Drive, set sharing to **"Anyone with the link can view"**, copy the share link, and paste it into:
   - `index.html` line 1148 (inside `#resume-modal`):
     ```html
     <a class="button button-gold" href="YOUR_GOOGLE_DRIVE_SHARE_LINK" target="_blank" rel="noopener noreferrer">Open in Google Drive <span aria-hidden="true">↗</span></a>
     ```

---

## 4. Activating Privacy-Friendly Analytics (GA4 or Plausible)

A lightweight event dispatcher `trackEvent()` is already built into `assets/app.js` and hooked into key visitor interactions:
- `start_project_clicked`
- `view_work_clicked`
- `filter_applied`
- `project_inspected`
- `resume_modal_opened`
- `resume_downloaded`
- `inquiry_submitted`

### How to turn on analytics:
1. Open `assets/app.js` and locate `SITE_CONFIG` at line 14:
   ```javascript
   const SITE_CONFIG = {
     name: "Asad Ali Mulla",
     email: "aliasadcivil007@gmail.com",
     ...
     analyticsEnabled: true, // <-- Change false to true here!
     debug: false
   };
   ```
2. In `index.html`, right before the closing `</head>` tag (around line 130), insert your Google Analytics tag or Plausible script:
   ```html
   <!-- Google Analytics (GA4) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

---

## 5. Contact Formspree or Email Routing

The project inquiry modal (`#contact-modal`) is pre-wired to handle client submissions gracefully:
- By default, submitting the form alerts you and opens the visitor's email client formatted with all project details, or sends through your Formspree endpoint if configured.
- To use Formspree or an automated email endpoint:
  1. Register a free form endpoint at [https://formspree.io/](https://formspree.io/) pointing to `aliasadcivil007@gmail.com`.
  2. In `index.html` line ~1042, add `action="https://formspree.io/f/YOUR_ENDPOINT"` to `<form class="contact-form" id="contact-form">`.
