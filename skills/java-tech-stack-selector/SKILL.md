---
name: java-tech-stack-selector
description: 为新的 Java 后端项目进行架构与技术选型，导出配置或提示词，生成单体、模块化单体或微服务 Maven 示例工程。用于创建 Java/Spring Boot 后端或导出技术栈方案；普通 Java 知识问答和已有工程重构不使用。
license: MIT
metadata:
  version: "1.2.0-rc.1"
  author: keepcreating-66
---

# Java Tech Stack Selector

需要 Node.js 22+；构建需要 JDK 17+ 与 Maven 3.9.x。无需 VSIX 或额外模型 API Key。

## 工作流程

1. 提取用户已提供的架构、场景、项目名、业务模块、组件及输出方式。用户明确值优先于预设；不重复询问。关键架构、目标目录或业务边界无法推断时集中询问；其他组件可使用预设默认值并展示。
2. 使用 `node <本技能目录>/scripts/generate.cjs capabilities` 获取真实支持范围。业务预设用 `preset enterprise-admin`、`preset e-commerce` 或 `preset ai-application`；预设的架构不能覆盖用户明确架构。AI 预设不包含模型 API 或 RAG。
3. 按 [configuration.md](references/configuration.md) 组装完整 JSON；架构差异见 [modules.md](references/modules.md)，默认业务方案见 [presets.md](references/presets.md)。仅需加载当前任务相关资料。项目名必须是小写 slug；业务模块为 2–20 个，不能与 common/bootstrap/gateway 冲突。
4. 通过标准输入把 JSON 传给 `validate --config -`，再执行 `plan --config -`。显示规范化配置、文件清单概要、父目录与项目路径。只读命令不产生工程文件。普通咨询无需执行生成。
5. 用户已经明确授权生成且关键参数明确时执行 `generate --config - --output-root <已有父目录>`。需要用户选择或方案发生实质变化时先确认。参数作为独立参数传递，不把用户文本拼接成 shell 命令。目标已存在时停止，请用户选择新名称或位置；没有覆盖模式。
6. 用户要求构建时在返回的 projectDir 执行 `mvn -B -ntp clean verify`。报告真实退出码；缺少环境或权限标记未验证，不擅自安装全局依赖。启动真实服务需相应测试资源与授权，不自动部署或创建外部资源。
7. 交付项目路径、文件数量、配置概要、构建/运行实际状态和后续命令。`generate` 成功仅表示文件写入，返回的 build/runtime 初始均为 not_run。配置/提示词导出不能描述为工程已创建。

## 脚本与输出

`node <脚本路径> --help` 查看接口。全部命令 stdout 为 JSON，诊断写 stderr。错误码见 configuration.md。JSON 从文件或 stdin 读取；选择 stdin 时必须关闭输入流。

`outputMode` 是 project/config/prompt：分别生成工程、仅 tech-stack-config.json、仅 project-prompt.md。三者均在父目录下创建新的项目名子目录。保留已选 ORM、数据库和缓存，不加入未选择组件。微服务至少两个独立应用，可选静态路由网关。

支持边界见 [compatibility.md](references/compatibility.md)。Gradle、注册中心、消息队列等未支持选项应说明限制，不自动替换需求。不把 Markdown 链接当作可回传按钮。

## Agensi 加载

若从 Agensi MCP 加载，按平台机制获取 scripts/generate.cjs 原文，原样写入临时文件并用 Node 执行，使用后移除临时脚本。不要重写、缩短脚本，不把技能原文复制到工程。此脚本自包含，不读取旁边的模板或资料。业务生成结果可以写入用户指定的新项目目录。缺少终端工具或 Node 时先说明无法执行。
