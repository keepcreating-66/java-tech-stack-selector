#!/bin/bash

# Java Tech Stack Selector - 配置验证脚本
# 用于验证生成的技术栈配置是否正确

set -e

echo "=========================================="
echo "Java Tech Stack Selector - 配置验证"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}[OK]${NC} $1"
        return 0
    else
        echo -e "${RED}[MISSING]${NC} $1"
        return 1
    fi
}

check_json() {
    if command -v jq &> /dev/null; then
        if jq empty "$1" 2>/dev/null; then
            echo -e "${GREEN}[OK]${NC} JSON格式正确: $1"
            return 0
        else
            echo -e "${RED}[ERROR]${NC} JSON格式错误: $1"
            return 1
        fi
    else
        echo -e "${YELLOW}[SKIP]${NC} jq未安装，跳过JSON验证: $1"
        return 0
    fi
}

check_xml() {
    if command -v xmllint &> /dev/null; then
        if xmllint --noout "$1" 2>/dev/null; then
            echo -e "${GREEN}[OK]${NC} XML格式正确: $1"
            return 0
        else
            echo -e "${RED}[ERROR]${NC} XML格式错误: $1"
            return 1
        fi
    else
        echo -e "${YELLOW}[SKIP]${NC} xmllint未安装，跳过XML验证: $1"
        return 0
    fi
}

# 主验证流程
echo "1. 检查项目结构..."
echo ""

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)

ERRORS=0

# 检查核心文件
echo "   检查核心文件:"
check_file "$PROJECT_ROOT/.cursor-plugin/plugin.json" || ((ERRORS++))
check_file "$PROJECT_ROOT/skills/tech-stack-selector/SKILL.md" || ((ERRORS++))

echo ""
echo "   检查参考文档:"
check_file "$PROJECT_ROOT/skills/tech-stack-selector/references/modules.md" || ((ERRORS++))
check_file "$PROJECT_ROOT/skills/tech-stack-selector/references/presets.md" || ((ERRORS++))
check_file "$PROJECT_ROOT/skills/tech-stack-selector/references/compatibility.md" || ((ERRORS++))

echo ""
echo "   检查模板文件:"
check_file "$PROJECT_ROOT/skills/tech-stack-selector/templates/tech-stack-config.json" || ((ERRORS++))
check_json "$PROJECT_ROOT/skills/tech-stack-selector/templates/tech-stack-config.json" || ((ERRORS++))
check_file "$PROJECT_ROOT/skills/tech-stack-selector/templates/pom-fragment.xml" || ((ERRORS++))
check_xml "$PROJECT_ROOT/skills/tech-stack-selector/templates/pom-fragment.xml" || ((ERRORS++))
check_file "$PROJECT_ROOT/skills/tech-stack-selector/templates/project-prompt.md" || ((ERRORS++))
check_file "$PROJECT_ROOT/skills/tech-stack-selector/templates/cursor-prompt.md" || ((ERRORS++))

echo ""
echo "   检查命令文件:"
check_file "$PROJECT_ROOT/commands/start.md" || ((ERRORS++))
check_file "$PROJECT_ROOT/commands/preset.md" || ((ERRORS++))
check_file "$PROJECT_ROOT/commands/export.md" || ((ERRORS++))

echo ""
echo "   检查文档:"
check_file "$PROJECT_ROOT/README.md" || ((ERRORS++))
check_file "$PROJECT_ROOT/LICENSE" || ((ERRORS++))
check_file "$PROJECT_ROOT/CHANGELOG.md" || ((ERRORS++))

echo ""
echo "=========================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}验证通过！所有文件都已正确创建。${NC}"
    exit 0
else
    echo -e "${RED}验证失败！有 $ERRORS 个错误。${NC}"
    exit 1
fi
