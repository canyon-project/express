import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express();

// app.use(express.static('public'));

// 中间件函数，用于将非 www 域名请求重定向到 www 域名
app.use((req, res, next) => {
    const host = req.headers.host;

    // 检查请求是否来自目标域名，并且是否需要重定向
    if (host === 'canyonalls.com') {
        const newUrl = `https://www.canyonalls.com${req.url}`;
        return res.redirect(301, newUrl);
    }
    next();
});

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