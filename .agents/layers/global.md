# Capa global — portfolio-threejs

## Propósito
Portafolio personal interactivo en 3D (Vite + TypeScript + Three.js, un solo
app, sin backend) — no un monorepo multi-app como `datup-frontend`, así que
no hay reglas de apps clon (R6), tenants, ni white-labeling. Un solo
mantenedor (Juan), sin equipo.

## Fuente de verdad viva
El flujo de pipeline (Builder → Auditor → QA → PR) vive en el skill de
Hermes `software-development/agentic-dev-pipeline` — **no se duplica aquí**.
Los pitfalls específicos de Three.js/WebGL/scroll viven en
`software-development/threejs-webgl-development`. Cualquier agente que no
cargue skills de Hermes (Claude Code, Codex vía CLI) debe leer las
capas/reglas bajo `layers/` y `rules/` como resumen operativo equivalente.
Si algo en esta carpeta contradice un skill, el skill gana — corregir aquí.

## Principios obligatorios
- Nunca commitear directo a `main` — toda rama sale de `main` actualizado,
  todo cambio entra por PR (ver `rules/git-workflow.md`). Sin excepción por
  "es un fix chico", decisión explícita de Juan (2026-11-02).
- Para features/fixes con lógica o UI real (no un typo/config trivial),
  correr el pipeline completo: Auditor y QA en subagentes aislados vía
  `delegate_task`, nunca autoevaluación del Builder.
- Verificar con pruebas reales ejecutadas (build, typecheck, test, y
  evidencia visual con Playwright/screenshot para UI) — no por lectura de
  código. Ver `rules/testing-policy.md`.
- Toda PR no trivial trae su contrato en `.agents/SDD/contracts/` y su
  entrada en `REVIEW.md` — ver `rules/documentation-policy.md`.

## Referencias
- Config del pipeline (rama base, cierre, comandos): `.agents/PIPELINE.md`.
- Specs Modo A (`requirements.md`/`design.md`/`tasks.md`) para cambios no
  triviales: `.agents/SDD/features/<slug>/`.
- Contratos (resumen corto por PR, histórico durable): `.agents/SDD/contracts/`.
- Índice de PRs pendientes de revisión: `REVIEW.md` (raíz del repo).
- Reglas: `.agents/rules/`.
