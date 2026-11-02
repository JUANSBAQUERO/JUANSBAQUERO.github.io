# Pipeline config — portfolio-threejs

Config que usa `agentic-dev-pipeline` (Builder → Auditor → QA → PR) para este
repo. Repo personal, un solo mantenedor (Juan) — no hay reviewer de equipo,
pero el pipeline SIEMPRE cierra en PR igual (decisión explícita de Juan,
2026-11-02: "siempre PR a main aunque sea auto-mergeable, para que quede el
historial de revisión"). Nunca push directo a `main`, ni siquiera para fixes
chicos.

## Rama base
`main` — es la única rama real del repo. Cada feature/fix sale de una rama
nueva creada desde `main` (nunca commitear directo sobre `main`).

## Cierre del pipeline
- Builder implementa en su rama.
- Auditor + QA corren vía `delegate_task` en subagentes aislados (igual que
  Datup) — nunca autoevaluación del Builder.
- Si ambos dan PASS: `git push -u origin <rama>` + `gh pr create --base main`.
- Juan revisa y mergea el PR él mismo (es el único reviewer disponible) —
  el pipeline nunca auto-mergea, solo deja el PR abierto y listo.

## Notificaciones
Sin Slack ni canal externo — este es un repo personal. Al terminar, el
resumen (qué se implementó, veredicto de Auditor/QA, link al PR) va en esta
misma conversación de chat. No hay Paso 6/7 de Datup (Slack devtools,
tracker externo) — no aplican a este repo.

## Build/test/lint
```bash
pnpm run typecheck   # tsc --noEmit
pnpm run test        # vitest run
pnpm run build       # tsc --noEmit && vite build
pnpm run format      # prettier --write
```

**Gotcha de entorno:** el Node activo por defecto en esta máquina (21.6.2)
rompe vitest/rolldown (`node:util` no exporta `styleText` hasta Node 21.7+).
Si los comandos de arriba fallan con ese error, correr con un Node más
nuevo vía nvm antes de concluir que algo está roto:
```bash
export PATH="/Users/mac/.nvm/versions/node/v22.22.3/bin:$PATH"
```
Esto es un problema de la máquina, no del repo — no "arreglarlo" cambiando
versiones en `package.json`.

## Verificación visual (acceptance-gate-playwright)
Este repo es mayormente UI/3D — casi todo cambio de código es Tipo B
(impacto visual observable). Levantar el dev server (`pnpm run dev`, con el
Node correcto del gotcha de arriba) y usar `browser_exec`
(screenshots + `vision_analyze`) como evidencia antes de reportar un PASS,
no solo `tsc`/build limpios.

## Fuera de alcance
Esto NO reemplaza las reglas de `threejs-webgl-development` (pitfalls de
Three.js/bloom/scroll) — esas siguen aplicando dentro de la implementación,
este archivo solo configura el pipeline de verificación/entrega.

## Estructura completa de .agents/ (adoptada del monorepo de Datup, 2026-11-02)
Este repo replica el patrón multi-agente de `datup-frontend` (capas +
perfiles + reglas + SDD), adaptado a un repo de un solo mantenedor sin apps
clon/tenants:
- `agent-library.yaml` — índice de capas/reglas/perfiles/referencias.
- `layers/{global,architect,builder,qa}/` — rol y responsabilidades de cada
  "agente" (Arquitecto decide spec vs. trivial, Builder implementa, QA
  verifica con evidencia real).
- `agents/profiles/*.yaml` — metadata de cada rol (scope, constraints).
- `rules/*.md` — git-workflow, testing-policy, pattern-respect,
  documentation-policy, token-optimization.
- `SDD/contracts/` + `SDD/features/` — contratos cortos por PR y specs Modo A
  para cambios no triviales.
- `REVIEW.md` (raíz del repo) — índice corto de PRs pendientes de revisión.

Si algo en esta carpeta contradice los skills de Hermes referenciados en
`agent-library.yaml`, el skill gana — corregir aquí, no al revés.

## Config de repo verificada (JUANSBAQUERO/JUANSBAQUERO.github.io, 2026-11-02)
- `delete_branch_on_merge: true` activado a nivel de repo — borra SOLO la
  rama head/feature al mergear un PR, nunca `main` (el borrado de head
  branch no toca la base por diseño de GitHub).
- `main` con branch protection: `allow_deletions: false`,
  `allow_force_pushes: false`, `enforce_admins: true` — no se puede borrar
  ni con permisos de admin. No volver a verificar esto cada vez; solo
  revisar de nuevo si algo reporta un comportamiento distinto.
