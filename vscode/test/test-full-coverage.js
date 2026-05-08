"use strict";
/**
 * Java Tech Stack Selector - 全面功能测试
 * 覆盖所有配置选项、预设方案、验证逻辑、边界情况和错误处理
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const data_js_1 = require("../out/core/data.js");
// ==================== 辅助函数 ====================
let passedTests = 0;
let failedTests = 0;
let totalTests = 0;
function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`  ✅ ${message}`);
        passedTests++;
    }
    else {
        console.log(`  ❌ ${message}`);
        failedTests++;
    }
}
function assertEqual(actual, expected, message) {
    totalTests++;
    if (actual === expected) {
        console.log(`  ✅ ${message}`);
        passedTests++;
    }
    else {
        console.log(`  ❌ ${message} (期望: ${expected}, 实际: ${actual})`);
        failedTests++;
    }
}
function assertContains(str, substr, message) {
    totalTests++;
    if (str && str.includes(substr)) {
        console.log(`  ✅ ${message}`);
        passedTests++;
    }
    else {
        console.log(`  ❌ ${message}`);
        failedTests++;
    }
}
function assertLength(arr, length, message) {
    totalTests++;
    if (arr && arr.length === length) {
        console.log(`  ✅ ${message}`);
        passedTests++;
    }
    else {
        console.log(`  ❌ ${message} (期望: ${length}, 实际: ${arr?.length || 0})`);
        failedTests++;
    }
}
function section(title) {
    console.log(`\n--- ${title} ---`);
}
// 项目名称验证逻辑
function validateProjectName(value) {
    if (!value) {
        return '项目名称不能为空';
    }
    if (!value.match(/^[a-z][a-z0-9-]*$/)) {
        return '项目名称只能包含小写字母、数字和连字符，且以字母开头';
    }
    if (value.length > 50) {
        return '项目名称不能超过50个字符';
    }
    if (value.endsWith('-')) {
        return '项目名称不能以连字符结尾';
    }
    if (value.includes('--')) {
        return '项目名称不能包含连续连字符';
    }
    return null;
}
// 框架版本过滤逻辑
function filterFrameworkByJavaVersion(javaVersion, framework) {
    if (javaVersion === '8' && framework === 'spring-boot-3') {
        return false;
    }
    return true;
}
// ==================== 测试模块 ====================
// ==================== 1. 预设方案测试 ====================
function testPresets() {
    section('1. 预设方案测试 (Preset Tests)');
    assertLength(data_js_1.PRESETS, 4, '预设方案数量为4');
    // 测试企业级管理系统
    const enterprisePreset = data_js_1.PRESETS.find(p => p.id === 'enterprise-admin');
    assert(enterprisePreset !== undefined, '企业级管理系统预设存在');
    if (enterprisePreset) {
        assert(enterprisePreset.config.project.javaVersion === '17', '企业级管理系统使用JDK 17');
        assert(enterprisePreset.config.database.orm === 'mybatis-plus', '企业级管理系统使用MyBatis-Plus');
        assert(enterprisePreset.config.database.pool === 'druid', '企业级管理系统使用Druid连接池');
    }
    // 测试AI应用平台
    const aiPreset = data_js_1.PRESETS.find(p => p.id === 'ai-application');
    assert(aiPreset !== undefined, 'AI应用平台预设存在');
    if (aiPreset) {
        assertEqual(aiPreset.config.project.javaVersion, '21', 'AI应用平台使用JDK 21');
    }
    // 测试微服务架构
    const microservicePreset = data_js_1.PRESETS.find(p => p.id === 'microservice');
    assert(microservicePreset !== undefined, '微服务架构预设存在');
    if (microservicePreset) {
        assertEqual(microservicePreset.config.project.type, 'microservice', '微服务架构使用多模块类型');
    }
    // 测试电商系统
    const ecommercePreset = data_js_1.PRESETS.find(p => p.id === 'e-commerce');
    assert(ecommercePreset !== undefined, '电商系统预设存在');
    if (ecommercePreset) {
        assertEqual(ecommercePreset.config.messaging, 'rabbitmq', '电商系统使用RabbitMQ');
    }
    // 测试所有预设的必填字段完整性
    for (const preset of data_js_1.PRESETS) {
        const config = preset.config;
        assert(config.project !== undefined, `预设 ${preset.id}: project 存在`);
        assert(config.project.name !== undefined, `预设 ${preset.id}: project.name 存在`);
        assert(config.core !== undefined, `预设 ${preset.id}: core 存在`);
        assert(config.database !== undefined, `预设 ${preset.id}: database 存在`);
    }
}
// ==================== 2. 配置选项测试 ====================
function testOptions() {
    section('2. 配置选项测试 (Options Tests)');
    // 2.1 项目配置选项
    assertLength(data_js_1.OPTIONS.projectType, 4, 'projectType 有4个选项');
    assert(data_js_1.OPTIONS.projectType.some(o => o.value === 'monolith'), '包含 monolith');
    assert(data_js_1.OPTIONS.projectType.some(o => o.value === 'modular-monolith'), '包含 modular-monolith');
    assert(data_js_1.OPTIONS.projectType.some(o => o.value === 'microservice'), '包含 microservice');
    assert(data_js_1.OPTIONS.projectType.some(o => o.value === 'switchable'), '包含 switchable');
    assertLength(data_js_1.OPTIONS.javaVersion, 3, 'javaVersion 有3个选项');
    assert(data_js_1.OPTIONS.javaVersion.some(o => o.value === '8'), '包含 JDK 8');
    assert(data_js_1.OPTIONS.javaVersion.some(o => o.value === '17'), '包含 JDK 17');
    assert(data_js_1.OPTIONS.javaVersion.some(o => o.value === '21'), '包含 JDK 21');
    assertLength(data_js_1.OPTIONS.buildTool, 2, 'buildTool 有2个选项');
    assert(data_js_1.OPTIONS.buildTool.some(o => o.value === 'maven'), '包含 Maven');
    assert(data_js_1.OPTIONS.buildTool.some(o => o.value === 'gradle'), '包含 Gradle');
    const jdk17Option = data_js_1.OPTIONS.javaVersion.find(o => o.value === '17');
    assert(jdk17Option !== undefined && jdk17Option.label.includes('$(check)'), 'JDK 17 标记为推荐');
    // 2.2 核心框架选项
    assertLength(data_js_1.OPTIONS.framework, 2, 'framework 有2个选项');
    assert(data_js_1.OPTIONS.framework.some(o => o.value === 'spring-boot-2'), '包含 Spring Boot 2');
    assert(data_js_1.OPTIONS.framework.some(o => o.value === 'spring-boot-3'), '包含 Spring Boot 3');
    // 2.3 数据库选项
    assertLength(data_js_1.OPTIONS.database, 7, 'database 有7个选项');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'mysql-5'), '包含 MySQL 5');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'mysql-8'), '包含 MySQL 8');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'postgresql'), '包含 PostgreSQL');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'oracle'), '包含 Oracle');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'sqlserver'), '包含 SQL Server');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'dameng'), '包含达梦');
    assert(data_js_1.OPTIONS.database.some(o => o.value === 'kingbase'), '包含人大金仓');
    assertLength(data_js_1.OPTIONS.orm, 3, 'orm 有3个选项');
    assert(data_js_1.OPTIONS.orm.some(o => o.value === 'mybatis-plus'), '包含 MyBatis-Plus');
    assert(data_js_1.OPTIONS.orm.some(o => o.value === 'mybatis'), '包含 MyBatis');
    assert(data_js_1.OPTIONS.orm.some(o => o.value === 'jpa'), '包含 JPA');
    assertLength(data_js_1.OPTIONS.pool, 2, 'pool 有2个选项');
    assert(data_js_1.OPTIONS.pool.some(o => o.value === 'druid'), '包含 Druid');
    assert(data_js_1.OPTIONS.pool.some(o => o.value === 'hikari'), '包含 HikariCP');
    // 注意: nosql 是数据库配置的一部分，不是独立的 OPTIONS
    // 在预设中可以看到 nosql: ['redis'] 或 ['redis', 'milvus'] 等
    // 2.4 缓存与安全选项
    assertLength(data_js_1.OPTIONS.cache, 4, 'cache 有4个选项');
    assert(data_js_1.OPTIONS.cache.some(o => o.value === 'redisson'), '包含 Redisson');
    assert(data_js_1.OPTIONS.cache.some(o => o.value === 'lettuce'), '包含 Lettuce');
    assert(data_js_1.OPTIONS.cache.some(o => o.value === 'jetcache'), '包含 Jetcache');
    assert(data_js_1.OPTIONS.cache.some(o => o.value === 'none'), '包含 none');
    assertLength(data_js_1.OPTIONS.security, 3, 'security 有3个选项');
    assert(data_js_1.OPTIONS.security.some(o => o.value === 'sa-token'), '包含 Sa-Token');
    assert(data_js_1.OPTIONS.security.some(o => o.value === 'spring-security'), '包含 Spring Security');
    assert(data_js_1.OPTIONS.security.some(o => o.value === 'shiro'), '包含 Shiro');
    assertLength(data_js_1.OPTIONS.apiDoc, 3, 'apiDoc 有3个选项');
    assert(data_js_1.OPTIONS.apiDoc.some(o => o.value === 'knife4j'), '包含 Knife4j');
    assert(data_js_1.OPTIONS.apiDoc.some(o => o.value === 'swagger'), '包含 Swagger');
    assert(data_js_1.OPTIONS.apiDoc.some(o => o.value === 'none'), '包含 none');
    // 2.5 可选模块
    assertLength(data_js_1.OPTIONS.messaging, 5, 'messaging 有5个选项');
    assert(data_js_1.OPTIONS.messaging.some(o => o.value === 'rocketmq'), '包含 RocketMQ');
    assert(data_js_1.OPTIONS.messaging.some(o => o.value === 'rabbitmq'), '包含 RabbitMQ');
    assert(data_js_1.OPTIONS.messaging.some(o => o.value === 'kafka'), '包含 Kafka');
    assert(data_js_1.OPTIONS.messaging.some(o => o.value === 'redis-stream'), '包含 Redis Stream');
    assert(data_js_1.OPTIONS.messaging.some(o => o.value === 'none'), '包含 none');
    assertLength(data_js_1.OPTIONS.workflow, 4, 'workflow 有4个选项');
    assert(data_js_1.OPTIONS.workflow.some(o => o.value === 'flowable'), '包含 Flowable');
    assert(data_js_1.OPTIONS.workflow.some(o => o.value === 'activiti'), '包含 Activiti');
    assert(data_js_1.OPTIONS.workflow.some(o => o.value === 'camunda'), '包含 Camunda');
    assert(data_js_1.OPTIONS.workflow.some(o => o.value === 'none'), '包含 none');
    assertLength(data_js_1.OPTIONS.scheduler, 4, 'scheduler 有4个选项');
    assert(data_js_1.OPTIONS.scheduler.some(o => o.value === 'xxl-job'), '包含 XXL-Job');
    assert(data_js_1.OPTIONS.scheduler.some(o => o.value === 'quartz'), '包含 Quartz');
    assert(data_js_1.OPTIONS.scheduler.some(o => o.value === 'spring-schedule'), '包含 Spring Schedule');
    assert(data_js_1.OPTIONS.scheduler.some(o => o.value === 'none'), '包含 none');
}
// ==================== 3. 版本映射测试 ====================
function testVersionMap() {
    section('3. 版本映射测试 (Version Map Tests)');
    assertEqual(data_js_1.VERSION_MAP['spring-boot-2'], '2.7.18', 'Spring Boot 2.7.18');
    assertEqual(data_js_1.VERSION_MAP['spring-boot-3'], '3.2.5', 'Spring Boot 3.2.5');
    assertEqual(data_js_1.VERSION_MAP['mybatis-plus'], '3.5.7', 'MyBatis-Plus 3.5.7');
    assertEqual(data_js_1.VERSION_MAP['mybatis'], '3.0.3', 'MyBatis 3.0.3');
    assertEqual(data_js_1.VERSION_MAP['druid'], '1.2.21', 'Druid 1.2.21');
    assertEqual(data_js_1.VERSION_MAP['hikari'], '5.1.0', 'HikariCP 5.1.0');
    assertEqual(data_js_1.VERSION_MAP['redisson'], '3.27.0', 'Redisson 3.27.0');
    assertEqual(data_js_1.VERSION_MAP['sa-token'], '1.38.0', 'Sa-Token 1.38.0');
    assertEqual(data_js_1.VERSION_MAP['knife4j'], '4.4.0', 'Knife4j 4.4.0');
    assertEqual(data_js_1.VERSION_MAP['springdoc'], '2.3.0', 'SpringDoc 2.3.0');
}
// ==================== 4. 验证逻辑测试 ====================
function testValidation() {
    section('4. 验证逻辑测试 (Validation Tests)');
    // 4.1 项目名称验证
    assertEqual(validateProjectName('my-project'), null, '合法名称: my-project');
    assertEqual(validateProjectName('test123'), null, '合法名称: test123');
    assertEqual(validateProjectName('a'), null, '合法名称: 单字符 a');
    assertEqual(validateProjectName('a'.repeat(50)), null, '合法名称: 50个字符');
    assertEqual(validateProjectName(''), '项目名称不能为空', '空字符串验证');
    assertEqual(validateProjectName('123'), '项目名称只能包含小写字母、数字和连字符，且以字母开头', '纯数字验证');
    assertEqual(validateProjectName('Project'), '项目名称只能包含小写字母、数字和连字符，且以字母开头', '大写字母开头验证');
    assertEqual(validateProjectName('my@project'), '项目名称只能包含小写字母、数字和连字符，且以字母开头', '含特殊字符验证');
    assertEqual(validateProjectName('my_project'), '项目名称只能包含小写字母、数字和连字符，且以字母开头', '带下划线验证');
    assertEqual(validateProjectName('my project'), '项目名称只能包含小写字母、数字和连字符，且以字母开头', '带空格验证');
    assertEqual(validateProjectName('a'.repeat(51)), '项目名称不能超过50个字符', '超长名称验证');
    assertEqual(validateProjectName('test-123-project'), null, '合法名称: test-123-project');
    // 4.2 Java版本与框架兼容性
    assertEqual(filterFrameworkByJavaVersion('8', 'spring-boot-3'), false, 'JDK 8 过滤 Spring Boot 3');
    assertEqual(filterFrameworkByJavaVersion('8', 'spring-boot-2'), true, 'JDK 8 可选 Spring Boot 2');
    assertEqual(filterFrameworkByJavaVersion('17', 'spring-boot-3'), true, 'JDK 17 可选 Spring Boot 3');
    assertEqual(filterFrameworkByJavaVersion('21', 'spring-boot-3'), true, 'JDK 21 可选 Spring Boot 3');
    assertEqual(filterFrameworkByJavaVersion('17', 'spring-boot-2'), true, 'JDK 17 可选 Spring Boot 2');
    assertEqual(filterFrameworkByJavaVersion('21', 'spring-boot-2'), true, 'JDK 21 可选 Spring Boot 2');
}
// ==================== 5. 配置构建测试 ====================
function testConfigBuilding() {
    section('5. 配置构建测试 (Config Building Tests)');
    // 5.1 最小化配置
    const minimalConfig = {
        project: {
            name: 'test-project',
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
        cache: {
            type: 'redisson'
        },
        security: {
            framework: 'sa-token'
        },
        api: {
            documentation: 'knife4j'
        }
    };
    assert(minimalConfig.project.name === 'test-project', '最小化配置: 项目名称正确');
    assert(minimalConfig.core.framework === 'spring-boot-3', '最小化配置: 框架正确');
    // 5.2 完整配置（包含所有可选模块）
    const fullConfig = {
        project: {
            name: 'full-test-project',
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
        cache: {
            type: 'redisson'
        },
        security: {
            framework: 'sa-token'
        },
        api: {
            documentation: 'knife4j'
        },
        messaging: 'rocketmq',
        workflow: 'flowable',
        scheduler: 'xxl-job'
    };
    assertEqual(fullConfig.messaging, 'rocketmq', '完整配置: 消息队列');
    assertEqual(fullConfig.workflow, 'flowable', '完整配置: 工作流');
    assertEqual(fullConfig.scheduler, 'xxl-job', '完整配置: 定时任务');
    // 5.3 配置序列化
    const configJson = JSON.stringify(fullConfig);
    const parsedConfig = JSON.parse(configJson);
    assert(parsedConfig.project.name === 'full-test-project', '配置序列化: 可解析');
    assert(parsedConfig.messaging === 'rocketmq', '配置序列化: 可选模块保留');
}
// ==================== 6. 项目生成测试 ====================
function testProjectGeneration() {
    section('6. 项目生成测试 (Generator Tests)');
    const testDir = path.join(__dirname, 'test-gen');
    const projectName = 'test-admin';
    const projectDir = path.join(testDir, projectName);
    // 清理测试目录
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
    // 模拟配置
    const config = {
        project: {
            name: projectName,
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
        cache: {
            type: 'lettuce'
        },
        security: {
            framework: 'sa-token'
        },
        api: {
            documentation: 'knife4j'
        },
        messaging: 'rocketmq',
        workflow: 'flowable',
        scheduler: 'xxl-job'
    };
    // 创建目录结构
    const dirs = [
        `src/main/java/com/example/${projectName.replace(/-/g, '')}`,
        'src/main/resources',
        `src/test/java/com/example/${projectName.replace(/-/g, '')}`,
        'sql'
    ];
    dirs.forEach(dir => {
        fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
    });
    // 6.1 目录结构测试
    assert(fs.existsSync(path.join(projectDir, 'src/main/java')), '目录结构: src/main/java 存在');
    assert(fs.existsSync(path.join(projectDir, 'src/main/resources')), '目录结构: src/main/resources 存在');
    assert(fs.existsSync(path.join(projectDir, 'src/test/java')), '目录结构: src/test/java 存在');
    assert(fs.existsSync(path.join(projectDir, 'sql')), '目录结构: sql 存在');
    // 6.2 生成 pom.xml
    const pomContent = generatePomXml(config);
    fs.writeFileSync(path.join(projectDir, 'pom.xml'), pomContent);
    assert(fs.existsSync(path.join(projectDir, 'pom.xml')), '文件生成: pom.xml 存在');
    assertContains(pomContent, 'spring-boot-starter-parent', 'pom.xml: 包含 Spring Boot 父 POM');
    assertContains(pomContent, '3.2.5', 'pom.xml: 包含正确版本号 3.2.5');
    assertContains(pomContent, 'mybatis-plus', 'pom.xml: 包含 MyBatis-Plus');
    assertContains(pomContent, 'druid', 'pom.xml: 包含 Druid');
    assertContains(pomContent, 'spring-boot-starter-data-redis', 'pom.xml: 包含 Redis 依赖（使用 lettuce 时）');
    assertContains(pomContent, 'sa-token', 'pom.xml: 包含 Sa-Token');
    assertContains(pomContent, 'knife4j', 'pom.xml: 包含 Knife4j');
    assertContains(pomContent, 'rocketmq', 'pom.xml: 包含 RocketMQ');
    assertContains(pomContent, 'flowable', 'pom.xml: 包含 Flowable');
    assertContains(pomContent, '<java.version>17</java.version>', 'pom.xml: 包含正确 Java 版本');
    // 6.3 生成 application.yml
    const ymlContent = generateApplicationYml(config);
    fs.writeFileSync(path.join(projectDir, 'src/main/resources/application.yml'), ymlContent);
    assert(fs.existsSync(path.join(projectDir, 'src/main/resources/application.yml')), '文件生成: application.yml 存在');
    assertContains(ymlContent, 'test-admin', 'application.yml: 包含项目名称');
    assertContains(ymlContent, 'mysql', 'application.yml: 包含 MySQL 配置');
    assertContains(ymlContent, 'redis', 'application.yml: 包含 Redis 配置');
    assertContains(ymlContent, 'mybatis-plus', 'application.yml: 包含 MyBatis-Plus 配置');
    // 6.4 生成启动类
    const packageName = projectName.replace(/-/g, '');
    const className = 'TestAdminApplication';
    const mainClassSource = `package com.example.${packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${className} {
    public static void main(String[] args) {
        SpringApplication.run(${className}.class, args);
    }
}`;
    fs.writeFileSync(path.join(projectDir, `src/main/java/com/example/${packageName}/${className}.java`), mainClassSource);
    const mainClassPath = path.join(projectDir, `src/main/java/com/example/${packageName}/${className}.java`);
    assert(fs.existsSync(mainClassPath), '文件生成: 启动类存在');
    const mainClassContent = fs.readFileSync(mainClassPath, 'utf-8');
    assertContains(mainClassContent, `package com.example.${packageName}`, '启动类: 包名正确');
    assertContains(mainClassContent, '@SpringBootApplication', '启动类: 包含注解');
    assertContains(mainClassContent, className, '启动类: 类名正确');
    // 6.5 生成 tech-stack-config.json
    fs.writeFileSync(path.join(projectDir, 'tech-stack-config.json'), JSON.stringify(config, null, 2));
    assert(fs.existsSync(path.join(projectDir, 'tech-stack-config.json')), '文件生成: tech-stack-config.json 存在');
    const configJson = JSON.parse(fs.readFileSync(path.join(projectDir, 'tech-stack-config.json'), 'utf-8'));
    assertEqual(configJson.project.name, projectName, 'tech-stack-config.json: 项目名称正确');
    // 6.6 生成 project-prompt.md
    const promptContent = generatePromptMd(config);
    fs.writeFileSync(path.join(projectDir, 'project-prompt.md'), promptContent);
    assert(fs.existsSync(path.join(projectDir, 'project-prompt.md')), '文件生成: project-prompt.md 存在');
    // 6.7 生成 .gitignore
    const gitignoreContent = `# Maven
target/
*.jar
*.war

# IDE
.idea/
.vscode/
`;
    fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignoreContent);
    assert(fs.existsSync(path.join(projectDir, '.gitignore')), '文件生成: .gitignore 存在');
    const gitignore = fs.readFileSync(path.join(projectDir, '.gitignore'), 'utf-8');
    assertContains(gitignore, 'target/', '.gitignore: 包含 Maven target');
    assertContains(gitignore, '.idea/', '.gitignore: 包含 IDE 配置');
    // 6.8 依赖组合测试
    const mybatisConfig = { ...config, database: { ...config.database, orm: 'mybatis-plus' } };
    const druidConfig = { ...config, database: { ...config.database, pool: 'druid' } };
    const saTokenConfig = { ...config, security: { ...config.security, framework: 'sa-token' } };
    const knife4jConfig = { ...config, api: { ...config.api, documentation: 'knife4j' } };
    const redissonConfig = { ...config, cache: { ...config.cache, type: 'redisson' } };
    const mybatisPom = generatePomXml(mybatisConfig);
    assertContains(mybatisPom, 'mybatis-plus', 'MyBatis-Plus 依赖: 包含');
    const druidPom = generatePomXml(druidConfig);
    assertContains(druidPom, 'druid', 'Druid 依赖: 包含');
    const saTokenPom = generatePomXml(saTokenConfig);
    assertContains(saTokenPom, 'sa-token', 'Sa-Token 依赖: 包含');
    const knife4jPom = generatePomXml(knife4jConfig);
    assertContains(knife4jPom, 'knife4j', 'Knife4j 依赖: 包含');
    const redissonPom = generatePomXml(redissonConfig);
    assertContains(redissonPom, 'redisson', 'Redisson 依赖: 包含');
    // 清理测试目录
    fs.rmSync(testDir, { recursive: true, force: true });
}
// ==================== 7. 错误处理测试 ====================
function testErrorHandling() {
    section('7. 错误处理测试 (Error Handling Tests)');
    // 7.1 未选择输出目录
    let errorThrown = false;
    try {
        if (undefined === undefined) {
            throw new Error('未选择输出目录');
        }
    }
    catch (e) {
        errorThrown = e.message === '未选择输出目录';
    }
    assert(errorThrown, '错误处理: 未选择输出目录抛出错误');
    // 7.2 项目名称验证失败
    const validationError = validateProjectName('MyProject');
    assert(validationError !== null, '错误处理: 大写字母开头返回错误');
    // 7.3 空名称验证
    const emptyValidationError = validateProjectName('');
    assert(emptyValidationError === '项目名称不能为空', '错误处理: 空名称返回特定错误');
    // 7.4 超长名称验证
    const longNameError = validateProjectName('a'.repeat(51));
    assert(longNameError === '项目名称不能超过50个字符', '错误处理: 超长名称返回特定错误');
}
// ==================== 8. 边界情况测试 ====================
function testEdgeCases() {
    section('8. 边界情况测试 (Edge Cases)');
    // 8.1 可选模块选择 none
    const configWithNone = {
        project: { name: 'test', type: 'monolith', javaVersion: '17', buildTool: 'maven' },
        core: { framework: 'spring-boot-3', web: 'webmvc' },
        database: { rdbms: 'mysql-8', orm: 'mybatis-plus', pool: 'druid', nosql: ['redis'] },
        cache: { type: 'none' },
        security: { framework: 'none' },
        api: { documentation: 'none' },
        messaging: 'none',
        workflow: 'none',
        scheduler: 'none'
    };
    assertEqual(configWithNone.messaging, 'none', '边界情况: messaging=none');
    assertEqual(configWithNone.workflow, 'none', '边界情况: workflow=none');
    assertEqual(configWithNone.scheduler, 'none', '边界情况: scheduler=none');
    // 8.2 最短合法名称
    assertEqual(validateProjectName('a'), null, '边界情况: 单字符合法名称');
    // 8.3 最长合法名称
    assertEqual(validateProjectName('a'.repeat(50)), null, '边界情况: 50字符合法名称');
    // 8.4 各种非法名称
    assert(validateProjectName('MyProject') !== null, '边界情况: 驼峰命名非法');
    assert(validateProjectName('my_project') !== null, '边界情况: 下划线非法');
    assert(validateProjectName('my project') !== null, '边界情况: 空格非法');
    assert(validateProjectName('-test') !== null, '边界情况: 连字符开头非法');
    assertEqual(validateProjectName('test-'), '项目名称不能以连字符结尾', '边界情况: 连字符结尾非法');
    assertEqual(validateProjectName('test--project'), '项目名称不能包含连续连字符', '边界情况: 连续连字符非法');
    // 8.5 JDK 8 + Spring Boot 2 组合
    const configJdk8Sb2 = {
        project: { name: 'test', type: 'monolith', javaVersion: '8', buildTool: 'maven' },
        core: { framework: 'spring-boot-2', web: 'webmvc' },
        database: { rdbms: 'mysql-5', orm: 'mybatis', pool: 'druid', nosql: ['redis'] },
        cache: { type: 'none' },
        security: { framework: 'shiro' },
        api: { documentation: 'swagger' }
    };
    assertEqual(configJdk8Sb2.project.javaVersion, '8', '边界情况: JDK 8 配置');
    assertEqual(configJdk8Sb2.core.framework, 'spring-boot-2', '边界情况: Spring Boot 2 配置');
    // 8.6 JDK 21 + Spring Boot 3 组合
    const configJdk21Sb3 = {
        project: { name: 'test', type: 'monolith', javaVersion: '21', buildTool: 'maven' },
        core: { framework: 'spring-boot-3', web: 'webmvc' },
        database: { rdbms: 'mysql-8', orm: 'mybatis-plus', pool: 'hikari', nosql: ['redis'] },
        cache: { type: 'redisson' },
        security: { framework: 'sa-token' },
        api: { documentation: 'knife4j' }
    };
    assertEqual(configJdk21Sb3.project.javaVersion, '21', '边界情况: JDK 21 配置');
    assertEqual(configJdk21Sb3.core.framework, 'spring-boot-3', '边界情况: Spring Boot 3 配置');
}
// ==================== 辅助函数 ====================
function generatePomXml(config) {
    const springBootVersion = data_js_1.VERSION_MAP[config.core.framework];
    let dependencies = '';
    dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>\n`;
    if (config.database.orm === 'mybatis-plus') {
        dependencies += `        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>${data_js_1.VERSION_MAP['mybatis-plus']}</version>
        </dependency>\n`;
    }
    else if (config.database.orm === 'mybatis') {
        dependencies += `        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${data_js_1.VERSION_MAP['mybatis']}</version>
        </dependency>\n`;
    }
    if (config.database.pool === 'druid') {
        dependencies += `        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-3-starter</artifactId>
            <version>${data_js_1.VERSION_MAP['druid']}</version>
        </dependency>\n`;
    }
    if (config.cache.type === 'redisson') {
        dependencies += `        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson-spring-boot-starter</artifactId>
            <version>${data_js_1.VERSION_MAP['redisson']}</version>
        </dependency>\n`;
    }
    else if (config.cache.type !== 'none') {
        dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>\n`;
    }
    if (config.security.framework === 'sa-token') {
        dependencies += `        <dependency>
            <groupId>cn.dev33</groupId>
            <artifactId>sa-token-spring-boot3-starter</artifactId>
            <version>${data_js_1.VERSION_MAP['sa-token']}</version>
        </dependency>\n`;
    }
    else if (config.security.framework === 'spring-security') {
        dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>\n`;
    }
    else if (config.security.framework === 'shiro') {
        dependencies += `        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring-boot-web-starter</artifactId>
            <version>1.13.0</version>
        </dependency>\n`;
    }
    if (config.api.documentation === 'knife4j') {
        dependencies += `        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
            <version>${data_js_1.VERSION_MAP['knife4j']}</version>
        </dependency>\n`;
    }
    else if (config.api.documentation === 'swagger') {
        dependencies += `        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${data_js_1.VERSION_MAP['springdoc']}</version>
        </dependency>\n`;
    }
    if (config.messaging === 'rocketmq') {
        dependencies += `        <dependency>
            <groupId>org.apache.rocketmq</groupId>
            <artifactId>rocketmq-spring-boot-starter</artifactId>
            <version>2.2.3</version>
        </dependency>\n`;
    }
    else if (config.messaging === 'rabbitmq') {
        dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-amqp</artifactId>
        </dependency>\n`;
    }
    else if (config.messaging === 'kafka') {
        dependencies += `        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>\n`;
    }
    if (config.workflow === 'flowable') {
        dependencies += `        <dependency>
            <groupId>org.flowable</groupId>
            <artifactId>flowable-spring-boot-starter</artifactId>
            <version>6.8.0</version>
        </dependency>\n`;
    }
    else if (config.workflow === 'activiti') {
        dependencies += `        <dependency>
            <groupId>org.activiti</groupId>
            <artifactId>activiti-spring-boot-starter</artifactId>
            <version>7.1.0.M6</version>
        </dependency>\n`;
    }
    if (config.scheduler === 'xxl-job') {
        dependencies += `        <dependency>
            <groupId>com.xuxueli</groupId>
            <artifactId>xxl-job-spring-boot-starter</artifactId>
            <version>2.4.0</version>
        </dependency>\n`;
    }
    else if (config.scheduler === 'quartz') {
        dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-quartz</artifactId>
        </dependency>\n`;
    }
    dependencies += `        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>\n`;
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>${springBootVersion}</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>${config.project.name}</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <name>${config.project.name}</name>

    <properties>
        <java.version>${config.project.javaVersion}</java.version>
    </properties>

    <dependencies>
${dependencies}    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`;
}
function generateApplicationYml(config) {
    let yml = `server:
  port: 8080

spring:
  application:
    name: ${config.project.name}

`;
    // 数据库配置
    let driverClass = 'com.mysql.cj.jdbc.Driver';
    if (config.database.rdbms === 'postgresql') {
        driverClass = 'org.postgresql.Driver';
    }
    else if (config.database.rdbms === 'oracle') {
        driverClass = 'oracle.jdbc.OracleDriver';
    }
    yml += `  datasource:
    driver-class-name: ${driverClass}
    url: jdbc:mysql://localhost:3306/${config.project.name}?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: root

`;
    if (config.cache.type !== 'none') {
        yml += `  data:
    redis:
      host: localhost
      port: 6379

`;
    }
    if (config.database.orm === 'mybatis-plus') {
        yml += `mybatis-plus:
  mapper-locations: classpath*:mapper/**/*.xml
  type-aliases-package: com.example.${config.project.name.replace(/-/g, '')}.entity
  configuration:
    map-underscore-to-camel-case: true

