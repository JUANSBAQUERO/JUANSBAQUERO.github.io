# Reglas de Optimización de Tokens — portfolio-threejs
## Estado: OBLIGATORIO — override humano requerido para excepciones

Genéricas de higiene de contexto, adaptadas de `datup-frontend`; aplican
igual a un repo chico de un solo mantenedor.

### 1. Prohibición de datos inventados
No generar contenido de proyectos/experiencia/skills que no esté respaldado
por un repo/fuente real — ver el incidente de FinanceOS/Stack Rush
(2026-11-02): el contenido se sacó de los repos reales en
`~/Documents/Personal`, nunca se inventó un stack o resultado.

### 2. Prohibición de Tests Excesivos
No generar tests para código trivial (getters, wiring DOM simple,
configuración estática). Priorizar tests de comportamiento (las funciones
puras de `application/services/*`) sobre tests de implementación.

### 3. Prohibición de Fallbacks de Resiliencia especulativos
No generar retries/manejo de errores de red para GitHub Pages (hosting
estático) salvo que Juan pida explícitamente manejar un caso de fallo
concreto.

### 4. Prohibición de Abstracciones Prematuras
No generar una clase base compartida para modales/renderers hasta que
exista un TERCER consumidor real (ver `rules/pattern-respect.md` — dos
modales con estructura idéntica siguen siendo independientes a propósito).

### 5. Prohibición de Código Comentado
No dejar código comentado "por si se necesita" — usar git para historia.

### 6. Preferir Soluciones Estándar
Preferir siempre la API estándar de Three.js/DOM sobre una solución custom
(ej. `requestAnimationFrame` + lerp en vez de una librería de animación
nueva para un efecto simple).

### 7. Límite de Tecnologías Nuevas
Máximo 3 tecnologías nuevas por tarea — este repo ya tiene su stack fijado
(Vite, TS, Three.js, Lenis); no introducir un framework de UI, un state
manager, o una librería de animación nueva sin que Juan lo pida
explícitamente.

### 8. Límite de Archivos por Operación
Máximo 5 archivos modificados por respuesta; dividir en pasos secuenciales
con checkpoints si se necesita más.

### 9. Prohibición de Configuración Especulativa
No agregar env vars, feature flags, o configuración "por si acaso". Solo lo
necesario para el caso de uso actual especificado.

### 10. Documentación Inline Mínima
No generar docstrings extensos para funciones obvias. Comentarios extensos
solo para: pitfalls no obvios de Three.js/CSS (patrón ya usado en este
repo — ver comentarios de `JourneyEnvironment.ts` sobre aspect ratio), o
reglas de negocio no evidentes desde el código.
