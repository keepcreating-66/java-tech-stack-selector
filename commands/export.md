---
description: 导出当前项目的技术栈配置，支持JSON、Maven依赖、提示词等格式
---

导出当前项目的技术栈配置。

## 支持的导出格式

| 格式 | 说明 | 适用场景 |
|:-----|:-----|:---------|
| JSON | 技术栈配置文件 | 保存配置、版本控制 |
| XML | Maven依赖片段 | 复制到pom.xml |
| MD | 项目提示词 | 在其他AI工具中使用 |
| ALL | 全部导出 | 完整备份 |

## 使用方式

如果用户提供了参数 "$ARGUMENTS"，尝试解析为导出格式：
- `/export json` 或 `/export 1` - 导出JSON配置
- `/export xml` 或 `/export 2` - 导出Maven依赖
- `/export md` 或 `/export 3` - 导出提示词
- `/export all` 或 `/export 5` - 导出全部

如果未提供参数，让用户选择导出格式。

## 前置检查

**重要**：此命令需要先完成技术选型流程。

如果用户尚未完成技术选型，提示：
```
⚠️ 尚未完成技术选型，请先运行 /start 进行技术选型，或使用 /preset 选择预设方案。
```

## 导出内容

### 1. 技术栈配置（JSON）

包含完整的项目配置信息：
```json
{
  "project": { ... },
  "core": { ... },
  "database": { ... },
  "security": { ... },
  ...
}
```

### 2. Maven依赖（XML）

可复制的依赖片段，包含：
- Spring Boot starters
- 数据库驱动
- ORM框架
- 安全框架
- 工具库
- 其他组件

### 3. 项目提示词（Markdown）

完整的项目初始化提示词，可在任何AI工具中使用。

## 输出示例

```
📁 请选择导出格式：

[1] 技术栈配置文件（JSON）
[2] Maven依赖片段（XML）
[3] 项目提示词（Markdown）
[4] Cursor专用提示词
[5] 全部导出

请输入编号：

用户：5

✅ 导出完成！

📁 生成的文件：
1. tech-stack-config.json - 技术栈配置
2. pom-fragment.xml - Maven依赖片段
3. project-prompt.md - 项目提示词
4. cursor-prompt.md - Cursor专用提示词

💡 文件已保存到当前目录
```

## 文件命名规范

- 技术栈配置：`{project-name}-tech-stack.json`
- Maven依赖：`{project-name}-pom.xml`
- 项目提示词：`{project-name}-prompt.md`
- Cursor提示词：`{project-name}-cursor.md`
