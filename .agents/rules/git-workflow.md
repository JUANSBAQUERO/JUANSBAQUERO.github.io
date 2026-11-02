# Flujo de Git y Pull Requests — portfolio-threejs
## Estado: OBLIGATORIO

## Regla de oro
Nunca commitear directo a `main`. Todo cambio (feature, fix, chore) se
trabaja en una rama propia, cortada desde `main` actualizado, y se entrega
vía Pull Request — sin excepción por "es un fix chico" (decisión explícita
de Juan, 2026-11-02: siempre PR aunque sea auto-mergeable, para que quede
el historial de revisión).

## Flujo
1. `git branch --show-current` + `git log --oneline -3` primero — no asumir
   que la sesión sigue en la rama de una sesión anterior.
2. `git checkout main && git pull origin main`, luego
   `git checkout -b {tipo}/{slug}` (ej. `feat/project-case-study-modal`,
   `fix/stage-band-clipping`, `chore/agents-setup`).
3. Un branch por cambio lógicamente distinto — no apilar un fix no
   relacionado sobre una rama cuya PR ya está abierta.
4. Antes de commitear: `pnpm run typecheck`, `pnpm run test`,
   `pnpm run build` (Node 22 vía nvm, ver `.agents/PIPELINE.md` —
   Node 21.6.2 default rompe vitest/rolldown), `pnpm run format`.
5. `gh pr create --base main --head <rama>` con body que explique el
   qué/por qué/causa raíz — no solo un título.
6. **El agente nunca mergea el PR** — Juan aprueba y mergea manualmente (es
   el único reviewer disponible, pero el PR sigue siendo el paso formal).
7. Entregar el link del PR en la respuesta tan pronto se cree.
8. Toda PR no trivial trae su contrato en `.agents/SDD/contracts/` y su
   entrada en `REVIEW.md` — ver `rules/documentation-policy.md`.

## Excepciones
Ninguna sin autorización explícita de Juan en esa conversación.
