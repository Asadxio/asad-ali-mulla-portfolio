/**
 * Asad Ali Mulla — Ultra-Premium 3D Portfolio
 * Features:
 *  - Three.js Interactive 3D WebGL Neural Mesh
 *  - 3D Parallax Tilt Cards with Dynamic Cursor Glare
 *  - Cyber Obsidian Dark / Ivory Light Mode Switcher
 *  - Interactive Project Deep-Dive Modal
 *  - Interactive Developer CLI Terminal Widget
 *  - Fluid Magnetic Cursor (Desktop)
 *  - Live Animated Metrics Counters
 *  - Hacker Text Scramble Effect
 */

const categories = ["All work", "Digital Products", "Data & BI", "Machine Learning", "Computer Vision", "AI & Software", "Other Work", "Research & Concepts"];
let projects = [];
let activeCategory = "All work";

const projectGrid = document.querySelector("#project-grid");
const featuredGrid = document.querySelector("#featured-grid");
const filterBar = document.querySelector("#filter-bar");
const searchInput = document.querySelector("#project-search");
const emptyState = document.querySelector("#empty-state");
const projectCount = document.querySelector("#project-count");

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function visualClass(i) {
  return `v-${(i % 6) + 1}`;
}

/* ==========================================================================
   Executive Notifications & Status Toast System
   ========================================================================== */
function playUiSound() {
  // Silent execution for executive enterprise design
}

function showToast(message, icon = "✓") {
  const container = document.querySelector("#toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span aria-hidden="true">${escapeHTML(icon)}</span><span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 260);
  }, 2600);
}


/* ==========================================================================
   1. Theme Management (Light Ivory <-> Obsidian Dark)
   ========================================================================== */
let threeMaterials = [];

function initTheme() {
  const themeToggle = document.querySelector("#theme-toggle");
  const savedTheme = localStorage.getItem("asad_portfolio_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("asad_portfolio_theme", next);
      playUiSound("theme");
      showToast(next === "dark" ? "Cyber Obsidian dark mode 🌙" : "Ivory light mode ☀️");
    });
  }
}

function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  updateThreeColors(theme === "dark");
}

function updateThreeColors(isDark) {
  if (!threeMaterials || threeMaterials.length === 0) return;
  const wireColor = isDark ? 0xe5b869 : 0xc6a15b;
  const particleColor = isDark ? 0x34d399 : 0x10b981;
  const neuralColor = isDark ? 0xe5b869 : 0x10b981;
  if (threeMaterials[0]) threeMaterials[0].color.setHex(wireColor);
  if (threeMaterials[1]) threeMaterials[1].color.setHex(particleColor);
  if (threeMaterials[2]) threeMaterials[2].color.setHex(neuralColor);
}

/* ==========================================================================
   2. Three.js 3D WebGL Neural Mesh in Hero
   ========================================================================== */
