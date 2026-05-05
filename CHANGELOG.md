# Changelog

所有重要的项目变更将记录在此文件中。

## [1.1.0] - 2026-05-05

### Added
- **Web层选择**：新增 Spring WebMVC / Spring WebFlux 选择按钮
- **数据库版本建议**：MySQL 8.0 / 5.7 版本选择

### Changed
- **预设方案JSON增强**：为所有4个预设方案添加以下字段：
  - `tools` - 工具库配置（Hutool、MapStruct、Lombok、EasyExcel等）
  - `deployment` - 部署配置（Docker、Kubernetes、Helm等）
  - `versions` - 各组件版本号
  - `rdbmsVersion` - 数据库版本号
  - `web` - Web层配置
  - `strategy` - 缓存策略（local-and-remote、remote-only等）
- **命令文件更新**：`preset.md` 示例对话中添加版本号信息

### Fixed
- 预设方案配置与输出模板保持一致

## [1.0.0] - 2024-05-04

### Added
- 初始版本发布
- 插件配置文件 `.cursor-plugin/plugin.json`
- 主技能文件 `SKILL.md`
- 参考文档
  - `modules.md` - 模块详细说明
  - `presets.md` - 预设方案配置
  - `compatibility.md` - 技术栈兼容性说明
- 输出模板
  - `tech-stack-config.json` - 技术栈配置模板
  - `pom-fragment.xml` - Maven依赖模板
  - `project-prompt.md` - 项目提示词模板
  - `cursor-prompt.md` - Cursor专用提示词模板
- 命令文件
  - `start.md` - 开始选型命令
  - `preset.md` - 预设方案命令
  - `export.md` - 导出配置命令
- README.md 项目文档
- MIT LICENSE

### Features
- 交互式技术选型流程
- 4种预设方案
  - 企业级管理系统
  - 电商系统
  - AI应用平台
  - 微服务架构
- 多格式输出支持
  - JSON配置
  - Maven依赖XML
  - Markdown提示词
- JDK版本兼容性检查
- 框架兼容性验证

### Technology Stack Support
- Java: JDK 8, 17, 21
- Spring Boot: 2.7.x, 3.x
- Database: MySQL, PostgreSQL, Oracle, SQL Server
- ORM: MyBatis-Plus, MyBatis, JPA
- Security: Sa-Token, Spring Security, Shiro
- Cache: Redis with Redisson, Lettuce, JetCache
- Messaging: RocketMQ, RabbitMQ, Kafka
- Microservices: Nacos, Sentinel, Seata, Dubbo
