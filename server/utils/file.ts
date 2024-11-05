import { uploadDir } from '../global';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
interface FileItem {
  path: string;
  fullPath: string;
  type: 'directory' | 'file';
}

// 获取当前目录以及子目录下所有文件路径
export function getAllPathFromDir(dirPath: string, rootPath = uploadDir) {
  const paths: FileItem[] = [];
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  files.forEach(file => {
    const filePath = path.join(file.parentPath, file.name);
    if (file.isDirectory()) {
      paths.push({ path: filePath.replace(uploadDir, ''), fullPath: filePath, type: 'directory' });
      paths.push(...getAllPathFromDir(filePath, rootPath));
    } else {
      paths.push({ path: file.parentPath.replace(uploadDir, ''), fullPath: filePath, type: 'file' });
    }
  });
  return paths;
}

export function zipFiles(files: FileItem[]) {
  // 遍历并打包当前目录以及子目录下所有文件
  const zip = new AdmZip();
  files.forEach(file => {
    if (file.type === 'directory') {
      zip.addLocalFolder(file.fullPath, file.path);
    } else {
      zip.addLocalFile(file.fullPath, file.path);
    }
  });
  return zip.toBuffer();
}
