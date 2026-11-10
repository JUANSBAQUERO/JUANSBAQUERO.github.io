# Review — PRs pendientes

Índice corto de PRs abiertos esperando revisión de Juan. Una entrada se
agrega al abrir el PR y se elimina al mergearlo (el histórico completo
queda en `.agents/SDD/contracts/` y en `git log`). Ver
`.agents/rules/documentation-policy.md` para el formato.

## PR — feat: dedicated /changelog page + Lab project tags

**feat:** nueva página estática `/changelog.html` (entry point propio de
Vite, sin Three.js/Lenis/Analytics) que lista todas las entradas del Lab
con filtro por proyecto (Portfolio / Stack Rush / Finance OS) y selector
de idioma — reusa el mismo `content/locales/*` y `renderLabEntries` que
el sitio principal, cero duplicación de contenido. Cada `LabEntry` ahora
lleva un `project: LabProjectKey`, visible como badge en ambas vistas. El
Lab del sitio principal enlaza a la página completa ("Ver el changelog
completo →"). Pensado para que un post de LinkedIn apunte directo al
changelog sin forzar al lector a ver el recorrido 3D completo primero.

**bug:** N/A — feature nueva.

**cómo verificar:** `pnpm run build` genera `dist/changelog.html` +
bundle propio (`changelog-*.js/css`), separado del bundle `main-*`; abrir
`/changelog.html` en preview, confirmar que el filtro por proyecto oculta
entradas correctamente y que el selector EN/ES cambia todo el texto
visible (incluido el label "All"/"Todo"); en `/`, confirmar que el link
al final de la sección Lab lleva a `/changelog.html`.

PR: https://github.com/JUANSBAQUERO/JUANSBAQUERO.github.io/pull/10 ·
Contrato: `.agents/SDD/contracts/lab-changelog-page.md`
