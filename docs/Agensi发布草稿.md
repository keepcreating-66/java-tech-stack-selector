# Agensi 发布材料草稿

名称：Java Tech Stack Selector

简介：通过对话确定 Java 后端架构与组件，校验配置并生成单体、模块化单体或微服务 Maven 示例。支持配置和提示词导出。

环境：Node.js 22+，构建需 JDK 17+ 与 Maven 3.9.x；运行需相应数据库及可选 Redis。需要终端执行、用户指定目录读写权限。生成器不联网；Maven 构建可能下载依赖。

分类候选：APIs & Backend、Developer Tools（以提交表单实际分类为准）。标签：Java、Spring Boot、Maven、Scaffold、Architecture。

范围：仅生成新工程，不覆盖已有工程；AI 预设不包含模型接入；不支持 Gradle、注册中心或消息队列。MIT 开源版本；拟免费首发，尚未上传。

演示材料使用解压包验证报告中的真实命令及结果。真实 Agent、跨系统、外部数据库与平台加载尚未通过，正式提交前需补齐对应结果并更新兼容说明。
