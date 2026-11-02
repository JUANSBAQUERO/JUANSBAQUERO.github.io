# Contract: Feature — posthog-analytics

task_id: posthog-analytics
spec_ref: N/A (chore chico, scoped directamente en conversación con Juan)
approved_by: Juan
created_at: 2026-11-02
pr: {link, se llena al abrir el PR}

## Objetivo
Medir si la gente ingresa al portfolio y hasta qué sección llega, para
que Juan sepa qué tan lejos leen los visitantes reales.

## Alcance
- Incluye:
  - `src/infrastructure/analytics/Analytics.ts` — wrapper fino sobre
    `posthog-js` (mismo patrón que `SmoothScroll.ts` envolviendo Lenis:
    solo este archivo importa la librería). Expone `init()` (no-op en
    localhost) y `trackSectionViewed(key)` (deduplicado por visita de
    página, vía un `Set` interno).
  - Wiring en `main.ts`: `analytics.init()` en `bootstrap()`, y
    `analytics.trackSectionViewed(activeBeatId)` dentro del bloque que
    ya detecta cambio de sección activa en `updateJourney()` — no se
    dispara por cada frame de scroll, solo al cruzar a una sección
    nueva.
  - `content/locales/{en,es}.ts`: el aviso legal se actualizó
    honestamente — ya NO dice "este sitio no usa analítica" (eso dejó
    de ser cierto). Ahora describe PostHog, aclara que no usa cookies
    publicitarias/no vende datos, y que se salta en localhost.
    "Hosting and third-party resources" también menciona a PostHog
    junto a GitHub Pages/Google Fonts.
  - `package.json`/`pnpm-lock.yaml`: nueva dependencia `posthog-js`.
  - `pnpm-workspace.yaml` nuevo: `onlyBuiltDependencies: [core-js]` para
    permitir el postinstall inofensivo de esa dependencia transitiva
    (solo imprime un mensaje de donación, confirmado leyendo su script).
- No incluye: dashboards/reportes custom (se usa el dashboard de PostHog
  directamente), ni opt-out/banner de cookies (PostHog no usa cookies
  publicitarias, no aplica bajo la política de privacidad declarada).

## Decisiones clave
- PostHog en vez de Google Analytics: no requiere banner de cookies, y
  el aviso legal ya promete explícitamente "no cookies publicitarias" —
  GA hubiera roto esa promesa.
- La API key pública de PostHog (`phc_...`) está hardcoded en
  `Analytics.ts` a propósito — es una client-side API key diseñada para
  ser pública (a diferencia de una API key de servidor), igual que
  cualquier analytics de cliente (GA, Plausible, etc. funcionan igual).
- Guard de `localhost`/`127.0.0.1`/string vacío evita contaminar los
  datos reales con tráfico de desarrollo — confirmado que NO hay ninguna
  llamada de red a dominios de PostHog en `pnpm run dev`.
- `trackSectionViewed` dedupe con un `Set` porque `RevealController` ya
  re-dispara `.is-revealed` en ambas direcciones de scroll (patrón
  conocido de este repo) — sin el dedupe, re-visitar una sección varias
  veces infla el conteo de "section_viewed" artificialmente.
- Evento único `section_viewed` (en vez de depender solo del scroll-depth
  automático de PostHog) porque en este sitio "hasta dónde llegó alguien"
  se mide mejor por SECCIÓN NOMBRADA (About/Experience/Projects/Skills/
  Lab/Contact) que por porcentaje de píxeles, dado que el layout
  alternado izquierda/derecha no tiene una altura uniforme por sección.

## Criterios de aceptación
- [x] `posthog-js` solo se importa desde `Analytics.ts`.
- [x] En `pnpm run dev` (localhost), cero requests de red a PostHog,
      `window.posthog` no existe.
- [x] `trackSectionViewed` solo dispara una vez por sección por carga de
      página, dentro del bloque de cambio de sección (no por scroll
      frame).
- [x] Aviso legal (EN/ES) ya no contiene ningún texto contradictorio
      tipo "no analytics" y menciona PostHog honestamente.
- [x] Cero cambio visual — analytics es completamente invisible para el
      visitante.

## Validación realizada
- `pnpm run typecheck` / `test` (21/21) / `build` (Node 22 vía nvm) —
  verde, desde una instalación limpia con `--frozen-lockfile` (mismo
  flag que usa el workflow de deploy real).
- Verificación de credenciales: POST directo al endpoint de ingestion de
  PostHog con la API key real → `200 {"status":"Ok"}`.
- Auditor aislado (`delegate_task`): PASS. Confirmó wrapper aislado (1
  solo import de `posthog-js` en todo `src/`), guard de localhost real,
  dedupe con `Set`, cero texto contradictorio ni bloques duplicados en
  el aviso legal, API key exacta sin typos.
- QA aislado (`delegate_task`): PASS. Confirmó con Playwright/CDP que en
  dev no hay ninguna request de red a dominios de PostHog, que el
  tracking solo dispara en cambio de sección (no por scroll frame), y
  que las 6 secciones de contenido se ven idénticas a antes del cambio,
  sin errores nuevos de consola.
