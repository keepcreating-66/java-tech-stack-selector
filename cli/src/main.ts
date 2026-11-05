import * as fs from 'node:fs';
import * as path from 'node:path';
import {CAPABILITIES,PRESETS,VERSION_MAP,planProject,writeProject} from '../../packages/core/src/index';
const version='1.2.0-rc.1';
class Failure extends Error { constructor(public exit:number,public code:string,message:string) {super(message);} }
const fail=(exit:number,code:string,message:string):never=>{throw new Failure(exit,code,message);};
const args=process.argv.slice(2), command=args.shift() ?? '--help';
const base={command,generatorVersion:version,schemaVersion:1};
try {
 let result:Record<string,unknown>={};
 const flags:Record<string,string>={};
 if(command==='--help') {
  if(args.length) fail(2,'ARGUMENT','Unexpected arguments');
  result={usage:['capabilities','preset <enterprise-admin|e-commerce|ai-application>','validate --config <file|->','plan --config <file|->','generate --config <file|-> --output-root <existing-directory>','--version']};
 } else if(command==='--version'||command==='capabilities') {
  if(args.length) fail(2,'ARGUMENT','Unexpected arguments');
  result=command==='capabilities'?{capabilities:CAPABILITIES,versions:Object.fromEntries(['spring-boot-3','mybatis-plus','redisson','sa-token','knife4j'].map(key=>[key,VERSION_MAP[key]])),presets:PRESETS.map(p=>({id:p.id,name:p.name}))}:{};
 } else if(command==='preset') {
  if(args.length!==1) fail(2,'ARGUMENT','preset requires exactly one id');
  const preset=PRESETS.find(p=>p.id===args[0]);
  if(!preset) fail(2,'ARGUMENT','Unknown preset');
  result={config:structuredClone(preset!.config)};
 } else {
  if(!['validate','plan','generate'].includes(command)) fail(2,'ARGUMENT','Unknown command');
  while(args.length) {
   const key=args.shift()!;
   if(!['--config',...(command==='generate'?['--output-root']:[])].includes(key)||key in flags||!args.length) fail(2,'ARGUMENT','Invalid, duplicate or missing option');
   flags[key]=args.shift()!;
  }
  if(!flags['--config'] || (command==='generate'&&!flags['--output-root'])) fail(2,'ARGUMENT','Missing required option');
  let input:unknown;
  try {input=JSON.parse(fs.readFileSync(flags['--config']==='-'?0:flags['--config'],'utf8'));}
  catch(e) { if(e instanceof SyntaxError) fail(3,'CONFIG_JSON','Invalid JSON'); throw e; }
  let plan;
  try {plan=planProject(input as any);} catch(e) {fail(3,'CONFIG',(e as Error).message);}
  result={config:plan!.config};
  if(command!=='validate') result={...result,files:Object.keys(plan!.files).sort(),fileCount:Object.keys(plan!.files).length};
  if(command==='generate') {
   const parent=path.resolve(flags['--output-root']);
   let directory:string;
   try {directory=writeProject(plan!,parent);} catch(e) {
    const code=(e as NodeJS.ErrnoException).code;
    if(['EEXIST','ENOTDIR','ENOENT'].includes(code??'') || /已存在|不安全|不是目录/.test((e as Error).message)) fail(4,'PATH',(e as Error).message);
    throw e;
   }
   result={...result,projectDir:directory!,build:{status:'not_run'},runtime:{status:'not_run'}};
  }
 }
 process.stdout.write(JSON.stringify({ok:true,...base,...result})+'\n');
} catch(e) {
 const failure=e instanceof Failure?e:new Failure(5,'IO_OR_INTERNAL','Operation failed; check input file access and output permissions');
 process.stdout.write(JSON.stringify({ok:false,...base,error:{code:failure.code,message:failure.message}})+'\n');
 process.stderr.write(failure.code+': '+failure.message+'\n'); process.exitCode=failure.exit;
}
