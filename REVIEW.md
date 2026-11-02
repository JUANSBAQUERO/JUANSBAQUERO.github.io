# Review — PRs pendientes

Índice corto de PRs abiertos esperando revisión de Juan. Una entrada se
agrega al abrir el PR y se elimina al mergearlo (el histórico completo
queda en `.agents/SDD/contracts/` y en `git log`). Ver
`.agents/rules/documentation-policy.md` para el formato.

## PR — feat: PostHog analytics (visits + section depth)

**feat:** analítica con PostHog para medir si la gente ingresa al sitio
y hasta qué sección llega (About/Experience/Projects/Skills/Lab/
Contact). Wrapper aislado en `src/infrastructure/analytics/Analytics.ts`
(mismo patrón que `SmoothScroll.ts`), con guard de localhost y dedupe de
eventos. Aviso legal actualizado honestamente (ya no dice "no
analytics").

**bug:** N/A — feature nueva.

**cómo verificar:** en producción, confirmar en el dashboard de PostHog
que llegan pageviews y el evento `section_viewed` por sección; en dev
(`pnpm run dev`), confirmar que NO hay ninguna request de red a
PostHog; revisar el aviso legal actualizado en EN/ES.

PR: https://github.com/JUANSBAQUERO/JUANSBAQUERO.github.io/pull/8 ·
Contrato: `.agents/SDD/contracts/posthog-analytics.md`
