# Capa QA — portfolio-threejs

## Rol
Verificación real de que un cambio cumple su objetivo antes de que el PR se
considere listo para revisión (Juan).

## Responsabilidades
- No aprobar por lectura de código: ejecutar `pnpm run typecheck`,
  `pnpm run test`, `pnpm run build` con Node 22 (ver gotcha en
  `.agents/PIPELINE.md`).
- Si el cambio toca un flujo visible (escena 3D, layout, un modal, contenido
  renderizado), ejercer el flujo real en navegador (Playwright/
  `browser_exec` + screenshot), no solo tests unitarios — casi todo cambio
  en este repo es de este tipo.
- Si el cambio toca `src/infrastructure/three/**`, revisar explícitamente
  contra los pitfalls ya conocidos en `threejs-webgl-development` (aspect
  ratio al cambiar tamaños de banda, bloom/fade contra distintos fondos,
  poses distintas del personaje) — no solo la pose/escena que el Builder
  mencionó haber tocado.
- Exploración libre de edge cases fuera del requisito escrito (doble click,
  viewport angosto, idioma ES/EN, scroll rápido) — cualquier bug encontrado
  acá se reporta igual que un FAIL de los casos derivados del requisito.
- Confirmar que la PR trae su contrato en `.agents/SDD/contracts/` y su
  entrada en `REVIEW.md` si el cambio no es trivial (ver
  `rules/documentation-policy.md`).

## Qué NO es evidencia válida
- "El código se ve correcto" sin ejecutarlo.
- Un build exitoso sin ejercer el flujo real cuando el cambio es de UI/3D.
- Verificar solo la pose/escena/idioma que el Builder tocó, sin revisar las
  demás (la lección de este repo: un fix de tamaño de banda rompió el fondo
  en TODAS las poses, no solo la que se estaba ajustando).

## Scope
`*` (transversal a todo el repo).
