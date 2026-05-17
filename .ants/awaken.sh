#!/bin/bash
# Load .env file
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Required environment variables
REQUIRED_VARS=("ANT" "GITHUB_TOKEN" "REPOSITORY" "API_KEY" "MODEL" "PROVIDER")

# Validate required variables
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set"
        exit 1
    fi
done

# Cleanup function
cleanup() {
    echo "Cleaning up $ANT_DIR..."
    rm -rf $ANT_DIR
}

# Set trap to cleanup on exit
trap cleanup EXIT

echo "Awakening 🐜 ${ANT}..."

# Create a random temp directory for the ant
ANT_DIR=$(mktemp -d)
echo "🐜 $ANT will work in $REPOSITORY today"

# Configure agent identity
gh auth setup-git
git config --global user.name "🐜 $ANT"
git config --global user.email "${EMAIL:-"$ANT@ants.io"}"
git config --global --add safe.directory "$ANT_DIR"



# Clone or copy repository
echo "🐜 Cloning remote repository..."
rm -rf $ANT_DIR/ants
gh repo clone $REPOSITORY $ANT_DIR

# Work in mounted repository
cd $ANT_DIR

# Copy .ants files from the source (they're not in the remote repo)
# cp -r /workspace/.ants .ants/

# Load brain.md and instinct.md as prompt if PROMPT not set
# if [ -z "$PROMPT" ]; then
#     if [ ! -f .ants/$ANT/brain.md ]; then
#         echo "Error: .ants/$ANT/brain.md not found in repository"
#         ls -la .ants/
#         exit 1
#     fi
#     PROMPT=$(cat .ants/$ANT/brain.md)
#     if [ -f .ants/pheromones/instinct.md ]; then
#         PROMPT="$PROMPT"$'\n\n'$(cat .ants/pheromones/instinct.md)
#     fi
#     echo "Prompt loaded, length: ${#PROMPT}"
# fi

echo "🐜 $ANT is awakening and working now..."

# OpenCode config
export OPENROUTER_API_KEY="$API_KEY"
mkdir -p ~/.config/opencode

jq -n \
  --arg provider "$PROVIDER" \
  --arg apiKey "$API_KEY" \
  '{
    "$schema": "https://opencode.ai/config.json",
    "provider": (
      if $provider == "google" then
        {
          "google": {
            "npm": "@ai-sdk/openai-compatible",
            "name": "Google AI",
            "options": {
              "baseURL": "https://generativelanguage.googleapis.com/v1beta",
              "apiKey": $apiKey
            }
          }
        }
      elif $provider == "openai" then
        {
          "openai": {
            "npm": "openai",
            "name": "OpenAI",
            "options": {
              "apiKey": $apiKey
            }
          }
        }
      else
        {}
      end
    ),
    "mcp": {
      "git": {
        "type": "local",
        "command": ["npx", "-y", "@modelcontextprotocol/server-git"],
        "enabled": true
      },
      "filesystem": {
        "type": "local",
        "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem"],
        "enabled": true
      },
      "github": {
        "type": "remote",
        "url": "https://api.githubcopilot.com/mcp/",
        "enabled": true
      }
    }
  }' > ~/.config/opencode/config.json

opencode run "$PROMPT" -m "$MODEL" --dir .
