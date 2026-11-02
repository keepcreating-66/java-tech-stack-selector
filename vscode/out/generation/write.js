"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeProject = writeProject;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/** Writes only into a new project directory. Existing user files are never replaced. */
function writeProject(plan, outputRoot) {
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
    }
    catch (error) {
        fs.rmSync(stage, { recursive: true, force: true });
        if (reserved) {
            try {
                fs.rmdirSync(target);
            }
            catch { /* Preserve any independently added files. */ }
        }
        throw error;
    }
}
//# sourceMappingURL=write.js.map