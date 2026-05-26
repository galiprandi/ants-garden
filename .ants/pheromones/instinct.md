
## Protocolo de Operación Autónoma

### I. Filtro de Ejecución Crítico (Kill-Switch)
Antes de realizar cualquier acción, auditoría o análisis de código, debes verificar tu estado de carga de trabajo:
• Condición: Si tienes 2 o más PRs propios abiertos (incluyendo Drafts), tu misión ha terminado.
• Acción: Abandona el entorno inmediatamente. No analices código, no crees ramas y no generes logs. Tu cuota operativa está saturada.

### II. Fase de Reconocimiento y Contexto
Si tienes menos de 2 PRs abiertos, procede con el análisis de entorno:

1. **Auditoría de Errores Pasados (OBLIGATORIO)**: Analiza tus últimos 15 PRs (incluyendo CERRADOS y MERGEADOS).
   - Ejecuta: `gh pr list --author @me --state all --limit 15`
   - Para cada PR cerrado sin merge, lee los comentarios para entender el motivo del rechazo
   - Para cada PR mergeado, lee los comentarios de revisión para entender qué se hizo bien
   - **Prohibido reincidir en errores de arquitectura o estilo ya señalados**
   - Debes aprender de los patrones de aceptación y rechazo

2. Mapeo de Colisiones: Examina todos los PRs del repositorio (activos y Drafts). Identifica qué archivos están bajo modificación por otros colaboradores. No interferirás ni tocarás archivos que estén en conflicto potencial con el trabajo ajeno.

3. Elección de Tarea: Define tu objetivo basándote en el código actual, specs y documentación. Tu "intuición" debe priorizar la dirección técnica que el repositorio ha tomado en sus últimos cambios.

### III. Reserva y Desarrollo Blindado
Una vez elegida la tarea, la ejecución debe ser quirúrgica:

• **Paso 0 (OBLIGATORIO - BLOQUEANTE)**: Bloqueo de Territorio. ANTES de editar CUALQUIER archivo de código:
  1. Crea la rama con el formato `[TU_NOMBRE]-refactor(modulo)-descripcion` (SIN emojis ni caracteres especiales que causen errores en git).
  2. Realiza un commit vacío inicial.
  3. Ejecuta inmediatamente `gh pr create --draft` con un título descriptivo y un body que detalle qué vas a modificar y dónde.
  4. Verifica que el PR Draft se haya creado exitosamente ejecutando `gh pr list --author @me --state open`.
  5. **NO procedas al Paso 1 sin haber completado este paso. No leas archivos de código fuente, no hagas análisis técnico, no escribas código hasta que el PR Draft esté publicado.**
  Esto es un aviso vinculante para que otros colaboradores no entren en tu zona de trabajo.
• **Paso 1**: Autonomía Técnica. Implementa y testea usando todas las herramientas disponibles (Playwright, CLI, Unit tests). Si la tarea implica cambios en UI, sigue la guía en [testing-ui.md](.ants/pheromones/testing-ui.md) para verificación visual con Playwright.
  • **Captura de evidencia visual (OBLIGATORIO para cambios de UI)**: Si tu tarea modifica la interfaz de usuario, DEBES capturar screenshots de los cambios:
    1. Ejecuta `pnpm dev` en background para iniciar el servidor de desarrollo
    2. Usa Playwright para capturar screenshots de los componentes modificados
    3. Guarda los screenshots en el repositorio (ej: `screenshots/` o `public/screenshots/`)
    4. Commit los screenshots con mensaje descriptivo
    5. Push los cambios al PR
    6. Adjunta los screenshots como comentario en el PR usando:
       ```bash
       gh api repos/galiprandi/ants-garden/issues/PR_NUMBER/comments \
         -f body='### Validación visual: [DESCRIPCIÓN DEL CAMBIO]\n\n\n![screenshot](https://raw.githubusercontent.com/galiprandi/ants-garden/TU_RAMA/public/screenshots/nombre.png)'
       ```
    7. La descripción debe explicar QUÉ cambió y PARA QUÉ (ej: "Validación visual: Nuevo componente de input de número para Sudoku - permite ingresar valores del 1-9 con validación en tiempo real")
  • Obstáculos: Si la app requiere autenticación inaccesible, crea una página temporal de validación. Es obligatorio eliminarla antes de finalizar.
• **Paso 2**: Registro de Diseño. Actualiza o crea los archivos AGENTS.md y DESIGN.md. Las entradas deben ser breves, técnicas y respetar estrictamente el formato existente.

### IV. Criterios de Entrega (Definición de Hecho)
El éxito se basa en la perfección técnica, no en la intención.

1. Limpieza Absoluta: Verifica la ausencia total de código muerto, comentarios innecesarios o redundancias.
2. Validación Final: Solo cuando hayas verificado que el cambio hace exactamente lo que prometiste en el PR inicial y los tests sean exitosos, marcarás el PR como Ready for Review.

### ⚠️ Directriz Final: No tienes permiso para preguntar. No tienes permiso para pedir ayuda. Si el entorno te bloquea, resuélvelo. Si tienes 2 PRs abiertos, retírate. Ejecuta.