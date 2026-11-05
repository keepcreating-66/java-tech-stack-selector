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

// vscode/src/core/capabilities.ts
var capabilities_exports = {};
__export(capabilities_exports, {
  ARCHITECTURE_LABELS: () => ARCHITECTURE_LABELS,
  CAPABILITIES: () => CAPABILITIES,
  isSupported: () => isSupported
});
module.exports = __toCommonJS(capabilities_exports);

// packages/core/src/core/capabilities.ts
var CAPABILITIES = {
  architectures: ["monolith", "modular-monolith", "microservice"],
  javaVersions: ["17"],
  frameworks: ["spring-boot-3"],
  buildTools: ["maven"],
  databases: ["mysql-8", "postgresql"],
  orms: ["mybatis-plus", "jpa"],
  pools: ["hikari"],
  caches: ["none", "redisson"],
  security: ["spring-security", "sa-token"],
  apiDocs: ["none", "knife4j"],
  messaging: ["none"],
  workflow: ["none"],
  scheduler: ["none"]
};
var ARCHITECTURE_LABELS = {
  monolith: "\u5355\u4F53\u5E94\u7528",
  "modular-monolith": "\u6A21\u5757\u5316\u5355\u4F53",
  microservice: "\u5FAE\u670D\u52A1",
  switchable: "\u5355\u4F53/\u5FAE\u670D\u52A1\u53EF\u5207\u6362\uFF08\u5F85\u5B9E\u73B0\uFF09"
};
function isSupported(config) {
  const supports = (options, value) => options.includes(value);
  return supports(CAPABILITIES.architectures, config.project.type) && supports(CAPABILITIES.javaVersions, config.project.javaVersion) && supports(CAPABILITIES.frameworks, config.core.framework) && supports(CAPABILITIES.buildTools, config.project.buildTool) && supports(CAPABILITIES.databases, config.database.rdbms) && supports(CAPABILITIES.orms, config.database.orm) && supports(CAPABILITIES.pools, config.database.pool) && supports(CAPABILITIES.caches, config.cache.type) && supports(CAPABILITIES.security, config.security.framework) && supports(CAPABILITIES.apiDocs, config.api.documentation) && supports(CAPABILITIES.messaging, config.messaging || "none") && supports(CAPABILITIES.workflow, config.workflow || "none") && supports(CAPABILITIES.scheduler, config.scheduler || "none") && Array.isArray(config.database.nosql) && config.database.nosql.length <= 1 && config.database.nosql.every((value) => value === "redis" && config.cache.type === "redisson") && config.core.web === "webmvc";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ARCHITECTURE_LABELS,
  CAPABILITIES,
  isSupported
});
