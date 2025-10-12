#!/bin/bash

# Test direct de l'API StarAPI pour @therock
# Basé sur l'interface RapidAPI que vous avez montrée

echo "🔍 Test direct de l'API StarAPI pour @therock"
echo "================================================"

# Configuration API
RAPIDAPI_KEY="3b8b4d9067msh42e44044539aa07p17800fjsn924eff22b54d"
STARAPI_URL="https://starapi1.p.rapidapi.com"
USERNAME="therock"

echo "📋 Configuration:"
echo "  - Username: @$USERNAME"
echo "  - API Key: ${RAPIDAPI_KEY:0:10}..."
echo "  - Base URL: $STARAPI_URL"
echo ""

# Étape 1: Récupérer l'ID utilisateur
echo "🔍 ÉTAPE 1: Récupération de l'ID utilisateur..."
echo "----------------------------------------"

USER_ID_RESPONSE=$(curl -s -X POST \
  "$STARAPI_URL/instagram/user/get_web_profile_info" \
  -H "Content-Type: application/json" \
  -H "x-rapidapi-host: starapi1.p.rapidapi.com" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -d "{\"username\": \"$USERNAME\"}")

echo "📡 Réponse get_web_profile_info (extrait):"
echo "$USER_ID_RESPONSE" | grep -o '"id":"[^"]*"' | head -1
echo ""

# Extraire l'ID utilisateur (sans jq, avec grep)
USER_ID=$(echo "$USER_ID_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')

if [ "$USER_ID" = "null" ] || [ -z "$USER_ID" ]; then
    echo "❌ ERREUR: Impossible de récupérer l'ID utilisateur pour @$USERNAME"
    echo "   Vérifiez que le profil existe et est public"
    exit 1
fi

echo "✅ ID utilisateur trouvé: $USER_ID"
echo ""

# Étape 2: Récupérer les clips
echo "🔍 ÉTAPE 2: Récupération des clips..."
echo "----------------------------------------"

CLIPS_RESPONSE=$(curl -s -X POST \
  "$STARAPI_URL/instagram/user/get_clips" \
  -H "Content-Type: application/json" \
  -H "x-rapidapi-host: starapi1.p.rapidapi.com" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -d "{\"id\": \"$USER_ID\", \"count\": 50}")

echo "📡 Réponse get_clips (extrait):"
echo "$CLIPS_RESPONSE" | grep -o '"media_type":[0-9]*' | head -10
echo ""

# Analyser les résultats (sans jq)
TOTAL_CLIPS=$(echo "$CLIPS_RESPONSE" | grep -o '"items":\[' | wc -l)
if [ "$TOTAL_CLIPS" -gt 0 ]; then
    TOTAL_CLIPS=$(echo "$CLIPS_RESPONSE" | grep -o '"id":"[^"]*"' | wc -l)
fi
REEL_CLIPS=$(echo "$CLIPS_RESPONSE" | grep -o '"media_type":2\|"media_type":8' | wc -l)

echo "📊 ANALYSE DES RÉSULTATS:"
echo "=========================="
echo "  - Total clips récupérés: $TOTAL_CLIPS"
echo "  - Reels (media_type 2 ou 8): $REEL_CLIPS"
echo ""

if [ "$TOTAL_CLIPS" -eq 0 ]; then
    echo "❌ PROBLÈME: Aucun clip récupéré"
    echo "   Causes possibles:"
    echo "   - Le compte n'a pas de clips/reels"
    echo "   - Problème avec l'API StarAPI"
    echo "   - Compte privé ou restreint"
elif [ "$REEL_CLIPS" -eq 0 ]; then
    echo "⚠️  ATTENTION: Des clips sont récupérés mais aucun reel"
    echo "   Le compte pourrait avoir seulement des posts photos"
else
    echo "✅ SUCCESS: $REEL_CLIPS reels trouvés!"
    echo ""
    echo "🎬 Exemples de reels:"
    echo "$CLIPS_RESPONSE" | grep -o '"id":"[^"]*".*"media_type":[28]' | head -5 | sed 's/"id":"/  - ID: /;s/".*"media_type":/ (Type: /;s/$/)/'
fi

echo ""
echo "🔍 DIAGNOSTIC TERMINÉ"
echo "====================="
