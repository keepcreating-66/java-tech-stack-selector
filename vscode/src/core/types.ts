// 项目类型
export type ProjectType = 'monolith' | 'modular-monolith' | 'microservice' | 'switchable';

// Java版本
export type JavaVersion = '8' | '17' | '21';

// 构建工具
export type BuildTool = 'maven' | 'gradle';

// 框架版本
export type Framework = 'spring-boot-2' | 'spring-boot-3';

// 数据库
export type Database = 'mysql-5' | 'mysql-8' | 'postgresql' | 'oracle' | 'sqlserver' | 'dameng' | 'kingbase';

// ORM
export type Orm = 'mybatis-plus' | 'mybatis' | 'jpa';

// 连接池
export type ConnectionPool = 'druid' | 'hikari';

// 缓存
export type CacheType = 'redisson' | 'lettuce' | 'jetcache' | 'none';

// 认证框架
export type SecurityFramework = 'sa-token' | 'spring-security' | 'shiro';

// API文档
export type ApiDoc = 'knife4j' | 'swagger' | 'none';

// 消息队列
export type Messaging = 'rocketmq' | 'rabbitmq' | 'kafka' | 'redis-stream' | 'none';

// 工作流
export type Workflow = 'flowable' | 'activiti' | 'camunda' | 'none';

// 定时任务
export type Scheduler = 'xxl-job' | 'quartz' | 'spring-schedule' | 'none';

// 技术栈配置
export interface TechStackConfig {
    project: {
        name: string;
        type: ProjectType;
        javaVersion: JavaVersion;
        buildTool: BuildTool;
    };
    core: {
        framework: Framework;
        web: 'webmvc' | 'webflux';
    };
    database: {
        rdbms: Database;
        orm: Orm;
        pool: ConnectionPool;
        nosql: string[];
    };
    cache: {
        type: CacheType;
    };
    security: {
        framework: SecurityFramework;
    };
    api: {
        documentation: ApiDoc;
    };
    messaging?: Messaging;
    workflow?: Workflow;
    scheduler?: Scheduler;
}

// 预设方案
export interface Preset {
    id: string;
    name: string;
    description: string;
    icon: string;
    config: TechStackConfig;
}

// QuickPick选项
export interface QuickPickOption {
    label: string;
    value: string;
    description?: string;
    picked?: boolean;
}
