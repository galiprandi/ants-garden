#!/bin/bash
# .ants/spawn.sh - Lanza una hormiga: inicia → clona → ejecuta opencode → finaliza

ANT_NAME=${1:-carol}
ANTS_DIR="$(cd "$(dirname "$0")" && pwd)"

# Validar que existe el brain en gallery
if [ ! -f "$ANTS_DIR/gallery/$ANT_NAME.md" ]; then
    echo "❌ Error: Brain not found at .ants/gallery/$ANT_NAME.md"
    echo "   Available brains:"
    ls -1 "$ANTS_DIR/gallery" 2>/dev/null | sed 's/.md$//' | sed 's/^/     - /'
    exit 1
fi

# Construir prompt: gallery/ANT.md + instinct.md
echo "🧠 Loading brain for $ANT_NAME..."
PROMPT=$(cat "$ANTS_DIR/gallery/$ANT_NAME.md")

if [ -f "$ANTS_DIR/pheromones/instinct.md" ]; then
    PROMPT="$PROMPT"$'\n\n'"$(cat "$ANTS_DIR/pheromones/instinct.md")"
fi

echo "   Brain loaded: ${#PROMPT} characters"

# Cargar .env
if [ -f "$ANTS_DIR/../.env" ]; then
    set -a
    source "$ANTS_DIR/../.env"
    set +a
else
    echo "❌ Error: .env not found at project root"
    exit 1
fi

# Imagen base compartida
IMAGE_NAME="ants-base"

# Build solo si no existe
if ! docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
    echo "🏗️  Building base Docker image: $IMAGE_NAME"
    docker build -f "$ANTS_DIR/body" -t "$IMAGE_NAME" "$ANTS_DIR" || exit 1
else
    echo "✅ Using existing base image: $IMAGE_NAME"
fi

echo "🚀 Spawning 🐜 $ANT_NAME..."
echo "   Model: $MODEL"
echo "   Repo: $REPOSITORY"

# Nombre único de la hormiga
ANT_ID="ants-$ANT_NAME-$(date +%s)"

docker run -d --name "$ANT_ID" --env-file "$ANTS_DIR/../.env" -e ANT="$ANT_NAME" -e BRANCH="${BRANCH:-main}" -e EMAIL="${EMAIL:-$ANT_NAME@ants.io}" -v ~/.ssh:/root/.ssh:ro -v ~/.ssh/known_hosts:/root/.ssh/known_hosts:ro "$IMAGE_NAME"

echo "🐜 Ant started: $ANT_ID"
echo "📋 View logs: docker logs -f $ANT_ID"
