# 安装与迁移

候选包 java-tech-stack-selector-1.2.0-rc.1.zip 内只有一个 java-tech-stack-selector 文件夹。解压完整目录；仅复制 SKILL.md 不具备脚本生成能力。

Claude Code 本地个人级安装：把该文件夹放到 ~/.claude/skills/ 下；项目级安装放到项目的 .claude/skills/ 下。重新开启会话，检查 /java-tech-stack-selector 是否可用。不要同时安装两个同名副本。遇到已有同名目录先备份，不能直接覆盖。

调用示例：`/java-tech-stack-selector 创建模块化单体 shop-demo，模块 user,order，PostgreSQL、JPA、无缓存，输出工程到我指定的父目录。`

独立检查：`node <技能目录>/scripts/generate.cjs --help`。也可以把 JSON 通过 stdin 送入 validate/plan/generate。script 不联网、不构建，也不会自动启动数据库。

Cursor 候选安装目录为项目 .cursor/skills/ 或个人 ~/.cursor/skills/。Claude Code + DeepSeek 的单次只读能力调用已验证；完整任务和 Cursor 实际交互交由用户测试，不能仅凭目录放置成功宣称完整兼容。

从旧版本迁移：先备份个人目录中的 tech-stack-selector，再移出 Skill 发现目录；安装新的完整文件夹。旧 /start、/preset、/export 在仓库 Cursor 插件中已转接新 Skill。不要同时保留旧、新同功能 Skill 的自动发现入口。旧生成工程、JSON 配置以及已安装 VSIX 不需删除。

卸载时仅移除所安装的 Skill 文件夹；生成工程不随 Skill 卸载删除。

Agensi 以同一 ZIP 上传；MCP 返回脚本后按平台机制原样在临时文件执行并清理，不在项目中保存 Skill 源文。公开上传与真实 MCP 加载验证尚未进行。
