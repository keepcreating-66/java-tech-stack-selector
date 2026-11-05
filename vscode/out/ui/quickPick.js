"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vscode/src/ui/quickPick.ts
var quickPick_exports = {};
__export(quickPick_exports, {
  choose: () => choose,
  enter: () => enter
});
module.exports = __toCommonJS(quickPick_exports);
var vscode = __toESM(require("vscode"));
function choose(title, options, current, allowBack = true) {
  return new Promise((resolve) => {
    const picker = vscode.window.createQuickPick();
    const subscriptions = [];
    let finished = false;
    function finish(answer) {
      if (finished) {
        return;
      }
      finished = true;
      picker.hide();
      subscriptions.forEach((subscription) => subscription.dispose());
      picker.dispose();
      resolve(answer);
    }
    picker.title = title;
    picker.placeholder = "\u8BF7\u9009\u62E9\uFF1BEsc \u53D6\u6D88\u6574\u4E2A\u6D41\u7A0B";
    picker.ignoreFocusOut = true;
    picker.matchOnDescription = true;
    picker.items = options;
    if (current) {
      const selected = options.find((option) => option.value === current);
      if (selected) {
        picker.activeItems = [selected];
      }
    }
    if (allowBack) {
      picker.buttons = [vscode.QuickInputButtons.Back];
    }
    subscriptions.push(picker.onDidTriggerButton(() => finish({ kind: "back" })));
    subscriptions.push(picker.onDidAccept(() => {
      const selected = picker.selectedItems[0];
      if (!selected) {
        return;
      }
      if (selected.value === "__unsupported__") {
        void vscode.window.showWarningMessage("\u8BE5\u9009\u9879\u5C1A\u672A\u652F\u6301\u5DE5\u7A0B\u751F\u6210\uFF0C\u8BF7\u9009\u62E9\u5F53\u524D\u53EF\u7528\u9009\u9879\u3002");
        return;
      }
      finish({ kind: "next", value: selected.value });
    }));
    subscriptions.push(picker.onDidHide(() => finish({ kind: "cancel" })));
    picker.show();
  });
}
function enter(title, current, validate, allowBack = true) {
  return new Promise((resolve) => {
    const input = vscode.window.createInputBox();
    const subscriptions = [];
    let finished = false;
    function finish(answer) {
      if (finished) {
        return;
      }
      finished = true;
      input.hide();
      subscriptions.forEach((subscription) => subscription.dispose());
      input.dispose();
      resolve(answer);
    }
    input.title = title;
    input.placeholder = "\u8F93\u5165\u5B8C\u6210\u540E\u6309 Enter\uFF1BEsc \u53D6\u6D88\u6574\u4E2A\u6D41\u7A0B";
    input.value = current;
    input.ignoreFocusOut = true;
    if (allowBack) {
      input.buttons = [vscode.QuickInputButtons.Back];
    }
    subscriptions.push(input.onDidTriggerButton(() => finish({ kind: "back" })));
    subscriptions.push(input.onDidChangeValue((value) => {
      input.validationMessage = validate(value);
    }));
    subscriptions.push(input.onDidAccept(() => {
      const problem = validate(input.value);
      input.validationMessage = problem;
      if (!problem) {
        finish({ kind: "next", value: input.value.trim() });
      }
    }));
    subscriptions.push(input.onDidHide(() => finish({ kind: "cancel" })));
    input.show();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  choose,
  enter
});
