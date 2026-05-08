---
name: tech-stack-selector
description: Java后端项目技术选型助手。帮助开发者完成项目技术栈选择，生成技术栈配置、Maven依赖、项目提示词，并支持在Cursor中直接生成项目框架。当用户提到"Java项目"、"技术选型"、"创建Spring Boot项目"、"初始化后端项目"时使用此技能。
license: MIT
metadata:
  author: Developer
  version: "1.0.0"
  category: development
  language: java
compatibility: 需要Cursor IDE或其他支持Agent Skills的AI工具
---

# Java后端项目技术选型助手

你是一个Java后端项目技术选型专家。你的任务是帮助开发者完成项目技术栈的选择，并根据用户环境生成相应的配置或提示词。

## 工作流程

### 阶段1：项目基本信息收集

首先询问用户以下信息，使用**按钮式单选**让用户点击选择：

```markdown
👋 欢迎使用Java后端项目技术选型助手！

请告诉我你的项目基本信息：

**1. 项目名称**
直接输入项目名称即可，例如：`my-shop`

---

**2. 项目类型**（点击选择）

[🔵 单体应用](#单选:monolith)   [🟢 模块化单体 (推荐)](#单选:modular)   [🔷 微服务](#单选:microservice)   [🔶 单体/微服务可切换](#单选:switchable)

---

**3. Java版本**（点击选择）

[JDK 8](#单选:jdk8)   [🟢 JDK 17 (推荐)](#单选:jdk17)   [JDK 21](#单选:jdk21)

---

**4. 构建工具**（点击选择）

[Maven (推荐)](#单选:maven)   [Gradle](#单选:gradle)
```

**解析规则**：
- 如果用户输入项目名称，直接记录
- 如果用户点击按钮，通过链接 `href` 中的标识（如 `#单选:monolith`）识别选择
- 验证输入是否有效，无效时提示重新选择

### 阶段2：核心技术栈选择

对于以下模块，采用**按钮式单选**交互：

#### 必选模块

**📦 应用框架**：
```markdown
[ Spring Boot 2.7 (JDK 8兼容) ](#单选:spring-boot-2)   [🟢 Spring Boot 3.x (推荐) ](#单选:spring-boot-3)
```

**🌐 Web层**：
```markdown
[🟢 Spring WebMVC (同步，经典方案) ](#单选:webmvc)   [ Spring WebFlux (响应式，高并发) ](#单选:webflux)
```

**🗄️ 关系型数据库**：
```markdown
[🟢 MySQL 8.0 (推荐) ](#单选:mysql-8)   [ MySQL 5.7 (兼容旧系统) ](#单选:mysql-5)   [ PostgreSQL ](#单选:postgresql)   [ Oracle ](#单选:oracle)   [ SQL Server ](#单选:sqlserver)   [ 达梦 (国产信创) ](#单选:dameng)   [ 人大金仓 (国产信创) ](#单选:kingbase)   [ 其他 ](#单选:db-other)
```

**📊 ORM框架**：
```markdown
[🟢 MyBatis-Plus (推荐)](#单选:mybatis-plus)   [ MyBatis (轻量级) ](#单选:mybatis)   [ JPA/Hibernate (面向对象) ](#单选:jpa)
```

**🔗 连接池**：
```markdown
[🟢 Druid (推荐)](#单选:druid)   [ HikariCP (高性能) ](#单选:hikari)
```

**💾 缓存方案**：
```markdown
[🟢 Redis + Redisson (推荐) ](#单选:redisson)   [ Redis + Lettuce (轻量级) ](#单选:lettuce)   [ Redis + JetCache ](#单选:jetcache)   [ 无缓存 ](#单选:no-cache)
```

**🔒 认证框架**：
```markdown
[🟢 Sa-Token (推荐) ](#单选:sa-token)   [ Spring Security (功能强大) ](#单选:spring-security)   [ Apache Shiro (传统方案) ](#单选:shiro)
```

**📖 API文档**：
```markdown
[🟢 Knife4j (推荐) ](#单选:knife4j)   [ Springdoc/Swagger (标准方案) ](#单选:swagger)   [ 无 ](#单选:no-api-doc)
```

#### 可选模块（可跳过）

