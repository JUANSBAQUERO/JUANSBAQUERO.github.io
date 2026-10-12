# Juan Sebastián Baquero — Interactive 3D Portfolio

Live: **https://juansbaquero.github.io/**

A scroll-driven 3D portfolio built with [Three.js](https://threejs.org) and
TypeScript. A fixed, full-viewport 3D stage hosts a rigged, animated
character (walk → run → crash → bow) that moves horizontally as you scroll
vertically past a stack of content "beats" (Hero, About, Experience,
Projects, Skills, Contact) layered on top. Smooth, interpolated scrolling is
powered by [Lenis](https://github.com/darkroomengineering/lenis). The site
is bilingual (EN/ES, auto-detected with a manual switcher) and includes a
privacy/legal notice modal.

> Earlier iteration (now superseded): a first-person WASD/mouse-look plaza
> with interactive pedestals. That approach and its architecture notes are
> preserved in git history (see `7e28d90` and before) if useful for
> reference.

## Architecture

The codebase follows a **layered, SOLID-friendly architecture** — the same
spirit used in production frontend monorepos (clear boundaries, dependency
inversion, one reason to change per module) scaled down to a single-page app:

```
content/                          ← Raw portfolio data & copy.
├── portfolio.ts                    About/Experience/Projects/Skills/Contact
│                                    content. Edit THIS to update the CV.
├── journey.ts                      Journey scenes (walk/run/crash/bow) and
│                                    beat → scene/content mapping.
├── LocaleContent.ts                 Shape of all translatable UI/content strings.
└── locales/
    ├── en.ts / es.ts               Actual EN/ES copy.
    └── index.ts                    getLocaleContent(locale) lookup.

src/
├── domain/                        ← Pure business types. Zero knowledge of
│   └── entities/                    Three.js, the DOM, or how content is stored.
│       ├── Journey.ts                JourneyScene / JourneyBeat shapes.
│       ├── Station.ts                StationKey (nav/beat ids).
│       └── Locale.ts                 Locale, SUPPORTED_LOCALES.
│
├── application/                   ← Use-case / orchestration logic that is
│   └── services/                    still framework-agnostic.
│       ├── JourneyProgress.ts         scroll progress -> active beat, global
│       │                              progress %, character {scene, x} — the
│       │                              core pure math behind the whole effect.
│       ├── StationContentRenderer.ts  domain content -> HTML string, per beat.
│       └── LocalePreference.ts        persisted + initial locale resolution.
│
├── infrastructure/                 ← Concrete, swappable implementations.
│   ├── scroll/
│   │   └── SmoothScroll.ts           thin Lenis wrapper (pause/resume/scrollTo).
│   └── three/
│       ├── JourneyScene.ts           composition root for the 3D engine/stage.
│       ├── postprocessing/
│       │   └── BloomComposer.ts      bloom pipeline.
│       └── character/                everything about the rigged character +
│           ├── JourneyCharacter.ts     scene, split by single responsibility:
│           ├── JourneyEnvironment.ts   GLTF/Draco load + animation mixer/clips
│           ├── AnimeSkyBackground.ts   procedural anime-style sky/background
│           ├── WoodPlankFloorTexture.ts procedural floor texture
│           ├── LanternPost.ts         scenery prop
│           ├── FallingLeaves.ts       ambient particle effect
│           ├── ImpactEffect.ts        crash-beat VFX
│           └── MouseLook.ts           subtle camera parallax on mouse move
│
└── presentation/                   ← DOM-only views. Never touch Three.js.
    ├── nav/NavPillView.ts             pill nav, scrolls to a beat on click
    ├── legal/LegalModal.ts            privacy/legal notice overlay
    └── styles/main.css

src/main.ts                        ← Composition root: wires locale resolution +
                                      journey scene + scroll + nav + legal modal
                                      together. The ONLY file allowed to know
                                      every layer at once.

tests/                              ← Vitest unit tests, mirroring src/ layer
                                      by layer (see Testing section below).
```

### Why this shape

- **Dependency Inversion**: pure math (`JourneyProgress`, content rendering)
  lives in `application/`, with zero imports from Three.js or the DOM —
  it's unit-tested without a browser or WebGL context.
- **Single Responsibility**: the character scene is split into focused
  files (model loading, background, floor, props, particles, camera
  parallax) instead of one monolithic scene class.
- **Open/Closed**: adding a job, project, or skill group means editing
  `content/portfolio.ts`; adding a new journey beat means editing
  `content/journey.ts` — no class changes required.
- **i18n without duplication**: `main.ts` re-renders every text node from
  `getLocaleContent(locale)` on language switch, so 3D scene, scroll state
  and beat layout are never touched or reloaded.

## Development

Requires Node 22+ (CI runs on Node 22; this repo was originally scaffolded
with a newer local Node via Homebrew — use `/opt/homebrew/bin/node` or `n`
if your default Node is older). Package manager is **pnpm 12.11.2**
(pinned via `packageManager` in `package.json`).

```bash
pnpm install
pnpm run dev            # http://localhost:5173
pnpm run typecheck      # tsc --noEmit
pnpm run test           # vitest run (unit tests, one-shot)
pnpm run test:watch     # vitest (watch mode)
pnpm run test:coverage  # vitest run --coverage
pnpm run format         # prettier --write (src/content/tests)
pnpm run build          # typecheck + production build -> dist/
pnpm run preview        # serve the production build locally
```

## Testing

Unit tests live in `tests/`, mirroring the `src/` layer structure, and run
on [Vitest](https://vitest.dev) (no DOM/WebGL — pure Node). They target the
layers designed to be framework-agnostic:

- `tests/application/services/StationContentRenderer.test.ts` — domain
  content → HTML string, for every station/beat type.

The Three.js scene and character pipeline (`JourneyScene.ts`,
`JourneyCharacter.ts`, `JourneyEnvironment.ts`, `BloomComposer.ts`, scroll
math wiring in `main.ts`) is intentionally **not** unit-tested — it
requires a real WebGL context and GLTF assets — and is instead verified
visually with Playwright + screenshots before every deploy.

## 3D Character Pipeline

The rigged character model (`public/models/juan/journey.glb`, Draco-
compressed) was produced via a Meshy (mesh/texture generation) → Mixamo
(rigging + animation clips: Walking, Running, dying_backwards,
Gentlemans_Bow) pipeline, then exported as a single `.glb` and loaded with
`GLTFLoader` + `DRACOLoader` (decoder assets under `public/draco/`).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which installs
with pnpm (Node 22), typechecks, runs the unit test suite, builds, and
publishes `dist/` to GitHub Pages (via the Actions source, not a
legacy branch-serve) automatically. No manual build step or committed
`dist/` folder is needed.
