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
  if (threeMaterials[0]) threeMaterials[0].color.setHex(wireColor);
  if (threeMaterials[1]) threeMaterials[1].color.setHex(particleColor);
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

  threeMaterials = [wireMat, particleMat];

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

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Constant smooth rotation + mouse lerp
    group.rotation.y += 0.0035;
    group.rotation.x += 0.0018;

    group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
    group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

    ring1.rotation.z = elapsed * 0.15;
    ring2.rotation.x = elapsed * -0.12;

    wireMesh.rotation.y = elapsed * 0.04;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    const newWidth = canvas.clientWidth || 500;
    const newHeight = canvas.clientHeight || 500;
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
    ? `<a class="project-link" href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer">${p.repo ? "View repository" : p.status === "Live" ? "Visit live project" : "Explore project"} <span>↗</span></a>`
    : `<span class="project-link" aria-label="Project link not yet available">Quick view details <span>↗</span></span>`;
  const tags = p.tags.slice(0, 4).map(t => `<span>${escapeHTML(t)}</span>`).join("");

  return `
    <article class="project-card ${featured ? "featured-large" : ""}" data-index="${i}" tabindex="0" role="button" aria-label="View details for ${escapeHTML(p.title)}">
      <div class="card-glare" aria-hidden="true"></div>
      <div class="project-visual ${visualClass(i)}">
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
        ${link}
      </div>
    </article>`;
}

function attachCardClickListeners() {
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // If user clicked directly on the external anchor link, let it open normally
      if (e.target.closest("a.project-link")) return;
      const index = parseInt(card.dataset.index, 10);
      if (!isNaN(index) && projects[index]) {
        openProjectModal(projects[index]);
      }
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const index = parseInt(card.dataset.index, 10);
        if (!isNaN(index) && projects[index]) {
          openProjectModal(projects[index]);
        }
      }
    });
  });
  applyCardTiltEffect();
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

