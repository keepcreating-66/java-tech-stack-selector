import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TechStackConfig } from './types';
import { VERSION_MAP } from './data';

export async function generateProject(config: TechStackConfig): Promise<void> {
    // 选择输出目录
    const outputUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: '选择项目输出目录'
    });

    if (!outputUri || outputUri.length === 0) {
        throw new Error('未选择输出目录');
    }

    const outputDir = outputUri[0].fsPath;
    const projectDir = path.join(outputDir, config.project.name);

    // 创建项目目录
    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
    }

    // 创建子目录
    const dirs = [
        'src/main/java/com/example/' + config.project.name.replace(/-/g, ''),
        'src/main/resources',
        'src/test/java/com/example/' + config.project.name.replace(/-/g, ''),
        'sql'
    ];
    dirs.forEach(dir => {
        const fullPath = path.join(projectDir, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });

    // 生成文件
    await generateConfigFile(projectDir, config);
    await generatePomXml(projectDir, config);
    await generateApplicationYml(projectDir, config);
    await generatePromptFile(projectDir, config);
    await generateMainClass(projectDir, config);
    await generateGitignore(projectDir);

    // 显示完成消息
    const openFolder = '打开项目';
    const result = await vscode.window.showInformationMessage(
        `✅ 项目 ${config.project.name} 已生成！`,
        openFolder
    );

    if (result === openFolder) {
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), true);
    }
}

async function generateConfigFile(projectDir: string, config: TechStackConfig): Promise<void> {
    const content = JSON.stringify(config, null, 2);
    fs.writeFileSync(path.join(projectDir, 'tech-stack-config.json'), content);
}

async function generatePomXml(projectDir: string, config: TechStackConfig): Promise<void> {
    const springBootVersion = VERSION_MAP[config.core.framework];
    const javaVersion = config.project.javaVersion;

    let dependencies = '';

    // Spring Boot Web
    dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>\n`;

    // ORM
    switch (config.database.orm) {
        case 'mybatis-plus':
            dependencies += `        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>${VERSION_MAP['mybatis-plus']}</version>
        </dependency>\n`;
            break;
        case 'mybatis':
            dependencies += `        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${VERSION_MAP['mybatis']}</version>
        </dependency>\n`;
            break;
        case 'jpa':
            dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>\n`;
            break;
    }

    // 连接池
    if (config.database.pool === 'druid') {
        dependencies += `        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-3-starter</artifactId>
            <version>${VERSION_MAP['druid']}</version>
        </dependency>\n`;
    }

    // Redis
    dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>\n`;

    // 缓存
    if (config.cache.type === 'redisson') {
        dependencies += `        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson-spring-boot-starter</artifactId>
            <version>${VERSION_MAP['redisson']}</version>
        </dependency>\n`;
    }

    // 安全框架
    switch (config.security.framework) {
        case 'sa-token':
            dependencies += `        <dependency>
            <groupId>cn.dev33</groupId>
            <artifactId>sa-token-spring-boot3-starter</artifactId>
            <version>${VERSION_MAP['sa-token']}</version>
        </dependency>\n`;
            break;
        case 'spring-security':
            dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>\n`;
            break;
    }

    // API文档
    switch (config.api.documentation) {
        case 'knife4j':
            dependencies += `        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
            <version>${VERSION_MAP['knife4j']}</version>
        </dependency>\n`;
            break;
        case 'swagger':
            dependencies += `        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${VERSION_MAP['springdoc']}</version>
        </dependency>\n`;
            break;
    }

    // Lombok
    dependencies += `        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>\n`;

    // 测试
    dependencies += `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>\n`;

    const pomContent = `<?xml version="1.0" encoding="UTF-8"?>
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
    <description>Java Backend Project</description>

    <properties>
        <java.version>${javaVersion}</java.version>
    </properties>

    <dependencies>
${dependencies}
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`;

    fs.writeFileSync(path.join(projectDir, 'pom.xml'), pomContent);
}