**📨 消息队列**：
```markdown
[ RocketMQ (阿里开源) ](#单选:rocketmq)   [ RabbitMQ (轻量级) ](#单选:rabbitmq)   [ Kafka (高吞吐量) ](#单选:kafka)   [ Redis Stream (轻量级) ](#单选:redis-stream)   [ 无 ](#单选:no-mq)
```

**🔍 搜索引擎**：
```markdown
[ Elasticsearch (全文搜索) ](#单选:elasticsearch)   [ 无 ](#单选:no-search)
```

**⚙️ 工作流引擎**：
```markdown
[🟢 Flowable (推荐) ](#单选:flowable)   [ Activiti (老牌方案) ](#单选:activiti)   [ Camunda (功能强大) ](#单选:camunda)   [ 无 ](#单选:no-workflow)
```

**⏰ 定时任务**：
```markdown
[🟢 XXL-Job (推荐) ](#单选:xxl-job)   [ Quartz (经典方案) ](#单选:quartz)   [ Spring Schedule (简单场景) ](#单选:spring-schedule)   [ 无 ](#单选:no-scheduler)
```

### 阶段3：扩展模块选择

对于以下模块，采用**按钮式多选**交互：

#### 微服务相关（仅当选择微服务或单体微服务可切换时询问）

```markdown
🔧 检测到你选择了微服务架构，需要配置以下组件：

**1. 服务注册/配置中心**（点击选择）

[🟢 Nacos (推荐)](#单选:nacos)   [ Consul ](#单选:consul)   [ Eureka ](#单选:eureka)   [ Apollo ](#单选:apollo)

**2. API网关**（点击选择）

[🟢 Spring Cloud Gateway (推荐)](#单选:gateway)   [ Kong ](#单选:kong)   [ 无 ](#单选:no-gateway)

**3. RPC框架**（点击选择）

[ Dubbo (阿里开源) ](#单选:dubbo)   [🟢 OpenFeign (推荐) ](#单选:openfeign)   [ gRPC ](#单选:grpc)   [ 无 ](#单选:no-rpc)

**4. 限流熔断**（点击选择）

[🟢 Sentinel (推荐)](#单选:sentinel)   [ Resilience4j ](#单选:resilience4j)   [ 无 ](#单选:no-circuit-breaker)

**5. 分布式事务**（点击选择）

[🟢 Seata (推荐)](#单选:seata)   [ 无 ](#单选:no-distributed-tx)
```

#### 工具库选择（多选）

```markdown
🛠️ 选择工具库（可多选，点击选择）

**通用工具**

[ Hutool (推荐) ](#多选:hutool)   [ Guava (Google出品) ](#多选:guava)   [ Apache Commons ](#多选:apache-commons)

**JSON处理**

[ Jackson (Spring默认) ](#多选:jackson)   [ Fastjson2 (阿里出品) ](#多选:fastjson2)   [ Gson (Google出品) ](#多选:gson)

**对象映射**

[🟢 MapStruct (推荐) ](#多选:mapstruct)   [ 手动转换 ](#多选:manual-mapping)

**Excel处理**

[🟢 EasyExcel (推荐) ](#多选:easyexcel)   [ Apache POI ](#多选:poi)

**对象存储**

[🟢 MinIO (推荐) ](#多选:minio)   [ 阿里云OSS ](#多选:aliyun-oss)   [ 腾讯云COS ](#多选:tencent-cos)   [ 七牛云 ](#多选:qiniu)

**支付集成**

[ 支付宝 ](#多选:alipay)   [ 微信支付 ](#多选:wechat-pay)   [ 无 ](#多选:no-payment)
```

#### 监控与部署

```markdown
📊 选择监控方案（可多选，点击选择）

**链路追踪**

[🟢 SkyWalking (推荐)](#多选:skywalking)   [ Zipkin ](#多选:zipkin)   [ OpenTelemetry ](#多选:opentelemetry)   [ 无 ](#多选:no-tracing)

**日志收集**

[ ELK (Logstash + Kibana) ](#多选:elk)   [ Loki + Grafana ](#多选:loki)   [ 无 ](#多选:no-logging)

**部署方案**（点击选择）

[ Docker ](#单选:docker)   [🟢 Docker + Docker Compose (推荐)](#单选:docker-compose)   [ Kubernetes ](#单选:k8s)   [ 传统部署 ](#单选:traditional-deploy)
```

