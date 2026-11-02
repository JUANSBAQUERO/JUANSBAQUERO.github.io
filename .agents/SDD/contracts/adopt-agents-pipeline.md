# Contract: Feature — adopt-agents-pipeline

task_id: adopt-agents-pipeline
spec_ref: N/A (chore de infraestructura de proceso, sin spec de 3 archivos)
approved_by: Juan
created_at: 2026-11-02
pr: {link, se llena al abrir el PR}

## Objetivo
Adoptar en este repo el mismo patrón multi-agente (`.agents/`) que usa el
monorepo de Datup — capas de rol (Arquitecto/Builder/QA), reglas explícitas
de git/testing/documentación, y contratos cortos por PR — para dejar de
depender de memoria/convención implícita en features y fixes futuros.

## Alcance
- Incluye: `.agents/agent-library.yaml`, `layers/{global,architect,builder,
  qa}/`, `agents/profiles/*.yaml`, `rules/*.md`, `SDD/contracts/` (plantillas),
  `REVIEW.md` en la raíz. Adaptación del patrón de Datup a un repo de un solo
  mantenedor sin apps clon ni tenants.
- No incluye: Slack, tracker externo (ClickUp/Jira), ni reglas de apps
  clon/tenants (R6) — no aplican a este repo de un solo app.

## Decisiones clave
- Pipeline siempre cierra en PR a `main`, nunca push directo, aunque Juan
  sea el único reviewer (decisión explícita, para dejar historial).
- Sin notificaciones externas (Slack/Telegram) — el resumen de cada
  pipeline queda en la conversación de chat.
- Rama base: `main` (único branch real del repo hoy).
- `REVIEW.md` no tiene campo "Tracker" (a diferencia de Datup) — este repo
  no usa ClickUp/Jira.

## Criterios de aceptación
- [x] `.agents/agent-library.yaml` referencia los skills de Hermes
      correctos (`agentic-dev-pipeline`, `threejs-webgl-development`).
- [x] Los 4 YAML de perfiles/library parsean sin error.
- [x] `REVIEW.md` existe en la raíz del repo.
- [x] `.agents/PIPELINE.md` (ya existente) queda enlazado desde la nueva
      estructura, sin duplicar su contenido.

## Validación realizada
`pnpm run typecheck` y `pnpm run test` (Node 22 vía nvm) — ambos en verde,
sin cambios de código de producción en este PR (solo archivos de proceso en
`.agents/` y `REVIEW.md`). Los 4 archivos `.yaml` se parsearon con
`python3 -c "import yaml..."` sin error.