function initThreeHero() {
  const canvas = document.querySelector("#hero-3d-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const width = canvas.clientWidth || 500;
  const height = canvas.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 7.5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  // Group container for smooth rotation
  const group = new THREE.Group();
  scene.add(group);

  // 1. Geodesic Icosahedron Wireframe
  const geoIcosa = new THREE.IcosahedronGeometry(2.35, 1);
  const wireGeo = new THREE.WireframeGeometry(geoIcosa);
  const wireMat = new THREE.LineBasicMaterial({
    color: isDark ? 0xe5b869 : 0xc6a15b,
    transparent: true,
    opacity: 0.38,
    linewidth: 1
  });
  const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
  group.add(wireMesh);

  // 2. Outer Gyroscope Rings
  const ringGeo = new THREE.TorusGeometry(3.05, 0.02, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x34d399 : 0x0b3d2e,
    transparent: true,
    opacity: 0.28
  });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.y = Math.PI / 3;
  ring2.rotation.z = Math.PI / 4;
  group.add(ring2);

  // 3. Floating Neural Particle Constellation
  const particleCount = 700;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Generate particles on an orbital spherical shell
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const radius = 2.4 + Math.random() * 0.9;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    scales[i] = Math.random();
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: isDark ? 0x34d399 : 0x10b981,
    size: 0.08,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  group.add(particleSystem);

  // 4. Dynamic Synaptic Neural Network Line Graph
  const nodeCount = 45;
  const nodePoints = [];
  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 2.1 + Math.random() * 0.9;
    nodePoints.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ));
  }

  const lineCoords = [];
  const maxDist = 1.35;
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (nodePoints[i].distanceTo(nodePoints[j]) < maxDist) {
        lineCoords.push(
          nodePoints[i].x, nodePoints[i].y, nodePoints[i].z,
          nodePoints[j].x, nodePoints[j].y, nodePoints[j].z
        );
      }
    }
  }

  const neuralLineGeo = new THREE.BufferGeometry();
  neuralLineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineCoords, 3));
  const neuralLineMat = new THREE.LineBasicMaterial({
    color: isDark ? 0xe5b869 : 0x10b981,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  const neuralWeb = new THREE.LineSegments(neuralLineGeo, neuralLineMat);
  group.add(neuralWeb);

  threeMaterials = [wireMat, particleMat, neuralLineMat];

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
    mouseY = (e.clientY - centerY) / (window.innerHeight / 2);
    targetRotationY = mouseX * 0.8;
    targetRotationX = mouseY * 0.8;
  }, { passive: true });

  // Interactive 3D shockwave on canvas click
  let shockwaveScale = 1;
  let isShockwave = false;

  canvas.addEventListener("click", () => {
    isShockwave = true;
    shockwaveScale = 1.35;
    playUiSound("open");
    showToast("Neural mesh shockwave triggered 🌐");
  });

  // Animation Loop with Visibility & Intersection Observer Optimization
  let clock = new THREE.Clock();
  let isCanvasVisible = true;
  let animId = null;

  function animate() {
    if (!isCanvasVisible || document.hidden) {
      animId = null;
      return;
    }
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Constant smooth rotation + mouse lerp
    group.rotation.y += 0.0035;
    group.rotation.x += 0.0018;

    group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
    group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

    ring1.rotation.z = elapsed * 0.15;
    ring2.rotation.x = elapsed * -0.12;

    wireMesh.rotation.y = elapsed * 0.04;
    neuralWeb.rotation.y = elapsed * -0.025;
    neuralWeb.rotation.z = elapsed * 0.018;

    // Shockwave pulse decay
    if (isShockwave) {
      group.scale.setScalar(shockwaveScale);
      shockwaveScale += (1.0 - shockwaveScale) * 0.08;
      if (Math.abs(shockwaveScale - 1.0) < 0.004) {
        group.scale.setScalar(1.0);
        isShockwave = false;
      }
    }

    renderer.render(scene, camera);
  }

  function startAnimation() {
    if (!animId && isCanvasVisible && !document.hidden) {
      animate();
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          startAnimation();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && isCanvasVisible) {
      startAnimation();
    }
  });

  startAnimation();

  // Resize handler with aspect ratio correction
  window.addEventListener("resize", () => {
    const newWidth = canvas.clientWidth || 500;
    const newHeight = canvas.clientHeight || 500;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

/* ==========================================================================
   3. 3D Tilt Cards with Dynamic Cursor Glare
   ========================================================================== */
function applyCardTiltEffect() {
  const cards = document.querySelectorAll(".project-card");
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

function projectCard(p, i, featured = false) {
  const link = p.url
    ? `<a class="project-link" href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer">${p.repo ? "View repository" : p.status === "Live" ? "Visit live project" : "Explore project"} <span aria-hidden="true">↗</span></a>`
    : `<span class="project-link archived">Internal / Archive</span>`;
  const tags = p.tags.slice(0, 4).map(t => `<span>${escapeHTML(t)}</span>`).join("");

  return `
    <article class="project-card ${featured ? "featured-large" : ""}" data-index="${i}">
      <div class="card-glare" aria-hidden="true"></div>
      <div class="project-visual ${visualClass(i)}">
        <div class="card-browser-bar" aria-hidden="true">
          <span class="browser-dot dot-r"></span>
          <span class="browser-dot dot-y"></span>
          <span class="browser-dot dot-g"></span>
          <span class="browser-address">${p.url ? escapeHTML(p.url.replace("https://", "").replace(/\/$/, "")) : "asad.myoss.in"}</span>
        </div>
        <span class="visual-index">${String(i + 1).padStart(2, "0")} / PORTFOLIO</span>
        <div class="visual-word">${escapeHTML(p.title.replace(" Classification", "").replace(" Projects", ""))}</div>
      </div>
      <div class="project-content">
        <div class="project-meta">
          <span class="project-category">${escapeHTML(p.category)}</span>
          <span class="status-pill">${escapeHTML(p.status)}</span>
        </div>
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.description)}</p>
        <div class="tag-list">${tags}</div>
        <div class="project-actions">
          ${link}
          <button type="button" class="project-details-btn" data-index="${i}" aria-label="View details for ${escapeHTML(p.title)}">View details <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>`;
}

function attachCardClickListeners() {
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // If user clicked directly on an interactive element, let it handle its own event
      if (e.target.closest("a, button")) return;
      const index = parseInt(card.dataset.index, 10);
      if (!isNaN(index) && projects[index]) {
        openProjectModal(projects[index]);
      }
    });
  });

  document.querySelectorAll(".project-details-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index, 10);
      if (!isNaN(index) && projects[index]) {
        openProjectModal(projects[index]);
      }
    });
  });

  applyCardTiltEffect();
  initBentoSpotlight();
}

function renderFilters() {
  filterBar.innerHTML = categories.map(c => `
    <button class="filter-button" type="button" data-category="${escapeHTML(c)}" aria-pressed="${c === activeCategory}">
      ${escapeHTML(c)}
    </button>`).join("");

  filterBar.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category;
    renderFilters();
    renderArchive();
  }));
}

