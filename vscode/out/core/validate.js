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

// vscode/src/core/validate.ts
var validate_exports = {};
__export(validate_exports, {
  assertValidConfig: () => assertValidConfig,
  validateConfig: () => validateConfig,
  validateModules: () => validateModules,
  validateProjectName: () => validateProjectName
});
module.exports = __toCommonJS(validate_exports);

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
function isSupported(config) {
  const supports = (options, value) => options.includes(value);
  return supports(CAPABILITIES.architectures, config.project.type) && supports(CAPABILITIES.javaVersions, config.project.javaVersion) && supports(CAPABILITIES.frameworks, config.core.framework) && supports(CAPABILITIES.buildTools, config.project.buildTool) && supports(CAPABILITIES.databases, config.database.rdbms) && supports(CAPABILITIES.orms, config.database.orm) && supports(CAPABILITIES.pools, config.database.pool) && supports(CAPABILITIES.caches, config.cache.type) && supports(CAPABILITIES.security, config.security.framework) && supports(CAPABILITIES.apiDocs, config.api.documentation) && supports(CAPABILITIES.messaging, config.messaging || "none") && supports(CAPABILITIES.workflow, config.workflow || "none") && supports(CAPABILITIES.scheduler, config.scheduler || "none") && Array.isArray(config.database.nosql) && config.database.nosql.length <= 1 && config.database.nosql.every((value) => value === "redis" && config.cache.type === "redisson") && config.core.web === "webmvc";
}

// packages/core/src/core/schema.ts
function configShapeErrors(input) {
  const errors = [];
  const object = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
  if (!object(input)) {
    return ["\u914D\u7F6E\u5FC5\u987B\u662F JSON \u5BF9\u8C61"];
  }
  const fields = {
    project: ["name", "type", "javaVersion", "buildTool"],
    core: ["framework", "web"],
    database: ["rdbms", "orm", "pool"],
    cache: ["type"],
    security: ["framework"],
    api: ["documentation"]
  };
  const extras = { project: ["modules"], database: ["nosql"] };
  const top = [...Object.keys(fields), "schemaVersion", "presetId", "outputMode", "microservice", "messaging", "workflow", "scheduler"];
  for (const key of Object.keys(input)) {
    if (!top.includes(key)) {
      errors.push(`\u4E0D\u652F\u6301\u7684\u914D\u7F6E\u5B57\u6BB5\uFF1A${key}`);
    }
  }
  for (const [section, required] of Object.entries(fields)) {
    const value = input[section];
    if (!object(value)) {
      errors.push(`\u7F3A\u5C11\u914D\u7F6E\u5BF9\u8C61\uFF1A${section}`);
      continue;
    }
    for (const key of required) {
      if (typeof value[key] !== "string" || !value[key]) {
        errors.push(`\u914D\u7F6E\u5B57\u6BB5 ${section}.${key} \u5FC5\u987B\u662F\u975E\u7A7A\u5B57\u7B26\u4E32`);
      }
    }
    for (const key of Object.keys(value)) {
      if (![...required, ...extras[section] ?? []].includes(key)) {
        errors.push(`\u4E0D\u652F\u6301\u7684\u914D\u7F6E\u5B57\u6BB5\uFF1A${section}.${key}`);
      }
    }
  }
  if (object(input.project) && input.project.modules !== void 0 && (!Array.isArray(input.project.modules) || input.project.modules.some((value) => typeof value !== "string"))) {
    errors.push("project.modules \u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u6570\u7EC4");
  }
  if (object(input.database) && (!Array.isArray(input.database.nosql) || input.database.nosql.some((value) => typeof value !== "string"))) {
    errors.push("database.nosql \u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u6570\u7EC4");
  }
  for (const key of ["presetId", "outputMode", "messaging", "workflow", "scheduler"]) {
    if (input[key] !== void 0 && typeof input[key] !== "string") {
      errors.push(`${key} \u5FC5\u987B\u662F\u5B57\u7B26\u4E32`);
    }
  }
  if (input.microservice !== void 0) {
    if (!object(input.microservice) || typeof input.microservice.gateway !== "boolean") {
      errors.push("microservice.gateway \u5FC5\u987B\u662F\u5E03\u5C14\u503C");
    } else if (Object.keys(input.microservice).some((key) => key !== "gateway")) {
      errors.push("\u5FAE\u670D\u52A1\u5F53\u524D\u4EC5\u652F\u6301 gateway \u5B57\u6BB5");
    }
  }
  return errors;
}

