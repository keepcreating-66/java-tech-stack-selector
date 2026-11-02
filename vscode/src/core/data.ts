import { Preset, QuickPickOption, TechStackConfig } from './types';

/** A business preset supplies defaults. The wizard always asks for architecture. */
export const DEFAULT_CONFIG: TechStackConfig = {
    schemaVersion: 1,
    outputMode: 'project',
    project: { name: 'my-project', type: 'monolith', javaVersion: '17', buildTool: 'maven', modules: ['user', 'order'] },
    core: { framework: 'spring-boot-3', web: 'webmvc' },
    database: { rdbms: 'mysql-8', orm: 'jpa', pool: 'hikari', nosql: [] },
    cache: { type: 'none' },
    security: { framework: 'spring-security' },
    api: { documentation: 'none' },
    messaging: 'none', workflow: 'none', scheduler: 'none'
};

function preset(id: string, name: string, description: string, icon: string, defaults: Partial<TechStackConfig>): Preset {
    const config: TechStackConfig = {
        ...DEFAULT_CONFIG,
        ...defaults,
        project: { ...DEFAULT_CONFIG.project, ...defaults.project },
        core: { ...DEFAULT_CONFIG.core, ...defaults.core },
        database: { ...DEFAULT_CONFIG.database, ...defaults.database },
        cache: { ...DEFAULT_CONFIG.cache, ...defaults.cache },
        security: { ...DEFAULT_CONFIG.security, ...defaults.security },
        api: { ...DEFAULT_CONFIG.api, ...defaults.api },
        presetId: id
    };
    return { id, name, description, icon, config };
}

export const PRESETS: Preset[] = [
    preset('enterprise-admin', '企业级管理系统', '后台管理、OA、ERP、CRM 的示例默认值', '🅰️', {
        project: { name: 'my-admin', type: 'modular-monolith', javaVersion: '17', buildTool: 'maven', modules: ['user', 'audit'] },
        database: { rdbms: 'mysql-8', orm: 'mybatis-plus', pool: 'hikari', nosql: [] },
        api: { documentation: 'knife4j' }
    }),
    preset('e-commerce', '电商系统', '商城与交易场景的示例默认值', '🅱️', {
        project: { name: 'my-shop', type: 'modular-monolith', javaVersion: '17', buildTool: 'maven', modules: ['catalog', 'order'] },
        database: { rdbms: 'postgresql', orm: 'jpa', pool: 'hikari', nosql: [] }
    }),
    preset('ai-application', 'AI 应用平台', 'AI 服务场景的基础 Java 工程；RAG/Agent 组件待支持', '🤖', {
        project: { name: 'my-ai-app', type: 'monolith', javaVersion: '17', buildTool: 'maven', modules: ['model', 'task'] }
    })
];

export const OPTIONS: Record<string, QuickPickOption[]> = {
    projectType: [
        { label: '单体应用', value: 'monolith', description: '一个可执行应用' },
        { label: '模块化单体', value: 'modular-monolith', description: '多个业务模块，一个启动应用' },
        { label: '微服务', value: 'microservice', description: '独立服务，可选网关' },
        { label: '单体/微服务可切换（待实现）', value: '__unsupported__', description: '当前版本不可选择' }
    ],
    javaVersion: [{ label: 'JDK 17', value: '17', description: '当前工程的 Java 编译目标' }],
    buildTool: [
        { label: 'Maven', value: 'maven', description: '当前可生成' },
        { label: 'Gradle（待实现）', value: '__unsupported__', description: '当前版本不可选择' }
    ],
    framework: [{ label: 'Spring Boot 3', value: 'spring-boot-3' }],
    database: [
        { label: 'MySQL 8', value: 'mysql-8' },
        { label: 'PostgreSQL', value: 'postgresql' }
    ],
    orm: [
        { label: 'MyBatis-Plus', value: 'mybatis-plus' },
        { label: 'JPA / Hibernate', value: 'jpa' }
    ],
    pool: [{ label: 'HikariCP', value: 'hikari' }],
    cache: [
        { label: '无缓存', value: 'none' },
        { label: 'Redis + Redisson', value: 'redisson' }
    ],
    security: [
        { label: 'Spring Security', value: 'spring-security' },
        { label: 'Sa-Token', value: 'sa-token' }
    ],
    apiDoc: [
        { label: '无', value: 'none' },
        { label: 'Knife4j', value: 'knife4j' }
    ],
    messaging: [{ label: '无（其他组件待实现）', value: 'none' }],
    workflow: [{ label: '无（其他组件待实现）', value: 'none' }],
    scheduler: [{ label: '无（其他组件待实现）', value: 'none' }]
};

/** Versions stay centralized for the renderer and must be validated by a build matrix. */
export const VERSION_MAP: Record<string, string> = {
    'spring-boot-2': '2.7.18',
    'spring-boot-3': '3.2.5',
    'mybatis-plus': '3.5.7',
    'mybatis': '3.0.3',
    'druid': '1.2.21',
    'hikari': '5.1.0',
    'redisson': '3.27.0',
    'sa-token': '1.38.0',
    'knife4j': '4.4.0',
    'springdoc': '2.3.0'
};
