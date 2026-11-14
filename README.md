# My Gaming Room ✧ Y2K Edition

A browser-based isometric gaming-room customizer with a Y2K / gamer-girl visual identity.

## Features
- CSS-built isometric room illustration
- Four wall palettes and three floor styles
- Lighting toggle and customizable LED glow
- Add and drag decorations around the room; double-click a decoration to remove it
- Rename the room and select a main gaming platform
- Save the room in browser `localStorage`
- Export the room artwork as SVG
- Responsive desktop and mobile layout

## Run locally
No build step or dependencies are required.

Open `index.html` in a browser, or start a local server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Tech
HTML · CSS · Vanilla JavaScript · SVG · Web Storage API

## Project scope
This is an MVP. Room state is stored locally in the current browser; accounts and cross-device synchronization are not included. The room is a CSS-based isometric illustration, not a full 3D engine.
