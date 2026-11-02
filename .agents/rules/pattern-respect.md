# Respeto por patrones existentes — portfolio-threejs

## Stack real
Vite + TypeScript + Three.js, sin framework de UI. Clean Architecture por
capas: `domain/entities` (tipos puros, sin Three.js/DOM) → `application/
services` (lógica pura testeable) → `infrastructure` (Three.js, scroll,
DOM real) → `presentation` (vistas/modales). `content/` separa datos de
código (portfolio.ts + locales en/es).

## Contenido duplicado intencional (en/es + portfolio.ts)
`content/locales/{en,es}.ts` son lo que realmente se renderiza (vía
`getLocaleContent`). `content/portfolio.ts` es contenido legacy en inglés,
reexportado por `journey.ts` SOLO para los datos no traducibles (posiciones
de escena, colores). Editar un proyecto/experiencia/skill sin actualizar
los tres archivos produce un cambio que "no se ve" en el sitio real —
confirmar siempre contra en.ts/es.ts, no solo portfolio.ts.

## Extender antes de duplicar
Antes de crear un modal/renderer/servicio nuevo, revisar si uno existente
(`LegalModal`, `ProjectModal`, `StationContentRenderer`,
`JourneyProgress`) ya cubre un patrón equivalente y puede extenderse en vez
de duplicarse — el repo ya tiene dos modales con estructura idéntica
(overlay + ESC + backdrop-click + Lenis wheel-stop) porque dos modales no
justificaban todavía una clase base compartida; un tercer modal SÍ sería
señal de extraer esa base.

## Escena 3D (Three.js)
Cualquier cambio a `src/infrastructure/three/**` carga primero
`threejs-webgl-development` (pitfalls reales ya encontrados en ESTE repo:
aspect ratio del stage band, bloom contra fondos claros/oscuros, framing de
cámara fija contra la pose más extendida, fade/backdrop sizing). No asumir
que un ajuste CSS de layout (ej. altura de la banda del personaje) es
"solo CSS" — cambia el aspect ratio de la cámara y puede romper el
sizing de planos de fondo/piso calculados para el aspect ratio viejo.

## Sin apps clon, sin tenants
A diferencia de `datup-frontend`, este repo es un solo app sin variantes de
marca/tenant — no aplica ninguna regla tipo "R6" de confirmar si un cambio
va a una app, su clon, o ambas.
