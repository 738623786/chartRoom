/**
 * Created by fjl on 17/4/15.
 */
//定义全局对象
!function () {
    window.socket = io();

    //定义聊天室里的数据
    window.chatUsername = null;
    window.members = [];
    window.groupMsgs = [];
    window.allMessage = {};
    window.userInfo = {};

    window.member_list = document.getElementById("member_list");
    window.chat_content_list = document.getElementById("chat_content_list");
    window.group_btn = document.getElementById('group');



}();