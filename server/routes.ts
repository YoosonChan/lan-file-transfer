import { Router } from 'express';
import { downloadFile, getFiles, uploadFile } from './controllers';

const router = Router();

// 文件上传接口
router.post('/upload', uploadFile);

// 获取可用文件列表
router.get('/files', getFiles);

// 文件下载接口
router.get('/download/:filename', downloadFile);

export default router;