/*
 ©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
 ©2017-2018 北京清立科技有限公司。保留所有权利。

 文件名称: manage.js
 功能: VN图片资源的导入导出管理，贴图按钮模板的创建，特效按钮模板及其他空间模板的显示，组件组组件组模板的管理，LN系统模块，系统宏模块的显示，红外模块、用户模块及用户宏模块的管理；
 作者: Mayue

 版本说明: 资源管理前端1.0开发版
 修改描述:
 */
$(document).ready(function () {
    window.Ip = 'http://192.168.0.156';
    //查询是否登录
    $.ajax({
        url: Ip + '/login/wx',
        type: 'post',
        data: {
            packages: JSON.stringify({
                'method': 'isLogin'
            })
        },
        success: function (data) {
            if (!data.result.status) { //false  跳回首页
                //location.href = '/home?login=/services/management';
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
    var deletePackages = {
        "method": "delete"
    }; //删除资源请求时发送的数据
    var exportPackages = { //自建模块导出发送后台的数据结构
        "method": "pack"
    };
    var dragPackages = { //请求红外接口显示的数据
        "method": "irAdd",
        "port": "",
        "file": ""
    };
    var markLoad; //记录载入弹窗里选择的数据
    var markPicName; //记录被选择的图片的名字用于创建贴图按钮;
    var loadFlag; //判断是激活还是非激活的载入
    //var markWH = ''; //记录被选择的图片的width和height
    var quote = null; //记录删除含有宏模块的自建模块数据；
    var deleteName = []; //记录选择资源的数组
    var deleteLi = []; //记录选择的资源的下标
    var btnFlag = "picture"; //判断切换删除,导入按钮的功能；
    var num; //记录li的下标，用于循环对象时设置每个li；每次切换重置
    var memoryFlag = true; //用于判断内容满后，禁止再导入资源
    var file; //上传文件用
    var allCheckFlag = true; //判断是否全选
    var picBtnNameFlag = true; //判断用户输入的名称是否符合要求
    //var letter = "A"; //记录红外接口选项卡状态
    PicPath(); // 调用图片资源显示函数
    Memory(); //调用内存容量显示函数

    //导航栏被选择的样式
    $("#nav ul li").on("click", function () {
        deleteName.length = 0; //清空保存删除信息的数组
        deleteLi.length = 0; //清空保存删除li的下标
        $(".allChecked").css("backgroundImage", "");
        allCheckFlag = true;
        //导航栏各选项卡操作
        if ($(this).index() == "0" && !$(this).hasClass('checkLi')) { //------一般图片资源
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            $(".batch_inport").remove(); //移除批量导入
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            PicPath(); //调用显示图片资源的函数
            
        } else if ($(this).index() == "1" && !$(this).hasClass('checkLi')) { //------贴图按钮模板
            //批量导入按钮
            // $("#con_nav").append('<span class="batch_inport">批量导入</span>');
            // $('.inport').text('创建模板');
            $('.inport').addClass('title35').removeClass('title15');  //添加导入按钮的中英文对照classname
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $("#con_nav").append('<span class="batch_inport title34">批量导入</span>');
                    $('.inport').text('创建模板');
                    break;
                case 'Switch_en':
                    $("#con_nav").append('<span class="batch_inport  title34">Import</span>');
                    $('.inport').text('Create');
                    break;
                default:
                    $("#con_nav").append('<span class="batch_inport  title34">批量导入</span>');
                    $('.inport').text('创建模板');
                    break;
            }
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            SystemPicBtn(); //显示系统贴图按钮模板函数
        } else if ($(this).index() == "2" && !$(this).hasClass('checkLi')) { //------特效按钮模板
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            SpecialBtn(); //显示特殊控件按钮模板函数
        } else if ($(this).index() == "3" && !$(this).hasClass('checkLi')) { //------其他控件模板
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            //调整工具栏的显示效果
            $("#title span").css("backgroundPosition", "-131px -53px"); //修改内容区标题的图片
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").css("display", "none"); //隐藏分享删除等按钮
            $(".inport").css("display", "none"); //隐藏导入按钮
            $("#content").css("display", "none"); //隐藏内容显示区与canvas特效按钮模板切换显示
            //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡
            $(".canvasBox").css("display", "block"); //显示特效按钮模板
        } else if ($(this).index() == "4" && !$(this).hasClass('checkLi')) { //------系统出厂模块
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            SystemModule(); //显示系统出厂模块函数
        } else if ($(this).index() == "5" && !$(this).hasClass('checkLi')) { //------用户自建模块
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            UserModule(); //调用自建模块函数
        } else if ($(this).index() == "6" && !$(this).hasClass('checkLi')) { //-------标准红外模块
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            Infrared(); //调用红外模块显示函数
        } else if ($(this).index() == "7" && !$(this).hasClass('checkLi')) { //------组件组模板.
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            SystemBtnGroup(); //调用系统组件组显示函数
        } else if ($(this).index() == "8" && !$(this).hasClass('checkLi')) { //------出厂宏模板
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            SystemMacroModule(); //调用出厂宏模块
        } else if ($(this).index() == "9" && !$(this).hasClass('checkLi')) { //------用户宏模块
            $(".batch_inport").remove(); //移除批量导入
            $('.inport').addClass('title15').removeClass('title35');  //添加导入按钮的中英文对照classname
            TabImport();
            //$('.inport').text('导入');
            $("#title").html($(this).html()); //每次切换修改内容区的标题
            $("#tool").find(".export").remove(); //移除插入的导出按钮
            $("#tool").find(".share").remove(); //移除插入的分享按钮
            UserMacroModule(); //调用用户宏模块显示函数
        }
        $(this).addClass("checkLi").siblings().removeClass("checkLi"); //被选择的样式添加背景图片
        ToolHover();
    });
    //删除共享导出按钮的hover事件
    function ToolHover() {
        //工具栏的滑入划出样式
        $(document).find('#tool div').hover(function () {
            if ($(this).hasClass('share')) {
                $(this).find('span').css({
                    'backgroundPosition': '-98px -86px'
                });
            } else if ($(this).hasClass('delete')) {
                $(this).find('span').css({
                    'backgroundPosition': '-124px -86px'
                });
            } else if ($(this).hasClass('export')) {
                $(this).find('span').css({
                    'backgroundPosition': '-150px -86px'
                });
            }

        }, function () {
            if ($(this).hasClass('share')) {
                $(this).find('span').css({
                    'backgroundPosition': '-20px -86px'
                });
            } else if ($(this).hasClass('delete')) {
                $(this).find('span').css({
                    'backgroundPosition': '-46px -86px'
                });
            } else if ($(this).hasClass('export')) {
                $(this).find('span').css({
                    'backgroundPosition': '-72px -86px'
                });
            }
        });
    }
    ToolHover();
    //导入图片
    function uploadPictures(form) {
        $.ajax({
            url: Ip + "/services/management/picture/upload",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                //console.log(data);
                $("#content ul").append("<li style='background-image: url(" + Ip + "/Picture/" + data.result + ");'>" +
                    "<div class='checkCircle' data-checked = 'false'>" +
                    "</div>" +
                    "<p class='resourceName checkName'>" + data.result + "</p>" +
                    "</li>");
                HandleLi(); //调用li列表的操作函数
                Memory(); //调用内存容量显示函数
            }
        });
    }
    //批量导入用户帖图按钮模板
    function uploadPicBtns(form) {
        TabImporting();  //正在导入遮罩层的中英文切换
        //$("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
        $.ajax({
            url: Ip + "/services/management/buttonModule/import",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    $("#shade").css("display", "none").html(""); //移除遮罩层
                    UserPicBtn();
                    Memory(); //调用内存容量显示函数
                } else {
                    TabImporFail(); //导入失败提示 中英文切换
                }
            }
        });
    }
    //导入自建模块
    function uploadUserModule(form) {
        num = 0; //记录li的下标
        TabImporting();  //正在导入遮罩层的中英文切换
        //$("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
        $.ajax({
            url: Ip + "/services/management/usermodule/upload/",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    $("#shade").css("display", "none").html(""); //移除遮罩层
                    UserModule(); //调用自建模块显示函数
                    Memory(); //调用内存容量显示函数
                    ToolHover();
                } else {
                    TabImporFail(); //导入失败提示 中英文切换
                }

            }
        });
    }
    //导入自建宏模块
    function uploadUserMacro(form) {
        num = 0; //记录li的下标
        TabImporting();  //正在导入遮罩层的中英文切换
        //$("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
        $.ajax({
            url: Ip + "/services/management/macro/upload",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    $("#shade").css("display", "none").html(""); //移除遮罩层
                    UserMacroModule(); //调用自建宏模块的显示函数
                    Memory(); //调用内存容量显示函数
                    ToolHover();
                } else {
                    TabImporFail(); //导入失败提示 中英文切换
                }

            }
        });
    }
    //导入用户组件组模板
    function uploadBtnGroup(form) {
        num = 0; //记录li的下标
        TabImporting();  //正在导入遮罩层的中英文切换
        //$("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
        $.ajax({
            url: Ip + "/services/management/component/upload",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                //console.log(data);
                //判断是否成功
                if (data.result) { //成功
                    $("#shade").css("display", "none").html(""); //移除遮罩层
                    UserBtnGroup(); //调用用户组件组模板的显示函数
                    Memory(); //调用内存容量显示函数
                } else { //不成功
                    TabImporFail(); //导入失败提示 中英文切换
                }

            }
        });
    }
    //导入标准红外模块
    function uploadInfrared(form) {
        TabImporting();  //正在导入遮罩层的中英文切换
        //$("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
        $.ajax({
            url: Ip + "/services/management/infrared/import",
            type: "POST",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    $("#shade").css("display", "none").html(""); //移除遮罩层
                    Infrared(); //调用红外模块显示函数
                    Memory(); //调用内存容量显示函数
                } else {
                    TabImporFail(); //导入失败提示 中英文切换
                }
            }
        });
    }
    //图片资源显示函数
    function PicPath() {
        btnFlag = "picture"; //记录当前按钮是删除图片资源状态
        $("#content ul li").remove(); //显示资源之前先清空内容区
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-20px -53px"); //修改内容区标题的图片
        $(".allCheckBox").css("display", "block"); //显示全选按钮
        $(".classify").css("display", "none"); //隐藏组件分类
        //调整分享删除导出按钮的样式
        $("#tool").css({
            "width": "76px",
            "display": "block"
        });
        //删除按钮边框线调整
        $("#tool .delete").css({
            "borderRight": "0",
            "borderLeft": "0"
        });
        //与其他内容互斥显示
        $(".inport").css("display", "block"); //显示导入按钮模块
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡
        $.ajax({
            type: "POST",
            url: Ip + "/services/management/picture",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                //动态插入资源内容
                if ($('#nav ul li').eq(0).hasClass('checkLi')) {
                    $("#content ul li").remove(); //显示资源之前先清空内容区
                    for (var i = 0; i < data.result.img.length; i++) {
                        $("#content ul").append("<li style='background-image: url(" + Ip + data.result.path + data.result.img[i] + ");'>" +
                            "<div class='checkCircle' data-checked = 'false'>" +
                            "</div>" +
                            "<p class='resourceName checkName'>" + data.result.img[i] + "</p>" +
                            "</li>");
                    }
                    //设置动态加载的li的显示效果
                    $("#content ul li").removeClass("content_li").css("width", "128px");
                    $("#content ul li p").css("marginTop", "135px");
                    HandleLi();
                }
            }
        });
    }
    //系统贴图按钮显示函数
    function SystemPicBtn() {
        btnFlag = "picBtn"; //记录当前删除按钮是删除贴图按钮模板
        $("#content ul li").remove();
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-57px -53px"); //修改内容区标题的图片
        //调整分享删除导出按钮的样式
        $("#tool").css({
            "width": "224px",
            "display": "none"
        });
        //调整分享删除样式
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#tool").append('<div class="export">' + '<span></span><i class="title35">导出</i>' + '</div>').prepend('<div class="share">' + '<span></span><i class="title36">分享</i>' + '</div>'); //插入导出按钮;先移除再插入防止重复
                break;
            case 'Switch_en':
                $("#tool").append('<div class="export">' + '<span></span><i class="title35">Export</i>' + '</div>').prepend('<div class="share">' + '<span></span><i class="title36">Share</i>' + '</div>'); //插入导出按钮;先移除再插入防止重复
                break;
            default:
                $("#tool").append('<div class="export">' + '<span></span><i class="title35">导出</i>' + '</div>').prepend('<div class="share">' + '<span></span><i class="title36">分享</i>' + '</div>'); //插入导出按钮;先移除再插入防止重复
                break;
        }
        //$("#tool").append('<div class="export">' + '<span></span>导出' + '</div>').prepend('<div class="share">' + '<span></span>分享' + '</div>'); //插入导出按钮;先移除再插入防止重复
        //调整删除按钮的边框样式
        $("#tool .delete").css({
            "borderRight": "1px solid #415B7C",
            "borderLeft": "1px solid #415B7C"
        });
        //与其他内容的互斥显示
        $(".inport").css("display", "none"); //默认系统模板隐藏导入按钮，用户模板显示导入按钮
        $(".allCheckBox").css("display", "none"); //隐藏全选按钮
        $(".classify").css("display", "block"); //隐藏组件分类
        $("#systemClassify").prop("checked", true); //默认显示系统模板
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板

        $.ajax({
            type: "POST",
            url: Ip + "/services/management/button/module",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                if ($('#nav ul li').eq(1).hasClass('checkLi')) {
                    $("#content ul li").remove(); //显示资源之前先清空内容区
                    //动态插入资源内容
                    for (var i = 0; i < data.result.manufacturer.name.length; i++) {
                        $("#content ul").append("<li>" +
                            '<div class="picBtnLi">' +
                            '<div class="toggleDiv" style="background-image: url(' + Ip + data.result.manufacturer.path + data.result.manufacturer.name[i] + '/inactive.png)"></div>' +
                            '</div>' +
                            "<p class='picBtnName checkName'>" + data.result.manufacturer.name[i] + "</p>" +
                            "</li>");
                    };
                    //设置动态加载的li的显示效果
                    $("#content ul li").removeClass("content_li").css("width", "128px");
                    $("#content ul li p").css("marginTop", "8px");
                    $("#content ul li").hover( //li的移入移出效果
                        function () {
                            $(this).css("borderColor", "#606060");
                        },
                        function () {
                            $(this).css("borderColor", "#bbbbbb");
                        }
                    );
                    //贴图按钮的点击切换激活非激活状态
                    $('#content ul li .toggleDiv').on('mousedown', function () {
                        var imageUrl = $(this).css('backgroundImage').replace('inactive.png', 'active.png');
                        $(this).css('backgroundImage', imageUrl);
                        $('#content ul li .toggleDiv').on('mouseup', function () {
                            $('#content ul li .toggleDiv').off('mouseup');
                            if ($(this).css('backgroundImage') == imageUrl) {
                                $(this).css('backgroundImage', $(this).css('backgroundImage').replace('active.png', 'inactive.png'));
                            }
                        });
                    });

                }
            }
        });
    }
    //用户贴图按钮显示函数
    function UserPicBtn() {
        $("#content ul li").remove();
        if ($("#tool .share").length > 1) {
            $("#tool .share").eq(1).remove();
        }
        $.ajax({
            type: "POST",
            url: Ip + "/services/management/button/module",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                if ($("#nav ul li").eq(1).hasClass('checkLi')) {
                    $("#content ul li").remove(); //显示资源之前先清空内容区
                    //动态插入显示资源
                    for (var i = 0; i < data.result.user.name.length; i++) {
                        $("#content ul").append("<li>" +
                            "<div class='checkCircle' data-checked = 'false'></div>" +
                            '<div class="picBtnLi">' +
                            '<div class="toggleDiv" style="background-image: url(' + Ip + data.result.user.path + data.result.user.name[i] + '/inactive.png)"></div>' +
                            '</div>' +
                            "<p class='picBtnName checkName'>" + data.result.user.name[i] + "</p>" +
                            "</li>");
                    };
                    HandleLi(); //调用资源选择的函数
                    //贴图按钮的点击切换激活非激活状态
                    $('#content ul li .toggleDiv').on('mousedown', function () {
                        var imageUrl = $(this).css('backgroundImage').replace('inactive.png', 'active.png');
                        $(this).css('backgroundImage', imageUrl);
                        $('#content ul li .toggleDiv').on('mouseup', function () {
                            $('#content ul li .toggleDiv').off('mouseup');
                            if ($(this).css('backgroundImage') == imageUrl) {
                                $(this).css('backgroundImage', $(this).css('backgroundImage').replace('active.png', 'inactive.png'));
                            }
                        });
                    });
                }
            }
        });
    }
    //贴图按钮创建函数
    function CreatePicBtn() {
        var picBtnPackages = { //拼凑发送给后台的数据结构
            "method": "create",
            "name": $("#picBtnName").val(),
            "active": $(".activeBtn").attr("data-picName"),
            "inactive": $(".inactiveBtn").attr("data-picName")
        };
        $.ajax({
            type: "POST",
            url: Ip + "/services/management/button/module",
            data: {
                packages: JSON.stringify(picBtnPackages)
            },
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    var picBtnStr = '<li>' +
                        "<div class='checkCircle' data-checked = 'false'></div>" +
                        '<div class="picBtnLi">' +
                        '<div style="background-image: url(' + Ip + '/ButtonModule/user/' + picBtnPackages.name + '/inactive.png)"></div>' +
                        '</div>' +
                        '<p class="picBtnName checkName">' + picBtnPackages.name + '</p>' +
                        '</li>';
                    $("#content ul").append(picBtnStr);
                    Memory(); //调用内存容量显示函数
                    HandleLi();
                    picBtnNameFlag = true;
                    $("#shade").css("display", "none"); //隐藏遮罩层
                    $("#inportPic").css("display", "none"); //隐藏导入弹窗
                    //清空弹框里输入的参数
                    $("#picBtnName").val("");
                    $(".active").find("input").attr("value", "");
                    $(".inactive").find("input").attr("value", "");
                    $(".showBox").find("div").css("backgroundImage", "");
                    $("#picBtnName").css("color", "#606060");
                    //markWH = '';  //清空保存被选择资源的尺寸数据
                } else {
                    //$("#picBtnName").attr("placeholder", "输入名称重复").css("color", "red").val("");
                    switch (localStorage.getItem('Switch')) {
                        case 'Switch_cn':
                            $("#picBtnName").attr("placeholder", "输入名称重复").css("color", "red").val("");
                            break;
                        case 'Switch_en':
                            $("#picBtnName").attr("placeholder", "The name is repeated").css("color", "red").val("");
                            break;
                        default:
                            $("#picBtnName").attr("placeholder", "输入名称重复").css("color", "red").val("");
                            break;
                    }
                }
            }
        });
    }
    //系统模块显示函数
    function SystemModule() {
        num = 0; //记录li的下标
        $("#content ul li").remove();
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-316px -53px"); //修改内容区标题的图片
        $("#tool").css("display", "none"); //隐藏分享删除导出按钮
        $(".inport").css("display", "none"); //隐藏导入按钮
        $(".allCheckBox").css("display", "none"); //隐藏全选按钮
        $(".classify").css("display", "none"); //隐藏组件分类
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡

        $.ajax({
            type: "POST",
            url: Ip + "/logic/load",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                packages: JSON.stringify({
                    "method": 'resources'
                })
            },
            success: function (data) {
                if ($("#nav ul li").eq(4).hasClass('checkLi')) {
                    var basicModule = data.result.manufacturer.module;
                    //接口模块
                    for (var name in basicModule.Interface) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Interface[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Interface[name]);
                        num++;
                    }
                    //系统模块
                    for (var name in basicModule.System) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.System[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.System[name]);
                        num++;
                    }
                    //网络模块
                    for (var name in basicModule.Network) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Network[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Network[name]);
                        num++;
                    }
                    //Analog
                    for (var name in basicModule.Analog) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Analog[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Analog[name]);
                        num++;
                    }
                    //Conditional
                    for (var name in basicModule.Conditional) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Conditional[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Conditional[name]);
                        num++;
                    }
                    //Counters
                    for (var name in basicModule.Counters) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Counters[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Counters[name]);
                        num++;
                    }
                    //Memory
                    for (var name in basicModule.Memory) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Memory[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Memory[name]);
                        num++;
                    }
                    //Serial
                    for (var name in basicModule.Serial) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Serial[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Serial[name]);
                        num++;
                    }
                    //Time/Date
                    for (var name in basicModule.TimeDate) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.TimeDate[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.TimeDate[name]);
                        num++;
                    }
                    //Timers
                    for (var name in basicModule.Timers) {
                        var module = $("<li>" +
                            "<p class='resourceName checkName'>" + basicModule.Timers[name].Class + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule.Timers[name]);
                        num++;
                    }
                    //设置li的显示效果
                    $("#content ul li").addClass("content_li").css("width", "230px");
                    $("#content ul li p").css("marginTop", "235px");
                    $("#content ul li").hover( //li的移入移出效果
                        function () {
                            $(this).css("borderColor", "#606060");
                        },
                        function () {
                            $(this).css("borderColor", "#bbbbbb");
                        }
                    );
                }
            }
        })
    }
    //用户自建模块显示函数
    function UserModule() {
        btnFlag = "userModule"; //记录当前删除按钮是删除用户自建模块
        num = 0; //记录li的下标
        $("#content ul li").remove();
        $("#tool").find('.export').remove();
        $("#tool").find('.share').remove();
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-168px -53px"); //修改内容区标题的图片
        // //调整分享删除样式
        // $("#tool").append('<div class="export">' +
        //     '<span></span>导出' +
        //     '</div>').prepend('<div class="share">' +
        //     '<span></span>分享' +
        //     '</div>').css({"width": "224px","display": "block"}); //插入导出按钮;
        //
        TabExport_Share(); //调整分享删除样式  中英文切换
        $(".inport").css("display", "block"); //显示导入按钮
        //调整删除按钮的边框样式
        $("#tool .delete").css({
            "borderRight": "1px solid #415B7C",
            "borderLeft": "1px solid #415B7C"
        });
        $(".classify").css("display", "none"); //隐藏组件分类
        $(".allCheckBox").css("display", "block"); //显示全选按钮
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡
        $(".canvasBox").css("display", "none"); //显示特效按钮模板
        $("#content").css("display", "block"); //隐藏内容显示区与canvas特效按钮模板切换显示
        $.ajax({
            type: "POST",
            url: Ip + "/logic/load",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                packages: JSON.stringify({
                    "method": 'resources'
                })
            },
            success: function (data) {
                //console.log(data);
                if ($('#nav ul li').eq(5).hasClass('checkLi')) {
                    var basicModule = data.result.user.module;
                    //自建模块
                    for (var name in basicModule) {
                        var module = $("<li>" +
                            "<div class='checkCircle' data-checked = 'false'>" +
                            "</div>" +
                            "<p class='resourceName checkName' data-realName='" + basicModule[name].Class + "'>" + basicModule[name].Name + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule[name]);
                        num++;
                    }
                    //设置li的显示效果
                    $("#content ul li").addClass("content_li").css("width", "230px");
                    $("#content ul li p").css("marginTop", "235px");
                    HandleLi();
                }
            }
        })
    }
    //出厂宏模块显示函数
    function SystemMacroModule() {
        num = 0;
        $("#content ul li").remove();
        //调整工具栏显示效果
        $("#title span").css("backgroundPosition", "-242px -53px"); //修改内容区标题的图片
        $("#tool").css("display", "none"); //隐藏分享删除导出按钮
        $(".inport").css("display", "none"); //隐藏导入按钮
        $(".allCheckBox").css("display", "none"); //隐藏全选按钮
        $(".classify").css("display", "none"); //隐藏组件分类
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡

        $.ajax({
            type: "POST",
            url: Ip + "/logic/load",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                packages: JSON.stringify({
                    "method": 'resources'
                })
            },
            success: function (data) {
                //console.log(data);
                if ($("#nav ul li").eq(8).hasClass('checkLi')) {
                    var basicModule = data.result.manufacturer.macro;
                    //自建模块
                    for (var name in basicModule) {
                        var module = $("<li>" +
                            "<div class='checkCircle' data-checked = 'false'>" +
                            "</div>" +
                            "<p class='resourceName checkName' data-realname='" + basicModule[name].description.Class + "'>" + basicModule[name].description.Name + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule[name].description);
                        num++;
                    }
                    //设置li的显示效果
                    $("#content ul li").addClass("content_li").css("width", "230px");
                    $("#content ul li p").css("marginTop", "235px");
                    HandleLi();
                }
            }
        })
    }
    //用户宏模块显示函数
    function UserMacroModule() {
        btnFlag = "userMacro"; //记录当前删除按钮是删除用户宏模块
        num = 0; //记录li的下标
        $("#content ul").find("li").remove();
        $("#tool").find('.export').remove();
        $('#tool').find('.share').remove();
        //调整工具栏显示效果
        $("#title span").css("backgroundPosition", "-279px -53px"); //修改内容区标题的图片
        $(".inport").css("display", "block"); //显示导入按钮
        $(".allCheckBox").css("display", "block"); //显示全选按钮
        $(".classify").css("display", "none"); //隐藏组件分类
        // //调整分享删除样式
        // $("#tool").append('<div class="export">' +
        //     '<span></span>导出' +
        //     '</div>').prepend('<div class="share">' +
        //     '<span></span>分享' +
        //     '</div>').css({
        //     "width": "224px",
        //     "display": "block"
        // }); //插入导出按钮;先移除再插入防止重复
        TabExport_Share(); //调整分享删除样式  中英文切换
        //调整删除按钮的边框样式
        $("#tool .delete").css({
            "borderRight": "1px solid #415B7C",
            "borderLeft": "1px solid #415B7C"
        });
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡
        $.ajax({
            type: "POST",
            url: Ip + "/logic/load",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                packages: JSON.stringify({
                    "method": 'resources'
                })
            },
            success: function (data) {
                //console.log(data);
                if ($("#nav ul li").eq(9).hasClass('checkLi')) {
                    var basicModule = data.result.user.macro;
                    //自建模块
                    for (var name in basicModule) {
                        var module = $("<li>" +
                            "<div class='checkCircle' data-checked = 'false'>" +
                            "</div>" +
                            "<p class='resourceName checkName' data-realname='" + basicModule[name].description.Class + "'>" + basicModule[name].description.Name + "</p>" +
                            "<svg><g></g></svg>" +
                            "</li>"); //动态创建模块的缩略图
                        $("#content ul").append(module);
                        addBox($("#content ul").find("li").eq(num).find("svg g"), basicModule[name].description);
                        num++;
                    }
                    //设置li的显示效果
                    $("#content ul li").addClass("content_li").css("width", "230px");
                    $("#content ul li p").css("marginTop", "235px");
                    HandleLi();
                }
            }
        })
    }
    //用户组件组模板显示函数
    function UserBtnGroup() {
        $("#content ul").find("li").remove();
        if ($("#tool .share").length > 1) {
            $("#tool .share").eq(1).remove();
            $("#tool .export").eq(1).remove();
        }
        $.ajax({
            type: "post",
            url: Ip + "/vision/componentGroup",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                if ($('#nav ul li').eq(7).hasClass('checkLi')) {
                    $("#content ul li").remove(); //显示资源之前先清空内容区
                    for (var name in data.result.user.componentGroup) {
                        var userGroupStr = data.result.user.componentGroup[name].split('data-groupname="')[1]; //获取组件组显示名称
                        $("#content ul").append("<li>" +
                            "<div class='checkCircle' data-checked = 'false'>" +
                            "</div>" + data.result.user.componentGroup[name].replace(/url\(/g, 'url(' + Ip + data.result.user.path).replace(/local="/g, 'src="' + Ip + data.result.user.path) +
                            "<p class='picBtnName checkName' data-realname='" + name + "'>" + userGroupStr.substring(0, userGroupStr.indexOf('"')) + "</p>" +
                            "</li>");
                    };
                    //组件组里包含canvas标签时，重绘一次，否则显示不出来
                    for (var i = 0; i < $('.progressBox[data-type="gaugeModel"]').length; i++) {
                        $('.progressBox[data-type="gaugeModel"]').eq(i).parent().html($('.progressBox[data-type="gaugeModel"]').eq(i).parent().html());
                    }

                    //设置li的显示效果
                    $("#content ul li").addClass("content_li").css({
                        "width": "110px",
                        "height": "110px"
                    });
                    $("#content ul li p").css("marginTop", "4px");
                    HandleLi();
                    //预览效果
                    $("#content ul li").on("click", function () {
                        var previewLi = $(this).find(".componentGroup").get(0).outerHTML;
                        $("#previewShade").css("display", "block").append(previewLi);
                        for (var i = 0; i < $('.progressBox[data-type="gaugeModel"]').length; i++) {
                            $('.progressBox[data-type="gaugeModel"]').eq(i).parent().html($('.progressBox[data-type="gaugeModel"]').eq(i).parent().html());
                        }
                        $("#previewShade .componentGroup").css({
                            "transform": "scale(8)",
                            "top": "50%",
                            "left": "50%"
                        });
                    });
                    //关闭预览效果
                    $("#previewShade").on("click", function () {
                        $(this).css("display", "none").html("");
                    });
                }
            }
        });
    }
    //系统组件组模板显示函数
    function SystemBtnGroup() {
        btnFlag = "btnGroup"; //记录当前删除按钮是删除组件组
        $("#content ul li").remove();
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-205px -53px"); //修改内容区标题的图片
        //调整分享删除样式
        // $("#tool").append('<div class="export">' +
        //     '<span></span>导出' +
        //     '</div>').prepend('<div class="share">' +
        //     '<span></span>分享' +
        //     '</div>').css({
        //     "width": "224px",
        //     "display": "block"
        // }); //插入导出按钮;先移除再插入防止重复
        TabExport_Share(); //调整分享删除样式  中英文切换
        $(".inport").css("display", "block"); //显示导入按钮
        //调整删除按钮的边框样式
        $("#tool .delete").css({
            "borderRight": "1px solid #415B7C",
            "borderLeft": "1px solid #415B7C"
        });
        $("#tool").css("display", "none"); //隐藏工具栏
        $(".inport").css("display", "none"); //默认系统模板隐藏导入按钮，用户模板显示导入按钮
        $(".allCheckBox").css("display", "none"); //隐藏全选按钮
        $(".classify").css("display", "block"); //隐藏组件分类
        $("#systemClassify").prop("checked", true); //默认显示系统模板
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡
        $.ajax({
            type: "post",
            url: Ip + "/vision/componentGroup",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                if ($('#nav ul li').eq(7).hasClass('checkLi')) {
                    $("#content ul li").remove(); //显示资源之前先清空内容区
                    for (var name in data.result.manufacturer.componentGroup) {
                        var sysGroupStr = data.result.manufacturer.componentGroup[name].split('data-groupname="')[1];
                        $("#content ul").append("<li>" + data.result.manufacturer.componentGroup[name].replace(/url\(/g, 'url(' + Ip + data.result.manufacturer.path).replace(/local="/g, 'src="' + Ip + data.result.manufacturer.path) +
                            "<p class='picBtnName checkName'>" + sysGroupStr.substring(0, sysGroupStr.indexOf('"')) + "</p>" +
                            "</li>");
                    };
                    //设置li的显示效果
                    $("#content ul li").addClass("content_li").css({
                        "width": "110px",
                        "height": "110px"
                    });
                    $("#content ul li p").css("marginTop", "20px");
                    $("#content ul li").hover( //li的移入移出效果
                        function () {
                            $(this).css("borderColor", "#606060");
                        },
                        function () {
                            $(this).css("borderColor", "#bbbbbb");
                        }
                    );
                    //点击预览组件组
                    $("#content ul li").on("click", function () {
                        var previewLi = $(this).find(".componentGroup").get(0).outerHTML;
                        $("#previewShade").css("display", "block").append(previewLi);
                        $("#previewShade .componentGroup").css({
                            "transform": "scale(8)",
                            "top": "50%",
                            "left": "50%"
                        });
                    });
                    //关闭预览
                    $("#previewShade").on("click", function () {
                        $(this).css("display", "none").html("");
                    });
                }
            }
        });
    }
    //标准红外模块显示函数
    function Infrared() {
        btnFlag = "infrared"; //记录当前按钮是删除红外资源状态
        $("#content ul li").remove();
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-353px -53px"); //修改内容区标题的图片
        $(".allCheckBox").css("display", "block"); //显示全选按钮
        $(".classify").css("display", "none"); //隐藏组件分类
        //调整分享删除导出按钮的样式
        $("#tool").css({
            "width": "76px",
            "display": "block"
        });
        //删除按钮边框线调整
        $("#tool .delete").css({
            "borderRight": "0",
            "borderLeft": "0"
        });
        $(".inport").css("display", "block"); //显示导入按钮模块
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "block"); //显示红外接口选项卡
        $.ajax({
            type: "POST",
            url: Ip + "/services/management/infrared",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                if ($("#nav ul li").eq(6).hasClass('checkLi')) {
                    $("#content ul li").remove(); //显示资源之前先清空内容区
                    TabInfrared(data.result.list);  //显示资源  中英文切换
                    // for (var i = 0; i < data.result.list.length; i++) {
                    //     $("#content ul").append(' <li style = "width: 212px; height: 140px;font-size: 12px;margin-left: 30px;color:#606060;" class="ui-widget-content">' +
                    //         '<div class="checkCircle" data-checked="false" style="display: none;"></div>' +
                    //         '<h1 class="checkName" style="width: 190px;margin-top: 15px;margin-left: 10px;">文件名称:<i style="float:right;">' + data.result.list[i].fileName + '</i></h1>' +
                    //         '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;">生产厂商:<i style="float:right;">' + data.result.list[i].manufacturer + '</i></h1>' +
                    //         '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;">设备型号:<i style="float:right;">' + data.result.list[i].deviceModel + '</i></h1>' +
                    //         '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;">遥控器型号:<i style="float:right;">' + data.result.list[i].remoteModel + '</i></h1>' +
                    //         '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;">设备类型:<i style="float:right;">' + data.result.list[i].deviceType + '</i></h1>' +
                    //         '</li>');
                    // }
                    //红外模块的拖拽效果
                    // $(".ui-widget-content").draggable({
                    //     distance: 20,
                    //     opacity: 0.7,
                    //     helper: "clone",
                    //     start: function () {
                    //         dragPackages.port = letter;
                    //         dragPackages.file = $(this).find(".checkName i").text();
                    //     }
                    // });
                    HandleLi();
                }
            }
        });
    }
    //特效按钮模板显示函数
    function SpecialBtn() {
        $("#content ul li").remove();
        //调整工具栏的显示效果
        $("#title span").css("backgroundPosition", "-94px -53px"); //修改内容区标题的图片
        $("#tool").css("display", "none"); //隐藏分享删除导出按钮
        $(".inport").css("display", "none"); //隐藏导入按钮
        $(".allCheckBox").css("display", "none"); //隐藏全选按钮
        $(".classify").css("display", "none"); //隐藏组件分类
        $("#content").css("display", "block"); //显示其他列表内容的父级框
        $(".canvasBox").css("display", "none"); //隐藏其他控件按钮模板
        //$(".infraredBox").css("display", "none"); //隐藏红外接口选项卡

        var btnStr = '<li> <div class="modelBox"> <button  class="button1 blue"  style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </button> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_1</b> </li> <li> <div class="modelBox"> <button class="button1 green" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </button> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_2</b> </li> <li> <div class="modelBox"> <button class="button1 orange" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </button> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_3</b> </li> <li> <div class="modelBox"> <button class="button1 gray" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </button> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_4</b> <li> <div class="modelBox"> <div class="button2 purple" style="transform: scale(0.8,0.8);"> <div class="shine"></div> <p class="btnName">Button</p> </div> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_5</b> </li> <li> <div class="modelBox"> <div class="button2 orange" style="transform: scale(0.8,0.8);"> <div class="shine"></div> <p class="btnName">Button</p> </div> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_6</b> </li> <li> <div class="modelBox"> <a class="button3" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </a> </div><b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_7</b> </li> <li> <div class="modelBox"> <a class="button3 two" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </a> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_8</b> </li> <li> <div class="modelBox"> <a class="button3 three" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </a> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_9</b> </li> <li> <div class="modelBox"> <a class="button3 four" style="transform: scale(0.8,0.8);"> <p class="btnName">Button</p> </a> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:130px;">Button_A_10</b> </li> <li> <div class="modelBox2"> <section class="model-2 mdoel_button" style="width: 75px;height: 46px;transform: scale(1,1);"> <div class="checkbox"> <input type="checkbox"/> <label></label> </div> </section> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:49px;">Button_B_1</b> </li> <li> <div class="modelBox2"> <section class="model-8 mdoel_button" style="width: 95px;height: 46px;transform: scale(1,1);"> <div class="checkbox"> <input type="checkbox"/> <label></label> </div> </section> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:49px;">Button_B_2</b> </li><li> <div class="modelBox2"> <section class="model-7 mdoel_button " style="width: 90px;height: 46px;transform: scale(1,1);"> <div class="checkbox"> <input type="checkbox"/> <label></label> </div> </section> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:49px;">Button_B_3</b> </li> <li> <div class="modelBox2" style="top:5px;"> <section class="model-3 mdoel_button" style="width: 90px;height: 42px;transform: scale(1,1);"> <div class="checkbox"> <input type="checkbox"/> <label></label> </div> </section> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:52px;">Button_B_4</b> </li> <li> <div class="modelBox3"> <section class="model-4 mdoel_button" style="width: 75px;height: 29px;transform: scale(1,1);"> <div class="checkbox"> <input type="checkbox"/> <label></label> </div> </section> </div> <b style="font-size:12px;width:100%;text-align:center;margin-top:52px;">Button_B_5</b> </li> <li> <div class="modelBox4"><section class="model-9 mdoel_button" style="width: 90px;height: 36px;transform: scale(1,1);"><div class="checkbox"><input type="checkbox"/><label></label></div></section></div><b style="font-size:12px;width:100%;text-align:center;margin-top:51px;">Button_B_6</b></li><li><div class="modelBox3" style="top:-5px;"><section class="model-5 mdoel_button" style="width: 85px;height: 21px;transform: scale(1,1);"><div class="checkbox"><input type="checkbox"/><label></label></div></section></div><b style="font-size:12px;width:100%;text-align:center;margin-top:61px;">Button_B_7</b></li><li><div class="modelBox5" style="top: -10px;"><section class="model-6 mdoel_button" style="width: 60px;height: 21px;transform: scale(1,1);"><div class="checkbox"><input type="checkbox"/><label></label></div></section></div><b style="font-size:12px;width:100%;text-align:center;margin-top:69px;">Button_B_8</b></li><li><div class="modelBox8" style="transform:scale(.7,.7); left:-20px;top:5px;"><div class="model-16" style="transform: scale(1,1);"><input type="checkbox" name="toggle"><label for="toggle"><i></i></label><span></span></div></div><b style="font-size:12px;width:100%;text-align:center;margin-top:52px;">Button_B_9</b></li><li><div class="modelBox9" style="transform: scale(.6);left:-75px;top:17px;"><div class="model-19" style="transform: scale(1,1);"><input type="checkbox" id="control" class="control"><label for="control" class="checkbox"></label></div></div><b style="font-size:12px;width:100%;text-align:center;margin-top:29px;">Button_B_10</b></li> <li><div class="modelBox6"><section class="model-11 mdoel_button"  style="width: 90px;height: 32px;transform: scale(1,1);"><div class="checkbox"><p class="activeText">ON</p><input type="checkbox"/><label></label><p class="deactiveText">OFF</p></div></section></div><b style="font-size:12px;width:100%;text-align:center;margin-top:58px;">Button_C_1</b></li><li><div class="modelBox6"><section class="model-14 mdoel_button" style="width:90px;height: 36px;transform: scale(1,1);"><div class="checkbox"><p class="activeText">ON</p><input type="checkbox"/><label></label><p class="deactiveText">OFF</p></div></section></div><b style="font-size:12px;width:100%;text-align:center;margin-top:53px;">Button_C_2</b></li><li><div class="modelBox6"><section class="model-15 mdoel_button" style="width: 90px;height: 36px;transform: scale(1,1);"><div class="checkbox"><p class="activeText">ON</p><input type="checkbox"/><label><p class="deactiveText">OFF</p></label></div></section></div><b style="font-size:12px;width:100%;text-align:center;margin-top:54px;">Button_C_3</b></li><li><div class="modelBox10" style="transform: scale(.5);left:-26px;top:-17px;"><label class="model-20" style="transform: scale(1,1);"><input type="checkbox"><span></span><span><p class="deactiveText">OFF</p></span><span><p class="activeText">ON</p></span></label></div><b style="font-size:12px;width:100%;text-align:center;margin-top:32px;">Button_C_4</b></li><li><div class="modelBox11" style="transform: scale(.4);left:140px;top:-224px;"><label class="model-21 model buttonTemplate styleBox" style="transform: scale(1,1);"><input type="checkbox"><span class="span"><p class="activeText">ON</p></span><span class="span"><p class="deactiveText">OFF</p></span></label></div><b style="font-size:12px;width:100%;text-align:center;margin-top:22px;">Button_C_5</b></li>';

        $("#content ul").append(btnStr);
        $("#content ul li").hover( //li的移入移出效果
            function () {
                $(this).css("borderColor", "#606060");
            },
            function () {
                $(this).css("borderColor", "#bbbbbb");
            }
        );
    }
    //加载模块的函数   json 模块的描述数据结构
    function addBox(gObj, json) { //添加模块的函数
        var InY1 = 60; //输入信号text初始Y值
        var InY2 = 56; //输入信号Circle初始Y值
        var InY3 = 50; // 输入动态参数框初始Y值
        var OutY1 = 60; //输出信号text初始Y值
        var OutY2 = 56; //输出信号circle初始Y值
        var StaticY1 = 50; //静态参数框初始Y值
        for (var name in json.Input) { //循环模块描述结构输入信号
            json.Input[name].position = [{
                "x": 10,
                "y": InY1
            }, {
                "x": 0,
                "y": InY2
            }, {
                "x": 35,
                "y": InY3
            }]; //生成输入信号的各个坐标
            InY1 += 20;
            InY2 += 20;
            InY3 += 20;
        }
        for (var name in json.Output) { //循环模块描述结构输出信号
            json.Output[name].position = [{
                "x": 116,
                "y": OutY1
            }, {
                "x": 125,
                "y": OutY2
            }]; //生成输出信号坐标
            OutY1 += 20;
            OutY2 += 20;
        }
        for (var name in json.StaticParameter) { //循环模块描述结构静态参数
            json.StaticParameter[name].position = [{
                "x": 35,
                "y": StaticY1
            }]; //生成静态参数坐标
            StaticY1 += 20;
        }
        gObj.attr("transform", "translate(50,20)"); //设置模块transform值（模块偏移量）

        var str = '<g>' +
            '<rect x="0" y="0" rx="0" ry="0" width="125" height="30" style="fill:#f5f5f5;stroke:#606060;stroke-width:2;" class = "rect1 rectTop rect"/>' +
            '<text text-anchor="middle" x="63" y="21" fill="#5F5F5F" font-size = "14px" >' + json.Name + '</text>' +
            '</g>' +
            '<g>' +
            '<rect x="0" y="30" rx="0" ry="0" width="125" height="150" style="fill:#f5f5f5;stroke:#606060;stroke-width:2;"/>' +
            '<g class = "gIn">' +
            '</g>' +
            '<g class = "gStatic">' +
            '</g>' +
            '<g class = "gOut">' +
            '</g>' +
            '</g>';
        gObj.html(str);
        //console.log(json.Class.length)
        if (json.Name.length >= 18) {
            gObj.find("text").attr("textLength", "120");
        }
        var inHtml = []; //存放输入信号代码
        var staticHtml = []; //存放静态信号代码
        var outHtml = []; //存放输出信号代码
        var inIdNum = 1; //输入circle圆Id初始值
        var outIdNum = 1; //输出circle圆ID初始值
        var inDigitalNum = 0; //输入数字量个数
        var inAnalogNum = 0; //输入模拟量个数
        var inSerialNum = 0; //输入串行量个数
        var inDynamicNum = 0; //输入动态参数个数
        var staticNum = 0; //静态参数个数
        var outDigitalNum = 0; //输出数字量个数
        var outAnalogNum = 0; //输出模拟量个数
        var outSerialNum = 0; //输出串行量个数
        for (var name in json.Input) { //循环描述模块数据结构json(自己生成的包含每个信号位置)
            switch (json.Input[name].Type) { //判断信号类型
                case 'Digital': //如果是输入数字量
                    inDigitalNum++; //那么数字量个数加一
                    var fillColor = json.Input[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    //动态生成输入数字量代码
                    inHtml.push('<g>' +
                        '<text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Input[name].DefaultName + '</text>' +
                        '<circle cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="blue" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'Analog': //如果是输入模拟量
                    inAnalogNum++; //那么模拟量个数加一
                    var fillColor = json.Input[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    //动态生成输入模拟量代码
                    inHtml.push('<g>' +
                        '<text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Input[name].DefaultName + '</text>' +
                        '<circle cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="red" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'Serial': //如果是输入串行量
                    inSerialNum++; //那么串行量个数加一
                    var fillColor = json.Input[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    //动态生成输入串行量代码
                    inHtml.push('<g>' +
                        '<text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Input[name].DefaultName + '</text>' +
                        '<circle cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="black" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'DynamicParameter': //如果是输入动态量
                    inDynamicNum++; //那么动态量个数加一
                    var fillColor = json.Input[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    //动态生成输入动态量代码
                    inHtml.push('<g><g><foreignObject  class="abc" x="' + (json.Input[name].position[2].x) + '" y="' + (json.Input[name].position[2].y) + '" width="50" height="15"><div class="dynamicFrame" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject></g><text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Input[name].DefaultName + '</text><circle cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="green" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'None':
                    break;
            }
            if (json.Input[name].Type != 'None') {
                inIdNum++; // 输入circle圆ID自然数 如M1-in(1)
            }
        }
        for (var name in json.Output) {
            switch (json.Output[name].Type) {
                case 'Digital':
                    outDigitalNum++;
                    var fillColor = json.Output[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    outHtml.push('<g><text text-anchor="end" x="' + (json.Output[name].position[0].x) + '" y="' + (json.Output[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Output[name].DefaultName + '</text><circle cx="' + (json.Output[name].position[1].x) + '" cy="' + (json.Output[name].position[1].y) + '" r="5" stroke="blue" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'Analog':
                    outAnalogNum++;
                    var fillColor = json.Output[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    outHtml.push('<g><text text-anchor="end" x="' + (json.Output[name].position[0].x) + '" y="' + (json.Output[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Output[name].DefaultName + '</text><circle cx="' + (json.Output[name].position[1].x) + '" cy="' + (json.Output[name].position[1].y) + '" r="5" stroke="red" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'Serial':
                    outSerialNum++;
                    var fillColor = json.Output[name].Increasable ? "white" : "#ccc"; //根据信号是否允许增删定义圆实心空心颜色
                    outHtml.push('<g><text text-anchor="end" x="' + (json.Output[name].position[0].x) + '" y="' + (json.Output[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px">' + json.Output[name].DefaultName + '</text><circle cx="' + (json.Output[name].position[1].x) + '" cy="' + (json.Output[name].position[1].y) + '" r="5" stroke="black" stroke-width="1" fill="' + fillColor + '"/></g>');
                    break;
                case 'None':
                    break;
            }
            if (json.Output[name].Type != 'None') {
                outIdNum++; // 输入circle圆ID自然数 如M1-in(1)
            }
        }
        for (var name in json.StaticParameter) {
            if (json.StaticParameter[name].Type == 'StaticParameter') {
                staticNum++;
                staticHtml.push('<g><foreignObject x="' + (json.StaticParameter[name].position[0].x) + '" y="' + (json.StaticParameter[name].position[0].y) + '" width="50" height="15"><div class="staticFrame" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject></g>');
            }

        }
        gObj.find(".gIn").html(inHtml.join(''));
        gObj.find(".gOut").html(outHtml.join(''));
        gObj.find(".gStatic").html(staticHtml.join(''));
        var circleArr = []; //记录模块中没个circle的cy值
        //循环模块中的所有circle
        for (var i = 0; i < gObj.find("circle").length; i++) {
            circleArr.push(gObj.find("circle").eq(i).attr("cy")); //存储每个circle的cy值
            circleArr.sort(); //从小到大排序
            //循环circle的cy值数组
            for (var j = 0; j < circleArr.length; j++) {
                if (circleArr[j] > 156) { //判断是否有值大于模块height的值；每有一个值大于，模块的height就加20
                    var rectH = parseInt(gObj.find("rect").eq(1).attr("height"));
                    gObj.find("rect").eq(1).attr("height", parseInt(rectH + 20));
                }
            }
        }
        //循环模块中的所有div(静态参数)
        if (gObj.find("div").length > 6) {
            for (var i = 6; i < gObj.find("div").length; i++) {
                var rectH = parseInt(gObj.find("rect").eq(1).attr("height"));
                gObj.find("rect").eq(1).attr("height", parseInt(rectH + 20));
            }
        }
    }
    //列表的操作函数
    function HandleLi() {
        //内容列表鼠标移入的样式
        $("#content ul li").on("mouseenter", function () {
            $(this).css("borderColor", "#606060"); //改变内容列表边框
            $(this).css("color", "#0B5DDB");
            $(this).find(".checkCircle").css("display", "block"); //显示被选择的蓝色按钮
        });
        //内容列表鼠标移入的样式
        $("#content ul li").on("mouseleave", function () {
            //根据自定义属性判断划出时是否改变样式
            if ($(this).find(".checkCircle").attr("data-checked") == "false") {
                $(this).css("borderColor", "#bbbbbb");
                $(this).css("color", "#606060");
                $(this).find(".checkCircle").css("display", "none");
            }
        });
        //内容列表里的选择按钮
        $(".checkCircle").unbind("click");
        $(".checkCircle").on("click", function (event) {
            event.stopPropagation();
            //根据自定义属性判断选择或被选择状态
            if ($(this).attr("data-checked") == "false") {
                //被选择
                $(this).css("backgroundImage", "url(images/icon.png)");
                $(this).attr("data-checked", "true");
                $(this).parent().css("color", "#0B5DDB");
                if (btnFlag == "userModule" || btnFlag == "userMacro" || btnFlag == "btnGroup") { //判断是否选择的是红外模块
                    deleteName.push($(this).parent().find(".checkName").attr("data-realname")); //保存自建模块名称
                } else if (btnFlag == "infrared") {
                    deleteName.push($(this).parent().find(".checkName i").text()); //保存红外模块名称
                } else {
                    deleteName.push($(this).parent().find(".checkName").html()); //保存被选择的名称
                }
                deleteLi.push($(this).parent().index()); //保存选择的li
            } else {
                //取消选择
                $(this).css("backgroundImage", "");
                $(this).attr("data-checked", "false");
                $(this).parent().css("color", "#606060");
                if (btnFlag == "userModule" || btnFlag == "userMacro" || btnFlag == "btnGroup") { //判断是否选择的是红外模块
                    var markCancel = $(this).parent().find(".checkName").attr('data-realname'); //保存自建模块名称
                } else if (btnFlag == "infrared") {
                    var markCancel = $(this).parent().find(".checkName i").html(); //保存红外模块名称
                } else {
                    var markCancel = $(this).parent().find(".checkName").html(); //保存被选择的名称
                }
                //var markCancel = $(this).parent().find(".checkName").html();
                var markLiCancel = $(this).parent().index();
                //取消选择时，循环保存所有选择内容的数组，删除对应内容
                for (var i = 0; i < deleteName.length; i++) {
                    //console.log('deletename---' + deleteName[i]);
                    //console.log('markcancel---' + markCancel);
                    if (deleteName[i] == markCancel) {
                        deleteName.splice(i, 1); //移除取消选择元素
                    }
                    if (deleteLi[i] == markLiCancel) {
                        deleteLi.splice(i, 1);
                    }
                }
            }
            //console.log(deleteName);
            //console.log(deleteLi);
            AllCheck(); //监听全选的函数
        });
    }
    //去重函数，用于去除重复选择的pciture name
    function unique(array) {
        var n = []; //一个新的临时数组
        //遍历当前数组
        for (var i = 0; i < array.length; i++) { //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(array[i]) == -1) {
                n.push(array[i])
            };
        }
        return n;
    }
    //数组排序函数
    function sortNum(a, b) {
        return a - b
    }
    //全选按钮监听事件,如果都没有被选择就取消全选
    function AllCheck() {
        if (allCheckFlag) { //还未全选
            /*for(var i = 0; i < $("#content ul li").length; i++) {
             if ($(".checkCircle").eq(i).attr("data-checked") != "true") {
             console.log("a")
             $(".allChecked").css("backgroundImage", "url(images/icon.png)");
             allCheckFlag = false;
             }
             }*/
        } else { //已经全选
            for (var i = 0; i < $("#content ul li").length; i++) {
                if ($(".checkCircle").eq(i).attr("data-checked") == "false") {
                    $(".allChecked").css("backgroundImage", "");
                    allCheckFlag = true;
                }
            }
        }
    }
    //容量显示
    function Memory() {
        $.ajax({
            url: Ip + "/services/management/memory",
            type: "POST",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                $("#total").html(data.result.total + "M"); //显示总容量
                $("#used").html(data.result.used + "M /"); //显示使用容量
                $(".showSpace div").css("width", parseInt((data.result.used / data.result.total) * 224) + "px"); //设置使用容量的显示条
                //通过判断使用容量的多少，改变显示条的样式
                if (data.result.used > 0 && data.result.used < 100) {
                    $(".showSpace div").css("background", "#4E7FCB");
                    $("#warning").css("display", "none");
                    memoryFlag = true;
                } else if (data.result.used >= 100 && data.result.used < 150) {
                    $(".showSpace div").css("background", "#4ECA84");
                    $("#warning").css("display", "none");
                    memoryFlag = true;
                } else if (data.result.used >= 150 && data.result.used < 200) {
                    $(".showSpace div").css("background", "#ACCA4E");
                    $("#warning").css("display", "none");
                    memoryFlag = true;
                } else if (data.result.used >= 200 && data.result.used < 250) {
                    $(".showSpace div").css("background", "#CA944E");
                    $("#warning").css("display", "none");
                    memoryFlag = true;
                } else if (data.result.used >= 250 && data.result.used < 256) {
                    $(".showSpace div").css("background", "#CA4E4E");
                    $("#warning").css("display", "block");
                    memoryFlag = false;
                } else if (data.result.used >= 256) { //超出总容量后不能在导入其他文件，并生成提示框
                    $(".showSpace div").css("background", "#CA4E4E");
                    $("#warning").css("display", "block");
                    memoryFlag = false;
                }
            }
        });
    }
    //input表单的文件选择监听（导入图片，导入自建模块）

    $("#upload").unbind().change(function (e) {
        file = document.getElementById("upload");
        var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase(); //截取被选择文件的格式后缀
        //var ext1 = file.value.substring(file.value.lastIndexOf("\\") + 1, file.value.lastIndexOf(".")); //截取的被选择的文件名称
        var form = new FormData(document.getElementById("uploadForm"));
        $.ajax({
            type: "POST", //请求类型
            url: Ip + "/services/management/memory", //请求地址
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //打开文件大小 <= （total - used -10M）/ 2
                var fileSize = $("#upload")[0].files[0].size / 1024 / 1024;

                if (fileSize < 80 && fileSize <= (parseInt(data.result.total) - parseInt(data.result.used) - 10) / 2) {
                    //判断是否导入类型
                    if (btnFlag == "picture") { //导入图片
                        // 判断图片格式类型
                        
                        if (ext != 'png' && ext != 'jpg' && ext != 'gif') {
                            TabCheckImport(btnFlag);
                        //     $("#shade").css("display", "block").append('<div id="popup">' +
                        //         '<div id="popupTop">' +
                        //         '<span>提示</span>' +
                        //         '</div>' +
                        //         '<div id="popupBottom">' +
                        //         '<p>图片的格式必须为png，jpg，gif格式!</p>' +
                        //         '<div class="popupBtn sureButton">确定</div>' +
                        //         '</div>' +
                        //         '</div>');
                        //     //确定按钮取消弹框；
                        //     $(".sureButton").on("click", function () {
                        //         $("#shade").css("display", "none").html("");
                        //     });
                        } else {
                            uploadPictures(form); //调用上传图片函数
                        }
                    } else if (btnFlag == "userModule") { //导入自建模块
                        //判断压缩包名称
                        if (ext != 'zip') {
                            TabCheckImport(btnFlag);
                            // $("#shade").css("display", "block").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>提示</span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>压缩包格式必须为zip!</p>' +
                            //     '<div class="popupBtn sureButton">确定</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // $(".sureButton").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                        } else {
                            uploadUserModule(form);
                        }
                    } else if (btnFlag == "userMacro") { //导入自建宏模块
                        if (ext != 'zip') {
                            TabCheckImport(btnFlag);
                            // $("#shade").css("display", "block").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>提示</span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>压缩包格式必须为zip!</p>' +
                            //     '<div class="popupBtn sureButton">确定</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // $(".sureButton").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                        } else {
                            uploadUserMacro(form);
                        }
                    } else if (btnFlag == "btnGroup") { //导入组件组模板
                        
                        if (ext != 'zip') {
                            TabCheckImport(btnFlag);
                            // $("#shade").css("display", "block").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>提示</span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>压缩包格式必须为zip!</p>' +
                            //     '<div class="popupBtn sureButton">确定</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // $(".sureButton").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                        } else {
                            uploadBtnGroup(form);
                        }
                    } else if (btnFlag == "infrared") { //导入标准红外模块
                        if (ext != 'sir' && ext != 'SIR') {
                            TabCheckImport(btnFlag);
                            // $("#shade").css("display", "block").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>提示</span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>格式必须为sir或者SIR格式!</p>' +
                            //     '<div class="popupBtn sureButton">确定</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // //确定按钮取消弹框；
                            // $(".sureButton").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                        } else {
                            uploadInfrared(form);
                        }
                    } else if (btnFlag == 'picBtn') {
                        if (ext != 'zip') {
                            TabCheckImport(btnFlag);
                            // $("#shade").css("display", "block").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>提示</span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>压缩包格式必须为zip!</p>' +
                            //     '<div class="popupBtn sureButton">确定</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // //确定按钮取消弹框；
                            // $(".sureButton").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                        } else {
                            uploadPicBtns(form);
                        }
                    }

                } else {
                    TabImportFull();
                }
                $("#upload").val(""); //上传成功后，清空选择的数据
            }
        });

    });
    //删除按钮
    $(document).on("click", ".delete", function () {
        deleteName = unique(deleteName); //去除数组中重复的参数
        if (btnFlag != "infrared") {
            deletePackages.name = deleteName; //组织发送后台的数据
        } else {
            deletePackages.file = deleteName; //组织发送后台的数据
        }
        deleteLi.sort(sortNum); //从小到大排序li的下标
        if (deleteName.length == 0) { //判断是否已选择了资源，没有选择资源不能导出
            TabChooseResouce();  //先选择资源在删除提示
        } else {
            if (btnFlag == "picture") { //删除图片资源
                $.ajax({
                    url: Ip + "/services/management/picture",
                    type: "POST",
                    data: {
                        packages: JSON.stringify(deletePackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            //循环记录被选择li的数组
                            for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                                $("#content ul").find("li").eq(deleteLi[i]).remove(); //移除掉被选则的li
                            }
                        }
                        deleteName.length = 0; //清空保存删除信息的数组
                        deleteLi.length = 0; //清空保存删除li的下标
                    }
                });
            } else if (btnFlag == "picBtn") { //删除贴图按钮模板
                $.ajax({
                    url: Ip + "/services/management/button/module",
                    type: "POST",
                    data: {
                        packages: JSON.stringify(deletePackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            //循环记录被选择li的数组
                            for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                                $("#content ul").find("li").eq(deleteLi[i]).remove();
                            }
                        }
                        deleteName.length = 0; //清空保存删除信息的数组
                        deleteLi.length = 0; //清空保存删除li的下标
                    }
                });
            } else if (btnFlag == "userModule") { //删除用户自建模块
                $.ajax({
                    type: "post",
                    url: Ip + "/services/management/usermodule",
                    data: {
                        packages: JSON.stringify(deletePackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (!$.isEmptyObject(data.result.quoteList)) {
                            quote = data.result.quoteList;
                            for (var key in data.result.quoteList) {
                                //$('#accordion').append('<h3>' + key.split('_')[0] + '<b>宏模块详情</b></h3><div id = "' + key + '"></div>');
                                switch (localStorage.getItem('Switch')) {
                                    case 'Switch_cn':
                                        $('#accordion').append('<h3>' + key.split('_')[0] + '<b class="title49">宏模块详情</b></h3><div id = "' + key + '"></div>');
                                        break;
                                    case 'Switch_en':
                                        $('#accordion').append('<h3>' + key.split('_')[0] + '<b class="title49">Details</b></h3><div id = "' + key + '"></div>');
                                        break;
                                    default:
                                        $('#accordion').append('<h3>' + key.split('_')[0] + '<b class="title49">宏模块详情</b></h3><div id = "' + key + '"></div>');
                                        break;
                                }
                                for (var i = 0; i < data.result.quoteList[key].length; i++) {
                                    $('#accordion').find('#' + key).append('<p>' + data.result.quoteList[key][i].split('_')[0] + '</p>');
                                }
                            }
                            $('#previewShade').css('display', 'block'); //隐藏遮罩
                            $('#userModuleDelBox').css('display', 'block'); //隐藏弹窗
                            //自建模块窗口初始化
                            $("#accordion").accordion({
                                collapsible: true,
                                active: false,
                                icons: null,
                                heightStyle: "content"
                            });

                        } else {
                            //循环记录被选择li的数组
                            for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                                $("#content ul").find("li").eq(deleteLi[i]).remove();
                            }
                            deleteName.length = 0; //清空保存删除信息的数组
                            deleteLi.length = 0; //清空保存删除li的下标
                        }

                    }
                });
            } else if (btnFlag == "btnGroup") { //删除组件组
                $.ajax({
                    type: "post",
                    url: Ip + "/services/management/component/",
                    data: {
                        packages: JSON.stringify(deletePackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            //循环记录被选择li的数组
                            for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                                $("#content ul").find("li").eq(deleteLi[i]).remove();
                            }
                        }
                        deleteName.length = 0; //清空保存删除信息的数组
                        deleteLi.length = 0; //清空保存删除li的下标
                    }
                });
            } else if (btnFlag == "userMacro") { //删除自建宏模块
                $.ajax({
                    type: "post",
                    url: Ip + "/services/management/macro",
                    data: {
                        packages: JSON.stringify(deletePackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            //循环记录被选择li的数组
                            for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                                $("#content ul").find("li").eq(deleteLi[i]).remove();
                            }
                        }
                        deleteName.length = 0; //清空保存删除信息的数组
                        deleteLi.length = 0; //清空保存删除li的下标
                    }
                });
            } else if (btnFlag == "infrared") { //删除标准红外模块
                $.ajax({
                    type: "post",
                    url: Ip + "/services/management/infrared",
                    data: {
                        packages: JSON.stringify(deletePackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            //Infrared();
                            //循环记录被选择li的数组
                            for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                                $("#content ul").find("li").eq(deleteLi[i]).remove();
                            }
                            /* $(".tab").eq(0).css({
                                "background": "#F7F7F7",
                                "borderBottom": "0"
                            }).siblings(".tab").css({
                                "background": "#ffffff",
                                "borderBottom": "1px solid #173A7E"
                            }); */
                        }
                        deleteName.length = 0; //清空保存删除信息的数组
                        deleteLi.length = 0; //清空保存删除li的下标
                    }
                });
            }
        }

        if (allCheckFlag == false) { //判断是否全选，如果不是，取消全选按钮样式
            allCheckFlag = true;
            $(".allChecked").css("backgroundImage", "");
        }
        Memory(); //调用内存容量显示函数
    });
    //右上角导入按钮
    $(".inport").on("click", function () {
        deleteName.length = 0;
        deleteLi.length = 0;
        if (memoryFlag) { //判断使用是否已满
            //根据导航的不同，判断导入的功能
            if (btnFlag == "picture" || btnFlag == "userModule" || btnFlag == "userMacro" || btnFlag == "btnGroup" || btnFlag == "infrared") { //上传图片或是自建模块或组件组
                $("#upload").click(); //触发input的点击事件
            } else if (btnFlag == "picBtn") { //上传贴图按钮模板
                $("#shade").css("display", "block");
                $("#inportPic").css("display", "block");
            }
        } else { //使用容量已满，不能在上传提示清立空间；
            $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span>存储提示</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p>存储空间已满!<br/>请清理不必要的资源!</p>' +
                '<div class="popupBtn sureButton">确定</div>' +
                '</div>' +
                '</div>');
            $(".sureButton").on("click", function () {
                $("#shade").css("display", "none").html("");
            });
        }
    });
    //导出按钮事件
    $(document).on("click", ".export", function () {
        if (deleteName.length == 0) { //判断是否已选择了资源，没有选择资源不能导出
            TabChooseResouce();
            // $("#shade").css("display", "block").append('<div id="popup">' +
            //     '<div id="popupTop">' +
            //     '<span>提示</span>' +
            //     '</div>' +
            //     '<div id="popupBottom">' +
            //     '<p>请先选择资源,再导出!</p>' +
            //     '<div class="popupBtn sureButton">确定</div>' +
            //     '</div>' +
            //     '</div>');
            // $(".sureButton").on("click", function () {
            //     $("#shade").css("display", "none").html("");
            // });
        } else {
            // $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在打包...</p></div>'); //生成遮罩弹框
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在打包...</p></div>'); //生成遮罩弹框
                    break;
                case 'Switch_en':
                    $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>Packing...</p></div>'); //生成遮罩弹框
                    break;
                default:
                    $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在打包...</p></div>'); //生成遮罩弹框
                    break;
            }
            exportPackages.name = deleteName; //发送给后台的数据
            if (btnFlag == "userModule") { //自建模块导出
                $.ajax({
                    type: "Post",
                    url: Ip + "/services/management/usermodule",
                    data: {
                        packages: JSON.stringify(exportPackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            // $("#waitBox").remove();
                            // $("#shade").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>导出</span>' +
                            //     '<span id = "closePopup"></span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>打包成功!是否导出?</p>' +
                            //     '<div class="popupBtn sureBtn">' +
                            //     '<a href="' + Ip + '/services/management/export/usermodule">确定</a>' +
                            //     '</div>' +
                            //     '<div class="popupBtn cancelBtn">取消</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // //确定按钮
                            // $(".sureBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //取消按钮
                            // $(".cancelBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            //关闭按钮
                            // $("#closePopup").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            TabExport(btnFlag); //导出提示框 中英文切换
                            //取消选择状态
                            deleteName.length = 0;
                            deleteLi.length = 0;
                            $(".checkCircle").css({
                                "backgroundImage": "",
                                "display": "none"
                            });
                            $(".checkCircle").attr("data-checked", "false");
                            $(".checkCircle").parent().css("color", "#606060");
                            if (allCheckFlag == false) { //判断全选按钮状态
                                allCheckFlag = true;
                                $(".allChecked").css("backgroundImage", "");
                            }
                        }
                    }
                });
            } else if (btnFlag == "btnGroup") { //组件组导出
                $.ajax({
                    type: "POST",
                    url: Ip + "/services/management/component/",
                    data: {
                        packages: JSON.stringify(exportPackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            // $("#waitBox").remove(); //移除打包的等待弹窗
                            // $("#shade").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>导出</span>' +
                            //     '<span id = "closePopup"></span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>打包成功!是否导出?</p>' +
                            //     '<div class="popupBtn sureBtn">' +
                            //     '<a href="' + Ip + '/services/management/export/component">确定</a>' +
                            //     '</div>' +
                            //     '<div class="popupBtn cancelBtn">取消</div>' +
                            //     '</div>' +
                            //     '</div>'); //动态生成导出选择弹窗
                            // //确定按钮
                            // $(".sureBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //取消按钮
                            // $(".cancelBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //关闭按钮
                            // $("#closePopup").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            TabExport(btnFlag); //导出提示框 中英文切换
                            //取消选择状态
                            deleteName.length = 0;
                            deleteLi.length = 0;
                            $(".checkCircle").css({
                                "backgroundImage": "",
                                "display": "none"
                            });
                            $(".checkCircle").attr("data-checked", "false");
                            $(".checkCircle").parent().css("color", "#606060");
                            if (allCheckFlag == false) { //判断全选按钮状态
                                allCheckFlag = true;
                                $(".allChecked").css("backgroundImage", "");
                            }
                        }
                    }
                });
            } else if (btnFlag == "userMacro") { //自建宏模块导出
                $.ajax({
                    type: "Post",
                    url: Ip + "/services/management/macro",
                    data: {
                        packages: JSON.stringify(exportPackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            // $("#waitBox").remove(); //移除打包的等待弹窗
                            // $("#shade").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>导出</span>' +
                            //     '<span id = "closePopup"></span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>打包成功!是否导出?</p>' +
                            //     '<div class="popupBtn sureBtn">' +
                            //     '<a href="' + Ip + '/services/management/export/macro">确定</a>' +
                            //     '</div>' +
                            //     '<div class="popupBtn cancelBtn">取消</div>' +
                            //     '</div>' +
                            //     '</div>'); //动态生成导出选择弹窗
                            // //确定按钮
                            // $(".sureBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //取消按钮
                            // $(".cancelBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //关闭按钮
                            // $("#closePopup").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            TabExport(btnFlag); //导出提示框 中英文切换
                            //取消选择状态
                            deleteName.length = 0;
                            deleteLi.length = 0;
                            $(".checkCircle").css({
                                "backgroundImage": "",
                                "display": "none"
                            });
                            $(".checkCircle").attr("data-checked", "false");
                            $(".checkCircle").parent().css("color", "#606060");
                            if (allCheckFlag == false) { //判断全选按钮状态
                                allCheckFlag = true;
                                $(".allChecked").css("backgroundImage", "");
                            }
                        }
                    }
                });
            } else if (btnFlag == 'picBtn') { //贴图按钮模板导出
                $.ajax({
                    type: "Post",
                    url: Ip + "/services/management/button/module",
                    data: {
                        packages: JSON.stringify(exportPackages)
                    },
                    success: function (data) {
                        //console.log(data);
                        if (data.result) {
                            // $("#waitBox").remove();
                            // $("#shade").append('<div id="popup">' +
                            //     '<div id="popupTop">' +
                            //     '<span>导出</span>' +
                            //     '<span id = "closePopup"></span>' +
                            //     '</div>' +
                            //     '<div id="popupBottom">' +
                            //     '<p>打包成功!是否导出?</p>' +
                            //     '<div class="popupBtn sureBtn">' +
                            //     '<a href="' + Ip + '/services/management/export/buttonModule">确定</a>' +
                            //     '</div>' +
                            //     '<div class="popupBtn cancelBtn">取消</div>' +
                            //     '</div>' +
                            //     '</div>');
                            // //确定按钮
                            // $(".sureBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //取消按钮
                            // $(".cancelBtn").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            // //关闭按钮
                            // $("#closePopup").on("click", function () {
                            //     $("#shade").css("display", "none").html("");
                            // });
                            TabExport(btnFlag); //导出提示框 中英文切换
                            //取消选择状态
                            deleteName.length = 0;
                            deleteLi.length = 0;
                            $(".checkCircle").css({
                                "backgroundImage": "",
                                "display": "none"
                            });
                            $(".checkCircle").attr("data-checked", "false");
                            $(".checkCircle").parent().css("color", "#606060");
                            if (allCheckFlag == false) { //判断全选按钮状态
                                allCheckFlag = true;
                                $(".allChecked").css("backgroundImage", "");
                            }
                        }
                    }
                });
            }
        }
    });
    //全选按钮

    $(".allChecked").on("click", function () {
        if (allCheckFlag) { //全部选择
            $(this).css("backgroundImage", "url(images/icon.png)");
            //循环改变内容列表样式
            for (var i = 0; i < $("#content ul li").length; i++) {
                //设置被选择状态
                $(".checkCircle").eq(i).attr("data-checked", "true").css({
                    "display": "block",
                    "backgroundImage": "url(images/icon.png)"
                });
                //改变边框颜色
                $("#content ul").find("li").eq(i).css({
                    "borderColor": "#606060",
                    "color": "#0B5DDB"
                });
                if (btnFlag == "userModule" || btnFlag == "userMacro" || btnFlag == "btnGroup") { //判断是否选择的是红外模块
                    deleteName.push($("#content ul").find("li").eq(i).find(".checkName").attr("data-realname")); //保存自建模块名称
                } else if (btnFlag == "infrared") {
                    deleteName.push($("#content ul").find("li").eq(i).find(".checkName i").text()); //保存红外模块名称
                } else {
                    deleteName.push($("#content ul").find("li").eq(i).find(".checkName").html()); //保存被选择的名称
                }
                deleteLi.push($("#content ul").find("li").eq(i).index());
            }
            allCheckFlag = false;
        } else {
            //取消全选恢复内容列表样式
            $(this).css("backgroundImage", "");
            for (var i = 0; i < $("#content ul li").length; i++) {
                $(".checkCircle").eq(i).attr("data-checked", "false").css({
                    "display": "none",
                    "backgroundImage": ""
                });
                $("#content ul").find("li").eq(i).css({
                    "borderColor": "#bbbbbb",
                    "color": "#606060"
                });
                deleteName.length = 0;
                deleteLi.length = 0;
            }
            allCheckFlag = true;
        }
    });
    //系统显示按钮操作
    $("#systemClassify").on("click", function () {
        $("#tool").css("display", "none"); //隐藏删除分享等工具栏
        $(".inport").css("display", "none"); //默认系统模板隐藏导入按钮，用户模板显示导入按钮
        $(".allCheckBox").css("display", "none"); //隐藏全选按钮
        //判断调用函数
        if (btnFlag == "btnGroup") {
            //组件组
            SystemBtnGroup(); //显示系统组件组模板函数
        } else if (btnFlag == "picBtn") {
            $('.batch_inport').css('display', 'none');
            //贴图按钮模板
            SystemPicBtn(); //显示系统贴图按钮模板函数
        }
        ToolHover();
    });
    //用户显示按钮操作
    $("#userClassify").on("click", function () {
        $("#tool").css("display", "block"); //显示删除分享等工具栏
        $(".inport").css("display", "block"); //默认系统模板隐藏导入按钮，用户模板显示导入按钮
        $(".allCheckBox").css("display", "block"); //隐藏全选按钮
        //判断调用函数
        if (btnFlag == "btnGroup") {
            //组件组
            UserBtnGroup(); //显示用户组件组模板函数
        } else if (btnFlag == "picBtn") {
            $('.batch_inport').css('display', 'block');
            //贴图按钮模板
            UserPicBtn(); //显示用户贴图按钮模板函数
        }
        ToolHover();
    });
    //贴图模板名称的onblur事件；判断输入是否正确

    //用户创建贴图按钮模板输入名称的失焦事件
    $("#picBtnName").on("blur", function () {
        var reg = /^[0-9a-zA-Z_]+$/; //允许数字，字母和下划线
        var str = $("#picBtnName").val();
        //通过正则判断输入是否合法
        if (!reg.test(str)) {
            $("#picBtnName").css("color", "#FF0000");
            picBtnNameFlag = false;
        } else {
            $("#picBtnName").css("color", "#606060");
            picBtnNameFlag = true;
        }
    });
    //输入名称的聚焦事件
    $("#picBtnName").on("focus", function () {
        $("#picBtnName").css("color", "#606060");
    });
    //用户创建贴图按钮模板的导入弹窗的关闭按钮
    $(".closeInportPic").on("click", function () {
        $("#shade").css("display", "none"); //隐藏遮罩层
        $("#inportPic").css("display", "none"); //隐藏导入弹窗
        //清空弹框里输入的参数
        $("#picBtnName").val("");
        $(".active").find("input").attr("value", "");
        $(".inactive").find("input").attr("value", "");
        $(".showBox").find("div").css("backgroundImage", "");
        $("#picBtnName").css("color", "#606060");
        //markWH = '';  //清空保存被选择资源的尺寸数据
    });
    //用户创建贴图按钮模板导入弹窗的导入按钮
    $(".ensureInport").on("click", function () {
        if ($("#picBtnName").val() == "" || picBtnNameFlag == false) { //判断用户输入的名称是否合法
            // $("#picBtnName").attr("placeholder", "输入名称不能为空且只能输入数字和字母").css("color", "red").val("");
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $("#picBtnName").attr("placeholder", "输入名称不能为空且只能输入数字和字母").css("color", "red").val("");
                    break;
                case 'Switch_en':
                    $("#picBtnName").attr("placeholder", "The input name cannot be empty and only Numbers and letters can be entered").css("color", "red").val("");
                    break;
                default:
                    $("#picBtnName").attr("placeholder", "输入名称不能为空且只能输入数字和字母").css("color", "red").val("");
                    break;
            }
        } else if ($("#picBtnName").val() != "" && picBtnNameFlag == true && $(".active").find("input").val() != '' && $(".inactive").find("input").val() != '') {
            CreatePicBtn(); //调用创建贴图按钮的函数
        }
    });
    //用户创建贴图按钮模板导入弹窗的重置按钮
    $(".reset").on("click", function () {
        //清空弹框里输入的参数
        $("#picBtnName").val("");
        $(".active").find("input").attr("value", "");
        $(".inactive").find("input").attr("value", "");
        $(".showBox").find("div").css("backgroundImage", "");
        $("#picBtnName").css("color", "#606060");
        //markWH = '';  //清空保存被选择资源的尺寸数据
    });
    //创建贴图按钮时显示要选择图片资源弹窗
    $(".load").on("click", function () {
        if ($(this).parent().attr("class") == "active") { //判断是激活的选择还是非激活的选择
            loadFlag = true; //激活选择
        } else if ($(this).parent().attr("class") == "inactive") {
            loadFlag = false; //非激活选择
        }
        $("#chooseBox").css("display", "block"); //显示载入的弹框
        $.ajax({ //显示图片资源ajax
            type: "POST",
            url: Ip + "/services/management/picture",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                for (var i = 0; i < data.result.img.length; i++) {
                    $("#chooseBox ul").append('<li data-choose="false" data-picName="' + data.result.img[i] + '" style="background-color:#ececec;"><img src="' + Ip + data.result.path + data.result.img[i] + '" alt="' + data.result.img[i] + '"><p></p></li>');
                };
                //循环显示图片的width和height
                $("#chooseBox ul li").find("img").each(function (index, el) {
                    var img = new Image();
                    img.src = $(el).attr("src");
                    img.onload = function () {
                        var w = img.width;
                        var h = img.height;
                        $("#chooseBox ul li").eq(index).find('p').html(w + '*' + h);
                        //判断若有与上一次选择的图片尺寸不符的添加遮罩；
                        //if (markWH != '' && markWH != $("#chooseBox ul li").eq(index).find('p').html()) {
                        //$(el).parent().append('<div class="noCheck"></div>');
                        //}
                    }
                });
                //li选择事件
                $("#chooseBox_center ul li img").on("click", function () {
                    $(this).parent().addClass("choose_li").siblings().removeClass("choose_li"); //选择样式
                    markLoad = $(this).parent().find('img').attr("src"); //获取选择的图片路径
                    //markWH = $(this).parent().find('p').html(); //记录选择的图片的宽高
                    markPicName = $(this).parent().attr("data-picName"); //获取选择的图片name
                });
                //li双击选择
                $("#chooseBox_center ul li img").on('dblclick', function () {
                    $(this).parent().addClass("choose_li").siblings().removeClass("choose_li"); //选择样式
                    markLoad = $(this).parent().find('img').attr("src"); //获取选择的图片路径
                    //markWH = $(this).parent().find('p').html(); //记录选择的图片的宽高
                    markPicName = $(this).parent().attr("data-picName"); //获取选择的图片name
                    CreatePicBtn_ChoosePic();
                });
            }
        });
    });
    //用户创建贴图按钮模板中选择资源弹窗的关闭按钮
    $("#closeLoad").on("click", function () {
        $("#chooseBox").css("display", "none"); //隐藏选择弹窗
        $("#chooseBox_center ul li").remove(); //移除选择弹窗里加载的资源
    });
    //用户创建贴图按钮模板中选择资源弹窗的确定按钮
    $("#chooseBtn").on("click", CreatePicBtn_ChoosePic);

    function CreatePicBtn_ChoosePic() {
        $("#chooseBox").css("display", "none"); //隐藏选择弹窗
        if (loadFlag) { //激活按钮的选择
            $(".active").find("input").attr("value", markPicName); //显示被选择的图片路径
            $(".activeBtn").css("backgroundImage", "url(" + markLoad + ")").attr("data-picName", markPicName); //预览框显示效果
        } else { //非激活的选择
            $(".inactive").find("input").attr("value", markPicName); //显示被选择的图片路径
            $(".inactiveBtn").css("backgroundImage", "url(" + markLoad + ")").attr("data-picName", markPicName); //预览框显示效果
        }
        $("#chooseBox_center ul li").remove(); //移除载入弹窗加载的内容
        markPicName = '';
        markLoad = '';
    }
    //确认删除自建模块及其关联宏模块
    $('.del_yes').on('click', function () {
        $.ajax({
            url: Ip + "/services/management/usermodule",
            type: 'post',
            data: {
                packages: JSON.stringify({
                    'method': 'deleteQuote',
                    'quoteList': quote
                })
            },
            success: function (data) {
                if (data.result) {
                    //循环记录被选择li的数组
                    for (var i = parseInt(deleteLi.length - 1); i >= 0; i--) {
                        $("#content ul").find("li").eq(deleteLi[i]).remove();
                    }
                    $('#accordion').accordion("destroy");
                    $('#previewShade').css('display', 'none'); //隐藏遮罩
                    $('#userModuleDelBox').css('display', 'none'); //隐藏弹窗
                    $('#userModuleDelBox #accordion').html(''); //清空弹窗内容
                    deleteName.length = 0; //清空保存删除信息的数组
                    deleteLi.length = 0; //清空保存删除li的下标
                }
            }
        });

    });
    //取消删除
    $('.del_no').on('click', function () {
        $('#accordion').accordion("destroy");
        $('#previewShade').css('display', 'none'); //隐藏遮罩
        $('#userModuleDelBox').css('display', 'none'); //隐藏弹窗
        $('#userModuleDelBox #accordion').html(''); //清空弹窗内容
        deleteName.length = 0; //清空保存删除信息的数组
        deleteLi.length = 0; //清空保存删除li的下标
        UserModule();
    });
    //关闭自建模块删除弹框
    $('.closeDelBox').on('click', function () {
        $('#accordion').accordion("destroy");
        $('#previewShade').css('display', 'none'); //隐藏遮罩
        $('#userModuleDelBox').css('display', 'none'); //隐藏弹窗
        $('#userModuleDelBox #accordion').html(''); //清空弹窗内容
        deleteName.length = 0; //清空保存删除信息的数组
        deleteLi.length = 0; //清空保存删除li的下标
        UserModule();
    });
    //批量导入用户贴图按钮模板
    $(document).on('click', '.batch_inport', function () {
        $("#upload").click(); //触发input的点击事件
    });

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
            'title1': ['资源管理', 'Repository'],
            'title2': ['一般图片资源', 'General Picture'],
            'title3': ['贴图按钮模板', 'Map Button'],
            'title4': ['特效按钮模板', 'Special Button'],
            'title5': ['其他控件模板', 'Other Button'],
            'title6': ['系统出厂模块', 'System Module'],
            'title7': ['用户自建模块', 'User Module'],
            'title8': ['标准红外模块', 'Infrared Module'],
            'title9': ['组件组模板', 'Component Group'],
            'title10': ['标准模组', 'System Macro'],
            'title11': ['用户模组', 'User Macro'],
            'title12': ['存储空间：', 'Memory Space：'],
            'title13': ['余量不足！', 'Memory Is Full!'],
            'title14': ['删除', 'Delete'],
            'title15': ['导入', 'Import'],
            'title16': ['全选', 'Check All'],
            'title17': ['显示分类:', 'Classify:'],
            'title18': ['系统模板', 'System'],
            'title19': ['用户模板', 'User'],
            'title20': ['导入贴图按钮模板', 'Import the map button template'],
            'title21': ['模板名称<i></i>', 'Name<i></i>'],
            'title22': ['激活', 'Activate'],
            'title23': ['选择', 'Select'],
            'title24': ['非激活', 'Inactive'],
            'title25': ['模板样式预览', 'Template preview'],
            'title26': ['按钮激活', 'Activate Button'],
            'title27': ['按钮非激活', 'Inactive Button'],
            'title28': ['重置', 'Reset'],
            'title29': ['选择按钮样式图片', 'Select the image of the button'],
            'title30': ['确定', 'Ensure'],
            'title31': ['模块删除', 'Delete Module'],
            'title32': ['删除以下自建模块与其关联的自建宏模块也将删除！', 'Delete the following user module and its associated user macro module will also be deleted!'],
            'title33': ['取消', 'Cancel'],
            'title34': ['批量导入','Import'],
            'title35': ['创建模板','Create'],
            'title36': ['导出','Export'],
            'title37': ['分享','Share'],
            'title38': ['文件名称:','Name:'],
            'title39': ['生产厂商:','Manufacturer:'],
            'title40': ['设备型号:','Device Model:'],
            'title41': ['遥控器型号:','Controller Model:'],
            'title42': ['设备类型:','Device Type:'],
            'title43': ['提示','Prompt'],
            'title44': ['图片的格式必须为png，jpg，gif格式！','Images must be PNG, JPG, GIF format!'],
            'title45': ['压缩包格式必须为zip！','The compression package format must be zip!'],
            'title46': ['格式必须为sir或者SIR格式！','The format must be sir or SIR!'],
            'title47': ['导入的文件过大！','Import the file too big!'],
            'title48': ['请先选择资源,再删除！','Please select the resource first and then delete it!'],
            'title49': ['宏模块详情','Details'],
        };
        for (var key in cn_en_data) {
            $('.' + key).html(cn_en_data[key][index]);
        }
        //改变中英文按钮样式
        $(select).css({
            'background': '#fff',
            'color': '#223558'
        });
        $(unselect).css({
            'background': '#223558',
            'color': '#fff'
        });
    }
    //导入的中英文切换
    function TabImport(){
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $('.inport').text('导入');
                break;
            case 'Switch_en':
                $('.inport').text('Import');
                break;
            default:
                $('.inport').text('导入');
                break;
        }
    }
    //正在导入遮罩层的中英文切换
    function TabImporting(){
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
                break;
            case 'Switch_en':
                $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>Being Imported...</p></div>'); //生成遮罩弹框
                break;
            default:
                $("#shade").css("display", "block").append('<div id="waitBox"><div></div><p>正在导入...</p></div>'); //生成遮罩弹框
                break;
        }
    }
    //导入失败提示的中英文切换
    function TabImporFail(){
        $("#waitBox").remove(); //移除正在导入的等待弹窗
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#shade").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span>导入</span>' +
                '<span id = "closePopup"></span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p>导入失败</p>' +
                '</div>' +
                '</div>');
                break;
            case 'Switch_en':
                $("#shade").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span>Import</span>' +
                '<span id = "closePopup"></span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p>Import failure</p>' +
                '</div>' +
                '</div>');
                break;
            default:
                $("#shade").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span>导入</span>' +
                '<span id = "closePopup"></span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p>导入失败</p>' +
                '</div>' +
                '</div>');
                break;
        }
        $("#closePopup").on("click", function () {
            $("#shade").css("display", "none").html(""); //移除遮罩层
        });
    }
    //导出分享的中英文切换
    function TabExport_Share(){
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#tool").append('<div class="export">' + '<span></span><i class="title36">导出</i>' + '</div>').prepend('<div class="share">' + '<span></span><i class="title37">分享</i>' + '</div>').css({"width": "224px","display": "block"}); //插入导出按钮;先移除再插入防止重复
                break;
            case 'Switch_en':
                $("#tool").append('<div class="export">' + '<span></span><i class="title36">Export</i>' + '</div>').prepend('<div class="share">' + '<span></span><i class="title37">Share</i>' + '</div>').css({"width": "224px","display": "block"}); //插入导出按钮;先移除再插入防止重复
                break;
            default:
                $("#tool").append('<div class="export">' + '<span></span><i class="title36">导出</i>' + '</div>').prepend('<div class="share">' + '<span></span><i class="title37">分享</i>' + '</div>').css({"width": "224px","display": "block"}); //插入导出按钮;先移除再插入防止重复
                break;
        }
    }
    //红外模块 中英文切换
    function TabInfrared(list){
        
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                for (var i = 0; i < list.length; i++) {
                    $("#content ul").append(' <li style = "width: 212px; height: 140px;font-size: 12px;margin-left: 30px;color:#606060;" class="ui-widget-content">' + '<div class="checkCircle" data-checked="false" style="display: none;"></div>' + '<h1 class="checkName" style="width: 190px;margin-top: 15px;margin-left: 10px;"><b class="title38">文件名称:</b><i style="float:right;">' + list[i].fileName + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title39">生产厂商:</b><i style="float:right;">' + list[i].manufacturer + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title40">设备型号:</b><i style="float:right;">' + list[i].deviceModel + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title41">遥控器型号:</b><i style="float:right;">' + list[i].remoteModel + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title42">设备类型:</b><i style="float:right;">' + list[i].deviceType + '</i></h1>' + '</li>');
                }
                break;
            case 'Switch_en':
                for (var i = 0; i < list.length; i++) {
                    $("#content ul").append(' <li style = "width: 212px; height: 140px;font-size: 12px;margin-left: 30px;color:#606060;" class="ui-widget-content">' +
                        '<div class="checkCircle" data-checked="false" style="display: none;"></div>' +
                        '<h1 class="checkName" style="width: 190px;margin-top: 15px;margin-left: 10px;"><b class="title38">Name:</b><i style="float:right;">' + list[i].fileName + '</i></h1>' +
                        '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title39">Manufacturer:</b><i style="float:right;">' + list[i].manufacturer + '</i></h1>' +
                        '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title40">Device Model:</b><i style="float:right;">' + list[i].deviceModel + '</i></h1>' +
                        '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title41">Controller Model:</b><i style="float:right;">' + list[i].remoteModel + '</i></h1>' +
                        '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title42">Device Type:</b><i style="float:right;">' + list[i].deviceType + '</i></h1>' +
                        '</li>');
                }
                break;
            default:
                for (var i = 0; i < list.length; i++) {
                    $("#content ul").append(' <li style = "width: 212px; height: 140px;font-size: 12px;margin-left: 30px;color:#606060;" class="ui-widget-content">' + '<div class="checkCircle" data-checked="false" style="display: none;"></div>' + '<h1 class="checkName" style="width: 190px;margin-top: 15px;margin-left: 10px;"><b class="title38">文件名称:</b><i style="float:right;">' + list[i].fileName + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title39">生产厂商:</b><i style="float:right;">' + list[i].manufacturer + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title40">设备型号:</b><i style="float:right;">' + list[i].deviceModel + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title41">遥控器型号:</b><i style="float:right;">' + list[i].remoteModel + '</i></h1>' + '<h1 style="width: 190px;margin-top: 8px;margin-left: 10px;"><b class="title42">设备类型:</b><i style="float:right;">' + list[i].deviceType + '</i></h1>' + '</li>');
                }
                break;
        }
    }
    //导入格式判断  中英文切换
    function TabCheckImport(_type){
        //判断是否导入类型
        if (_type == "picture") { //导入图片
            // 判断图片格式类型
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">提示</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title44">图片的格式必须为png，jpg，gif格式!</p>' +
                    '<div class="popupBtn sureButton title30">确定</div>' +
                    '</div>' +
                    '</div>');
                    break;
                case 'Switch_en':
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">Prompt</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title44">Images must be PNG, JPG, GIF format!</p>' +
                    '<div class="popupBtn sureButton title30">Ensure</div>' +
                    '</div>' +
                    '</div>');
                    break;
                default:
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">提示</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title44">图片的格式必须为png，jpg，gif格式!</p>' +
                    '<div class="popupBtn sureButton title30">确定</div>' +
                    '</div>' +
                    '</div>');
                    break;
            }
        } else if (_type == "userModule" || _type == "userMacro" || _type == "btnGroup" || _type == 'picBtn') { //导入自建模块
            //判断压缩包名称
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">提示</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title45">压缩包格式必须为zip!</p>' +
                    '<div class="popupBtn sureButton title30">确定</div>' +
                    '</div>' +
                    '</div>');
                    break;
                case 'Switch_en':
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">Prompt</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title45">The compression package format must be zip!</p>' +
                    '<div class="popupBtn sureButton title30">Ensure</div>' +
                    '</div>' +
                    '</div>');
                    break;
                default:
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">提示</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title45">压缩包格式必须为zip!</p>' +
                    '<div class="popupBtn sureButton title30">确定</div>' +
                    '</div>' +
                    '</div>');
                    break;
            }
        } else if (btnFlag == "infrared") { //导入标准红外模块
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">提示</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title46">格式必须为sir或者SIR格式!</p>' +
                    '<div class="popupBtn sureButton title30">确定</div>' +
                    '</div>' +
                    '</div>');
                    break;
                case 'Switch_en':
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">Prompt</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title46">The format must be sir or SIR!</p>' +
                    '<div class="popupBtn sureButton title30">Ensure</div>' +
                    '</div>' +
                    '</div>');
                    break;
                default:
                    $("#shade").css("display", "block").append('<div id="popup">' +
                    '<div id="popupTop">' +
                    '<span class="title43">提示</span>' +
                    '</div>' +
                    '<div id="popupBottom">' +
                    '<p class="title46">格式必须为sir或者SIR格式!</p>' +
                    '<div class="popupBtn sureButton title30">确定</div>' +
                    '</div>' +
                    '</div>');
                    break;
            }
        }
        //确定按钮取消弹框；
        $(".sureButton").on("click", function () {
            $("#shade").css("display", "none").html("");
        });
    }
    //导入文件过大提示  中英文切换
    function TabImportFull(){
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title43">提示</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title47">导入的文件过大！</p>' +
                '<div class="popupBtn sureButton title30">确定</div>' +
                '</div>' +
                '</div>');
                break;
            case 'Switch_en':
                $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title43">Prompt</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title47">Import the file too big!</p>' +
                '<div class="popupBtn sureButton title30">Ensure</div>' +
                '</div>' +
                '</div>');
                break;
            default:
                $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title43">提示</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title47">导入的文件过大！</p>' +
                '<div class="popupBtn sureButton title30">确定</div>' +
                '</div>' +
                '</div>');
                break;
        }
        $(".sureButton").on("click", function () {
            $("#shade").css("display", "none").html("");
        });
    }
    //选择资源提示  中英文切换
    function TabChooseResouce(){
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title43">提示</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title48">请先选择资源,再删除！</p>' +
                '<div class="popupBtn sureButton title30">确定</div>' +
                '</div>' +
                '</div>');
                break;
            case 'Switch_en':
                $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title43">Prompt</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title48">Please select the resource first and then delete it!</p>' +
                '<div class="popupBtn sureButton title30">Ensure</div>' +
                '</div>' +
                '</div>');
                break;
            default:
                $("#shade").css("display", "block").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title43">提示</span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title48">请先选择资源,再删除！</p>' +
                '<div class="popupBtn sureButton title30">确定</div>' +
                '</div>' +
                '</div>');
                break;
        }
        $(".sureButton").on("click", function () {
            $("#shade").css("display", "none").html("");
        });
    }
    //打包导出  中英文切换
    function TabExport(urlType){
        if(urlType === "userModule"){
            var _url = Ip + '/services/management/export/usermodule';
        }else if(urlType === "btnGroup"){
            var _url = Ip + '/services/management/export/component';
        }else if(urlType === "userMacro"){
            var _url = Ip + '/services/management/export/macro';
        }else if(urlType === "picBtn"){
            var _url = Ip + '/services/management/export/buttonModule';
        }
        $("#waitBox").remove();
        switch (localStorage.getItem('Switch')) {
            case 'Switch_cn':
                $("#shade").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title36">导出</span>' +
                '<span id = "closePopup"></span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title50">打包成功!是否导出?</p>' +
                '<div class="popupBtn sureBtn">' +
                '<a href="' + _url + '" class="title30">确定</a>' +
                '</div>' +
                '<div class="popupBtn cancelBtn title33">取消</div>' +
                '</div>' +
                '</div>');
                break;
            case 'Switch_en':
                $("#shade").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title36">Export</span>' +
                '<span id = "closePopup"></span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title50">Packaged successfully! Is it exported?</p>' +
                '<div class="popupBtn sureBtn">' +
                '<a href="' + _url + '" class="title30">Ensure</a>' +
                '</div>' +
                '<div class="popupBtn cancelBtn title33">Cancel</div>' +
                '</div>' +
                '</div>');
                break;
            default:
                $("#shade").append('<div id="popup">' +
                '<div id="popupTop">' +
                '<span class="title36">导出</span>' +
                '<span id = "closePopup"></span>' +
                '</div>' +
                '<div id="popupBottom">' +
                '<p class="title50">打包成功!是否导出?</p>' +
                '<div class="popupBtn sureBtn">' +
                '<a href="' + _url + '" class="title30">确定</a>' +
                '</div>' +
                '<div class="popupBtn cancelBtn title33">取消</div>' +
                '</div>' +
                '</div>');
                break;
        }
        
        //确定按钮
        $(".sureBtn").on("click", function () {
            $("#shade").css("display", "none").html("");
        });
        //取消按钮
        $(".cancelBtn").on("click", function () {
            $("#shade").css("display", "none").html("");
        });
        //关闭按钮
        $("#closePopup").on("click", function () {
            $("#shade").css("display", "none").html("");
        });
    }
});