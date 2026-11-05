"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vscode/src/core/generator.ts
var generator_exports = {};
__export(generator_exports, {
  generateProject: () => generateProject
});
module.exports = __toCommonJS(generator_exports);
var vscode = __toESM(require("vscode"));

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

// packages/core/src/generation/java.ts
var basePackage = (config) => `com.example.${config.project.name.replaceAll("-", "")}`;
var upper = (value) => value.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
var javaPath = (pkg, cls) => `src/main/java/${pkg.replaceAll(".", "/")}/${cls}.java`;
function application(pkg, cls, scanRoot, orm) {
  const jpa = scanRoot && orm === "jpa" ? `import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@EntityScan("${scanRoot}")
@EnableJpaRepositories("${scanRoot}")
` : "";
  const mapper = scanRoot && orm === "mybatis-plus" ? `import org.mybatis.spring.annotation.MapperScan;
@MapperScan("${scanRoot}")
` : "";
  const scan = scanRoot ? `(scanBasePackages = "${scanRoot}")` : "";
  return `package ${pkg};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
${jpa}${mapper}
@SpringBootApplication${scan}
public class ${cls} {
    public static void main(String[] args) { SpringApplication.run(${cls}.class, args); }
}
`;
}
function entity(pkg, module2, orm) {
  const cls = `${upper(module2)}Record`;
  const annotation = orm === "jpa" ? `import jakarta.persistence.*;
@Entity
@Table(name = "${module2.replaceAll("-", "_")}_records")` : `import com.baomidou.mybatisplus.annotation.*;
@TableName("${module2.replaceAll("-", "_")}_records")`;
  const id = orm === "jpa" ? "@Id @GeneratedValue(strategy = GenerationType.IDENTITY)" : "@TableId(type = IdType.AUTO)";
  return `package ${pkg};

${annotation}
public class ${cls} {
    ${id}
    private Long id;
    private String name;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
`;
}
function repository(pkg, module2, orm) {
  const entityName = `${upper(module2)}Record`;
  const cls = `${upper(module2)}Repository`;
  return orm === "jpa" ? `package ${pkg};

import org.springframework.data.jpa.repository.JpaRepository;
public interface ${cls} extends JpaRepository<${entityName}, Long> {}
` : `package ${pkg};

import org.apache.ibatis.annotations.Mapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
@Mapper
public interface ${cls} extends BaseMapper<${entityName}> {}
`;
}
function service(pkg, module2, orm) {
  const name = upper(module2), entityName = `${name}Record`, repositoryName = `${name}Repository`;
  const methods = orm === "jpa" ? `
    public ${entityName} create(${entityName} item) { item.setId(null); return repository.save(item); }
    public List<${entityName}> list() { return repository.findAll(); }
    public Optional<${entityName}> find(Long id) { return repository.findById(id); }
    public Optional<${entityName}> update(Long id, ${entityName} item) {
        return repository.findById(id).map(existing -> { existing.setName(item.getName()); return repository.save(existing); });
    }
    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id); return true;
    }` : `
    public ${entityName} create(${entityName} item) { item.setId(null); repository.insert(item); return item; }
    public List<${entityName}> list() { return repository.selectList(null); }
    public Optional<${entityName}> find(Long id) { return Optional.ofNullable(repository.selectById(id)); }
    public Optional<${entityName}> update(Long id, ${entityName} item) {
        if (repository.selectById(id) == null) return Optional.empty();
        item.setId(id); repository.updateById(item); return Optional.of(item);
    }
    public boolean delete(Long id) { return repository.deleteById(id) > 0; }`;
  return `package ${pkg};

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ${name}Service {
    private final ${repositoryName} repository;
    public ${name}Service(${repositoryName} repository) { this.repository = repository; }
${methods}
}
`;
}
function controller(pkg, module2, commonPackage) {
  const name = upper(module2), record = `${name}Record`, serviceName = `${name}Service`, route = module2.replaceAll("-", "") + "s";
  const commonImport = commonPackage ? `import ${commonPackage}.ModuleInfo;
` : "";
  const info = commonPackage ? `    @GetMapping("/info") public ModuleInfo info() { return new ModuleInfo("${module2}"); }
` : "";
  return `package ${pkg};

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
${commonImport}
@RestController
@RequestMapping("/api/${route}")
public class ${name}Controller {
    private final ${serviceName} service;
    public ${name}Controller(${serviceName} service) { this.service = service; }
${info}    @GetMapping public List<${record}> list() { return service.list(); }
    @GetMapping("/{id}") public ResponseEntity<${record}> find(@PathVariable Long id) {
        return service.find(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public ${record} create(@RequestBody ${record} item) { return service.create(item); }
    @PutMapping("/{id}") public ResponseEntity<${record}> update(@PathVariable Long id, @RequestBody ${record} item) {
        return service.update(id, item).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
`;
}
function security(pkg, framework) {
  if (framework === "spring-security") {
    return { "SecurityConfig.java": `package ${pkg};

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.requestMatchers("/actuator/health").permitAll().anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
`, "CsrfController.java": `package ${pkg};

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {
    @GetMapping("/csrf") public CsrfToken csrf(CsrfToken token) { return token; }
}
` };
  }
  return {
    "SaTokenConfig.java": `package ${pkg};

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SaTokenConfig implements WebMvcConfigurer {
    @Override public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin())).addPathPatterns("/api/**");
    }
}
`,
    "DemoAuthController.java": `package ${pkg};

import java.util.Map;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class DemoAuthController {
    @Value("\${demo.auth.username:}") private String expectedUser;
    @Value("\${demo.auth.password:}") private String expectedPassword;
    @PostMapping("/auth/login")
    public Map<String, String> login(@RequestParam String username, @RequestParam String password) {
        if (expectedUser.isBlank() || expectedPassword.isBlank() || !expectedUser.equals(username) || !expectedPassword.equals(password))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        StpUtil.login(username);
        return Map.of("token", StpUtil.getTokenValue());
    }
}
`,
    "SaTokenExceptionHandler.java": `package ${pkg};

import cn.dev33.satoken.exception.NotLoginException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class SaTokenExceptionHandler {
    @ExceptionHandler(NotLoginException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public void notLoggedIn() {}
}
`
  };
}
function contextTest(pkg, cls, beanName, route, framework) {
  const login = framework === "spring-security" ? `String header = "Authorization";
        String token = "Basic " + java.util.Base64.getEncoder().encodeToString("test-user:test-pass".getBytes(java.nio.charset.StandardCharsets.UTF_8));` : `var login = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/auth/login"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString("username=test-user&password=test-pass")).build(), HttpResponse.BodyHandlers.ofString());
        assertThat(login.statusCode()).isEqualTo(200);
        String header = "satoken";
        String token = new com.fasterxml.jackson.databind.ObjectMapper().readTree(login.body()).get("token").asText();`;
  const csrf = framework === "spring-security" ? `var csrf = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/csrf"))
            .header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(csrf.statusCode()).isEqualTo(200);
        var csrfJson = new com.fasterxml.jackson.databind.ObjectMapper().readTree(csrf.body());
        String csrfHeader = csrfJson.get("headerName").asText(), csrfToken = csrfJson.get("token").asText();` : 'String csrfHeader = "X-Demo-Test", csrfToken = "unused";';
  return `package ${pkg};

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.web.server.LocalServerPort;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(classes = ${cls}.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {"spring.security.user.name=test-user", "spring.security.user.password=test-pass",
        "demo.auth.username=test-user", "demo.auth.password=test-pass"})
class ${cls}Test {
    @Autowired ApplicationContext context;
    @LocalServerPort int port;
    @Test void contextLoadsWithBusinessController() {
        assertThat(context.containsBean("${beanName}")).isTrue();
    }
    @Test void servesHealthyHttpEndpoint() throws Exception {
        var response = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
            URI.create("http://localhost:" + port + "/actuator/health")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("UP");
    }
    @Test void protectsAndServesBusinessEndpoint() throws Exception {
        var client = HttpClient.newBuilder().cookieHandler(new java.net.CookieManager(null, java.net.CookiePolicy.ACCEPT_ALL)).build();
        var uri = URI.create("http://localhost:" + port + "/api/${route}");
        var anonymous = client.send(HttpRequest.newBuilder(uri).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(anonymous.statusCode()).isEqualTo(401);
        ${login}
        var response = client.send(HttpRequest.newBuilder(uri).header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("[]");
        ${csrf}
        var created = client.send(HttpRequest.newBuilder(uri).header(header, token).header(csrfHeader, csrfToken)
            .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString("{\\"name\\":\\"example\\"}")).build(), HttpResponse.BodyHandlers.ofString());
        assertThat(created.statusCode()).isEqualTo(200);
        long id = new com.fasterxml.jackson.databind.ObjectMapper().readTree(created.body()).get("id").asLong();
        var itemUri = URI.create(uri + "/" + id);
        var updated = client.send(HttpRequest.newBuilder(itemUri).header(header, token).header(csrfHeader, csrfToken)
            .header("Content-Type", "application/json").PUT(HttpRequest.BodyPublishers.ofString("{\\"name\\":\\"updated\\"}")).build(), HttpResponse.BodyHandlers.ofString());
        assertThat(updated.statusCode()).isEqualTo(200);
        var found = client.send(HttpRequest.newBuilder(itemUri).header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(found.statusCode()).isEqualTo(200);
        assertThat(found.body()).contains("updated");
        var deleted = client.send(HttpRequest.newBuilder(itemUri).header(header, token).header(csrfHeader, csrfToken).DELETE().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(deleted.statusCode()).isEqualTo(204);
        var missing = client.send(HttpRequest.newBuilder(itemUri).header(header, token).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(missing.statusCode()).isEqualTo(404);
    }
}
`;
}
function gatewayTest(pkg, cls, module2) {
  return `package ${pkg};

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = ${cls}.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ${cls}Test {
    static final HttpServer upstream;
    static {
        try {
            upstream = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            upstream.createContext("/api/${module2.replaceAll("-", "")}s/ping", exchange -> {
                byte[] body = "gateway-ok".getBytes(java.nio.charset.StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, body.length);
                try (var out = exchange.getResponseBody()) { out.write(body); }
            });
            upstream.start();
        } catch (java.io.IOException error) { throw new ExceptionInInitializerError(error); }
    }
    @DynamicPropertySource static void serviceUrl(DynamicPropertyRegistry properties) {
        properties.add("${module2.toUpperCase().replaceAll("-", "_")}_SERVICE_URL", () -> "http://127.0.0.1:" + upstream.getAddress().getPort());
    }
    @LocalServerPort int port;
    @AfterAll static void stopUpstream() { upstream.stop(0); }
    @Test void forwardsBusinessRoute() throws Exception {
        var response = HttpClient.newHttpClient().send(HttpRequest.newBuilder(
            URI.create("http://localhost:" + port + "/api/${module2.replaceAll("-", "")}s/ping")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("gateway-ok");
    }
}
`;
}

