# Java Tech Stack Selector

一个Cursor插件，帮助Java开发者快速完成后端项目的技术选型。

## 功能特点

- **交互式选型**：通过对话引导完成技术栈选择
- **预设方案**：提供4种常见项目类型的快速配置
- **多格式输出**：支持JSON配置、XML依赖、Markdown提示词
- **项目生成**：可在Cursor中直接生成完整的项目框架

## 快速开始

### 安装

1. 克隆本仓库到本地
2. 在Cursor中加载插件或技能

### 使用方式

#### 方式一：交互式选型

```
/start
```

按照引导完成技术栈选择。

#### 方式二：使用预设

```
/preset 1          # 企业级管理系统
/preset 2          # 电商系统
/preset 3          # AI应用平台
/preset 4          # 微服务架构
```

#### 方式三：导出配置

```
/export json       # 导出JSON配置
/export xml        # 导出Maven依赖
/export md         # 导出提示词
/export all        # 导出全部
```

## 支持的技术栈

### 项目基础
- 项目类型：单体、模块化单体、微服务
- Java版本：JDK 8、17、21
- 构建工具：Maven、Gradle

### 核心框架
- Spring Boot 2.7 / 3.x
- Web层：Spring WebMVC、Spring WebFlux
- MySQL 8.0/5.7、PostgreSQL、Oracle
- MyBatis-Plus、JPA

### 安全认证
- Sa-Token、Spring Security、Shiro
- JWT、Session

### 微服务
- Nacos、Consul、Eureka
- Spring Cloud Gateway、Kong
- Dubbo、OpenFeign、gRPC
- Sentinel、Resilience4j
- Seata

### 工具库
- Hutool、Guava
- MapStruct、Lombok
- EasyExcel、Apache POI

### 监控部署
- SkyWalking、Zipkin
- Docker、Kubernetes

## 预设方案

### 企业级管理系统
适用于后台管理、OA、ERP、CRM等企业级应用。

### 电商系统
适用于商城、交易平台等电商业务。

### AI应用平台
适用于AI服务、RAG、Agent等AI应用场景。

### 微服务架构
适用于大型分布式系统、高并发场景。

## 项目结构

```
java-tech-stack-selector/
├── .cursor-plugin/
│   └── plugin.json              # 插件配置
├── skills/
│   └── tech-stack-selector/
│       ├── SKILL.md             # 主技能文件
│       ├── references/          # 参考文档
│       │   ├── modules.md       # 模块说明
│       │   ├── presets.md      # 预设方案
│       │   └── compatibility.md # 兼容性说明
│       └── templates/           # 输出模板
│           ├── tech-stack-config.json
│           ├── pom-fragment.xml
│           ├── project-prompt.md
│           └── cursor-prompt.md
├── commands/                    # 命令文件
│   ├── start.md
│   ├── preset.md
│   └── export.md
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## 技术栈兼容性

| 组件 | JDK 8 | JDK 17 | JDK 21 |
|------|:-----:|:------:|:------:|
| Spring Boot 2.7 | ✅ | ✅ | ⚠️ |
| Spring Boot 3.x | ❌ | ✅ | ✅ |
| MyBatis-Plus 3.5 | ✅ | ✅ | ✅ |
| Sa-Token 1.38 | ✅ | ✅ | ✅ |
| Knife4j 4.x | ❌ | ✅ | ✅ |

## 使用示例

### 创建新项目

1. 在Cursor中打开 `/start`
2. 输入项目名称和选择技术栈
3. 选择预设方案或自定义配置
4. 确认配置并生成输出
5. 使用生成的提示词创建项目

### 导出配置

1. 完成技术选型后
2. 使用 `/export` 命令导出配置
3. 选择需要的格式（JSON/XML/MD）
4. 保存到本地或分享

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
