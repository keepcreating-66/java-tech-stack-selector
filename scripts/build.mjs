import {build, context} from 'esbuild';
import {readdirSync, mkdirSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
function entries(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?entries(`${dir}/${e.name}`):e.name.endsWith('.ts')?[`${dir}/${e.name}`]:[]); }
const common={bundle:true,platform:'node',format:'cjs',target:'node22',minify:false,sourcemap:false,legalComments:'inline'};
const jobs=[{...common,target:'node18',entryPoints:entries('vscode/src'),outbase:'vscode/src',outdir:'vscode/out',external:['vscode']},
 {...common,entryPoints:['packages/core/src/index.ts'],outfile:'packages/core/dist/index.cjs'},
 {...common,entryPoints:['cli/src/main.ts'],outfile:'skills/java-tech-stack-selector/scripts/generate.cjs',banner:{js:'#!/usr/bin/env node\n// Generated from shared core; MIT. No network or runtime package installation.'}}];
if(process.argv.includes('--watch')) { for(const job of jobs) await (await context(job)).watch(); }
else { for(const job of jobs) await build(job); }