function openProjectModal(p) {
  if (!projectModal) return;

  modalCategory.textContent = p.category || "Project";
  modalStatus.textContent = p.status || "Completed";
  modalTitle.textContent = p.title || "Project Overview";
  modalDesc.textContent = p.description || "";
  modalStageNote.textContent = p.stageNote || "Verified portfolio repository artifact.";

  modalTags.innerHTML = (p.tags || []).map(t => `<span>${escapeHTML(t)}</span>`).join("");

  if (p.url) {
    modalLiveLink.style.display = "inline-flex";
    modalLiveLink.href = p.url;
    modalLiveLink.innerHTML = `${p.repo ? "View Repository" : "Visit Live Project"} <span>↗</span>`;
  } else {
    modalLiveLink.style.display = "none";
  }

  if (p.repo) {
    modalRepoLink.style.display = "inline-flex";
    modalRepoLink.href = p.repo;
  } else {
    modalRepoLink.style.display = "inline-flex";
    modalRepoLink.href = "https://github.com/Asadxio";
    modalRepoLink.innerHTML = "Explore GitHub <span>↗</span>";
  }

  modalCopyBtn.onclick = () => {
    const urlToCopy = p.url || window.location.href;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      const orig = modalCopyBtn.innerHTML;
      modalCopyBtn.innerHTML = "Copied! <span>✓</span>";
      setTimeout(() => { modalCopyBtn.innerHTML = orig; }, 1800);
    });
  };

  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (modalClose) modalClose.addEventListener("click", closeProjectModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectModal && projectModal.classList.contains("is-open")) {
    closeProjectModal();
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

  function toggleTerminal() {
    const isOpen = widget.classList.toggle("is-open");
    widget.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      setTimeout(() => input.focus(), 150);
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
Available Commands:
  • <span class="t-hl">about</span>      — Bio & background
  • <span class="t-hl">skills</span>     — Technical competencies
  • <span class="t-hl">projects</span>   — Featured projects directory
  • <span class="t-hl">contact</span>    — Socials & reach out
  • <span class="t-hl">resume</span>     — View resume in Google Drive
  • <span class="t-hl">theme</span>      — Toggle dark/light appearance
  • <span class="t-hl">matrix</span>     — Launch digital rain stream
  • <span class="t-hl">clear</span>      — Clear terminal buffer
  • <span class="t-hl">date</span>       — Show current local system time
  • <span class="t-hl">exit</span>       — Close CLI console`,

    about: () => `
Asad Ali Mulla — Data Analytics, Machine Learning & Digital Products.
Focus: Building clear, reliable, and grounded tech solutions from exploratory data modeling to modern web software.`,

    skills: () => `
[DATA & BI]        Python, SQL, Power BI, Pandas, NumPy, Jupyter
[ML & VISION]      Scikit-learn, CNN, TensorFlow, Computer Vision, OCR
[FULL STACK]       React Native / Expo, Firebase, FastAPI, Cloudflare, HTML/CSS/JS
[TESTING & SEO]    Playwright, Technical SEO, Automation Workflows`,

    projects: () => `
Selected Highlights:
  1. NOOR-E-HARAM      — <a class="t-link" href="https://nooreharam.com/" target="_blank">https://nooreharam.com/</a>
  2. PDF Toolbox       — <a class="t-link" href="https://pdf.myoss.in/" target="_blank">https://pdf.myoss.in/</a>
  3. GitHub Profile    — <a class="t-link" href="https://github.com/Asadxio" target="_blank">https://github.com/Asadxio</a>
Total projects in archive: 24`,

    contact: () => `
Get In Touch:
  • LinkedIn:  <a class="t-link" href="https://www.linkedin.com/in/asad-ali-mulla-044240262/" target="_blank">linkedin.com/in/asad-ali-mulla-044240262/</a>
  • GitHub:    <a class="t-link" href="https://github.com/Asadxio" target="_blank">github.com/Asadxio</a>
  • X/Twitter: <a class="t-link" href="https://twitter.com/AsadXio" target="_blank">@AsadXio</a>
  • Kaggle:    <a class="t-link" href="https://www.kaggle.com/asadxio" target="_blank">kaggle.com/asadxio</a>`,

    resume: () => {
      window.open("https://drive.google.com/file/d/1mB_SIPnnv3y_hB-CiimIU7OT_vVpUtuk/view?usp=sharing", "_blank");
      return "Opening resume in new tab...";
    },

    theme: () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("asad_portfolio_theme", next);
      return `Theme switched to ${next} mode.`;
    },

    date: () => new Date().toString(),

    matrix: () => {
      const chars = "010101 ASAD DATA AI ML POWER_BI VISION CLOUDFLARE 2026";
      let str = "";
      for (let i = 0; i < 4; i++) {
        str += Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") + "\n";
      }
      return `<span style="color:#00ff88;font-size:10px;">${str}Matrix simulation stream complete.</span>`;
    },

    sudo: () => "Permission denied: Guest user cannot execute root commands 😉",

    clear: () => {
      output.innerHTML = "";
      return "";
    },

    exit: () => {
      toggleTerminal();
      return "Closing session...";
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
      cmdRow.innerHTML = `visitor@asad:~$ ${escapeHTML(raw)}`;
      output.appendChild(cmdRow);

      const respRow = document.createElement("div");
      respRow.className = "t-response";

      if (commands[cmd]) {
        const res = commands[cmd]();
        if (res) respRow.innerHTML = res;
      } else {
        respRow.innerHTML = `command not found: ${escapeHTML(cmd)}. Type <span class="t-hl">'help'</span> for list of commands.`;
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
}

/* ==========================================================================
   7. Fluid Magnetic Custom Cursor (Desktop)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector("#cursor-dot");
  const ring = document.querySelector("#cursor-ring");
  if (!dot || !ring || window.matchMedia("(hover: none)").matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover states on interactive items
  const interactives = "a, button, input, .project-card, .filter-button, .stat-card, .theme-toggle";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.add("is-hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactives)) {
      ring.classList.remove("is-hover");
    }
  });
}

/* ==========================================================================
   8. Hacker Text Scramble Effect on Headings
   ========================================================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--gold);opacity:0.8;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function initScrambleHeadings() {
  const headings = document.querySelectorAll(".section-heading h2, .about-left h2");
  headings.forEach(h2 => {
    const orig = h2.textContent;
    let running = false;
    h2.addEventListener("mouseenter", () => {
      if (running) return;
      running = true;
      const scrambler = new TextScramble(h2);
      scrambler.setText(orig).then(() => {
        running = false;
      });
    });
  });
}

/* ==========================================================================
   9. Initialization
   ========================================================================== */
async function init() {
  initTheme();
  initThreeHero();
  initStatsCounter();
  initTerminal();
  initCustomCursor();
  initScrambleHeadings();

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
