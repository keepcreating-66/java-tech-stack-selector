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

// vscode/src/generation/maven.ts
var maven_exports = {};
__export(maven_exports, {
  gatewayDependencies: () => gatewayDependencies,
  moduleDependency: () => moduleDependency,
  ormDependencies: () => ormDependencies,
  pom: () => pom,
  runtimeDependencies: () => runtimeDependencies
});
module.exports = __toCommonJS(maven_exports);

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

// packages/core/src/generation/maven.ts
var dep = (group, artifact, version, scope) => ({ group, artifact, version, scope });
var boot = (artifact, scope) => dep("org.springframework.boot", artifact, void 0, scope);
function ormDependencies(config) {
  return config.database.orm === "jpa" ? [boot("spring-boot-starter-data-jpa")] : [dep("com.baomidou", "mybatis-plus-spring-boot3-starter", VERSION_MAP["mybatis-plus"])];
}
function runtimeDependencies(config) {
  const deps = [
    boot("spring-boot-starter-web"),
    boot("spring-boot-starter-actuator"),
    ...ormDependencies(config),
    config.database.rdbms === "postgresql" ? dep("org.postgresql", "postgresql", void 0, "runtime") : dep("com.mysql", "mysql-connector-j", void 0, "runtime"),
    boot("spring-boot-starter-test", "test"),
    dep("com.h2database", "h2", void 0, "test")
  ];
  if (config.cache.type === "redisson") {
    deps.push(boot("spring-boot-starter-data-redis"));
    deps.push(dep("org.redisson", "redisson-spring-boot-starter", VERSION_MAP["redisson"]));
  }
  if (config.security.framework === "spring-security") {
    deps.push(boot("spring-boot-starter-security"));
  } else {
    deps.push(dep("cn.dev33", "sa-token-spring-boot3-starter", VERSION_MAP["sa-token"]));
  }
  if (config.api.documentation === "knife4j") {
    deps.push(dep("com.github.xiaoymin", "knife4j-openapi3-jakarta-spring-boot-starter", VERSION_MAP["knife4j"]));
  }
  return deps;
}
function pom(options) {
  const { projectName, artifactId, packaging = "jar", dependencies = [] } = options;
  const parent = options.child ? `<parent><groupId>com.example</groupId><artifactId>${projectName}</artifactId><version>1.0.0-SNAPSHOT</version><relativePath>../pom.xml</relativePath></parent>` : `<parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>${VERSION_MAP["spring-boot-3"]}</version><relativePath/></parent>`;
  const modules = options.modules?.length ? `<modules>${options.modules.map((m) => `<module>${m}</module>`).join("")}</modules>` : "";
  const unique = /* @__PURE__ */ new Map();
  for (const item of dependencies) {
    unique.set(`${item.group}:${item.artifact}`, item);
  }
  const deps = [...unique.values()].map((item) => `<dependency><groupId>${item.group}</groupId><artifactId>${item.artifact}</artifactId>${item.version ? `<version>${item.version}</version>` : ""}${item.scope ? `<scope>${item.scope}</scope>` : ""}</dependency>`).join("\n    ");
  const cloud = options.cloud ? `<dependencyManagement><dependencies><dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-dependencies</artifactId><version>2023.0.0</version><type>pom</type><scope>import</scope></dependency></dependencies></dependencyManagement>` : "";
  const plugin = options.executable ? `<build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>` : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  ${parent}
  <groupId>com.example</groupId><artifactId>${artifactId}</artifactId><version>1.0.0-SNAPSHOT</version>
  <packaging>${packaging}</packaging>
  <properties><java.version>17</java.version></properties>
  ${modules}
  ${cloud}
  <dependencies>
    ${deps}
  </dependencies>
  ${plugin}
</project>
`;
}
function moduleDependency(projectName, module2) {
  return dep("com.example", `${projectName}-${module2}`, "1.0.0-SNAPSHOT");
}
var gatewayDependencies = [dep("org.springframework.cloud", "spring-cloud-starter-gateway"), boot("spring-boot-starter-actuator"), boot("spring-boot-starter-test", "test")];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  gatewayDependencies,
  moduleDependency,
  ormDependencies,
  pom,
  runtimeDependencies
});
