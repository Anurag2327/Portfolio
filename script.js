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
