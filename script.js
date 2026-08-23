// ---------------------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Theme toggle (light / dark), persisted in localStorage
// ---------------------------------------------------------------------------
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem("portfolio-theme", theme); } catch (e) {}
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (e) {}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ---------------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------------
const navBurger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

navBurger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("nav__links--open");
  navBurger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("nav__links--open");
    navBurger.setAttribute("aria-expanded", "false");
  });
});

// ---------------------------------------------------------------------------
// Whole project card clickable (opens the project link)
// ---------------------------------------------------------------------------
document.querySelectorAll(".project-card[data-href]").forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", (e) => {
    // Don't double-trigger if the actual "View" link (or any link inside) was clicked
    if (e.target.closest("a")) return;
    const url = card.getAttribute("data-href");
    if (url) window.open(url, "_blank", "noopener");
  });
});

// ---------------------------------------------------------------------------
// Scroll-reveal: fade + rise elements into view as the user scrolls
// ---------------------------------------------------------------------------
const revealTargets = document.querySelectorAll(
  ".timeline__row, .project-card, .skill-panel, .cert, .contact-card, .about__photo, .about__content"
);

revealTargets.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("reveal--in");
          revealObserver.unobserve(el);
          // Once the entrance animation finishes, drop the reveal classes
          // entirely so they don't linger and fight with hover transforms.
          el.addEventListener(
            "transitionend",
            () => {
              el.classList.remove("reveal", "reveal--in");
              el.style.transitionDelay = "";
            },
            { once: true }
          );
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.remove("reveal"));
}