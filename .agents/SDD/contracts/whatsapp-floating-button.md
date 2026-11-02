# Contract: Feature — whatsapp-floating-button

task_id: whatsapp-floating-button
spec_ref: N/A (chore chico, scoped directamente en conversación con Juan)
approved_by: Juan
created_at: 2026-11-02
pr: {link, se llena al abrir el PR}

## Objetivo
Botón flotante de WhatsApp (fixed, esquina inferior derecha) con estilo
chibi/juguetón, consistente con el brand refresh ya mergeado, para que
cualquier visitante pueda escribirle a Juan directo con un mensaje
precargado.

## Alcance
- Incluye:
  - `<a id="whatsappFloat">` fixed bottom-right en `index.html`, con el
    ícono cara+teléfono (PNG generado con Meshy AI, ver abajo) en vez de
    un SVG vectorial genérico.
  - CSS `.whatsapp-float`: círculo rosa chicle (`--accent-secondary`),
    rebote idle continuo vía `@keyframes`, hover/focus con
    escala+sombra (sin cambio de color de fondo, la imagen ya trae su
    fondo propio pintado), versión reducida en mobile (<=480px).
  - `buildWhatsappHref(phone, message)` — función pura en
    `StationContentRenderer.ts`, construye el link `wa.me` con
    `encodeURIComponent` sobre el mensaje (cubre acentos/signos ¡¿).
  - `WHATSAPP_PHONE_E164` en `content/portfolio.ts` — número real de
    Juan en formato E.164 digits-only (sin `+`), como exige wa.me.
  - `whatsappLabel` / `whatsappMessage` nuevos en `UiStrings`
    (`content/LocaleContent.ts`), con copy real en EN/ES (mensaje
    precargado distinto, aria-label traducido).
  - Wiring en `main.ts`: `applyLocale` setea `href`/`aria-label` del
    botón cada vez que cambia el idioma.
  - 2 tests nuevos para `buildWhatsappHref` (mensaje simple + mensaje con
    acentos/signos, round-trip de decodificación).
  - **Segunda ronda**: ícono del botón reemplazado por una imagen real
    (Meshy AI, aportada por Juan) — mitad izquierda la cara del
    personaje 3D chibi, mitad derecha el glifo de teléfono de WhatsApp,
    sobre fondo rosa chicle (`public/images/whatsapp-icon.png`).
  - **Segunda ronda**: `public/favicon.svg` reemplazado — de la silueta
    geométrica simple (círculos/triángulos, PR #5) a un `<image>`
    embebido en base64 con la cara real del personaje (Meshy AI,
    aportada por Juan) sobre fondo navy. PNGs derivados
    (`favicon-16/32.png`, `apple-touch-icon.png`, `favicon.ico`)
    regenerados desde ese mismo render.
- No incluye: debounce de clicks repetidos (ver nota de QA abajo, no
  bloqueante), ni un fallback no-JS del link (el sitio entero ya depende
  100% de JS, consistente con el resto).

## Decisiones clave
- Color: rosa chicle por defecto + naranja en hover — reutiliza los 2
  acentos ya establecidos en el brand refresh, sin introducir un 4to
  color de marca (se consideró y descartó el verde WhatsApp clásico).
- Rebote idle continuo (no solo transform en hover) es lo que lo hace
  leer "chibi/juguetón" en vez de un botón de chat corporativo estático
  — pedido explícito de Juan.
- `z-index: 60` — estrictamente entre `.nav-pill`/`.top-right-controls`
  (50, siempre visible por encima) y `.legal-modal-overlay` (100, el
  modal sigue tapándolo correctamente cuando está abierto).
- Mensaje precargado (no chat vacío) — pedido explícito de Juan, copy
  real en ambos idiomas, no un placeholder genérico.

## Criterios de aceptación
- [x] Visible y fixed en todas las secciones, nunca tapado.
- [x] Rebote idle visible, se detiene bajo `prefers-reduced-motion`.
- [x] Hover cambia de rosa a naranja.
- [x] Link apunta a `wa.me/573214915457` con mensaje precargado legible
      tras decodificar.
- [x] aria-label no vacío, traducido EN/ES.
- [x] Mobile: botón proporcionalmente más chico, no tapa nav ni contenido.
- [x] Modal legal sigue tapando el botón correctamente (stacking order).

## Validación realizada
- `pnpm run typecheck` / `test` (21/21, incl. 2 tests nuevos) / `build`
  (Node 22 vía nvm) — verde.
- Auditor aislado (`delegate_task`): PASS. Confirmó número E.164 exacto,
  encoding de URL correcto, z-index en rango correcto, textos EN/ES sin
  placeholders, `prefers-reduced-motion` cubierto por la regla global
  existente sin lógica nueva.
- QA aislado (`delegate_task`, patrón `acceptance-gate-playwright`):
  PASS en 9 puntos de checklist + 2 exploraciones libres, con evidencia
  real vía Playwright/CDP (hover simulado con `Input.dispatchMouseEvent`,
  click real que abrió la pestaña de WhatsApp, animación confirmada
  comparando posición Y en dos capturas). Nota no bloqueante de QA:
  clicks rápidos repetidos abren una pestaña por click (comportamiento
  nativo de `<a target="_blank">`, sin debounce) — posible mejora UX
  futura, no se considera bug de este alcance.
- **Segunda ronda** (ícono real + favicon): `xmllint --noout` confirma
  `favicon.svg` válido (sin el bug de `--` dentro de comentario XML que
  ya ocurrió una vez en este repo). `typecheck`/`test`/`build` vuelven a
  pasar verde. Auditor aislado: PASS (tamaño de `favicon.svg` ~28KB
  razonable, `whatsapp-icon.png` confirmado RGBA con transparencia real,
  sin selectores CSS huérfanos tras el cambio svg→img). QA aislado: PASS
  — zoom al ícono del botón confirma cara+teléfono sin artefactos de
  recorte, rebote idle sigue activo, hover sigue dando escala+sombra
  (sin cambio de color, cambio intencional), favicon muestra la cara
  real en vez de la silueta/iniciales anteriores, mobile proporcional,
  click real sigue abriendo wa.me con el mensaje correcto, visible en
  las 6 secciones sin regresiones.
