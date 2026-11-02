import * as vscode from 'vscode';
import { TechStackConfig } from './types';
import { ARCHITECTURE_LABELS } from './capabilities';
import { planProject } from '../generation/plan';
import { writeProject } from '../generation/write';

/** IDE adapter. Planning and writing are exported separately for real production tests. */
export async function generateProject(config: TechStackConfig): Promise<void> {
    const plan = planProject(config);
    const selected = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: '选择项目输出目录'
    });
    if (!selected?.length) {
        return;
    }
    const projectDir = writeProject(plan, selected[0].fsPath);
    const mode = config.outputMode ?? 'project';
    const label = mode === 'project' ? `${ARCHITECTURE_LABELS[config.project.type]}工程` : mode === 'config' ? '配置文件' : '提示词';
    const openFolder = mode === 'project' ? '打开项目' : '打开目录';
    const status = mode === 'project' ? '构建未验证' : '未创建工程';
    const result = await vscode.window.showInformationMessage(
        `已创建 ${label}：${config.project.name}（${Object.keys(plan.files).length} 个文件；${status}）`, openFolder
    );
    if (result === openFolder) {
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), true);
    }
}
