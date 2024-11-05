import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { getAllPathFromDir } from './utils/file';
import { uploadDir } from './global';

// 上传文件
export function uploadFile(req: any, res: any) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      console.error('上传失败：没有文件');
      return res.status(400).json({ message: '没有文件被上传' });
    }
    const uploadedFile = req.files.files;
    const fileName = uploadedFile.name as string;
    const filePath = path.join(uploadDir, fileName);
    uploadedFile.mv(filePath, (err: any) => {
      if (err) {
        console.error('文件上传错误:', err);
        return res.status(500).json({ message: '文件上传失败', error: err.message });
      }

      console.log('文件上传成功:', {
        filename: fileName,
        size: uploadedFile.size,
        path: filePath
      });

      res.json({
        message: '文件上传成功',
        filename: fileName,
        size: uploadedFile.size,
        path: filePath
      });
    });
  } catch (error: any) {
    console.error('文件上传错误:', error);
    res.status(500).json({ message: '文件处理错误', error: error.message });
  }
};

// 获取文件列表
export function getFiles(req: any, res: any) {
  // TODO: 出于安全性，返回字段不应该返回path
  console.log('------req------', req.url);
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error('读取文件列表错误:', err);
        return res.status(500).json({ message: '无法读取文件列表', error: err.message });
      }
      console.log('------files------', files);
      // 遍历目录获取文件结构
      const getDirectoryStructure = (dirPath: string, prefix = '📄 ') => {
        const items = fs.readdirSync(dirPath);
        const structure: any[] = [];

        items.forEach(item => {
          const fullPath = path.join(dirPath, item);
          const stats = fs.statSync(fullPath);

          if (stats.isDirectory()) {
            structure.push({
              name: '📁 ' + item,
              type: 'directory',
              size: 0,
              createTime: stats.birthtime,
              children: getDirectoryStructure(fullPath)
            });
          } else {
            structure.push({
              name: prefix + item,
              path: fullPath.replace(uploadDir, ''),
              type: 'file',
              size: stats.size,
              createTime: stats.birthtime
            });
          }
        });

        return structure;
      };
      res.json(getDirectoryStructure(uploadDir))
    });
  } catch (error: any) {
    console.error('获取文件列表错误:', error);
    res.status(500).json({ message: '获取文件列表失败', error: error.message });
  }
}

// 下载单个文件
export function downloadFile(req: any, res: any) {
  try {
    const filePath = path.join(uploadDir, req.query.path);
    if (!fs.existsSync(filePath)) {
      console.error(`文件不存在: ${filePath}`);
      return res.status(404).json({ message: '文件不存在' });
    }
    // header设置
    res.setHeader('Content-Type', 'application/octet-stream');
    // 需要设置允许前端读取特定响应头，否则前端的response.headers无法读取Content-Disposition
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-Disposition', `attachment; filename="${req.query.path.split('\\').pop()}"`);
    // 读取文件
    const fileBuffer = fs.readFileSync(filePath);
    res.send(fileBuffer);
  } catch (error: any) {
    console.error('下载处理错误:', error);
    res.status(500).json({ message: '文件下载失败', error: error.message });
  }
}

// 下载所有文件
export function downloadAllFiles(req: any, res: any) {
  console.log('------downloadAllFiles------', req.url);
  const files = getAllPathFromDir(uploadDir)
  // 遍历并打包当前目录以及子目录下所有文件
  const zip = new AdmZip();
  files.forEach(file => {
    if (file.type === 'directory') {
      zip.addLocalFolder(file.fullPath, file.path);
    } else {
      zip.addLocalFile(file.fullPath, file.path);
    }
  });
  const zipBuffer = zip.toBuffer();
  // header设置
  res.setHeader('Content-Type', 'application/zip');
  // 需要设置允许前端读取特定响应头，否则前端的response.headers无法读取Content-Disposition
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader('Content-Disposition', `attachment; filename=all_files_${new Date().getTime()}.zip`);
  // 发送zip文件
  res.send(zipBuffer);
}

// 删除单个文件
export function deleteFile(req: any, res: any) {
  const filePath = path.join(uploadDir, req.query.path);
  fs.unlinkSync(filePath);
  res.json({ message: '文件删除成功' });
}

// 删除所有文件
export function deleteAllFiles(req: any, res: any) {
  console.log('------deleteAllFiles------', req.url);
  fs.rmSync(uploadDir, { recursive: true, force: true });
  res.json({ message: '所有文件删除成功' });
}

