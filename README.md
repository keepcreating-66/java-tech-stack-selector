# Java Tech Stack Selector

Java 后端项目选型与工程生成工具。本仓库包含两种入口：**VSIX 扩展**提供可回退的原生选型向导和确定性的 Maven 工程生成；**Cursor Plugin / Skill**提供对话式选型说明和导出指导。两者独立安装，VSIX 不会自动注册 `/start`、`/preset`、`/export`。

当前 1.1.0 是仓库开发版本；请在本地完成构建与验收后再安装新包。已有 1.0.0 VSIX 的行为不会因修改此仓库而自动更新。

## VSIX 扩展：生成工程

### 安装与运行

在 `vscode/` 目录运行：

```bash
npm ci
npm run compile
npm test
```

使用该目录生成的 **1.1.0 VSIX** 时，在 Cursor 或 VS Code 的命令面板执行 `Extensions: Install from VSIX...`，选中构建产物并按提示重新加载窗口。打包方式和开发调试说明见 [扩展文档](vscode/README.md)。本仓库没有要求安装全局 npm 包。

打开命令面板，运行 `Java Tech Stack: 开始技术选型`；快捷入口 `Java Tech Stack: 使用预设方案` 也会进入同一向导。流程为：

```text
选择架构 → 选择业务预设或自定义 → 填写项目及业务模块 → 选择支持的组件
→ 选择输出方式 → 检查并修改配置、确认 → 选择输出目录 → 创建文件
```

企业管理、电商、AI 是**业务预设**；单体、模块化单体、微服务是**系统架构**。预设只提供默认值，用户仍能修改、返回、取消和确认。选择“工程”时写出对应架构的 Maven 工程；选择“仅配置”或“仅提示词”时只导出该文件。目标项目目录已存在时停止，不覆盖原文件。

### 第一批可生成的组合

| 维度 | 当前支持 |
| --- | --- |
| 架构 | 单体、模块化单体、微服务 |
| 运行与构建 | JDK 17、Spring Boot 3、Maven、Spring WebMVC |
| 数据 | MySQL 8 或 PostgreSQL；MyBatis-Plus 或 JPA；HikariCP |
| 缓存 | 无缓存或 Redis + Redisson |
| 安全 | Spring Security 或 Sa-Token |
| API 文档 | 无或 Knife4j |
| 微服务 | 独立业务服务、静态服务地址、可选网关 |

空白配置的业务模块默认采用 `user` 和 `order` 示例，业务预设有各自的模块默认值，均可在向导中修改。生成的工程提供架构和组件接线的起点及 CRUD 示例。启动需要按工程内 README 配置相应数据库及可选 Redis；构建和启动状态以实际验证结果为准。

Gradle、JDK 8/21、Spring Boot 2、可切换部署、注册中心、RPC、熔断、分布式事务、消息队列、工作流和调度器暂未开放。后续只有在依赖、配置、模板和构建验收齐备后才会增加这些选项。

## Cursor Plugin / Skill：对话式选型

Cursor 插件文件位于 `.cursor-plugin/`、`skills/`、`commands/`。按 [Cursor 的本地插件说明](https://cursor.com/docs/plugins) 将**整个仓库目录的副本**放入 `~/.cursor/plugins/local/java-tech-stack-selector/`，然后重新加载 Cursor，在 Customize 中检查插件和 Skill 是否被发现。官方本地插件加载不支持指向该目录外部仓库的软链接，因此不要用跨目录软链接代替复制。只安装 Skill 时，Cursor 支持项目级 `.cursor/skills/` 和用户级 `~/.cursor/skills/`；见 [Cursor Skills 文档](https://cursor.com/docs/skills)。

对话入口可使用 `/start`、`/preset`、`/export`，或直接让 Agent 使用 `tech-stack-selector` Skill。Skill 用编号/文字确认选择，不依赖 Markdown 锚点按钮。对话生成的配置、依赖片段和提示词应作为待检查内容；要获得与 VSIX 相同的确定性工程，使用上面的扩展入口。

迁移旧版本时，检查用户级 Skill 目录中是否存在指向旧仓库位置的失效链接，并按上面的安装方式重新加载。源码安装不会自动替换用户目录中的既有配置。

## 仓库结构与验证

```text
java-tech-stack-selector/
├── .cursor-plugin/plugin.json     # Cursor Plugin manifest
├── commands/                      # 对话命令
├── skills/tech-stack-selector/    # 对话 Skill、参考资料、模板
└── vscode/                        # VSIX 源码、生产生成器和测试
```

`bash skills/tech-stack-selector/scripts/validate-config.sh` 只检查 Cursor Plugin 包的文件布局与 manifest JSON，不检验项目功能。功能验收使用 `vscode/` 的生产代码测试和实际生成工程构建。

## License

MIT，见 [LICENSE](LICENSE)。
