import { createServer, Server, IncomingMessage, ServerResponse, request } from 'http';
import { readFile } from 'fs';
import io from 'socket.io';
import {User, UserGroup} from './Com/User';

const hostname: string = "localhost";
const port: number = 3000;
var count: number = 0;
var mainUsers:UserGroup=new UserGroup();

//创建一个http服务器对象
var server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(req.url);
    readFile('./index.html', function (err: NodeJS.ErrnoException, data: Buffer) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data, 'utf-8');
    });
});
//启动服务器对象监听
server.listen(port, hostname, () => {
    console.log(`服务已经启动： http://${hostname}:${port}/`);
});
 

//通过IO来监听连接
var ioSer=io.listen(server);
//监听socket的客户端的连接事件
ioSer.sockets.on('connection', function (socket: io.Socket) {
    count++;
    let user=new User(socket.client.id);
    user.UserName='anymouse';
    mainUsers.addOrUpdateUser(user);
    console.log(`${socket.client.id} 已连接，连接ID：${mainUsers.get(socket.client.id).ConnID} 连接数：${count}`);

    //用户连接时，给所有连接客户端推送一个事件
    ioSer.emit('online', { number: count});
    //上线后给当前客户端发送用户列表
    socket.emit('updateUser', mainUsers.all());
    //socket.emit('online', { number: count});
    //socket.broadcast.emit('online', { number: count });

    socket.on('updateUser',function(data){
        user.UserName=data.userName;
        mainUsers.addOrUpdateUser(user);
        //有用户修改用户信息后，通知诶所有连接客户端
        ioSer.emit('updateUser',  mainUsers.all());
    });

    socket.on('toUser',function(data){
        let toId:string=data.ToUserMsg.ConnID;
        if (ioSer.sockets.connected[toId]) {
            var msg={ToUserMsg:{ConnID:toId},FromUserMsg:{ConnID:user.ConnID,UserName:user.UserName},MsgContent:data.MsgContent}
            ioSer.sockets.connected[toId].emit('toMe',msg);
        }
    });

    //监听用户连接断开
    socket.on('disconnect', function () {
        count--;
        mainUsers.deleteUser(socket.client.id);
        console.log(`${socket.client.id} 已断开，连接数：${count}`);
        ioSer.emit('online', { number: count});
    });

});
// var char=ioSer.of('/char');
// char.on('connection', function (socket: io.Socket) {
//     socket.client.id
//     console.log('Char连接ID：' +socket.client.id);
//     socket.emit('notify', { number: "你好"});
//     socket.broadcast.emit('char', { number:"你好" });
//     socket.on('disconnect', function () {
//         console.log('用户已经连接');
//         socket.broadcast.emit('notify', { number:"你好" });
//     });
// });