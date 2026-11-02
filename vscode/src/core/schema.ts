import { TechStackConfig } from './types';

/** Runtime shape guard shared by JSON callers and the production planning boundary. */
export function configShapeErrors(input: unknown): string[] {
    const errors: string[] = [];
    const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
    if (!object(input)) { return ['配置必须是 JSON 对象']; }
    const fields: Record<string, string[]> = {
        project: ['name', 'type', 'javaVersion', 'buildTool'], core: ['framework', 'web'],
        database: ['rdbms', 'orm', 'pool'], cache: ['type'], security: ['framework'], api: ['documentation']
    };
    const extras: Record<string, string[]> = { project: ['modules'], database: ['nosql'] };
    const top = [...Object.keys(fields), 'schemaVersion', 'presetId', 'outputMode', 'microservice', 'messaging', 'workflow', 'scheduler'];
    for (const key of Object.keys(input)) {
        if (!top.includes(key)) { errors.push(`不支持的配置字段：${key}`); }
    }
    for (const [section, required] of Object.entries(fields)) {
        const value = input[section];
        if (!object(value)) { errors.push(`缺少配置对象：${section}`); continue; }
        for (const key of required) {
            if (typeof value[key] !== 'string' || !value[key]) { errors.push(`配置字段 ${section}.${key} 必须是非空字符串`); }
        }
        for (const key of Object.keys(value)) {
            if (![...required, ...(extras[section] ?? [])].includes(key)) { errors.push(`不支持的配置字段：${section}.${key}`); }
        }
    }
    if (object(input.project) && input.project.modules !== undefined
        && (!Array.isArray(input.project.modules) || input.project.modules.some(value => typeof value !== 'string'))) {
        errors.push('project.modules 必须是字符串数组');
    }
    if (object(input.database) && (!Array.isArray(input.database.nosql) || input.database.nosql.some(value => typeof value !== 'string'))) {
        errors.push('database.nosql 必须是字符串数组');
    }
    for (const key of ['presetId', 'outputMode', 'messaging', 'workflow', 'scheduler']) {
        if (input[key] !== undefined && typeof input[key] !== 'string') { errors.push(`${key} 必须是字符串`); }
    }
    if (input.microservice !== undefined) {
        if (!object(input.microservice) || typeof input.microservice.gateway !== 'boolean') { errors.push('microservice.gateway 必须是布尔值'); }
        else if (Object.keys(input.microservice).some(key => key !== 'gateway')) { errors.push('微服务当前仅支持 gateway 字段'); }
    }
    return errors;
}

export function assertConfigShape(input: unknown): asserts input is TechStackConfig {
    const errors = configShapeErrors(input);
    if (errors.length) { throw new Error(errors.join('；')); }
}
