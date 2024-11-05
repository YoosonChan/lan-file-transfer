import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './routes';
import { getIp } from './utils/ip';

const app = express();
const port = 3000;
// 启用 CORS
app.use(cors());
app.use(express.json());
// 静态文件服务
const uploadDir = path.join(__dirname, 'files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use(express.static(uploadDir));
// 添加 express-fileupload 中间件
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB 最大限制
  }
}));
// 使用路由
app.use('/api', router);
// 启动服务器
app.listen(port, getIp(), (err?: Error) => {
  if (err) {
    console.error('服务器启动失败:', err);
    return;
  }
  console.log(`服务器运行在 http://${getIp()}:${port}`);
}).on('error', (error: Error) => {
  console.error('服务器错误:', error);
});
