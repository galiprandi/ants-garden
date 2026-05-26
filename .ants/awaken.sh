#!/bin/bash
# awaken.sh - Entry point del contenedor de hormiga

set -e

echo "🐜 Ant $ANT is awakening..."
echo "🌿 Target: $REPOSITORY ($BRANCH)"

# Configurar identidad de la hormiga
git config --global user.name "$ANT"
git config --global user.email "$EMAIL"
echo "👤 Identity configured: $ANT"

# Configurar gh cli con el token
export GH_TOKEN="$GITHUB_TOKEN"

# Clonar repositorio
echo "📥 Gathering territory..."
git clone --branch "$BRANCH" "$REPOSITORY" .
echo "✅ Territory secured"

# Cargar cerebro de la hormiga
echo "🧠 Loading brain..."
BRAIN_SIZE=$(wc -c < ".ants/gallery/$ANT.md" | tr -d ' ')
echo "   📖 Gallery: $BRAIN_SIZE bytes"
INSTINCT_SIZE=$(wc -c < ".ants/pheromones/instinct.md" | tr -d ' ')
echo "   🧬 Instinct: $INSTINCT_SIZE bytes"
echo "   🧠 Total brain: $((BRAIN_SIZE + INSTINCT_SIZE)) bytes"

# Ejecutar OpenCode con el prompt concatenado al vuelo
echo "🔨 Beginning work..."
opencode --model "$ANTS_MODEL" run $(cat ".ants/gallery/$ANT.md")$(cat ".ants/pheromones/instinct.md") || echo "❌ Work failed, keeping ant alive for debugging"

echo "✅ Ant $ANT completed mission"
# Keep container alive for debugging
tail -f /dev/null
