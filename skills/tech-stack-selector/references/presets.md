# 预设方案详细配置

## 预设A：企业级管理系统

**适用场景**：后台管理、OA、ERP、CRM、MIS

### 完整配置

```json
{
  "name": "enterprise-admin",
  "displayName": "企业级管理系统",
  "description": "适用于后台管理、OA、ERP、CRM等企业级应用",
  "tags": ["admin", "erp", "oa", "crm"],
  "config": {
    "project": {
      "type": "modular-monolith",
      "javaVersion": "17",
      "buildTool": "maven",
      "multiModule": true
    },
    "core": {
      "framework": "spring-boot-3",
      "version": "3.2.5",
      "web": "spring-webmvc",
      "microservice": "spring-cloud-alibaba"
    },
    "database": {
      "rdbms": "mysql",
      "version": "8.0",
      "orm": "mybatis-plus",
      "ormVersion": "3.5.7",
      "pool": "druid",
      "poolVersion": "1.2.21"
    },
    "cache": {
      "enabled": true,
      "redisClient": "redisson",
      "redisVersion": "3.27.0",
      "framework": "jetcache",
      "strategy": "local-and-remote"
    },
    "security": {
      "framework": "sa-token",
      "version": "1.38.0",
      "tokenType": "jwt",
      "permissionModel": "rbac"
    },
    "workflow": {
      "enabled": true,
      "engine": "flowable",
      "version": "6.8.0"
    },
    "scheduler": {
      "enabled": true,
      "framework": "xxl-job",
      "version": "2.4.0"
    },
    "api": {
      "documentation": "knife4j",
      "version": "4.4.0"
    },
    "monitoring": {
      "tracing": "skywalking",
      "tracingVersion": "9.1.0",
      "admin": "spring-boot-admin",
      "adminVersion": "3.2.0"
    },
    "tools": {
      "utility": ["hutool"],
      "hutoolVersion": "5.8.26",
      "objectMapping": "mapstruct",
      "mapstructVersion": "1.5.5.Final",
      "excel": "easyexcel",
      "easyexcelVersion": "3.3.4",
      "lombok": true
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "docker-compose"
    }
  },
  "recommendedModules": [
    "workflow",
    "scheduler",
    "monitoring"
  ]
}
```

### 典型依赖

```xml
<!-- Spring Boot 3.2.5 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
</dependency>

<!-- MyBatis-Plus 3.5.7 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.7</version>
</dependency>

<!-- Sa-Token 1.38.0 -->
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-spring-boot3-starter</artifactId>
    <version>1.38.0</version>
</dependency>

<!-- Flowable 6.8.0 -->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter</artifactId>
    <version>6.8.0</version>
</dependency>

<!-- XXL-Job 2.4.0 -->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-spring-boot-starter</artifactId>
    <version>2.4.0</version>
</dependency>
```

---

## 预设B：电商系统

**适用场景**：商城、交易平台、O2O

### 完整配置

```json
{
  "name": "e-commerce",
  "displayName": "电商系统",
  "description": "适用于商城、交易平台等电商业务",
  "tags": ["ecommerce", "mall", "trading"],
  "config": {
    "project": {
      "type": "modular-monolith",
      "javaVersion": "17",
      "buildTool": "maven",
      "multiModule": true
    },
    "core": {
      "framework": "spring-boot-3",
      "version": "3.2.5",
      "web": "spring-webmvc"
    },
    "database": {
      "rdbms": "mysql",
      "version": "8.0",
      "orm": "mybatis",
      "ormVersion": "3.0.4",
      "pool": "druid",
      "poolVersion": "1.2.21",
      "nosql": ["redis", "mongodb", "elasticsearch"]
    },
    "cache": {
      "enabled": true,
      "redisClient": "redisson",
      "redisVersion": "3.27.0"
    },
    "messaging": {
      "enabled": true,
      "middleware": "rabbitmq",
      "version": "3.12.8"
    },
    "search": {
      "enabled": true,
      "engine": "elasticsearch",
      "version": "8.11.0"
    },
    "security": {
      "framework": "spring-security",
      "tokenType": "jwt"
    },
    "api": {
      "documentation": "swagger",
      "version": "2.2.20"
    },
    "tools": {
      "utility": ["hutool"],
      "objectMapping": "mapstruct",
      "excel": "easyexcel",
      "lombok": true
    },
    "monitoring": {
      "logging": "elk"
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "docker-compose"
    }
  },
  "recommendedModules": [
    "messaging",
    "search",
    "monitoring"
  ]
}
```

### 典型依赖

