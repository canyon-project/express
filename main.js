import express from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express();

// app.use(express.static('public'));

app.use('/', (req, res, next) => {
    if (req.headers.host.includes('www.canyonalls.com')) {
        return res.redirect('https://canyonalls.com' + req.url);
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