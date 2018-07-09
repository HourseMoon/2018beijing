/*
©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
©2017-2018 北京清立科技有限公司。保留所有权利。

文件名称: page.js
功能: M3产品及增强版 产品介绍
作者: 马跃

版本说明: 
修改描述:
*/
$(document).ready(function () {
    //判断是本地还是远程
    $.ajax({
        url: '/login/wx',
        type:'post',
        data:{
            packages:JSON.stringify({
                'method':'isLogin'
            })
        },
        success:function(data){
            //console.log(data);
            if(data.result.type === 'local'){  //本地
                $('.home').attr('href','/home');
                //$(".cn_en").css('display','none');
            }else if(data.result.type === 'remote'){  //远程
                $('.home').attr('href','/');
            }
        }
    });
    var flag = true;  //为true显示标准版，false增强版
    //标准版点击事件
    $(".proGray").on("click", function () {
        Standard();
    });
    //增强版点击事件
    $(".proGreen").on("click", function () {
        Pro();
    });
    //切换显示按钮
    $('.tab').on('click', function () {
        if (flag) { //增强版
            Pro();
        } else { //标准版
            Standard();
        }
    });
    //增强版显示样式
    function Pro() {
        $('.proGray').css('background', 'transparent');
        $('.proGreen').css('background', "#4C5B46");
        $('.tab').css('backgroundImage', 'url(images/b_left.png)');
        $("#green").css("display", "block");
        $("#gray").css("display", "none");
        
        $('.standard').css('display', 'none');
        $('.heighten').css('display', 'block');
        $('#proArgument').removeClass('title8').addClass('title41');
        if(tabFlag === 1){
            $('#proArgument').text('增强型主要技术参数');
        }else{
            $('#proArgument').text('Enhanced Model');
        }
        flag = false;
    }
    //标准版显示样式
    function Standard() {
        $('.proGray').css('background', '#656565');
        $('.proGreen').css('background', "transparent");
        $('.tab').css('backgroundImage', 'url(images/b_right.png)');
        $("#gray").css("display", "block");
        $("#green").css("display", "none");
        
        $('.standard').css('display', 'block');
        $('.heighten').css('display', 'none');
        $('#proArgument').removeClass('title41').addClass('title8');
        if(tabFlag === 1){
            $('#proArgument').text('标准型主要技术参数');
        }else{
            $('#proArgument').text('Standard Model');
        }
        flag = true;
    }
    //中英文切换
    var tabFlag = 1;
    //打开时判断localstorage，改变中英文状态
    switch (localStorage.getItem('Switch')) {
        case 'Switch_cn':
            tabFlag = 0;
            Switch_CN_EN(tabFlag,'.cn','.en');
            ChangeStyle();
            tabFlag = 1;
            break;
        case 'Switch_en':
            tabFlag = 1;
            Switch_CN_EN(tabFlag,'.en','.cn');
            ChangeStyle();
            tabFlag = 0;
            break;
        default:
            tabFlag = 0;
            Switch_CN_EN(tabFlag,'.cn','.en');
            ChangeStyle();
            tabFlag = 1;
            break;
    }
    //中文按钮
    $('.cn_en .cn').on('click', function () {
        if (tabFlag === 1) {  //中文状态不能再点击
            return
        }
        //切换为中文
        if (tabFlag === 0) {
            Switch_CN_EN(tabFlag,'.cn','.en');
            ChangeStyle();
            localStorage.setItem('Switch','Switch_cn');  //存储localstorage  中文属性值
            tabFlag = 1;
        }
    });
    //英文按钮
    $('.cn_en .en').on('click', function () {
        if (tabFlag === 0) {  //英文状态下不能在点击
            return
        }
        //切换为英文
        if (tabFlag === 1) {
            Switch_CN_EN(tabFlag,'.en ','.cn');
            ChangeStyle();
            localStorage.setItem('Switch','Switch_en');  //存储localstorage  英文属性值
            tabFlag = 0;
        }
    });
    //中英文切换函数
    function Switch_CN_EN(index,select,unselect) {
        var cn_en_data = {  //本地中英文对照表
            'home': ['首页', 'Home'],
            'title1': ['第五代智能控制网关', 'Fifth Generation Control Processor'],
            'title2': ['标准版', 'Standard'],
            'title3': ['增强版', 'Enhanced'],
            'title4': ['新产品特性', 'New Product Specifications'],
            'title5': ['人工智能控制算法', 'AI Control Algorithm'],
            'title6': ['神经网络控制模式', 'Neural Network Control Mode'],
            'title7': ['跨平台跨网域跨行业', 'Cross Platform and Industry'],
            'title8': ['标准型主要技术参数', 'Standard Model'],
            'title9': ['主CPU i.MX ARM Cortex-A7 528MHz', 'Main CPU i.MX ARM Cortex-A7 528MHz'],
            'title10': ['3 - 7PIN双向RS-232/422/485串行通讯口', '3 - 7Pin bidirectional RS-232/422/485 serial port'],
            'title11': ['Linux4.1.15内核', 'Linux 4.1.15 Kernel'],
            'title12': ['1 - RJ45 10M/100M以太网接口', '1 - RJ45 10M/100M Ethernet port'],
            'title14': ['1 - USB接口', '1 - USB interface'],
            'title16': ['1 - RST系统复位按钮', '1 - RST system reset button'],
            'title17': ['8 - 隔离低压继电器(常开触点) 30VDC/AC 1A', '8 - Isolated low voltage relay(normal open) 30VDC/AC 1A'],
            'title18': ['3 - LED系统状态指示灯', '3 - LED system status indicator'],
            'title19': ['8 - 数字I/O输入', '8 - Digital I/O input'],
            'title20': ['1 - RES系统预留调试接口', '1 - RES system reserved debugging interface'],
            'title21': ['8 - 红外或单向RS-232串行通讯口', '8 - IR(Infrared) or one-way RS-232 serial port'],
            'title22': ['24VDC 1A外部电源输入', '24 VDC 1A external power input'],
            'title23': ['3 - DB9双向RS-232串行通讯口', '3 - DB9 bidirectional RS-232 serial port'],
            'title24': ['标准19英寸机柜安装', 'Standard 19" rack mountable'],

            'title25': ['主CPU i.MX ARM Cortex-A7 696MHz', 'Main CPU i.MX ARM Cortex-A7 696MHz'],
            'title26': ['3 - 7PIN双向RS-232/422/485串行通讯口', '3 - 7Pin bidirectional RS-232/422/485 serial port'],
            'title27': ['Linux4.1.15内核', 'Linux 4.1.15 Kernel'],
            'title28': ['2 - RJ45 10M/100M以太网接口', '2 - RJ45 10/100M Ethernet port'],
            'title30': ['1 - USB接口', '1 - USB interface'],
            'title32': ['1 - RST系统复位按钮', '1 - RST system reset button'],
            'title33': ['8 - 隔离低压继电器(常开触点) 30VDC/AC 1A', '8 - Isolated low voltage relay(normal open) 30VDC/AC 1A'],
            'title34': ['3 - LED系统状态指示灯', '3 - LED system status indicator'],
            'title35': ['8 - 数字I/O输入', '8 - Digital I/O input'],
            'title36': ['1 - RES系统预留调试接口', '1 - RES system reserved debugging interface'],
            'title37': ['8 - 红外或单向RS-232串行通讯口', '8 - IR(Infrared) or one-way RS-232 serial port'],
            'title38': ['24VDC 1A外部电源输入', '24 VDC 1A external power input'],
            'title39': ['3 - DB9双向RS-232串行通讯口', '3 - DB9 bidirectional RS-232 serial port'],
            'title40': ['标准19英寸机柜安装', 'Standard 19" rack mountable'],
            'title41': ['增强型主要技术参数', 'Enhanced Model']
        };
        for (var key in cn_en_data) {
            $('.' + key).html(cn_en_data[key][index]);
        }
        //中英文按钮显示样式
        $(select).css({
            'background': '#fff',
            'color': '#000'
        });
        $(unselect).css({
            'background': '#000',
            'color': '#fff'
        });
    }
    //中英文布局样式调整
    function ChangeStyle() {
        if (tabFlag === 0) { //cn
            $('#top p').css('letterSpacing', '18px');
            $('.proGray span').css('marginLeft', '-6px');
            $('.proGreen span').css('marginLeft', '-6px');
        } else { //en
            $('#top p').css('letterSpacing', '6px');
            $('.proGray span').css('marginLeft', '-14px');
            $('.proGreen span').css('marginLeft', '-17px');
        }
    }
});