function filteredProjects() {
  const q = searchInput.value.trim().toLowerCase();
  return projects.filter(p =>
    (activeCategory === "All work" || p.category === activeCategory) &&
    (!q || [p.title, p.description, p.category, p.status, ...p.tags].join(" ").toLowerCase().includes(q))
  );
}

function renderArchive() {
  const list = filteredProjects();
  projectCount.textContent = list.length;
  projectGrid.innerHTML = list.map(p => projectCard(p, projects.indexOf(p))).join("");
  emptyState.hidden = list.length !== 0;
  attachCardClickListeners();
}

function renderFeatured() {
  const featured = projects.filter(p => p.featured).slice(0, 4);
  featuredGrid.innerHTML = featured.map(p => projectCard(p, projects.indexOf(p), true)).join("");
  attachCardClickListeners();
}

/* ==========================================================================
   4. Interactive Project Deep-Dive Modal
   ========================================================================== */
const projectModal = document.querySelector("#project-modal");
const modalClose = document.querySelector("#modal-close");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modalCategory = document.querySelector("#modal-category");
const modalStatus = document.querySelector("#modal-status");
const modalTitle = document.querySelector("#modal-title");
const modalDesc = document.querySelector("#modal-desc");
const modalStageNote = document.querySelector("#modal-stage-note");
const modalTags = document.querySelector("#modal-tags");
const modalLiveLink = document.querySelector("#modal-live-link");
const modalRepoLink = document.querySelector("#modal-repo-link");
const modalCopyBtn = document.querySelector("#modal-copy-btn");

let previouslyFocusedElement = null;

function openProjectModal(p) {
  if (!projectModal) return;
  previouslyFocusedElement = document.activeElement;

  modalCategory.textContent = p.category || "Project";
  modalStatus.textContent = p.status || "Completed";
  modalTitle.textContent = p.title || "Project Overview";
  modalDesc.textContent = p.description || "";
  modalStageNote.textContent = p.stageNote || "Verified portfolio repository artifact.";

  modalTags.innerHTML = (p.tags || []).map(t => `<span>${escapeHTML(t)}</span>`).join("");

  if (p.url) {
    modalLiveLink.style.display = "inline-flex";
    modalLiveLink.href = p.url;
    modalLiveLink.innerHTML = `${p.repo ? "View Repository" : "Visit Live Project"} <span aria-hidden="true">↗</span>`;
  } else {
    modalLiveLink.style.display = "none";
  }

  if (p.repo) {
    modalRepoLink.style.display = "inline-flex";
    modalRepoLink.href = p.repo;
  } else {
    modalRepoLink.style.display = "inline-flex";
    modalRepoLink.href = "https://github.com/Asadxio";
    modalRepoLink.innerHTML = 'Explore GitHub <span aria-hidden="true">↗</span>';
  }

  modalCopyBtn.onclick = () => {
    const urlToCopy = p.url || window.location.href;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      const orig = modalCopyBtn.innerHTML;
      modalCopyBtn.innerHTML = 'Copied! <span aria-hidden="true">✓</span>';
      setTimeout(() => { modalCopyBtn.innerHTML = orig; }, 1800);
    });
  };

  const modalInquireBtn = document.querySelector("#modal-inquire-btn");
  if (modalInquireBtn) {
    modalInquireBtn.onclick = () => {
      const title = p.title || "Project";
      closeProjectModal();
      openContactModal();
      const purposeSelect = document.querySelector("#contact-purpose");
      if (purposeSelect) purposeSelect.value = "Freelance Project";
      const msgArea = document.querySelector("#contact-message");
      if (msgArea) {
        msgArea.value = `Hi Asad, I explored your project "${title}" in your portfolio and would like to discuss...`;
        setTimeout(() => msgArea.focus(), 120);
      }
    };
  }

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (modalClose) {
    modalClose.focus();
  }
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
    previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  }
}

