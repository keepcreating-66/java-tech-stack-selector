import * as vscode from 'vscode';
import { QuickPickOption } from '../core/types';

export type Answer = { kind: 'next'; value: string } | { kind: 'back' } | { kind: 'cancel' };

/** One cancellable step, with a real Back button and no implicit default selection. */
export function choose(title: string, options: QuickPickOption[], current?: string, allowBack = true): Promise<Answer> {
    return new Promise(resolve => {
        const picker = vscode.window.createQuickPick<QuickPickOption>();
        const subscriptions: vscode.Disposable[] = [];
        let finished = false;
        function finish(answer: Answer): void {
            if (finished) { return; }
            finished = true;
            picker.hide();
            subscriptions.forEach(subscription => subscription.dispose());
            picker.dispose();
            resolve(answer);
        }
        picker.title = title;
        picker.placeholder = '请选择；Esc 取消整个流程';
        picker.ignoreFocusOut = true;
        picker.matchOnDescription = true;
        picker.items = options;
        if (current) {
            const selected = options.find(option => option.value === current);
            if (selected) { picker.activeItems = [selected]; }
        }
        if (allowBack) { picker.buttons = [vscode.QuickInputButtons.Back]; }
        subscriptions.push(picker.onDidTriggerButton(() => finish({ kind: 'back' })));
        subscriptions.push(picker.onDidAccept(() => {
            const selected = picker.selectedItems[0];
            if (!selected) { return; }
            if (selected.value === '__unsupported__') {
                void vscode.window.showWarningMessage('该选项尚未支持工程生成，请选择当前可用选项。');
                return;
            }
            finish({ kind: 'next', value: selected.value });
        }));
        subscriptions.push(picker.onDidHide(() => finish({ kind: 'cancel' })));
        picker.show();
    });
}

export function enter(title: string, current: string, validate: (value: string) => string | undefined, allowBack = true): Promise<Answer> {
    return new Promise(resolve => {
        const input = vscode.window.createInputBox();
        const subscriptions: vscode.Disposable[] = [];
        let finished = false;
        function finish(answer: Answer): void {
            if (finished) { return; }
            finished = true;
            input.hide();
            subscriptions.forEach(subscription => subscription.dispose());
            input.dispose();
            resolve(answer);
        }
        input.title = title;
        input.placeholder = '输入完成后按 Enter；Esc 取消整个流程';
        input.value = current;
        input.ignoreFocusOut = true;
        if (allowBack) { input.buttons = [vscode.QuickInputButtons.Back]; }
        subscriptions.push(input.onDidTriggerButton(() => finish({ kind: 'back' })));
        subscriptions.push(input.onDidChangeValue(value => { input.validationMessage = validate(value); }));
        subscriptions.push(input.onDidAccept(() => {
            const problem = validate(input.value);
            input.validationMessage = problem;
            if (!problem) { finish({ kind: 'next', value: input.value.trim() }); }
        }));
        subscriptions.push(input.onDidHide(() => finish({ kind: 'cancel' })));
        input.show();
    });
}
