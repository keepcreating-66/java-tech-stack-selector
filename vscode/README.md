# Java Tech Stack Selector

帮助 Java 开发者快速完成后端项目技术选型的 VSCode 插件，支持表单式配置生成。

## 功能特性

- **预设方案**：提供企业级管理系统、电商系统、AI应用平台、微服务架构等多种预设方案
- **自定义配置**：支持按需选择 Java 版本、Spring Boot 版本、数据库、ORM、缓存、认证框架等
- **快速生成**：一键生成完整的 Spring Boot 项目结构，包括 pom.xml、application.yml 等配置文件
- **AI 预留接口**：预留 AI 对话接口，方便后续扩展

## 安装

1. 克隆本项目
2. 进入项目目录执行 `npm install`
3. 执行 `npm run compile` 编译项目
4. 按 `F5` 在 VSCode 中启动调试

## 使用方法

### 方式一：命令面板

1. 打开命令面板 (`Cmd+Shift+P`)
2. 输入 `Java Tech Stack: 开始技术选型` 或 `Java Tech Stack: 使用预设方案`
3. 按照提示完成配置

### 方式二：快捷命令

- `javaTechStack.start` - 开始技术选型
- `javaTechStack.preset` - 使用预设方案

## 支持的技术栈

### 项目类型
- 单体应用
- 模块化单体
- 微服务
- 单体/微服务可切换

### Java 版本
- JDK 8
- JDK 17 (推荐)
- JDK 21

### 框架
- Spring Boot 2.7
- Spring Boot 3.x

### 数据库
- MySQL 5.7 / 8.0
- PostgreSQL
- Oracle
- SQL Server
- 达梦 (国产信创)
- 人大金仓 (国产信创)

### ORM
- MyBatis-Plus
- MyBatis
- JPA/Hibernate

### 连接池
- Druid
- HikariCP

### 缓存
- Redis + Redisson
- Redis + Lettuce
- Redis + JetCache

### 认证框架
- Sa-Token
- Spring Security
- Apache Shiro

### 其他
- 消息队列：RocketMQ / RabbitMQ / Kafka / Redis Stream
- 工作流引擎：Flowable / Activiti / Camunda
- 定时任务：XXL-Job / Quartz / Spring Schedule

## 生成的项目结构

```
project-name/
├── src/main/java/com/example/projectname/
│   └── ProjectNameApplication.java
├── src/main/resources/
│   └── application.yml
├── src/test/java/
├── pom.xml
├── tech-stack-config.json
├── project-prompt.md
└── .gitignore
```

## 后续扩展

- [ ] AI 对话式配置生成
- [ ] WebView 富界面
- [ ] 更多项目模板
- [ ] Gradle 构建支持

## 开发指南

### 项目结构

```
vscode/
├── src/
│   ├── extension.ts      # 插件入口
│   ├── core/
│   │   ├── types.ts      # 类型定义
│   │   ├── data.ts       # 预设和选项数据
│   │   └── generator.ts  # 项目生成器
│   └── ui/
│       └── quickPick.ts  # UI交互逻辑
├── test/
│   └── test-full-coverage.ts  # 全面功能测试
├── package.json          # 插件配置
└── tsconfig.json         # TypeScript 配置
```

### 开发命令

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 监听模式
npm run watch

# 代码检查
npm run lint
```

### 发布插件

1. 安装 vsce: `npm install -g vsce`
2. 创建发布包: `vsce package`
3. 发布到 Marketplace: `vsce publish`

## License

MIT
