# Contract: Feature — personal-brand-voice

task_id: personal-brand-voice
spec_ref: N/A (no 3-file spec; scoped directly from conversation with Juan)
approved_by: Juan
created_at: 2026-11-02
pr: {link, filled in below}

## Objetivo
Adoptar una marca personal distintiva para el portafolio (no genérica) a partir
del feedback original del hermano de Juan + una sesión de definición de marca:
tono con humor/confianza, el personaje 3D como eje central, y contenido real
(no inventado) sobre en qué está trabajando Juan ahora mismo.

## Alcance
- Incluye:
  - Frase-hero con voz propia (reemplaza "I build full-stack software" por
    algo distintivo en ambos idiomas).
  - Nueva sección "Lab"/"Laboratorio" (`LabContent` + `renderLabEntries`) con
    3 entradas reales y fechadas (pipeline multi-agente de este mismo repo,
    el rediseño del stage 3D, FinanceOS).
  - Easter egg de click sobre el personaje: raycasting contra su malla,
    animación de squash/stretch (`JourneyCharacter.triggerClickBounce`),
    speech bubble con 6 chistes por idioma, sin repetir el mismo dos veces
    seguidas.
  - Badge "psst — click him" mostrado una vez (localStorage), descartado al
    hacer click o scroll.
  - Microcopy con voz: caption del loader, hint de click.
- No incluye: cambios a la paleta de colores/tipografía global, ni al diseño
  del personaje 3D en sí (se mantiene el chibi anime existente, pedido
  explícito de Juan).

## Decisiones clave
- El easter egg de click vive en un sistema de animación SEPARADO
  (squash/stretch por escala del group) del state machine de clips de
  scroll — evita pelear con el clip activo (walk/run/crash/etc.).
- Contenido del Lab sacado de trabajo real ya hecho en esta sesión (nada
  inventado) — ver `content/locales/{en,es}.ts`.
- Pipeline completo corrido: Builder (esta consola) → Auditor (aislado,
  2 rondas) → QA (aislado, acceptance-gate-playwright con exploración
  libre) → ambos PASS → PR.

## Criterios de aceptación
- [x] Frase-hero distintiva, no genérica, en ambos idiomas.
- [x] Nav "Lab"/"Laboratorio" lleva a una sección con contenido real fechado.
- [x] Click sobre el personaje (no sobre vacío) dispara bounce + speech
      bubble; click en vacío no hace nada (hit-test preciso).
- [x] Triple-click rápido / click durante fade-out no deja la bubble en
      estado inconsistente (bug de carrera real encontrado y corregido en
      Ronda 1 del Auditor, confirmado arreglado en Ronda 2 + por QA).
- [x] Hint de click aparece una vez, se descarta, no reaparece tras reload.
- [x] Cambio de idioma EN↔ES traduce el 100% del texto nuevo, sin residuos.
- [x] Exploración libre de QA (4 casos fuera del requisito escrito): sin
      bugs nuevos.

## Validación realizada
- `pnpm run typecheck` / `test` / `build` (Node 22 vía nvm) — verde en cada
  ronda.
- Auditor aislado (`delegate_task`), 2 rondas: Ronda 1 encontró un race
  condition real en los timers del speech bubble (reutilización de un
  `setTimeout` interno no cancelado); corregido; Ronda 2 confirmó el fix
  sin nuevos hallazgos de seguridad/lógica.
- QA aislado (`delegate_task`, patrón `acceptance-gate-playwright`):
  verificación real con Playwright/CDP — screenshots, sweep de coordenadas
  de click, pruebas de timing exactas sobre el ciclo de 2200ms+250ms del
  speech bubble, viewport móvil, y 4 casos de exploración libre. VEREDICTO:
  PASS, evidencia completa en el transcript de la delegación.
- Observación no bloqueante de QA: warning preexistente
  `JourneyCharacter: unknown clip "Walking"` en consola durante HMR de dev
  — confirmado independiente de este cambio (aparece con o sin interacción
  con el personaje), no se investiga en este PR.
