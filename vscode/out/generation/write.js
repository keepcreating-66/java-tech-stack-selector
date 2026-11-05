"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vscode/src/generation/write.ts
var write_exports = {};
__export(write_exports, {
  writeProject: () => writeProject
});
module.exports = __toCommonJS(write_exports);

// packages/core/src/generation/write.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function writeProject(plan, outputRoot) {
  if (!fs.statSync(outputRoot).isDirectory()) {
    throw new Error(`\u8F93\u51FA\u4F4D\u7F6E\u4E0D\u662F\u76EE\u5F55\uFF1A${outputRoot}`);
  }
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(plan.projectName)) {
    throw new Error("\u9879\u76EE\u540D\u4E0D\u5B89\u5168");
  }
  const target = path.join(outputRoot, plan.projectName);
  const entries = Object.entries(plan.files);
  for (const [relative] of entries) {
    if (!relative || relative.includes("\\") || relative.includes(":") || path.posix.isAbsolute(relative) || path.win32.isAbsolute(relative) || relative === ".." || relative.startsWith("../") || path.posix.normalize(relative) !== relative) {
      throw new Error(`\u751F\u6210\u8DEF\u5F84\u4E0D\u5B89\u5168\uFF1A${relative}`);
    }
  }
  try {
    fs.lstatSync(target);
    throw new Error(`\u76EE\u6807\u9879\u76EE\u5DF2\u5B58\u5728\uFF0C\u672A\u8986\u76D6\uFF1A${target}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  const stage = fs.mkdtempSync(path.join(outputRoot, `.${plan.projectName}-staging-`));
  let reserved = false;
  const createdFiles = [];
  const createdDirs = [];
  try {
    for (const [relative, content] of entries) {
      const file = path.join(stage, relative);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content, { flag: "wx" });
    }
    fs.mkdirSync(target);
    reserved = true;
    for (const [relative] of entries) {
      const parts = relative.split("/");
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
    for (const file of createdFiles.reverse()) {
      try {
        fs.unlinkSync(file);
      } catch {
      }
    }
    for (const directory of createdDirs.reverse()) {
      try {
        fs.rmdirSync(directory);
      } catch {
      }
    }
    if (reserved) {
      try {
        fs.rmdirSync(target);
      } catch {
      }
    }
    throw error;
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeProject
});
