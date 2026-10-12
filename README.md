# Asad Ali Mulla — Portfolio

A static, responsive portfolio website for `asad.myoss.in`.

## Contents
- `index.html` — page structure, SEO metadata and Person structured data
- `assets/styles.css` — responsive design system and animations
- `assets/app.js` — project filtering, search, mobile navigation and reveal-on-scroll
- `projects.json` — editable project catalogue
- `robots.txt`, `sitemap.xml`, `_headers` — basic deployment and SEO/security configuration

## Preview locally
Because the site loads `projects.json` with `fetch`, use a local web server rather than opening `index.html` as a file.

With Python:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploy to Cloudflare Pages
1. Create a **new** GitHub repository named `asad-ali-mulla-portfolio` under `Asadxio`.
2. Upload the contents of this folder to the repository root (not the parent folder).
3. In Cloudflare Pages, create a project connected to this repository.
4. This is a static site: set the build command to blank / none and the output directory to `/` or the repository root, as the dashboard supports.
5. Verify the generated `*.pages.dev` deployment before connecting a custom domain.
6. In the Pages project, add custom domain `asad.myoss.in`. Follow the dashboard's DNS instructions and create only the specific `asad` subdomain record at Hostinger if requested.
7. Do **not** change root `myoss.in` records or the existing `pdf` record. Keep the PDF Toolbox Worker route intact.
8. Verify HTTPS, `https://asad.myoss.in/robots.txt`, and `https://asad.myoss.in/sitemap.xml`.

Cloudflare's custom-domain flow may require the zone to be active on Cloudflare. If that is not available, use the existing DNS provider's supported CNAME/target configuration based on Cloudflare's current instructions. Do not guess a target record.

## GitHub Pages alternative
This is a static site and can be hosted on GitHub Pages, but using the Cloudflare Pages custom-domain flow is the preferred option for the intended `asad.myoss.in` setup. Do not enable both custom-domain routes at once without a deliberate DNS plan.

## Before launch
- Review each project description and status.
- Confirm current professional experience, education, credentials and dates before adding a timeline.
- Confirm Google Drive resume sharing is public/viewable.
- Add real screenshots or project-specific visual assets where available.
- Add the public Power BI report URL if you want to display it.
- Check all links and test at mobile/tablet/desktop widths.
- Confirm that `asad.myoss.in` is available and not already used.
- Add analytics only if desired, with appropriate privacy controls.

## Accuracy notes
The catalogue includes public repositories and projects shared by Asad. Project descriptions are conservative, do not claim unverified metrics, and mark early-stage projects. The COVID-19 chest X-ray entry is explicitly research-only and is not presented as a clinically validated diagnostic tool.
