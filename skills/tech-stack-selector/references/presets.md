# 业务场景预设

预设仅填写默认值。**系统架构始终由用户单独选择和确认**；选择预设不会生成工程，也不会自动开启尚未实现的组件。此表与 `vscode/src/core/data.ts` 的首批默认值保持一致。

| 场景 | 建议项目名 | 默认模块 | 默认数据与文档 |
| --- | --- | --- | --- |
| 企业管理 | `my-admin` | `user`、`audit` | MySQL 8、MyBatis-Plus、Knife4j |
| 电商 | `my-shop` | `catalog`、`order` | PostgreSQL、JPA、无 API 文档 |
| AI 应用基础工程 | `my-ai-app` | `model`、`task` | MySQL 8、JPA、无 API 文档 |
| 自定义 | `my-project` | `user`、`order` | MySQL 8、JPA、无 API 文档 |

公共默认值：JDK 17、Spring Boot 3、Maven、Spring WebMVC、HikariCP、无缓存、Spring Security。向导仍须允许用户修改这些已支持字段。AI 预设只提供基础 Java 工程，没有自动生成 RAG、Agent、模型接入或 Milvus 集成。

旧文档曾将“微服务架构”列为第四个业务预设。它现在是独立的架构选项。用户输入旧 `/preset microservice` 时，先选择微服务架构，再继续询问业务场景，不能直接生成。
