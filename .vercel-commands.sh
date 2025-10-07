#!/bin/bash

# ========================================
# Commandes Utiles pour Vercel
# ========================================
# 
# Ce fichier contient toutes les commandes
# nécessaires pour déployer et gérer votre
# application sur Vercel.
#
# Usage: chmod +x .vercel-commands.sh
#        ./.vercel-commands.sh [commande]
# ========================================

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ========================================
# FONCTIONS
# ========================================

check_config() {
    echo -e "${BLUE}🔍 Vérification de la configuration Vercel...${NC}"
    npm run vercel:check
}

build_local() {
    echo -e "${BLUE}🔨 Build local de l'application...${NC}"
    npm run build
}

preview_local() {
    echo -e "${BLUE}👀 Preview local (après build)...${NC}"
    npm run preview
}

install_vercel_cli() {
    echo -e "${BLUE}📦 Installation de Vercel CLI...${NC}"
    npm i -g vercel
}

vercel_login() {
    echo -e "${BLUE}🔐 Login sur Vercel...${NC}"
    vercel login
}

deploy_preview() {
    echo -e "${BLUE}🚀 Déploiement en Preview...${NC}"
    npm run vercel:preview
}

deploy_production() {
    echo -e "${YELLOW}⚠️  Déploiement en PRODUCTION...${NC}"
    read -p "Êtes-vous sûr ? (oui/non) " -n 3 -r
    echo
    if [[ $REPLY =~ ^[Oo][Uu][Ii]$ ]]
    then
        npm run vercel:deploy
    else
        echo -e "${RED}❌ Déploiement annulé${NC}"
    fi
}

setup_complete() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Installation Complète de Vercel CLI${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    install_vercel_cli
    echo ""
    vercel_login
    echo ""
    echo -e "${GREEN}✅ Setup terminé !${NC}"
    echo -e "${BLUE}Vous pouvez maintenant déployer avec :${NC}"
    echo -e "  ${YELLOW}npm run vercel:preview${NC}   (preview)"
    echo -e "  ${YELLOW}npm run vercel:deploy${NC}    (production)"
}

cleanup_netlify() {
    echo -e "${YELLOW}🗑️  Suppression des fichiers Netlify...${NC}"
    read -p "Êtes-vous sûr ? (oui/non) " -n 3 -r
    echo
    if [[ $REPLY =~ ^[Oo][Uu][Ii]$ ]]
    then
        rm -f netlify.toml
        rm -f public/_redirects
        rm -f dist/_redirects
        echo -e "${GREEN}✅ Fichiers Netlify supprimés${NC}"
    else
        echo -e "${RED}❌ Suppression annulée${NC}"
    fi
}

show_help() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}🚀 Commandes Vercel Disponibles${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${GREEN}Configuration & Vérification :${NC}"
    echo -e "  ${YELLOW}check${NC}           - Vérifier la configuration"
    echo -e "  ${YELLOW}build${NC}           - Build local"
    echo -e "  ${YELLOW}preview${NC}         - Preview local"
    echo ""
    echo -e "${GREEN}Setup Initial :${NC}"
    echo -e "  ${YELLOW}setup${NC}           - Installation complète de Vercel CLI"
    echo -e "  ${YELLOW}install-cli${NC}     - Installer Vercel CLI uniquement"
    echo -e "  ${YELLOW}login${NC}           - Login sur Vercel"
    echo ""
    echo -e "${GREEN}Déploiement :${NC}"
    echo -e "  ${YELLOW}deploy-preview${NC}  - Déployer en preview"
    echo -e "  ${YELLOW}deploy-prod${NC}     - Déployer en production"
    echo ""
    echo -e "${GREEN}Nettoyage :${NC}"
    echo -e "  ${YELLOW}cleanup${NC}         - Supprimer les fichiers Netlify"
    echo ""
    echo -e "${GREEN}Documentation :${NC}"
    echo -e "  ${YELLOW}docs${NC}            - Ouvrir le guide de démarrage"
    echo ""
}

open_docs() {
    echo -e "${BLUE}📚 Ouverture du guide de démarrage...${NC}"
    if command -v open &> /dev/null; then
        open VERCEL_QUICK_START.md
    elif command -v xdg-open &> /dev/null; then
        xdg-open VERCEL_QUICK_START.md
    else
        echo -e "${YELLOW}Ouvrez manuellement : VERCEL_QUICK_START.md${NC}"
    fi
}

# ========================================
# MENU PRINCIPAL
# ========================================

case "$1" in
    check)
        check_config
        ;;
    build)
        build_local
        ;;
    preview)
        build_local
        echo ""
        preview_local
        ;;
    setup)
        setup_complete
        ;;
    install-cli)
        install_vercel_cli
        ;;
    login)
        vercel_login
        ;;
    deploy-preview)
        check_config
        echo ""
        deploy_preview
        ;;
    deploy-prod)
        check_config
        echo ""
        deploy_production
        ;;
    cleanup)
        cleanup_netlify
        ;;
    docs)
        open_docs
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Commande inconnue : $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

