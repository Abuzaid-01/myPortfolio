# Abuzaid — macOS-style Portfolio

React 19 + Vite + Tailwind v4 + GSAP + Zustand.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Where to edit
- `src/constants/index.js` — ALL content (projects, skills, links, dock apps, menus)
- Wallpaper: put an image in `public/` and set `wallpaper.image` in constants
- Weather city: `weatherLocation` in constants
- Resume viewer shows `public/Abuzaid_Resume.pdf` (replace it with your own PDF any time)

## Build phases
- [x] Phase 0 — setup + resume data
- [x] Phase 1 — wallpaper, hero, menu bar, dock
- [x] Phase 2 — window system (drag, resize, focus, minimize/zoom/close)
- [x] Phase 3 — Notes (About + Experience), Resume viewer, Contact
- [x] Phase 4 — Finder (projects) + Terminal (skills)
- [x] Phase 5 — boot screen, lock screen, Spotlight (Ctrl/⌘+K), Control Center + wallpapers, calendar, desktop icons, right-click menu, notifications, Trash
- [x] Phase 6 — SEO + social preview, a11y pass (axe: 0 violations), Vercel config


## Features
- Cinematic boot (once per session, click to skip, replay via  → Restart…)
- Spotlight search: `Ctrl/⌘ + K` or `/` — apps, projects (deep-links into Finder), skills, links, actions
- Control Center (wallpapers + brightness, saved), calendar popover, lock screen
- Draggable desktop icons, right-click menu, notifications, Trash easter egg
- Terminal with real commands (`help`, `ls`, `cat`, `neofetch`, `sudo`…)
- Fully responsive; touch devices get a mobile layout

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Vercel → Add New Project → import the repo. Framework is auto-detected (Vite); `vercel.json` is already set.
3. Deploy. Social-share tags use your production URL automatically; to use a custom domain add an
   env var `VITE_SITE_URL=https://your-domain.com` and redeploy.

Or with the CLI: `npm i -g vercel && vercel --prod`.

## Before you go live (checklist)
- [ ] Replace `public/Abuzaid_Resume.pdf` if you want your own PDF (the included one has no phone number)
- [ ] Check links in `src/constants/index.js` (projects, GitHub, LinkedIn, email)
- [ ] Share the link and check the preview card (`public/og-image.png`)
