"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectName = validateProjectName;
exports.validateModules = validateModules;
exports.validateConfig = validateConfig;
exports.assertValidConfig = assertValidConfig;
const capabilities_1 = require("./capabilities");
const schema_1 = require("./schema");
const SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const JAVA_RESERVED = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null _').split(' '));
const validPackage = (value) => !JAVA_RESERVED.has(value.replaceAll('-', ''));
function validateProjectName(value) {
    if (!SLUG.test(value) || value.length > 50) {
        return '使用小写字母、数字和中间连字符，首尾须为字母或数字，最长 50 字符';
    }
    if (!validPackage(value)) {
        return '名称去除连字符后不能是 Java 保留字';
    }
    return undefined;
}
function validateModules(value) {
    const modules = value.split(',').map(part => part.trim());
    if (modules.length < 2 || modules.length > 20 || modules.some(part => !SLUG.test(part)) || new Set(modules.map(part => part.replaceAll('-', ''))).size !== modules.length) {
        return '请输入 2–20 个模块名，用英文逗号分隔；去除连字符后也不能重复，如 user,order';
    }
    if (modules.some(part => part.length > 30 || part === 'common' || part === 'bootstrap' || part === 'gateway')) {
        return '模块名最长 30 字符，且不能使用 common、bootstrap、gateway';
    }
    if (modules.some(part => !validPackage(part))) {
        return '模块名去除连字符后不能是 Java 保留字';
    }
    return undefined;
}
/** Validation runs again at the generation boundary, including for non-UI callers. */
function validateConfig(config) {
    const errors = (0, schema_1.configShapeErrors)(config);
    if (errors.length) {
        return errors;
    }
    const nameError = validateProjectName(config.project.name);
    if (nameError) {
        errors.push(`项目名称：${nameError}`);
    }
    if (config.schemaVersion !== undefined && config.schemaVersion !== 1) {
        errors.push('不支持的配置版本');
    }
    if (!(0, capabilities_1.isSupported)(config)) {
        errors.push('所选 Java、构建工具或组件尚未支持生成；请重新选择');
    }
    const modules = config.project.modules || [];
    const moduleError = validateModules(modules.join(','));
    if (moduleError) {
        errors.push(`业务模块：${moduleError}`);
    }
    if (config.project.type === 'microservice' && !config.microservice) {
        errors.push('微服务配置缺少 gateway 选项');
    }
    if (config.microservice && typeof config.microservice.gateway !== 'boolean') {
        errors.push('gateway 必须为布尔值');
    }
    if (config.project.type !== 'microservice' && config.microservice) {
        errors.push('非微服务架构不能包含网关配置');
    }
    if (config.project.type === 'microservice' && modules.some(module => config.project.name.length + 1 + module.length > 63)) {
        errors.push('项目名与服务名合计加分隔符不得超过 63 字符，以符合默认数据库命名限制');
    }
    if (config.outputMode && !['project', 'config', 'prompt'].includes(config.outputMode)) {
        errors.push('不支持的输出方式');
    }
    return errors;
}
function assertValidConfig(config) {
    const errors = validateConfig(config);
    if (errors.length) {
        throw new Error(errors.join('；'));
    }
}
//# sourceMappingURL=validate.js.map