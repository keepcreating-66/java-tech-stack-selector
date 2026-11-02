'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// These are the compiled production modules, not copies of the rendering logic.
const { planProject } = require('../out/generation/plan.js');
const { writeProject } = require('../out/generation/write.js');

function config(type, overrides = {}) {
  const {project: projectOverrides, ...otherOverrides} = overrides;
  return {
    project: {
      name: 'audit-demo',
      type,
      javaVersion: '17',
      buildTool: 'maven',
      modules: ['user', 'order'],
      ...projectOverrides,
    },
    core: { framework: 'spring-boot-3', web: 'webmvc' },
    database: { rdbms: 'mysql-8', orm: 'jpa', pool: 'hikari', nosql: [] },
    cache: { type: 'none' },
    security: { framework: 'spring-security' },
    api: { documentation: 'none' },
    messaging: 'none',
    workflow: 'none',
    scheduler: 'none',
    ...(type === 'microservice' ? {microservice: {gateway: false}} : {}),
    ...otherOverrides,
  };
}

function filesOf(plan) {
  assert.equal(typeof plan.files, 'object');
  return Object.entries(plan.files);
}

test('three architecture choices create genuinely different Maven projects', () => {
  const plans = ['monolith', 'modular-monolith', 'microservice'].map(kind => planProject(config(kind)));
  const entries = plans.map(filesOf);
  const poms = entries.map(files => files.find(([name]) => name === 'pom.xml')?.[1]);
  assert.ok(poms.every(Boolean), 'every project should have a Maven root POM');
  assert.doesNotMatch(poms[0], /<modules>/);
  assert.match(poms[1], /<modules>/);
  assert.match(poms[2], /<modules>/);

  const applications = entries.map(files => files.filter(([name]) => name.endsWith('Application.java')).length);
  assert.equal(applications[0], 1);
  assert.equal(applications[1], 1);
  assert.ok(applications[2] >= 2, 'microservices need independent launch classes');

  const uniqueLayouts = new Set(entries.map(files => files.map(([name]) => name).sort().join('|')));
  assert.equal(uniqueLayouts.size, 3);
});

test('selected database and no-cache option affect dependency and configuration', () => {
  const mysql = planProject(config('monolith'));
  const mysqlFiles = filesOf(mysql);
  const mysqlPom = mysqlFiles.find(([name]) => name === 'pom.xml')[1];
  const mysqlYaml = mysqlFiles.find(([name]) => name.endsWith('application.yml'))[1];
  assert.match(mysqlPom, /mysql-connector-j/);
  assert.match(mysqlYaml, /jdbc:mysql:/);
  assert.doesNotMatch(mysqlPom, /redis|redisson/i);
  assert.doesNotMatch(mysqlYaml, /redis/i);

  const pg = planProject(config('monolith', {database: {rdbms: 'postgresql', orm: 'jpa', pool: 'hikari', nosql: []}}));
  const pgFiles = filesOf(pg);
  assert.match(pgFiles.find(([name]) => name === 'pom.xml')[1], /<artifactId>postgresql<\/artifactId>/);
  assert.match(pgFiles.find(([name]) => name.endsWith('application.yml'))[1], /jdbc:postgresql:/);
  assert.doesNotMatch(pgFiles.find(([name]) => name === 'pom.xml')[1], /mysql-connector-j/);
});

test('writer preserves an existing project byte for byte', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'java-stack-writer-'));
  try {
    const plan = planProject(config('monolith'));
    await writeProject(plan, root);
    const output = path.join(root, 'audit-demo', 'pom.xml');
    const original = fs.readFileSync(output);
    await assert.rejects(async () => writeProject(plan, root));
    assert.deepEqual(fs.readFileSync(output), original);
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});

test('unsupported Gradle and switchable choices fail before writing', () => {
  assert.throws(() => planProject(config('monolith', {project: {buildTool: 'gradle'}})));
  assert.throws(() => planProject(config('switchable')));
});

test('invalid versions, Java names, colliding packages and unimplemented NoSQL are rejected', () => {
  assert.throws(() => planProject(null), /JSON 对象/);
  assert.throws(() => planProject({}), /缺少配置对象/);
  for (const overrides of [
    {schemaVersion: 99},
    {unsupportedFeature: true},
    {project: {name: 'class'}},
    {project: {modules: ['audit-log', 'auditlog']}},
    {project: {modules: ['class', 'order']}},
    {database: {rdbms: 'mysql-8', orm: 'jpa', pool: 'hikari', nosql: ['milvus']}},
  ]) {
    assert.throws(() => planProject(config('monolith', overrides)));
  }
});

test('explicit single-file exports and gateway toggle respect the selected output', () => {
  assert.deepEqual(Object.keys(planProject(config('monolith', {outputMode: 'config'})).files), ['tech-stack-config.json']);
  assert.deepEqual(Object.keys(planProject(config('monolith', {outputMode: 'prompt'})).files), ['project-prompt.md']);
  const prompt = planProject(config('microservice', {outputMode: 'prompt'})).files['project-prompt.md'];
  assert.match(prompt, /尚未创建工程/);
  assert.match(prompt, /独立的服务应用/);
  assert.match(prompt, /"type": "microservice"/);
  const withGateway = planProject(config('microservice', {microservice: {gateway: true}}));
  assert.ok(withGateway.files['gateway/pom.xml']);
  assert.ok(!planProject(config('microservice')).files['gateway/pom.xml']);
});

test('multiword and acronym module names produce the Spring controller bean names', () => {
  const files = planProject(config('monolith', {project: {modules: ['a-b', 'x']}})).files;
  const generatedTest = Object.entries(files).find(([name]) => name.endsWith('ApplicationTest.java'))[1];
  assert.match(generatedTest, /containsBean\("ABController"\)/);
});

test('writer rejects path traversal and preserves a dangling target link', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'java-stack-safe-'));
  try {
    assert.throws(() => writeProject({projectName: 'bad-plan', files: {'../escape.txt': 'bad'}}, root));
    assert.deepEqual(fs.readdirSync(root), []);
    fs.symlinkSync(path.join(root, 'missing'), path.join(root, 'audit-demo'));
    assert.throws(() => writeProject(planProject(config('monolith')), root));
    assert.ok(fs.lstatSync(path.join(root, 'audit-demo')).isSymbolicLink());
    assert.deepEqual(fs.readdirSync(root), ['audit-demo']);
  } finally {
    fs.rmSync(root, {recursive: true, force: true});
  }
});
