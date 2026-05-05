# ${PROJECT_NAME}

## 项目概述

请帮我创建一个Java后端项目，技术栈如下：

### 基础配置
- 项目名称：${PROJECT_NAME}
- 项目类型：${PROJECT_TYPE}
- Java版本：JDK ${JAVA_VERSION}
- 构建工具：${BUILD_TOOL}

### 核心框架
- 应用框架：Spring Boot ${SPRING_BOOT_VERSION}
- Web层：Spring WebMVC
${MICROSERVICE_INFO}

### 数据层
- 数据库：${RDBMS} ${RDBMS_VERSION}
- ORM：${ORM} ${ORM_VERSION}
- 连接池：${POOL} ${POOL_VERSION}
${CACHE_INFO}
${MESSAGING_INFO}
${SEARCH_INFO}

### 安全认证
- 认证框架：${SECURITY_FRAMEWORK}
- Token方式：${TOKEN_TYPE}
- 权限模型：${PERMISSION_MODEL}

### API文档
- 文档工具：${API_DOC}

### 工具库
${TOOLS_INFO}

### 其他组件
${OTHER_COMPONENTS}

### 监控
${MONITORING_INFO}

### 部署
- 容器化：${CONTAINER}
- 编排：${ORCHESTRATION}

---

## 要求

### 项目结构
请创建标准的${BUILD_TOOL}多模块项目，结构如下：

```
${PROJECT_NAME}/
${MODULE_STRUCTURE}
├── sql/                     # SQL脚本
├── docker/                  # Docker配置
├── config/                  # 配置文件
└── pom.xml                  # 父POM
```

### 代码规范
1. 遵循阿里巴巴Java开发手册
2. 使用Lombok简化代码
3. 使用MapStruct进行对象转换
4. 统一异常处理和响应格式
5. 配置日志和链路追踪
6. RESTful API设计规范

### 功能示例
请实现一个基础的用户管理CRUD示例，包括：
1. 用户实体类（User Entity）
2. 用户Mapper（MyBatis-Plus）
3. 用户Service（包含缓存）
4. 用户Controller（RESTful API）
5. 用户DTO/VO
6. 单元测试

### 配置文件
请配置好以下文件：
1. application.yml（主配置）
2. application-dev.yml（开发环境）
3. application-test.yml（测试环境）
4. application-prod.yml（生产环境）
5. logback-spring.xml（日志配置）

### 其他要求
1. 配置跨域
2. 配置全局异常处理
3. 配置API文档（如启用）
4. 配置认证授权（如启用）
5. 编写README.md
6. 包含.gitignore

---

## 技术栈详情

${TECH_STACK_DETAILS}

---

## 参考资料

- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
- [MyBatis-Plus官方文档](https://baomidou.com/)
${REFERENCE_LINKS}

---

*此提示词由 java-tech-stack-selector 生成*
