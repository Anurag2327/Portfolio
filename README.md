# Anurag Pandey — Portfolio (v2)

A redesigned, fully responsive portfolio with a floating pill nav, giant hero
typography, a scrolling marquee strip, a two-column timeline for experience,
and a light/dark theme toggle. Indigo + teal palette — plain HTML/CSS/JS,
no build step, no framework.

## Structure

Everything is **flat on purpose** (no css/ or js/ subfolders) — this avoids
the broken-path issue from the last version when opening the file directly
with a double-click.

```
portfolio/
├── index.html
├── style.css
├── script.js
├── assets/          # put your real photo / resume PDF here
└── README.md
```

## Run it

Just double-click `index.html` — no server required, since every file sits
in the same folder and every path in `index.html` is relative with no
subfolder prefix (`style.css`, `script.js`, not `css/style.css`).

If you ever add more folders later, prefer running a local server instead
of file:// to avoid path issues:
```bash
python -m http.server 8000
```

## Customize

- **Colors** — edit the `:root` and `[data-theme="dark"]` blocks at the top
  of `style.css`.
- **Add your real photo** — put an image in `assets/` (e.g. `assets/photo.jpg`),
  then in `index.html` replace the `.photo-card` block with:
  ```html
  <img src="assets/photo.jpg" alt="Anurag Pandey" class="photo-card" />
  ```
  and add `.photo-card { object-fit: cover; }` to the CSS.
- **Resume download** — add your PDF as `assets/AnuragPandeyResume.pdf`.
  The "Download CV" button in the hero already points there.
- **Projects / timeline** — each project is a `.project-card` block, each
  timeline entry is a `.timeline__row` block in `index.html`. Copy/paste
  to add more.

## Deploy

Static site — works with GitHub Pages, Netlify, Vercel, or Render with zero
configuration. Just upload the whole folder.
