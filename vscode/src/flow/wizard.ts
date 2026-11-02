import * as vscode from 'vscode';
import { ARCHITECTURE_LABELS } from '../core/capabilities';
import { DEFAULT_CONFIG, OPTIONS, PRESETS } from '../core/data';
import { TechStackConfig, ProjectType, Database, Orm, CacheType, SecurityFramework, ApiDoc } from '../core/types';
import { assertValidConfig, validateModules, validateProjectName } from '../core/validate';
import { Answer, choose, enter } from '../ui/quickPick';
import { planProject } from '../generation/plan';

type Step = 'architecture' | 'preset' | 'name' | 'modules' | 'gateway' | 'buildTool'
    | 'database' | 'orm' | 'cache' | 'security' | 'apiDoc' | 'output' | 'review';

function clone(config: TechStackConfig): TechStackConfig {
    return JSON.parse(JSON.stringify(config)) as TechStackConfig;
}

function stepsFor(config: TechStackConfig): Step[] {
    const steps: Step[] = ['architecture', 'preset', 'name', 'modules'];
    if (config.project.type === 'microservice') { steps.push('gateway'); }
    return [...steps, 'buildTool', 'database', 'orm', 'cache', 'security', 'apiDoc', 'output', 'review'];
}

function outputLabel(mode: TechStackConfig['outputMode']): string {
    switch (mode) {
        case 'config': return '仅配置 JSON';
        case 'prompt': return '仅项目提示词';
        default: return '创建工程';
    }
}

function reviewOptions(config: TechStackConfig): { label: string; description: string; value: string }[] {
    const modules = (config.project.modules || []).join(', ');
    const plan = planProject(config);
    const files = Object.keys(plan.files);
    const roots = [...new Set(files.map(file => file.includes('/') ? file.split('/')[0] + '/' : file))];
    return [
        { label: '$(check) 确认并生成', description: `${outputLabel(config.outputMode)} · ${files.length} 个文件；下一步选择输出目录`, value: 'confirm' },
        { label: '查看生成文件计划', description: roots.join('、'), value: 'preview:files' },
        { label: '修改架构', description: ARCHITECTURE_LABELS[config.project.type], value: 'edit:architecture' },
        { label: '修改业务预设', description: config.presetId || '空白配置', value: 'edit:preset' },
        { label: '修改项目名称', description: config.project.name, value: 'edit:name' },
        { label: '修改业务模块 / 服务', description: modules, value: 'edit:modules' },
        ...(config.project.type === 'microservice' ? [{ label: '修改网关', description: config.microservice?.gateway ? '生成网关' : '不生成网关', value: 'edit:gateway' }] : []),
        { label: '构建工具', description: 'Maven（Gradle 待实现）', value: 'edit:buildTool' },
        { label: '修改数据库', description: config.database.rdbms, value: 'edit:database' },
        { label: '修改 ORM', description: config.database.orm, value: 'edit:orm' },
        { label: '修改缓存', description: config.cache.type, value: 'edit:cache' },
        { label: '修改认证', description: config.security.framework, value: 'edit:security' },
        { label: '修改 API 文档', description: config.api.documentation, value: 'edit:apiDoc' },
        { label: '修改输出', description: outputLabel(config.outputMode), value: 'edit:output' }
    ];
}

