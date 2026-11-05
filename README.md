# Java Tech Stack Selector

通过 Agent 对话完成 Java 后端技术选型，并生成 Maven 示例工程。支持单体、模块化单体和微服务，可输出工程、JSON 配置或 Markdown 提示词。

当前 Skill 版本为 **1.2.0-rc.1**，基于原插件 1.1.0 的生成能力。可以独立安装到 Claude Code 使用；原 VSIX 向导仍然保留。

## 一、准备环境

| 用途 | 需要的环境 |
| --- | --- |
| 在 Agent 中使用 | 已配置好模型服务的 Claude Code 本地终端会话 |
| 生成文件、校验配置 | Node.js 22 或更高版本 |
| 构建生成的 Java 工程 | JDK 17 或更高版本、Maven 3.9.x |
| 启动生成的应用 | 所选的 MySQL/PostgreSQL；选择 Redis 时还需 Redis |

在终端检查：

```bash
node --version
claude --version
java -version
mvn -version
```

只生成文件时，不需要先启动数据库。Skill 使用 Claude Code 已配置的模型服务，也可以沿用你的 DeepSeek 接入；不需要为本 Skill 额外配置模型密钥。使用 Skill 无需安装 VSIX，也无需执行 `npm install`。

## 二、获取完整 Skill

任选一种方式：