### 阶段4：预设方案

提供快速选择的预设方案（卡片式按钮）：

```markdown
📋 是否使用预设方案快速配置？

> ## [🅰️ 企业级管理系统](#预设:enterprise)
> 适用：后台管理、OA、ERP、CRM

> ## [🅱️ 电商系统](#预设:ecommerce)
> 适用：商城、交易平台

> ## [🤖 AI应用平台](#预设:ai)
> 适用：AI服务、RAG、Agent

> ## [🔧 微服务架构](#预设:microservice)
> 适用：大型分布式系统

> ## [✨ 自定义配置](#预设:custom)
> 继续手动选择每个模块
```

### 阶段5：确认与修改

在完成所有选择后，展示完整的技术栈清单：

```markdown
📋 技术选型完成！请确认以下配置：

**【项目基础】**
- 项目名称：my-shop
- 项目类型：模块化单体
- Java版本：JDK 17
- 构建工具：Maven

**【核心框架】**
- 应用框架：Spring Boot 3.x
- Web层：Spring WebMVC

**【数据层】**
- 数据库：MySQL 8.0
- ORM：MyBatis-Plus
- 连接池：Druid
- 缓存：Redis + Redisson

**【安全认证】**
- 认证框架：Sa-Token
- Token方式：JWT

**【其他】**
- API文档：Knife4j
- 工具库：Hutool, MapStruct, Lombok
- ...

---

**是否需要修改？**

[ ✅ 确认，继续生成 ](#操作:confirm)   [ ✏️ 修改某个模块 ](#操作:modify)   [ 🔄 重新开始 ](#操作:restart)
```

### 阶段6：输出生成

根据用户环境和选择，生成相应的输出：

```markdown
📁 请选择输出方式：

[ 📄 生成技术栈配置文件 (JSON) ](#输出:json)   [ 📦 生成Maven依赖片段 (XML) ](#输出:xml)   [ 📝 生成项目提示词 ](#输出:md)

[ 🎯 直接生成项目框架 (仅Cursor) ](#输出:project)   [ ✨ 全部生成 ](#输出:all)
```

### 阶段7：完成提示

```markdown
✅ 生成完成！

**📁 生成的文件：**
1. `tech-stack-config.json` - 技术栈配置
2. `pom-fragment.xml` - Maven依赖片段
3. `project-prompt.md` - 项目提示词
4. `my-shop/` - 项目框架目录（如适用）

**💡 使用说明：**
- 在Cursor中：直接打开项目开始开发
- 在其他IDE中：将 `project-prompt.md` 丢给AI助手，让它帮你完成项目初始化

**🔗 相关资源：**
- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
- [MyBatis-Plus官方文档](https://baomidou.com/)
- [Sa-Token官方文档](https://sa-token.cc/)

祝你开发愉快！
```

---

## 预设方案

### 预设A：企业级管理系统

**适用场景**：后台管理、OA、ERP、CRM、MIS

```json
{
  "name": "enterprise-admin",
  "displayName": "企业级管理系统",
  "description": "适用于后台管理、OA、ERP、CRM等企业级应用",
  "config": {
    "project": {
      "type": "modular-monolith",
      "javaVersion": "17",
      "buildTool": "maven"
    },
    "core": {
      "framework": "spring-boot-3",
      "web": "webmvc",
      "microservice": null
    },
    "database": {
      "rdbms": "mysql",
      "rdbmsVersion": "8.0",
      "orm": "mybatis-plus",
      "pool": "druid"
    },
    "cache": {
      "redisClient": "redisson",
      "framework": "jetcache",
      "strategy": "local-and-remote"
    },
    "security": {
      "framework": "sa-token",
      "tokenType": "jwt"
    },
    "workflow": "flowable",
    "scheduler": "xxl-job",
    "api": {
      "documentation": "knife4j"
    },
    "tools": {
      "utility": ["hutool"],
      "json": "jackson",
      "objectMapping": "mapstruct",
      "lombok": true,
      "excel": "easyexcel",
      "objectStorage": "minio"
    },
    "monitoring": {
      "tracing": "skywalking",
      "logging": "elk",
      "admin": "spring-boot-admin"
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "docker-compose"
    }
  },
  "versions": {
    "spring-boot": "3.2.5",
    "mybatis-plus": "3.5.7",
    "sa-token": "1.38.0",
    "druid": "1.2.21",
    "redisson": "3.27.0",
    "knife4j": "4.4.0",
    "hutool": "5.8.26",
    "mapstruct": "1.5.5.Final",
    "lombok": "1.18.30",
    "easyexcel": "3.3.4",
    "flowable": "6.8.0",
    "xxl-job": "2.4.0"
  }
}
```

