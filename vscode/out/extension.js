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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const quickPick_1 = require("./ui/quickPick");
const generator_1 = require("./core/generator");
const ai_1 = require("./core/ai");
function activate(context) {
    // 注册AI Provider（预留）
    (0, ai_1.registerAIProvider)(new ai_1.PlaceholderAIProvider());
    // 注册开始选型命令
    let startCmd = vscode.commands.registerCommand('javaTechStack.start', async () => {
        try {
            // 显示进度
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Java Tech Stack Selector',
                cancellable: false
            }, async (progress) => {
                progress.report({ message: '正在收集配置...' });
                const config = await (0, quickPick_1.startTechStackSelection)();
                if (config) {
                    progress.report({ message: '正在生成项目...' });
                    await (0, generator_1.generateProject)(config);
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`技术选型失败: ${error.message || error}`);
        }
    });
    // 注册预设方案命令
    let presetCmd = vscode.commands.registerCommand('javaTechStack.preset', async () => {
        // 快速使用预设方案
        const { PRESETS } = await Promise.resolve().then(() => __importStar(require('./core/data')));
        const items = PRESETS.map(p => ({
            label: `${p.icon} ${p.name}`,
            description: p.description,
            preset: p
        }));
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: '选择预设方案',
            ignoreFocusOut: true
        });
        if (selected) {
            try {
                await (0, generator_1.generateProject)(selected.preset.config);
            }
            catch (error) {
                vscode.window.showErrorMessage(`生成失败: ${error.message || error}`);
            }
        }
    });
    context.subscriptions.push(startCmd, presetCmd);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map