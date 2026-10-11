# Juan Sebastián Baquero — Interactive 3D Portfolio

Live: **https://juansbaquero.github.io/**

An interactive, first-person 3D portfolio built with [Three.js](https://threejs.org)
and TypeScript. Walk through a small neon plaza (WASD + mouse-look) and interact
(`E`) with glowing pedestals to read About, Experience, Projects, Skills and
Contact. A scrollable text-only fallback is included for touch devices and
anyone who prefers it.

## Architecture

The codebase follows a **layered, SOLID-friendly architecture** — the same
spirit used in production frontend monorepos (clear boundaries, dependency
inversion, one reason to change per module) scaled down to a single-page app:

```
content/                          ← Raw portfolio data (jobs, projects, skills...)
                                     Edit THIS to update the CV content. No code change needed.

src/
├── domain/                       ← Pure business types. Zero knowledge of
│   ├── entities/Station.ts         Three.js, the DOM, or how content is stored.
│   └── repositories/
│       └── ContentRepository.ts  ← Port (interface) — the abstraction every
│                                    other layer depends on (Dependency Inversion).
│
├── application/                  ← Use-case / orchestration logic that is
│   └── services/                   still framework-agnostic.
│       └── StationContentRenderer.ts   (domain content -> HTML string, pure function)
│
├── infrastructure/                ← Concrete, swappable implementations.
│   ├── content/
│   │   └── StaticContentRepository.ts  (implements ContentRepository from /content)
│   └── three/                     ← Everything Three.js-specific, split by
│       ├── scene/                   single responsibility:
│       │   ├── Environment.ts       floor/grid/stars/lights/boundary
│       │   ├── Pedestal.ts          builds one interactive pedestal
│       │   └── PedestalAnimator.ts  idle animations only
│       ├── input/
│       │   ├── KeyboardInput.ts     raw key state + semantic actions
│       │   ├── MovementController.ts WASD movement, collision, boundary clamp
│       │   └── ProximityTracker.ts  "what's nearby" only
│       ├── postprocessing/
│       │   └── BloomComposer.ts     neon bloom pipeline
│       └── PortfolioScene.ts        composition root for the 3D engine
│
└── presentation/                  ← DOM-only views. Never touch Three.js.
    ├── hud/HudView.ts               crosshair, prompt, start screen, toggle
    ├── panels/PanelView.ts          modal panel overlay (3D mode)
    ├── panels/SimpleModeView.ts     scrollable text fallback
    └── styles/main.css

src/main.ts                        ← Composition root: wires content repo +
                                      3D engine + DOM views together. The ONLY
                                      file allowed to know every layer at once.
```

### Why this shape

- **Dependency Inversion**: `domain/repositories/ContentRepository.ts` is an
  interface. Nothing outside `infrastructure/content/` knows it's backed by a
  static TypeScript file today — swapping it for a headless CMS later touches
  exactly one file.
- **Single Responsibility**: the old single `index.html` mixed scene setup,
  movement physics, DOM wiring and content strings in one 665-line script.
  Each of those concerns now lives in its own file with one reason to change.
- **Open/Closed**: adding a job, project, or skill group means editing
  `content/portfolio.ts` only — no class changes required.
- **Shared source of truth**: both the 3D panel overlay and the text-only
  fallback render from the same `ContentRepository` + `StationContentRenderer`,
  so they can never drift out of sync.

## Development

Requires Node 22+ (this repo was scaffolded with Node 26 via Homebrew;
`npm install -g n` or use `/opt/homebrew/bin/node` if your default Node is
older).

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build -> dist/
npm run preview    # serve the production build locally
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which typechecks,
builds, and publishes `dist/` to GitHub Pages automatically. No manual build
step or committed `dist/` folder.
