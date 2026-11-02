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
exports.generateProject = generateProject;
const vscode = __importStar(require("vscode"));
const capabilities_1 = require("./capabilities");
const plan_1 = require("../generation/plan");
const write_1 = require("../generation/write");
/** IDE adapter. Planning and writing are exported separately for real production tests. */
async function generateProject(config) {
    const plan = (0, plan_1.planProject)(config);
    const selected = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: '选择项目输出目录'
    });
    if (!selected?.length) {
        return;
    }
    const projectDir = (0, write_1.writeProject)(plan, selected[0].fsPath);
    const mode = config.outputMode ?? 'project';
    const label = mode === 'project' ? `${capabilities_1.ARCHITECTURE_LABELS[config.project.type]}工程` : mode === 'config' ? '配置文件' : '提示词';
    const openFolder = mode === 'project' ? '打开项目' : '打开目录';
    const status = mode === 'project' ? '构建未验证' : '未创建工程';
    const result = await vscode.window.showInformationMessage(`已创建 ${label}：${config.project.name}（${Object.keys(plan.files).length} 个文件；${status}）`, openFolder);
    if (result === openFolder) {
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), true);
    }
}
//# sourceMappingURL=generator.js.map