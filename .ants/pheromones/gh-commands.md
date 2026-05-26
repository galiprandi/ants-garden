# GitHub CLI (gh) Commands Guide for Ants

Esta guía documenta los comandos de GitHub CLI necesarios para que las hormigas operen correctamente en el repositorio.

## Labels

### Crear un label
```bash
gh label create "label-name" --color "HEX_COLOR" --description "Description"
```

**Ejemplos:**
```bash
# Crear label para ant carol
gh label create "ant-carol" --color "00ff00" --description "Pull requests created by ant carol"

# Crear label para ant uma
gh label create "ant-uma" --color "00ccff" --description "Pull requests created by ant uma"

# Crear label genérico
gh label create "enhancement" --color "a2eeef" --description "New feature or request"
```

**Colores hexadecimales comunes:**
- Verde: `00ff00`
- Azul: `00ccff`
- Rojo: `ff0000`
- Amarillo: `ffff00`
- Naranja: `ff9900`

### Listar labels existentes
```bash
gh label list
```

### Agregar label a un PR
```bash
gh pr edit PR_NUMBER --add-label "label-name"
```

**Ejemplo:**
```bash
gh pr edit 7 --add-label "ant-carol"
```

### Remover label de un PR
```bash
gh pr edit PR_NUMBER --remove-label "label-name"
```

## Pull Requests

### Crear PR draft con label
```bash
gh pr create --draft --label "ant-[NAME]" --title "Title" --body "Description"
```

**Ejemplo:**
```bash
gh pr create --draft --label "ant-carol" --title "Sudoku UI improvements" --body "Description of changes"
```

### Crear PR con rama específica
```bash
gh pr create --head BRANCH_NAME --base main --title "Title" --body "Description"
```

### Listar PRs con label específico
```bash
gh pr list --label "ant-[NAME]" --state open
```

**Estados disponibles:**
- `open` - PRs abiertos
- `closed` - PRs cerrados
- `all` - Todos los PRs
- `merged` - Solo PRs mergeados

### Listar PRs con label (todos los estados)
```bash
gh pr list --label "ant-[NAME]" --state all --limit 15
```

### Ver detalles de un PR
```bash
gh pr view PR_NUMBER
```

### Ver PR con formato específico
```bash
gh pr view PR_NUMBER --json number,title,state,headRefName
```

### Marcar PR como Ready for Review
```bash
gh pr ready PR_NUMBER
```

### Cerrar un PR
```bash
gh pr close PR_NUMBER
```

## Issues/Comentarios

### Agregar comentario a un PR
```bash
gh pr comment PR_NUMBER --body "Comment text"
```

### Agregar comentario con screenshot (usando API)
```bash
gh api repos/OWNER/REPO/issues/PR_NUMBER/comments \
  -f body='### Validación visual: [DESCRIPCIÓN]\n\n\n![screenshot](URL)'
```

**IMPORTANTE:** Usa comillas simples (`'`) en el body para evitar que zsh interprete los corchetes `[]`.

**Ejemplo:**
```bash
gh api repos/galiprandi/ants-garden/issues/6/comments \
  -f body='### Validación visual: Nuevo componente\n\n\n![screenshot](https://raw.githubusercontent.com/galiprandi/ants-garden/branch/public/screenshot.png)'
```

### Ver comentarios de un PR
```bash
gh pr view PR_NUMBER --json comments --jq '.comments[].body'
```

## Branches

### Crear rama (SIN emojis ni caracteres especiales)
```bash
git checkout -b [NAME]-refactor(module)-description
```

**Formato correcto:**
```bash
git checkout -b carol-refactor-sudoku-ui-improvements
```

**Formato INCORRECT (causa errores):**
```bash
git checkout -b 🐜 Carol: refactor(sudoku)  # ❌ NO usar emojis ni paréntesis
```

### Listar ramas
```bash
git branch
```

### Ver rama actual
```bash
git branch --show-current
```

## Authentication

### Verificar autenticación
```bash
gh auth status
```

### Configurar autenticación git
```bash
gh auth setup-git
```

## Repositorio

### Clonar repositorio con gh cli
```bash
gh repo clone REPO_URL -- --branch BRANCH --single-branch --depth=1
```

**Ejemplo:**
```bash
gh repo clone https://github.com/galiprandi/ants-garden.git -- --branch main --single-branch --depth=1
```

## Errores Comunes y Soluciones

### Error: "label not found"
**Causa:** El label no existe en el repositorio.
**Solución:** Crea el label primero con `gh label create`.

### Error: "Cannot update paths and switch to branch"
**Causa:** Nombre de rama con caracteres especiales (emojis, paréntesis).
**Solución:** Usa formato `[NAME]-refactor(module)-description` sin emojis.

### Error: "you must first push the current branch"
**Causa:** La rama no está en el remoto.
**Solución:** Push la rama primero: `git push origin BRANCH_NAME`.

### Error: zsh interpreta corchetes en comandos
**Causa:** Comillas dobles permiten expansión de shell.
**Solución:** Usa comillas simples `'` para el body de comentarios.

## Best Practices

1. **Siempre crear labels antes de usarlos** en PRs
2. **Usar formato de rama sin caracteres especiales** para evitar errores de git
3. **Usar comillas simples** para comandos con corchetes o caracteres especiales
4. **Verificar PRs antes de crear nuevos** para evitar colisiones
5. **Usar labels para identificar PRs de cada hormiga** en lugar de `--author @me`
