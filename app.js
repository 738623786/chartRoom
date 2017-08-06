/**
 * Created by fjl on 17/4/13.
 * 监听服务端口,绑定入口显示的网页
 */
var express = require('express');
var app = express();
var httpServer = require('http').createServer(app);
var options = {
    pfx: require('fs').readFileSync(__dirname+'/huxinhuzhu.cn.pfx'),
    passphrase: '88750262010083f'
};
var httpsServer =require('https').createServer(options, app);

//建立socket.io的数据转站(后台程序)
var transpond = require("./background/transpond");
transpond.ioServer(httpServer);
transpond.ioServer(httpsServer);

//响应客户端的请求(访问该服务地址的客户端)
app.get('/',function (req,res) {
    //将特定网页发送(响应)给客户端
    res.sendFile(__dirname + '/foreground/chatRoom.html');
});
//公开特定目录(让客户端能够访问该目录下的资源)
app.use(express.static(__dirname + '/foreground'));


//监听端口(网页程序端口号)
httpServer.listen(3000, function() {
    console.log('http listening:'+3000);
});
httpsServer.listen(8000, function() {
    console.log('https listening:'+8000);
});







