# Review — PRs pendientes

Índice corto de PRs abiertos esperando revisión de Juan. Una entrada se
agrega al abrir el PR y se elimina al mergearlo (el histórico completo
queda en `.agents/SDD/contracts/` y en `git log`). Ver
`.agents/rules/documentation-policy.md` para el formato.

## PR — feat: floating WhatsApp button with chibi-style idle bounce

**feat:** botón flotante de WhatsApp (fixed, esquina inferior derecha)
con link precargado al número real de Juan, estilo chibi/juguetón (rosa
chicle con rebote idle continuo, naranja en hover), consistente con la
paleta del brand refresh.

**bug:** N/A — feature nueva.

**cómo verificar:** cargar el sitio, confirmar el botón visible en todas
las secciones con rebote sutil; hover cambia a naranja; click abre
WhatsApp con mensaje precargado; cambiar idioma EN/ES actualiza el
mensaje; mobile se ve proporcional; el modal legal sigue tapándolo.

PR: https://github.com/JUANSBAQUERO/JUANSBAQUERO.github.io/pull/6 ·
Contrato: `.agents/SDD/contracts/whatsapp-floating-button.md`
