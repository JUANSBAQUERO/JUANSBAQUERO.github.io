# Contract: Feature — layout-reveal-animations

task_id: layout-reveal-animations
spec_ref: N/A (scoped directly from conversation with Juan)
approved_by: Juan
created_at: 2026-11-02
pr: {link, filled in below}

## Objetivo
Responder al feedback: "ajusta el layout del contenido, quiero animaciones
de entrada y salida y que no sea tan lineal". Romper la sensación de
"una sola columna centrada scrolleando" sin tocar el personaje 3D ni el
contenido, y sin requerir fotos/imágenes reales todavía (decisión de
Juan: variedad visual con decorativos por ahora, no fotos).

## Alcance
- Incluye:
  - `RevealController` (IntersectionObserver) que togglea `.is-revealed`
    en AMBAS direcciones (no one-shot) sobre cada `.beat-card` — entra en
    viewport con fade+slide, sale si se scrollea de vuelta, y repite la
    entrada si se vuelve a bajar.
  - Layout no-lineal: alineación alternada izquierda/derecha por sección
    (About/Projects/Lab a la izquierda, Experience/Skills a la derecha,
    Hero/Contact centrados) vía clases `.beat--align-start`/`--align-end`,
    neutralizada a `center` en mobile (<=760px) para no empujar la card
    contra el borde de pantalla.
  - Halo decorativo: radial-gradient blur por sección, tintado con el
    accentHex propio de esa sección (`--beat-accent` inline en
    `index.html`), del lado opuesto a la card.
  - Stagger por item: `--stagger-index` (índice del array) en cada
    `.job`/`.proj-card`/`.skill-group`/`.lab-entry`, con
    `transition-delay: calc(var(--stagger-index) * 70ms)` — las listas
    aparecen una por una, no todas de golpe.
  - Respeta `prefers-reduced-motion: reduce`: salta el observer por
    completo y marca todo revelado de inmediato
    (`RevealController.revealAllImmediately`).
- No incluye: fotos/imágenes reales (pendiente de que Juan las aporte o
  decida avanzar con generación), cambios al personaje 3D o a los clips
  de animación.

## Decisiones clave
- Togglear en ambas direcciones (no `once: true`) fue deliberado — un
  reveal de una sola vez no se siente como "una secuencia de beats", se
  siente como una página estática normal con un fade al cargar.
- El stagger vive en CSS puro (`--stagger-index` + `calc()`), no en JS
  con `setTimeout` por item — más barato, no se desincroniza si el
  usuario resizea o cambia de idioma (re-renderiza el HTML con el mismo
  índice).
- `RevealController` usa un factory de IntersectionObserver inyectable
  para ser unit-testable sin jsdom (el proyecto corre vitest en entorno
  `node`, no `jsdom`) — mismo patrón de inyectar dependencias de browser
  que ya usa el resto del código base.

## Criterios de aceptación
- [x] Entrada: opacidad pasa de bajo/cero a 1 al entrar al viewport.
- [x] Salida: opacidad vuelve a bajo/cero al scrollear fuera del viewport
      (no es one-shot).
- [x] Re-entrada: vuelve a subir a 1 si se vuelve a scrollear hacia la
      sección.
- [x] Al menos 3 secciones con alineación distinta (no todas centradas).
- [x] Items de una lista aparecen escalonados, no todos a la vez.
- [x] Nav "Laboratorio" y el easter egg de click del personaje (features
      de rondas anteriores) siguen funcionando sin regresión.
- [x] Mobile (390×844): las secciones alineadas se recentran, sin
      recortes ni desbordes.
- [x] `prefers-reduced-motion: reduce`: todo visible de inmediato, sin
      depender del scroll.

## Validación realizada
- `pnpm run typecheck` / `test` (13/13, incl. 5 tests nuevos para
  `RevealController` con un fake IntersectionObserver inyectado) /
  `build` — verde.
- Auditor aislado (`delegate_task`): PASS, sin hallazgos de seguridad ni
  lógica; confirmó que `main.ts` no tocó la lógica de timers del speech
  bubble de una ronda anterior.
- QA aislado (`delegate_task`, patrón `acceptance-gate-playwright`):
  PASS en los 8 criterios (a-h) con evidencia medida (opacidad real vía
  `getComputedStyle`, no solo capturas), incluyendo 2 casos de
  exploración libre (scroll rápido entre 8 secciones sin queries, y
  `prefers-reduced-motion` emulado vía CDP) — sin bugs.
