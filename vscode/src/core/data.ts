import { Preset, QuickPickOption } from './types';

// 预设方案
export const PRESETS: Preset[] = [
    {
        id: 'enterprise-admin',
        name: '企业级管理系统',
        description: '适用于后台管理、OA、ERP、CRM',
        icon: '🅰️',
        config: {
            project: {
                name: 'my-admin',
                type: 'modular-monolith',
                javaVersion: '17',
                buildTool: 'maven'
            },
            core: {
                framework: 'spring-boot-3',
                web: 'webmvc'
            },
            database: {
                rdbms: 'mysql-8',
                orm: 'mybatis-plus',
                pool: 'druid',
                nosql: ['redis']
            },
            cache: { type: 'redisson' },
            security: { framework: 'sa-token' },
            api: { documentation: 'knife4j' },
            messaging: 'none',
            workflow: 'flowable',
            scheduler: 'xxl-job'
        }
    },
    {
        id: 'e-commerce',
        name: '电商系统',
        description: '适用于商城、交易平台',
        icon: '🅱️',
        config: {
            project: {
                name: 'my-shop',
                type: 'modular-monolith',
                javaVersion: '17',
                buildTool: 'maven'
            },
            core: {
                framework: 'spring-boot-3',
                web: 'webmvc'
            },
            database: {
                rdbms: 'mysql-8',
                orm: 'mybatis',
                pool: 'druid',
                nosql: ['redis', 'elasticsearch']
            },
            cache: { type: 'redisson' },
            security: { framework: 'spring-security' },
            api: { documentation: 'swagger' },
            messaging: 'rabbitmq',
            workflow: 'none',
            scheduler: 'none'
        }
    },
    {
        id: 'ai-application',
        name: 'AI应用平台',
        description: '适用于AI服务、RAG、Agent',
        icon: '🤖',
        config: {
            project: {
                name: 'my-ai-app',
                type: 'monolith',
                javaVersion: '21',
                buildTool: 'maven'
            },
            core: {
                framework: 'spring-boot-3',
                web: 'webmvc'
            },
            database: {
                rdbms: 'mysql-8',
                orm: 'mybatis-plus',
                pool: 'hikari',
                nosql: ['redis', 'milvus']
            },
            cache: { type: 'redisson' },
            security: { framework: 'sa-token' },
            api: { documentation: 'knife4j' },
            messaging: 'none',
            workflow: 'none',
            scheduler: 'none'
        }
    },
    {
        id: 'microservice',
        name: '微服务架构',
        description: '适用于大型分布式系统',
        icon: '🔧',
        config: {
            project: {
                name: 'my-microservice',
                type: 'microservice',
                javaVersion: '17',
                buildTool: 'maven'
            },
            core: {
                framework: 'spring-boot-3',
                web: 'webmvc'
            },
            database: {
                rdbms: 'mysql-8',
                orm: 'mybatis-plus',
                pool: 'druid',
                nosql: ['redis']
            },
            cache: { type: 'redisson' },
            security: { framework: 'spring-security' },
            api: { documentation: 'knife4j' },
            messaging: 'rocketmq',
            workflow: 'none',
            scheduler: 'xxl-job'
        }
    }
];

