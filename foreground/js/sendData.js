/**
 * Created by fjl on 17/4/13.
 * 用户数据发送器
 */


$(function () {

    $('#form_msg').submit(function () {
        var message = $('#send_area').text();

       /* //去除消息的开头和结尾空格
        message = trimStr(message);*/

        if (!message || message === '')
            return false;
        var msg = {};

        msg.userInfo = userInfo;
        msg.content = message;
        msg.success = false;
        msg.sendTime = Date.now();

        if(!window.chatUsername){
            groupMsgs.push(msg);
            socket.emit('group message',msg);
        }else {
            msg.chatUsername = window.chatUsername;
            if(!allMessage[chatUsername])
                allMessage[chatUsername] = [];
            allMessage[chatUsername].push(msg);
            socket.emit('single message',msg);
        }

        //立马新增一条聊天数据
        refreshMsgs(msg);


        $('#send_area').text('');
        return false;
    });


    $('#form_login').submit(function () {
        var username = $('#login_field').val();
        if(!username || username === ''){
            return false;
        }

        var title = document.getElementsByTagName('title')[0];
       title.innerHTML = username;

        userInfo.username = username;
        userInfo.headicon = $('#head_path').val();
        userInfo.socketID = socket.id;
        userInfo.online = true;
        socket.emit('userinfo',userInfo);

        $('#login_field').val('');
        $('#login_field').val('');
        return false;
    });


});

/*//去除字符串开头和结尾的空格
function trimStr(str) {
    var i,j;
    for (i = 0; i<str.length;i++){

        if(str.charCodeAt(i) !== ' ')
            break;
    }

    for (j = str.length-1; j>=0;j--){
        if(str.charCodeAt(j) !== ' ')
            break;

    }
    return str.slice(i,j+1);
}*/

