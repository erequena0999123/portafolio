const translations = {
  es: {
    title: "Emmanuel Requena · Portafolio",
    description: "Portafolio de Emmanuel Requena. Proyectos de desarrollo de software e IoT.",
    skip: "Saltar al contenido",
    nav: "Navegación principal",
    language: "Idioma",
    projects: "Proyectos",
    about: "Perfil",
    contact: "Contacto",
    role: "Desarrollador de software",
    intro: "Mis proyectos van desde un prototipo IoT con monitoreo web hasta una aplicación de escritorio con base de datos.",
    seeProjects: "Explorar proyectos",
    featured: "Proyectos destacados",
    view: "Vista",
    cards: "Tarjetas",
    compact: "Compacta",
    carousel: "Carrusel",
    carouselNavigation: "Navegar el carrusel",
    previous: "Anterior",
    next: "Siguiente",
    filters: "Filtrar proyectos",
    all: "Todos",
    iot: "IoT",
    desktop: "Escritorio",
    personal: "Proyecto personal",
    details: "Detalles técnicos",
    code: "Ver en GitHub",
    documentation: "Consultar tesis",
    bio: "Soy tecnólogo en Desarrollo de Software por el Instituto Superior Tecnológico Sudamericano. Mi experiencia incluye proyectos académicos, enseñanza de programación en Python y Java y soporte informático.",
    learning: "Me interesa seguir desarrollando aplicaciones con Python y tecnologías web.",
    tools: "Tecnologías",
    email: "Correo",
    cv: "Descargar CV",
    appearance: "Estilo",
    editor: "Editor",
    terminal: "Terminal",
    neon: "Neón"
  },
  en: {
    title: "Emmanuel Requena · Portfolio",
    description: "Emmanuel Requena's portfolio. Software development and IoT projects.",
    skip: "Skip to content",
    nav: "Main navigation",
    language: "Language",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    role: "Software developer",
    intro: "My projects range from an IoT prototype with a web dashboard to a database-backed desktop application.",
    seeProjects: "Explore projects",
    featured: "Featured projects",
    view: "View",
    cards: "Cards",
    compact: "Compact",
    carousel: "Carousel",
    carouselNavigation: "Browse the carousel",
    previous: "Previous",
    next: "Next",
    filters: "Filter projects",
    all: "All",
    iot: "IoT",
    desktop: "Desktop",
    personal: "Personal project",
    details: "Technical details",
    code: "View on GitHub",
    documentation: "Read the thesis",
    bio: "I hold a higher technical degree in Software Development from Instituto Superior Tecnológico Sudamericano. My experience includes academic projects, teaching Python and Java, and providing IT support.",
    learning: "I'm interested in building more applications with Python and web technologies.",
    tools: "Technologies",
    email: "Email",
    cv: "Download résumé",
    appearance: "Theme",
    editor: "Editor",
    terminal: "Terminal",
    neon: "Neon"
  }
};

const url = new URL(location.href);
const languages = Object.keys(translations);
const languageButtons = document.querySelectorAll("[data-lang]");
const themeButtons = document.querySelectorAll("[data-theme-option]");
const themes = Array.from(themeButtons, button => button.dataset.themeOption);
const layoutButtons = document.querySelectorAll("[data-layout-option]");
const layouts = Array.from(layoutButtons, button => button.dataset.layoutOption);
const filterGroup = document.querySelector("#project-filters");
const projectGrid = document.querySelector("#project-grid");
const carouselControls = document.querySelector("#carousel-controls");
const previousProject = document.querySelector("#previous-project");
const nextProject = document.querySelector("#next-project");
const contactLinks = document.querySelector("#contact-links");
const categories = ["all", ...new Set(portfolioProjects.map(project => project.category))];
const savedLanguage = load("portfolioLanguage");
const savedTheme = load("portfolioReviewTheme");
const preferredLanguage = navigator.language?.split("-")[0];
let language = [url.searchParams.get("lang"), savedLanguage, preferredLanguage].find(item => languages.includes(item)) ?? "es";
let theme = [url.searchParams.get("theme"), savedTheme].find(item => themes.includes(item)) ?? themes[0];
const savedLayout = load("portfolioProjectLayout");
const initialLayout = layouts.includes(savedLayout) ? savedLayout : layouts[0];
let activeFilter = "all";

function load(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function setFilter(next) {
  activeFilter = next;
  for (const button of filterGroup.children) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  }
  for (const card of projectGrid.children) {
    card.hidden = activeFilter !== "all" && card.dataset.category !== activeFilter;
  }
  projectGrid.scrollLeft = 0;
  updateCarousel();
}

function updateCarousel() {
  const maxScroll = projectGrid.scrollWidth - projectGrid.clientWidth;
  const canScroll = projectGrid.dataset.layout === "carousel" && maxScroll > 2;
  carouselControls.hidden = !canScroll;
  previousProject.disabled = projectGrid.scrollLeft <= 2;
  nextProject.disabled = projectGrid.scrollLeft >= maxScroll - 2;
}

function moveCarousel(direction) {
  const position = projectGrid.scrollLeft;
  const visibleCards = Array.from(projectGrid.children).filter(card => !card.hidden);
  const firstOffset = visibleCards[0]?.offsetLeft ?? 0;
  const offsets = visibleCards.map(card => card.offsetLeft - firstOffset);
  const target = direction > 0
    ? offsets.find(offset => offset > position + 2)
    : offsets.reverse().find(offset => offset < position - 2);
  if (target === undefined) return;
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  projectGrid.scrollTo({ left: target, behavior });
}

