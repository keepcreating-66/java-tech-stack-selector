"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTechStackSelection = startTechStackSelection;
const vscode = __importStar(require("vscode"));
const data_1 = require("../core/data");
/**
 * 开始技术选型流程
 */
async function startTechStackSelection() {
    // 步骤0: 选择预设或自定义
    const presetItems = [
        ...data_1.PRESETS.map(p => ({
            label: `${p.icon} ${p.name}`,
            description: p.description,
            value: p.id
        })),
        {
            label: '$(edit) 自定义配置',
            description: '手动选择每个模块',
            value: 'custom'
        }
    ];
    const presetChoice = await vscode.window.showQuickPick(presetItems, {
        placeHolder: '选择预设方案或自定义配置',
        ignoreFocusOut: true
    });
    if (!presetChoice) {
        return undefined;
    }
    // 如果选择预设
    if (presetChoice.value !== 'custom') {
        const preset = data_1.PRESETS.find(p => p.id === presetChoice.value);
        if (preset) {
            return await customizePreset(preset.config);
        }
    }
    // 自定义配置流程
    return await customSelection();
}
/**
 * 自定义预设配置
 */
async function customizePreset(baseConfig) {
    // 只询问项目名称
    const projectName = await vscode.window.showInputBox({
        prompt: '请输入项目名称',
        value: baseConfig.project.name,
        placeHolder: '例如：my-shop',
        ignoreFocusOut: true,
        validateInput: validateProjectName
    });
    if (!projectName) {
        return undefined;
    }
    return {
        ...baseConfig,
        project: {
            ...baseConfig.project,
            name: projectName
        }
    };
}
/**
 * 自定义配置选择流程
 */
async function customSelection() {
    // 步骤1: 项目名称
    const projectName = await vscode.window.showInputBox({
        prompt: '请输入项目名称',
        value: 'my-project',
        placeHolder: '例如：my-shop',
        ignoreFocusOut: true,
        validateInput: validateProjectName
    });
    if (!projectName)
        return undefined;
    // 步骤2: 项目类型
    const projectType = await showQuickPick('选择项目类型', data_1.OPTIONS.projectType);
    if (!projectType)
        return undefined;
    // 步骤3: Java版本
    const javaVersion = await showQuickPick('选择Java版本', data_1.OPTIONS.javaVersion);
    if (!javaVersion)
        return undefined;
    // 步骤4: 构建工具
    const buildTool = await showQuickPick('选择构建工具', data_1.OPTIONS.buildTool);
    if (!buildTool)
        return undefined;
    // 步骤5: 框架版本（根据Java版本过滤）
    const frameworkOptions = data_1.OPTIONS.framework.filter(f => {
        if (javaVersion === '8' && f.value === 'spring-boot-3') {
            return false;
        }
        return true;
    });
    const framework = await showQuickPick('选择Spring Boot版本', frameworkOptions);
    if (!framework)
        return undefined;
    // 步骤6: 数据库
    const database = await showQuickPick('选择关系型数据库', data_1.OPTIONS.database);
    if (!database)
        return undefined;
    // 步骤7: ORM
    const orm = await showQuickPick('选择ORM框架', data_1.OPTIONS.orm);
    if (!orm)
        return undefined;
    // 步骤8: 连接池
    const pool = await showQuickPick('选择连接池', data_1.OPTIONS.pool);
    if (!pool)
        return undefined;
    // 步骤9: 缓存
    const cache = await showQuickPick('选择缓存方案', data_1.OPTIONS.cache);
    if (!cache)
        return undefined;
    // 步骤10: 认证框架
    const security = await showQuickPick('选择认证框架', data_1.OPTIONS.security);
    if (!security)
        return undefined;
    // 步骤11: API文档
    const apiDoc = await showQuickPick('选择API文档工具', data_1.OPTIONS.apiDoc);
    if (!apiDoc)
        return undefined;
    // 步骤12: 消息队列（可选）
    const messaging = await showQuickPick('选择消息队列（可跳过）', data_1.OPTIONS.messaging);
    // 步骤13: 工作流（可选）
    const workflow = await showQuickPick('选择工作流引擎（可跳过）', data_1.OPTIONS.workflow);
    // 步骤14: 定时任务（可选）
    const scheduler = await showQuickPick('选择定时任务方案（可跳过）', data_1.OPTIONS.scheduler);
    // 构建配置
    const config = {
        project: {
            name: projectName,
            type: projectType,
            javaVersion: javaVersion,
            buildTool: buildTool
        },
        core: {
            framework: framework,
            web: 'webmvc'
        },
        database: {
            rdbms: database,
            orm: orm,
            pool: pool,
            nosql: ['redis']
        },
        cache: {
            type: cache
        },
        security: {
            framework: security
        },
        api: {
            documentation: apiDoc
        },
        messaging: messaging,
        workflow: workflow,
        scheduler: scheduler
    };
    // 显示确认
    return await confirmConfig(config);
}
/**
 * 显示配置确认
 */
async function confirmConfig(config) {
    const summary = [
        `项目名称: ${config.project.name}`,
        `项目类型: ${config.project.type}`,
        `Java版本: JDK ${config.project.javaVersion}`,
        `构建工具: ${config.project.buildTool}`,
        `框架: ${config.core.framework}`,
        `数据库: ${config.database.rdbms}`,
        `ORM: ${config.database.orm}`,
        `连接池: ${config.database.pool}`,
        `缓存: ${config.cache.type}`,
        `认证: ${config.security.framework}`,
        `API文档: ${config.api.documentation}`
    ];
    if (config.messaging && config.messaging !== 'none') {
        summary.push(`消息队列: ${config.messaging}`);
    }
    if (config.workflow && config.workflow !== 'none') {
        summary.push(`工作流: ${config.workflow}`);
    }
    if (config.scheduler && config.scheduler !== 'none') {
        summary.push(`定时任务: ${config.scheduler}`);
    }
    const confirm = await vscode.window.showQuickPick([
        {
            label: '$(check) 确认配置',
            description: '生成项目',
            value: 'confirm'
        },
        {
            label: '$(edit) 重新选择',
            description: '返回重新配置',
            value: 'restart'
        }
    ], {
        placeHolder: summary.join(' | '),
        ignoreFocusOut: true
    });
    if (!confirm || confirm.value === 'restart') {
        return undefined;
    }
    return config;
}
/**
 * 显示QuickPick选择器
 */
async function showQuickPick(title, options) {
    const selected = await vscode.window.showQuickPick(options, {
        placeHolder: title,
        ignoreFocusOut: true
    });
    return selected?.value;
}
/**
 * 验证项目名称
 */
function validateProjectName(value) {
    if (!value) {
        return '项目名称不能为空';
    }
    if (!value.match(/^[a-z][a-z0-9-]*$/)) {
        return '项目名称只能包含小写字母、数字和连字符，且以字母开头';
    }
    if (value.length > 50) {
        return '项目名称不能超过50个字符';
    }
    return null;
}
//# sourceMappingURL=quickPick.js.map