if (modalClose) modalClose.addEventListener("click", closeProjectModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);
window.addEventListener("keydown", (e) => {
  if (!projectModal || !projectModal.classList.contains("is-open")) return;
  if (e.key === "Escape") {
    closeProjectModal();
    return;
  }
  if (e.key === "Tab") {
    const focusable = projectModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

/* ==========================================================================
   5. Animated Stat Counters
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateNumber(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quad
            const ease = 1 - (1 - progress) * (1 - progress);
            const val = Math.floor(ease * target);
            counter.textContent = val;
            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              counter.textContent = target;
            }
          }
          requestAnimationFrame(updateNumber);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. Interactive Developer CLI Terminal Widget
   ========================================================================== */
function initTerminal() {
  const launcher = document.querySelector("#terminal-launcher");
  const widget = document.querySelector("#terminal-widget");
  const closeBtn = document.querySelector("#t-exit-btn");
  const redDot = document.querySelector("#t-close");
  const yellowDot = document.querySelector("#t-clear");
  const greenDot = document.querySelector("#t-expand");
  const input = document.querySelector("#terminal-input");
  const output = document.querySelector("#terminal-output");

  if (!launcher || !widget || !input || !output) return;

  let terminalPreviousFocus = null;

  function toggleTerminal() {
    const isOpen = widget.classList.toggle("is-open");
    widget.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      terminalPreviousFocus = document.activeElement;
      setTimeout(() => input.focus(), 150);
    } else {
      if (terminalPreviousFocus && typeof terminalPreviousFocus.focus === "function") {
        terminalPreviousFocus.focus();
        terminalPreviousFocus = null;
      }
    }
  }

  launcher.addEventListener("click", toggleTerminal);
  if (closeBtn) closeBtn.addEventListener("click", toggleTerminal);
  if (redDot) redDot.addEventListener("click", toggleTerminal);
  if (yellowDot) yellowDot.addEventListener("click", () => {
    output.innerHTML = `<p class="t-dim">Terminal cleared. Type <span class="t-hl">'help'</span> for commands.</p>`;
  });
  if (greenDot) greenDot.addEventListener("click", () => {
    widget.style.width = widget.style.width === "90vw" ? "" : "90vw";
  });

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: () => `
Systems & Architecture Console — Available Commands:
  • <span class="t-hl">status</span>        — Production system health and pipeline verification
  • <span class="t-hl">overview</span>      — Executive profile & technical focus
  • <span class="t-hl">architecture</span>  — Engineering stack and deployment tools
  • <span class="t-hl">skills</span>        — Core technical specializations
  • <span class="t-hl">projects</span>      — Verified project directories and links
  • <span class="t-hl">credentials</span>   — Verified certifications and tracks
  • <span class="t-hl">contact</span>       — Executive communication channels
  • <span class="t-hl">email</span>         — Direct email address & inquiry details
  • <span class="t-hl">resume</span>        — Verified credentials document (PDF)
  • <span class="t-hl">theme</span>         — Toggle display mode (dark/light)
  • <span class="t-hl">clear</span>         — Clear terminal output buffer
  • <span class="t-hl">exit</span>          — Close console window`,

    status: () => `
SYSTEM HEALTH & ARCHITECTURE STATUS:
  • Host:           asad.myoss.in (Production SSL Verified)
  • Pipelines:      Online (Data Analytics, ML Inference, Vision OCR)
  • Repositories:   Public & Verified on GitHub (@Asadxio)
  • Uptime:         100% (GitHub Enterprise CDN / Cloudflare)
  • Availability:   Open for Technical Engagements & High-Impact Roles`,

    architecture: () => `
TECHNICAL ARCHITECTURE & TOOLING:
  • Core Stack:     Python 3.11, SQL, Power BI, Pandas, NumPy, Scikit-Learn
  • Applied AI:     TensorFlow, CNN Computer Vision, OCR Pipelines, FastAPI
  • Web & Systems:  React Native / Expo, Cloudflare Workers, Firebase, HTML5/CSS3
  • Reliability:    Playwright Automation, Continuous Integration, Technical SEO`,

    overview: () => `
Asad Ali Mulla — Data Analytics, Machine Learning & Digital Products.
Focus: Designing robust data systems, machine learning pipelines, and performant web products that solve measurable real-world problems.`,

    about: () => `
Asad Ali Mulla — Data Analytics, Machine Learning & Digital Products.
Focus: Designing robust data systems, machine learning pipelines, and performant web products that solve measurable real-world problems.`,

    skills: () => `
CORE COMPETENCY TRACKS:
  [DATA & BI]        Python, SQL, Power BI, Pandas, NumPy, Jupyter, ETL Modeling
  [ML & VISION]      Scikit-learn, CNN, TensorFlow, Computer Vision, OCR
  [FULL STACK]       FastAPI, React Native, Firebase, Cloudflare, HTML5/CSS3/JS
  [AUTOMATION & SEO] Playwright, Technical SEO, CI/CD, Enterprise Automation`,

    projects: () => `
Selected Highlights:
  1. NOOR-E-HARAM      — <a class="t-link" href="https://nooreharam.com/" target="_blank">https://nooreharam.com/</a>
  2. PDF Toolbox       — <a class="t-link" href="https://pdf.myoss.in/" target="_blank">https://pdf.myoss.in/</a>
  3. GitHub Profile    — <a class="t-link" href="https://github.com/Asadxio" target="_blank">https://github.com/Asadxio</a>
Total projects in archive: 24`,

    credentials: () => `
VERIFIED CREDENTIALS & SPECIALIZATIONS:
  • Generative AI & LLMs       — RAG Architecture, Vector Embeddings & Prompt Systems
  • Machine Learning & Vision  — CNN Classification, Computer Vision & OCR
  • Advanced SQL & Analytics   — Enterprise Warehousing, ETL Pipelines & Power BI Dashboards
  • Applied Engineering        — Production Web Systems, Cloudflare, Firebase & Python`,

    contact: () => `
Executive Channels:
  • Primary Email: aliasadcivil007@gmail.com
  • LinkedIn:  <a class="t-link" href="https://www.linkedin.com/in/asad-ali-mulla-044240262/" target="_blank">linkedin.com/in/asad-ali-mulla-044240262/</a>
  • GitHub:    <a class="t-link" href="https://github.com/Asadxio" target="_blank">github.com/Asadxio</a>
  • X/Twitter: <a class="t-link" href="https://twitter.com/AsadXio" target="_blank">@AsadXio</a>
  • Kaggle:    <a class="t-link" href="https://www.kaggle.com/asadxio" target="_blank">kaggle.com/asadxio</a>`,

    email: () => `
DIRECT INQUIRIES & CONTACT:
  • Primary Email:  aliasadcivil007@gmail.com
  • Turnaround:     Direct response within 24 hours
  • Location:       India · Available for Saudi Arabia & Remote Global Engagements
  • Direct Link:    <a class="t-link" href="mailto:aliasadcivil007@gmail.com">Launch Mail Client ↗</a>`,

    resume: () => {
      window.open("https://drive.google.com/file/d/1mB_SIPnnv3y_hB-CiimIU7OT_vVpUtuk/view?usp=sharing", "_blank");
      return "Opening credentials document in new window...";
    },

    theme: () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("asad_portfolio_theme", next);
      return `Theme switched to ${next} mode.`;
    },

    date: () => new Date().toUTCString(),

    sudo: () => "Permission denied: Root administrative privileges restricted to primary operator.",

    clear: () => {
      output.innerHTML = "";
      return "";
    },

    exit: () => {
      toggleTerminal();
      return "Session closed.";
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const raw = input.value.trim();
      input.value = "";
      if (!raw) return;

      history.push(raw);
      historyIdx = history.length;

      const cmd = raw.toLowerCase().split(" ")[0];
      const cmdRow = document.createElement("div");
      cmdRow.className = "t-command";
      cmdRow.innerHTML = `asad.myoss.in [prod] &gt; ${escapeHTML(raw)}`;
      output.appendChild(cmdRow);

      const respRow = document.createElement("div");
      respRow.className = "t-response";

      if (commands[cmd]) {
        const res = commands[cmd]();
        if (res) respRow.innerHTML = res;
      } else {
        respRow.innerHTML = `command not recognized: ${escapeHTML(cmd)}. Type <span class="t-hl">'help'</span> for list of commands.`;
      }

      output.appendChild(respRow);
      output.scrollTop = output.scrollHeight;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = "";
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("is-open")) {
      toggleTerminal();
    }
  });
}

