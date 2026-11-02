"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderAIProvider = void 0;
exports.registerAIProvider = registerAIProvider;
exports.getAIProvider = getAIProvider;
/**
 * 空实现，后续扩展
 */
class PlaceholderAIProvider {
    async chat(_message) {
        throw new Error('AI功能尚未实现');
    }
    async generateConfig(_description) {
        throw new Error('AI功能尚未实现');
    }
}
exports.PlaceholderAIProvider = PlaceholderAIProvider;
// 全局AI Provider
let aiProvider = new PlaceholderAIProvider();
function registerAIProvider(provider) {
    aiProvider = provider;
}
function getAIProvider() {
    return aiProvider;
}
//# sourceMappingURL=ai.js.map