# Review — PRs pendientes

Índice corto de PRs abiertos esperando revisión de Juan. Una entrada se
agrega al abrir el PR y se elimina al mergearlo (el histórico completo
queda en `.agents/SDD/contracts/` y en `git log`). Ver
`.agents/rules/documentation-policy.md` para el formato.

## PR — refactor: split main.css into per-concern files

**refactor:** `main.css` (1143 líneas) dividido en 13 archivos por
responsabilidad (tokens, stage 3D, nav, shell genérico de beats, una
sección por archivo, footer, modales), siguiendo el mismo patrón de
separación que ya usa `content/` por sección. `main.css` queda como
índice de `@import`. Cero cambio de contenido de ninguna regla.

**bug:** N/A — refactor de pura reorganización, sin cambio visual.

**cómo verificar:** confirmar que el sitio se ve exactamente igual en
todas las secciones (About/Experience/Projects/Skills/Lab/Contact),
mobile, y el modal legal; el CSS compilado (`dist/assets/*.css`) debe
pesar lo mismo que antes.

PR: https://github.com/JUANSBAQUERO/JUANSBAQUERO.github.io/pull/7 ·
Contrato: `.agents/SDD/contracts/split-css-architecture.md`
