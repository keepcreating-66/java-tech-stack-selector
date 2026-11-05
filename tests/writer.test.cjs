const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {writeProject, DEFAULT_CONFIG} = require('../packages/core/dist/index.cjs');

test('writer rejects Windows absolute paths and alternate data streams on every OS', () => {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'portable-paths-'));
 try {
  for(const relative of ['C:/escape.txt','C:\\escape.txt','safe.txt:stream','../escape.txt','a/../escape.txt']) {
   assert.throws(()=>writeProject({projectName:'safe-demo',config:DEFAULT_CONFIG,files:{[relative]:'x'}},root),/不安全/);
   assert.deepEqual(fs.readdirSync(root),[]);
  }
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});

test('failed publication removes only owned files and preserves concurrent additions', () => {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'writer-failure-'));
 const original=fs.copyFileSync;
 try {
  fs.copyFileSync=(source,target,flags)=>{
   if(target.endsWith('b.txt')) {
    fs.writeFileSync(path.join(root,'safe-demo','user.txt'),'independent addition');
    throw Object.assign(new Error('injected copy failure'),{code:'EIO'});
   }
   return original(source,target,flags);
  };
  assert.throws(()=>writeProject({projectName:'safe-demo',config:DEFAULT_CONFIG,files:{'nested/a.txt':'a','b.txt':'b'}},root),/injected/);
  assert.deepEqual(fs.readdirSync(root),['safe-demo']);
  assert.deepEqual(fs.readdirSync(path.join(root,'safe-demo')),['user.txt']);
  assert.equal(fs.readFileSync(path.join(root,'safe-demo','user.txt'),'utf8'),'independent addition');
 } finally {fs.copyFileSync=original;fs.rmSync(root,{recursive:true,force:true});}
});
