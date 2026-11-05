"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vscode/src/core/data.ts
var data_exports = {};
__export(data_exports, {
  DEFAULT_CONFIG: () => DEFAULT_CONFIG,
  OPTIONS: () => OPTIONS,
  PRESETS: () => PRESETS,
  VERSION_MAP: () => VERSION_MAP
});
module.exports = __toCommonJS(data_exports);

// packages/core/src/core/data.ts
var DEFAULT_CONFIG = {
  schemaVersion: 1,
  outputMode: "project",
  project: { name: "my-project", type: "monolith", javaVersion: "17", buildTool: "maven", modules: ["user", "order"] },
  core: { framework: "spring-boot-3", web: "webmvc" },
  database: { rdbms: "mysql-8", orm: "jpa", pool: "hikari", nosql: [] },
  cache: { type: "none" },
  security: { framework: "spring-security" },
  api: { documentation: "none" },
  messaging: "none",
  workflow: "none",
  scheduler: "none"
};
function preset(id, name, description, icon, defaults) {
  const config = {
    ...DEFAULT_CONFIG,
    ...defaults,
    project: { ...DEFAULT_CONFIG.project, ...defaults.project },
    core: { ...DEFAULT_CONFIG.core, ...defaults.core },
    database: { ...DEFAULT_CONFIG.database, ...defaults.database },
    cache: { ...DEFAULT_CONFIG.cache, ...defaults.cache },
    security: { ...DEFAULT_CONFIG.security, ...defaults.security },
    api: { ...DEFAULT_CONFIG.api, ...defaults.api },
    presetId: id
  };
  return { id, name, description, icon, config };
}
var PRESETS = [
  preset("enterprise-admin", "\u4F01\u4E1A\u7EA7\u7BA1\u7406\u7CFB\u7EDF", "\u540E\u53F0\u7BA1\u7406\u3001OA\u3001ERP\u3001CRM \u7684\u793A\u4F8B\u9ED8\u8BA4\u503C", "\u{1F170}\uFE0F", {
    project: { name: "my-admin", type: "modular-monolith", javaVersion: "17", buildTool: "maven", modules: ["user", "audit"] },
    database: { rdbms: "mysql-8", orm: "mybatis-plus", pool: "hikari", nosql: [] },
    api: { documentation: "knife4j" }
  }),
  preset("e-commerce", "\u7535\u5546\u7CFB\u7EDF", "\u5546\u57CE\u4E0E\u4EA4\u6613\u573A\u666F\u7684\u793A\u4F8B\u9ED8\u8BA4\u503C", "\u{1F171}\uFE0F", {
    project: { name: "my-shop", type: "modular-monolith", javaVersion: "17", buildTool: "maven", modules: ["catalog", "order"] },
    database: { rdbms: "postgresql", orm: "jpa", pool: "hikari", nosql: [] }
  }),
  preset("ai-application", "AI \u5E94\u7528\u5E73\u53F0", "AI \u670D\u52A1\u573A\u666F\u7684\u57FA\u7840 Java \u5DE5\u7A0B\uFF1BRAG/Agent \u7EC4\u4EF6\u5F85\u652F\u6301", "\u{1F916}", {
    project: { name: "my-ai-app", type: "monolith", javaVersion: "17", buildTool: "maven", modules: ["model", "task"] }
  })
];
var OPTIONS = {
  projectType: [
    { label: "\u5355\u4F53\u5E94\u7528", value: "monolith", description: "\u4E00\u4E2A\u53EF\u6267\u884C\u5E94\u7528" },
    { label: "\u6A21\u5757\u5316\u5355\u4F53", value: "modular-monolith", description: "\u591A\u4E2A\u4E1A\u52A1\u6A21\u5757\uFF0C\u4E00\u4E2A\u542F\u52A8\u5E94\u7528" },
    { label: "\u5FAE\u670D\u52A1", value: "microservice", description: "\u72EC\u7ACB\u670D\u52A1\uFF0C\u53EF\u9009\u7F51\u5173" },
    { label: "\u5355\u4F53/\u5FAE\u670D\u52A1\u53EF\u5207\u6362\uFF08\u5F85\u5B9E\u73B0\uFF09", value: "__unsupported__", description: "\u5F53\u524D\u7248\u672C\u4E0D\u53EF\u9009\u62E9" }
  ],
  javaVersion: [{ label: "JDK 17", value: "17", description: "\u5F53\u524D\u5DE5\u7A0B\u7684 Java \u7F16\u8BD1\u76EE\u6807" }],
  buildTool: [
    { label: "Maven", value: "maven", description: "\u5F53\u524D\u53EF\u751F\u6210" },
    { label: "Gradle\uFF08\u5F85\u5B9E\u73B0\uFF09", value: "__unsupported__", description: "\u5F53\u524D\u7248\u672C\u4E0D\u53EF\u9009\u62E9" }
  ],
  framework: [{ label: "Spring Boot 3", value: "spring-boot-3" }],
  database: [
    { label: "MySQL 8", value: "mysql-8" },
    { label: "PostgreSQL", value: "postgresql" }
  ],
  orm: [
    { label: "MyBatis-Plus", value: "mybatis-plus" },
    { label: "JPA / Hibernate", value: "jpa" }
  ],
  pool: [{ label: "HikariCP", value: "hikari" }],
  cache: [
    { label: "\u65E0\u7F13\u5B58", value: "none" },
    { label: "Redis + Redisson", value: "redisson" }
  ],
  security: [
    { label: "Spring Security", value: "spring-security" },
    { label: "Sa-Token", value: "sa-token" }
  ],
  apiDoc: [
    { label: "\u65E0", value: "none" },
    { label: "Knife4j", value: "knife4j" }
  ],
  messaging: [{ label: "\u65E0\uFF08\u5176\u4ED6\u7EC4\u4EF6\u5F85\u5B9E\u73B0\uFF09", value: "none" }],
  workflow: [{ label: "\u65E0\uFF08\u5176\u4ED6\u7EC4\u4EF6\u5F85\u5B9E\u73B0\uFF09", value: "none" }],
  scheduler: [{ label: "\u65E0\uFF08\u5176\u4ED6\u7EC4\u4EF6\u5F85\u5B9E\u73B0\uFF09", value: "none" }]
};
var VERSION_MAP = {
  "spring-boot-2": "2.7.18",
  "spring-boot-3": "3.2.5",
  "mybatis-plus": "3.5.7",
  "mybatis": "3.0.3",
  "druid": "1.2.21",
  "hikari": "5.1.0",
  "redisson": "3.27.0",
  "sa-token": "1.38.0",
  "knife4j": "4.4.0",
  "springdoc": "2.3.0"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_CONFIG,
  OPTIONS,
  PRESETS,
  VERSION_MAP
});
