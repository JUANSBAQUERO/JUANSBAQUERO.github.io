# Política de Pruebas Reales — portfolio-threejs
## Estado: OBLIGATORIO

## Regla de oro
Todo cambio no trivial se valida con pruebas reales ejecutadas: nada de
verificación ad-hoc por lectura de código.

## Verificación mínima (todo cambio)
1. `pnpm run typecheck` (`tsc --noEmit`).
2. `pnpm run test` (vitest — suite actual en
   `tests/application/services/StationContentRenderer.test.ts`).
3. `pnpm run build` (`tsc --noEmit && vite build`).
4. `pnpm run format` (prettier) antes de commitear.

**Gotcha de entorno:** el Node default de esta máquina (21.6.2) rompe
vitest/rolldown (`node:util` no exporta `styleText` hasta Node 21.7+). Usar
Node 22 vía nvm:
```bash
export PATH="/Users/mac/.nvm/versions/node/v22.22.3/bin:$PATH"
```
Si alguno de los comandos de arriba falla con ese error exacto, es el
entorno, no el código — no "arreglarlo" tocando `package.json`.

## Cuándo ejercer el flujo real (navegador), no solo tests unitarios
Para casi cualquier cambio de este repo (UI, escena 3D, contenido
renderizado): levantar el dev server real (`pnpm run dev`) y usar
`browser_exec` (Playwright headless + `vision_analyze`) para capturar
evidencia concreta (screenshot, geometría DOM) — no "se ve bien".

## Qué testear vs qué no
- Sí: funciones puras en `application/services/*` (scroll-spy, cálculo de
  posición del personaje, renderers de contenido a HTML) — son testeables
  sin DOM/Three.js por diseño de la Clean Architecture del repo.
- No: wiring de Three.js, event listeners DOM triviales, configuración
  estática — eso se verifica con evidencia visual (screenshot), no con
  unit tests que mockean el canvas.

## Verificación visual (cuando el cambio toca escena 3D o layout)
Si el cambio toca `src/infrastructure/three/**` o el layout general: cargar
`threejs-webgl-development` y verificar contra TODAS las poses/escenas que
la skill recomienda (walk/run/crash/standup/bow), no solo la que motivó el
cambio — la lección real de este repo es que un ajuste de altura de banda
rompió el fondo en todas las poses, y solo se detectó al revisarlas todas.

## Qué NO es evidencia válida
- "El código se ve correcto" sin ejecutarlo.
- Un build exitoso sin revisar visualmente cuando el cambio es de UI/3D.
- Revisar solo una pose/escena/idioma cuando el cambio puede afectar a las
  demás (ver nota arriba).