async function generateApplicationYml(projectDir: string, config: TechStackConfig): Promise<void> {
    let driverClass = 'com.mysql.cj.jdbc.Driver';
    let jdbcUrl = 'jdbc:mysql://localhost:3306/${project.name}?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai';
    
    if (config.database.rdbms === 'postgresql') {
        driverClass = 'org.postgresql.Driver';
        jdbcUrl = 'jdbc:postgresql://localhost:5432/${project.name}';
    }

    let poolConfig = '';
    if (config.database.pool === 'druid') {
        poolConfig = `
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000`;
    }

    const ymlContent = `server:
  port: 8080

spring:
  application:
    name: ${config.project.name}
  
  datasource:
    driver-class-name: ${driverClass}
    url: ${jdbcUrl}
    username: root
    password: root${poolConfig}
  
  data:
    redis:
      host: localhost
      port: 6379
      database: 0

mybatis-plus:
  mapper-locations: classpath*:mapper/**/*.xml
  type-aliases-package: com.example.${config.project.name.replace(/-/g, '')}.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0

logging:
  level:
    root: INFO
    com.example: DEBUG
    org.springframework.web: DEBUG
`;

    fs.writeFileSync(path.join(projectDir, 'src/main/resources/application.yml'), ymlContent);
}

async function generateMainClass(projectDir: string, config: TechStackConfig): Promise<void> {
    const packageName = config.project.name.replace(/-/g, '');
    const className = config.project.name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    const mainClassContent = `package com.example.${packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${className}Application {

    public static void main(String[] args) {
        SpringApplication.run(${className}Application.class, args);
    }
}
`;

    const mainClassDir = path.join(projectDir, `src/main/java/com/example/${packageName}`);
    fs.writeFileSync(path.join(mainClassDir, `${className}Application.java`), mainClassContent);
}

async function generateGitignore(projectDir: string): Promise<void> {
    const gitignoreContent = `# Compiled class file
*.class

# Log file
*.log

# BlueJ files
*.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files #
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml
hs_err_pid*

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/
.settings/
.classpath
.project
.factorypath

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# Gradle
.gradle/
build/

# OS
.DS_Store
Thumbs.db
`;

    fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignoreContent);
}

async function generatePromptFile(projectDir: string, config: TechStackConfig): Promise<void> {
    const promptContent = `# Java后端项目初始化提示词

## 项目概述

请帮我基于以下技术栈配置，完善这个Java后端项目：

### 基础配置
- 项目名称：${config.project.name}
- 项目类型：${config.project.type}
- Java版本：JDK ${config.project.javaVersion}
- 构建工具：${config.project.buildTool}

### 核心框架
- 应用框架：${config.core.framework}
- Web层：Spring WebMVC

### 数据层
- 数据库：${config.database.rdbms}
- ORM：${config.database.orm}
- 连接池：${config.database.pool}
- 缓存：Redis + ${config.cache.type}

### 安全认证
- 认证框架：${config.security.framework}

### API文档
- 文档工具：${config.api.documentation}

${config.messaging && config.messaging !== 'none' ? `### 消息队列\n- 消息中间件：${config.messaging}\n` : ''}
${config.workflow && config.workflow !== 'none' ? `### 工作流\n- 工作流引擎：${config.workflow}\n` : ''}
${config.scheduler && config.scheduler !== 'none' ? `### 定时任务\n- 任务调度：${config.scheduler}\n` : ''}

## 要求

### 项目结构
请按照模块化单体架构组织代码：
\`\`\`
src/main/java/com/example/${config.project.name.replace(/-/g, '')}/
├── controller/      # 控制器层
├── service/         # 服务层
│   └── impl/        # 服务实现
├── mapper/          # 数据访问层
├── entity/          # 实体类
├── dto/             # 数据传输对象
├── vo/              # 视图对象
├── config/          # 配置类
├── common/          # 公共类
│   ├── result/      # 统一返回结果
│   ├── exception/   # 异常处理
│   └── utils/       # 工具类
└── enums/           # 枚举类
\`\`\`

### 功能示例
请实现一个基础的用户管理CRUD示例，包括：
1. 用户实体类（User）
2. 用户Mapper（MyBatis-Plus）
3. 用户Service接口和实现
4. 用户Controller（RESTful API）
5. 统一返回结果封装
6. 全局异常处理
7. 参数校验

### 配置要求
1. 配置跨域支持
2. 配置${config.security.framework}认证
3. 配置${config.api.documentation} API文档
4. 配置日志输出

### 代码规范
1. 遵循阿里巴巴Java开发手册
2. 使用Lombok简化代码
3. 添加必要的注释
4. 编写单元测试
`;

    fs.writeFileSync(path.join(projectDir, 'project-prompt.md'), promptContent);
}
