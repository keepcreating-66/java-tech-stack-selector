const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), os=require('node:os'), path=require('node:path'), {spawnSync}=require('node:child_process');
const core=require('../packages/core/dist/index.cjs');
const script=path.resolve('skills/java-tech-stack-selector/scripts/generate.cjs');
function run(args,c=core.DEFAULT_CONFIG,entry=script,cwd=os.tmpdir()){const p=spawnSync(process.execPath,[entry,...args],{cwd,input:JSON.stringify(c),encoding:'utf8'});return {status:p.status,value:JSON.parse(p.stdout)};}
test('three architectures and all output modes use shared core content',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'技能 测试-'));
 try {for(const type of ['monolith','modular-monolith','microservice'])for(const mode of ['config','prompt','project']){
 const c=structuredClone(core.DEFAULT_CONFIG);c.project.name='test-'+type+'-'+mode;c.project.type=type;c.outputMode=mode;if(type==='microservice')c.microservice={gateway:true};
 const expected=core.planProject(c);const result=run(['generate','--config','-','--output-root',root],c);assert.equal(result.status,0);for(const [name,text]of Object.entries(expected.files))assert.equal(fs.readFileSync(path.join(result.value.projectDir,name),'utf8'),text);
 const conflict=run(['generate','--config','-','--output-root',root],c);assert.equal(conflict.status,4);
 }}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('standalone temporary script needs no adjacent files; readonly commands and errors',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'standalone-')),entry=path.join(root,'run.cjs');fs.copyFileSync(script,entry);
 try {assert.equal(run(['plan','--config','-'],undefined,entry,root).status,0);assert.deepEqual(fs.readdirSync(root),['run.cjs']);assert.equal(run(['unknown'],undefined,entry).status,2);assert.equal(run(['validate','--config','-'],{project:{}},entry).status,3);assert.equal(run(['generate','--config','-'],undefined,entry).status,2);assert.equal(run(['plan','--config','-','--output-root',root],undefined,entry).status,2);}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('baseline files remain identical after extraction',()=>{const f=path.join(__dirname,'fixtures/baseline-4be9731.json');const baseline=JSON.parse(fs.readFileSync(f));for(const type of Object.keys(baseline)){const c=structuredClone(core.DEFAULT_CONFIG);c.project.type=type;if(type==='microservice')c.microservice={gateway:true};assert.deepEqual(core.planProject(c).files,baseline[type]);}});
test('concurrent CLI generators reserve a project exactly once', async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'skill-race-'));
 const {spawn}=require('node:child_process');
 const start=()=>new Promise((resolve,reject)=>{const p=spawn(process.execPath,[script,'generate','--config','-','--output-root',root],{stdio:['pipe','pipe','pipe']});let out='';p.stdout.on('data',x=>out+=x);p.stderr.resume();p.on('error',reject);p.on('close',code=>resolve({code,value:JSON.parse(out)}));p.stdin.end(JSON.stringify(core.DEFAULT_CONFIG));});
 try {const results=await Promise.all([start(),start(),start()]);assert.equal(results.filter(x=>x.code===0).length,1);assert.equal(results.filter(x=>x.code===4).length,2);assert.deepEqual(fs.readdirSync(root),[core.DEFAULT_CONFIG.project.name]);const expected=core.planProject(core.DEFAULT_CONFIG).files;for(const [name,text]of Object.entries(expected))assert.equal(fs.readFileSync(path.join(root,core.DEFAULT_CONFIG.project.name,name),'utf8'),text);}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('capabilities only advertises version entries used by supported generators',()=>{
 const r=run(['capabilities']);assert.equal(r.status,0);
 assert.equal(r.value.versions['spring-boot-2'],undefined);
 assert.ok(r.value.versions['spring-boot-3']);
});
