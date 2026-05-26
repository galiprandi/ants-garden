#!/bin/bash
set -e

echo "🐜 Ant $ANT is awakening..."
echo "🌿 Target: $REPOSITORY ($BRANCH)"

# Get identity
git config --global user.name "$ANT"
git config --global user.email "$EMAIL"
echo "👤 Identity configured: $ANT"

# Gather territory
echo "📥 Gathering territory..."
# git clone --branch "$BRANCH" "$REPOSITORY" .
gh repo clone "$REPOSITORY" -- --branch "$BRANCH" --single-branch --depth=1
gh auth setup-git
cd "$(basename "$REPOSITORY" .git)"
echo "✅ Territory secured"

# Load brain
echo "🧠 Loading brain..."
BRAIN_SIZE=$(wc -c < ".ants/gallery/$ANT.md" | tr -d ' ')
echo "   📖 Gallery: $BRAIN_SIZE bytes"
INSTINCT_SIZE=$(wc -c < ".ants/pheromones/instinct.md" | tr -d ' ')
echo "   🧬 Instinct: $INSTINCT_SIZE bytes"
echo "   🧠 Total brain: $((BRAIN_SIZE + INSTINCT_SIZE)) bytes"

# Starting work
echo "🔨 Beginning work..."
opencode --model "$ANTS_MODEL" run $(cat ".ants/gallery/$ANT.md")$(cat ".ants/pheromones/instinct.md") || echo "❌ Work failed, keeping ant alive for debugging"

echo "✅ Ant $ANT completed mission"