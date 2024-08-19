import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.static('public'));

app.get('/vi/health', (req, res) => {
    res.send('Hello World');
});
// 获取当前目录路径
const __dirname = path.resolve();

// 加载SSL证书和私钥
const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
};

// 设置路由

// 创建HTTPS服务器
https.createServer(options, app).listen(443, () => {
    console.log('HTTPS server running on port 443');
});