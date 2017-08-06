/**
 * Created by fjl on 17/4/11.
 * 聊天室的动作事件控制
 */



/*
 * 添加窗口加载后，执行的事件函数
 * */
function addLoadEvent(func) {
    var oldOnLoad = window.onload;
    if(!oldOnLoad){
        window.onload = func;
    }else {
        window .onload =function() {
            oldOnLoad();
            func();
        }
    }
}


//加载备选图片
!function loadImgs() {
    var pic_paths = [
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3174886326,3468025615&fm=23&gp=0.jpg',
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1880034613,3094001249&fm=23&gp=0.jpg',
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3293295359,3389815477&fm=23&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4207297476,2857053257&fm=23&gp=0.jpg',
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1015281990,2629172720&fm=23&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3963552808,2633683757&fm=23&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1578715773,3596432572&fm=23&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=708251623,2016844449&fm=23&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=992298635,1498849720&fm=23&gp=0.jpg',
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2647768015,4209339401&fm=23&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4120407857,1624682534&fm=11&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=545863689,2657631141&fm=23&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3715448438,3205527824&fm=11&gp=0.jpg',
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2540429994,1464107280&fm=11&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2034693939,1446103960&fm=23&gp=0.jpg'];

    showHeadIcons(pic_paths);
}();

//显示用户备选头像
function showHeadIcons(pics){

    var ul = document.getElementById('head_icon_list');
    for(var i=0;i<pics.length;i++){
        var li = document.createElement('li');

        var img = document.createElement('img');
        img.src = pics[i];

        li.appendChild(img);
        ul.appendChild(li);
    }
}



addLoadEvent(preLogin());
//初始化登录事件
function preLogin(){
    var list =  document.getElementById('head_icon_list');
    var imgs = list.getElementsByTagName('img');
    var btn_ensure = document.getElementById('btn_ensure');
    var head_path = document.getElementById('head_path');
    var login = document.getElementById('login');
    var btn_login = document.getElementById('btn_login');
    var userName = document.getElementById('login_field');
    var cover = document.getElementById('cover');

   for(var i=0;i<imgs.length;i++){
       imgs[i].onclick = function() {

           for(var i=0;i<imgs.length;i++){
               imgs[i].style.boxShadow = '0 0 0 0';
           }
           this.style.boxShadow = '0 0 5px 5px red';
           head_path.value = this.src;
       }
   }
    //选择图片按钮被点击
   btn_ensure.onclick = function () {

       if(!head_path.value || head_path.value === ''){
           alert('请选择你的头像！！！');
           return;
       }

       //将头像选择列表的父容器移除
       list.parentNode.remove();

       login.style.display = 'block';
   }

   //登录按钮被点击
    btn_login.onclick = function () {
        if(!userName || userName.value == ''){
            alert('请输入您的昵称！！！');
            return;
        }

        cover.style.display = 'none';


    }



}


