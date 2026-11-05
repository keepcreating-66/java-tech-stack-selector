import { ApiDoc, CacheType, Database, Orm, ProjectType, SecurityFramework, TechStackConfig } from './types';

/** Options are listed here only after the renderer can actually produce them. */
export const CAPABILITIES = {
    architectures: ['monolith', 'modular-monolith', 'microservice'] as ProjectType[],
    javaVersions: ['17'],
    frameworks: ['spring-boot-3'],
    buildTools: ['maven'],
    databases: ['mysql-8', 'postgresql'] as Database[],
    orms: ['mybatis-plus', 'jpa'] as Orm[],
    pools: ['hikari'],
    caches: ['none', 'redisson'] as CacheType[],
    security: ['spring-security', 'sa-token'] as SecurityFramework[],
    apiDocs: ['none', 'knife4j'] as ApiDoc[],
    messaging: ['none'],
    workflow: ['none'],
    scheduler: ['none']
} as const;

export const ARCHITECTURE_LABELS: Record<string, string> = {
    monolith: '单体应用',
    'modular-monolith': '模块化单体',
    microservice: '微服务',
    switchable: '单体/微服务可切换（待实现）'
};

export function isSupported(config: TechStackConfig): boolean {
    const supports = (options: readonly string[], value: string) => options.includes(value);
    return supports(CAPABILITIES.architectures, config.project.type)
        && supports(CAPABILITIES.javaVersions, config.project.javaVersion)
        && supports(CAPABILITIES.frameworks, config.core.framework)
        && supports(CAPABILITIES.buildTools, config.project.buildTool)
        && supports(CAPABILITIES.databases, config.database.rdbms)
        && supports(CAPABILITIES.orms, config.database.orm)
        && supports(CAPABILITIES.pools, config.database.pool)
        && supports(CAPABILITIES.caches, config.cache.type)
        && supports(CAPABILITIES.security, config.security.framework)
        && supports(CAPABILITIES.apiDocs, config.api.documentation)
        && supports(CAPABILITIES.messaging, config.messaging || 'none')
        && supports(CAPABILITIES.workflow, config.workflow || 'none')
        && supports(CAPABILITIES.scheduler, config.scheduler || 'none')
        && Array.isArray(config.database.nosql)
        && config.database.nosql.length <= 1
        && config.database.nosql.every(value => value === 'redis' && config.cache.type === 'redisson')
        && config.core.web === 'webmvc';
}
