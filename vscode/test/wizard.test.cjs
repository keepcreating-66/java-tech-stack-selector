'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');

// Run the real extension, wizard and QuickInput adapter; only the VS Code host is stubbed.
function loadHost(actions) {
  const trace = [], commands = new Map(), errors = [];
  let outputDialogs = 0;
  const back = {id: 'back'};
  const disposable = () => ({dispose() {}});
  function control(kind) {
    const events = new Map();
    const emit = (name, value) => { for (const callback of events.get(name) || []) callback(value); };
    const listen = name => callback => {
      const callbacks = events.get(name) || [];
      callbacks.push(callback); events.set(name, callbacks);
      return {dispose() { const index = callbacks.indexOf(callback); if (index >= 0) callbacks.splice(index, 1); }};
    };
    const input = {
      items: [], selectedItems: [], activeItems: [], buttons: [], value: '',
      onDidTriggerButton: listen('back'), onDidAccept: listen('accept'),
      onDidHide: listen('hide'), onDidChangeValue: listen('change'),
      hide() { emit('hide'); }, dispose() {},
      show() {
        const action = actions.shift();
        assert.ok(action, `Unexpected prompt: ${input.title}`);
        if (action.title) assert.ok(input.title.includes(action.title), `Expected ${action.title}, got ${input.title}`);
        trace.push({kind, title: input.title, value: input.value, active: input.activeItems.map(item => item.value), options: input.items.map(item => item.value)});
        if (action.check) action.check(input);
        if (action.cancel) { emit('hide'); return; }
        if (action.back) { assert.ok(input.buttons.includes(back)); emit('back'); return; }
        if (kind === 'input') {
          input.value = action.value ?? input.value;
          emit('change', input.value);
        } else {
          const value = action.value ?? input.activeItems[0]?.value ?? input.items[0]?.value;
          const selected = input.items.find(item => item.value === value);
          assert.ok(selected, `Missing option ${value} in ${input.title}`);
          input.selectedItems = [selected];
        }
        emit('accept');
      }
    };
    return input;
  }
  const vscode = {
    QuickInputButtons: {Back: back},
    window: {
      createQuickPick: () => control('pick'), createInputBox: () => control('input'),
      showErrorMessage: message => {errors.push(message);},
      showWarningMessage() {},
      showOpenDialog: async () => {outputDialogs++; return undefined;},
      showInformationMessage: async () => undefined,
    },
    commands: {
      registerCommand: (name, callback) => {commands.set(name, callback); return disposable();},
      executeCommand: async () => undefined,
    },
    Uri: {file: fsPath => ({fsPath})},
  };
  const files = ['extension', 'flow/wizard', 'ui/quickPick', 'core/generator'];
  for (const file of files) delete require.cache[require.resolve(path.join(__dirname, '../out', `${file}.js`))];
  const original = Module._load;
  Module._load = function(request, ...args) { return request === 'vscode' ? vscode : original.call(this, request, ...args); };
  let extension, wizard;
  try {
    extension = require('../out/extension.js');
    wizard = require('../out/flow/wizard.js');
  } finally {Module._load = original;}
  extension.activate({subscriptions: []});
  return {trace, commands, errors, wizard, remaining: () => actions.length, outputDialogs: () => outputDialogs};
}

test('both command entries start with architecture, and cancellation never opens an output directory', async () => {
  const host = loadHost([{title: '选择系统架构', cancel: true}, {title: '选择系统架构', cancel: true}]);
  await host.commands.get('javaTechStack.start')();
  await host.commands.get('javaTechStack.preset')();
  assert.equal(host.trace.length, 2);
  assert.equal(host.outputDialogs(), 0);
  assert.deepEqual(host.errors, []);
  assert.equal(host.remaining(), 0);
});

test('preset preserves architecture; Back preserves entered name; review edits and previews the actual plan', async () => {
  const host = loadHost([
    {title: '选择系统架构', value: 'microservice'},
    {title: '选择业务场景', value: 'e-commerce'},
    {title: '项目名称', value: 'kept-project'},
    {title: '业务模块', back: true},
    {title: '项目名称', back: true},
    {title: '选择业务场景', value: 'e-commerce'},
    {title: '项目名称', check: input => assert.equal(input.value, 'kept-project')},
    {title: '业务模块', value: 'catalog,order'},
    {title: '微服务网关', value: 'yes'},
    {title: '构建工具', value: 'maven'},
    {title: '数据库', value: 'mysql-8'},
    {title: 'ORM', value: 'jpa'},
    {title: '缓存', value: 'none'},
    {title: '认证框架', value: 'spring-security'},
    {title: 'API 文档', value: 'none'},
    {title: '输出方式', value: 'project'},
    {title: '配置总览', value: 'edit:database'},
    {title: '数据库', value: 'postgresql'},
    {title: '配置总览', value: 'preview:files', check: input => {
      assert.match(input.items[0].description, /\d+ 个文件/);
      assert.match(input.items.find(item => item.value === 'preview:files').description, /catalog-service/);
    }},
    {title: '生成文件计划', back: true, check: input => assert.ok(input.items.some(item => item.label === 'catalog-service/pom.xml'))},
    {title: '配置总览', value: 'confirm'},
  ]);
  const config = await host.wizard.runWizard();
  assert.equal(config.project.type, 'microservice');
  assert.equal(config.presetId, 'e-commerce');
  assert.equal(config.project.name, 'kept-project');
  assert.equal(config.database.rdbms, 'postgresql');
  assert.deepEqual(config.project.modules, ['catalog', 'order']);
  assert.equal(config.microservice.gateway, true);
  assert.equal(host.outputDialogs(), 0, 'reviewing a wizard must not write or choose directories');
  assert.equal(host.remaining(), 0);
  assert.deepEqual(host.errors, []);
});

test('cancelling the final review never calls the production writer adapter', async () => {
  const host = loadHost([
    {title: '选择系统架构', value: 'monolith'},
    {title: '选择业务场景', value: 'custom'},
    {title: '项目名称'},
    {title: '业务模块'},
    {title: '构建工具'},
    {title: '数据库'},
    {title: 'ORM'},
    {title: '缓存'},
    {title: '认证框架'},
    {title: 'API 文档'},
    {title: '输出方式'},
    {title: '配置总览', cancel: true},
  ]);
  await host.commands.get('javaTechStack.start')();
  assert.equal(host.outputDialogs(), 0);
  assert.equal(host.remaining(), 0);
  assert.deepEqual(host.errors, []);
});
