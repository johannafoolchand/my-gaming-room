# ✦ My Gaming Room — Y2K Edition

> Design your own little gaming sanctuary with a playful Y2K aesthetic and an interactive gaming-room studio.

![HTML](https://img.shields.io/badge/HTML5-Structure-E89AC7?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-Styling-C7A9E8?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F2C96D?style=flat-square&logo=javascript&logoColor=white)
[![Deploy](https://github.com/johannafoolchand/my-gaming-room/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/johannafoolchand/my-gaming-room/actions/workflows/deploy.yml)

My Gaming Room is a small front-end project built around a simple idea: create a customizable gaming room directly in the browser. The visual direction takes inspiration from early-2000s internet culture, pastel colors, gamer setups and playful decorative details.

## Project at a glance

| Area | Implementation |
| --- | --- |
| Interface | HTML5 |
| Styling | CSS3, responsive layouts and isometric shapes |
| Interactions | Vanilla JavaScript and DOM events |
| Room customization | Room themes, floor styles, lighting and movable furniture |
| Persistence | Browser `localStorage` |
| Export | SVG |
| Deployment | GitHub Pages with GitHub Actions |

## Features

- Immersive pastel gaming-room studio with a Y2K / Pinterest-inspired interface
- Add furniture and decor from a horizontal catalogue
- Drag placed objects around the room and double-click to remove them
- Switch room palettes and floor finishes
- Toggle the room lighting and choose an ambient LED colour
- Personalize the room name and gaming setup
- Save and restore room layouts locally with browser `localStorage`
- Export a portable JSON file containing the room configuration
- Responsive studio layout for desktop and mobile screens

## Architecture

The project runs entirely in the browser. HTML defines the interface, CSS creates the room and its visual effects, and JavaScript manages user interactions and room state.

```mermaid
flowchart TD
    U["User"] --> UI["HTML interface"]
    UI --> CSS["CSS room scene and styling"]
    UI --> JS["Vanilla JavaScript"]
    JS --> C["Customization controls"]
    C --> T["Themes, floor, lighting and decorations"]
    JS --> S["Browser localStorage"]
    JS --> E["SVG export"]
    G["GitHub Actions"] --> P["GitHub Pages deployment"]
    classDef ui fill:#f8d9eb,stroke:#c58ab5,color:#38263b
    classDef logic fill:#e9defa,stroke:#a58acb,color:#38263b
    classDef output fill:#dff1ee,stroke:#83b7ac,color:#243b38
    class UI,C,T ui
    class CSS,JS logic
    class S,E,P output
```

## Preview

The room is a lightweight 2D / 2.5D browser experience, not a full 3D engine. The room illustration is layered with SVG and CSS, while furniture and decorative objects are placed as interactive DOM elements.

## Requirements

- A modern web browser
- Python 3 (only if you want to run a local development server)
- No package manager or build tools required

## Run locally

Clone the repository:

```bash
git clone https://github.com/johannafoolchand/my-gaming-room.git
cd my-gaming-room
```

Start a local server:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also open `index.html` directly, although using a local server is recommended when testing browser features.

## Project structure

```text
my-gaming-room/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── styles.css
├── app.js
├── .gitignore
├── LICENSE
└── README.md
```

## Deployment

The repository includes a GitHub Actions workflow that publishes the site to GitHub Pages whenever changes are pushed to the `main` branch. The workflow can also be started manually from the Actions tab.

To enable deployment, make sure GitHub Pages is configured to use **GitHub Actions** as its build and deployment source in the repository settings.

## What this project demonstrates

- Structuring a responsive front-end application with semantic HTML
- Building a layered room scene with SVG and CSS
- Implementing pointer-based drag interactions with vanilla JavaScript
- Managing and persisting client-side room state with `localStorage`
- Exporting a room configuration as JSON
- Automating static-site deployment with GitHub Actions

## Roadmap

- [ ] Add automated JavaScript tests
- [ ] Improve keyboard accessibility for room interactions
- [ ] Add more furniture, themes and decoration options
- [ ] Add a shareable room configuration
- [ ] Refine the mobile customization experience

---

Made with care by [Johanna Foolchand](https://github.com/johannafoolchand). ✦
