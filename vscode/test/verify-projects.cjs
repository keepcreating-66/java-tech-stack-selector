'use strict';
// Reproducible integration gate: render with production code, then build the actual projects.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const {DEFAULT_CONFIG} = require('../out/core/data.js');
const {planProject} = require('../out/generation/plan.js');
const {writeProject} = require('../out/generation/write.js');

if (process.argv[2] === '--gateway-smoke') {
  require('./gateway-smoke.cjs').smoke(path.resolve(process.argv[3])).catch(error => {console.error(error); process.exitCode = 1;});
} else {
const root = process.argv[2] ? path.resolve(process.argv[2]) : fs.mkdtempSync(path.join(os.tmpdir(), 'java-stack-acceptance-'));
fs.mkdirSync(root, {recursive: true});
const matrix = [
  {name: 'monolith-basic', architecture: 'monolith'},
  {name: 'modular-basic', architecture: 'modular-monolith'},
  {name: 'services-gateway', architecture: 'microservice', gateway: true},
  {name: 'modular-components', architecture: 'modular-monolith', database: 'postgresql', orm: 'mybatis-plus', cache: 'redisson', security: 'sa-token', api: 'knife4j', modules: ['audit-log', 'order']},
  {name: 'services-direct', architecture: 'microservice', database: 'postgresql', orm: 'mybatis-plus', security: 'sa-token'},
  {name: 'monolith-components', architecture: 'monolith', database: 'postgresql', cache: 'redisson', api: 'knife4j'},
];
const results = [];
let failures = 0;
for (const scenario of matrix) {
  const config = structuredClone(DEFAULT_CONFIG);
  config.project.name = scenario.name;
  config.project.type = scenario.architecture;
  config.project.modules = scenario.modules ?? config.project.modules;
  config.database.rdbms = scenario.database ?? config.database.rdbms;
  config.database.orm = scenario.orm ?? config.database.orm;
  config.cache.type = scenario.cache ?? config.cache.type;
  config.database.nosql = config.cache.type === 'redisson' ? ['redis'] : [];
  config.security.framework = scenario.security ?? config.security.framework;
  config.api.documentation = scenario.api ?? config.api.documentation;
  if (scenario.architecture === 'microservice') config.microservice = {gateway: !!scenario.gateway};
  const plan = planProject(config);
  const directory = writeProject(plan, root);
  const log = path.join(root, `${scenario.name}.log`);
  const fd = fs.openSync(log, 'w');
  const started = Date.now();
  const build = spawnSync('mvn', ['-B', '-ntp', 'clean', 'verify'], {cwd: directory, stdio: ['ignore', fd, fd], timeout: 600000});
  fs.closeSync(fd);
  const passed = build.status === 0;
  if (!passed) failures++;
  const result = {...scenario, files: Object.keys(plan.files).length, passed, exitCode: build.status, error: build.error?.message, seconds: Math.round((Date.now() - started) / 1000), directory, log};
  results.push(result);
  console.log(`${passed ? 'PASS' : 'FAIL'} ${scenario.name} (${result.files} files, ${result.seconds}s) ${log}`);
  fs.writeFileSync(path.join(root, 'results.json'), JSON.stringify({root, results}, null, 2));
}
console.log(`Project builds: ${matrix.length - failures}/${matrix.length}. Evidence: ${root}`);
process.exitCode = failures ? 1 : 0;
}