### 预设B：电商系统

**适用场景**：商城、交易平台、O2O

```json
{
  "name": "e-commerce",
  "displayName": "电商系统",
  "description": "适用于商城、交易平台等电商业务",
  "config": {
    "project": {
      "type": "modular-monolith",
      "javaVersion": "17",
      "buildTool": "maven"
    },
    "core": {
      "framework": "spring-boot-3",
      "web": "webmvc",
      "microservice": null
    },
    "database": {
      "rdbms": "mysql",
      "rdbmsVersion": "8.0",
      "orm": "mybatis",
      "pool": "druid",
      "nosql": ["redis", "mongodb", "elasticsearch"]
    },
    "cache": {
      "redisClient": "redisson",
      "framework": null,
      "strategy": "remote-only"
    },
    "messaging": "rabbitmq",
    "security": {
      "framework": "spring-security",
      "tokenType": "jwt"
    },
    "api": {
      "documentation": "swagger"
    },
    "tools": {
      "utility": ["hutool"],
      "json": "jackson",
      "objectMapping": "mapstruct",
      "lombok": true,
      "excel": "easyexcel",
      "objectStorage": "minio"
    },
    "monitoring": {
      "tracing": "skywalking",
      "logging": "elk",
      "admin": null
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "docker-compose"
    }
  },
  "versions": {
    "spring-boot": "3.2.5",
    "mybatis": "3.0.3",
    "spring-security": "6.2.4",
    "druid": "1.2.21",
    "redisson": "3.27.0",
    "knife4j": "4.4.0",
    "hutool": "5.8.26",
    "mapstruct": "1.5.5.Final",
    "lombok": "1.18.30",
    "easyexcel": "3.3.4",
    "rabbitmq": "3.12.14"
  }
}
```

### 预设C：AI应用平台

**适用场景**：AI服务、RAG、Agent、大模型应用

```json
{
  "name": "ai-application",
  "displayName": "AI应用平台",
  "description": "适用于AI服务、RAG、Agent等AI应用场景",
  "config": {
    "project": {
      "type": "monolith",
      "javaVersion": "21",
      "buildTool": "maven"
    },
    "core": {
      "framework": "spring-boot-3",
      "web": "webmvc",
      "ai": "spring-ai"
    },
    "database": {
      "rdbms": "mysql",
      "rdbmsVersion": "8.0",
      "orm": "mybatis-plus",
      "pool": "hikari",
      "nosql": ["redis", "milvus"]
    },
    "cache": {
      "redisClient": "redisson",
      "framework": null,
      "strategy": "remote-only"
    },
    "ai": {
      "framework": "spring-ai",
      "llm": "dashscope",
      "vectorDb": "milvus",
      "scenarios": ["rag", "agent", "chat"]
    },
    "security": {
      "framework": "sa-token",
      "tokenType": "jwt"
    },
    "api": {
      "documentation": "knife4j"
    },
    "tools": {
      "utility": ["hutool"],
      "json": "jackson",
      "objectMapping": "mapstruct",
      "lombok": true,
      "excel": "easyexcel",
      "objectStorage": "minio"
    },
    "monitoring": {
      "tracing": "skywalking",
      "logging": "elk",
      "admin": null
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "docker-compose"
    }
  },
  "versions": {
    "spring-boot": "3.2.5",
    "spring-ai": "1.0.0",
    "mybatis-plus": "3.5.7",
    "sa-token": "1.38.0",
    "hikari": "5.1.0",
    "knife4j": "4.4.0",
    "hutool": "5.8.26",
    "mapstruct": "1.5.5.Final",
    "lombok": "1.18.30",
    "easyexcel": "3.3.4"
  }
}
```

### 预设D：微服务架构