// 选项定义
export const OPTIONS = {
    projectType: [
        { label: '$(circle-outline) 单体应用', value: 'monolith', description: '所有代码在一个项目中，适合小型项目' },
        { label: '$(check) 模块化单体 (推荐)', value: 'modular-monolith', description: '按功能分模块，部署为一个应用' },
        { label: '$(symbol-method) 微服务', value: 'microservice', description: '每个模块独立部署' },
        { label: '$(arrow-swap) 单体/微服务可切换', value: 'switchable', description: '支持两种部署方式' }
    ] as QuickPickOption[],
    
    javaVersion: [
        { label: 'JDK 8', value: '8', description: '最稳定，兼容性最好' },
        { label: '$(check) JDK 17 (推荐)', value: '17', description: 'LTS版本，支持新特性' },
        { label: 'JDK 21', value: '21', description: '最新LTS，支持虚拟线程' }
    ] as QuickPickOption[],
    
    buildTool: [
        { label: '$(check) Maven (推荐)', value: 'maven', description: '配置简单，生态丰富' },
        { label: 'Gradle', value: 'gradle', description: '构建速度快，配置灵活' }
    ] as QuickPickOption[],
    
    framework: [
        { label: 'Spring Boot 2.7', value: 'spring-boot-2', description: '兼容JDK 8' },
        { label: '$(check) Spring Boot 3.x (推荐)', value: 'spring-boot-3', description: '需要JDK 17+' }
    ] as QuickPickOption[],
    
    database: [
        { label: '$(check) MySQL 8.0 (推荐)', value: 'mysql-8', description: '最流行，社区活跃' },
        { label: 'MySQL 5.7', value: 'mysql-5', description: '兼容旧系统' },
        { label: 'PostgreSQL', value: 'postgresql', description: '功能强大，支持JSON' },
        { label: 'Oracle', value: 'oracle', description: '商业数据库' },
        { label: 'SQL Server', value: 'sqlserver', description: '微软数据库' },
        { label: '达梦 (国产信创)', value: 'dameng', description: '国产数据库' },
        { label: '人大金仓 (国产信创)', value: 'kingbase', description: '国产数据库' }
    ] as QuickPickOption[],
    
    orm: [
        { label: '$(check) MyBatis-Plus (推荐)', value: 'mybatis-plus', description: '功能丰富，自动生成CRUD' },
        { label: 'MyBatis', value: 'mybatis', description: '轻量级，SQL灵活' },
        { label: 'JPA/Hibernate', value: 'jpa', description: '面向对象' }
    ] as QuickPickOption[],
    
    pool: [
        { label: '$(check) Druid (推荐)', value: 'druid', description: '带监控功能' },
        { label: 'HikariCP', value: 'hikari', description: '高性能，Spring Boot默认' }
    ] as QuickPickOption[],
    
    cache: [
        { label: '$(check) Redis + Redisson (推荐)', value: 'redisson', description: '功能全面' },
        { label: 'Redis + Lettuce', value: 'lettuce', description: '轻量级' },
        { label: 'Redis + JetCache', value: 'jetcache', description: '支持本地+远程缓存' },
        { label: '$(close) 无缓存', value: 'none' }
    ] as QuickPickOption[],
    
    security: [
        { label: '$(check) Sa-Token (推荐)', value: 'sa-token', description: '简单易用' },
        { label: 'Spring Security', value: 'spring-security', description: '功能强大' },
        { label: 'Apache Shiro', value: 'shiro', description: '传统方案' }
    ] as QuickPickOption[],
    
    apiDoc: [
        { label: '$(check) Knife4j (推荐)', value: 'knife4j', description: '增强版Swagger' },
        { label: 'Springdoc/Swagger', value: 'swagger', description: '标准方案' },
        { label: '$(close) 无', value: 'none' }
    ] as QuickPickOption[],
    
    messaging: [
        { label: 'RocketMQ', value: 'rocketmq', description: '阿里开源，功能全面' },
        { label: 'RabbitMQ', value: 'rabbitmq', description: '轻量级，易上手' },
        { label: 'Kafka', value: 'kafka', description: '高吞吐量' },
        { label: 'Redis Stream', value: 'redis-stream', description: '轻量级，复用Redis' },
        { label: '$(close) 无', value: 'none' }
    ] as QuickPickOption[],
    
    workflow: [
        { label: '$(check) Flowable (推荐)', value: 'flowable', description: 'Activiti继承者' },
        { label: 'Activiti', value: 'activiti', description: '老牌方案' },
        { label: 'Camunda', value: 'camunda', description: '功能强大' },
        { label: '$(close) 无', value: 'none' }
    ] as QuickPickOption[],
    
    scheduler: [
        { label: '$(check) XXL-Job (推荐)', value: 'xxl-job', description: '分布式任务调度' },
        { label: 'Quartz', value: 'quartz', description: '经典方案' },
        { label: 'Spring Schedule', value: 'spring-schedule', description: '简单场景' },
        { label: '$(close) 无', value: 'none' }
    ] as QuickPickOption[]
};

// 版本映射
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
