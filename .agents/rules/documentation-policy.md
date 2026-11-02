# Política de Documentación — portfolio-threejs
## Estado: OBLIGATORIO

## Regla de oro
Todo PR que toque código no trivial (excluye typo fixes, bump de versiones,
cambios de config sin lógica) trae:
1. Su contrato en `.agents/SDD/contracts/<slug>.md`.
2. Su entrada correspondiente en `REVIEW.md` (raíz del repo).

Sin ambos, el PR está incompleto — mismo nivel de bloqueo que pruebas rotas
o sin correr.

## Plantillas
`.agents/SDD/contracts/template-feature-spec.md` — para specs Modo A ya
aprobados/implementados (resumen corto: objetivo, alcance, decisiones
clave, criterios de aceptación, validación realizada).

`.agents/SDD/contracts/template-fix.md` — para bugs/fixes puntuales sin
spec de 3 archivos (bug, causa raíz, fix, archivos tocados, validación
realizada).

## Instancias reales
Van en `.agents/SDD/contracts/<slug>.md` — un archivo por PR, se
**commitea**, es el histórico permanente. No se borra ni se archiva a otra
carpeta.

## `REVIEW.md`
Índice corto y humano de PRs abiertos esperando revisión — campos sin
código ni rutas de archivo:

```markdown
## PR #<n> — <título corto>

**feat / fix:** 3-6 líneas de prosa, qué hace y por qué.

**bug:** el problema encontrado (o el vacío que cierra si es feat sin bug).

**cómo verificar:** pasos de QA manual reproducibles sin abrir el contrato.

PR: <link> · Contrato: `.agents/SDD/contracts/<slug>.md`
```

Este repo no usa tracker externo (ClickUp/Jira) — no hay campo "Tracker" en
la plantilla, a diferencia de `datup-frontend`.

Una entrada se agrega en el mismo cambio que abre el PR y se **elimina**
(no se archiva) en el mismo commit/PR que hace el merge a `main`. El
histórico completo sigue disponible en `.agents/SDD/contracts/` y en
`git log`.
