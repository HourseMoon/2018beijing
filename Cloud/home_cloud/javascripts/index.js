/*
©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
©2017-2018 北京清立科技有限公司。保留所有权利。

文件名称: index.js
功能: 清立网站首页，微信扫码登录，网站的中英文切换，关于我们的介绍，浏览器版本的判断显示，资料下载，实现向LN,VN，设备管理，资源共享，M3产品页，板卡页等页面的跳转
作者: 马跃

版本说明: 5月10号V1.0.0正式版发行，6月份V1.0.1版（增加中英文切换）
修改描述:
*/
$(document).ready(function(){
    document.ondragstart = function() {  //禁止拖拽图片
        return false;
    };
    var wx_loginFlag = true;  //记录是否为登录状态 为true没有登录
    var tabFlag = 1;  //记录中英文状态；1  中文；  0  英文
    var cn_en_data = {  //本地中英文对照表
        'login':['登录','Login'],
        'forumText':['论坛社区','Forum'],
        'aboutUsText':['关于我们','About'],
        'products':['产品资料','Brochures'],
        'vn_project':['VN案例','VN Demo'],
        'ln_project':['LN案例','LN Demo'],
        'systemconfig':['设备管理','Binding'],
        'admin':['资源共享<br/>构建中 ','Repository<br/>Building'],
        'about1':['清立集中控制系统设计应用于指挥控制中心、办公自动化、多媒体环境及智能家居等领域，是可编程组态协议与可编程人机界面相统一的，全网络化、智能化的集中控制系统，是现代化指挥与控制中心的必备装备，广泛应用于应急报警指挥中心，部队作战指挥系统C4ISR、各级政府行政中心、楼宇自控、会议室、多功能厅、培训中心、展示中心、演播室、工业自动化等领域。','TSINGLI control system is designed for command control center, office and building automation，multimedia environment and home automation. It combined programmable logic and protocol with programmable user interface together, provide full network and intelligent central control technology. It is essential equipment for command center and C4ISR system, it is widely used for administration center, building control, meeting room, training center, exhibition center, industry and home automation.'],
        'about2':['清立致力于打造最优秀的集中控制系统 —— 没有之一','TSINGLI is committed to building the best centralized control system —— Not one of the'],
        'about3':['我们的口号是 —— 更简单、更高效、更专业','Our Slogan —— Simpler, More Efficient, More Professional'],
        'log_off_title':['是否退出登录','Whether to log out'],
        'ensureLogOff':['是','Yes'],
        'cancelLogOff':['否','No']
    };
    //查询是否登录
    $.ajax({
        type:"post",
        url:"/login/wx",
        data:{
            packages:JSON.stringify({"method":"isLogin"})
        },
        success:function(data){
            //console.log(data);
            if(data.result.status){  //已登录
                //请求用户微信信息
                $.ajax({
                    type:"post",
                    url:"/login/wx",
                    data:{
                        packages:JSON.stringify({"method":"show"})
                    },
                    success:function(data){
                        //console.log(data);
                        //获取登录用户头像
                        $('.opinion .headImg').css({
                            'backgroundImage': 'url('+ data.result.headimgurl +')',
                            'width': "20px",
                            'height': '20px'
                        });
                        //获取用户昵称
                        $('.opinion .login').text(data.result.nickname);
                        cn_en_data.login = [data.result.nickname,data.result.nickname];  //记录用户昵称，切换中英时变回登录字样
                        wx_loginFlag = false;  //登录开关为false，  已登录
                    }
                });
            }else{
                //未登录
                var url = window.location.search;  //获取url
                if (url.indexOf("?") != -1) {  //判断是否为跳转过来的
                    $('.makeOpinion').css('display','block');  //显示二维码
                    //微信扫码登录需要的数据
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                }
            }
        }
    });
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
    $('.nav li').hover(function(){
        $(this).removeClass('fadeInLeft fadeInDown fadeInRight fadeInUp');
        $(this).addClass('pulse');
    },function(){
        $(this).removeClass('pulse');
    });
    //远程管理的划入划出事件
    $('.nav-upgrade').hover(function(){
        $(this).find(".two-nav").css("display","block").addClass('animate fadeInLeft');
    },function(){
        $(this).find(".two-nav").css("display","none").addClass('animate fadeInLeft');
    });
    //帮助资源的划入划出事件
    $('.nav-help').hover(function(){
        $(this).find(".two-nav").css("display","block").addClass('animate fadeInLeft');
    },function(){
        $(this).find(".two-nav").css("display","none").addClass('animate fadeInLeft');
    });
    //自学教程的划入划出事件
    $(".nav-course").hover(function(){
        $(this).find(".two-nav2").css("display", "block").addClass('animate fadeInRight');
    },function(){
        $(this).find(".two-nav2").css("display", "none").addClass('animate fadeInRight');
    });
    //关于我们的划入划出事件
    var timer;
    $(".language").hover(function(){
        timer = setTimeout(function(){
            $(".aboutUs").css("display","block");
            $(".aboutUs p").addClass("fadeInDown").removeClass("fadeOutDown");
        },500);
    },function(){
        clearTimeout(timer);
        $(".aboutUs p").removeClass("fadeInDown").addClass("fadeOutDown");
        setTimeout(function(){
            $(".aboutUs").css("display","none");
        },300);
    });
    //进入VN
    $('.nav-vision').on('click',function(){
        //浏览器类型判断：必须为谷歌
        if(getExplore().split(": ")[0] != "Chrome"){
            $("#shade").css("display","block");
        }else {
            //对浏览器版本判断：必须大于54版本
            if(parseInt(getExplore().split(": ")[1].split(".")[0]) > 50){
                //通过开关判断是否已经登录
                if(!wx_loginFlag){  //登录了，直接跳转
                    location.href = "/vision";
                }else{
                    //没有登录打开二维码
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
                }
            }else{
                $("#shade").css("display","block");
            }
        }
    });
    //进入LN
    $('.nav-logic').on('click',function(){
        //浏览器类型判断：必须为谷歌
        if(getExplore().split(": ")[0] != "Chrome"){
            $("#shade").css("display","block");
        }else{
            //对浏览器版本判断：必须大于54版本
            if(parseInt(getExplore().split(": ")[1].split(".")[0]) > 50){
                //判断是否已经登录状态
                if(!wx_loginFlag){  //已登录
                    location.href="/logic";
                }else{
                    //未登录，显示二维码
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
                }
            }else{
                $("#shade").css("display","block");
            }
        }
    });
    //设备管理
    $('.systemconfig').on('click',function(){
        //对浏览器版本判断：必须大于54版本
        if(parseInt(getExplore().split(": ")[1].split(".")[0]) > 50){
            //判断是否登录
            if(!wx_loginFlag){
                location.href="/remote/device";
            }else{
                //显示二维码
                var obj = new WxLogin({
                    id:"wx_login",
                    appid: "wxe69b35478a532909",
                    scope: "snsapi_login",
                    redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                    state: "",
                    style: "white",
                    href: ""
                });
                $('.makeOpinion').css('display','block');
            }
        }else{
            $("#shade").css("display","block");
        }

    });
    //资源共享
    /* $('.admin').on('click',function(){
        //对浏览器版本判断：必须大于54版本
        if(parseInt(getExplore().split(": ")[1].split(".")[0]) > 50){
            if(!wx_loginFlag){
                location.href="/services/management";
            }else{
                var obj = new WxLogin({
                    id:"wx_login",
                    appid: "wxe69b35478a532909",
                    scope: "snsapi_login",
                    redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                    state: "",
                    style: "white",
                    href: ""
                });
                $('.makeOpinion').css('display','block');
            }
            
        }else{
            $("#shade").css("display","block");
        }

    }); */
    //产品页面
    $(".nav-TLM3").on("click",function(){
        location.href = "/product";
    });
    //集成板卡
    $(".nav-board").on("click",function(){
        location.href = "/board";
    });

    var downloadFlag = true;
    //下载最新版64位浏览器按钮
    $("#downloadChrome64").on("click",function(){
        downloadFlag = true;
    });
    //下载最新版32位浏览器
    $("#downloadChrome32").on("click",function(){
        downloadFlag = false;
    });
    //
    $(".downloadHttp").on("click",function(){
        if(downloadFlag){
            window.location.href = "/home/chromeX64/download/";
        }else{
            window.location.href = "/home/chromeX86/download/";
        }
        $("#shade").css("display","none");
    });
    //关闭浏览器版本提示
    $(".closeHttp").on("click",function(){
        location.href = "/home";
    });
    //点击登录按钮
    $(".opinion").on("click",function(){
        //判断是否登录
        if(wx_loginFlag){
            var obj = new WxLogin({
                id:"wx_login",
                appid: "wxe69b35478a532909",
                scope: "snsapi_login",
                redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                state: "",
                style: "white",
                href: ""
            });
            $('.makeOpinion').css('display','block');
        }else{
            $(".shade_logOff").css('display',"block");
        }
    });
    //关闭二维码
    $(".makeOpinion #close_wx_login").on("click",function(){
        $(".makeOpinion").css("display","none");
    });
    //退出登录
    $('.ensureLogOff').on('click',function(){  //确认退出
        $(".shade_logOff").css('display',"none");
        $.ajax({
            type:"post",
            url:"/login/wx",
            data:{
                packages:JSON.stringify({"method":"exit"})
            },
            success:function(data){
                //console.log(data);
                if(data.result){
                    $('.opinion .headImg').css({
                        'backgroundImage': 'url(../images/user_bg_mg.png)',
                        'width': '18px',
                        'height': '18px'
                    });
                    cn_en_data.login = ['登录','Login'];  //退出时还原中英文对照表
                    //判断是中英文
                    if(tabFlag === 1){
                        $('.opinion .login').text('登录');
                    }else{
                        $('.opinion .login').text('Login');
                    }
                    wx_loginFlag = true;
                }
            }
        });
    });
    $('.cancelLogOff').on('click',function(){  //取消退出
        $(".shade_logOff").css('display',"none");
    });
    //判断浏览器类型及版本
    function getExplore(){
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
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
                //判断是否登录
                if(!wx_loginFlag){
                    location.href = "/vision?VN_tutorial_level1";
                }else{
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
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
                //判断是否登录
                if(!wx_loginFlag){
                    var download_url = '/resources/VN_level2.zip';
                    SaveDiagramTo(download_url);  //下载自学教程资源
                    //延迟跳转   为了确保下载了自学教程案例
                    setTimeout(function(){
                        location.href = "/vision?VN_tutorial_level2";
                    },1000);
                }else{
                    //二维码资源
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
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
                //判断是否登录
                if(!wx_loginFlag){
                    var download_url = '/resources/VN_level3.zip';
                    SaveDiagramTo(download_url);  //下载资源函数
                    setTimeout(function(){
                        location.href = "/vision?VN_tutorial_level3";
                    },1000);
                }else{
                    //显示二维码资源
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
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
                //判断是否登录
                if(!wx_loginFlag){
                    location.href = "/logic?LN_tutorial_level1";
                }else{
                    //显示二维码
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
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
                //判断是否登录
                if(!wx_loginFlag){
                    var download_url = '/resources/LN_level2.zip';
                    SaveDiagramTo(download_url);  //下载自学教程资源
                    setTimeout(function(){
                        location.href = "/logic?LN_tutorial_level2";
                    },1000);
                }else{
                    //显示二维码
                    var obj = new WxLogin({
                        id:"wx_login",
                        appid: "wxe69b35478a532909",
                        scope: "snsapi_login",
                        redirect_uri: "http%3a%2f%2fwww.tsingli.com%2flogin%2fget_wx_access_token",
                        state: "",
                        style: "white",
                        href: ""
                    });
                    $('.makeOpinion').css('display','block');
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
    //产品资料下载
    $('.products').on('click',function(){
        var download_product = '/resources/产品资料.zip';
        SaveDiagramTo(download_product);
    });
    //案例下载
    $('.vn_project').on('click',function(){
        var download_product = '/resources/VN案例.zip';
        SaveDiagramTo(download_product);
    });
    //案例下载
    $('.ln_project').on('click',function(){
        var download_product = '/resources/LN案例.zip';
        SaveDiagramTo(download_product);
    });
    //中英文切换
    $('.cn-en .cn').on('click',function(){  //中文按钮
        //中文状态在点击不处理
        if(tabFlag === 1){
            return
        }
        if(tabFlag === 0){  //英文状态下点击切换为中文
            Switch_CN_EN(tabFlag,'.cn','.en');  //切换中英文函数
            localStorage.setItem('Switch','Switch_cn');  //存储本地localstorage 中文属性值
            ChangeStyle();  //改变现实样式函数
            tabFlag = 1;  //开关切换为中文
        }
    });
    $('.cn-en .en').on('click',function(){  //英文按钮
        //中文状态在点击不处理
        if(tabFlag === 0){
            return
        }
        if(tabFlag === 1){
            Switch_CN_EN(tabFlag,'.en','.cn'); //切换中英文函数
            localStorage.setItem('Switch','Switch_en'); //存储本地localstorage 英文属性值
            ChangeStyle();  //改变现实样式函数
            tabFlag = 0;
        }
    });
    //改变中英文函数
    function Switch_CN_EN (index, select, unselect) {
        for(var key in cn_en_data){
            $('.' + key).html(cn_en_data[key][index]);
        }
        //改变中英文按钮显示样式
        $(select).css({'background':'#fff','color':'#000'});
        $(unselect).css({'background':'#000','color':'#fff'});
    }
    //中英文布局样式调整
    function ChangeStyle(){
        if(tabFlag === 0){  //cn
            $('.forum').css('right','248px');
            $('.products').css('left','52px');
            $('.language').css('right','370px');
            $('.admin').css({'top':"102px",'left':'13px'});
        }else {  //en
            $('.language').css('right','326px');
            $('.products').css('left','47px');
            $('.forum').css('right','226px');
            $('.admin').css({'top':"94px",'left':'5px'});
        }
    }
    //跳转论坛
    $(".forumText").on("click",function(){
        location.href = "/forum";
    });
});
