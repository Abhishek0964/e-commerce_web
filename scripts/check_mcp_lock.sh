#!/bin/bash
# MCP Configuration Lock Status Check

set -e

CONFIG_FILE=".agent/mcp_config.json"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   MCP Configuration Lock Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ ERROR: $CONFIG_FILE not found${NC}"
    exit 1
fi

# Check locked field in JSON
if grep -q '"locked".*true' "$CONFIG_FILE"; then
    echo -e "${GREEN}✅ JSON Lock Field: PRESENT${NC}"
    JSON_LOCKED=true
else
    echo -e "${YELLOW}⚠️  JSON Lock Field: MISSING${NC}"
    JSON_LOCKED=false
fi

# Check file permissions
PERMS=$(stat -c "%a" "$CONFIG_FILE" 2>/dev/null || stat -f "%A" "$CONFIG_FILE" 2>/dev/null || echo "unknown")
if [ "$PERMS" = "444" ]; then
    echo -e "${GREEN}✅ File Permissions: READ-ONLY (444)${NC}"
    PERM_LOCKED=true
elif [ "$PERMS" = "unknown" ]; then
    echo -e "${YELLOW}⚠️  File Permissions: UNKNOWN${NC}"
    PERM_LOCKED=false
else
    echo -e "${YELLOW}⚠️  File Permissions: WRITABLE ($PERMS)${NC}"
    PERM_LOCKED=false
fi

# Check git assume-unchanged status
if git ls-files -v "$CONFIG_FILE" 2>/dev/null | grep -q '^h'; then
    echo -e "${GREEN}✅ Git Tracking: ASSUME-UNCHANGED${NC}"
    GIT_LOCKED=true
else
    echo -e "${YELLOW}⚠️  Git Tracking: TRACKED (not assume-unchanged)${NC}"
    GIT_LOCKED=false
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Overall status
if [ "$JSON_LOCKED" = true ] && [ "$PERM_LOCKED" = true ] && [ "$GIT_LOCKED" = true ]; then
    echo -e "${GREEN}🔒 OVERALL STATUS: FULLY LOCKED${NC}"
    echo ""
    echo "All lock mechanisms are active."
    exit 0
elif [ "$JSON_LOCKED" = true ] && [ "$PERM_LOCKED" = true ]; then
    echo -e "${YELLOW}⚠️  OVERALL STATUS: PARTIALLY LOCKED${NC}"
    echo ""
    echo "Config is locked but git tracking is not disabled."
    echo "Run: git update-index --assume-unchanged $CONFIG_FILE"
    exit 0
else
    echo -e "${RED}🔓 OVERALL STATUS: UNLOCKED${NC}"
    echo ""
    echo "Lock mechanisms are not fully active."
    echo "See .agent/MCP_LOCK_README.md for lock instructions."
    exit 1
fi
