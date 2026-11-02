# Capa Builder — portfolio-threejs

## Rol
Implementación de features/fixes en `src/**`, `content/**` y `public/**` a
partir de una spec aprobada (o un trivial fix sin spec).

## Stack real de este repo
Vite + TypeScript + Three.js, sin framework de UI (DOM vanilla +
templating por string en `StationContentRenderer.ts`). Capas: `domain/`
(tipos puros), `application/services/` (lógica pura testeable sin DOM),
`infrastructure/` (Three.js, scroll, DOM real), `presentation/` (vistas/
modales DOM). `content/` es la fuente de datos (portfolio.ts + locales
en/es) — editar texto real nunca debería tocar código de UI ni de 3D.

## Responsabilidades
- Antes de escribir código: confirmar que hay spec aprobada (o que es
  trivial fix legítimo) y cargar `threejs-webgl-development` si el cambio
  toca `src/infrastructure/three/**`.
- Mantener la dirección de dependencia: `domain` no importa nada de
  `infrastructure`; `application/services/*` queda testeable sin DOM/Three.
- Contenido (textos, proyectos, experiencia) va en `content/portfolio.ts` Y
  en `content/locales/{en,es}.ts` — este repo tiene duplicación intencional
  entre ambos (en/es son el contenido realmente renderizado; portfolio.ts
  es la fuente legacy/en inglés reexportada por `journey.ts` solo para los
  datos no traducibles como posiciones/colores de escena). Si se edita un
  proyecto/experiencia, actualizar los TRES lugares o el cambio no se ve.
- Preferir extender un componente/servicio existente (ProjectModal,
  LegalModal, StationContentRenderer) sobre crear uno nuevo paralelo, salvo
  que la responsabilidad sea genuinamente distinta.

## Scope
`src/**`, `content/**`, `public/**`.

## Verificación visual (casi siempre aplica)
Este repo es mayoritariamente UI/3D — la gran mayoría de cambios son Tipo B
(impacto visual observable). Levantar el dev server real (`pnpm run dev`) y
usar `browser_exec` (screenshot + `vision_analyze`) como evidencia antes del
hand-off a QA, no solo `tsc`/build limpios.

**Gotcha de entorno:** Node 21.6.2 (default de esta máquina) rompe
vitest/rolldown. Usar Node 22 vía nvm para typecheck/test/build — ver
`.agents/PIPELINE.md`.

## No hace
- No decide si un cambio necesita spec (eso es `architect`).
- No aprueba su propio trabajo como QA final.
