# Review — PRs pendientes

Índice corto de PRs abiertos esperando revisión de Juan. Una entrada se
agrega al abrir el PR y se elimina al mergearlo (el histórico completo
queda en `.agents/SDD/contracts/` y en `git log`). Ver
`.agents/rules/documentation-policy.md` para el formato.

## PR — feat: brand identity refresh (color palette + favicon)

**feat:** reemplaza la paleta cian/magenta neón por un sistema de marca
juguetón (naranja ancla sin cambio + rosa chicle + mostaza) coherente con
la escena 3D real (atardecer, lámparas), y evoluciona el favicon de
iniciales genéricas "JB" a una silueta del personaje chibi.

**bug:** N/A — refresh de identidad visual, no corrige un defecto.

**cómo verificar:** cargar el sitio, confirmar que "Juan" en el hero es
rosa chicle (no magenta neón), que Lab se mantiene naranja, que
Skills/About/Experience usan mostaza y Projects/Contact rosa, en EN/ES y
mobile; revisar el favicon de la pestaña (silueta de cabeza, no "JB").

PR: https://github.com/JUANSBAQUERO/JUANSBAQUERO.github.io/pull/5 ·
Contrato: `.agents/SDD/contracts/brand-identity-refresh.md` · Spec:
`.agents/BRAND.md`