**适用场景**：大型分布式系统、高并发场景

```json
{
  "name": "microservice",
  "displayName": "微服务架构",
  "description": "适用于大型分布式系统、高并发场景",
  "config": {
    "project": {
      "type": "microservice",
      "javaVersion": "17",
      "buildTool": "maven"
    },
    "core": {
      "framework": "spring-boot-3",
      "web": "webmvc",
      "microservice": "spring-cloud-alibaba"
    },
    "database": {
      "rdbms": "mysql",
      "rdbmsVersion": "8.0",
      "orm": "mybatis-plus",
      "pool": "druid",
      "sharding": "shardingsphere"
    },
    "cache": {
      "redisClient": "redisson",
      "framework": null,
      "strategy": "remote-only"
    },
    "messaging": "rocketmq",
    "microservice": {
      "registry": "nacos",
      "gateway": "spring-cloud-gateway",
      "rpc": "openfeign",
      "circuitBreaker": "sentinel",
      "distributedTransaction": "seata"
    },
    "security": {
      "framework": "spring-security",
      "tokenType": "jwt"
    },
    "api": {
      "documentation": "knife4j"
    },
    "tools": {
      "utility": ["hutool"],
      "json": "jackson",
      "objectMapping": "mapstruct",
      "lombok": true,
      "excel": "easyexcel",
      "objectStorage": "minio"
    },
    "monitoring": {
      "tracing": "skywalking",
      "logging": "elk",
      "admin": "spring-boot-admin"
    },
    "deployment": {
      "containerization": "kubernetes",
      "orchestration": "helm"
    }
  },
  "versions": {
    "spring-boot": "3.2.5",
    "spring-cloud-alibaba": "2023.0.1.2",
    "spring-cloud": "2023.0.1",
    "nacos": "2.3.2",
    "sentinel": "1.8.8",
    "seata": "2.0.0",
    "mybatis-plus": "3.5.7",
    "spring-security": "6.2.4",
    "druid": "1.2.21",
    "redisson": "3.27.0",
    "knife4j": "4.4.0",
    "hutool": "5.8.26",
    "mapstruct": "1.5.5.Final",
    "lombok": "1.18.30",
    "easyexcel": "3.3.4",
    "rocketmq": "5.1.4"
  }
}
```

---

## 输出模板

### 技术栈配置文件（tech-stack-config.json）

```json
{
  "project": {
    "name": "my-shop",
    "type": "modular-monolith",
    "javaVersion": "17",
    "buildTool": "maven"
  },
  "core": {
    "framework": "spring-boot-3",
    "web": "spring-webmvc",
    "microservice": null
  },
  "database": {
    "rdbms": "mysql",
    "orm": "mybatis-plus",
    "pool": "druid",
    "nosql": ["redis", "elasticsearch"]
  },
  "cache": {
    "framework": "jetcache",
    "redisClient": "redisson",
    "strategy": "local-and-remote"
  },
  "messaging": {
    "middleware": "rocketmq",
    "scenarios": ["async-decouple", "event-driven"]
  },
  "security": {
    "framework": "sa-token",
    "tokenType": "jwt",
    "permissionModel": "rbac"
  },
  "api": {
    "style": "restful",
    "documentation": "knife4j",
    "httpClient": "okhttp3"
  },
  "tools": {
    "utility": ["hutool"],
    "json": "jackson",
    "objectMapping": "mapstruct",
    "excel": "easyexcel",
    "objectStorage": "minio"
  },
  "monitoring": {
    "tracing": "skywalking",
    "logging": "elk",
    "metrics": "prometheus"
  },
  "deployment": {
    "containerization": "docker",
    "orchestration": "docker-compose"
  }
}
```

### Maven依赖片段（pom-fragment.xml）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>my-shop</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>17</java.version>
        <mybatis-plus.version>3.5.7</mybatis-plus.version>
        <sa-token.version>1.38.0</sa-token.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- MyBatis-Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>

        <!-- Druid连接池 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-3-starter</artifactId>
            <version>1.2.21</version>
        </dependency>

        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- Redisson -->
        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson-spring-boot-starter</artifactId>
            <version>3.27.0</version>
        </dependency>

        <!-- Sa-Token -->
        <dependency>
            <groupId>cn.dev33</groupId>
            <artifactId>sa-token-spring-boot3-starter</artifactId>
            <version>${sa-token.version}</version>
        </dependency>

        <!-- Knife4j -->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
            <version>4.4.0</version>
        </dependency>

        <!-- Hutool -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.8.26</version>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 项目提示词（project-prompt.md）

