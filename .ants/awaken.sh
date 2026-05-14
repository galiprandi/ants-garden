#!/bin/bash
ANT=$1
MODE=${2:-remote}

if [ -z "$ANT" ]; then
    echo "Error: ANT parameter is required"
    echo "Usage: $0 <ant-name> [remote|local]"
    exit 1
fi
echo "Awakening 🐜 ${ANT}..."

# Cleanup function
cleanup() {
    echo "Cleaning up $ANT_DIR..."
    rm -rf $ANT_DIR
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Load .env file
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Create a random temp directory for the ant
ANT_DIR=$(mktemp -d)
echo "🐜 $ANT will work in $REPOSITORY today"

# Configure agent identity
git config --global user.name "🐜 $ANT"
git config --global user.email "${ANT_EMAIL:-"$ANT@ants.io"}"
git config --global --add safe.directory "$ANT_DIR"


# Configure GitHub credentials
git config --global credential.helper '!f() { echo "username=x-access-token"; echo "password=${GITHUB_TOKEN}"; }; f'

# Clone or copy repository
if [ "$MODE" = "local" ]; then
    echo "🐜 Using local repository..."
    cp -r . $ANT_DIR
    rm -rf $ANT_DIR/.git
else
    echo "🐜 Cloning remote repository..."
    rm -rf $ANT_DIR/ants
    git clone --branch "${BRANCH:-main}" --depth 1 "${REPOSITORY}" $ANT_DIR
fi

# Work in mounted repository
cd $ANT_DIR

# Load brain.md and instinct.md as prompt if PROMPT not set
if [ -z "$PROMPT" ]; then
    if [ ! -f .ants/$ANT/brain.md ]; then
        echo "Error: .ants/$ANT/brain.md not found in repository"
        exit 1
    fi
    PROMPT=$(cat .ants/$ANT/brain.md)
    if [ -f .ants/pheromones/instinct.md ]; then
        PROMPT="$PROMPT"$'\n\n'$(cat .ants/pheromones/instinct.md)
    fi
fi

echo "🐜 $ANT is awakening and working now..."

OPENROUTER_API_KEY="$API_KEY" opencode run "$PROMPT" -m "$MODEL" --dir .