async function ask(step: Step, config: TechStackConfig): Promise<Answer> {
    switch (step) {
        case 'architecture':
            return choose('1. 选择系统架构', OPTIONS.projectType, config.project.type, false);
        case 'preset':
            return choose('2. 选择业务场景预设（可在后续修改）', [
                { label: '空白配置', description: '从基本默认值开始', value: 'custom' },
                ...PRESETS.map(p => ({ label: `${p.icon} ${p.name}`, description: p.description, value: p.id }))
            ], config.presetId || 'custom');
        case 'name':
            return enter('3. 项目名称', config.project.name, validateProjectName);
        case 'modules':
            return enter('4. 业务模块 / 微服务名称（英文逗号分隔）', (config.project.modules || []).join(','), validateModules);
        case 'gateway':
            return choose('5. 微服务网关（当前使用静态服务地址；注册中心待实现）', [
                { label: '生成网关', description: '网关转发到两个独立服务', value: 'yes' },
                { label: '不生成网关', description: '仅生成独立服务', value: 'no' }
            ], config.microservice?.gateway ? 'yes' : 'no');
        case 'buildTool':
            return choose('构建工具', OPTIONS.buildTool, config.project.buildTool);
        case 'database':
            return choose('数据库', OPTIONS.database, config.database.rdbms);
        case 'orm':
            return choose('ORM', OPTIONS.orm, config.database.orm);
        case 'cache':
            return choose('缓存', OPTIONS.cache, config.cache.type);
        case 'security':
            return choose('认证框架', OPTIONS.security, config.security.framework);
        case 'apiDoc':
            return choose('API 文档', OPTIONS.apiDoc, config.api.documentation);
        case 'output':
            return choose('输出方式', [
                { label: '创建工程', description: '生成对应架构的 Maven 项目', value: 'project' },
                { label: '仅导出配置', description: '只写 tech-stack-config.json', value: 'config' },
                { label: '仅生成提示词', description: '只写 project-prompt.md，供后续手动使用', value: 'prompt' }
            ], config.outputMode || 'project');
        case 'review':
            return choose('配置总览：确认后选择输出目录；取消目录选择不会写入', reviewOptions(config));
    }
}

function apply(step: Step, value: string, config: TechStackConfig): TechStackConfig {
    switch (step) {
        case 'architecture': {
            config.project.type = value as ProjectType;
            if (value === 'microservice') {
                config.microservice = config.microservice || { gateway: true };
            } else {
                delete config.microservice;
            }
            return config;
        }
        case 'preset': {
            if ((config.presetId || 'custom') === value) { return config; }
            const architecture = config.project.type;
            const microservice = config.microservice;
            const outputMode = config.outputMode;
            const selected = PRESETS.find(preset => preset.id === value);
            config = clone(selected ? selected.config : DEFAULT_CONFIG);
            config.project.type = architecture;
            config.presetId = selected?.id;
            config.outputMode = outputMode;
            if (architecture === 'microservice') { config.microservice = microservice || { gateway: true }; }
            return config;
        }
        case 'name': config.project.name = value; break;
        case 'modules': config.project.modules = value.split(',').map(part => part.trim()); break;
        case 'gateway': config.microservice = { gateway: value === 'yes' }; break;
        case 'buildTool': config.project.buildTool = 'maven'; break;
        case 'database': config.database.rdbms = value as Database; break;
        case 'orm': config.database.orm = value as Orm; break;
        case 'cache':
            config.cache.type = value as CacheType;
            config.database.nosql = value === 'none' ? [] : ['redis'];
            break;
        case 'security': config.security.framework = value as SecurityFramework; break;
        case 'apiDoc': config.api.documentation = value as ApiDoc; break;
        case 'output': config.outputMode = value as TechStackConfig['outputMode']; break;
        case 'review': break;
    }
    return config;
}

/** Returns only a reviewed and validated configuration. No files are created here. */
export async function runWizard(): Promise<TechStackConfig | undefined> {
    let config = clone(DEFAULT_CONFIG);
    let index = 0;
    let editingFromReview = false;
    while (true) {
        const steps = stepsFor(config);
        const step = steps[index];
        const answer = await ask(step, config);
        if (answer.kind === 'cancel') { return undefined; }
        if (answer.kind === 'back') {
            editingFromReview = false;
            index = Math.max(0, index - 1);
            continue;
        }
        if (step === 'review') {
            if (answer.value === 'preview:files') {
                const files = Object.keys(planProject(config).files).sort();
                const preview = await choose(`生成文件计划：${files.length} 个文件（返回配置总览后确认）`, files.map(file => ({ label: file, value: file })));
                if (preview.kind === 'cancel') { return undefined; }
                continue;
            }
            if (answer.value === 'confirm') {
                try {
                    assertValidConfig(config);
                    return clone(config);
                } catch (error) {
                    void vscode.window.showErrorMessage(error instanceof Error ? error.message : String(error));
                    continue;
                }
            }
            const requested = answer.value.replace('edit:', '') as Step;
            index = steps.indexOf(requested);
            editingFromReview = true;
            continue;
        }
        config = apply(step, answer.value, config);
        index = editingFromReview ? stepsFor(config).indexOf('review') : index + 1;
        editingFromReview = false;
    }
}