```markdown
# Java后端项目初始化提示词

## 项目概述

请帮我创建一个Java后端项目，技术栈如下：

### 基础配置
- 项目名称：my-shop
- 项目类型：模块化单体
- Java版本：JDK 17
- 构建工具：Maven

### 核心框架
- 应用框架：Spring Boot 3.2.5
- Web层：Spring WebMVC

### 数据层
- 数据库：MySQL 8.0
- ORM：MyBatis-Plus 3.5.7
- 连接池：Druid 1.2.21
- 缓存：Redis + Redisson 3.27.0
- 缓存框架：JetCache

### 安全认证
- 认证框架：Sa-Token 1.38.0
- Token方式：JWT
- 权限模型：RBAC

### API文档
- 文档工具：Knife4j 4.4.0

### 工具库
- 通用工具：Hutool 5.8.26
- 对象映射：MapStruct 1.5.5
- 代码简化：Lombok
- Excel处理：EasyExcel 3.3.4

### 监控
- 链路追踪：SkyWalking
- 日志：ELK

### 部署
- 容器化：Docker
- 编排：Docker Compose

## 要求

### 项目结构
请创建标准的Maven多模块项目，结构如下：

```
my-shop/
├── my-shop-common/          # 公共模块（工具类、常量、异常）
├── my-shop-model/           # 实体模块（DTO、VO、Entity）
├── my-shop-service/         # 服务模块（业务逻辑）
├── my-shop-web/             # Web模块（Controller、配置）
├── sql/                     # SQL脚本
├── docker/                  # Docker配置
└── pom.xml                  # 父POM
```

### 代码规范
1. 遵循阿里巴巴Java开发手册
2. 使用Lombok简化代码
3. 使用MapStruct进行对象转换
4. 统一异常处理和响应格式
5. 配置日志和链路追踪

### 功能示例
请实现一个基础的用户管理CRUD示例，包括：
1. 用户实体类（User）
2. 用户Mapper（MyBatis-Plus）
3. 用户Service（包含缓存）
4. 用户Controller（RESTful API）
5. 单元测试

### 配置文件
请配置好以下文件：
1. application.yml（多环境配置）
2. application-dev.yml
3. application-prod.yml
4. logback-spring.xml

### 其他
1. 配置跨域
2. 配置全局异常处理
3. 配置Swagger/API文档
4. 配置Sa-Token认证
5. 编写README.md
```

---

## 技术栈兼容性说明

### JDK版本兼容性

| 组件 | JDK 8 | JDK 17 | JDK 21 |
|------|-------|--------|--------|
| Spring Boot 2.7 | ✅ | ✅ | ⚠️ |
| Spring Boot 3.x | ❌ | ✅ | ✅ |
| MyBatis-Plus 3.5.x | ✅ | ✅ | ✅ |
| Sa-Token 1.38.x | ✅ | ✅ | ✅ |
| Knife4j 4.x | ❌ | ✅ | ✅ |

### 框架兼容性

| 组件 | Spring Boot 2.7 | Spring Boot 3.x |
|------|-----------------|-----------------|
| Spring Security | ✅ | ✅ |
| Sa-Token | ✅ | ✅ |
| MyBatis-Plus | ✅ | ✅ |
| Knife4j | ✅ | ✅ |

### 常见组合推荐

#### 组合1：Spring Boot 3 + MyBatis-Plus + Sa-Token
- 适合：大多数Web应用
- 优点：简单易用，功能全面

#### 组合2：Spring Boot 3 + JPA + Spring Security
- 适合：复杂业务系统
- 优点：面向对象，安全功能强大

#### 组合3：Spring Cloud Alibaba全家桶
- 适合：微服务架构
- 优点：生态完整，文档丰富

### 注意事项

1. Spring Boot 3.x需要JDK 17+
2. 使用Jakarta EE命名空间（jakarta.*）替代Java EE（javax.*）
3. 部分组件可能需要特定版本才能兼容
