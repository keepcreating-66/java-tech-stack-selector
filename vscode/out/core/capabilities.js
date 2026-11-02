"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARCHITECTURE_LABELS = exports.CAPABILITIES = void 0;
exports.isSupported = isSupported;
/** Options are listed here only after the renderer can actually produce them. */
exports.CAPABILITIES = {
    architectures: ['monolith', 'modular-monolith', 'microservice'],
    javaVersions: ['17'],
    frameworks: ['spring-boot-3'],
    buildTools: ['maven'],
    databases: ['mysql-8', 'postgresql'],
    orms: ['mybatis-plus', 'jpa'],
    pools: ['hikari'],
    caches: ['none', 'redisson'],
    security: ['spring-security', 'sa-token'],
    apiDocs: ['none', 'knife4j'],
    messaging: ['none'],
    workflow: ['none'],
    scheduler: ['none']
};
exports.ARCHITECTURE_LABELS = {
    monolith: '单体应用',
    'modular-monolith': '模块化单体',
    microservice: '微服务',
    switchable: '单体/微服务可切换（待实现）'
};
function isSupported(config) {
    const supports = (options, value) => options.includes(value);
    return supports(exports.CAPABILITIES.architectures, config.project.type)
        && supports(exports.CAPABILITIES.javaVersions, config.project.javaVersion)
        && supports(exports.CAPABILITIES.frameworks, config.core.framework)
        && supports(exports.CAPABILITIES.buildTools, config.project.buildTool)
        && supports(exports.CAPABILITIES.databases, config.database.rdbms)
        && supports(exports.CAPABILITIES.orms, config.database.orm)
        && supports(exports.CAPABILITIES.pools, config.database.pool)
        && supports(exports.CAPABILITIES.caches, config.cache.type)
        && supports(exports.CAPABILITIES.security, config.security.framework)
        && supports(exports.CAPABILITIES.apiDocs, config.api.documentation)
        && supports(exports.CAPABILITIES.messaging, config.messaging || 'none')
        && supports(exports.CAPABILITIES.workflow, config.workflow || 'none')
        && supports(exports.CAPABILITIES.scheduler, config.scheduler || 'none')
        && Array.isArray(config.database.nosql)
        && config.database.nosql.length <= 1
        && config.database.nosql.every(value => value === 'redis' && config.cache.type === 'redisson')
        && config.core.web === 'webmvc';
}
//# sourceMappingURL=capabilities.js.map