// packages/core/src/generation/plan.ts
var normal = (config) => ({
  ...config,
  schemaVersion: config.schemaVersion ?? 1,
  outputMode: config.outputMode ?? "project",
  project: { ...config.project, modules: config.project.modules ?? ["user", "order"] }
});
function sql(config) {
  const names = config.project.modules ?? [];
  const statements = (dialect) => names.map((module2) => {
    const table = `${module2.replaceAll("-", "_")}_records`;
    const id = dialect === "mysql" ? "BIGINT PRIMARY KEY AUTO_INCREMENT" : "BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY";
    return `CREATE TABLE IF NOT EXISTS ${table} (id ${id}, name VARCHAR(255) NOT NULL);`;
  }).join("\n") + "\n";
  return { "sql/mysql.sql": statements("mysql"), "sql/postgresql.sql": statements("postgresql") };
}
function databaseUrl(config, module2) {
  const database = `${config.project.name.replaceAll("-", "_")}${module2 ? `_${module2.replaceAll("-", "_")}` : ""}`;
  return config.database.rdbms === "postgresql" ? `jdbc:postgresql://localhost:5432/${database}` : `jdbc:mysql://localhost:3306/${database}?useSSL=false&serverTimezone=UTC`;
}
function applicationYaml(config, applicationName, port, module2) {
  const driver = config.database.rdbms === "postgresql" ? "org.postgresql.Driver" : "com.mysql.cj.jdbc.Driver";
  const orm = config.database.orm === "jpa" ? `  jpa:
    hibernate:
      ddl-auto: update
    open-in-view: false
` : "";
  const redis = config.cache.type === "redisson" ? `  data:
    redis:
      host: \${REDIS_HOST:localhost}
      port: \${REDIS_PORT:6379}
` : "";
  const sa = config.security.framework === "sa-token" ? `demo:
  auth:
    username: \${DEMO_USER:}
    password: \${DEMO_PASSWORD:}
` : "";
  return `server:
  port: \${PORT:${port}}
spring:
  application:
    name: ${applicationName}
  datasource:
    driver-class-name: ${driver}
    url: \${DB_URL:${databaseUrl(config, module2)}}
    username: \${DB_USER:app}
    password: \${DB_PASSWORD:}
${orm}${redis}management:
  endpoints:
    web:
      exposure:
        include: health,info
${sa}`;
}
function testYaml(config) {
  const orm = config.database.orm === "jpa" ? `  jpa:
    hibernate:
      ddl-auto: create-drop
` : `  sql:
    init:
      mode: always
`;
  const cache = config.cache.type === "redisson" ? `  autoconfigure:
    exclude:
      - org.redisson.spring.starter.RedissonAutoConfigurationV2
      - org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
      - org.springframework.boot.autoconfigure.data.redis.RedisReactiveAutoConfiguration
` : "";
  return `spring:
${cache}  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1
    username: sa
    password:
${orm}`;
}
function testSchema(config, module2) {
  if (config.database.orm === "jpa") {
    return void 0;
  }
  const names = module2 ? [module2] : config.project.modules ?? [];
  return names.map((name) => `CREATE TABLE IF NOT EXISTS ${name.replaceAll("-", "_")}_records (id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, name VARCHAR(255) NOT NULL);`).join("\n") + "\n";
}
function domainFiles(config, module2, commonPackage) {
  const pkg = `${basePackage(config)}.${module2.replaceAll("-", "")}`;
  const name = upper(module2);
  return {
    [javaPath(pkg, `${name}Record`)]: entity(pkg, module2, config.database.orm),
    [javaPath(pkg, `${name}Repository`)]: repository(pkg, module2, config.database.orm),
    [javaPath(pkg, `${name}Service`)]: service(pkg, module2, config.database.orm),
    [javaPath(pkg, `${name}Controller`)]: controller(pkg, module2, commonPackage)
  };
}
function securityFiles(config, pkg, prefix = "") {
  const files = {};
  for (const [name, content] of Object.entries(security(pkg, config.security.framework))) {
    files[`${prefix}${javaPath(pkg, name.replace(".java", ""))}`] = content;
  }
  return files;
}
function testFiles(config, pkg, cls, beanName, prefix = "", module2) {
  const files = {
    [`${prefix}src/test/java/${pkg.replaceAll(".", "/")}/${cls}Test.java`]: contextTest(
      pkg,
      cls,
      beanName,
      (module2 ?? (config.project.modules ?? [])[0]).replaceAll("-", "") + "s",
      config.security.framework
    ),
    [`${prefix}src/test/resources/application-test.yml`]: testYaml(config)
  };
  const schema = testSchema(config, module2);
  if (schema) {
    files[`${prefix}src/test/resources/schema.sql`] = schema;
  }
  return files;
}
function monolith(config) {
  const pkg = basePackage(config), cls = `${upper(config.project.name)}Application`;
  const files = {
    "pom.xml": pom({ projectName: config.project.name, artifactId: config.project.name, dependencies: runtimeDependencies(config), executable: true }),
    [javaPath(pkg, cls)]: application(pkg, cls),
    "src/main/resources/application.yml": applicationYaml(config, config.project.name, 8080),
    ...securityFiles(config, pkg),
    ...testFiles(config, pkg, cls, controllerBean((config.project.modules ?? [])[0]))
  };
  for (const module2 of config.project.modules ?? []) {
    Object.assign(files, domainFiles(config, module2));
  }
  return files;
}
function modular(config) {
  const modules = config.project.modules ?? [], pkg = basePackage(config);
  const files = {
    "pom.xml": pom({ projectName: config.project.name, artifactId: config.project.name, packaging: "pom", modules: ["common", ...modules, "bootstrap"] }),
    "common/pom.xml": pom({ projectName: config.project.name, artifactId: `${config.project.name}-common`, child: true }),
    [`common/${javaPath(`${pkg}.common`, "ModuleInfo")}`]: `package ${pkg}.common;
public record ModuleInfo(String module) {}
`
  };
  for (const module2 of modules) {
    const dependencies = [moduleDependency(config.project.name, "common"), ...ormDependencies(config), { group: "org.springframework.boot", artifact: "spring-boot-starter-web" }];
    files[`${module2}/pom.xml`] = pom({ projectName: config.project.name, artifactId: `${config.project.name}-${module2}`, child: true, dependencies });
    for (const [file, content] of Object.entries(domainFiles(config, module2, `${pkg}.common`))) {
      files[`${module2}/${file}`] = content;
    }
  }
  const appPkg = `${pkg}.bootstrap`, cls = `${upper(config.project.name)}Application`;
  files["bootstrap/pom.xml"] = pom({
    projectName: config.project.name,
    artifactId: `${config.project.name}-bootstrap`,
    child: true,
    executable: true,
    dependencies: [...runtimeDependencies(config), ...modules.map((module2) => moduleDependency(config.project.name, module2))]
  });
  files[`bootstrap/${javaPath(appPkg, cls)}`] = application(appPkg, cls, pkg, config.database.orm);
  files["bootstrap/src/main/resources/application.yml"] = applicationYaml(config, config.project.name, 8080);
  Object.assign(files, securityFiles(config, appPkg, "bootstrap/"));
  Object.assign(files, testFiles(config, appPkg, cls, controllerBean(modules[0]), "bootstrap/"));
  return files;
}
function gatewayYaml(config) {
  const routes = (config.project.modules ?? []).map((module2, index) => `      - id: ${module2}
        uri: \${${module2.toUpperCase().replaceAll("-", "_")}_SERVICE_URL:http://localhost:${8081 + index}}
        predicates:
          - Path=/api/${module2.replaceAll("-", "")}s/**`).join("\n");
  return `server:
  port: \${PORT:8080}
spring:
  application:
    name: ${config.project.name}-gateway
  cloud:
    gateway:
      routes:
${routes}
management:
  endpoints:
    web:
      exposure:
        include: health,info
`;
}
function microservice(config) {
  const modules = config.project.modules ?? [], pkg = basePackage(config), gateway = !!config.microservice?.gateway;
  const files = {
    "pom.xml": pom({ projectName: config.project.name, artifactId: config.project.name, packaging: "pom", modules: [...modules.map((module2) => `${module2}-service`), ...gateway ? ["gateway"] : []], cloud: gateway })
  };
  modules.forEach((module2, index) => {
    const prefix = `${module2}-service/`, appPkg = `${pkg}.${module2.replaceAll("-", "")}`, cls = `${upper(module2)}ServiceApplication`;
    files[`${prefix}pom.xml`] = pom({ projectName: config.project.name, artifactId: `${config.project.name}-${module2}-service`, child: true, executable: true, dependencies: runtimeDependencies(config) });
    for (const [file, content] of Object.entries(domainFiles(config, module2))) {
      files[`${prefix}${file}`] = content;
    }
    files[`${prefix}${javaPath(appPkg, cls)}`] = application(appPkg, cls);
    files[`${prefix}src/main/resources/application.yml`] = applicationYaml(config, `${config.project.name}-${module2}-service`, 8081 + index, module2);
    Object.assign(files, securityFiles(config, appPkg, prefix));
    Object.assign(files, testFiles(config, appPkg, cls, controllerBean(module2), prefix, module2));
  });
  if (gateway) {
    const cls = `${upper(config.project.name)}GatewayApplication`, appPkg = `${pkg}.gateway`;
    files["gateway/pom.xml"] = pom({ projectName: config.project.name, artifactId: `${config.project.name}-gateway`, child: true, executable: true, dependencies: gatewayDependencies });
    files[`gateway/${javaPath(appPkg, cls)}`] = application(appPkg, cls);
    files["gateway/src/main/resources/application.yml"] = gatewayYaml(config);
    files[`gateway/src/test/java/${appPkg.replaceAll(".", "/")}/${cls}Test.java`] = gatewayTest(appPkg, cls, modules[0]);
  }
  return files;
}
function controllerBean(module2) {
  const name = `${upper(module2)}Controller`;
  return /^[A-Z]{2}/.test(name) ? name : name[0].toLowerCase() + name.slice(1);
}
function readme(config) {
  const modules = config.project.modules ?? [];
  const mode = config.project.type;
  const db = config.database.rdbms === "postgresql" ? "PostgreSQL" : "MySQL 8";
  const appModules = mode === "microservice" ? modules.map((m) => `${m}-service`) : mode === "modular-monolith" ? ["bootstrap"] : ["."];
  const tests = "mvn clean verify";
  const run = appModules.map((module2) => mode === "monolith" ? `java -jar target/${config.project.name}-1.0.0-SNAPSHOT.jar` : `java -jar ${module2}/target/${config.project.name}-${module2}-1.0.0-SNAPSHOT.jar`).join("\n");
  const schema = config.database.orm === "mybatis-plus" ? `\u5148\u521B\u5EFA\u6570\u636E\u5E93\uFF0C\u518D\u6267\u884C sql/${config.database.rdbms === "postgresql" ? "postgresql" : "mysql"}.sql\u3002\u5FAE\u670D\u52A1\u53EF\u4E3A\u6BCF\u4E2A\u670D\u52A1\u4F7F\u7528\u72EC\u7ACB\u6570\u636E\u5E93\uFF1B\u6309\u670D\u52A1\u521D\u59CB\u5316\u5BF9\u5E94\u8868\u3002` : "JPA \u793A\u4F8B\u4F7F\u7528 ddl-auto=update \u81EA\u52A8\u521B\u5EFA\u6F14\u793A\u8868\uFF1B\u6B63\u5F0F\u9879\u76EE\u5E94\u6539\u4E3A\u53D7\u63A7\u8FC1\u79FB\u3002";
  const auth = config.security.framework === "spring-security" ? "Spring Security \u4F7F\u7528 Boot \u9ED8\u8BA4\u6F14\u793A\u7528\u6237 user\uFF0C\u542F\u52A8\u65E5\u5FD7\u4F1A\u6253\u5370\u968F\u673A\u5BC6\u7801\u3002/actuator/health \u53EF\u533F\u540D\u8BBF\u95EE\uFF0C\u5176\u4F59\u63A5\u53E3\u9700 Basic \u8BA4\u8BC1\u3002\u5148\u8BA4\u8BC1 GET /csrf \u5E76\u4FDD\u7559\u4F1A\u8BDD Cookie\uFF0C\u518D\u7528\u8FD4\u56DE\u7684 headerName\u3001token \u4F5C\u4E3A\u8BF7\u6C42\u5934\u53D1\u9001 POST/PUT/DELETE\u3002" : "Sa-Token \u5728 /api/** \u68C0\u67E5\u767B\u5F55\u3002\u8BBE\u7F6E DEMO_USER \u4E0E DEMO_PASSWORD \u540E\u53EF POST /auth/login \u83B7\u53D6\u6F14\u793A token\uFF1B\u7A7A\u51ED\u636E\u65F6\u62D2\u7EDD\u767B\u5F55\u3002";
  return `# ${config.project.name}

\u8FD9\u662F\u6309 **${mode}** \u67B6\u6784\u751F\u6210\u7684\u6700\u5C0F Java 17 / Spring Boot 3 / Maven \u793A\u4F8B\u3002\u4E1A\u52A1\u8FB9\u754C\uFF1A${modules.join("\u3001")}\u3002\u5F53\u524D\u4EA7\u7269\u5305\u542B\u5404\u4E1A\u52A1\u57DF\u7684\u5B9E\u4F53\u3001\u4ED3\u50A8\u3001\u670D\u52A1\u4E0E CRUD \u63A5\u53E3\uFF1B\u8BF7\u6309\u771F\u5B9E\u9700\u6C42\u5B8C\u5584\u4E1A\u52A1\u89C4\u5219\u4E0E\u5B89\u5168\u7B56\u7565\u3002

## \u8FD0\u884C\u6761\u4EF6

- JDK 17+\u3001Maven\u3001${db}\u3002${config.cache.type === "redisson" ? "\u8FD8\u9700 Redis\u3002" : "\u672A\u542F\u7528 Redis\u3002"}
- \u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF DB_URL\u3001DB_USER\u3001DB_PASSWORD\u3002DB_URL \u672A\u8BBE\u7F6E\u65F6\u4F7F\u7528\u672C\u673A\u9ED8\u8BA4 ${db} \u5730\u5740\u548C\u6309\u9879\u76EE/\u670D\u52A1\u6D3E\u751F\u7684\u6570\u636E\u5E93\u540D\uFF1B\u4E0D\u8981\u5BFC\u51FA\u7A7A DB_URL\u3002Spring Boot \u4E0D\u81EA\u52A8\u8BFB\u53D6 .env.example\uFF0C\u9700\u5C06\u5B9E\u9645\u503C\u5BFC\u5165\u5F53\u524D\u7EC8\u7AEF\u3002
- ${schema}
- ${auth}

## \u6784\u5EFA\u4E0E\u6D4B\u8BD5

\`\`\`sh
${tests}
\`\`\`

\u6D4B\u8BD5\u914D\u7F6E\u4F7F\u7528\u5185\u5B58 H2\uFF0C\u542F\u52A8\u5B9E\u9645 HTTP \u670D\u52A1\u5E76\u68C0\u67E5\u5065\u5EB7\u7AEF\u70B9\u548C\u4E1A\u52A1 Controller\u3002\u6784\u5EFA\u80FD\u5426\u901A\u8FC7\u53D6\u51B3\u4E8E\u672C\u673A Maven \u4F9D\u8D56\u53EF\u7528\u6027\uFF1B\u751F\u6210\u63D2\u4EF6\u4F1A\u51C6\u786E\u663E\u793A\u662F\u5426\u6267\u884C\u8FC7\u6784\u5EFA\u9A8C\u8BC1\u3002

## \u542F\u52A8

\`\`\`sh
${run}
\`\`\`

${mode === "microservice" ? `\u6BCF\u6761\u542F\u52A8\u547D\u4EE4\u5728\u72EC\u7ACB\u7EC8\u7AEF\u6267\u884C\u3002\u670D\u52A1\u9ED8\u8BA4\u4F9D\u6B21\u4F7F\u7528 8081\u30018082\u2026 \u7AEF\u53E3\u3002${config.microservice?.gateway ? `\u7F51\u5173\u9ED8\u8BA4\u7AEF\u53E3 8080\uFF1B\u53E6\u8FD0\u884C \`java -jar gateway/target/${config.project.name}-gateway-1.0.0-SNAPSHOT.jar\`\uFF0C\u7528\u9759\u6001\u670D\u52A1 URL \u8DEF\u7531 /api/<\u6A21\u5757\u540D>s/**\u3002` : "\u672C\u6B21\u672A\u751F\u6210\u7F51\u5173\uFF1B\u76F4\u63A5\u8BBF\u95EE\u5404\u670D\u52A1\u3002"} \u5F53\u524D\u4E0D\u542B\u6CE8\u518C\u4E2D\u5FC3\u3002` : "\u5E94\u7528\u9ED8\u8BA4\u7AEF\u53E3\u4E3A 8080\u3002"}

\u5065\u5EB7\u68C0\u67E5\uFF1A/actuator/health\u3002\u4E1A\u52A1\u793A\u4F8B\uFF1A/api/${modules[0].replaceAll("-", "")}s\u3002SQL \u793A\u4F8B\u4F4D\u4E8E sql/\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u6267\u884C\u5230\u5916\u90E8\u6570\u636E\u5E93\u3002
`;
}
function prompt(config) {
  if (config.outputMode === "prompt") {
    const structure = config.project.type === "monolith" ? "\u4E00\u4E2A\u53EF\u6267\u884C Maven \u5E94\u7528\uFF0C\u6309\u4E1A\u52A1\u57DF\u7EC4\u7EC7\u4EE3\u7801\u3002" : config.project.type === "modular-monolith" ? "Maven \u805A\u5408\u7236\u5DE5\u7A0B\u3001common \u516C\u5171\u6A21\u5757\u3001\u72EC\u7ACB\u4E1A\u52A1\u6A21\u5757\u548C bootstrap \u542F\u52A8\u6A21\u5757\uFF1B\u53EA\u6709 bootstrap \u4E3A\u53EF\u6267\u884C\u5E94\u7528\u3002" : `Maven \u805A\u5408\u7236\u5DE5\u7A0B\u3001\u5404\u4E1A\u52A1\u57DF\u72EC\u7ACB\u7684\u670D\u52A1\u5E94\u7528\u4E0E\u914D\u7F6E\u3001\u4E0D\u540C\u9ED8\u8BA4\u7AEF\u53E3\uFF1B${config.microservice?.gateway ? "\u5305\u542B\u9759\u6001\u5730\u5740\u8DEF\u7531\u7F51\u5173\u3002" : "\u4E0D\u5305\u542B\u7F51\u5173\u3002"}`;
    return `# \u9879\u76EE\u521B\u5EFA\u63D0\u793A\u8BCD

\u672C\u6587\u4EF6\u4EC5\u5BFC\u51FA\u4E86\u63D0\u793A\u8BCD\uFF0C\u5C1A\u672A\u521B\u5EFA\u5DE5\u7A0B\u3002\u8BF7\u6309\u4EE5\u4E0B\u5DF2\u786E\u8BA4\u914D\u7F6E\u521B\u5EFA Java \u540E\u7AEF\u9879\u76EE\uFF0C\u4E0D\u8981\u6539\u6362\u67B6\u6784\u6216\u52A0\u5165\u672A\u9009\u62E9\u7684\u7EC4\u4EF6\u3002

\u7ED3\u6784\u8981\u6C42\uFF1A${structure}

\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

\u5148\u68C0\u67E5\u76EE\u6807\u8DEF\u5F84\uFF1B\u4E0D\u8981\u8986\u76D6\u5DF2\u6709\u5DE5\u7A0B\u3002\u5B9E\u9645\u5199\u51FA\u6240\u9009 ORM \u7684\u5B9E\u4F53\u3001\u4ED3\u50A8\u3001\u670D\u52A1\u4E0E\u63A5\u53E3\u3001\u5065\u5EB7\u7AEF\u70B9\u3001\u73AF\u5883\u53D8\u91CF\u914D\u7F6E\u3001\u8FD0\u884C\u8BF4\u660E\u548C\u6D4B\u8BD5\u3002\u5B8C\u6210\u540E\u5206\u522B\u62A5\u544A\u6587\u4EF6\u521B\u5EFA\u72B6\u6001\u548C\u5B9E\u9645\u6784\u5EFA\u3001\u8FD0\u884C\u9A8C\u8BC1\u7ED3\u679C\u3002
`;
  }
  return `# \u9879\u76EE\u540E\u7EED\u5B8C\u5584\u63D0\u793A\u8BCD

\u9879\u76EE ${config.project.name} \u5DF2\u751F\u6210 ${config.project.type} \u67B6\u6784\u7684\u57FA\u7840\u5DE5\u7A0B\uFF0C\u4E1A\u52A1\u6A21\u5757\u4E3A ${config.project.modules?.join(", ")}\u3002
\u6784\u5EFA\u5DE5\u5177 ${config.project.buildTool}\uFF0CJava ${config.project.javaVersion}\uFF0C\u6846\u67B6 ${config.core.framework}\uFF0C\u6570\u636E\u5E93 ${config.database.rdbms}\uFF0CORM ${config.database.orm}\uFF0C\u7F13\u5B58 ${config.cache.type}\uFF0C\u8BA4\u8BC1 ${config.security.framework}\u3002
\u8BF7\u5148\u8BFB\u53D6 tech-stack-config.json\u3001README.md \u548C\u5DF2\u6709\u4EE3\u7801\uFF0C\u4FDD\u7559\u6240\u9009\u67B6\u6784\u4E0E\u771F\u5B9E\u6A21\u5757\u8FB9\u754C\uFF0C\u518D\u6309\u7528\u6237\u4E1A\u52A1\u9700\u6C42\u5B8C\u5584\u4E1A\u52A1\u89C4\u5219\u3001\u6D4B\u8BD5\u548C\u90E8\u7F72\u3002\u4E0D\u8981\u628A\u67B6\u6784\u6539\u5199\u6210\u5176\u4ED6\u7C7B\u578B\u3002
`;
}
function planProject(input) {
  assertConfigShape(input);
  const config = normal(input);
  assertValidConfig(config);
  const files = {
    "tech-stack-config.json": JSON.stringify(config, null, 2) + "\n"
  };
  if (config.outputMode === "config") {
    return { projectName: config.project.name, config, files };
  }
  files["project-prompt.md"] = prompt(config);
  if (config.outputMode === "prompt") {
    return { projectName: config.project.name, config, files: { "project-prompt.md": files["project-prompt.md"] } };
  }
  Object.assign(files, sql(config), config.project.type === "monolith" ? monolith(config) : config.project.type === "modular-monolith" ? modular(config) : microservice(config));
  files["README.md"] = readme(config);
  files[".env.example"] = `# \u5C06\u53D8\u91CF\u5BFC\u5165\u5F53\u524D\u7EC8\u7AEF\u540E\u542F\u52A8\uFF1BSpring Boot \u4E0D\u4F1A\u81EA\u52A8\u8BFB\u53D6\u6B64\u6587\u4EF6\u3002
# DB_URL \u672A\u8BBE\u7F6E\u65F6\u4F7F\u7528 application.yml \u7684\u9ED8\u8BA4\u5730\u5740\uFF1B\u4E0D\u8981\u5BFC\u51FA\u7A7A DB_URL\u3002
# DB_URL=jdbc:...
DB_USER=app
DB_PASSWORD=
${config.cache.type === "redisson" ? "REDIS_HOST=localhost\nREDIS_PORT=6379\n" : ""}${config.security.framework === "sa-token" ? "DEMO_USER=\nDEMO_PASSWORD=\n" : ""}`;
  files[".gitignore"] = "target/\n**/target/\n.idea/\n.vscode/\n.env\n.DS_Store\n";
  return { projectName: config.project.name, config, files };
}

