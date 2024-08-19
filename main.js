import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express();

const redirectApp = express(); // 创建一个新的 Express 应用用于重定向

// 使用 HTTP 服务器处理重定向
redirectApp.use((req, res) => {
    const httpsUrl = `https://${req.headers.host}`;
    res.redirect(301,httpsUrl); // 301 是永久重定向
});

app.use('/', (req, res, next) => {
    if (req.headers.host.includes('www.canyonalls.com')) {
        return res.redirect(301,'https://canyonalls.com' + req.url);
    }
    // Use the proxy middleware
    createProxyMiddleware({
        target: 'http://localhost:8080', // The target server
        changeOrigin: true,
    })(req, res, next);
});

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

// 创建 HTTP 服务器并重定向到 HTTPS
http.createServer(redirectApp).listen(80, () => {
    console.log('HTTP server running on port 80 and redirecting to HTTPS');
});