/* ==========================================================================
   9. Spotlight Command Palette (Ctrl+K / Cmd+K)
   ========================================================================== */
function initCommandPalette() {
  const palette = document.querySelector("#cmd-palette");
  const trigger = document.querySelector("#cmd-k-trigger");
  const input = document.querySelector("#cmd-input");
  const results = document.querySelector("#cmd-results");
  if (!palette || !input || !results) return;

  let selectedIdx = 0;
  let currentItems = [];
  let palettePreviousFocus = null;

  function openPalette() {
    palettePreviousFocus = document.activeElement;
    palette.classList.add("is-open");
    palette.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    input.value = "";
    renderCommandList("");
    playUiSound("open");
    setTimeout(() => input.focus(), 60);
  }

  function closePalette() {
    palette.classList.remove("is-open");
    palette.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    playUiSound("close");
    if (palettePreviousFocus && typeof palettePreviousFocus.focus === "function") {
      palettePreviousFocus.focus();
      palettePreviousFocus = null;
    }
  }

  if (trigger) trigger.addEventListener("click", openPalette);
  palette.addEventListener("click", (e) => {
    if (e.target === palette) closePalette();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (palette.classList.contains("is-open")) closePalette();
      else openPalette();
    } else if (e.key === "/" && !palette.classList.contains("is-open")) {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        openPalette();
      }
    } else if (e.key === "Escape" && palette.classList.contains("is-open")) {
      closePalette();
    }
  });

  function getCommandCatalog() {
    const defaultActions = [
      { type: "action", icon: "◐", title: "Toggle Theme (Dark / Light)", hint: "Appearance", action: () => { document.querySelector("#theme-toggle")?.click(); } },
      { type: "action", icon: "⤓", title: "Direct Download Resume PDF (1-Click)", hint: "Resume", action: () => { window.open("https://drive.google.com/uc?export=download&id=1mB_SIPnnv3y_hB-CiimIU7OT_vVpUtuk", "_blank"); showToast("Downloading Asad Ali Mulla Resume ⤓"); } },
      { type: "action", icon: "✉", title: "Send Direct Message to Asad", hint: "Contact", action: () => { openContactModal(); } },
      { type: "action", icon: "✉", title: "Copy Email: aliasadcivil007@gmail.com", hint: "Contact", action: () => { navigator.clipboard.writeText("aliasadcivil007@gmail.com").then(() => showToast("Copied aliasadcivil007@gmail.com to clipboard ✓")); } },
      { type: "action", icon: "📄", title: "View Resume (Curriculum Vitae)", hint: "Credentials", action: () => { openResumeModal(); } },
      { type: "action", icon: ">_", title: "Open Systems & Architecture Console", hint: "Console", action: () => { document.querySelector("#terminal-launcher")?.click(); } },
      { type: "action", icon: "↗", title: "Copy Portfolio URL", hint: "Share", action: () => { navigator.clipboard.writeText("https://asad.myoss.in/").then(() => showToast("Portfolio URL copied to clipboard ✓")); } }
    ];

    const navItems = [
      { type: "nav", icon: "§", title: "Selected Work Archive", hint: "Section", action: () => { document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" }); } },
      { type: "nav", icon: "§", title: "About Asad Ali Mulla", hint: "Section", action: () => { document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" }); } },
      { type: "nav", icon: "§", title: "Areas of Focus (Expertise)", hint: "Section", action: () => { document.querySelector("#expertise")?.scrollIntoView({ behavior: "smooth" }); } },
      { type: "nav", icon: "§", title: "Credentials & Background", hint: "Section", action: () => { document.querySelector("#credentials")?.scrollIntoView({ behavior: "smooth" }); } },
      { type: "nav", icon: "§", title: "Connect & Socials", hint: "Section", action: () => { document.querySelector("#connect")?.scrollIntoView({ behavior: "smooth" }); } }
    ];

    const skills = [
      "Python", "SQL", "Power BI", "Machine Learning", "Computer Vision",
      "FastAPI", "React Native", "Firebase", "Cloudflare", "Playwright", "Technical SEO"
    ].map(s => ({
      type: "skill",
      icon: "◆",
      title: `Filter projects by: ${s}`,
      hint: "Specialization",
      action: () => {
        searchInput.value = s;
        renderArchive();
        document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
      }
    }));

    const projectItems = projects.map(p => ({
      type: "project",
      icon: "◈",
      title: p.title,
      hint: `${p.category} · ${p.status}`,
      action: () => { openProjectModal(p); }
    }));

    return { defaultActions, navItems, skills, projectItems };
  }

  function renderCommandList(query) {
    const q = query.trim().toLowerCase();
    const catalog = getCommandCatalog();
    const filtered = [];

    if (!q) {
      filtered.push({ group: "Quick Actions", items: catalog.defaultActions });
      filtered.push({ group: "Navigation", items: catalog.navItems });
      filtered.push({ group: "Featured Work", items: catalog.projectItems.slice(0, 4) });
    } else {
      const matchFilter = item => item.title.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q);
      const mActions = catalog.defaultActions.filter(matchFilter);
      const mProjects = catalog.projectItems.filter(matchFilter);
      const mSkills = catalog.skills.filter(matchFilter);
      const mNav = catalog.navItems.filter(matchFilter);

      if (mActions.length) filtered.push({ group: "Quick Actions", items: mActions });
      if (mProjects.length) filtered.push({ group: "Projects", items: mProjects });
      if (mSkills.length) filtered.push({ group: "Skills & Tools", items: mSkills });
      if (mNav.length) filtered.push({ group: "Navigation", items: mNav });
    }

    currentItems = [];
    filtered.forEach(g => g.items.forEach(it => currentItems.push(it)));
    selectedIdx = 0;

    if (!currentItems.length) {
      results.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--muted); font-size: var(--text-sm);">No commands or projects match "${escapeHTML(query)}".</div>`;
      return;
    }

    let flatIdx = 0;
    results.innerHTML = filtered.map(g => `
      <div class="cmd-group-title">${escapeHTML(g.group)}</div>
      ${g.items.map(it => {
        const idx = flatIdx++;
        return `
          <div class="cmd-item ${idx === selectedIdx ? "is-selected" : ""}" data-idx="${idx}" role="option">
            <div class="cmd-item-left">
              <span class="cmd-item-icon" aria-hidden="true">${escapeHTML(it.icon)}</span>
              <span>${escapeHTML(it.title)}</span>
            </div>
            <span class="cmd-item-hint">${escapeHTML(it.hint)}</span>
          </div>
        `;
      }).join("")}
    `).join("");

    results.querySelectorAll(".cmd-item").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.idx, 10);
        if (currentItems[idx]) {
          closePalette();
          currentItems[idx].action();
          playUiSound("click");
        }
      });
      el.addEventListener("mouseenter", () => {
        results.querySelectorAll(".cmd-item").forEach(i => i.classList.remove("is-selected"));
        el.classList.add("is-selected");
        selectedIdx = parseInt(el.dataset.idx, 10);
      });
    });
  }

  input.addEventListener("input", (e) => {
    renderCommandList(e.target.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (selectedIdx < currentItems.length - 1) {
        selectedIdx++;
        updateSelection();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedIdx > 0) {
        selectedIdx--;
        updateSelection();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentItems[selectedIdx]) {
        closePalette();
        currentItems[selectedIdx].action();
        playUiSound("click");
      }
    }
  });

  function updateSelection() {
    const items = results.querySelectorAll(".cmd-item");
    items.forEach((item, idx) => {
      if (idx === selectedIdx) {
        item.classList.add("is-selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("is-selected");
      }
    });
  }
}

