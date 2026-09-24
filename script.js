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
// Soft background pad — generated in-browser (Web Audio API), no file needed.
// Click toggles a gentle, slowly-breathing ambient chord in/out.
// ---------------------------------------------------------------------------
const musicToggle = document.getElementById("musicToggle");

if (musicToggle) {
  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;

  function buildSoftPad() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);

    // A soft, warm chord (C major, plus a low sub) — each voice gently
    // "breathes" in volume via its own slow LFO so it never feels static.
    const voices = [
      { freq: 130.81, level: 0.5, lfoRate: 0.05 }, // C3 sub
      { freq: 261.63, level: 0.22, lfoRate: 0.07 }, // C4
      { freq: 329.63, level: 0.18, lfoRate: 0.09 }, // E4
      { freq: 392.0, level: 0.18, lfoRate: 0.11 }, // G4
    ];

    voices.forEach(({ freq, level, lfoRate }) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const voiceGain = audioCtx.createGain();
      voiceGain.gain.value = level;

      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = lfoRate;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = level * 0.4;
      lfo.connect(lfoGain);
      lfoGain.connect(voiceGain.gain);

      osc.connect(voiceGain);
      voiceGain.connect(masterGain);
      osc.start();
      lfo.start();
    });
  }

  musicToggle.addEventListener("click", () => {
    if (!audioCtx) buildSoftPad();
    if (audioCtx.state === "suspended") audioCtx.resume();

    isPlaying = !isPlaying;
    musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");

    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(isPlaying ? 0.05 : 0, now, 0.8);
  });
}

// ---------------------------------------------------------------------------
// Project "explain it to me" buttons — reads the project title + description
// aloud using the browser's built-in text-to-speech (no audio file needed)
// ---------------------------------------------------------------------------
if ("speechSynthesis" in window) {
  let voices = [];
  const loadVoices = () => { voices = window.speechSynthesis.getVoices(); };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;

  function pickFemaleVoice() {
    if (!voices.length) return null;
    const byName = /female|zira|samantha|victoria|susan|karen|moira|tessa|fiona|veena|google us english/i;
    return (
      voices.find((v) => byName.test(v.name)) ||
      voices.find((v) => v.lang && v.lang.startsWith("en")) ||
      voices[0]
    );
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    const titleEl = card.querySelector("h3");
    const descEl = card.querySelector("p");
    if (!titleEl || !descEl) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "project-card__speak";
    btn.setAttribute("aria-label", `Listen to an explanation of ${titleEl.textContent}`);
    btn.innerHTML =
      '<svg class="icon-speak-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>' +
      '<svg class="icon-speak-stop" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="display:none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    card.appendChild(btn);

    const setIdle = () => {
      btn.classList.remove("is-speaking");
      btn.querySelector(".icon-speak-play").style.display = "";
      btn.querySelector(".icon-speak-stop").style.display = "none";
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasSpeaking = btn.classList.contains("is-speaking");

      window.speechSynthesis.cancel();
      document.querySelectorAll(".project-card__speak").forEach(setIdle);
      if (wasSpeaking) return;

      const utterance = new SpeechSynthesisUtterance(`${titleEl.textContent}. ${descEl.textContent}`);
      const femaleVoice = pickFemaleVoice();
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.rate = 1;
      utterance.pitch = 1.1;
      utterance.onend = setIdle;
      utterance.onerror = setIdle;

      btn.classList.add("is-speaking");
      btn.querySelector(".icon-speak-play").style.display = "none";
      btn.querySelector(".icon-speak-stop").style.display = "";
      window.speechSynthesis.speak(utterance);
    });
  });
}

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
    if (e.target.closest("a, button")) return;
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