// packages/core/src/generation/write.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function writeProject(plan, outputRoot) {
  if (!fs.statSync(outputRoot).isDirectory()) {
    throw new Error(`\u8F93\u51FA\u4F4D\u7F6E\u4E0D\u662F\u76EE\u5F55\uFF1A${outputRoot}`);
  }
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(plan.projectName)) {
    throw new Error("\u9879\u76EE\u540D\u4E0D\u5B89\u5168");
  }
  const target = path.join(outputRoot, plan.projectName);
  const entries = Object.entries(plan.files);
  for (const [relative] of entries) {
    if (!relative || relative.includes("\\") || relative.includes(":") || path.posix.isAbsolute(relative) || path.win32.isAbsolute(relative) || relative === ".." || relative.startsWith("../") || path.posix.normalize(relative) !== relative) {
      throw new Error(`\u751F\u6210\u8DEF\u5F84\u4E0D\u5B89\u5168\uFF1A${relative}`);
    }
  }
  try {
    fs.lstatSync(target);
    throw new Error(`\u76EE\u6807\u9879\u76EE\u5DF2\u5B58\u5728\uFF0C\u672A\u8986\u76D6\uFF1A${target}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  const stage = fs.mkdtempSync(path.join(outputRoot, `.${plan.projectName}-staging-`));
  let reserved = false;
  const createdFiles = [];
  const createdDirs = [];
  try {
    for (const [relative, content] of entries) {
      const file = path.join(stage, relative);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content, { flag: "wx" });
    }
    fs.mkdirSync(target);
    reserved = true;
    for (const [relative] of entries) {
      const parts = relative.split("/");
      let directory = target;
      for (const part of parts.slice(0, -1)) {
        directory = path.join(directory, part);
        if (!createdDirs.includes(directory)) {
          fs.mkdirSync(directory);
          createdDirs.push(directory);
        }
      }
      const file = path.join(target, relative);
      fs.copyFileSync(path.join(stage, relative), file, fs.constants.COPYFILE_EXCL);
      createdFiles.push(file);
    }
    return target;
  } catch (error) {
    for (const file of createdFiles.reverse()) {
      try {
        fs.unlinkSync(file);
      } catch {
      }
    }
    for (const directory of createdDirs.reverse()) {
      try {
        fs.rmdirSync(directory);
      } catch {
      }
    }
    if (reserved) {
      try {
        fs.rmdirSync(target);
      } catch {
      }
    }
    throw error;
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

// vscode/src/core/generator.ts
async function generateProject(config) {
  const plan = planProject(config);
  const selected = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "\u9009\u62E9\u9879\u76EE\u8F93\u51FA\u76EE\u5F55"
  });
  if (!selected?.length) {
    return;
  }
  const projectDir = writeProject(plan, selected[0].fsPath);
  const mode = config.outputMode ?? "project";
  const label = mode === "project" ? `${ARCHITECTURE_LABELS[config.project.type]}\u5DE5\u7A0B` : mode === "config" ? "\u914D\u7F6E\u6587\u4EF6" : "\u63D0\u793A\u8BCD";
  const openFolder = mode === "project" ? "\u6253\u5F00\u9879\u76EE" : "\u6253\u5F00\u76EE\u5F55";
  const status = mode === "project" ? "\u6784\u5EFA\u672A\u9A8C\u8BC1" : "\u672A\u521B\u5EFA\u5DE5\u7A0B";
  const result = await vscode.window.showInformationMessage(
    `\u5DF2\u521B\u5EFA ${label}\uFF1A${config.project.name}\uFF08${Object.keys(plan.files).length} \u4E2A\u6587\u4EF6\uFF1B${status}\uFF09`,
    openFolder
  );
  if (result === openFolder) {
    await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(projectDir), true);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateProject
});