/* ==========================================================================
   10. Direct Contact Modal & In-Page Resume Modal
   ========================================================================== */
const contactModal = document.querySelector("#contact-modal");
const contactClose = document.querySelector("#contact-close");
const contactBackdrop = document.querySelector("#contact-backdrop");
const contactForm = document.querySelector("#contact-form");
const contactSuccess = document.querySelector("#contact-success");
let contactPreviousFocus = null;

function openContactModal() {
  if (!contactModal) return;
  contactPreviousFocus = document.activeElement;
  contactModal.classList.add("is-open");
  contactModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  playUiSound("open");
  const nameInput = document.querySelector("#contact-name");
  if (nameInput) setTimeout(() => nameInput.focus(), 60);
  else if (contactClose) contactClose.focus();
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove("is-open");
  contactModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  playUiSound("close");
  if (contactPreviousFocus && typeof contactPreviousFocus.focus === "function") {
    contactPreviousFocus.focus();
    contactPreviousFocus = null;
  }
}

function initContactModal() {
  if (contactClose) contactClose.addEventListener("click", closeContactModal);
  if (contactBackdrop) contactBackdrop.addEventListener("click", closeContactModal);

  const heroBtn = document.querySelector("#hero-contact-btn");
  if (heroBtn) heroBtn.addEventListener("click", openContactModal);

  const connBtn = document.querySelector("#connect-modal-btn");
  if (connBtn) connBtn.addEventListener("click", openContactModal);

  const modalCopyEmailBtn = document.querySelector("#modal-copy-email-btn");
  if (modalCopyEmailBtn) {
    modalCopyEmailBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("aliasadcivil007@gmail.com").then(() => {
        showToast("Email address copied to clipboard ✓");
        modalCopyEmailBtn.innerHTML = 'Copied! <span aria-hidden="true">✓</span>';
        setTimeout(() => { modalCopyEmailBtn.innerHTML = 'Copy <span aria-hidden="true">⎘</span>'; }, 1800);
      });
    });
  }

  const mailtoBtn = document.querySelector("#contact-mailto-btn");
  function updateMailto() {
    if (!mailtoBtn) return;
    const name = document.querySelector("#contact-name")?.value.trim() || "Visitor";
    const purpose = document.querySelector("#contact-purpose")?.value || "General Connect";
    const message = document.querySelector("#contact-message")?.value.trim() || "";
    const subject = `[Portfolio] ${purpose} from ${name}`;
    const body = `Name: ${name}\nPurpose: ${purpose}\n\nMessage:\n${message}`;
    mailtoBtn.href = `mailto:aliasadcivil007@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  if (contactForm) {
    contactForm.addEventListener("input", updateMailto);
    updateMailto();
  }

  window.addEventListener("keydown", (e) => {
    if (!contactModal || !contactModal.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      closeContactModal();
      return;
    }
    if (e.key === "Tab") {
      const focusable = contactModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.querySelector("#contact-name")?.value.trim() || "Visitor";
      const email = document.querySelector("#contact-email")?.value.trim() || "";
      const purpose = document.querySelector("#contact-purpose")?.value || "General Connect";
      const message = document.querySelector("#contact-message")?.value.trim() || "";
      const submitBtn = document.querySelector("#contact-submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Dispatching...";
      }

      // Live submission via Web3Forms API with automatic mailto fallback
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "e34ba114-1e0e-473d-82c5-1f971bca42b3",
          name,
          email,
          subject: `[Portfolio Inquiry] ${purpose} from ${name}`,
          message: `Opportunity: ${purpose}\nSender: ${name} (${email})\n\nMessage:\n${message}`
        })
      }).then(res => res.json()).then(data => {
        if (contactSuccess) contactSuccess.hidden = false;
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span aria-hidden="true">↗</span>';
        }
        playUiSound("theme");
        showToast(`Thank you, ${name}! Message dispatched to Asad ✨`);
        setTimeout(() => {
          closeContactModal();
          if (contactSuccess) contactSuccess.hidden = true;
        }, 2400);
      }).catch(() => {
        // Fallback: If offline or API fails, trigger default mail client
        updateMailto();
        if (mailtoBtn && mailtoBtn.href) {
          window.location.href = mailtoBtn.href;
        }
        if (contactSuccess) {
          contactSuccess.hidden = false;
          const strong = contactSuccess.querySelector("strong");
          if (strong) strong.textContent = "Opening Email Client...";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <span aria-hidden="true">↗</span>';
        }
        showToast("Opened inquiry in your email client ✉");
        setTimeout(() => {
          closeContactModal();
          if (contactSuccess) contactSuccess.hidden = true;
        }, 2400);
      });
    });
  }
}

const resumeModal = document.querySelector("#resume-modal");
const resumeClose = document.querySelector("#resume-close");
const resumeBackdrop = document.querySelector("#resume-backdrop");
const navResumeBtn = document.querySelector("#nav-resume-btn");
const resumeContactBtn = document.querySelector("#resume-contact-btn");
let resumePreviousFocus = null;

function openResumeModal() {
  if (!resumeModal) return;
  resumePreviousFocus = document.activeElement;
  resumeModal.classList.add("is-open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  playUiSound("open");
  if (resumeClose) resumeClose.focus();
}

function closeResumeModal() {
  if (!resumeModal) return;
  resumeModal.classList.remove("is-open");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  playUiSound("close");
  if (resumePreviousFocus && typeof resumePreviousFocus.focus === "function") {
    resumePreviousFocus.focus();
    resumePreviousFocus = null;
  }
}

function initResumeModal() {
  if (navResumeBtn) navResumeBtn.addEventListener("click", openResumeModal);
  if (resumeClose) resumeClose.addEventListener("click", closeResumeModal);
  if (resumeBackdrop) resumeBackdrop.addEventListener("click", closeResumeModal);
  if (resumeContactBtn) {
    resumeContactBtn.addEventListener("click", () => {
      closeResumeModal();
      openContactModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (!resumeModal || !resumeModal.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      closeResumeModal();
      return;
    }
    if (e.key === "Tab") {
      const focusable = resumeModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}

/* ==========================================================================
   11. Live GitHub Stats & Tactile Click Listeners
   ========================================================================== */
async function fetchLiveGitHubStats() {
  const counter = document.querySelector("#github-repo-counter");
  if (!counter) return;
  try {
    const res = await fetch("https://api.github.com/users/Asadxio");
    if (res.ok) {
      const data = await res.json();
      if (data.public_repos && data.public_repos > 0) {
        counter.dataset.target = String(data.public_repos);
        counter.textContent = String(data.public_repos);
      }
    }
  } catch (e) {
    // Offline / rate limit fallback
  }
}

/* ==========================================================================
   10. Executive UI Polish: Scroll Indicator, Bento Spotlight & Magnetic Physics
   ========================================================================== */

function initScrollProgressBar() {
  const bar = document.querySelector("#scroll-progress-bar");
  if (!bar) return;

  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) {
      bar.style.width = "0%";
      return;
    }
    const pct = (window.scrollY / total) * 100;
    bar.style.width = `${Math.min(Math.max(pct, 0), 100)}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initBentoSpotlight() {
  if (window.matchMedia("(hover: none)").matches) return;
  const cards = document.querySelectorAll(".project-card, .credential-card, .stat-card, .expertise-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

function initMagneticButtons() {
  if (window.matchMedia("(hover: none)").matches) return;
  const magnets = document.querySelectorAll(".button, .cmd-k-trigger, .theme-toggle, .filter-button, .nav-cta, .terminal-launcher");

  magnets.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${dx * 0.22}px, ${dy * 0.22}px, 0)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function initGlobalQuickActions() {
  const aboutEmailBtn = document.querySelector("#about-copy-email");
  if (aboutEmailBtn) {
    aboutEmailBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("aliasadcivil007@gmail.com").then(() => {
        showToast("Email copied: aliasadcivil007@gmail.com ✨");
        const chipText = aboutEmailBtn.querySelector(".chip-email-text");
        if (chipText) {
          const orig = chipText.textContent;
          chipText.textContent = "Copied to clipboard!";
          setTimeout(() => { chipText.textContent = orig; }, 1800);
        }
      });
    });
  }

  const connectEmailBtn = document.querySelector("#connect-copy-email-btn");
  if (connectEmailBtn) {
    connectEmailBtn.addEventListener("click", () => {
      navigator.clipboard.writeText("aliasadcivil007@gmail.com").then(() => {
        showToast("Email copied: aliasadcivil007@gmail.com ✨");
        connectEmailBtn.innerHTML = 'Copied! <span aria-hidden="true">✓</span>';
        setTimeout(() => { connectEmailBtn.innerHTML = '<span>Copy</span> <span aria-hidden="true">⎘</span>'; }, 1800);
      });
    });
  }

  const aboutResumeBtn = document.querySelector("#about-resume-btn");
  if (aboutResumeBtn) {
    aboutResumeBtn.addEventListener("click", openResumeModal);
  }
}

/* ==========================================================================
   11. Executive Initialization
   ========================================================================== */
async function init() {
  initTheme();
  initThreeHero();
  initStatsCounter();
  initTerminal();
  initCommandPalette();
  initContactModal();
  initResumeModal();
  initGlobalQuickActions();
  fetchLiveGitHubStats();
  initScrollProgressBar();
  initBentoSpotlight();
  initMagneticButtons();

  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error("Project catalogue unavailable");
    projects = await response.json();
    renderFeatured();
    renderFilters();
    renderArchive();
  } catch (e) {
    projectGrid.innerHTML = "<p>Project catalogue could not load. Please check that projects.json is deployed beside index.html.</p>";
  }
}

searchInput.addEventListener("input", renderArchive);
document.querySelector("#year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
}

init();
