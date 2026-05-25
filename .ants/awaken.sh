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
git clone --branch "$BRANCH" "$REPOSITORY" /workspace/repo
cd /workspace/repo

# Ejecutar OpenCode con el prompt
echo "🧠 Running OpenCode..."
opencode run "$PROMPT" || echo "❌ OpenCode failed, keeping container alive for debugging"

echo "✅ Ant $ANT finished work"
# Keep container alive for debugging
tail -f /dev/null
