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
exports.choose = choose;
exports.enter = enter;
const vscode = __importStar(require("vscode"));
/** One cancellable step, with a real Back button and no implicit default selection. */
function choose(title, options, current, allowBack = true) {
    return new Promise(resolve => {
        const picker = vscode.window.createQuickPick();
        const subscriptions = [];
        let finished = false;
        function finish(answer) {
            if (finished) {
                return;
            }
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
            if (selected) {
                picker.activeItems = [selected];
            }
        }
        if (allowBack) {
            picker.buttons = [vscode.QuickInputButtons.Back];
        }
        subscriptions.push(picker.onDidTriggerButton(() => finish({ kind: 'back' })));
        subscriptions.push(picker.onDidAccept(() => {
            const selected = picker.selectedItems[0];
            if (!selected) {
                return;
            }
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
function enter(title, current, validate, allowBack = true) {
    return new Promise(resolve => {
        const input = vscode.window.createInputBox();
        const subscriptions = [];
        let finished = false;
        function finish(answer) {
            if (finished) {
                return;
            }
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
        if (allowBack) {
            input.buttons = [vscode.QuickInputButtons.Back];
        }
        subscriptions.push(input.onDidTriggerButton(() => finish({ kind: 'back' })));
        subscriptions.push(input.onDidChangeValue(value => { input.validationMessage = validate(value); }));
        subscriptions.push(input.onDidAccept(() => {
            const problem = validate(input.value);
            input.validationMessage = problem;
            if (!problem) {
                finish({ kind: 'next', value: input.value.trim() });
            }
        }));
        subscriptions.push(input.onDidHide(() => finish({ kind: 'cancel' })));
        input.show();
    });
}
//# sourceMappingURL=quickPick.js.map