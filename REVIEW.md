# Review — PRs pendientes

Índice corto de PRs abiertos esperando revisión de Juan. Una entrada se
agrega al abrir el PR y se elimina al mergearlo (el histórico completo
queda en `.agents/SDD/contracts/` y en `git log`). Ver
`.agents/rules/documentation-policy.md` para el formato.

_Sin PRs pendientes todavía — este archivo se pobló al adoptar el flujo de
`.agents/` (2026-11-02). Los commits anteriores a esa fecha fueron push
directo a `main`, antes de que existiera esta regla._

## PR — chore: adopt .agents/ multi-agent pipeline (Datup pattern)

**chore:** adopta en este repo el patrón `.agents/` de Datup (capas
Arquitecto/Builder/QA, reglas de git/testing/documentación, contratos por
PR) adaptado a un repo de un solo mantenedor, sin apps clon ni tenants.

**bug:** N/A — infraestructura de proceso, no corrige un defecto.

**cómo verificar:** revisar que `.agents/agent-library.yaml` referencia
`agentic-dev-pipeline` y `threejs-webgl-development`; confirmar que los 4
YAML parsean y que `REVIEW.md` existe en la raíz.

PR: {link} · Contrato: `.agents/SDD/contracts/adopt-agents-pipeline.md`
