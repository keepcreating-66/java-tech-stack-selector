import * as fs from 'fs';
import * as path from 'path';

/**
 * 确保目录存在
 */
export function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * 写入文件
 */
export function writeFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 读取文件
 */
export function readFile(filePath: string): string {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return '';
}

/**
 * 检查文件是否存在
 */
export function exists(filePath: string): boolean {
    return fs.existsSync(filePath);
}
