# Brand — Juan Sebastián Baquero Portfolio

Sistema de marca del portfolio: paleta con roles nombrados, jerarquía
tipográfica, y dirección del logo/favicon. Este documento es la fuente de
verdad — cualquier color o fuente en el código debe trazarse a una entrada
de aquí. Si algo en el código no aplica ninguna regla de este documento,
es una fuga de marca (ver sección final) y debe corregirse, no ignorarse.

## Por qué este cambio

La paleta anterior (cian neón `#4CF3FF` + magenta neón `#FF4CD6`) leía
genérico/"dashboard tech" y competía mal con la escena 3D real (atardecer
cálido, lámparas, hojas cayendo). Brief de Juan: identidad **juguetona,
con personalidad** — el personaje chibi 3D como eje, no un sistema de
color que podría pertenecer a cualquier SaaS.

## Paleta — roles nombrados

| Rol | Hex | Uso |
|---|---|---|
| `--accent-primary` (naranja) | `#FF8A3D` | Ancla de marca — ya vive en la escena 3D real (lámparas, atardecer). CTA principal, eyebrow de cada sección, nombre del personaje. NO cambia. |
| `--accent-secondary` (rosa chicle) | `#FF5FA2` | Reemplaza el magenta neón. Segundo acento: halos decorativos, hover states, el punto del nuevo favicon. Lee "pop/juguetón" sin ser agresivo. |
| `--accent-tertiary` (mostaza) | `#F4C95D` | Reemplaza el cian neón. Tercer acento: halos decorativos de secciones alternas, detalles puntuales. Cálido, nunca frío — todo el sistema se mantiene en la familia atardecer/chibi, sin ningún tono "tech-neón". |
| `--ink` | `#221f1a` | Texto sobre superficies claras (nav pill, speech bubble). Sin cambio. |
| `--cream` | `#f4ede2` | Superficies claras puntuales (texto del personaje, nav activo). Sin cambio. |
| `--bg-stage` | `#0b1420` | Fondo de toda la UI fuera de la escena 3D (stage, cards). Sin cambio — es lo que hace que los 3 acentos "salten". |

**Regla de asignación por sección** (reemplaza los `accentHex` actuales en
`content/portfolio.ts` y `content/locales/{en,es}.ts`):
- About, Experience, Skills → `--accent-tertiary` (mostaza)
- Projects, Contact → `--accent-secondary` (rosa chicle)
- Lab → `--accent-primary` (naranja) — sin cambio, ya lo usa
- Hero/nombre "Juan" (`.editorial-accent`) → `--accent-secondary` (rosa chicle)

**Fugas a unificar** (hoy desconectadas de la paleta):
- `src/application/services/StationContentRenderer.ts` →
  `PROJECT_TILE_COLORS` (6 colores random) se reduce a rotar entre los 3
  acentos de marca únicamente.
- Tags de Skills (`.skills-list .tag`, hoy verde fijo `#8fe0a8`) → pasan a
  usar `--accent-tertiary` (mostaza), coherente con que Skills ya usa ese
  rol.
- `LanternPost.ts` (`emissive: 0xff8a3d`) → ya coincide con
  `--accent-primary`, sin cambio necesario, queda documentado como
  intencional (la lámpara real de la escena 3D es el origen del naranja
  de marca, no al revés).

## Tipografía — jerarquía de uso (4 familias, sin reducir)

Decisión de Juan: mantener las 4 familias existentes, pero con reglas
explícitas de cuándo usar cada una (hoy mezcladas sin documentar):

| Familia | Rol | Dónde |
|---|---|---|
| **Space Grotesk** | Body/UI por defecto | Párrafos, nav, botones, tags — el 90% del texto. |
| **Baloo 2** | Headings (h1-h4) | Títulos de sección, nombres de job/proyecto — da el toque redondeado/juguetón en los títulos sin aplicarlo a todo el texto. |
| **Newsreader** (itálica) | Acento editorial puntual | SOLO la última palabra de un heading vía `.editorial-accent` (ya implementado) — nunca párrafos completos. |
| **JetBrains Mono** | Metadata técnica | Eyebrows, tags/pills, fechas, captions del loader — señala "esto es un dato/label", no prosa. |

Ninguna familia se agrega ni se quita — esto es documentación de una
jerarquía que ya existe implícitamente en el código, para que cambios
futuros no la rompan por accidente.

## Logo / Favicon

Reemplaza las iniciales genéricas "JB" en Arial por una silueta
simplificada de la cabeza del personaje 3D (su pelo despeinado en 3
picos es el rasgo más reconocible a escala de ícono), con un punto en
`--accent-secondary` (rosa chicle) como sello de marca — conecta el
favicon al personaje que ya es el eje visual de todo el sitio, en vez de
ser un elemento sin relación con el resto.

- Construido en geometría simple (círculos + triángulos), no un trazo a
  mano libre — verificado legible a 16px (favicon real), no solo a
  tamaño de preview grande.
- Archivo: `public/favicon.svg`. Los derivados PNG
  (`favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`,
  `favicon.ico`) deben regenerarse desde este SVG, no quedar con el
  diseño "JB" anterior.

## Qué NO cambia

- El personaje 3D en sí (diseño, outfit, animaciones) — fuera de alcance.
- `--bg-stage` (#0b1420) y el fondo/paleta de la escena 3D real (atardecer,
  lámparas) — el naranja de marca se deriva de ahí, no al revés.
- La voz de marca (`personal-brand-voice.md`) — ya resuelta, este
  documento es solo visual (color + tipografía + logo).

## Fugas de marca — checklist de verificación

Antes de dar por cerrado cualquier PR que toque color, confirmar que
NINGÚN archivo introduce un hex/rgba fuera de los 3 acentos + ink/cream/
bg-stage de arriba. Buscar con:
```bash
grep -rn "ff4cd6\|4cf3ff\|FF4CD6\|4CF3FF" --include="*.ts" --include="*.css" .
```
Debe devolver cero resultados una vez aplicado este documento.
