import { Router } from 'express';
import { deleteAllFiles, deleteDir, deleteFile, downloadAllFiles, downloadDir, downloadFile, getFiles, uploadFile } from './controllers';

const router = Router();

// 获取可用文件列表
router.get('/files', getFiles);
// 上传文件接口
router.post('/upload', uploadFile);
// 下载单个文件接口
router.get('/download', downloadFile);
// 下载单个文件夹接口
router.get('/downloadDir', downloadDir);
// 下载所有文件接口
router.get('/downloadAll', downloadAllFiles);
// 删除单个文件接口
router.delete('/delete', deleteFile);
// 删除单个文件夹接口
router.delete('/deleteDir', deleteDir);
// 删除所有文件接口
router.delete('/deleteAll', deleteAllFiles);

export default router;