# SPEC: Fidelidad de interacción con david-hckh.com (v2)

## Contexto
Análisis en vivo de https://david-hckh.com/ (Playwright + DevTools) reveló
que su patrón real es más simple que la v1 de nuestro redisño:

- Three.js + modelos `.glb` reales (no procedural) + Lenis smooth-scroll.
- El personaje **NO está en hologram todo el tiempo**. Por sección:
  - Hero: color normal, escena con props, fondo crema.
  - About: ÚNICA sección con efecto hologram/wireframe cian + scan-line +
    piso de grid + pedestal + contador. Fondo azul oscuro sólido.
  - Experience/Skills: (inferir del patrón — tratarlas como "color normal"
    salvo que el usuario pida lo contrario) fondo de color de sección,
    personaje a color normal, pose que cambia sutilmente.
  - Projects: personaje OCULTO por completo. Grid a pantalla completa,
    sin restricción de layout por el stage.
  - Contact: personaje a color normal, pose brazos cruzados, fondo crema
    con props de contacto.

## Decisión del usuario (clarify)
1. Ajustar al patrón real: hologram SOLO en About; color normal en
   Hero/Experience/Skills/Contact; oculto en Projects.
2. Agregar Lenis para smooth-scroll.

## Fases

### Fase 1 — Lenis smooth-scroll
- `pnpm add lenis`
- Nuevo `src/infrastructure/scroll/SmoothScroll.ts`: wrapper fino que
  inicializa Lenis, expone `on('scroll')` y un `raf` loop integrado al
  loop de render de `CharacterScene` (un solo rAF, no dos compitiendo).
- Verificar que `ScrollSpy`/`computeActiveSectionKey` sigue funcionando
  igual (Lenis dispara eventos de scroll normales + actualiza
  `window.scrollY` si se configura `autoRaf`/`wrapper` default).
- Test manual con Playwright: confirmar que el scroll se siente
  interpolado (no es testeable por unit test, es UX).

### Fase 2 — Modo de personaje por sección (hologram solo en About)
- Extender `CharacterPoseService`/`StageBackground` (o nuevo
  `CharacterVisibilityService` puro) con una función
  `resolveCharacterMode(station: StationKey | null): 'normal' | 'hologram' | 'hidden'`
  - hero -> 'normal' (ya chico, sin cambios)
  - about -> 'hologram' (comportamiento actual, el único que se queda)
  - experience, skills, contact -> 'normal'
  - projects -> 'hidden'
- `Character.ts`: exponer un método `setHologramIntensity(0..1)` o
  `setMode(mode)` que alterne entre materiales normales (color) y los
  `hologramMaterials` (wireframe cian), en vez de que el hologram esté
  siempre activo.
- `CharacterStage.ts`: cuando mode==='hidden', ocultar el grupo entero
  (`visible=false`) — así no compite con el grid de Projects.
- Unit tests puros para `resolveCharacterMode` (una tabla de casos,
  igual que ScrollSpy/CharacterPoseService).

### Fase 3 — Projects a pantalla completa
- Quitar el wrapper `.side-rail--projects` de Projects (ya no hace falta
  si el personaje está oculto ahí) — volver a grid de 2 columnas a
  ancho completo, más fiel al original.
- Verificar con Playwright que no hay regresión de overlap (no debería
  haberla: el personaje está invisible en esa sección).

### Fase 4 — Verificación + deploy
- typecheck, test, build limpios.
- Playwright: recorrer las 6 secciones (Hero/About/Experience/Projects/
  Skills/Contact) confirmando el modo correcto de personaje en cada una.
- Commit + push; confirmar CI verde y sitio en vivo
  (https://juansbaquero.github.io/) con smooth-scroll + hologram solo
  en About + Projects a pantalla completa.

## No-goals (explícitamente fuera de esta iteración)
- No se reemplaza la geometría procedural por un modelo `.glb` real
  (el usuario lo descartó por ahora).
- No se replica el audio/voz ("Music produced by...") del sitio
  original — no fue pedido.
- No se replica el selector de idioma (DE) ni GitHub/X social icons
  extra salvo que ya existan en el contenido actual.
