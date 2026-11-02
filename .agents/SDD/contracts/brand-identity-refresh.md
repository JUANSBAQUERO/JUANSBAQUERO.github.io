# Contract: Feature — brand-identity-refresh

task_id: brand-identity-refresh
spec_ref: N/A (chore de diseño, scoped directamente en conversación con Juan;
  ver `.agents/BRAND.md` como spec de color/tipografía/logo)
approved_by: Juan
created_at: 2026-11-02
pr: {link, se llena al abrir el PR}

## Objetivo
Reemplazar la paleta cian/magenta neón (genérica, "dashboard tech") por un
sistema de marca juguetón y coherente con la escena 3D real (atardecer,
lámparas, personaje chibi), con roles de color nombrados, y evolucionar
el favicon/logo de iniciales "JB" genéricas a una silueta del personaje.

## Alcance
- Incluye:
  - `.agents/BRAND.md` — documento de marca: paleta con roles
    (`--accent-primary` naranja sin cambio, `--accent-secondary` rosa
    chicle, `--accent-tertiary` mostaza), jerarquía tipográfica
    documentada (4 fuentes existentes, sin reducir), dirección del
    logo/favicon, y checklist de "fugas de marca" para verificación futura.
  - CSS: variables renombradas + todos los literales `rgba(76,243,255,X)`
    hardcoded reemplazados.
  - `content/portfolio.ts` + `content/locales/{en,es}.ts`: `accentHex` y
    colores de estación 3D reasignados según el mapeo (About/Experience/
    Skills → mostaza, Projects/Contact → rosa chicle, Lab → naranja sin
    cambio).
  - `StationContentRenderer.ts`: `PROJECT_TILE_COLORS` reducido de 6
    colores random a los 3 acentos de marca.
  - Fuga unificada: tags de Skills (antes verde fijo `#8fe0a8`) ahora usan
    `--accent-tertiary`.
  - `public/favicon.svg` nuevo (silueta de cabeza + pelo en 3 picos +
    punto rosa chicle) + PNGs derivados regenerados
    (`favicon-16/32.png`, `apple-touch-icon.png`, `favicon.ico`).
- No incluye: cambios al personaje 3D, voz de marca (ya resuelta en
  `personal-brand-voice`), ni reducción de las 4 familias tipográficas.

## Decisiones clave
- El naranja (`#FF8A3D`) se mantiene sin cambio — ya vive en la escena 3D
  real (lámparas/atardecer), es el ancla de la que se deriva el resto.
- 3 mockups de paleta se probaron en vivo sobre el sitio desplegado
  (override de CSS temporal, sin tocar el repo) antes de elegir: Juan
  escogió "Chibi pop" (rosa chicle + mostaza) por ser la más juguetona.
- Las 2 fugas de color (verde fijo en Skills, 6 colores random en tiles de
  Projects) se documentaron explícitamente en BRAND.md antes de
  corregirlas, para que futuros cambios no las reintroduzcan.
- Favicon construido en geometría simple (círculos/triángulos), no un path
  a mano libre — un primer intento con trazo orgánico resultó ilegible a
  16px y se descartó antes de aplicar.

## Criterios de aceptación
- [x] Ningún literal de la paleta vieja (`#4CF3FF`, `#FF4CD6`,
      `--accent-cyan`, `--accent-magenta`, `--accent-orange`) sobrevive en
      ningún archivo fuente.
- [x] Mapeo de color por sección aplicado consistentemente en CSS,
      content, locales, y `--beat-accent` inline de `index.html`.
- [x] Tags de Skills y tiles de Projects usan solo los 3 acentos de marca.
- [x] Favicon nuevo es XML válido, legible a 16px, reemplaza "JB".
- [x] Código coincide con `.agents/BRAND.md`.

## Validación realizada
- `pnpm run typecheck` / `test` (19/19) / `build` (Node 22 vía nvm) — verde.
- Auditor aislado (`delegate_task`): PASS. Confirmó diff de solo
  colores/hex/SVG (sin lógica tocada), cero literales viejos remanentes,
  mapeo correcto, SVG válido, código coincide con BRAND.md.
- QA aislado (`delegate_task`, patrón `acceptance-gate-playwright`): PASS.
  Verificación real vía Playwright/CDP (`getComputedStyle` en vivo, no solo
  capturas) en los 9 puntos del checklist + 3 casos de exploración libre,
  incluyendo un barrido global del DOM completo buscando cualquier
  `rgb(255,76,214)`/`rgb(76,243,255)` residual — cero resultados.
