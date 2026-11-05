# Java Tech Stack Selector

基于插件 1.1.0 的独立 Agent Skill 候选版 1.2.0-rc.1。支持 Java 17 / Spring Boot 3 / Maven 的单体、模块化单体及微服务示例生成，提供配置、提示词或工程三种输出。

## 使用

完整 Skill 位于 `skills/java-tech-stack-selector/`。运行脚本需要 Node.js 22+；构建工程需要 JDK 17+、Maven 3.9.x，启动需所选数据库及可选 Redis。无需 VSIX、npm install 或额外模型 API Key。

安装、调用、迁移见 [安装说明](docs/Skill安装与迁移.md)。验证现状见 [验收报告](docs/Skill验收报告_2026-11-05.md)。本版本为供用户自行测试的候选发行包；完整宿主与跨平台验收由用户执行，见 [用户测试清单](docs/Skill用户测试清单.md)。

## 开发

在仓库根目录执行 `npm ci`，然后 `npm test`、`npm run test:projects`、`npm run package:skill`。根 package-lock.json 是工作区唯一锁文件。依赖只装在项目内。

公共核心位于 packages/core/src；CLI 位于 cli/src；Skill 脚本由 scripts/build.mjs 构建，不能手动修改生成脚本。VSIX 保留原有向导，所有 out 文件独立打包共享逻辑，安装后的扩展不依赖仓库软链接。已有 VSIX 安装包不会自动更新。

支持范围：MySQL/PostgreSQL、JPA/MyBatis-Plus、无缓存/Redisson、Spring Security/Sa-Token、无文档/Knife4j、微服务可选静态网关。未支持 Gradle、Nacos、消息队列、分布式事务、RAG 或自动部署。工程提供基础 CRUD 示例，需按真实需求完善。

旧 Skill 历史资料位于 docs/legacy-tech-stack-selector，不参与 Skill 自动发现。MIT 许可证见 LICENSE。
