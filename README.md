# DrawApp

DrawApp (internally called "לומדים לצייר" - "Learning to Draw") is an interactive drawing tutor. You pick a drawing from a gallery (butterfly, dragon, eye, rose) and go through it step by step: each step shows a guide path on an SVG canvas, and you trace over it with your mouse or finger. The app checks your drawing against the guide path in real time (how much of it you covered and how close you stayed to it) and only lets you move on once you're close enough to the original. If you fail a step a few times in a row you can just skip it, and once you finish all the steps you get to see the full drawing put together.

## Tech Stack

- **Frontend:** React 19 + Vite, plain CSS (no external styling framework)
- **Backend:** Node.js + Express, with `cors` for cross-origin requests
- **Linting:** oxlint (client side)
- **Dev tooling:** `concurrently` to run client and server together with one command
- **Data:** static JSON files (no database) under `server/data/lessons`

## Key Features

- **Lesson gallery (Home page):** lists the available drawings, each with a title and step count, loaded dynamically from the API.
- **Sidebar navigation:** switch between the home page and the different lessons, with the active lesson highlighted.
- **Guided step-by-step lessons:** each lesson has multiple steps, and every step comes with its own instructions and guide path (sometimes with a focused/zoomed `viewBox` for that particular step).
- **Free-drawing SVG canvas:** draws using Pointer Events, converting the tracked points into a smooth SVG path (quadratic curves).
- **Automatic accuracy check:** compares the points you drew against points sampled from the guide path, using coverage and precision measured against a deviation threshold relative to the drawing size.
- **Skip step:** after 3 failed attempts in a row, a "skip step" button becomes available.
- **Clear / restart:** you can clear the current step or restart the whole lesson.
- **Finish screen:** once all steps are done, it shows the complete drawing assembled from every approved step, with the option to draw it again or go back and pick a different one.

## Setup & Installation

The project has three separate `package.json` files (root, `client`, `server`), so you need to install dependencies in each:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

There's no `.env` file or required environment variables in this project. The server optionally reads `PORT` (defaults to `6100`), but there's no `.env.example` in the repo. The client's API URL is currently hardcoded to `http://localhost:6100/api` (in `client/src/api/lessons.js`), so running locally with the default ports is the safest bet.

## How to Run

### Development (client + server together)

From the root folder:

```bash
npm run dev
```

This runs the Vite dev server (client, defaults to `http://localhost:5173`) and the Express server (defaults to `http://localhost:6100`) at the same time via `concurrently`, with live-reload on both sides.

### Client only

```bash
cd client
npm run dev      # dev server (Vite)
npm run build    # production build
npm run preview  # preview the build
npm run lint      # run oxlint
```

### Server only

```bash
cd server
npm run dev      # node --watch index.js
```

Note: `server/package.json` only has a `dev` script (using `node --watch`) - there's no separate `start` script for production.

## Project Structure

```
DrawApp/
├── client/                       # React app (Vite)
│   ├── src/
│   │   ├── api/lessons.js        # fetch calls to the server (lesson list / single lesson)
│   │   ├── components/
│   │   │   ├── HomePage.jsx      # lesson gallery
│   │   │   ├── LessonPage.jsx    # lesson screen - steps, accuracy check, finish
│   │   │   ├── DrawingCanvas.jsx # SVG canvas for free drawing
│   │   │   └── Sidebar.jsx       # side navigation
│   │   ├── utils/matchDrawing.js # scoring/matching logic for drawing vs. guide path
│   │   └── App.jsx               # routing between home page and lesson
│   └── package.json
├── server/                        # Express server
│   ├── data/lessons/*.json        # lesson definitions (steps, SVG paths, text)
│   ├── routes/lessons.js          # GET /api/lessons, GET /api/lessons/:id
│   ├── index.js                   # server entry point
│   └── package.json
└── package.json                   # shared dev script (concurrently)
```
