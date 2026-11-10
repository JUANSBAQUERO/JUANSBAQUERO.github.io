# Contract: Feature — lab-changelog-page

task_id: lab-changelog-page
spec_ref: N/A (chico, sin spec de 3 archivos — acordado directo con Juan)
approved_by: Juan
created_at: 2026-11-09
pr: https://github.com/JUANSBAQUERO/JUANSBAQUERO.github.io/pull/10

## Objetivo
Dar a Juan una vista dedicada y ligera del changelog de sus proyectos
personales (Stack Rush, Finance OS, Portfolio) para enlazar desde posts
de LinkedIn — el post es un abrebocas, el changelog completo vive en el
portfolio, nunca al revés.

## Alcance
- Incluye: página `/changelog.html` (entry point propio de Vite),
  `LabEntry.project` tipado (`LabProjectKey`), filtro por proyecto +
  selector de idioma en la nueva página, badge de proyecto en el Lab
  del sitio principal, link cruzado "Ver el changelog completo →".
- No incluye: RSS/sitemap del changelog, paginación (la lista completa
  de entries cabe sin problema por ahora), página de detalle por
  entrada individual.

## Decisiones clave
- **Página estática separada vs. ruta SPA vs. ancla `#lab`**: se eligió
  una página Vite multi-entry (`vite.config.ts` nuevo) que reusa el
  contenido real de `content/locales/*` y `renderLabEntries` — evita la
  duplicación de contenido de una página HTML standalone (opción
  descartada) y evita cargar Three.js/Lenis innecesariamente como pasaría
  con un simple anchor `#lab` a la SPA completa (opción descartada).
- **`LabProjectKey` como union type cerrado** en vez de `string` libre:
  fuerza a declarar cada proyecto nuevo en un solo lugar (`Station.ts`)
  antes de poder usarlo en una entry, evitando typos silenciosos que
  rompan el filtro.
- **El link va del post hacia el portfolio, nunca al revés**: la primera
  iteración tenía un link saliente del Lab hacia LinkedIn — se revirtió
  tras feedback de Juan porque resta tráfico en vez de sumarlo.

## Criterios de aceptación
- [x] `/changelog.html` compila como entry point independiente (bundle
      JS/CSS propio, confirmado en `dist/` tras `vite build`).
- [x] El filtro por proyecto oculta/muestra entries correctamente.
- [x] El selector de idioma cambia todo el texto visible de la página.
- [x] El Lab del sitio principal muestra el badge de proyecto por entry.
- [x] El link "Ver el changelog completo →" lleva a `/changelog.html`.
- [x] `filterLabEntriesByProject` cubierto por tests unitarios (3 casos).

## Validación realizada
- `npx tsc --noEmit -p tsconfig.json` → 0 errores.
- `npx vitest run` → 25/25 tests pasando (4 nuevos: `renderLabEntries`
  con project badges + 3 casos de `filterLabEntriesByProject`).
- `npx vite build` → genera `dist/changelog.html`,
  `dist/assets/changelog-*.js`, `dist/assets/changelog-*.css` separados
  del bundle `main-*`, sin errores ni warnings nuevos.
- Verificación visual real (Playwright/browser_exec contra
  `vite preview`): screenshot de `/changelog.html` con el filtro "Stack
  Rush" activo mostrando solo 1 entrada; screenshot de `/` confirmando
  badges de proyecto visibles en la sección Lab y el link
  `#labChangelogLink` presente con `href="/changelog.html"`.
