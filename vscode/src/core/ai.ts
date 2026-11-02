import { TechStackConfig } from './types';

/**
 * AI接口预留
 * 后续可扩展为支持AI对话式配置生成
 */
export interface AIProvider {
    /**
     * 与AI对话
     */
    chat(message: string): Promise<string>;
    
    /**
     * 根据描述生成配置
     */
    generateConfig(description: string): Promise<TechStackConfig>;
}

/**
 * 空实现，后续扩展
 */
export class PlaceholderAIProvider implements AIProvider {
    async chat(_message: string): Promise<string> {
        throw new Error('AI功能尚未实现');
    }
    
    async generateConfig(_description: string): Promise<TechStackConfig> {
        throw new Error('AI功能尚未实现');
    }
}

// 全局AI Provider
let aiProvider: AIProvider = new PlaceholderAIProvider();

export function registerAIProvider(provider: AIProvider) {
    aiProvider = provider;
}

export function getAIProvider(): AIProvider {
    return aiProvider;
}
