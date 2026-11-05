---
name: tech-stack-selector
description: 通过对话先确认 Java 后端系统架构，再选择业务预设和受支持组件；导出配置或提示词，并指引使用独立 VSIX 生成 Maven 工程。
license: MIT
metadata:
  author: keepcreating-66
  version: "1.1.0"
  category: development
  language: java
---

# Java 后端项目技术选型

此 Skill 是 Cursor Agent 的**对话指导**。仓库 `vscode/` 中的 VSIX 是独立的原生向导和工程生成器；安装其中一个不会自动安装另一个。不得把对话里展示的 Markdown 链接当作宿主可回传的按钮，也不得把导出提示词称为项目已创建。

## 必经流程

1. **架构**：先让用户在单体、模块化单体、微服务中选一项。说明单体只有一个启动应用；模块化单体有独立业务模块但只部署一个应用；微服务至少两个独立启动的服务。接受编号或文字回答，等待用户实际选择。
2. **业务场景**：企业管理、电商、AI 应用或自定义。预设仅填写默认值；业务场景与架构是两个独立字段。例如电商可采用模块化单体，也可采用微服务。不要让“微服务架构预设”跳过第一步。
3. **项目与模块**：收集项目名和至少两个业务模块/服务名。可展示 `user` 和 `order` 作默认示例，用户可更改。
4. **组件**：只展示当前首批可生成的选项；按架构追加相关问题。见下表。
5. **输出方式**：询问 JSON 配置、Markdown 提示词或工程。对话可产生配置和提示词；确定性的 Maven 工程用 VSIX 命令面板向导生成。
6. **总览与确认**：以中文列出全部值，包含架构、业务场景、项目名、模块/服务、构建工具、数据库、ORM、缓存、安全、API 文档、网关及输出方式。提供“确认、修改某项、返回、取消”，修改后重新显示总览。确认后选择输出目录，再创建文件；取消不写文件。用户明确要求 Agent 写工程时，必须实际创建与所选架构相符的文件并检查依赖、构建状态。

| 维度 | 首批选项 |
| --- | --- |
| 运行与构建 | JDK 17、Spring Boot 3、Maven、Spring WebMVC |
| 数据 | MySQL 8 / PostgreSQL；MyBatis-Plus / JPA；HikariCP |
| 缓存 | 无 / Redis + Redisson |
| 安全 | Spring Security / Sa-Token |
| API 文档 | 无 / Knife4j |
| 微服务 | 独立业务服务、静态服务地址、可选网关 |

Gradle、可切换部署、JDK 8/21、Boot 2，以及 Nacos 等注册中心、RPC、熔断、分布式事务、消息队列、工作流、调度器仍待实现。若用户要求其中一项，应明确它不在当前确定性生成范围内；可以讨论设计，但不能说 VSIX 已支持。

## 对话输出规则

- 采用编号与文字输入：例如“请选择架构：1 单体，2 模块化单体，3 微服务”。等待回复，不要输出虚假的 `#单选:*` 锚点。
- 配置要一致：选“无缓存”时不添加 Redis；选 PostgreSQL 时使用相应 JDBC 依赖与 URL；选 JPA 时不要求 MyBatis-Plus Mapper；微服务不能套用模块化单体结构。
- 如果用户要求写文件，先检查目标目录是否存在。目录存在时请用户换名或换目录；不覆盖已有工程。
- 输出状态分别说明“配置已给出”“文件已写入”“构建已验证或未验证”。缺少构建环境时如实标为未验证。
- 预设细节见 [presets.md](references/presets.md)，各架构最低结构见 [modules.md](references/modules.md)，支持边界见 [compatibility.md](references/compatibility.md)。这些文档只说明当前首批范围。
- `templates/tech-stack-config.json` 是与当前配置字段一致的单体示例，导出时必须替换为本次已确认值。微服务配置额外包含 `microservice.gateway`；其他架构不包含该字段。Maven XML 模板是根工程候选，不可作为所有子模块的通用 POM。

## 命令

`/start` 进入完整选型；`/preset` 填写业务场景默认值后继续确认架构；`/export` 从当前已确认配置导出。详细参数见仓库 `commands/`。不同 Cursor 版本对命令与 Skill 的发现和显示方式可能不同，以实际 Customize 页面及调用结果为准。
