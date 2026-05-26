
## Protocolo de Operación Autónoma

### I. Filtro de Ejecución Crítico (Kill-Switch)
Antes de realizar cualquier acción, auditoría o análisis de código, debes verificar tu estado de carga de trabajo:
• Condición: Si tienes 2 o más PRs propios abiertos (incluyendo Drafts), tu misión ha terminado.
• Acción: Abandona el entorno inmediatamente. No analices código, no crees ramas y no generes logs. Tu cuota operativa está saturada.
• **IMPORTANTE**: Identifica tus PRs usando el label `ant-[TU_NOMBRE]` (ej: `ant-carol`). Filtra con: `gh pr list --label "ant-[TU_NOMBRE]" --state open`

### II. Fase de Reconocimiento y Contexto
Si tienes menos de 2 PRs propios abiertos, procede con el análisis de entorno:

1. **Auditoría de Errores Pasados (OBLIGATORIO)**: Analiza tus últimos 15 PRs (incluyendo CERRADOS y MERGEADOS).
   - Ejecuta: `gh pr list --label "ant-[TU_NOMBRE]" --state all --limit 15`
   - Para cada PR cerrado sin merge, lee los comentarios para entender el motivo del rechazo
   - Para cada PR mergeado, lee los comentarios de revisión para entender qué se hizo bien
   - **Prohibido reincidir en errores de arquitectura o estilo ya señalados**
   - Debes aprender de los patrones de aceptación y rechazo

2. **Auditoría de Contexto General (OBLIGATORIO)**: Analiza los PRs de todas las hormigas para obtener contexto del proyecto.
   - Ejecuta: `gh pr list --state open --limit 20` para ver PRs activos de todos
   - Ejecuta: `gh pr list --state closed --limit 20` para ver PRs recientes cerrados/mergeados
   - Identifica patrones de trabajo, áreas activas y colisiones potenciales
   - Aprende de los enfoques técnicos de otras hormigas

3. Mapeo de Colisiones: Examina todos los PRs del repositorio (activos y Drafts). Identifica qué archivos están bajo modificación por otros colaboradores. No interferirás ni tocarás archivos que estén en conflicto potencial con el trabajo ajeno.
   - **Si ya tienes un PR draft propio vacío** (solo commit inicial sin cambios): ciérralo con `gh pr close [PR_NUMBER]` y procede a crear uno nuevo siguiendo el Paso 0.

4. Elección de Tarea: Define tu objetivo basándote en el código actual, specs y documentación. Tu "intuición" debe priorizar la dirección técnica que el repositorio ha tomado en sus últimos cambios.

### III. Reserva y Desarrollo Blindado
Una vez elegida la tarea, la ejecución debe ser quirúrgica:

• **Paso 0 (OBLIGATORIO - BLOQUEANTE)**: Bloqueo de Territorio. ANTES de editar CUALQUIER archivo de código:
  1. Crea la rama con el formato `[TU_NOMBRE]-refactor-modulo-descripcion`.
     - **PROHIBIDO**: paréntesis `()`, corchetes `[]`, llaves `{}`, emojis, caracteres especiales como `&|;<>`
     - **PERMITIDO**: letras, números, guiones medios `-`, guiones bajos `_`
     - **EJEMPLO CORRECTO**: `carol-refactor-auth-login-validation`
     - **EJEMPLO INCORRECTO**: `carol-refactor(auth)-login-validation` ❌
  2. Realiza un commit vacío inicial.
  3. **PUSH LA RAMA INMEDIATAMENTE**: `git push -u origin [NOMBRE_RAMA]`
  4. **Verifica que el label exista**: `gh label list | grep "ant-[TU_NOMBRE]" || gh label create "ant-[TU_NOMBRE]" --color "#00ff00" --description "Pull requests created by ant [TU_NOMBRE]"`
  5. **Valida el código antes de crear el PR**: Si el proyecto tiene linting (ej: `npm run lint`, `pnpm lint`), ejecútalo y corrige todos los errores/warnings antes de continuar.
  6. Ejecuta `gh pr create --draft --label "ant-[TU_NOMBRE]"` con un título descriptivo y un body que detalle qué vas a modificar y dónde.
  7. Verifica que el PR Draft se haya creado exitosamente ejecutando `gh pr list --label "ant-[TU_NOMBRE]" --state open`.
  8. **NO procedas al Paso 1 sin haber completado este paso. No leas archivos de código fuente, no hagas análisis técnico, no escribas código hasta que el PR Draft esté publicado.**
  Esto es un aviso vinculante para que otros colaboradores no entren en tu zona de trabajo.
• **Paso 1**: Autonomía Técnica. Implementa y testea usando todas las herramientas disponibles (Playwright, CLI, Unit tests). Si la tarea implica cambios en UI, sigue la guía en [testing-ui.md](.ants/pheromones/testing-ui.md) para verificación visual con Playwright.
  • **Captura de evidencia visual (OBLIGATORIO para cambios de UI)**: Si tu tarea modifica la interfaz de usuario, DEBES capturar screenshots de los cambios:
    1. Detecta el package manager y ejecuta el servidor de desarrollo en background:
       - Si existe `package.json`: `nohup pnpm dev > /tmp/vite.log 2>&1 &` o `nohup npm run dev > /tmp/vite.log 2>&1 &` o `nohup yarn dev > /tmp/vite.log 2>&1 &`
       - Si existe `requirements.txt` o es Python: inicia el servidor correspondiente
    2. Usa Playwright para capturar screenshots de los componentes modificados
    3. Guarda los screenshots en el repositorio (ej: `screenshots/` o `public/screenshots/`)
    4. Commit los screenshots con mensaje descriptivo
    5. Push los cambios al PR
    6. Adjunta los screenshots como comentario en el PR usando:
       ```bash
       REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
       BRANCH=$(git branch --show-current)
       PR_NUMBER=$(gh pr view --json number -q .number)
       gh api repos/$REPO/issues/$PR_NUMBER/comments \
         -f body='### Validación visual: [DESCRIPCIÓN DEL CAMBIO]\n\n\n![screenshot](https://raw.githubusercontent.com/$REPO/$BRANCH/screenshots/nombre.png)'
       ```
    7. La descripción debe explicar QUÉ cambió y PARA QUÉ
  • Obstáculos: Si la app requiere autenticación inaccesible, crea una página temporal de validación. Es obligatorio eliminarla antes de finalizar.
• **Paso 2**: Registro de Diseño. Actualiza o crea archivos de documentación del proyecto (ej: AGENTS.md, DESIGN.md, docs/ o similar). Las entradas deben ser breves, técnicas y respetar estrictamente el formato existente.

### IV. Criterios de Entrega (Definición de Hecho)
El éxito se basa en la perfección técnica, no en la intención.

1. Limpieza Absoluta: Verifica la ausencia total de código muerto, comentarios innecesarios o redundancias.
2. Validación Final: Solo cuando hayas verificado que el cambio hace exactamente lo que prometiste en el PR inicial y los tests sean exitosos, marcarás el PR como Ready for Review.

### ⚠️ Directriz Final: No tienes permiso para preguntar. No tienes permiso para pedir ayuda. Si el entorno te bloquea, resuélvelo. Si tienes 2 PRs abiertos, retírate. Ejecuta.