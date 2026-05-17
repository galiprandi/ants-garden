#!/bin/bash
# .ants/spawn.sh - Lanza una hormiga con su brain específico

ANT_NAME=${1:-carol}
ANTS_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$ANTS_DIR")"

# Validar que existe el brain
if [ ! -f "$ANTS_DIR/$ANT_NAME/brain.md" ]; then
    echo "❌ Error: Brain not found at .ants/$ANT_NAME/brain.md"
    echo "   Available brains:"
    ls -1 "$ANTS_DIR" | grep -v "spawn.sh\|awaken.sh\|body\|pheromones" | sed 's/^/     - /'
    exit 1
fi

# Construir prompt: brain.md + instinct.md
echo "🧠 Loading brain for $ANT_NAME..."
PROMPT=$(cat "$ANTS_DIR/$ANT_NAME/brain.md")

if [ -f "$ANTS_DIR/pheromones/instinct.md" ]; then
    PROMPT="$PROMPT"$'\n\n'"$(cat "$ANTS_DIR/pheromones/instinct.md")"
fi

echo "   Brain loaded: ${#PROMPT} characters"

# Cargar .env
if [ -f "$PROJECT_DIR/.env" ]; then
    set -a
    source "$PROJECT_DIR/.env"
    set +a
else
    echo "❌ Error: .env not found at project root"
    exit 1
fi

# Validar variables requeridas
REQUIRED_VARS=("GITHUB_TOKEN" "REPOSITORY" "API_KEY" "MODEL" "PROVIDER")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set in .env"
        exit 1
    fi
done

# Imagen del contenedor
IMAGE_NAME="ants-$ANT_NAME"

echo "🏗️  Building Docker image: $IMAGE_NAME"
docker build -f "$ANTS_DIR/body" -t "$IMAGE_NAME" "$PROJECT_DIR" || exit 1

echo "🚀 Spawning 🐜 $ANT_NAME..."
echo "   Model: $MODEL"
echo "   Repo: $REPOSITORY"

docker run --rm \
  -e ANT="$ANT_NAME" \
  -e PROMPT="$PROMPT" \
  -e GITHUB_TOKEN="$GITHUB_TOKEN" \
  -e REPOSITORY="$REPOSITORY" \
  -e BRANCH="${BRANCH:-main}" \
  -e API_KEY="$API_KEY" \
  -e MODEL="$MODEL" \
  -e PROVIDER="$PROVIDER" \
  -e EMAIL="${EMAIL:-$ANT_NAME@ants.io}" \
  -v ~/.ssh:/root/.ssh:ro \
  -v ~/.ssh/known_hosts:/root/.ssh/known_hosts:ro \
  "$IMAGE_NAME"
