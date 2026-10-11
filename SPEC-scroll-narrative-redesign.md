# SPEC: Scroll-Narrative Portfolio Redesign

## Contexto
Migración completa del portfolio de un mundo FPS explorable (WASD + mouse-look)
a una experiencia de scroll narrativo inspirada en https://david-hckh.com/:
un personaje 3D procedural fijo en un panel centrado, que cambia de pose y
el fondo cambia de color según la sección de scroll activa (About/Experience/
Projects/Skills/Contact), con nav pill flotante y scroll-spy.

## Estado al iniciar esta sesión
- Arquitectura de capas (domain/application/infrastructure/presentation) ya
  existe y se mantiene.
- Personaje procedural (cápsulas/esferas) construido, con pose lerp, efecto
  hologram-scan funcionando, ojos agregados para orientación frontal.
- CSS reestructurado con sistema `.side-rail` reutilizable para que el texto
  nunca se corte contra el panel del personaje.
- Verificado con Playwright: Hero ✅, About ✅, Experience ✅ (sin cortes de
  texto, pose aplicada, hologram-scan visible).
- 29 tests unitarios pasando, typecheck limpio.
- **Nada commiteado todavía** — todo vive en el working tree sin commit.
- Dev server de pruebas anteriores killeado (sin procesos sueltos).

## Fases

### Fase 1 — Verificación visual restante (Projects, Skills, Contact)
- [ ] Levantar dev server, navegar y hacer scroll hasta Projects.
- [ ] Verificar: grid de 2 columnas, tiles de color por proyecto, sin overlap
      con el stage (usa `.content-section--wide`, no `.side-rail` — revisar
      si necesita el mismo fix de ancho).
- [ ] Scroll hasta Skills: verificar alineación derecha, tags verdes, sin
      corte de texto.
- [ ] Scroll hasta Contact: verificar layout de fila (icono+texto a la
      izquierda, tarjeta de contacto a la derecha), pose de brazos cruzados.
- [ ] Capturar y revisar consola (0 errores reales esperados, solo favicon).

### Fase 2 — Pulido visual del personaje
- [ ] Revisar contraste de piernas (PANTS) y pelo (HAIR) contra fondos
      oscuros — reportado como "lavado" en la última verificación.
- [ ] Ajustar iluminación/materiales si hace falta (sin romper el efecto
      hologram-scan ya validado).
- [ ] Confirmar que los ojos agregados se ven bien en las 5 poses (about/
      experience/projects/skills/contact) sin quedar raros en head tilt.

### Fase 3 — Verificación automatizada completa
- [ ] `pnpm run typecheck` limpio.
- [ ] `pnpm run test` — 29+ tests verdes (confirmar que agregar ojos no
      rompió nada, no debería porque Character.ts no tiene tests directos).
- [ ] `pnpm run build` — build de producción sin warnings nuevos.

### Fase 4 — Commit y despliegue
- [ ] Matar cualquier dev server de pruebas corriendo.
- [ ] `git add -A` + commit descriptivo del rediseño completo (mencionar que
      reemplaza el FPS, listar las piezas nuevas: CharacterScene, Character,
      CharacterStage, StageEnvironment, ScrollSpy, CharacterPoseService,
      StageBackground, NavPillView).
- [ ] Push a `JUANSBAQUERO.github.io` (recordar `gh auth switch -u
      JUANSBAQUERO` si hace falta).
- [ ] Confirmar CI/CD verde (GitHub Actions: typecheck+test+build+deploy).
- [ ] Verificar el sitio en vivo con Playwright una vez desplegado.

## Criterio de cierre
Las 5 secciones se ven y comportan correctamente en vivo en
https://juansbaquero.github.io/, sin texto cortado, con el personaje
reaccionando a cada sección, tests y build verdes en GitHub Actions.
