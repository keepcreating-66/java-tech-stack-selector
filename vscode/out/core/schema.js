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

// vscode/src/core/schema.ts
var schema_exports = {};
__export(schema_exports, {
  assertConfigShape: () => assertConfigShape,
  configShapeErrors: () => configShapeErrors
});
module.exports = __toCommonJS(schema_exports);

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
function assertConfigShape(input) {
  const errors = configShapeErrors(input);
  if (errors.length) {
    throw new Error(errors.join("\uFF1B"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assertConfigShape,
  configShapeErrors
});
