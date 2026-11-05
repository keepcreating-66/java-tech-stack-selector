# Skill 用户测试清单

交付版本：1.2.0-rc.1。按 2026-11-05 用户指示，实际 Agent 和平台验证由用户执行。

## 安装

解压完整 ZIP，将 java-tech-stack-selector 文件夹放到 Claude Code 项目的 .claude/skills/ 下，或个人 ~/.claude/skills/ 下。已有同名目录先备份；移出旧 tech-stack-selector，避免两个同功能技能混淆。

新开 Claude Code 会话，输入 /java-tech-stack-selector。脚本运行需要 Node.js 22+。

## 建议按顺序测试

1. 输入“使用该技能列出支持范围”。应读取 capabilities，不生成工程。
2. 输入“创建单体 demo-one，模块 user,order，MySQL、JPA、无缓存、Spring Security、无文档，输出工程到【已有父目录】”。应真实写出工程，不能自动变成模块化单体。
3. 输入“创建模块化单体 demo-modular，模块 catalog,order，PostgreSQL、MyBatis-Plus、Redis、Sa-Token、Knife4j，输出工程到【已有父目录】”。应有 common、业务模块及单个 bootstrap 启动模块。
4. 输入“创建微服务 demo-services，模块 user,order，MySQL、JPA、无缓存、Spring Security，带网关，输出到【已有父目录】”。应包含两个独立启动应用和网关。另测无网关版本。
5. 分别指定“仅导出配置”“仅导出提示词”，确认只生成对应文件，没有把导出说成工程创建。
6. 对同一路径同名项目再生成一次，应停止且原文件不变。测试取消、修改组件、缺少信息、中文及空格父目录。
7. 请求 Gradle、Nacos 或消息队列，应说明当前不支持，不悄悄替换为另一个组件。
8. 要求执行 Maven 构建，应实际执行并给出真实结果。生成器自身返回 not_run，不等于构建失败。
9. 按生成工程 README 配置隔离的 MySQL/PostgreSQL/Redis 环境，测试登录、CRUD、数据库持久化、应用 Redis 写读及网关路由。H2 构建测试不能替代此项。
10. 在 Cursor 和其他拟声明支持的系统重复代表性流程；Agensi 上传并 live 后复验 MCP 加载与临时脚本运行。

## 触发样本

应触发：创建 Java 后端、生成 Spring Boot 项目、导出技术栈配置、创建模块化电商后端、生成带网关微服务。
不应触发：解释 HashMap、比较 synchronized 与 Lock、解释 JVM GC、讲解 SQL 索引、解释 Java 多态。

记录 Agent/模型/系统版本、请求、实际生成目录、构建退出码和问题复现步骤。Claude Code 接 DeepSeek 可用原有官方兼容配置；本次排查发现本机旧代理指向 127.0.0.1:6244 时拒绝连接，单次验收清空代理后可正常调用，开发过程中未修改全局代理。

## 依赖版本

源码与开发方自动回归已交付，实际环境按上方清单自测。

本轮为保持 1.1.0 工程生成行为一致，保留其 Boot 3.2.5 及组件组合；这是迁移测试基线，不能视为当前生产环境推荐版本。正式上线需另外完成依赖维护评估和真实环境验收。
