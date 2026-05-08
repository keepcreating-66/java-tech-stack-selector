import * as vscode from 'vscode';
import { startTechStackSelection } from './ui/quickPick';
import { generateProject } from './core/generator';
import { registerAIProvider, PlaceholderAIProvider } from './core/ai';

export function activate(context: vscode.ExtensionContext) {
    // 注册AI Provider（预留）
    registerAIProvider(new PlaceholderAIProvider());

    // 注册开始选型命令
    let startCmd = vscode.commands.registerCommand(
        'javaTechStack.start',
        async () => {
            try {
                // 显示进度
                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: 'Java Tech Stack Selector',
                        cancellable: false
                    },
                    async (progress) => {
                        progress.report({ message: '正在收集配置...' });
                        
                        const config = await startTechStackSelection();
                        
                        if (config) {
                            progress.report({ message: '正在生成项目...' });
                            await generateProject(config);
                        }
                    }
                );
            } catch (error: any) {
                vscode.window.showErrorMessage(
                    `技术选型失败: ${error.message || error}`
                );
            }
        }
    );

    // 注册预设方案命令
    let presetCmd = vscode.commands.registerCommand(
        'javaTechStack.preset',
        async () => {
            // 快速使用预设方案
            const { PRESETS } = await import('./core/data');
            
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
                    await generateProject(selected.preset.config);
                } catch (error: any) {
                    vscode.window.showErrorMessage(
                        `生成失败: ${error.message || error}`
                    );
                }
            }
        }
    );

    context.subscriptions.push(startCmd, presetCmd);
}

export function deactivate() {}
