import * as fs from 'fs';
import * as path from 'path';
import { ProjectPlan } from './plan';

/** Reserve a new directory exclusively; never replace an existing file or directory. */
export function writeProject(plan: ProjectPlan, outputRoot: string): string {
    if (!fs.statSync(outputRoot).isDirectory()) {
        throw new Error(`输出位置不是目录：${outputRoot}`);
    }
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(plan.projectName)) {
        throw new Error('项目名不安全');
    }
    const target = path.join(outputRoot, plan.projectName);
    const entries = Object.entries(plan.files);
    for (const [relative] of entries) {
        if (!relative || relative.includes('\\') || relative.includes(':') || path.posix.isAbsolute(relative)
            || path.win32.isAbsolute(relative) || relative === '..' || relative.startsWith('../')
            || path.posix.normalize(relative) !== relative) {
            throw new Error(`生成路径不安全：${relative}`);
        }
    }
    // lstat also detects dangling links. mkdir below remains the authoritative race check.
    try {
        fs.lstatSync(target);
        throw new Error(`目标项目已存在，未覆盖：${target}`);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') { throw error; }
    }
    const stage = fs.mkdtempSync(path.join(outputRoot, `.${plan.projectName}-staging-`));
    let reserved = false;
    const createdFiles: string[] = [];
    const createdDirs: string[] = [];
    try {
        for (const [relative, content] of entries) {
            const file = path.join(stage, relative);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, content, { flag: 'wx' });
        }
        fs.mkdirSync(target);
        reserved = true;
        // Windows cannot rename a directory onto the reserved empty directory.
        // Publish with exclusive copies on every platform; do not overwrite concurrent additions.
        for (const [relative] of entries) {
            const parts = relative.split('/');
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
        for (const file of createdFiles.reverse()) { try { fs.unlinkSync(file); } catch { /* Preserve other entries. */ } }
        for (const directory of createdDirs.reverse()) { try { fs.rmdirSync(directory); } catch { /* Preserve nonempty directories. */ } }
        if (reserved) { try { fs.rmdirSync(target); } catch { /* Preserve independent additions. */ } }
        throw error;
    } finally {
        fs.rmSync(stage, { recursive: true, force: true });
    }
}
