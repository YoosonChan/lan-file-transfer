import fs from 'fs';
import path from 'path';

// 获取当前目录以及子目录下所有文件路径
export function getAllPathFromDir(dirPath: string) {
  const paths: string[] = [];
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  files.forEach(file => {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      paths.push(...getAllPathFromDir(filePath));
    } else {
      paths.push(filePath);
    }
  });
  return paths;
}