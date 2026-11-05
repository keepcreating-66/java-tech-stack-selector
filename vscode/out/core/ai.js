"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vscode/src/core/ai.ts
var ai_exports = {};
__export(ai_exports, {
  PlaceholderAIProvider: () => PlaceholderAIProvider,
  getAIProvider: () => getAIProvider,
  registerAIProvider: () => registerAIProvider
});
module.exports = __toCommonJS(ai_exports);
var PlaceholderAIProvider = class {
  async chat(_message) {
    throw new Error("AI\u529F\u80FD\u5C1A\u672A\u5B9E\u73B0");
  }
  async generateConfig(_description) {
    throw new Error("AI\u529F\u80FD\u5C1A\u672A\u5B9E\u73B0");
  }
};
var aiProvider = new PlaceholderAIProvider();
function registerAIProvider(provider) {
  aiProvider = provider;
}
function getAIProvider() {
  return aiProvider;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PlaceholderAIProvider,
  getAIProvider,
  registerAIProvider
});
