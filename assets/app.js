const categories = ["All work","Digital Products","Data & BI","Machine Learning","Computer Vision","AI & Software","Other Work","Research & Concepts"];
let projects = [];
let activeCategory = "All work";
const projectGrid = document.querySelector("#project-grid");
const featuredGrid = document.querySelector("#featured-grid");
const filterBar = document.querySelector("#filter-bar");
const searchInput = document.querySelector("#project-search");
const emptyState = document.querySelector("#empty-state");
const projectCount = document.querySelector("#project-count");

function slugify(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function visualClass(i){return `v-${(i%6)+1}`}
function projectCard(p,i,featured=false){
  const link=p.url?`<a class="project-link" href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer">${p.repo?"View repository":p.status==="Live"?"Visit live project":"Explore project"} <span>↗</span></a>`:`<span class="project-link" aria-label="Project link not yet available">Project details to be added <span>↗</span></span>`;
  const tags=p.tags.slice(0,4).map(t=>`<span>${escapeHTML(t)}</span>`).join("");
  return `<article class="project-card ${featured?"featured-large":""}">
    <div class="project-visual ${visualClass(i)}"><span class="visual-index">${String(i+1).padStart(2,"0")} / PORTFOLIO</span><div class="visual-word">${escapeHTML(p.title.replace(" Classification","").replace(" Projects",""))}</div></div>
    <div class="project-content"><div class="project-meta"><span class="project-category">${escapeHTML(p.category)}</span><span class="status-pill">${escapeHTML(p.status)}</span></div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p><div class="tag-list">${tags}</div>${link}</div>
  </article>`;
}
function renderFilters(){
  filterBar.innerHTML=categories.map(c=>`<button class="filter-button" type="button" data-category="${escapeHTML(c)}" aria-pressed="${c===activeCategory}">${escapeHTML(c)}</button>`).join("");
  filterBar.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;renderFilters();renderArchive()}));
}
function filteredProjects(){
  const q=searchInput.value.trim().toLowerCase();
  return projects.filter(p=>(activeCategory==="All work"||p.category===activeCategory)&&(!q||[p.title,p.description,p.category,p.status,...p.tags].join(" ").toLowerCase().includes(q)));
}
function renderArchive(){
  const list=filteredProjects();
  projectCount.textContent=list.length;
  projectGrid.innerHTML=list.map(p=>projectCard(p,projects.indexOf(p))).join("");
  emptyState.hidden=list.length!==0;
}
function renderFeatured(){
  const featured=projects.filter(p=>p.featured).slice(0,4);
  featuredGrid.innerHTML=featured.map(p=>projectCard(p,projects.indexOf(p),true)).join("");
}
async function init(){
  try{
    const response=await fetch("projects.json");
    if(!response.ok) throw new Error("Project catalogue unavailable");
    projects=await response.json();
    renderFeatured();renderFilters();renderArchive();
  }catch(e){
    projectGrid.innerHTML="<p>Project catalogue could not load. Please check that projects.json is deployed beside index.html.</p>";
  }
}
searchInput.addEventListener("input",renderArchive);
document.querySelector("#year").textContent=new Date().getFullYear();
const menuToggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
menuToggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
  menuToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}else{document.querySelectorAll(".reveal").forEach(el=>el.classList.add("is-visible"))}
init();
