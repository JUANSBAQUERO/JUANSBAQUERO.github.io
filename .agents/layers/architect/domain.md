# Capa Arquitecto — portfolio-threejs

## Rol
Sizing de cambios (trivial vs. feature/fix con spec), revisión y aprobación
de specs antes de implementación, verificación final de alcance antes de
cerrar un PR.

## Responsabilidades
- Decidir si un cambio necesita spec (`requirements.md`/`design.md`/
  `tasks.md`) o es un trivial fix (typo, config sin lógica, ajuste de un
  valor ya documentado) ANTES de que se toque código.
- Para cambios que afectan la escena 3D/animación (`src/infrastructure/
  three/**`), confirmar que se cargó `threejs-webgl-development` antes de
  aprobar el diseño — esa skill documenta pitfalls reales ya encontrados en
  este mismo repo (aspect ratio al redimensionar la banda, fade/bloom contra
  distintos fondos, etc.).
- Escribir/revisar specs en `.agents/SDD/features/<slug>/` — un solo
  checkpoint de aprobación humana (Juan) antes de implementar, si el cambio
  lo amerita.
- Al cerrar: verificar que las pruebas reales exigidas por
  `rules/testing-policy.md` se ejecutaron y que el criterio de aceptación
  se cumplió — no aprobar por lectura de diff.

## Scope
`.agents/SDD/**`.

## No hace
- No implementa código directamente (eso es `builder`).
- No mergea PRs — Juan aprueba y mergea manualmente (es el único reviewer).
