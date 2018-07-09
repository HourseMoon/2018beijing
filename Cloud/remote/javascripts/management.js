/*
©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
©2017-2018 北京清立科技有限公司。保留所有权利。

文件名称: management.js
功能: 实现设备管理的相关操作，显示设备列表，绑定设备，解绑设备，设置当前设备，显示设备在线离线状态等
作者: 马跃

版本说明: V1.0
修改描述:
*/

$(function () {
    var index = null; //记录当前选择的下标
    var flag = "noSN";  //判断是否有当前设备
    var deviceList = null; //记录设备列表信息
    var showListTimer = null; //记录显示设备列表定时器
    //登录
    $.ajax({
        type: "POST",
        url: "/login/wx",
        data: {
            packages: JSON.stringify({
                "method": "isLogin"
            })
        },
        success: function (data) {
            if (!data.result.status) {  //没有登录跳回首页
                location.href = "/?login=/remote/device";
            }
        }
    });
    //返回首页
    $(".backHome").on('click',function(){
        location.href = "/";
    });
    //显示当前设备.
    ShwoPresentSN();
    function ShwoPresentSN(){
        //显示当前设备的ajax
        $.ajax({
            type: "POST",
            url: "/remote/device",
            data: {
                packages: JSON.stringify({
                    "method": "chosen"
                })
            },
            success: function (data) {
                //console.log(data);
                if(data.result.sn != ""){  //判断是否有sn
                    //判断在线离线状态
                    if(data.result.line == "on"){  //在线
                        $(".onOffLine").text('在线').css({
                            'background':'url(images/on_line_img.png) no-repeat',
                            'backgroundPosition':'left center'
                        });
                    }else if(data.result.line == "off"){  //离线
                        $(".onOffLine").text('离线').css({
                            'background':'url(images/off_line_img.png) no-repeat',
                            'backgroundPosition':'left center'
                        });
                    }
                    $('#top .sn').text('S/N: ' + data.result.sn.toUpperCase());  //显示当前设备的sn
                    flag = data.result.sn;  //有当前设备 
                }else{
                    flag = "noSN";  //没有当前设备
                    $('#top .sn').text('');
                    $(".onOffLine").text('').css({
                        'background':''
                    });
                }
                ShowList();  //显示列表函数
            }
        });
    }
    
    //8s请求一次请求一次当前设备
    showListTimer = setInterval(function(){
        ShwoPresentSN();
    },8000);
    //显示列表
    function ShowList(){
        $.ajax({
            url: '/remote/device',
            type: 'post',
            data: {
                packages: JSON.stringify({
                    'method': 'show'
                })
            },
            success: function (data) {
                //console.log(data);
                //判断是否与上一次数据相同，不同则更新
                if(JSON.stringify(data.result.device) !== deviceList){
                    $('#content ul li').remove();
                    var line_status = '';  //在线离线中文
                    for(var sn in data.result.device){
                        //判断在线离线
                        if(data.result.device[sn].line == "on"){  //设备在线
                            line_status = '在线';
                            
                            if(flag == sn){ //在线的状态 且为当前设备
                                $('#content ul').append('<li><span class="sn">S/N: ' + sn.toUpperCase() + '</span><span class="on_status">' + line_status + '</span><span class="noChoose choose"></span><span class="unbind"></span></li>');
                                //index = $('#content ul li').index();  //记录选中设备的下标
                            }else{  //在线的状态 且不为当前设备
                                $('#content ul').append('<li><span class="sn">S/N: ' + sn.toUpperCase() + '</span><span class="on_status">' + line_status + '</span><span class="noChoose"></span><span class="unbind"></span></li>');
                            }
                            
                        }else if(data.result.device[sn].line == "off"){  //设备离线
                            line_status = '离线';
                            if(flag == sn){  //离线的状态 且为当前设备
                                $('#content ul').append('<li><span class="sn">S/N: ' + sn.toUpperCase() + '</span><span class="status">' + line_status + '</span><span class="noChoose choose"></span><span class="unbind"></span></li>');
                                //index = $('#content ul li').index();  //记录选中设备的下标
                            }else{  //离线的状态   且不为当前设备
                                $('#content ul').append('<li><span class="sn">S/N: ' + sn.toUpperCase() + '</span><span class="status">' + line_status + '</span><span class="noChoose"></span><span class="unbind"></span></li>');
                            }
                        }
                    }
                    //如果当前没有被选择的  index == null 反之等于被选择的下标
                    $('.choose').parent().index() === -1 ? index = null : index = $('.choose').parent().index();
                    deviceList = JSON.stringify(data.result.device);  //记录当前设备列表信息；
                }
                
            }
        });
    }
    //选择当前设备
    $(document).on('click','.noChoose', function () {
        var __this = $(this);
        var _this = $(this).parent(); //记录被选择的li
        if ($(this).hasClass('choose')) { //如果已被选择，不能再被选择
            return
        }
        //设置当前设备的请求
        $.ajax({
            url: '/remote/device',
            type: 'post',
            data: {
                packages: JSON.stringify({
                    'method': 'choice',
                    'sn': _this.find('.sn').html().split(': ')[1].toUpperCase()
                })
            },
            success: function (data) {
                //console.log(data);
                if(data.result){
                    //判断之前是否已经有被选择的设备
                    if (index === null) {
                        __this.addClass('choose'); //添加classname
                        index = _this.index(); //记录下标
                    } else {
                        __this.addClass('choose');
                        $('.noChoose').eq(index).removeClass('choose'); //移除上一个记录的下标的classname
                        index = _this.index();
                    }
                    ShwoPresentSN();  //调用显示当前设备函数
                }
            }
        });
    });
    //解绑操作
    $(document).on('click', '.unbind',function () {
        var _this = $(this).parent(); //记录被选择的li
        $("#shade").css('display','block').append("<p class='rotate_prompt'></p>");  //打开遮罩层
        $.ajax({
            url: '/remote/device',
            type: 'post',
            data: {
                packages: JSON.stringify({
                    'method': 'unbind',
                    'sn': _this.find('.sn').html().split(': ')[1].toUpperCase()
                })
            },
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    LoopTick();  //调用轮询心跳包
                }else{
                    $("#shade").css('display','block').append("<div class='failed'>解绑失败！</div>");
                    ClearShade();
                }
            }
        });

    });
    //绑定设备
    $('.bindingBtn').on('click', function () {
        if ($('.topLeft input').val() != '') { //判断输入sn不能为空
            $("#shade").css('display','block').append("<p class='rotate_prompt'></p>");  //打开遮罩层
            $.ajax({
                url: '/remote/device',
                type: 'post',
                data: {
                    packages: JSON.stringify({
                        'method': 'bind',
                        'sn': $('.topLeft input').val().toUpperCase()
                    })
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //绑定成功，添加到列表中
                        $('.topLeft input').val('');
                        // setTimeout(function(){
                        //     ShowList();
                        // },500);
                        LoopTick();  //调用轮询心跳包
                    } else { //
                        $("#shade").css('display','block').append("<div class='failed'>绑定失败！</div>");
                        ClearShade();
                    }
                }
            })
        }
    });
    //心跳包查询绑定解绑状态
    function LoopTick () {
        clearInterval(showListTimer); //清除设备列表查询定时器
        var tickNum = 1;  //计时变量 
        //定时器每1s一次
        var tickTimer = setInterval (function(){
            $.ajax({
                type:'post',
                url: '/remote/management',
                data:{
                    packages:JSON.stringify({
                        'method':'tick'
                    })
                },
                success:function(data){
                    //console.log(data);
                    if(data.result.operation){  //判断是否返回数据
                        //返回绑定数据
                        if(data.result.information.method === 'bind'){
                            if(data.result.information.result.success){
                                $("#shade").html('').append("<div class='succeed'>绑定成功！</div>");
                                ClearShade();
                                ShowList();  //绑定成功，调用显示列表函数
                            }else{
                                $("#shade").html('').append("<div class='failed'>绑定失败！</div>");
                                ClearShade();
                            }
                        }
                        //返回解绑数据
                        if(data.result.information.method === 'unbind'){
                            if(data.result.information.result.success){
                                $("#shade").html('').append("<div class='succeed'>解绑成功！</div>");
                                ClearShade();
                                ShwoPresentSN();  //解绑成功
                            }else{
                                $("#shade").html('').append("<div class='failed'>解绑失败！</div>");
                                ClearShade();
                            }
                        }
                        clearInterval(tickTimer);  //清空定时器
                        //重启设备列表定时器
                        showListTimer = setInterval(function(){
                            ShwoPresentSN();
                        },8000);
                    }else{
                        //为false时且计时变量等于60s时清空定时器绑定解绑失败
                        if(tickNum === 60){
                            $("#shade").html('').append("<div class='failed'>失败！</div>");
                            ClearShade();
                            clearInterval(tickTimer);  //清空定时器，停止tick
                        }
                    }
                }
            });
            tickNum++;  
        },1000);
    }
    //清除提示遮罩
    function ClearShade(){
        setTimeout(function(){
            $('#shade').css('display','none').html('');
        },1000);
    }
    //中英文切换
    var tabFlag = 1;
    //打开时判断中英文状态
    switch (localStorage.getItem('Switch')) {
        case 'Switch_cn':
            tabFlag = 0;
            Switch_CN_EN(tabFlag,'.cn','.en');
            tabFlag = 1;
            break;
        case 'Switch_en':
            tabFlag = 1;
            Switch_CN_EN(tabFlag,'.en','.cn');
            tabFlag = 0;
            break;
        default:
            tabFlag = 0;
            Switch_CN_EN(tabFlag,'.cn','.en');
            tabFlag = 1;
            break;
    }
    //中文按钮
    $('.cn_en .cn').on('click', function () {
        if (tabFlag === 1) {  //中文状态下不能在点击
            return
        }
        //改变为中文
        if (tabFlag === 0) {
            Switch_CN_EN(tabFlag,'.cn','.en');
            localStorage.setItem('Switch','Switch_cn');
            tabFlag = 1;
        }
    });
    //英文按钮
    $('.cn_en .en').on('click', function () {
        if (tabFlag === 0) {  //英文状态不能在点击
            return
        }
        //改变为英文
        if (tabFlag === 1) {
            Switch_CN_EN(tabFlag,'.en ','.cn');
            localStorage.setItem('Switch','Switch_en');  //存储localstorage 
            tabFlag = 0;
        }
    });
    //切换中英文函数
    function Switch_CN_EN(index,select,unselect) {
        var cn_en_data = {  //本地中英文对照表
            '_title': ['设备管理','Device Control'],
            'title1': ['设备绑定','Device Binding'],
            'title2': ['当前设备','Current Device'],
            'bindingBtn': ['绑定设备','Binding'],
            'title3': ['设备中心','Device Center'],
            'title4': ['设备(S/N)','Device(S/N)'],
            'title5': ['设备状态','Status'],
            'title6': ['设备操作','Handle'],
            'title7': ['当前设备','Current'],
            'title8': ['解除绑定','Unbind']
        };
        for (var key in cn_en_data) {
            $('.' + key).html(cn_en_data[key][index]);
        }
        //中英文按钮显示样式
        $(select).css({
            'background': '#f7f7f7',
            'color': '#000'
        });
        $(unselect).css({
            'background': '#fff',
            'color': '#cdcdcd'
        });
    }
})