/*
 ©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
 ©2017-2018 北京清立科技有限公司。保留所有权利。

 文件名称: index.js
 功能: 本地设备登录首页，TL-M3产品介绍页面，集成板卡介绍页面，自学教程入口，资源管理，帮助资源，自建模块，系统配置，LN,VN等入口，
 作者: Mayue YuanZhiYong

 版本说明: LN前端1.0开发版
 修改描述:
 */
$(document).ready(function () {
    document.ondragstart = function () { //禁止拖拽图片
        return false;
    };
    var urlData = location.search;
    var loginFlag = null; //记录登录状态
    //判断是否跳转
    if(urlData != ''){
        $('.makeOpinion').css('display', 'block'); //显示遮罩层
        $('.login_box').css('display', 'block'); //显示登录窗口
        $('.login_box .password input').focus();
    }else{
        //查询如果已经登录，直接显示用户名
        $.ajax({
            url:'/login/wx',
            type:'post',
            data:{
                packages:JSON.stringify({
                    'method':'isLogin'
                })
            },
            success:function(data){
                loginFlag = data.result.status;
                if(data.result.status){
                    $('.opinion .login').html('user'); //显示用户名
                }
            }
        });
    }
    var tabFlag = 1;  //记录中英文状态；1  中文；  0  英文
    //打开时读取localstorage，判断中英文状态
    switch (localStorage.getItem('Switch')) {
        case 'Switch_cn':
            Switch_CN_EN(0,'.cn','.en');  //改变中英文函数
            tabFlag = 1;
            break;
        case 'Switch_en':
            Switch_CN_EN(1,'.en','.cn');
            tabFlag = 0;
            break;
        default:
            Switch_CN_EN(0,'.cn','.en');
            tabFlag = 1;
            break;
    }
    //导航栏鼠标的划入划出事件
    $('.nav li').hover(function () {
        $(this).addClass('pulse');
    }, function () {
        $(this).removeClass('pulse');
    });
    //维护升级的划入划出事件
    $('.nav-upgrade').hover(function () {
        $(this).find(".two-nav").css("display", "block").addClass('animate fadeInLeft');
    }, function () {
        //$(this).find(".two-nav").css("display", "none").addClass('animate fadeInLeft');
    });
    //帮助资源的划入划出事件
    $('.nav-help').hover(function () {
        $(this).find(".two-nav").css("display", "block").addClass('animate fadeInLeft');
    }, function () {
        $(this).find(".two-nav").css("display", "none").addClass('animate fadeInLeft');
    });
    //自学教程的hover事件
    $(".nav-course").hover(function () {
        $(this).find(".two-nav2").css("display", "block").addClass('animate fadeInRight');
    }, function () {
        $(this).find(".two-nav2").css("display", "none").addClass('animate fadeInRight');
    });
    
    //进入VN
    $('.nav-vision').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    location.href = "/vision";
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?login=/vision' //登录后跳转
                }     
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    //进入LN
    $('.nav-logic').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    location.href = "/logic";
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?login=/logic' //登录后跳转
                }
                
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    //自建模块
    $('.createmodule').on('click', function () {
        //对浏览器版本判断：必须大于54版本
        if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
            if(loginFlag){
                location.href = "/services/create";
            }else{
                $('.makeOpinion').css('display', 'block'); //显示遮罩层
                $('.login_box').css('display', 'block'); //显示登录窗口
                $('.login_box .password input').focus();
                urlData = '?login=/services/create' //登录后跳转
            }
            
        } else {
            $("#shade").css("display", "block");
        }

    });
    //系统配置
    $('.systemconfig').on('click', function () {
        //对浏览器版本判断：必须大于54版本
        if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
            
            if(loginFlag){
                location.href="/services/config";
            }else{
                $('.makeOpinion').css('display', 'block'); //显示遮罩层
                $('.login_box').css('display', 'block'); //显示登录窗口
                $('.login_box .password input').focus();
                urlData = '?login=/services/config' //登录后跳转
            }
        } else {
            $("#shade").css("display", "block");
        }

    });
    //资源管理
    $('.admin').on('click', function () {
        //对浏览器版本判断：必须大于54版本
        if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
            if(loginFlag){
                location.href="/services/management";
            }else{
                $('.makeOpinion').css('display', 'block'); //显示遮罩层
                $('.login_box').css('display', 'block'); //显示登录窗口
                $('.login_box .password input').focus();
                urlData = '?login=/services/management' //登录后跳转
            }
        } else {
            $("#shade").css("display", "block");
        }

    });
    var downloadFlag = true;
    //是否下载最新版浏览器按钮
    $("#downloadChrome64").on("click", function () {
        downloadFlag = true;
    });
    $("#downloadChrome32").on("click", function () {
        downloadFlag = false;
    });
    $(".downloadHttp").on("click", function () {
        if (downloadFlag) {
            window.location.href = "/home/chromeX64/download/";
        } else {
            window.location.href = "/home/chromeX86/download/";
        }
        $("#shade").css("display", "none");
    });
    //关闭浏览器版本提示
    $(".closeHttp").on("click", function () {
        location.href = "/home";
    });
    //本地登录打开登录窗口
    $(".opinion").on("click", function () {
        $('.makeOpinion').css('display', 'block'); //显示遮罩层
        $('.login_box').css('display', 'block'); //显示登录窗口
        $('.login_box .password input').focus();
    });
    //登录按钮
    $('.login_btn').on('click', function () {
        UserLogin();
    });
    //input框的回车事件
    $(".login_box .password input").on("keypress", function (e) {  
        if(e.keyCode == 13){
            UserLogin();
        }
    });
    function UserLogin(){  //登录函数
        if ($('.login_box .password input').val() != '') {
            $.ajax({
                url: '/login/wx',
                type: 'post',
                data: {
                    packages: JSON.stringify({
                        'method': 'login',
                        'user': "user",
                        'password': $('.login_box .password input').val()
                    })
                },
                success: function (data) {
                    loginFlag = data.result;
                    if (data.result) {
                        LocationHref(urlData);
                    }else{
                        $('.login_box .login_title').html('密码错误');
                    }
                }
            })
        }else{
            $('.login_box .login_title').html('密码不能为空');
        }
    }
    //跳回页面函数
    function LocationHref(url){
        console.log(url)
        if(url == '?login=/services/management'){  //资源管理
            location.href = "/services/management";
        }else if(url == '?login=/services/config'){  //系统配置
            location.href = "/services/config";
        }else if(url == '?login=/logic'){  //LN
            location.href = "/logic";
        }else if(url == '?login=/vision'){  //VN
            location.href = "/vision";
        }else if(url == '?login=/services/create'){  //自建模块
            location.href = "/services/create";
        }else if(url == '?login=/factory'){ //授权
            location.href = '/factory';
        }else if(url == '?VN_tutorial_level1'){  //VN自学教程一
            location.href = "/vision?VN_tutorial_level1";
        }else if(url == '?VN_tutorial_level2'){  //VN自学教程二
            var download_url = '/resources/VN_level2.zip';
            SaveDiagramTo(download_url);
            setTimeout(function(){
                location.href = "/vision?VN_tutorial_level2";
            },1000);
        }else if(url == '?VN_tutorial_level3'){
            var download_url = '/resources/VN_level3.zip';
            SaveDiagramTo(download_url);
            setTimeout(function(){
                location.href = "/vision?VN_tutorial_level3";
            },1000);
        }else if(url == '?LN_tutorial_level1'){  //LN自学教程一
            location.href = "/logic?LN_tutorial_level1";
        }else if(url == '?LN_tutorial_level2'){  //LN自学教程二
            var download_url = '/resources/LN_level2.zip';
            SaveDiagramTo(download_url);
            setTimeout(function(){
                location.href = "/logic?LN_tutorial_level2";
            },1000);
            
        }else{
            $('.makeOpinion').css('display', 'none'); //显示遮罩层
            $('.login_box').css('display', 'none'); //显示登录窗口
            $('.opinion .login').html('user'); //显示用户名
        }
    }
    //跳转修改密码窗口
    $('.login_box .toChangePwdBtn').on('click', function () {
        //隐藏登录窗口  显示密码修改窗口
        $('.login_box').css('display', 'none');
        $('.changePwdBox').css('display', 'block');
        //清空登录窗口的各项数据
        $('.login_box .password_title').html('');  //清空密码错误提示
        $('.login_box .password input').val('');  //清空密码输入框
    });
    //返回登录窗口
    $('.changePwdBox .toLoginBtn').on('click', function () {
        //隐藏密码修改窗口 显示登录窗口
        $('.login_box').css('display', 'block');
        $('.changePwdBox').css('display', 'none');
        //清空各输入框的提示信息
        $('.changePwdBox .password_title').html('');
        $('.changePwdBox .newpassword1_title').html('');
        $('.changePwdBox .newpassword2_title').html('');
        //清空各输入框内容
        $('.changePwdBox .password input').val('');
        $('.changePwdBox .newPassword input').val('');
        $('.changePwdBox .newPassword2 input').val('');
    });
     //第一次新密码判断
    $('.changePwdBox .newPassword input').on('blur', function () {
        if ($('.changePwdBox .newPassword input').val() == '') {
            $('.changePwdBox .newpassword1_title').html('新密码不能为空');
        } else {
            //if ($('.changePwdBox .newPassword input').val() == $('.changePwdBox .password input').val()) {
                //$('.changePwdBox .newpassword1_title').html('新密码不能与旧密码相同');
            //} else 
            if ($('.changePwdBox .newPassword2 input').val() != '') {
                if ($('.changePwdBox .newPassword input').val() != $('.changePwdBox .newPassword2 input').val()) {
                    $('.changePwdBox .newpassword1_title').html('两次新密码必须相同');
                } //else {
                    //$('.changePwdBox .newpassword1_title').html('');
                    //$('.changePwdBox .newpassword2_title').html('');
                //}
            } //else {
                //$('.changePwdBox .newpassword1_title').html('');
            //}
        }
    });
    //第二次新密码判断
    $('.changePwdBox .newPassword2 input').on('blur', function () {
        if ($('.changePwdBox .newPassword2 input').val() == '') {
            $('.changePwdBox .newpassword2_title').html('新密码不能为空');
        } else {
            //if ($('.changePwdBox .newPassword2 input').val() == $('.changePwdBox .password input').val()) {
                //$('.changePwdBox .newpassword2_title').html('新密码不能与旧密码相同');
            //} else 
            if ($('.changePwdBox .newPassword2 input').val() != $('.changePwdBox .newPassword input').val()) {
                $('.changePwdBox .newpassword2_title').html('两次新密码必须相同');
            } //else {
               // $('.changePwdBox .newpassword1_title').html('');
                //$('.changePwdBox .newpassword2_title').html('');
            //}
        }
    });
    //确认修改密码按钮
    $('.ensureChange').on('click', function () {
        ChangePwd();
    });
    //input框的回车事件
    $(".changePwdBox .newPassword2 input").on("keypress", function (e) {  
        if(e.keyCode == 13){
            ChangePwd();
        }
    });
    //修改密码ajax函数
    function ChangePwd(){
        if ($('.changePwdBox .password input').val() != '' && 
        $('.changePwdBox .newPassword input').val() != '' && 
        $('.changePwdBox .newPassword2 input').val() != '' && 
        $('.changePwdBox .newPassword input').val() == $('.changePwdBox .newPassword2 input').val()) {
            $.ajax({
                url: '/login/wx',
                type: 'post',
                data: {
                    packages: JSON.stringify({
                        'method': 'modify',
                        'oldPassword': $('.changePwdBox .password input').val(),
                        'newPassword':$('.changePwdBox .newPassword2 input').val()
                    })
                },
                success: function (data) {
                    if (data.result) { //返回登录窗口
                        $('.login_box').css('display', 'block');
                        $('.changePwdBox').css('display', 'none');
                        //清空修改密码窗口各项数据
                        $('.changePwdBox .password_title').html('');
                        $('.changePwdBox .newpassword1_title').html('');
                        $('.changePwdBox .newpassword2_title').html('');
                        $('.changePwdBox .password input').val('');
                        $('.changePwdBox .newPassword input').val('');
                        $('.changePwdBox .newPassword2 input').val('');
                    }
                }
            })
        }
    }
    //关闭登录、修改密码窗口
    $(".makeOpinion").on("click", function (ev) {
        ev.stopPropagation();
        if (ev.target != this) {
            return
        } else {
            
            $('.makeOpinion').css('display', 'none');
            $('.changePwdBox').css('display', 'none');
            $('.loginBox .password_title').html('');
            $('.loginBox .newpassword1_title').html('');
            $('.loginBox .newpassword2_title').html('');
            $('.loginBox .password input').val('');
            $('.changePwdBox .newPassword input').val('');
            $('.changePwdBox .newPassword2 input').val('');
        }
    });
    //关闭登录弹窗
    $('.toHome').on('click',function(){
        $('.makeOpinion').css('display', 'none');
        $('.changePwdBox').css('display', 'none');
        $('.loginBox .password_title').html('');
        $('.loginBox .newpassword1_title').html('');
        $('.loginBox .newpassword2_title').html('');
        $('.loginBox .password input').val('');
        $('.changePwdBox .newPassword input').val('');
        $('.changePwdBox .newPassword2 input').val('');
    });
    //判断浏览器类型及版本
    function getExplore() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
            (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
            (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;

        // 根据关系进行判断
        if (Sys.ie) return ('IE: ' + Sys.ie);
        if (Sys.edge) return ('EDGE: ' + Sys.edge);
        if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
        if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
        if (Sys.opera) return ('Opera: ' + Sys.opera);
        if (Sys.safari) return ('Safari: ' + Sys.safari);
        return 'Unkonwn';
    }
    //自学教程
    //进入VN第一阶段
    $('.VN_tutorialL1').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    location.href = "/vision?VN_tutorial_level1";
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?VN_tutorial_level1' //登录后跳转
                }     
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    //进入VN第二阶段
    $('.VN_tutorialL2').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    var download_url = '/resources/VN_level2.zip';
                    SaveDiagramTo(download_url);
                    setTimeout(function(){
                        location.href = "/vision?VN_tutorial_level2";
                    },1000);
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?VN_tutorial_level2' //登录后跳转
                }     
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    //进入VN第三阶段
    $('.VN_tutorialL3').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    var download_url = '/resources/VN_level3.zip';
                    SaveDiagramTo(download_url);
                    setTimeout(function(){
                        location.href = "/vision?VN_tutorial_level3";
                    },1000);
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?VN_tutorial_level3' //登录后跳转
                }     
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    //进入LN第一阶段
    $('.LN_tutorialL1').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    location.href = "/logic?LN_tutorial_level1";
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?LN_tutorial_level1' //登录后跳转
                }     
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    //进入LN第二阶段
    $('.LN_tutorialL2').on('click', function () {
        //浏览器类型判断：必须为谷歌
        if (getExplore().split(": ")[0] != "Chrome") {
            $("#shade").css("display", "block");
        } else {
            //对浏览器版本判断：必须大于54版本
            if (parseInt(getExplore().split(": ")[1].split(".")[0]) > 50) {
                if(loginFlag){
                    var download_url = '/resources/LN_level2.zip';
                    SaveDiagramTo(download_url);
                    setTimeout(function(){
                        location.href = "/logic?LN_tutorial_level2";
                    },1000);
                }else{
                    $('.makeOpinion').css('display', 'block'); //显示遮罩层
                    $('.login_box').css('display', 'block'); //显示登录窗口
                    $('.login_box .password input').focus();
                    urlData = '?LN_tutorial_level2' //登录后跳转
                }     
            } else {
                $("#shade").css("display", "block");
            }
        }
    });
    function SaveDiagramTo(url) {  //保存前端工程文件
        var aFile = document.createElement("a");
        aFile.setAttribute("href", url);
        aFile.style.display = "none";
        document.body.appendChild(aFile);
        aFile.click();
        document.body.removeChild(aFile);
    }
    $('.products').on('click',function(){
        var download_product = '/resources/产品资料.zip';
        SaveDiagramTo(download_product);
    });
    $('.vn_project').on('click',function(){
        var download_product = '/resources/VN案例.zip';
        SaveDiagramTo(download_product);
    });
    $('.ln_project').on('click',function(){
        var download_product = '/resources/LN案例.zip';
        SaveDiagramTo(download_product);
    });
    //中英文切换
    $('.cn-en .cn').on('click',function(){  //中文
        if(tabFlag === 1){
            return
        }
        if(tabFlag === 0){
            Switch_CN_EN(tabFlag, '.en', '.cn');
            localStorage.setItem('Switch','Switch_cn');  //存储本地localstorage 中文属性值
            //ChangeStyle();
            tabFlag = 1;
        }
    });
    $('.cn-en .en').on('click',function(){  //英文
        if(tabFlag === 0){
            return
        }
        if(tabFlag === 1){
            Switch_CN_EN(tabFlag, '.en', '.cn');
            localStorage.setItem('Switch','Switch_en');  //存储本地localstorage 英文属性值
            //ChangeStyle();
            tabFlag = 0;
        }
    });
    //中英切换函数
    function Switch_CN_EN (index, select, unselect) {
        var cn_en_data = {  //本地中英文对照表
            'login':['登录','Login'],
            'products':['产品资料','Brochures'],
            'vn_project':['VN案例','VN Demo'],
            'ln_project':['LN案例','LN Demo'],
            'systemconfig':['系统配置','Config'],
            'admin':['资源管理','Repository'],
            'createmodule':['自建模块','Create'],
            'title1':['用户登录','Login'],
            'title2':['登录','Login'],
            'title3':['修改密码','Change Password'],
            'title4':['返回首页','Back Home'],
            'title5':['密码修改','Change Password'],
            'title6':['确认修改','Ensure'],
            'title7':['返回登录','Back Login'],
            'title8':['当前试用版本仅适用于50版本以上Chrome浏览器','The current trial version is only available for Chrome browsers over 50'],
            'title9':['下载64位Chrome浏览器','Download the 64-bit Chrome browser'],
            'title10':['下载32位Chrome浏览器','Download the 32-bit Chrome browser'],
            'title11':['关闭','Close'],
            'title12':['下载','Download']
        };
        for(var key in cn_en_data){
            $('.' + key).text(cn_en_data[key][index]);
        }
        $(select).css({'background':'#fff','color':'#000'});
        $(unselect).css({'background':'#000','color':'#fff'});

        var cn_en_data2 = {
            '_title1' : ['密码','Password'],
            '_title2' : ['旧密码','Old Password'],
            '_title3' : ['新密码','New Password']
        }
        for(var key in cn_en_data2){
            $('.' + key).attr("placeholder",cn_en_data2[key][index]);
        }
        ChangeStyle();
    }
    //中英文布局样式调整
    function ChangeStyle(){
        if(tabFlag === 0){  //cn
            $('.products').css('left','52px');
            $('.tabtitle3').css('left','88px');
            $('.tabtitle4').css('left','88px');
            $('.tabtitle7').css('left','88px');
            //$('.admin').css({'top':"102px",'left':'13px'});
        }else {  //en
            $('.tabtitle3').css('left','52px');
            $('.tabtitle4').css('left','78px');
            $('.tabtitle7').css('left','80px');
            $('.products').css('left','47px');
            //$('.admin').css({'top':"94px",'left':'5px'});
        }
    }
});