function setLayout(next, remember = false) {
  projectGrid.dataset.layout = next;
  for (const button of layoutButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.layoutOption === next));
  }
  projectGrid.scrollLeft = 0;
  updateCarousel();
  if (remember) save("portfolioProjectLayout", next);
}

function setTheme(next, remember = false) {
  theme = next;
  document.documentElement.dataset.theme = theme;
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === theme));
  }
  if (remember) save("portfolioReviewTheme", theme);
}

async function hasPdf(path) {
  try {
    const response = await fetch(path, { method: "HEAD", cache: "no-cache" });
    const type = response.headers.get("Content-Type")?.split(";")[0];
    return response.ok && type === "application/pdf";
  } catch {
    return false;
  }
}

async function cvPath(filename) {
  const path = `cv/${filename}`;
  return location.protocol === "file:" || (await hasPdf(path)) ? path : null;
}

function contactLink(label, glyph) {
  const link = element("a", "button secondary");
  const icon = element("span", "contact-link-icon", glyph);
  icon.setAttribute("aria-hidden", "true");
  link.append(icon, document.createTextNode(label));
  return link;
}

function renderContact(strings) {
  const links = [
    ["GitHub", "{ }", portfolioContact.github],
    ["LinkedIn", "in", portfolioContact.linkedin],
    [strings.email, "@", `mailto:${portfolioContact.email}`]
  ];
  contactLinks.replaceChildren();
  for (const [label, glyph, href] of links) {
    if (!href) continue;
    const link = contactLink(label, glyph);
    link.href = href;
    contactLinks.append(link);
  }

  const download = contactLink(strings.cv, "PDF");
  download.download = `CV-Emmanuel-Requena-${language}.pdf`;
  download.hidden = true;
  contactLinks.append(download);
  cvPath(`cv-${language}.pdf`).then(path => {
    if (!path) return;
    download.href = path;
    download.hidden = false;
  });
}

function createProject(project) {
  const card = element("article", "project-card");
  card.dataset.category = project.category;
  const visual = document.getElementById(project.visual);
  if (visual instanceof HTMLTemplateElement) card.append(visual.content.cloneNode(true));

  const body = element("div", "project-body");
  const category = element("p", "project-category");
  category.dataset.t = project.category;
  const name = element("h3", "", project.name);
  const summary = element("p", "project-summary");
  const tags = element("ul", "tags");
  tags.dataset.label = "tools";
  for (const tag of project.tags) tags.append(element("li", "", tag));
  const details = element("details", "project-details");
  const toggle = element("summary");
  toggle.dataset.t = "details";
  details.append(toggle, element("p", "project-detail"));
  const links = element("div", "project-links");
  const resources = [["code", project.repository], ["documentation", project.documentation]];
  for (const [label, href] of resources) {
    if (!href) continue;
    const link = element("a", "project-link");
    link.href = href;
    link.dataset.t = label;
    links.append(link);
  }
  body.append(category, name, summary, tags);
  if (links.children.length) body.append(links);
  body.append(details);
  card.append(body);
  return card;
}

function setLanguage(next, remember = false) {
  language = next;
  const strings = translations[language];
  document.documentElement.lang = language;
  document.title = strings.title;
  document.querySelector('meta[name="description"]').content = strings.description;
  for (const node of document.querySelectorAll("[data-t]")) {
    node.textContent = strings[node.dataset.t] ?? node.dataset.t;
  }
  for (const node of document.querySelectorAll("[data-label]")) {
    node.setAttribute("aria-label", strings[node.dataset.label]);
  }
  for (const button of languageButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  }
  portfolioProjects.forEach((project, index) => {
    const card = projectGrid.children[index];
    card.querySelector(".project-summary").textContent = project[language].summary;
    card.querySelector(".project-detail").textContent = project[language].detail;
  });
  renderContact(strings);
  if (remember) save("portfolioLanguage", language);
}

for (const category of categories) {
  const button = element("button");
  button.type = "button";
  button.dataset.filter = category;
  button.dataset.t = category;
  button.addEventListener("click", () => setFilter(category));
  filterGroup.append(button);
}
for (const project of portfolioProjects) projectGrid.append(createProject(project));
for (const button of layoutButtons) {
  button.addEventListener("click", () => setLayout(button.dataset.layoutOption, true));
}
previousProject.addEventListener("click", () => moveCarousel(-1));
nextProject.addEventListener("click", () => moveCarousel(1));
projectGrid.addEventListener("scroll", updateCarousel, { passive: true });
new ResizeObserver(updateCarousel).observe(projectGrid);
for (const button of languageButtons) {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang, true);
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set("lang", language);
    if (location.protocol !== "file:") history.replaceState(null, "", nextUrl);
  });
}
for (const button of themeButtons) {
  button.addEventListener("click", () => {
    setTheme(button.dataset.themeOption, true);
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set("theme", theme);
    if (location.protocol !== "file:") history.replaceState(null, "", nextUrl);
  });
}
setLanguage(language);
setFilter(activeFilter);
setTheme(theme);
setLayout(initialLayout);
