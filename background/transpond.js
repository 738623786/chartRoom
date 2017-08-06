/**
 * Created by fjl on 17/4/13.
 * socket.io数据中转站（完成用户数据的转发）
 */


var transpond = {};

transpond.ioServer =  function (httpServer) {
   var io = require('socket.io')(httpServer);
   var groupMsgs = [];
   var menbers = [];
   io.on('connection',function(socket) {

        // socket.join('help_other',function () {
        //     console.log(socket.rooms);
        // });

        socket.on('group message', function(msg) {
            msg.success = true;

            groupMsgs.push(msg);
            //向群组的其他人发送消息
            socket.broadcast.emit('group message',msg);
            //通知发消息的人，消息已经发送成功
            io.to(msg.userInfo.socketID).emit('send success', msg);
        });

        socket.on('single message', function(msg) {

            for(i in menbers){
                if(menbers[i].username === msg.chatUsername){
                    msg.success = true;
                    console.log(msg.userInfo.username);
                    console.log(menbers[i].username);
                    //将消息发送给接收人
                    io.to(menbers[i].socketID).emit('single message', msg);
                    //通知发消息的人，消息已经发送成功
                    io.to(msg.userInfo.socketID).emit('send success', msg);
                    break;
                }
            }

        });



        socket.on('userinfo', function(userInfo) {



            var userExist = false;
            for (var i=0;i<menbers.length;i++){
                if(menbers[i].username === userInfo.username){
                    userExist = true;
                    menbers[i] = userInfo;
                }
            }

            if (!userExist){
                menbers.push(userInfo);
            }


            io.to(userInfo.socketID).emit('menbers', menbers);
            io.to(userInfo.socketID).emit('groupmsgs', groupMsgs);
            socket.broadcast.emit('userinfo',userInfo);

        });


        socket.on('disconnect',function() {
            console.log(socket.id + " disconnected");

            for (var i=0;i<menbers.length;i++){
                if(menbers[i].socketID === socket.id){
                    //离线移除该成员
                    menbers[i].online = false;
                    break;
                }
            }

            io.emit('disconnect',socket.id);

        });
    });

}

module.exports = transpond;


