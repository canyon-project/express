import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express();

// app.use(express.static('public'));

// 设置反向代理
app.use('*', createProxyMiddleware({
    target: 'https://homepage-production-fc60.up.railway.app', // 目标域名
    changeOrigin: true
}));

// 获取当前目录路径
const __dirname = path.resolve();

// 加载SSL证书和私钥
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/canyonalls.com-0001/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/canyonalls.com-0001/fullchain.pem')
};

// 设置路由

// 创建HTTPS服务器
https.createServer(options, app).listen(443, () => {
    console.log('HTTPS server running on port 443');
});