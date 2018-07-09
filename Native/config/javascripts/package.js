/*
©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
©2017-2018 北京清立科技有限公司。保留所有权利。

文件名称: package.js
功能: 实现本地主机的网络地址设置（IP、mac、网关、子网掩码等设置）、DNS服务器设置、云服务器设置（设备的链接离线，显示状态、域名端口等）、系统时间设置、app应用管理、系统版本升级等功能
作者: 马跃

版本说明: 
修改描述:
*/
$(function () {
    window.Ip = 'http://192.168.0.156';
    //查询是否登录
    $.ajax({
        url: '/login/wx',
        type: 'post',
        data: {
            packages: JSON.stringify({
                'method': 'isLogin'
            })
        },
        success: function (data) {
            if (!data.result.status) { //没有登录返回首页
                location.href = '/home?login=/services/config';
            }
        }
    });

    //中英文切换
    var tabFlag = 1; //中英文切换开关 tabFlag = 1  代表中文状态   等于0代表英文状态
    //打开时通过localstorage判断中英文状态
    switch (localStorage.getItem('Switch')) {
        case 'Switch_cn':
            Switch_CN_EN(0, '.cn', '.en');
            tabFlag = 1;
            break;
        case 'Switch_en':
            Switch_CN_EN(1, '.en', '.cn');
            tabFlag = 0;
            break;
        default:
            Switch_CN_EN(0, '.cn', '.en');
            tabFlag = 1;
            break;
    }
    //中文按钮
    $('.cn_en .cn').on('click', function () {
        if (tabFlag === 1) { //中文状态下不能再点击
            return
        }
        //切换中文
        if (tabFlag === 0) {
            Switch_CN_EN(tabFlag, '.cn', '.en');
            localStorage.setItem('Switch', 'Switch_cn'); //存储localstorage，中文属性值
            tabFlag = 1;
        }
    });
    //英文按钮
    $('.cn_en .en').on('click', function () {
        if (tabFlag === 0) {
            return
        }
        //切换英文
        if (tabFlag === 1) {
            Switch_CN_EN(tabFlag, '.en', '.cn');
            localStorage.setItem('Switch', 'Switch_en'); //存储localstorage，英文属性值
            tabFlag = 0;
        }
    });
    //中英文切换函数
    function Switch_CN_EN(index, select, unselect) {
        var cn_en_data = { //本地中英文对照表
            'title1': ['系统设置', 'System Setup'],
            'title2': ['网络地址设置', 'Network address setup'],
            'title3': ['DNS服务器设置', 'DNS Server setup'],
            'title4': ['云服务器设置', 'Cloud server setup'],
            'title5': ['系统时间设置', 'System time setup'],
            'title6': ['APP应用管理', 'APP management'],
            'title7': ['系统版本升级', 'System version upgrade'],
            'ip_title2': ['&nbsp;&nbsp;&nbsp;IP地址', '&nbsp;&nbsp;&nbsp;IP address'],
            'ip_title3': ['&nbsp;&nbsp;&nbsp;端口号', '&nbsp;&nbsp;&nbsp;Port number'],
            'ip_title4': ['子网掩码', 'Subnet Mask'],
            'ip_title5': ['默认网关', 'Default Gateway'],
            'ip_title6': ['MAC地址', 'MAC address'],
            'clearBtn': ['清除', 'Clear'],
            'setBtn': ['设置', 'Setup'],
            'dns_title1': ['首选DNS服务器', 'Preferred DNS server'],
            'dns_title2': ['备选DNS服务器', 'Alternative DNS server'],
            'cloud_title1': ['连云平台', 'Connected cloud'],
            'cloud_title2': ['连接', 'Connect'],
            'cloud_title3': ['离线', 'Off-line'],
            'cloud_title4': ['离线', 'Off-line'],
            'cloud_title5': ['未绑定', 'Unbinding'],
            'cloud_title6': ['在线', 'On-line'],
            'cloud_title7': ['已绑定', 'Bingding'],
            'cloud_title8': ['域名地址', 'Domain name'],
            'time_title1': ['设备日期:', 'Date:'],
            'time_title2': ['设备时间:', 'Time:'],
            'time_title3': ['设置日期:', 'Set date:'],
            'time_title4': ['年', 'Y'],
            'time_title5': ['月', 'M'],
            'time_title6': ['日', 'D'],
            'time_title7': ['设置时间:', 'Set time:'],
            'time_title8': ['时', 'H'],
            'time_title9': ['分', 'M'],
            'time_title10': ['秒', 'S'],
            'time_title11': ['获取电脑时间', 'Get local time'],
            'time_title12': ['设置', 'Setup'],
            'app_title1': ['VN工程创建时间:', 'VN Project creation time:'],
            'app_title2': ['VN软件版本信息:', 'VN version:'],
            'app_title3': ['&nbsp;&nbsp;AI智控应用状态:', 'AI control state:'],
            'app_title4': ['&nbsp;&nbsp;AI智控应用推送:', 'AI control state push:'],
            'app_title5': ['推送', 'Push'],
            'update_title1': ['更新升级', 'Update'],
        };
        for (var key in cn_en_data) {
            $('.' + key).html(cn_en_data[key][index]);
        }
        //改变中英文按钮样式
        $(select).css({
            'background': '#fff',
            'color': '#000'
        });
        $(unselect).css({
            'background': '#E0E0E0',
            'color': '#fff'
        });
        ChangeStyle();
    }

    function ChangeStyle() {
        if (tabFlag === 0) { //cn
            $('.ipBox').css('width', '404px');
            $('.macBox').css('width', '404px');
            $('.IPContent span').css('width', '70px');
            $('.cloudContent .cloud_title1').css('width', '64px');
            $('.cloudContent .cloud_title8').css('width', '64px');
            $('.cloudContent .ip_title3').css('width', '64px');
            $('.cloudContent .cloud_title9').css('width', '64px');
            $('#linkCloud').css('width', '294px');
            $('#linkCloud .on_off_line').css('width', '50px');
            $('.cloudBox').css('width', '470px');
            $('.MACContent .app_title1').css('width', '126px');
            $('.MACContent .app_title2').css('width', '126px');
            $('.MACContent .app_title3').css('width', '126px');
            $('.MACContent .app_title4').css('width', '126px');
        } else { //en
            $('.ipBox').css('width', '470px');
            $('.macBox').css('width', '470px');
            $('.IPContent span').css('width', '127px');
            $('.cloudContent .cloud_title1').css('width', '132px');
            $('.cloudContent .cloud_title8').css('width', '132px');
            $('.cloudContent .ip_title3').css('width', '132px');
            $('.cloudContent .cloud_title9').css('width', '132px');
            $('#linkCloud').css('width', '330px');
            $('#linkCloud .on_off_line').css('width', '60px');
            $('.cloudBox').css('width', '530px');
            $('.MACContent .app_title1').css('width', '200px');
            $('.MACContent .app_title2').css('width', '200px');
            $('.MACContent .app_title3').css('width', '200px');
            $('.MACContent .app_title4').css('width', '200px');
        }
    }



    var showPackages = {
        "method": "show"
    }; //发送显示ajax的data数据
    var markYear, markMonth; //记录现在的年月
    var setFlag; //判断输入的内容是否合法，合法为true可以进行设置，反之不能设置
    var Timer; //云平台/app在线状态查询定时器
    var pushFlag; //推送按钮开关
    //各个设置窗口的划入划出效果
    $(".setBox").hover(
        function () {
            $(this).addClass("setShadow");
        },
        function () {
            $(this).removeClass("setShadow");
        }
    );
    //各个设置窗口的点击打开事件
    $(".setBox").on("click", function () {
        $(".userSet").find("i").css("background", "");
        $(".userSet").find("input").css("border", "1px solid #a9a9a9");
        if ($(this).index() == "0") { //显示网络地址设置窗口
            $(".setIPBox").css("display", "block");
            $(".IPContent input").css({
                "border": "1px solid #a9a9a9",
                "color": "#606060"
            });
            ShowIP(); //调用显示IP函数
        } else if ($(this).index() == "1") { //显示DNS设置
            $(".setDNSBox").css("display", "block");
            $(".DNSContent input").css({
                "border": "1px solid #a9a9a9",
                "color": "#606060"
            });
            ShowDNS(); //调用显示dns函数
        } else if ($(this).index() == "4") { //显示app设置
            $(".setMACBox").css("display", "block");
            // $(".MACContent input").css({
            //     "border": "1px solid #a9a9a9",
            //     "color": "#606060"
            // });
            ShowAPP(); //调用显示app函数
        } else if ($(this).index() == "2") { //显示云服务器设置
            $(".setCloudBox").css("display", "block");
            $(".CloudContent input").css({
                "border": "1px solid #a9a9a9",
                "color": "#606060"
            });
            ShowCloud(); //调用显示cloud函数
        }
    });
    //打开系统设置时间窗口
    $("#timeBtn").on("click", function () {
        $(".setTimeBox").css("display", "block");
        $(".userSet").css("display", "none");
        ShowTime(); //调用显示系统时间函数
    });
    //打开系统升级窗口
    $("#updateBtn").on("click", function () {
        //隐藏其他窗口
        $(".setTimeBox").css("display", "none");
        $(".userSet").css("display", "none");
        $(".updateBox").css("display", "block");
        //显示系统升级信息
        $.ajax({
            url: Ip + "/services/config/system",
            type: "post",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                //移除之前的显示信息增加新的内容
                $('.updateContent p').remove();
                $('.updateContent ul').remove();
                //$(".updateContent").prepend('<p><i>VN软件:</i><span>' + data.result.info.VN + '</span></p><p><i>LN软件:</i><span>' + data.result.info.LN + '</span></p><p><i>系统版本:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>版本说明:</i><span>本次系统升级主要内容</span></p><ul></ul>');

                switch (localStorage.getItem('Switch')) {
                    case 'Switch_cn':
                        $(".updateContent").prepend('<p><i>VN软件:</i><span>' + data.result.info.VN + '</span></p><p><i>LN软件:</i><span>' + data.result.info.LN + '</span></p><p><i>系统版本:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>版本说明:</i><span>本次系统升级主要内容</span></p><ul></ul>');
                        break;
                    case 'Switch_en':
                        $(".updateContent").prepend('<p><i>VN:</i><span>' + data.result.info.VN + '</span></p><p><i>LN:</i><span>' + data.result.info.LN + '</span></p><p><i>System version:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>imprint:</i><span>This system upgrade main content</span></p><ul></ul>');
                        break;
                    default:
                        $(".updateContent").prepend('<p><i>VN软件:</i><span>' + data.result.info.VN + '</span></p><p><i>LN软件:</i><span>' + data.result.info.LN + '</span></p><p><i>系统版本:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>版本说明:</i><span>本次系统升级主要内容</span></p><ul></ul>');
                        break;
                }

                for (var i = 0; i < data.result.info.update.length; i++) {
                    $(".updateContent ul").append('<li>' + data.result.info.update[i] + '</li>');
                }
            }
        })
    });
    //关闭各个设置窗口
    $(".back").on("click", function () {
        $(this).parent().parent().css("display", "none"); //关闭设置弹窗
        $(".checkLi").css("display", "none"); //隐藏日期时间选择弹窗
        //清除定时器
        clearInterval(Timer);
    });
    //清除按钮
    $(".clearBtn").on("click", function () {
        //输入框存在错误时禁止设置
        for (var i = 0; i < $(this).parent().find("input").length; i++) {
            $(this).parent().find("input").eq(i).attr("data-flag", 'false');
        }
        $(this).parent().find("input").not(".protInput").not(".sn input").val(""); //清空各个输入框的填入数据
    });
    //ip,mac,dns输入框的失焦事件
    $(".checkIp input").on("blur", function () {
        var regVal = $(this).val(); //获取当前的输入值
        var _this = $(this); //获取当前的输入框
        CheckInput(regVal, _this); //调用检验输入是否合法函数
    });
    //ip设置按钮
    $(".ipSetBtn").on("click", function () {
        //输入框存在错误时禁止设置
        for (var i = 0; i < $(".IPContent input").length; i++) {
            if ($(".IPContent input").eq(i).attr("data-flag") == "false") {
                setFlag = false;
                break;
            }
        }
        if (setFlag) {
            var IP_href = $(".ipInput").val(); //记录设置的ip 
            //console.log(ipPackages);
            $.ajax({ //发送设置请求
                type: "post",
                url: "/services/config/network",
                data: {
                    packages: JSON.stringify({
                        "method": "set",
                        "ip": $(".ipInput").val(),
                        'mac': $('.macInput').val(),
                        "mask": $(".maskInput").val(),
                        "gateway": $(".gatewayInput").val()
                    })
                },
                success: function (data) {
                    //console.log(data);
                }
            });
            //设置成功提示框
            //$(".shade").css("display", "block").append('<div class="showData">' +
            // '<p>设置成功!</p>' +
            // '</div>');
            _Succeed();
            setTimeout(function () {
                location.href = 'http://' + IP_href + '/home/'; //设置成功后自动跳转设置后home页
            }, 1050);

        } else { //设置失败显示提示窗
            _Failed();  
        }

    });
    //dns设置按钮
    $(".dnsSetBtn").on("click", function () {
        //输入存在错误时不能设置
        for (var i = 0; i < $(".DNSContent input").length; i++) {
            if ($(".DNSContent input").eq(i).attr("data-flag") == "false") {
                setFlag = false;
                break;
            }
        }
        if (setFlag) {
            var dnsPackages = {
                "method": "set",
                "dns1": $(".dns1Input").val(),
                "dns2": $(".dns2Input").val()
            };
            //发送设置请求
            $.ajax({
                type: "post",
                url: Ip + "/services/config/dns",
                data: {
                    packages: JSON.stringify(dnsPackages)
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //成功后显示提示框
                        //$(".shade").css("display", "block").append('<div class="showData">' +
                        // '<p>设置成功!</p>' +
                        // '</div>');
                        _Succeed();
                    }
                }
            });
        } else { //输入错误时显示提示窗
            _Failed();
        }

    });
    //云平台链接/离线
    $('.onOffLineBox').on('click', function () {
        //判断点击的是链接还是离线
        if ($(this).hasClass('off_line')) { //离线
            //发送离线请求
            $.ajax({
                url: Ip + '/logic/debug',
                type: "POST",
                data: {
                    packages: JSON.stringify({
                        "method": "l2d",
                        "information": {
                            "method": "disconnect"
                        }
                    })
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //设置成功改变样式
                        $('.off_line').css('backgroundColor', '#606060'); //离线选中
                        $('.on_line').css('backgroundColor', '#FFFFFF'); //在线不选中
                    }
                }
            });
        } else if ($(this).hasClass('on_line')) { //链接
            //发送链接请求
            $.ajax({
                url: Ip + '/logic/debug',
                type: "POST",
                data: {
                    packages: JSON.stringify({
                        "method": "l2d",
                        "information": {
                            "method": "connect"
                        }
                    })
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //设置成功改变样式
                        $('.off_line').css('backgroundColor', '#FFFFFF'); //离线不选中
                        $('.on_line').css('backgroundColor', '#606060'); //在线选中
                        // $('.on_line_img').css('backgroundImage','url("images/onLine.png")');  //离线状态
                        // $('.on_off').text('在线');
                    }
                }
            });
        }
    });
    //云平台设置
    $(".cloudSetBtn").on("click", function () {
        //输入错误不能设置
        for (var i = 0; i < $(".setCloudBox input").length; i++) {
            if ($(".setCloudBox input").eq(i).attr("data-flag") == "false") {
                setFlag = false;
                break;
            }
        }
        if (setFlag) {
            //发送设置请求
            $.ajax({
                type: 'POST',
                url: Ip + '/services/config/cloud',
                data: {
                    packages: JSON.stringify({
                        'method': 'set',
                        'hostname': $('.domainAddress input').val(),
                        'port': parseInt($('.cloud_port').val()).toString()
                    })
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //显示成功的提示框
                        _Succeed();
                    } else { //显示失败提示框
                        _Failed();
                    }
                }
            });
        } else { //输入错误提示框
            _Failed();
        }

    });
    //推送按钮
    $('.appDownload').on('click', function () {
        //按钮可用状态下发送请求
        if (pushFlag) {
            $.ajax({
                type: "POST",
                url: Ip + "/aictrl/app",
                data: {
                    packages: JSON.stringify({
                        'method': 'push'
                    })
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //显示设置成功提示框
                        // $(".shade").css("display", "block").append('<div class="showData">' +
                        //     '<p>推送成功!</p>' +
                        //     '</div>');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $(".shade").css("display", "block").append('<div class="showData">' +
                                '<p>推送成功!</p>' +
                                '</div>');
                                break;
                            case 'Switch_en':
                                $(".shade").css("display", "block").append('<div class="showData">' +
                                '<p>Push Succeed!</p>' +
                                '</div>');
                                break;
                            default:
                                $(".shade").css("display", "block").append('<div class="showData">' +
                                '<p>推送成功!</p>' +
                                '</div>');
                                break;
                        }
                        setTimeout(function () {
                            $(".shade").css("display", "none");
                            $(".showData").remove();
                        }, 1000);
                    } else { //显示失败提示框
                        // $(".shade").css("display", "block").append('<div class="showData">' +
                        //     '<p>推送失败!</p>' +
                        //     '</div>');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $(".shade").css("display", "block").append('<div class="showData">' +
                                '<p>推送失败!</p>' +
                                '</div>');
                                break;
                            case 'Switch_en':
                                $(".shade").css("display", "block").append('<div class="showData">' +
                                '<p>Push Failed!</p>' +
                                '</div>');
                                break;
                            default:
                                $(".shade").css("display", "block").append('<div class="showData">' +
                                '<p>推送失败!</p>' +
                                '</div>');
                                break;
                        }
                        $(".showData").css("backgroundImage", "url(images/cw_icon.png)").css("backgroundPosition", "10px 10px");
                        setTimeout(function () {
                            $(".shade").css("display", "none");
                            $(".showData").remove();
                        }, 1000);
                    }
                }
            });
        }
    });
    //系统时间设置按钮
    $(".setTimeBtn").on("click", function () {
        var timePackages = { //获取输入的时间
            "method": "set",
            "date": $(".checkYears input").val() + "-" + $(".checkMonths input").val() + "-" + $(".checkDays input").val() + " " + $(".checkHours input").val() + ":" + $(".checkMins input").val() + ":" + $(".checkSecs input").val()
        };
        //输入的时间不能为空
        if ($(".checkYears input").val() != '' &&
            $(".checkMonths input").val() != '' &&
            $(".checkDays input").val() != '' &&
            $(".checkHours input").val() != '' &&
            $(".checkMins input").val() != '' &&
            $(".checkSecs input").val() != '') {
            //发送设置请求
            $.ajax({
                type: "post",
                url: Ip + "/services/config/date",
                data: {
                    packages: JSON.stringify(timePackages)
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) { //显示设置成功提示框
                        // $(".shade").css("display", "block").append('<div class="showData">' +
                        //     '<p>设置成功!</p>' +
                        //     '</div>');
                        _Succeed();
                        //更新显示的数据
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $(".years").find("span").eq(1).html($(".checkYears input").val() + "年" + $(".checkMonths input").val() + "月" + $(".checkDays input").val() + "日");
                                break;
                            case 'Switch_en':
                                $(".years").find("span").eq(1).html($(".checkYears input").val() + "-" + $(".checkMonths input").val() + "-" + $(".checkDays input").val());
                                break;
                            default:
                                $(".years").find("span").eq(1).html($(".checkYears input").val() + "年" + $(".checkMonths input").val() + "月" + $(".checkDays input").val() + "日");
                                break;
                        }
                        //$(".years").find("span").eq(1).html($(".checkYears input").val() + "年" + $(".checkMonths input").val() + "月" + $(".checkDays input").val() + "日");

                        $(".hours").find("span").eq(1).html($(".checkHours input").val() + ":" + $(".checkMins input").val() + ":" + $(".checkSecs input").val());
                        setTimeout(function () {
                            $(".shade").css("display", "none");
                            $(".showData").remove();
                        }, 2000);
                    }
                }
            });

        } else { //输入错误提示
            _Failed();
        }
        $('.checkLi').hide();
    });
    //获取电脑时间
    $(".getTimeBtn").on("click", function () {
        var myDate = new Date();
        myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        myDate.getDate(); //获取当前日(1-31)
        myDate.getHours(); //获取当前小时数(0-23)
        myDate.getMinutes(); //获取当前分钟数(0-59)
        myDate.getSeconds(); //获取当前秒数(0-59)
        $(".checkYears input").val(myDate.getFullYear());
        $(".checkMonths input").val(parseInt(myDate.getMonth() + 1));
        $(".checkDays input").val(myDate.getDate());
        //时分秒不足两位数时显示为两位数
        if (myDate.getHours() < 10) {
            $(".checkHours input").val('0' + myDate.getHours());
        } else {
            $(".checkHours input").val(myDate.getHours());
        }
        if (myDate.getMinutes() < 10) {
            $(".checkMins input").val('0' + myDate.getMinutes());
        } else {
            $(".checkMins input").val(myDate.getMinutes());
        }
        if (myDate.getSeconds() < 10) {
            $(".checkSecs input").val('0' + myDate.getSeconds());
        } else {
            $(".checkSecs input").val(myDate.getSeconds());
        }
        $('.checkLi').hide();
    });
    //确定系统升级按钮
    $("#ensureUpdate").on("click", function () {
        $('.shade').css("display", "block").html("").append('<div class="rotate_prompt"></div>'); //打开遮罩层
        //发送设置请求
        $.ajax({
            url: Ip + "/services/config/system",
            type: "post",
            data: {
                packages: JSON.stringify({
                    "method": "update"
                })
            },
            success: function (data) {
                //console.log(data);
                if (data.result.upgrade) { //升级成功提示框
                    $('.updateContent p').remove();
                    $('.updateContent ul').remove();
                    // $(".shade").css("display", "block").html("").append('<div class="showData">' +
                    //     '<p>升级成功!</p>' +
                    //     '</div>');
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $(".shade").css("display", "block").html("").append('<div class="showData">' +
                            '<p>升级成功!</p>' +
                            '</div>');
                            break;
                        case 'Switch_en':
                            $(".shade").css("display", "block").html("").append('<div class="showData">' +
                            '<p>Succeed!</p>' +
                            '</div>');
                            break;
                        default:
                            $(".shade").css("display", "block").html("").append('<div class="showData">' +
                            '<p>升级成功!</p>' +
                            '</div>');
                            break;
                    }    
                    setTimeout(function () {
                        $(".shade").css("display", "none");
                        $(".showData").remove();
                    }, 1000);
                    //更新升级成功后的显示详情
                    //$(".updateContent").prepend('<p><i>VN软件:</i><span>' + data.result.info.VN + '</span></p><p><i>LN软件:</i><span>' + data.result.info.LN + '</span></p><p><i>系统版本:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>版本说明:</i><span>本次系统升级主要内容</span></p><ul></ul>');
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $(".updateContent").prepend('<p><i>VN软件:</i><span>' + data.result.info.VN + '</span></p><p><i>LN软件:</i><span>' + data.result.info.LN + '</span></p><p><i>系统版本:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>版本说明:</i><span>本次系统升级主要内容</span></p><ul></ul>');
                            break;
                        case 'Switch_en':
                            $(".updateContent").prepend('<p><i>VN:</i><span>' + data.result.info.VN + '</span></p><p><i>LN:</i><span>' + data.result.info.LN + '</span></p><p><i>System version:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>imprint:</i><span>This system upgrade main content</span></p><ul></ul>');
                            break;
                        default:
                            $(".updateContent").prepend('<p><i>VN软件:</i><span>' + data.result.info.VN + '</span></p><p><i>LN软件:</i><span>' + data.result.info.LN + '</span></p><p><i>系统版本:</i><span class="versions">' + data.result.info.fsversion + '</span></p><p><i>版本说明:</i><span>本次系统升级主要内容</span></p><ul></ul>');
                            break;
                    }
                    for (var i = 0; i < data.result.info.update.length; i++) {
                        $(".updateContent ul").append('<li>' + data.result.info.update[i] + '</li>');
                    }
                } else { //升级失败提示
                    // $(".shade").css("display", "block").html("").append('<div class="showData">' +
                    //     '<p>升级失败!</p>' +
                    //     '</div>');
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $(".shade").css("display", "block").html("").append('<div class="showData">' +
                            '<p>升级失败!</p>' +
                            '</div>');
                            break;
                        case 'Switch_en':
                            $(".shade").css("display", "block").html("").append('<div class="showData">' +
                            '<p>Failed!</p>' +
                            '</div>');
                            break;
                        default:
                            $(".shade").css("display", "block").html("").append('<div class="showData">' +
                            '<p>升级失败!</p>' +
                            '</div>');
                            break;
                    } 
                    $(".showData").css("backgroundImage", "url(images/cw_icon.png)").css("backgroundPosition", "10px 10px");
                    setTimeout(function () {
                        $(".shade").css("display", "none");
                        $(".showData").remove();
                    }, 1000);
                }
            }
        })
    });

    //打开日期时间选择按钮
    $(".setTimeBox .checkBtn").on("click", function () {
        $(this).next().toggle();
    });
    $('.setTimeBox .time input').on('focus', function () {
        $('.checkLi').hide();
    });
    //日期时间失焦事判断输入是否符合
    $('.setTimeBox .time input').on('blur', function () {
        if (/^\d*$/.test($(this).val())) {
            if ($(this).parent().hasClass('checkMonths')) {
                if ($(this).val() > 12 || $(this).val() < 0) {
                    $(this).val('');
                }
            }
            if ($(this).parent().hasClass('checkDays')) {
                if ($(this).val() > 31 || $(this).val() < 0) {
                    $(this).val('');
                }
            }
            if ($(this).parent().hasClass('checkHours')) {
                if ($(this).val() > 24 || $(this).val() < 0) {
                    $(this).val('');
                }
                if ($(this).val().length <= 1) {
                    $(this).val('0' + $(this).val());
                }
            }
            if ($(this).parent().hasClass('checkMins')) {
                if ($(this).val() > 60 || $(this).val() < 0) {
                    $(this).val('');
                }
                if ($(this).val().length <= 1) {
                    $(this).val('0' + $(this).val());
                }
            }
            if ($(this).parent().hasClass('checkSecs')) {
                if ($(this).val() > 60 || $(this).val() < 0) {
                    $(this).val('');
                }
                if ($(this).val().length <= 1) {
                    $(this).val('0' + $(this).val());
                }
            }
        } else {
            $(this).val('');
        }
    });
    //打开年份选择框
    $(".checkYears .checkBtn").on("click", function () {
        //$(this).next().css("display","block");  //打开时间选择列表
        var startYear = parseInt(parseInt(markYear) - 20); //年份开始时间
        var endYear = parseInt(parseInt(markYear) + 20); //年份结束时间
        for (var i = startYear; i < endYear; i++) {
            $(".checkYearsLi ul").append('<li>' + i + '</li>'); //循环插入年份，当前年份的前后10年
        }
    });
    //打开日的选择下拉框
    $(".checkDays .checkBtn").on("click", function () {
        CheckDate($(".checkYears span").html(), $(".checkMonths span").html()); //调用插入天数的函数
        //$(this).next().css("display","block");  //打开时间选择列表
    });
    //日期时间下拉菜单的选择
    $(document).on("click", ".checkLi ul li", function () {
        $(this).parent().parent().parent().find("input").val($(this).html()); //将选择的内容显示到上面显示框
        $(this).parent().parent().css("display", "none"); //隐藏下拉选择框
    });

    //显示IP的ajax
    function ShowIP() {
        $(".IPContent input").css({
            "border": "1px solid #a9a9a9",
            "color": "#606060"
        });
        $.ajax({
            type: "POST",
            url: Ip + "/services/config/network",
            data: {
                packages: JSON.stringify(showPackages)
            },
            success: function (data) {
                //console.log(data);
                $(".ipInput").val(data.result.ip);
                $(".maskInput").val(data.result.mask);
                $(".gatewayInput").val(data.result.gateway);
                $('.macInput').val(data.result.mac);
                setFlag = true;
                for (var i = 0; i < $(".IPContent input").length; i++) {
                    $(".IPContent input").eq(i).attr("data-flag", "true");
                }
            }
        });
    };
    //显示DNS的ajax
    function ShowDNS() {
        $(".DNSContent input").css({
            "border": "1px solid #a9a9a9",
            "color": "#606060"
        });
        $.ajax({
            type: "POST",
            url: Ip + "/services/config/dns",
            data: {
                packages: JSON.stringify(showPackages)
            },
            success: function (data) {
                //console.log(data);
                $(".dns1Input").val(data.result.dns1);
                $(".dns2Input").val(data.result.dns2);
                setFlag = true;
                for (var i = 0; i < $(".DNSContent input").length; i++) {
                    $(".DNSContent input").eq(i).attr("data-flag", "true");
                }
            }
        });

    };
    //显示APP的ajax
    function ShowAPP() {
        //显示信息
        $.ajax({
            type: "POST",
            url: Ip + "/aictrl/app",
            data: {
                packages: JSON.stringify(showPackages)
            },
            success: function (data) {
                //console.log(data);
                $(".VN_time").text(data.result.time);
                $('.VN_vision').text(data.result.version);

            }
        });
        //在线状态查询
        Timer = setInterval(function () {
            $.ajax({
                type: "POST",
                url: Ip + "/aictrl/app",
                data: {
                    packages: JSON.stringify({
                        'method': "isAlive"
                    })
                },
                success: function (data) {
                    //console.log(data);
                    if (data.result) {
                        $('.onOffLineStatus').css('background', '#1CAA16');
                        //$('.APPStatus').text('APP在线');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.APPStatus').text('APP在线');
                                break;
                            case 'Switch_en':
                                $('.APPStatus').text('APP On-line');
                                break;
                            default:
                                $('.APPStatus').text('APP在线');
                                break;
                        }
                        $(".appDownload").css('background', 'rgba(96,96,96,1)');
                        pushFlag = true;
                    } else {
                        $('.onOffLineStatus').css('background', '#D12D2C');
                        //$('.APPStatus').text('APP离线');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.APPStatus').text('APP离线');
                                break;
                            case 'Switch_en':
                                $('.APPStatus').text('APP Off-line');
                                break;
                            default:
                                $('.APPStatus').text('APP离线');
                                break;
                        }
                        $(".appDownload").css('background', 'rgba(96,96,96,0.6)');
                        pushFlag = false;
                    }
                }
            });
        }, 1000);
    };
    //显示Cloud的ajax
    function ShowCloud() {
        $(".cloudBox input").css({
            "border": "1px solid #a9a9a9",
            "color": "#606060"
        });
        $.ajax({
            type: "POST",
            url: Ip + "/services/config/cloud",
            data: {
                packages: JSON.stringify(showPackages)
            },
            success: function (data) {
                //console.log(data);
                if (data.result.hostname == '') {
                    $('.domainInput').val(data.result.hostname).attr("data-flag", "false");
                } else {
                    $('.domainInput').val(data.result.hostname).attr("data-flag", "true");
                }

                $('.cloud_port').val(data.result.port).attr("data-flag", "true");
                setFlag = true;
                //判断是链接还是离线
                if (data.result.connect == "on") {
                    $('.on_line').css('backgroundColor', '#606060'); //在线显示为选中状态
                    $('.off_line').css('backgroundColor', '#FFFFFF'); //离线不选中
                } else if (data.result.connect == 'off') {
                    $('.off_line').css('backgroundColor', '#606060'); //离线选中
                    $('.on_line').css('backgroundColor', '#FFFFFF'); //在线不选中
                }
                //判断是否在线
                if (data.result.line == "on") { //在线
                    $('.on_line_img').css('backgroundImage', 'url("images/onLine.png")'); //离线状态
                    $('.on_off').text('在线');
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $('.on_off').text('在线');
                            break;
                        case 'Switch_en':
                            $('.on_off').text('On-line');
                            break;
                        default:
                            $('.on_off').text('在线');
                            break;
                    }
                } else if (data.result.line == "off") { //离线
                    $('.on_line_img').css('backgroundImage', 'url("images/offLine.png")'); //离线状态
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $('.on_off').text('离线');
                            break;
                        case 'Switch_en':
                            $('.on_off').text('Off-line');
                            break;
                        default:
                            $('.on_off').text('离线');
                            break;
                    }
                }
                //判断是否绑定
                if (data.result.bind == 'on') { //绑定
                    $('.bind_img').css('backgroundImage', 'url("images/bind.png")');
                    //$('.bind_unbind').text('已绑定');
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $('.bind_unbind').text('已绑定');
                            break;
                        case 'Switch_en':
                            $('.bind_unbind').text('Binding');
                            break;
                        default:
                            $('.bind_unbind').text('已绑定');
                            break;
                    }
                } else if (data.result.bind == 'off') { //未绑定
                    $('.bind_img').css('backgroundImage', 'url("images/unbind.png")');
                    //$('.bind_unbind').text('未绑定');
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $('.bind_unbind').text('未绑定');
                            break;
                        case 'Switch_en':
                            $('.bind_unbind').text('Unbinding');
                            break;
                        default:
                            $('.bind_unbind').text('未绑定');
                            break;
                    }
                }
            }
        });
        //请求显示sn
        $.ajax({
            "url": Ip + "/factory/sn/",
            "type": "POST",
            "data": {
                "packages": JSON.stringify({
                    "method": "show"
                })
            },
            "success": function (data) {
                //console.log(data);
                $('.sn input').val(data.result.sn.toUpperCase()).attr("data-flag", "true");
            }
        });
        //在线状态查询
        Timer = setInterval(function () {
            $.ajax({
                type: "POST",
                url: Ip + "/services/config/cloud",
                data: {
                    packages: JSON.stringify(showPackages)
                },
                success: function (data) {
                    //console.log(data);
                    //判断是链接还是离线
                    if (data.result.connect == "on") {
                        $('.on_line').css('backgroundColor', '#606060'); //在线显示为选中状态
                        $('.off_line').css('backgroundColor', '#FFFFFF'); //离线不选中
                    } else if (data.result.connect == 'off') {
                        $('.off_line').css('backgroundColor', '#606060'); //离线选中
                        $('.on_line').css('backgroundColor', '#FFFFFF'); //在线不选中
                    }
                    //判断是否在线
                    if (data.result.line == "on") { //在线
                        $('.on_line_img').css('backgroundImage', 'url("images/onLine.png")'); //离线状态
                        //$('.on_off').text('在线');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.on_off').text('在线');
                                break;
                            case 'Switch_en':
                                $('.on_off').text('On-line');
                                break;
                            default:
                                $('.on_off').text('在线');
                                break;
                        }
                    } else if (data.result.line == "off") { //离线
                        $('.on_line_img').css('backgroundImage', 'url("images/offLine.png")'); //离线状态
                        //$('.on_off').text('离线');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.on_off').text('离线');
                                break;
                            case 'Switch_en':
                                $('.on_off').text('Off-line');
                                break;
                            default:
                                $('.on_off').text('离线');
                                break;
                        }
                    }
                    //判断是否绑定
                    if (data.result.bind == 'on') { //绑定
                        $('.bind_img').css('backgroundImage', 'url("images/bind.png")');
                        //$('.bind_unbind').text('已绑定');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.bind_unbind').text('已绑定');
                                break;
                            case 'Switch_en':
                                $('.bind_unbind').text('Binding');
                                break;
                            default:
                                $('.bind_unbind').text('已绑定');
                                break;
                        }
                    } else if (data.result.bind == 'off') { //未绑定
                        $('.bind_img').css('backgroundImage', 'url("images/unbind.png")');
                        //$('.bind_unbind').text('未绑定');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.bind_unbind').text('未绑定');
                                break;
                            case 'Switch_en':
                                $('.bind_unbind').text('Unbinding');
                                break;
                            default:
                                $('.bind_unbind').text('未绑定');
                                break;
                        }
                    }
                    $('.domainInput').val(data.result.hostname);
                    $('.cloud_port').val(data.result.port);
                }
            });
        }, 6000);
    };
    //显示 时间的ajax
    function ShowTime() {
        $.ajax({
            type: "POST",
            url: Ip + "/services/config/date",
            data: {
                packages: JSON.stringify(showPackages)
            },
            success: function (data) {
                //console.log(data);
                var date = data.result.date.split(" ")[0];
                var time = data.result.date.split(" ")[1];
                switch (localStorage.getItem('Switch')) {
                    case 'Switch_cn':
                        $(".years").find("span").eq(1).html(date.replace("-", "年").replace("-", "月") + "日");
                        break;
                    case 'Switch_en':
                        $(".years").find("span").eq(1).html(date);
                        break;
                    default:
                        $(".years").find("span").eq(1).html(date.replace("-", "年").replace("-", "月") + "日");
                        break;
                }
                //$(".years").find("span").eq(1).html(date.replace("-", "年").replace("-", "月") + "日"); //显示年月日
                if (time.split(":")[0].length == 1) {
                    time = '0' + time.split(":")[0] + ":" + time.split(":")[1] + ":" + time.split(":")[2]; //显示时间
                }
                if (time.split(":")[1].length == 1) {
                    time = time.split(":")[0] + ":" + '0' + time.split(":")[1] + ":" + time.split(":")[2]; //显示时间
                }
                if (time.split(":")[2].length == 1) {
                    time = time.split(":")[0] + ":" + time.split(":")[1] + ":" + '0' + time.split(":")[2]; //显示时间
                }
                $(".hours").find("span").eq(1).text(time); //显示时间

                $(".checkYears input").val(date.split("-")[0]); //显示年
                $(".checkMonths input").val(date.split("-")[1]); //显示月
                $(".checkDays input").val(date.split("-")[2]); //显示日

                $(".checkHours input").val(time.split(":")[0]); //显示时
                $(".checkMins input").val(time.split(":")[1]); //显示分
                $(".checkSecs input").val(time.split(":")[2]); //显示秒

                markYear = date.split("-")[0];
                markMonth = date.split("-")[1];
                CheckDate(markYear, markMonth);
            }
        });
    };
    //根据判断年份月份动态生成天数
    function CheckDate(year, month) {
        if (IsRunYear(year)) {
            if (month == "2") {
                for (var i = 1; i < 30; i++) {
                    $(".checkDaysLi ul").append('<li>' + i + '</li>'); //循环插入年份，当前年份的前后10年
                }
            }
        } else {
            if (month == "2") {
                for (var i = 1; i < 29; i++) {
                    $(".checkDaysLi ul").append('<li>' + i + '</li>'); //循环插入年份，当前年份的前后10年
                }
            }
        }
        if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
            for (var i = 1; i < 32; i++) {
                $(".checkDaysLi ul").append('<li>' + i + '</li>'); //循环插入年份，当前年份的前后10年
            }
        } else if (month == "4" || month == "6" || month == "9" || month == "11") {
            for (var i = 1; i < 31; i++) {
                $(".checkDaysLi ul").append('<li>' + i + '</li>'); //循环插入年份，当前年份的前后10年
            }
        }

        function IsRunYear(year) { //判断是润平年
            return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
        }
    };
    //检验输入是否合法
    function CheckInput(input, _this) {
        if (_this.hasClass('macInput')) { //校验mac
            var temp = /^[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}$/;
            var regexpMAC = new RegExp(temp);
            if (regexpMAC.test(input)) {
                _this.next().css("background", "url('images/true_img.png') no-repeat");
                _this.css({
                    "border": "1px solid #a9a9a9",
                    "color": "#606060"
                });
                _this.attr('data-flag', 'true');
                setFlag = true;
            } else {
                _this.next().css("background", "url('images/false_img.png') no-repeat");
                _this.css({
                    "border-color": "red",
                    "color": "red"
                });
                _this.attr('data-flag', 'false');
                setFlag = false;
            }
        } else if (_this.hasClass('domainInput')) { //校验域名
            var parten = /^(?=^.{3,255}$)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;
            if (parten.test(input)) {
                _this.next().css("background", "url('images/true_img.png') no-repeat");
                _this.css({
                    "border": "1px solid #a9a9a9",
                    "color": "#606060"
                });
                _this.attr('data-flag', 'true');
                setFlag = true;
            } else {
                _this.next().css("background", "url('images/false_img.png') no-repeat");
                _this.css({
                    "border-color": "red",
                    "color": "red"
                });
                _this.attr('data-flag', 'false');
                setFlag = false;
            }
        } else if (_this.hasClass('cloud_port')) { //校验端口
            var parten = /^(\d)+$/g;
            if (parten.test(input) && parseInt(input) <= 65535 && parseInt(input) >= 0) {
                _this.next().css("background", "url('images/true_img.png') no-repeat");
                _this.css({
                    "border": "1px solid #a9a9a9",
                    "color": "#606060"
                });
                _this.attr('data-flag', 'true');
                setFlag = true;
            } else {
                _this.next().css("background", "url('images/false_img.png') no-repeat");
                _this.css({
                    "border-color": "red",
                    "color": "red"
                });
                _this.attr('data-flag', 'false');
                setFlag = false;
            }
        } else { //校验ip  dns
            var patrn = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var regexpMAC = new RegExp(patrn);
            if (regexpMAC.test(input)) {
                _this.next().css("background", "url('images/true_img.png') no-repeat");
                _this.css({
                    "border": "1px solid #a9a9a9",
                    "color": "#606060"
                });
                _this.attr('data-flag', 'true');
                setFlag = true;
            } else {
                _this.next().css("background", "url('images/false_img.png') no-repeat");
                _this.css({
                    "border-color": "red",
                    "color": "red"
                });
                _this.attr('data-flag', 'false');
                setFlag = false;
            }
        }

    };
    //输入成功提示
    function _Succeed() {
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $(".shade").css("display", "block").append('<div class="showData">' +
                    '<p>设置成功!</p>' +
                    '</div>');
                break;
            case 'Switch_en':
                $(".shade").css("display", "block").append('<div class="showData">' +
                    '<p>Succeed!</p>' +
                    '</div>');
                break;
            default:
                $(".shade").css("display", "block").append('<div class="showData">' +
                    '<p>设置成功!</p>' +
                    '</div>');
                break;
        }
        setTimeout(function () {
            $(".shade").css("display", "none");
            $(".showData").remove();
        }, 2000);
    }
    //输入不符合提示
    function _Failed() {
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $(".shade").css("display", "block").append('<div class="showData">' +
                    '<p>输入不符合!</p>' +
                    '</div>');
                break;
            case 'Switch_en':
                $(".shade").css("display", "block").append('<div class="showData">' +
                    '<p>Input mismatch!</p>' +
                    '</div>');
                break;
            default:
                $(".shade").css("display", "block").append('<div class="showData">' +
                    '<p>输入不符合!</p>' +
                    '</div>');
                break;
        }
        $(".showData").css("backgroundImage", "url(images/cw_icon.png)").css("backgroundPosition", "10px 10px");
        setTimeout(function () {
            $(".shade").css("display", "none");
            $(".showData").remove();
        }, 1000);
    }
})