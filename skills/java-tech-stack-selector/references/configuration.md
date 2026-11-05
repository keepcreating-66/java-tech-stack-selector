# 配置与执行协议

完整示例见 examples/ 下三份 JSON；字段采用 schemaVersion 1，与既有 1.1.0 配置兼容。

必要对象为 project(name,type,javaVersion,buildTool,modules)、core(framework,web)、database(rdbms,orm,pool,nosql)、cache(type)、security(framework)、api(documentation)。可选 presetId/outputMode/messaging/workflow/scheduler。

数据库 mysql-8/postgresql，ORM jpa/mybatis-plus，缓存 none/redisson，认证 spring-security/sa-token，文档 none/knife4j。固定 javaVersion=17，buildTool=maven，framework=spring-boot-3，web=webmvc，pool=hikari。nosql 默认 []，使用 Redis 时为 ["redis"]。微服务必须有 microservice: {gateway: true或false}，其余架构不能携带该字段。

脚本命令：capabilities、preset <id>、validate --config <文件或->、plan --config <文件或->、generate --config <文件或-> --output-root <已有父目录>、--help、--version。

stdout 单行 JSON 包含 ok/command/generatorVersion/schemaVersion。失败 error 包含 code/message；退出码 2 参数、3 配置、4 路径、5 IO/内部错误。失败时不要循环重试，先解释并解决原因。

plan 返回规范化 config、相对文件清单和 fileCount。generate 再次校验并返回 projectDir，build/runtime 均为 not_run。生成器不联网、不构建、不运行外部命令。配置预设只作为默认候选。
