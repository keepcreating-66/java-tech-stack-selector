import * as vscode from 'vscode';
import { runWizard } from './flow/wizard';
import { generateProject } from './core/generator';

/** Both commands enter the same architecture-first, reviewable flow. */
export function activate(context: vscode.ExtensionContext): void {
    async function execute(): Promise<void> {
        try {
            const config = await runWizard();
            if (!config) { return; }
            await generateProject(config);
        } catch (error) {
            void vscode.window.showErrorMessage(`项目生成失败：${error instanceof Error ? error.message : String(error)}`);
        }
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('javaTechStack.start', execute),
        vscode.commands.registerCommand('javaTechStack.preset', execute)
    );
}

export function deactivate(): void {}