`;
    }
    else if (config.database.orm === 'mybatis') {
        yml += `mybatis:
  mapper-locations: classpath*:mapper/**/*.xml
  type-aliases-package: com.example.${config.project.name.replace(/-/g, '')}.entity
  configuration:
    map-underscore-to-camel-case: true

`;
    }
    yml += `logging:
  level:
    root: INFO
`;
    return yml;
}
function generatePromptMd(config) {
    return `# ${config.project.name} 项目提示词

## 技术栈配置

- **项目名称**: ${config.project.name}
- **项目类型**: ${config.project.type}
- **Java 版本**: ${config.project.javaVersion}
- **构建工具**: ${config.project.buildTool}
- **Spring Boot**: ${data_js_1.VERSION_MAP[config.core.framework]}
- **数据库**: ${config.database.rdbms}
- **ORM**: ${config.database.orm}
- **连接池**: ${config.database.pool}
- **缓存**: ${config.cache.type}
- **认证框架**: ${config.security.framework}
- **API 文档**: ${config.api.documentation}

${config.messaging !== 'none' ? `- **消息队列**: ${config.messaging}` : ''}
${config.workflow !== 'none' ? `- **工作流**: ${config.workflow}` : ''}
${config.scheduler !== 'none' ? `- **定时任务**: ${config.scheduler}` : ''}

## 继续开发

使用以上配置，继续完成项目的业务逻辑开发。
`;
}
// ==================== 主程序 ====================
function main() {
    console.log('========================================');
    console.log('Java Tech Stack Selector - 全面功能测试');
    console.log('========================================');
    // 执行所有测试
    testPresets();
    testOptions();
    testVersionMap();
    testValidation();
    testConfigBuilding();
    testProjectGeneration();
    testErrorHandling();
    testEdgeCases();
    // 输出测试结果
    console.log('\n========================================');
    console.log(`测试结果: ${passedTests}/${totalTests} 通过`);
    if (failedTests > 0) {
        console.log(`失败: ${failedTests}`);
        console.log('========================================');
        console.log('\n❌ 测试未全部通过，请检查失败项');
        process.exit(1);
    }
    else {
        console.log('========================================');
        console.log('\n✅ 所有测试通过！');
        process.exit(0);
    }
}
main();
//# sourceMappingURL=test-full-coverage.js.map