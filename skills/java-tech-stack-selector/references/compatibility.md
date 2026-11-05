# 当前生成器支持范围

此文档描述 **1.2.0-rc.1 候选版当前开放的选项**，不是 Java 生态中所有理论兼容组合。仅在共享生成器和实际构建验证通过后，才可增加新组合。

| 维度 | 当前开放 |
| --- | --- |
| Java 与 Spring | JDK 17、Spring Boot 3、Spring WebMVC |
| 构建 | Maven |
| 数据库 | MySQL 8、PostgreSQL |
| ORM | MyBatis-Plus、JPA/Hibernate |
| 连接池 | HikariCP |
| 缓存 | 无缓存、Redis + Redisson |
| 安全 | Spring Security、Sa-Token |
| API 文档 | 无、Knife4j |
| 架构 | 单体、模块化单体、微服务；微服务静态服务地址和可选网关 |

Gradle、JDK 8/21、Spring Boot 2、WebFlux、其他数据库/ORM/认证框架，以及注册中心、RPC、熔断、分布式事务、消息队列、工作流、调度器均未开放。用户请求这些组件时可讨论技术方案，但不得承诺当前生成器 会生成相应依赖或运行配置。

“无缓存”应不出现 Redis 依赖/配置；PostgreSQL 应对应 PostgreSQL JDBC 与 URL；JPA 不应出现 MyBatis-Plus 配置。具体版本由生产代码统一维护，并需经生成工程构建确认。
