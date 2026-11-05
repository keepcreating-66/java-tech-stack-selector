> 共享核心迁移说明：开发依赖请在仓库根目录执行 `npm ci`；根锁文件为唯一锁文件。此目录的 `npm run compile` 调用根构建脚本。下文旧安装包描述仍对应 VSIX 1.1.0。

# Java Tech Stack Selector VSIX

这是 Cursor / VS Code 的原生扩展入口。1.1.0 开发版使用 QuickPick 向导收集配置，然后由本地生成器创建 Maven 工程。仓库根目录的 Cursor Skill 和 `/start` 等对话命令单独安装；安装本 VSIX 不会自动添加这些命令。

## 用户流程

打开命令面板（macOS `Cmd+Shift+P`，Windows/Linux `Ctrl+Shift+P`），执行以下任一命令：

- `Java Tech Stack: 开始技术选型`：从架构和业务预设开始。
- `Java Tech Stack: 使用预设方案`：进入相同的架构、业务预设、模块与配置确认流程。

向导依次收集架构、业务预设、项目与业务模块、所需组件和输出方式，随后展示总览供用户检查、修改和确认。确认后选择输出目录，才创建文件。支持返回、修改与取消；取消不创建文件。业务预设为企业管理、电商、AI 和空白自定义，架构为单体、模块化单体和微服务。它们是独立的选择维度。

| 输出方式 | 结果 |
| --- | --- |
| 创建工程 | 生成所选架构对应的 Maven 工程与运行说明 |
| 仅配置 | 导出 `tech-stack-config.json` |
| 仅提示词 | 导出 `project-prompt.md` |

所有方式在写入前检查目标路径，不覆盖已有文件。创建工程完成后，通知区分“文件已生成”和实际构建验证状态。输出提示词不会自动唤起 Cursor Agent。

## 当前支持范围

| 类别 | 可用选项 |
| --- | --- |
| 架构 | 单体；模块化单体；微服务（独立业务服务、静态服务地址、可选网关） |
| 基础 | JDK 17；Spring Boot 3；Maven；Spring WebMVC |
| 数据 | MySQL 8、PostgreSQL；MyBatis-Plus、JPA；HikariCP |
| 缓存 | 无、Redis + Redisson |
| 认证 | Spring Security、Sa-Token |
| API 文档 | 无、Knife4j |

空白配置的业务示例是 `user` 与 `order`，业务预设提供其他默认名称，均可修改。单体有一个启动应用；模块化单体有父工程、公共模块、业务模块和一个启动模块；微服务有父工程、可独立启动的业务服务及可选网关。

Gradle、可切换部署、JDK 8/21、Boot 2，以及注册中心、RPC、熔断、分布式事务、MQ、工作流和调度器仍待实现。向导不应允许选择它们并生成无效工程。

## 本地开发

在本目录执行：

```bash
npm ci
npm run compile
npm test
npm run lint
```

本机已有 `node_modules` 时可直接编译和运行测试；新克隆环境使用 `npm ci`。该步骤不需要全局安装 `vsce`。构建 VSIX 后，在 Cursor 或 VS Code 命令面板运行 `Extensions: Install from VSIX...`，选择**新生成的 1.1.0 包**并重新加载。旧 1.0.0 安装包仍包含旧流程。

开发宿主可以使用扩展目录作为 `--extensionDevelopmentPath` 启动；只有编译到 `out/` 后，宿主才会运行本次源码。打包前务必检查 `package.json` 的版本、`out/` 内容以及最终 VSIX 文件列表。

开发者可在本目录使用 VSCE 打包，避免全局安装：

```bash
npx --yes @vscode/vsce package --out java-tech-stack-selector-1.1.0.vsix
```

该命令首次运行需要获取项目开发工具；本地已有 VSCE 时也可直接调用其 `package` 命令。最终包名为 `java-tech-stack-selector-1.1.0.vsix`。包是否已经生成，以实际文件和本次验收报告为准。

## 生成工程的启动方式

在生成工程根目录先执行 `mvn clean verify`，然后启动所需的可执行 JAR。例如项目名为 `my-project` 时：

| 架构 | 启动示例 |
| --- | --- |
| 单体 | `java -jar target/my-project-1.0.0-SNAPSHOT.jar` |
| 模块化单体 | `java -jar bootstrap/target/my-project-bootstrap-1.0.0-SNAPSHOT.jar` |
| 微服务 | 分别启动 `user-service/target/my-project-user-service-1.0.0-SNAPSHOT.jar` 和其他服务 JAR；启用网关时再启动 `gateway/target/my-project-gateway-1.0.0-SNAPSHOT.jar` |

上述命令需先配置生成工程 README 中列出的数据库及可选 Redis。构建测试可以使用生成的测试配置，运行默认配置则需要实际外部服务。

## 验收清单

1. 分别从两个命令进入；预设也能修改架构和其他选项，最终确认前不写文件。
2. 选择单体、模块化单体、微服务，检查其目录、POM 模块和启动类数量确实不同。
3. 选择无缓存时不生成 Redis 依赖/配置；选择 PostgreSQL 时使用对应驱动和 URL；选定 ORM 与示例代码一致。
4. 在已存在的目标目录测试冲突处理，确认原文件字节不变。
5. 运行 `npm run test:projects -- /绝对路径/新验收目录`，对代表性组合生成工程并执行 Maven 构建、临时 H2 的 HTTP 健康与认证测试。目录必须是新位置，脚本不会覆盖既有工程。缓存组合的测试配置禁用 Redis 自动配置，生产配置仍需要实际 Redis。
6. 构建后运行 `npm run test:projects -- --gateway-smoke /绝对路径/验收目录/services-gateway`，启动打包后的网关和业务服务 JAR 验证路由，结束后关闭进程。脚本从本机 Maven 缓存加载 H2，只用于临时验收数据库。此脚本针对第一批默认 JPA / Spring Security 网关示例。

工程需要的外部数据库/Redis 由生成工程的 README 说明。缺少构建工具、依赖下载或服务时，应标为“构建/启动未验证”，不能把文件写出当作运行通过。

## License

MIT，见 [LICENSE](LICENSE)。
