#!/bin/bash
# awaken.sh - Entry point del contenedor de hormiga

set -e

echo "🐜 Awakening $ANT..."
echo "📝 Prompt length: ${#PROMPT}"
echo "🔧 Repository: $REPOSITORY"
echo "🌿 Branch: $BRANCH"

# Configurar git
git config --global user.name "$ANT"
git config --global user.email "$EMAIL"

# Configurar gh cli con el token
export GH_TOKEN="$GITHUB_TOKEN"
# Clonar repositorio
echo "📥 Cloning repository..."
git clone --branch "$BRANCH" "$REPOSITORY" .

# Construir prompt desde el filesystem clonado
echo "🧠 Loading brain for $ANT..."
PROMPT=$(cat ".ants/gallery/$ANT.md")

if [ -f ".ants/pheromones/instinct.md" ]; then
    PROMPT="$PROMPT"$'\n\n'"$(cat ".ants/pheromones/instinct.md")"
fi

echo "   Brain loaded: ${#PROMPT} characters"

# Ejecutar OpenCode con el prompt
echo "🧠 Running OpenCode..."
opencode --model "$ANTS_MODEL" run $PROMPT || echo "❌ OpenCode failed, keeping container alive for debugging"

echo "✅ Ant $ANT finished work"
# Keep container alive for debugging
tail -f /dev/null