// packages/core/src/core/validate.ts
var SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
var JAVA_RESERVED = new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null _".split(" "));
var validPackage = (value) => !JAVA_RESERVED.has(value.replaceAll("-", ""));
function validateProjectName(value) {
  if (!SLUG.test(value) || value.length > 50) {
    return "\u4F7F\u7528\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E2D\u95F4\u8FDE\u5B57\u7B26\uFF0C\u9996\u5C3E\u987B\u4E3A\u5B57\u6BCD\u6216\u6570\u5B57\uFF0C\u6700\u957F 50 \u5B57\u7B26";
  }
  if (!validPackage(value)) {
    return "\u540D\u79F0\u53BB\u9664\u8FDE\u5B57\u7B26\u540E\u4E0D\u80FD\u662F Java \u4FDD\u7559\u5B57";
  }
  return void 0;
}
function validateModules(value) {
  const modules = value.split(",").map((part) => part.trim());
  if (modules.length < 2 || modules.length > 20 || modules.some((part) => !SLUG.test(part)) || new Set(modules.map((part) => part.replaceAll("-", ""))).size !== modules.length) {
    return "\u8BF7\u8F93\u5165 2\u201320 \u4E2A\u6A21\u5757\u540D\uFF0C\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\uFF1B\u53BB\u9664\u8FDE\u5B57\u7B26\u540E\u4E5F\u4E0D\u80FD\u91CD\u590D\uFF0C\u5982 user,order";
  }
  if (modules.some((part) => part.length > 30 || part === "common" || part === "bootstrap" || part === "gateway")) {
    return "\u6A21\u5757\u540D\u6700\u957F 30 \u5B57\u7B26\uFF0C\u4E14\u4E0D\u80FD\u4F7F\u7528 common\u3001bootstrap\u3001gateway";
  }
  if (modules.some((part) => !validPackage(part))) {
    return "\u6A21\u5757\u540D\u53BB\u9664\u8FDE\u5B57\u7B26\u540E\u4E0D\u80FD\u662F Java \u4FDD\u7559\u5B57";
  }
  return void 0;
}
function validateConfig(config) {
  const errors = configShapeErrors(config);
  if (errors.length) {
    return errors;
  }
  const nameError = validateProjectName(config.project.name);
  if (nameError) {
    errors.push(`\u9879\u76EE\u540D\u79F0\uFF1A${nameError}`);
  }
  if (config.schemaVersion !== void 0 && config.schemaVersion !== 1) {
    errors.push("\u4E0D\u652F\u6301\u7684\u914D\u7F6E\u7248\u672C");
  }
  if (!isSupported(config)) {
    errors.push("\u6240\u9009 Java\u3001\u6784\u5EFA\u5DE5\u5177\u6216\u7EC4\u4EF6\u5C1A\u672A\u652F\u6301\u751F\u6210\uFF1B\u8BF7\u91CD\u65B0\u9009\u62E9");
  }
  const modules = config.project.modules || [];
  const moduleError = validateModules(modules.join(","));
  if (moduleError) {
    errors.push(`\u4E1A\u52A1\u6A21\u5757\uFF1A${moduleError}`);
  }
  if (config.project.type === "microservice" && !config.microservice) {
    errors.push("\u5FAE\u670D\u52A1\u914D\u7F6E\u7F3A\u5C11 gateway \u9009\u9879");
  }
  if (config.microservice && typeof config.microservice.gateway !== "boolean") {
    errors.push("gateway \u5FC5\u987B\u4E3A\u5E03\u5C14\u503C");
  }
  if (config.project.type !== "microservice" && config.microservice) {
    errors.push("\u975E\u5FAE\u670D\u52A1\u67B6\u6784\u4E0D\u80FD\u5305\u542B\u7F51\u5173\u914D\u7F6E");
  }
  if (config.project.type === "microservice" && modules.some((module2) => config.project.name.length + 1 + module2.length > 63)) {
    errors.push("\u9879\u76EE\u540D\u4E0E\u670D\u52A1\u540D\u5408\u8BA1\u52A0\u5206\u9694\u7B26\u4E0D\u5F97\u8D85\u8FC7 63 \u5B57\u7B26\uFF0C\u4EE5\u7B26\u5408\u9ED8\u8BA4\u6570\u636E\u5E93\u547D\u540D\u9650\u5236");
  }
  if (config.outputMode && !["project", "config", "prompt"].includes(config.outputMode)) {
    errors.push("\u4E0D\u652F\u6301\u7684\u8F93\u51FA\u65B9\u5F0F");
  }
  return errors;
}
function assertValidConfig(config) {
  const errors = validateConfig(config);
  if (errors.length) {
    throw new Error(errors.join("\uFF1B"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assertValidConfig,
  validateConfig,
  validateModules,
  validateProjectName
});
