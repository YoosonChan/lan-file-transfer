import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, 'files');

// 文件上传
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

// 文件下载
export function downloadFile(req: any, res: any) {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`文件不存在: ${filePath}`);
      return res.status(404).json({ message: '文件不存在' });
    }

    res.download(filePath, (err: any) => {
      if (err) {
        console.error('文件下载错误:', err);
        res.status(500).json({ message: '文件下载失败', error: err.message });
      }
    });
  } catch (error: any) {
    console.error('下载处理错误:', error);
    res.status(500).json({ message: '文件下载失败', error: error.message });
  }
}

