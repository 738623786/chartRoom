/**
 * Created by fjl on 17/4/13.
 * 用户数据接收器
 */
$(function () {


    var lastClickMember;


    //接收新上线成员信息
    socket.on('userinfo',function(userInfo) {

        userInline(userInfo);

    });

    //接收所有成员信息
    socket.on('menbers',function (members) {
        //给成员列表赋值
        window.members = members;

        for (i in members){
            //刷新聊天室成员列表
            refreshMembers(members[i]);
        }
    });

    //一次接收群组内的所有聊天信息
    socket.on('groupmsgs',function (groupMsgs) {
        for (i in groupMsgs){
            receiveMsg(groupMsgs[i]);
        }
    });

    //接收群组内的聊天信息
    socket.on('group message',function(msg) {
        //增加聊天信息
        receiveMsg(msg);
    });


    //接收到一个人发来的信息
    socket.on('single message',function (msg){

        //修改消息数据
        var sendUserName = msg.userInfo.username;
        if (!allMessage[sendUserName])
            allMessage[sendUserName] = [];
        allMessage[sendUserName].push(msg);

        //修改成员数据
        for(var i=0;i<members.length;i++){
            console.log()
            if(members[i].username === sendUserName){
                if (!members[i].unread || members[i].unread === false){
                    members[i].unread = true;
                    setUnRead(i);
                }

                break;
            }
        }

        if(window.chatUsername === sendUserName)
            refreshMsgs(msg);

    });

    //设置第n个成员的消息为未读
   function setUnRead(n){
        var li = member_list.getElementsByTagName('li')[n];
       var redPoint = li.getElementsByClassName('red_point')[0];
       redPoint.style.display = 'block';
    };

    //接收自己发送成功的消息
    socket.on('send success',function (msg){
        var messages;
        if(msg.chatUsername)
            messages = allMessage[msg.chatUsername];
        else
            messages = groupMsgs;

        messages = messages || [];

       var index =  (function() {
            var m = messages.length - 1;
            for(var i=m;i>=0;i--){
                if(messages[m-i].sendTime === msg.sendTime) {
                    messages[m-i] = msg;
                    return (m-i);
                }
            }
        })();


       //if(msg.chatUsername == window.chatUsername)
        refreshMsgsByIndex(msg,index);

    });



    //接收到用户离线信息
    socket.on('disconnect',function (socketID) {

        for(var i=0; i<members.length;i++){
            if (members[i].socketID === socketID){

                members[i].online = false;

                //更新用户在线状态
                var li =  member_list.getElementsByTagName('li')[i];
                var summary = li.getElementsByClassName('summary')[0];

                summary.innerHTML = "离线";
                summary.style.color = '#ff0000';

                break;
            }
        }




    });





    //用户上线
    function userInline(userInfo) { //保存用户信息

        //判断该用户是否为自身
        if(userInfo.username === window.userInfo.username){
            alert('您的账号已在另一个地方登录');
            location.reload();
            window.userInfo = userInfo;
        }

        //判断用户是否已经存在
        var exsist =  window.members.some(function (item,index) {
            if(item.username === userInfo.username){ //该成员存在
                //更新该成员信息
                window.members[index] = userInfo;
                //更新该成员的头像
                var li =  member_list.getElementsByTagName('li')[index];
                 var img = li.getElementsByTagName('img')[0];
                 img.src = userInfo.headicon;
                return true;
            }

        });


        if (!exsist){ //用户不存在
            window.members.push(userInfo);
            //刷新聊天室成员列表
            refreshMembers(userInfo);
        }


    }

    //刷新聊天室成员列表
    function refreshMembers(userInfo) {
        var li = document.createElement('li');

        li.onclick = function () {

            //显示"返回群组"按钮
            window.group_btn.style.display = 'inline-block';



            //修改选中的样式
            if (lastClickMember)
                lastClickMember.style.backgroundColor = '#fff';
            this.style.backgroundColor = '#ccc';
            lastClickMember = this;

            //取消聊天红点
            var redPoint = this.getElementsByClassName('red_point')[0];
            redPoint.style.display = 'none';
            //修改该成员数据
            for(var i=0;i<members.length;i++){
                if(members[i].username === userInfo.username){
                    members[i].unread = false;
                    break;
                }
            }




            //获取用户名
            var nickname = this.getElementsByClassName('nickname')[0];
            chatUsername = nickname.innerHTML;

            var chatMsgs = allMessage[chatUsername];
            if(!chatMsgs)
                chatMsgs = [];
            chat_content_list.innerHTML = '';

            for(var i=0;i<chatMsgs.length;i++){
                refreshMsgs(chatMsgs[i]);
            }
        };

        var redPoint = document.createElement('div');
        redPoint.className = 'red_point';
        if(!userInfo.unread || userInfo.unread === false)
            redPoint.style.display = 'none';

        var img = document.createElement('img');
        img.src = userInfo.headicon;
        img.className = 'head_icon';

        var detail = document.createElement('div');
        detail.className = 'detail';

        var nickname = document.createElement('div');
        nickname.className = 'nickname';
        nickname.innerHTML = userInfo.username;

        var summary = document.createElement('div');
        summary.className = 'summary';
        if(userInfo.online){
            summary.innerHTML = '在线';
            summary.style.color = '#00ff00';
        }else {
            summary.innerHTML = '离线';
            summary.style.color = '#ff0000';
        }




        if(userInfo.username === window.userInfo.username){
            summary.innerHTML = '向自己发消息';
            summary.style.color = '#888';
        }



        detail.appendChild(nickname);
        detail.appendChild(summary);

        li.appendChild(redPoint);
        li.appendChild(img);
        li.appendChild(detail);

        if (userInfo.username === window.userInfo.username)
            li.style.display ='none';
        if(!userInfo.online)
            li.style.display ='none';

        member_list.appendChild(li);
    }


    //接到群信息
    function receiveMsg(msg) {
        //保存群聊天信息
        window.groupMsgs.push(msg);
        //刷新群聊天列表
        refreshMsgs(msg);
    }

    //刷新群聊天列表
   window.refreshMsgs = function (msg) {
        var li = document.createElement('li');

        if (msg.userInfo.username === userInfo.username)
            li.className = "self";
        else
            li.className = "other";

        var img = document.createElement('img');
        img.src = msg.userInfo.headicon;
        img.className = "head_icon";
        var chat_content = document.createElement('div');
        chat_content.className = "chat_content";
        if(!msg.success)
            chat_content.className += " message_unsend";


        chat_content.innerHTML = msg.content;
        li.appendChild(img);
        li.appendChild(chat_content);


        chat_content_list.appendChild(li);
        window.scrollTo(0, document.body.scrollHeight);
    }


    function refreshMsgsByIndex(msg,index) {
        var li = chat_content_list.getElementsByTagName('li')[index];

        if (msg.userInfo.username === userInfo.username)
            li.className = "self";
        else
            li.className = "other";

        var chat_content = li.getElementsByTagName('div')[0];
        chat_content.className = "chat_content";
        if(!msg.success)
            chat_content.className += " message_unsend";

    }

    //返回群聊天按钮点击
    window.group_btn.onclick = function(){
        //隐藏自己
        this.style.display = 'none';
        //取消单个人的选中状态
        lastClickMember.style.backgroundColor = '#fff';
        window.chatUsername = null;


        //清空个人聊天页面
        chat_content_list.innerHTML = '';
        //显示群聊天内容

        for(var i=0;i<groupMsgs.length;i++){
            refreshMsgs(groupMsgs[i]);
        }


    }


});
