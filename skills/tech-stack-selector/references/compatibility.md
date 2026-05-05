# 技术栈兼容性说明

## 1. JDK版本兼容性

### 1.1 JDK与主要框架

| 组件 | JDK 8 | JDK 11 | JDK 17 | JDK 21 |
|------|:-----:|:------:|:------:|:------:|
| Spring Boot 2.7 | ✅ | ✅ | ✅ | ⚠️ |
| Spring Boot 3.0 | ❌ | ❌ | ✅ | ✅ |
| Spring Boot 3.2 | ❌ | ❌ | ✅ | ✅ |
| MyBatis-Plus 3.5 | ✅ | ✅ | ✅ | ✅ |
| Sa-Token 1.38 | ✅ | ✅ | ✅ | ✅ |
| Knife4j 4.x | ❌ | ❌ | ✅ | ✅ |
| Redisson 3.27 | ✅ | ✅ | ✅ | ✅ |
| Dubbo 3.3 | ❌ | ✅ | ✅ | ✅ |

### 1.2 JDK版本特性对比

| 特性 | JDK 8 | JDK 11 | JDK 17 | JDK 21 |
|------|:-----:|:------:|:------:|:------:|
| Lambda | ✅ | ✅ | ✅ | ✅ |
| Stream API | ✅ | ✅ | ✅ | ✅ |
| Records | ❌ | ❌ | ✅ | ✅ |
| Sealed Classes | ❌ | ❌ | ✅ | ✅ |
| Pattern Matching | ❌ | ❌ | ✅ | ✅ |
| Virtual Threads | ❌ | ❌ | ❌ | ✅ |
| Foreign Function API | ❌ | ❌ | ❌ | ✅ |

---

## 2. 框架兼容性

### 2.1 Spring Boot版本与组件

| 组件 | Spring Boot 2.7 | Spring Boot 3.x |
|------|:---------------:|:----------------:|
| Spring Security | ✅ | ✅ |
| Spring Data JPA | ✅ | ✅ |
| MyBatis-Plus | ✅ | ✅ |
| Sa-Token | ✅ | ✅ |
| Redis | ✅ | ✅ |
| RabbitMQ | ✅ | ✅ |
| Kafka | ✅ | ✅ |
| Elasticsearch | ✅ | ✅ |

### 2.2 ORM框架对比

| 特性 | MyBatis | MyBatis-Plus | JPA/Hibernate |
|------|:-------:|:-------------:|:--------------:|
| SQL控制 | 完全可控 | 增强CRUD | 自动生成 |
| 学习曲线 | 中等 | 低 | 较高 |
| 性能 | 高 | 高 | 中等 |
| 动态SQL | 强大 | 支持 | 支持 |
| 分页插件 | 需配置 | 内置 | 内置 |
| 代码生成 | 需插件 | 内置 | 可选 |

### 2.3 认证框架对比

| 特性 | Sa-Token | Spring Security | Shiro |
|------|:--------:|:---------------:|:-----:|
| 学习曲线 | 低 | 高 | 中等 |
| 配置复杂度 | 简单 | 复杂 | 中等 |
| 功能完整性 | 全面 | 最全面 | 基础 |
| 文档质量 | 优秀 | 优秀 | 一般 |
| 社区活跃度 | 活跃 | 非常活跃 | 一般 |
| Spring Boot 3支持 | ✅ | ✅ | ⚠️ |

---

## 3. 微服务组件兼容性

### 3.1 Spring Cloud与Spring Boot

| Spring Cloud版本 | Spring Boot版本 |
|:----------------:|:---------------:|
| 2022.0.x (Kilburn) | 3.0.x, 3.1.x |
| 2023.0.x (Leyton) | 3.2.x |

### 3.2 Spring Cloud Alibaba组件

| 组件 | 版本 2023.0.x |
|:----:|:------------:|
| Nacos | 2.3.x |
| Sentinel | 1.8.x |
| Seata | 1.8.x |
| Dubbo | 3.3.x |
| RocketMQ | 5.1.x |

---

## 4. 数据库兼容性

### 4.1 连接池对比

| 特性 | Druid | HikariCP | DBCP2 |
|:----:|:-----:|:--------:|:-----:|
| 性能 | 高 | 最高 | 中等 |
| 监控 | 丰富 | 基础 | 基础 |
| 连接检测 | SQL检测 | connectionTestQuery | validationQuery |
| 泄漏检测 | 支持 | 支持 | 支持 |
| 配置复杂度 | 中等 | 简单 | 中等 |

### 4.2 缓存方案对比

| 特性 | Redisson | Lettuce | JetCache |
|:----:|:--------:|:-------:|:--------:|
| 功能丰富度 | 最丰富 | 基础 | 中等 |
| 集群支持 | 好 | 好 | 一般 |
| 分布式锁 | 内置 | 需Redisson | 需扩展 |
| 响应式支持 | 有限 | 完整 | 无 |

---

## 5. 版本组合推荐

### 5.1 稳定版组合（推荐新手）

```
JDK: 17
Spring Boot: 3.2.5
MyBatis-Plus: 3.5.7
Sa-Token: 1.38.0
Druid: 1.2.21
Redisson: 3.27.0
Hutool: 5.8.26
```

### 5.2 高性能组合

```
JDK: 21
Spring Boot: 3.2.5
Spring WebFlux
R2DBC + MySQL
Redis (Lettuce)
```

### 5.3 微服务组合

```
JDK: 17
Spring Boot: 3.2.5
Spring Cloud: 2023.0.x
Spring Cloud Alibaba: 2023.0.1.2
Nacos: 2.3.0
Sentinel: 1.8.6
Seata: 1.8.0
```

---

## 6. 迁移注意事项

### 6.1 Spring Boot 2.x → 3.x

1. **JDK要求**：必须使用 JDK 17+
2. **命名空间**：Java EE → Jakarta EE
   - `javax.*` → `jakarta.*`
   - 如 `javax.servlet.http.HttpServlet` → `jakarta.servlet.http.HttpServlet`
3. **Spring Security**：配置方式有变化
4. **部分依赖**：需升级到兼容版本

### 6.2 常见冲突及解决方案

| 冲突 | 解决方案 |
|:-----|:--------|
| Spring Boot 3 + Shiro | 使用Shiro 1.12+，或迁移到Sa-Token |
| Spring Boot 3 + Fastjson | 改用Fastjson2 |
| JDK 21 + 部分国产数据库驱动 | 等待驱动更新或降级JDK |