```xml
<!-- RabbitMQ -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>

<!-- Elasticsearch -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>

<!-- MongoDB -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

## 预设C：AI应用平台

**适用场景**：AI服务、RAG、Agent、大模型应用

### 完整配置

```json
{
  "name": "ai-application",
  "displayName": "AI应用平台",
  "description": "适用于AI服务、RAG、Agent等AI应用场景",
  "tags": ["ai", "llm", "rag", "agent"],
  "config": {
    "project": {
      "type": "monolith",
      "javaVersion": "21",
      "buildTool": "maven"
    },
    "core": {
      "framework": "spring-boot-3",
      "version": "3.2.5",
      "ai": "spring-ai",
      "aiVersion": "1.0.0"
    },
    "database": {
      "rdbms": "mysql",
      "version": "8.0",
      "orm": "mybatis-plus",
      "ormVersion": "3.5.7",
      "pool": "hikari",
      "nosql": ["redis", "milvus"]
    },
    "cache": {
      "enabled": true,
      "redisClient": "lettuce"
    },
    "ai": {
      "framework": "spring-ai",
      "llm": "dashscope",
      "vectorDb": "milvus",
      "vectorDbVersion": "2.4.0",
      "scenarios": ["rag", "agent", "chat"]
    },
    "security": {
      "framework": "sa-token",
      "tokenType": "jwt"
    },
    "api": {
      "documentation": "knife4j",
      "version": "4.4.0"
    },
    "tools": {
      "utility": ["hutool"],
      "lombok": true
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "docker-compose"
    }
  },
  "recommendedModules": [
    "ai",
    "vector"
  ]
}
```

### 典型依赖

```xml
<!-- Spring AI -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-dashscope</artifactId>
    <version>1.0.0</version>
</dependency>

<!-- Milvus -->
<dependency>
    <groupId>io.milvus</groupId>
    <artifactId>milvus-sdk-java</artifactId>
    <version>2.4.0</version>
</dependency>
```

---

## 预设D：微服务架构

**适用场景**：大型分布式系统、高并发场景

### 完整配置

```json
{
  "name": "microservice",
  "displayName": "微服务架构",
  "description": "适用于大型分布式系统、高并发场景",
  "tags": ["microservice", "distributed", "high-concurrency"],
  "config": {
    "project": {
      "type": "microservice",
      "javaVersion": "17",
      "buildTool": "maven",
      "multiModule": true
    },
    "core": {
      "framework": "spring-boot-3",
      "version": "3.2.5",
      "web": "spring-webmvc",
      "microservice": "spring-cloud-alibaba",
      "scaVersion": "2023.0.1.2"
    },
    "database": {
      "rdbms": "mysql",
      "version": "8.0",
      "orm": "mybatis-plus",
      "ormVersion": "3.5.7",
      "pool": "druid",
      "poolVersion": "1.2.21",
      "sharding": "shardingsphere",
      "shardingVersion": "5.5.0"
    },
    "cache": {
      "enabled": true,
      "redisClient": "redisson",
      "redisVersion": "3.27.0"
    },
    "messaging": {
      "enabled": true,
      "middleware": "rocketmq",
      "version": "5.1.4"
    },
    "microservice": {
      "registry": "nacos",
      "registryVersion": "2.3.0",
      "gateway": "spring-cloud-gateway",
      "gatewayVersion": "4.1.3",
      "rpc": "openfeign",
      "rpcVersion": "2023.0.5",
      "circuitBreaker": "sentinel",
      "circuitBreakerVersion": "1.8.6",
      "distributedTransaction": "seata",
      "distributedTransactionVersion": "1.8.0"
    },
    "security": {
      "framework": "spring-security",
      "tokenType": "jwt"
    },
    "tools": {
      "utility": ["hutool"],
      "objectMapping": "mapstruct",
      "lombok": true
    },
    "monitoring": {
      "tracing": "skywalking",
      "tracingVersion": "9.1.0",
      "admin": "spring-boot-admin",
      "adminVersion": "3.2.0"
    },
    "deployment": {
      "containerization": "docker",
      "orchestration": "kubernetes"
    }
  },
  "recommendedModules": [
    "microservice",
    "messaging",
    "monitoring"
  ]
}
```

### 典型依赖

```xml
<!-- Spring Cloud Alibaba -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2023.0.1.2</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>

<!-- Nacos -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>

<!-- Sentinel -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<!-- Seata -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>

<!-- ShardingSphere -->
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-jdbc-core-spring-boot-starter</artifactId>
    <version>5.5.0</version>
</dependency>
```
