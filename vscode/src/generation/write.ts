import * as fs from 'fs';
import * as path from 'path';
import { ProjectPlan } from './plan';

/** Writes only into a new project directory. Existing user files are never replaced. */
export function writeProject(plan: ProjectPlan, outputRoot: string): string {
    if (!fs.statSync(outputRoot).isDirectory()) {
        throw new Error(`输出位置不是目录：${outputRoot}`);
    }
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(plan.projectName)) {
        throw new Error('项目名不安全');
    }
    const target = path.join(outputRoot, plan.projectName);
    if (fs.existsSync(target)) {
        throw new Error(`目标项目已存在，未覆盖：${target}`);
    }
    const entries = Object.entries(plan.files);
    for (const [relative] of entries) {
        const normalized = path.posix.normalize(relative.replaceAll('\\', '/'));
        if (!relative || path.isAbsolute(relative) || normalized === '..' || normalized.startsWith('../') || normalized !== relative.replaceAll('\\', '/')) {
            throw new Error(`生成路径不安全：${relative}`);
        }
    }
    const stage = fs.mkdtempSync(path.join(outputRoot, `.${plan.projectName}-staging-`));
    let reserved = false;
    try {
        for (const [relative, content] of entries) {
            const file = path.join(stage, relative);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, content, { flag: 'wx' });
        }
        // mkdir is exclusive, including for dangling links and concurrent generators.
        fs.mkdirSync(target);
        reserved = true;
        fs.renameSync(stage, target);
        return target;
    } catch (error) {
        fs.rmSync(stage, { recursive: true, force: true });
        if (reserved) {
            try { fs.rmdirSync(target); } catch { /* Preserve any independently added files. */ }
        }
        throw error;
    }
}
