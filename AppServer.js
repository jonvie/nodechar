"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const fs_1 = require("fs");
const socket_io_1 = __importDefault(require("socket.io"));
const User_1 = require("./Com/User");
const hostname = "localhost";
const port = 3000;
var count = 0;
var mainUsers = new User_1.UserGroup();
var server = http_1.createServer((req, res) => {
    console.log(req.url);
    fs_1.readFile('./index.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data, 'utf-8');
    });
});
server.listen(port, hostname, () => {
    console.log(`服务已经启动： http://${hostname}:${port}/`);
});
var ioSer = socket_io_1.default.listen(server);
ioSer.sockets.on('connection', function (socket) {
    count++;
    let user = new User_1.User(socket.client.id);
    user.UserName = 'anymouse';
    mainUsers.addOrUpdateUser(user);
    console.log(`${socket.client.id} 已连接，连接ID：${mainUsers.get(socket.client.id).ConnID} 连接数：${count}`);
    ioSer.emit('online', { number: count });
    socket.emit('updateUser', mainUsers.all());
    socket.on('updateUser', function (data) {
        user.UserName = data.userName;
        mainUsers.addOrUpdateUser(user);
        ioSer.emit('updateUser', mainUsers.all());
    });
    socket.on('toUser', function (data) {
        let toId = data.ToUserMsg.ConnID;
        if (ioSer.sockets.connected[toId]) {
            var msg = { ToUserMsg: { ConnID: toId }, FromUserMsg: { ConnID: user.ConnID, UserName: user.UserName }, MsgContent: data.MsgContent };
            ioSer.sockets.connected[toId].emit('toMe', msg);
        }
    });
    socket.on('disconnect', function () {
        count--;
        mainUsers.deleteUser(socket.client.id);
        console.log(`${socket.client.id} 已断开，连接数：${count}`);
        ioSer.emit('online', { number: count });
    });
});
//# sourceMappingURL=AppServer.js.map