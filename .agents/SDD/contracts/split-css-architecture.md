# Contract: Fix — split-css-architecture

task_id: split-css-architecture
spec_ref: N/A (chore de arquitectura, scoped directamente en conversación
  con Juan)
approved_by: Juan
created_at: 2026-11-02
pr: {link, se llena al abrir el PR}

## Objetivo
`main.css` creció a 1143 líneas mezclando tokens globales, el overlay de
la escena 3D, el chrome de navegación, el shell genérico de
`.beat-card`, y los estilos específicos de las 6 secciones de contenido
en un solo archivo. Dividirlo en archivos por responsabilidad, siguiendo
el mismo patrón de separación que ya usa `content/` y
`StationContentRenderer.ts` por sección.

## Alcance
- Incluye:
  - `base.css` — `:root` (tokens de marca), resets, tipografía global
    (`.editorial-accent`).
  - `stage.css` — `#journey-stage`, speech bubble, click-hint badge.
  - `navigation.css` — nav-pill, hamburger mobile, locale switcher, CTA.
  - `layout.css` — shell genérico `.beat`/`.beat-card` que extiende cada
    sección, más `.tags`/`.tag` compartido.
  - `sections/{hero,about,experience,projects,skills,lab,contact}.css`
    — SOLO los estilos propios de cada sección.
  - `footer.css`, `modals.css` — footer del sitio, modal legal + modal
    de detalle de proyecto (comparten el shell `.legal-modal`).
  - `main.css` pasa a ser un índice de `@import`, en orden deliberado
    para la cascada (ver Decisiones clave).
- No incluye: ningún cambio de contenido/valor de ninguna regla CSS, ni
  cambios de HTML/TS — refactor de pura reorganización de archivos.

## Decisiones clave
- Orden de `@import` importa para la cascada: `base` (tokens) primero
  porque todo lo demás usa `var(--accent-*)`; `modals.css` (z-index 100,
  el más alto del sitio) al final para ganar cualquier empate de
  especificidad por orden de aparición.
- Vite resuelve `@import` de CSS nativamente en build, sin config extra
  — confirmado que el CSS compilado final (`dist/assets/*.css`) pesa
  exactamente lo mismo antes y después (16.99 kB, byte idéntico).
- Cero cambio de contenido: cada selector/declaración se movió tal cual,
  verificado con un diff de conjunto de selectores (viejo vs. nueva
  concatenación en orden de import) — 0 perdidos, 0 agregados.

## Criterios de aceptación
- [x] Ningún selector/declaración CSS cambia de valor.
- [x] El CSS compilado final (`dist/assets/*.css`) pesa lo mismo antes y
      después del refactor.
- [x] Orden de `@import` respeta la cascada (tokens primero, modal
      z-index más alto al final).
- [x] Verificación visual real en las 6 secciones + mobile + modal legal
      sin ninguna diferencia respecto al estado anterior.

## Validación realizada
- `pnpm run typecheck` / `test` (21/21) / `build` (Node 22 vía nvm) —
  verde.
- Diff de selectores (script Python, viejo `main.css` vs. concatenación
  de los 13 archivos nuevos en orden de `@import`): 0 perdidos, 0
  agregados, 0 declaraciones distintas.
- Build comparado byte a byte: `dist/assets/*.css` idéntico en tamaño
  antes y después (16,992 bytes exactos).
- Verificación visual real (dev server + Playwright/CDP): recorrido de
  las 6 secciones de contenido (About/Experience/Projects/Skills/Lab/
  Contact), viewport mobile (390×844), y el modal de Aviso Legal — sin
  ninguna diferencia visual respecto al estado previo al refactor.
- Auditor aislado (`delegate_task`): PASS. Confirmó de forma
  independiente el mismo diff de selectores (150 bloques de regla
  idénticos en ambos lados), el orden correcto de `@import`, y el build
  comparado byte a byte entre `main` y esta rama.
