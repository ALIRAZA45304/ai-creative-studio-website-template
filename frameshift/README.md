# Frameshift

An AI creative studio demo website (dark theme, neon lime accent) built with plain HTML, CSS and JavaScript. No build step and no dependencies.

## Features
- Sticky nav with Image / Video / Audio mega-menus
- Explore page: hero cards, promo block, feature banners, masonry community grid, project gallery
- Video tiles autoplay when scrolled into view and pause when off-screen
- Clip viewer with a side panel (user, input assets, details, Recreate / Download / favorite / share)
- Community page with Shuffle and Upload video
- Generator page: upload a video, type a prompt, Generate (demo effect, no real AI)
- Sign-up modal (demo only)

## Project structure
```
frameshift/
├── index.html          page markup
├── css/style.css       all styles
├── js/videos.js        list of video files used by the site
├── js/main.js          menus, grids, viewer, upload, generator
├── assets/videos/      clip-1.mp4 ... clip-9.mp4 + CREDITS.md
├── .vscode/            VS Code settings, tasks, recommended extensions
└── package.json        start and format scripts
```

## Run it in VS Code
1. Open this folder in VS Code (File > Open Folder).
2. Install the recommended extensions when prompted (Live Server, Prettier).
3. Right-click `index.html` and choose **Open with Live Server**.

Or from a terminal (needs Node.js): `npm start`, then open http://localhost:3000.

You can also double-click `index.html`; it works from disk, though a local server is better.

## Add your own videos
1. Put an `.mp4` (H.264, ideally under 2 MB) in `assets/videos/`.
2. Add its path to the list in `js/videos.js`.

Users can also upload videos from the page itself; those last only for the current browser session.

## Notes
- The generator, sign-up and download buttons are demo-only and are not connected to any backend.
- Fonts (Archivo, Manrope) load from Google Fonts; the page falls back to system fonts offline.
- Footage credits: see `assets/videos/CREDITS.md`.
