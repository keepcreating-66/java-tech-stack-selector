"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayDependencies = void 0;
exports.ormDependencies = ormDependencies;
exports.runtimeDependencies = runtimeDependencies;
exports.pom = pom;
exports.moduleDependency = moduleDependency;
const data_1 = require("../core/data");
const dep = (group, artifact, version, scope) => ({ group, artifact, version, scope });
const boot = (artifact, scope) => dep('org.springframework.boot', artifact, undefined, scope);
function ormDependencies(config) {
    return config.database.orm === 'jpa'
        ? [boot('spring-boot-starter-data-jpa')]
        : [dep('com.baomidou', 'mybatis-plus-spring-boot3-starter', data_1.VERSION_MAP['mybatis-plus'])];
}
function runtimeDependencies(config) {
    const deps = [boot('spring-boot-starter-web'), boot('spring-boot-starter-actuator'),
        ...ormDependencies(config),
        config.database.rdbms === 'postgresql' ? dep('org.postgresql', 'postgresql', undefined, 'runtime')
            : dep('com.mysql', 'mysql-connector-j', undefined, 'runtime'),
        boot('spring-boot-starter-test', 'test'), dep('com.h2database', 'h2', undefined, 'test')];
    if (config.cache.type === 'redisson') {
        deps.push(boot('spring-boot-starter-data-redis'));
        deps.push(dep('org.redisson', 'redisson-spring-boot-starter', data_1.VERSION_MAP['redisson']));
    }
    if (config.security.framework === 'spring-security') {
        deps.push(boot('spring-boot-starter-security'));
    }
    else {
        deps.push(dep('cn.dev33', 'sa-token-spring-boot3-starter', data_1.VERSION_MAP['sa-token']));
    }
    if (config.api.documentation === 'knife4j') {
        deps.push(dep('com.github.xiaoymin', 'knife4j-openapi3-jakarta-spring-boot-starter', data_1.VERSION_MAP['knife4j']));
    }
    return deps;
}
function pom(options) {
    const { projectName, artifactId, packaging = 'jar', dependencies = [] } = options;
    const parent = options.child
        ? `<parent><groupId>com.example</groupId><artifactId>${projectName}</artifactId><version>1.0.0-SNAPSHOT</version><relativePath>../pom.xml</relativePath></parent>`
        : `<parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>${data_1.VERSION_MAP['spring-boot-3']}</version><relativePath/></parent>`;
    const modules = options.modules?.length ? `<modules>${options.modules.map(m => `<module>${m}</module>`).join('')}</modules>` : '';
    const unique = new Map();
    for (const item of dependencies) {
        unique.set(`${item.group}:${item.artifact}`, item);
    }
    const deps = [...unique.values()].map(item => `<dependency><groupId>${item.group}</groupId><artifactId>${item.artifact}</artifactId>${item.version ? `<version>${item.version}</version>` : ''}${item.scope ? `<scope>${item.scope}</scope>` : ''}</dependency>`).join('\n    ');
    const cloud = options.cloud ? `<dependencyManagement><dependencies><dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-dependencies</artifactId><version>2023.0.0</version><type>pom</type><scope>import</scope></dependency></dependencies></dependencyManagement>` : '';
    const plugin = options.executable ? `<build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>` : '';
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
function moduleDependency(projectName, module) {
    return dep('com.example', `${projectName}-${module}`, '1.0.0-SNAPSHOT');
}
exports.gatewayDependencies = [dep('org.springframework.cloud', 'spring-cloud-starter-gateway'), boot('spring-boot-starter-actuator'), boot('spring-boot-starter-test', 'test')];
//# sourceMappingURL=maven.js.map