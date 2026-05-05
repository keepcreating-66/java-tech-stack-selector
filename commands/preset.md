---
description: 使用预设方案快速完成技术选型，支持企业级管理系统、电商系统、AI应用平台、微服务架构
---

使用预设方案快速完成Java后端项目技术选型。

## 可用的预设方案

使用**卡片式按钮**展示预设方案：

```markdown
## 选择预设方案（点击选择）

> ## [🅰️ 企业级管理系统](#预设:enterprise)
> **适用场景：** 后台管理、OA、ERP、CRM、MIS
>
> - 项目类型：模块化单体
> - Java版本：JDK 17
> - 核心技术：Spring Boot 3.x + MyBatis-Plus + Sa-Token
> - 特色功能：工作流（Flowable）、定时任务（XXL-Job）、监控（SkyWalking）

> ## [🅱️ 电商系统](#预设:ecommerce)
> **适用场景：** 商城、交易平台、O2O
>
> - 项目类型：模块化单体
> - Java版本：JDK 17
> - 核心技术：Spring Boot 3.x + MyBatis + Spring Security
> - 特色功能：消息队列（RabbitMQ）、搜索引擎（Elasticsearch）

> ## [🤖 AI应用平台](#预设:ai)
> **适用场景：** AI服务、RAG、Agent、大模型应用
>
> - 项目类型：单体
> - Java版本：JDK 21
> - 核心技术：Spring Boot 3.x + Spring AI + MyBatis-Plus
> - 特色功能：AI模型集成（RAG、Agent）、向量数据库（Milvus）

> ## [🔧 微服务架构](#预设:microservice)
> **适用场景：** 大型分布式系统、高并发场景
>
> - 项目类型：微服务
> - Java版本：JDK 17
> - 核心技术：Spring Boot 3.x + Spring Cloud Alibaba
> - 特色功能：Nacos、Sentinel、Seata、ShardingSphere
```

## 预设方案详情

### 预设1：企业级管理系统
- 项目类型：模块化单体
- Java版本：JDK 17
- 构建工具：Maven
- 核心技术：Spring Boot 3.x + MyBatis-Plus + Sa-Token
- 特色功能：工作流（Flowable）、定时任务（XXL-Job）、监控（SkyWalking）

### 预设2：电商系统
- 项目类型：模块化单体
- Java版本：JDK 17
- 构建工具：Maven
- 核心技术：Spring Boot 3.x + MyBatis + Spring Security
- 特色功能：消息队列（RabbitMQ）、搜索引擎（Elasticsearch）

### 预设3：AI应用平台
- 项目类型：单体
- Java版本：JDK 21
- 构建工具：Maven
- 核心技术：Spring Boot 3.x + Spring AI + MyBatis-Plus
- 特色功能：AI模型集成（RAG、Agent）、向量数据库（Milvus）

### 预设4：微服务架构
- 项目类型：微服务
- Java版本：JDK 17
- 构建工具：Maven
- 核心技术：Spring Boot 3.x + Spring Cloud Alibaba
- 特色功能：Nacos、Sentinel、Seata、ShardingSphere

## 使用方式

如果用户提供了参数 "$ARGUMENTS"，尝试匹配预设方案名称或编号：
- `/preset 1` 或 `/preset enterprise` - 企业级管理系统
- `/preset 2` 或 `/preset e-commerce` - 电商系统
- `/preset 3` 或 `/preset ai` - AI应用平台
- `/preset 4` 或 `/preset microservice` - 微服务架构

如果未提供参数，展示预设方案卡片让用户点击选择。

## 选择预设后的流程

1. 展示预设配置的完整详情
2. 允许用户查看和修改部分配置
3. 确认后生成相应的输出

## 示例对话

```markdown
用户：/start

AI：✅ 已选择预设：企业级管理系统

预设配置：
- 项目类型：模块化单体
- Java版本：JDK 17
- 构建工具：Maven
- 应用框架：Spring Boot 3.2.5
- Web层：Spring WebMVC
- 数据库：MySQL 8.0 + MyBatis-Plus 3.5.7 + Druid 1.2.21
- 缓存：Redis + Redisson 3.27.0 + JetCache
- 认证：Sa-Token 1.38.0 + JWT
- 工作流：Flowable 6.8.0
- 定时任务：XXL-Job 2.4.0
- API文档：Knife4j 4.4.0
- 工具库：Hutool, MapStruct, Lombok, EasyExcel
- 监控：SkyWalking + Spring Boot Admin
- 部署：Docker + Docker Compose

**是否需要修改？**

[ ✅ 确认，继续生成 ](#操作:confirm)   [ ✏️ 修改某个模块 ](#操作:modify)   [ 🔄 重新选择预设 ](#操作:restart-preset)
```