- 从仓库页面选择 **Code → Download ZIP**，解压后找到 `skills/java-tech-stack-selector/`。
- 如果 [Releases](https://github.com/keepcreating-66/java-tech-stack-selector/releases) 中已提供独立 Skill 包，下载并解压 `java-tech-stack-selector-1.2.0-rc.1.zip`，得到 `java-tech-stack-selector/`。
- 使用 Git 克隆仓库：

```bash
git clone https://github.com/keepcreating-66/java-tech-stack-selector.git
cd java-tech-stack-selector
```

需要复制的是**整个 Skill 文件夹**，不是单独一个 `SKILL.md`：

```text
java-tech-stack-selector/
├── SKILL.md
├── scripts/generate.cjs
├── references/
├── examples/
└── LICENSE
```

仓库已包含可运行的 `generate.cjs`，普通使用者不需要从 TypeScript 源码构建。仓库 ZIP 和独立 Skill ZIP 的目录层级不同，请确认 `SKILL.md` 直接位于最终的 Skill 文件夹内。

## 三、安装到 Claude Code

### 推荐：个人级安装

将完整文件夹复制到个人 Skill 目录，供本机各项目的 Claude Code 本地会话使用：

```text
~/.claude/skills/java-tech-stack-selector/SKILL.md
```

macOS/Linux 用户也可以在**本仓库根目录**执行下面的命令。已有同名目录时会停止复制，避免覆盖：

```bash
skill_target="$HOME/.claude/skills/java-tech-stack-selector"
if [ -e "$skill_target" ] || [ -L "$skill_target" ]; then
  printf '%s\n' "目标已存在：$skill_target，请先备份并移出旧目录，再重新安装。"
else
  mkdir -p "$HOME/.claude/skills"
  cp -R "skills/java-tech-stack-selector" "$skill_target"
fi
```

如果下载的是独立 Skill ZIP，也可以直接用文件管理器把解压后的文件夹放到上述位置。Windows 用户对应放到 `%USERPROFILE%\.claude\skills\java-tech-stack-selector\`。

macOS/Linux 安装后可执行一次只读版本检查：

```bash
node "$HOME/.claude/skills/java-tech-stack-selector/scripts/generate.cjs" --version
```

预期返回包含 `"ok":true` 和 `"generatorVersion":"1.2.0-rc.1"` 的 JSON。这一步只检查脚本能否运行，不创建工程。

### 可选：项目级安装

如果只想在一个项目内使用，把完整文件夹放到该项目的：

```text
<项目目录>/.claude/skills/java-tech-stack-selector/SKILL.md
```

个人级和项目级选择一种即可，避免同时安装同名副本。Claude Code 的加载位置与调用规则见 [官方 Skills 文档](https://code.claude.com/docs/en/skills)。这里的本地安装说明不适用于 Cowork 或云端会话。

## 四、启动并调用 Skill

先在终端准备一个存放新工程的父目录，再从该目录启动新的 Claude Code 会话。下面是 macOS/Linux 示例：

```bash
mkdir -p "$HOME/Code/generated"
cd "$HOME/Code/generated"
claude
```

在 **Claude Code 对话输入框中**输入下列内容，不是在系统终端里把它当作 shell 命令执行：

```text
/java-tech-stack-selector
```

首次可以先问：

```text
/java-tech-stack-selector 请列出当前支持的架构、组件和输出方式，暂时不要创建文件。
```

也可以用自然语言请求：“使用 java-tech-stack-selector 帮我创建一个 Java 后端项目。”首次使用建议显式输入完整技能名，方便确认实际调用。

## 五、创建第一个工程

接着在同一个 Claude Code 会话中输入：

```text
/java-tech-stack-selector 创建一个电商后端：
项目名 shop-demo，采用模块化单体架构；
业务模块 catalog、order；
使用 Java 17、Spring Boot 3、Maven、PostgreSQL、JPA；
不使用缓存，认证用 Spring Security，不生成 API 文档。
请在当前目录下创建 shop-demo 工程，并报告文件生成结果。
```

Skill 会提取已有信息、补充必要缺项、校验并预览配置，然后按照你的授权创建文件。父目录必须已存在，目标项目目录必须不存在；例如本次目标为 `~/Code/generated/shop-demo/`。已有同名目录时，请更换项目名或输出位置。

模块化单体的主要产物如下：

```text
shop-demo/
├── pom.xml
├── common/
├── catalog/
├── order/
├── bootstrap/
├── sql/
├── tech-stack-config.json
├── project-prompt.md
├── .env.example
└── README.md
```

业务场景与架构是独立选择：电商可以是单体、模块化单体或微服务。生成内容是包含实体、仓储、服务和 CRUD 接口的基础示例，支付、库存扣减等真实业务规则需要继续开发。

### 其他常用请求

| 目标 | 在 Claude Code 中输入的示例 |
| --- | --- |
| 单体工程 | `/java-tech-stack-selector 创建单体 demo-one，模块 user、order，MySQL、JPA、无缓存、Spring Security、无 API 文档，在当前目录生成工程。` |
| 微服务工程 | `/java-tech-stack-selector 创建微服务 demo-services，服务 user、order，PostgreSQL、MyBatis-Plus、无缓存、Sa-Token、无 API 文档，启用网关，在当前目录生成工程。` |
| 仅配置 | `/java-tech-stack-selector 按企业管理预设导出配置，项目名 admin-config，架构为模块化单体，模块 user、audit；只在当前目录输出 JSON，不创建工程。` |
| 仅提示词 | `/java-tech-stack-selector 为单体 prompt-demo 导出创建提示词，模块 user、order，其余使用默认组件；只在当前目录输出提示词，不创建工程。` |

三种输出都在父目录下创建一个新的项目名子目录：

| 输出方式 | 子目录内的结果 |
| --- | --- |
| 工程 `project` | Maven 工程、配置、SQL、测试及运行说明等 |
| 配置 `config` | 仅 `tech-stack-config.json` |
| 提示词 `prompt` | 仅 `project-prompt.md` |

导出配置或提示词不代表已创建可运行工程。

## 六、构建与启动生成的工程

如果希望 Agent 执行构建，在对话中追加：

```text
请在刚生成的 shop-demo 工程中执行 mvn -B -ntp clean verify，并报告实际结果。
```

也可以自己在终端执行：

```bash
cd "$HOME/Code/generated/shop-demo"
mvn -B -ntp clean verify
```

生成器只负责写文件，不自动构建或启动应用。返回 `build.status: not_run` 表示尚未执行构建。工程内的测试使用 H2；通过构建不代表真实 PostgreSQL/MySQL/Redis 已经配置完成。

启动前，阅读**生成工程自己的 README**，创建所需数据库，并在启动终端设置 `DB_URL`、`DB_USER`、`DB_PASSWORD`。选择 Redis 时设置对应地址；Sa-Token 示例还需设置演示登录凭据。`.env.example` 是说明模板，Spring Boot 不会自动读取该文件。

完成数据库配置与构建后，上述模块化单体示例可以运行：

```bash
java -jar bootstrap/target/shop-demo-bootstrap-1.0.0-SNAPSHOT.jar
```

单体、微服务的启动命令不同，以各自生成的 README 为准。应用健康端点为 `/actuator/health`，受保护的业务接口还需要按所选认证框架登录或提供凭据。

## 七、支持范围与常见问题

支持 MySQL/PostgreSQL、JPA/MyBatis-Plus、无缓存/Redisson、Spring Security/Sa-Token、无文档/Knife4j，以及微服务静态地址路由和可选网关。当前不支持 Gradle、Nacos、消息队列、分布式事务、RAG 或自动部署。当前项目名采用小写字母、数字及中间连字符，业务模块要求 2–20 个。

| 问题 | 检查方法 |
| --- | --- |
| 找不到 `/java-tech-stack-selector` | 检查安装位置是否为 `.../java-tech-stack-selector/SKILL.md`，是否多嵌套一层目录；重新开启会话，并确认 Skill 未被宿主设置禁用 |
| 找不到 `generate.cjs` | 重新复制完整 Skill 文件夹；只复制 Markdown 不够 |
| `node` 或 `mvn` 找不到 | 在启动 Claude Code 的同一个终端检查 PATH 和对应版本；仅生成不要求 Maven |
| 提示目标目录已存在 | 更换项目名或父目录；当前没有覆盖模式 |
| 新源码更新了，已安装 Skill 还是旧版 | 安装目录是独立副本；先备份并移出旧 Skill 文件夹，再复制新版完整目录 |

从旧版 `tech-stack-selector` 迁移时，将旧副本备份并移出 Skill 发现目录；新版本名称是 `java-tech-stack-selector`。本仓库 Cursor 插件内的旧 `/start`、`/preset`、`/export` 已转接新 Skill；只安装 Claude Code Skill 时使用 `/java-tech-stack-selector`。

更多说明：[安装与迁移](docs/Skill安装与迁移.md)、[用户测试清单](docs/Skill用户测试清单.md)、[验收报告](docs/Skill验收报告_2026-11-05.md)。当前为候选发行版；完整宿主、真实服务及跨平台验证由用户执行。本轮保留插件 1.1.0 的依赖组合（包括 Boot 3.2.5），不代表当前生产环境推荐版本。

## 开发与打包

只有修改源码或重新构建发行包的开发者，才需要在仓库根目录执行：

```bash
npm ci
npm test
npm run test:projects
npm run package:skill
```

根 `package-lock.json` 是工作区唯一锁文件。`test:projects` 会生成六组工程并执行 Maven 测试，需要下载依赖和监听本地测试端口。打包输出为 `dist/java-tech-stack-selector-1.2.0-rc.1.zip`，附带校验清单和版本信息；`dist/` 不纳入源码提交。

公共核心位于 `packages/core/src/`，CLI 位于 `cli/src/`。`scripts/build.mjs` 从公共源码构建 Skill 脚本和 VSIX 输出；不要手动修改生成的 `generate.cjs`。VSIX 保留原有向导，安装后的扩展不依赖仓库软链接；已有 VSIX 安装包不会自动更新。

旧 Skill 历史资料位于 `docs/legacy-tech-stack-selector/`，不参与 Skill 自动发现。

## License

MIT，见 [LICENSE](LICENSE)。
