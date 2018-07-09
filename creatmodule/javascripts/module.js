/*
 ©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
 ©2017-2018 北京清立科技有限公司。保留所有权利。

 文件名称: module.js
 功能:   自建模块生成 校验  运行自建模块  上传自建模块功能
 作者: YuanZhiYong

 版本说明: 自建模块1.0开发版
 修改描述:
 */


$(function () {
    var IP='http://192.168.0.136';

    var MOD = {  //模块描述结构
        "Class": "",
        "Name": "",
        "CONFIG": "",
        "ModuleClassify": "Standard",
        "ModuleType": "UserModule",
        "ModuleHelp":"",
        "Port": "",
        "Retriggerable":false,
        "CheckCode":"",
        "Type": "LOGIC",
        "Interface": "none",
        "Group": "",
        "Input": {},
        "StaticParameter": {},
        "Output": {}
    };
    var bModuleName = false;  //模块名称是否可行标志  true:模块名称可用  false:模块名称重复
    var bCloudSync = false;  //模块云同步标志  true:允许云同步  false:不允许云同步

    //查询是否登录，没有登录返回首页进行登录
    $.ajax({
        url:'/login/wx',
        type:'post',
        data:{
            packages:JSON.stringify({
                'method':'isLogin'
            })
        },
        success:function(data){
            if(!data.result.status){
                location.href = '/home?login=/services/create';
            }
        }
    });

    //中英文切换
    var tabFlag = 1;  //中英文切换开关 tabFlag = 1  代表中文状态   等于0代表英文状态
    //打开时通过localstorage判断中英文状态
    switch (localStorage.getItem('Switch')) {
        case 'Switch_cn':
            Switch_CN_EN(0,'.cn','.en');
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
    //中文按钮
    $('.cn_en .cn').on('click', function () {
        if (tabFlag === 1) {  //中文状态下不能再点击
            return
        }
        //切换中文
        if (tabFlag === 0) {
            Switch_CN_EN(tabFlag,'.cn','.en');
            localStorage.setItem('Switch','Switch_cn'); //存储localstorage，中文属性值
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
            Switch_CN_EN(tabFlag,'.en','.cn');
            localStorage.setItem('Switch','Switch_en'); //存储localstorage，英文属性值
            tabFlag = 0;
        }
    });
    //中英文切换函数
    function Switch_CN_EN(index,select,unselect) {
        var cn_en_data = {  //本地中英文对照表
            'title1': ['创建模块区','Create Module Area'],
            'title2': ['编码区','Code Area'],
            'title3': ['运行','Run'],
            'title4': ['调试区','Debug Area'],
            'title5': ['创建新模块', 'Create New Module'],
            'title6': ['模块名称','Name'],
            'title7': ['输入端','Input'],
            'title8': ['静态参数','Parameter'],
            'title9': ['输出端','Output'],
            'title10': ['参数类型','&nbsp;&nbsp;&nbsp;Type'],
            'title11': ['信号名称','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name&nbsp;'],
            'title12': ['可选信号','Optional'],
            'title13': ['模块帮助说明','Module Help'],
            'title14': ['创建','Create'],
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
    }


    $("#pathModel").on('mouseenter', '.rectT', function () {  //模块编辑、帮助按钮显示
        $(this).find(".img").attr("display", "blcok");
    });

    $("#pathModel").on('mouseleave', '.rectT', function () {  //模块编辑、帮助按钮隐藏
        $(this).find(".img").attr("display", "none");
    });

    $('.module').on('click', '.edit-close', function () {  //关闭编辑区
        $('#module-edit').remove();  //删除编辑区
    });

    //打开模块输入区
    $('.open-btn1').on('click', function () {
        var create = $('#create-module').clone();  //克隆模块输入区
        create.attr('id', 'createarea');  //设置id
        create.css('display', 'block');  //显示
        if ($('#createarea').length == 0) {
            create.appendTo($('.content'));
            bModuleName = false;  //创建新模块前首先把模块名称是否可行标志 置为false
        }

    });

    //关闭模块输入区
    $('.content').on('click', '.close-btn', function () {
        $('#createarea').remove();
        bModuleName = false;  //创建新模块前首先把模块名称是否可行标志 置为false
    });

    //增加一行信号
    $('.content').on('click', '.add', function () {
        var signal = $('#signal').clone();
        signal.removeAttr('id');
        signal.appendTo($('#createarea .module-content'));
    });

    // 删除一行信号
    $('.content').on('click', '.delete', function () {
        $(this).parent().remove();
    });
    //创建模块
    $('.content').on('click', '.create-btn', function () {
        if (!$('#createarea .text').val()) {  //模块名称为空时提示
            $('#createarea .error').css('display', 'block');
            $('#createarea .right').css('display', 'none');
            // $('#createarea .err-tip').show().html('模块名称不能为空');
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    TabStyle();
                    $('#createarea .err-tip').show().html('模块名称不能为空');
                    break;
                case 'Switch_en':
                    TabStyle();
                    $('#createarea .err-tip').show().html('Module name cannot be empty');
                    break;
                default:
                    TabStyle();
                    $('#createarea .err-tip').show().html('模块名称不能为空');
                    break;
            }
        }else{
            var reg =  /^([0-9a-zA-Z]|[\u4E00-\u9FA5])*$/g;  //定义正则校验模块名称 只能是数字 字母 或者中文
            if(!reg.test($('#createarea .text').val())){  //校验失败提示
                $('#createarea .error').css('display', 'block');
                $('#createarea .right').css('display', 'none');
                // $('#createarea .err-tip').show().html('模块名称不能包含特殊字符');
                switch (localStorage.getItem('Switch')) {
                    case 'Switch_cn':
                        $('#createarea .err-tip').show().html('模块名称不能包含特殊字符');
                        break;
                    case 'Switch_en':
                        $('#createarea .err-tip').show().html('Module name cannot contain special characters');
                        break;
                    default:
                        $('#createarea .err-tip').show().html('模块名称不能包含特殊字符');
                        break;
                }
            }else{
                var signalAll=$('#createarea .module-content input[type=text]');  //获取所有信号输入
                for(var i=0; i<signalAll.length; i++){  //遍历所有信号名  对信号名重复的提示
                    for(var k=i+1; k<signalAll.length; k++){
                        if(signalAll.eq(i).val()&&signalAll.eq(i).val()==signalAll.eq(k).val()){
                            $('.mes-err').css('display', 'block');
                            $('.mask').css('display', 'block');
                           // $('.mes-err .mes-text').html('信号名不能重复！');
                            switch (localStorage.getItem('Switch')) {
                                case 'Switch_cn':
                                    TabStyle();
                                    $('.mes-err .mes-text').html('信号名不能重复！');
                                    break;
                                case 'Switch_en':
                                    TabStyle();
                                    $('.mes-err .mes-text').html('Signal name cannot be repeated!');
                                    break;
                                default:
                                    TabStyle();
                                    $('.mes-err .mes-text').html('信号名不能重复！');
                                    break;
                            }
                            return;
                        }
                    }
                }
                var moduleName = $('#createarea .text').val();
                var moduleDescription = $('#createarea #module-description').val();  //模块帮助说明
                MOD = {  //模块描述结构
                    "Class": "",
                    "Name": "",
                    "CONFIG": "",
                    "ModuleClassify": "Standard",
                    "ModuleType": "UserModule",
                    "ModuleHelp":"",
                    "Retriggerable":false,
                    "CheckCode":"",
                    "Port": "",
                    "Type": "LOGIC",
                    "Interface": "none",
                    "Group": "",
                    "Input": {},
                    "StaticParameter": {},
                    "Output": {}
                };
                MOD.Name = moduleName;
                MOD.ModuleHelp = moduleDescription;

                var inSignals = $('#createarea').find('.signal .input');  //获取输入信号
                var outSignals = $('#createarea').find('.signal .output');  //获取输出信号
                var staticSignals = $('#createarea').find('.signal .static');  //获取静态参数
                for (var i = 0; i < inSignals.length; i++) {  //遍历输入信号 生成数据结构
                    var POS = "Pos" + (i + 1);
                    MOD.Input[POS] = {
                        "Type": "",
                        "DefaultName": "",
                        "DefaultValue": "",
                        "MaxNumber":1,
                        "ParameterType":"",
                        "UserName":"",
                        "Optional": "",
                        "Increasable": false,
                        "IncreasableAccompany": []
                    };
                    MOD.Input[POS].Type = inSignals.eq(i).find('select').val();  //获取信号类型
                    switch(inSignals.eq(i).find('select').val()){  //设置信号参数类型
                        case 'Digital':
                            MOD.Input[POS].ParameterType = 'Default';
                            break;
                        case 'Serial':
                            MOD.Input[POS].ParameterType = 'Default';
                            break;
                        case 'Analog':
                            MOD.Input[POS].ParameterType = 'Bit16';
                            break;
                    }
                    let signalName = inSignals.eq(i).find('input[type=text]').val();
                    MOD.Input[POS].DefaultName = signalName;
                    if (inSignals.eq(i).find('input[type=checkbox]').is(':checked')) {  //设置信号属性
                        MOD.Input[POS].Optional = true;
                        MOD.Input[POS].DefaultName = `[${signalName}]`;
                    } else {
                        MOD.Input[POS].Optional = false;
                    }

                }
                for (var i = 0; i < outSignals.length; i++) {  //遍历输出信号  生成数据结构
                    var POS = "Pos" + (i + 1);
                    MOD.Output[POS] = {
                        "Type": "",
                        "DefaultName": "",
                        "DefaultValue": "",
                        "MaxNumber":1,
                        "ParameterType":"",
                        "UserName":"",
                        "Optional": "",
                        "Increasable": false,
                        "IncreasableAccompany": []
                    };
                    MOD.Output[POS].Type = outSignals.eq(i).find('select').val();  //获取信号类型
                    switch(outSignals.eq(i).find('select').val()){  //设置信号类型
                        case 'Digital':
                            MOD.Output[POS].ParameterType = 'Default';
                            break;
                        case 'Serial':
                            MOD.Output[POS].ParameterType = 'Default';
                            break;
                        case 'Analog':
                            MOD.Output[POS].ParameterType = 'Bit16';
                            break;
                    }
                    MOD.Output[POS].DefaultName = outSignals.eq(i).find('input[type=text]').val();  //设置信号默认名
                    if (outSignals.eq(i).find('input[type=checkbox]').is(':checked')) {  //设置信号属性
                        MOD.Output[POS].Optional = true;
                        MOD.Output[POS].DefaultName = `[${outSignals.eq(i).find('input[type=text]').val()}]`;
                    } else {
                        MOD.Output[POS].Optional = false;
                    }

                }
                for (var i = 0; i < staticSignals.length; i++) {  //遍历静态参数 生成数据结构
                    var POS = "Pos" + (i + 1);
                    MOD.StaticParameter[POS] = {  //静态参数数据结构
                        "Type": "",
                        "DefaultName": "",
                        "UserName":"",
                        "DefaultValue": "",
                        "MaxNumber":1,
                        "ParameterType":"",
                        "Optional": "",
                        "Increasable": false,
                        "IncreasableAccompany": []
                    };
                    MOD.StaticParameter[POS].Type = staticSignals.eq(i).find('select').val();  //获取信号类型
                    switch(staticSignals.eq(i).find('select').val()){  //根据信号类型  设置信号类型分类
                        case 'Digital':
                            MOD.StaticParameter[POS].ParameterType = 'Default';
                            break;
                        case 'Serial':
                            MOD.StaticParameter[POS].ParameterType = 'Default';
                            break;
                        case 'Analog':
                            MOD.StaticParameter[POS].ParameterType = 'Bit16';
                            break;
                    }
                    MOD.StaticParameter[POS].DefaultName = staticSignals.eq(i).find('input[type=text]').val();  //设置信号名
                    if (staticSignals.eq(i).find('input[type=checkbox]').is(':checked')) {  //设置信号属性
                        MOD.StaticParameter[POS].Optional = true;
                        MOD.StaticParameter[POS].DefaultName = `[${staticSignals.eq(i).find('input[type=text]').val()}]`;
                    } else {
                        MOD.StaticParameter[POS].Optional = false;
                    }
                }
                //console.log(JSON.stringify(MOD));
                var stro=new Date().getTime()+JSON.stringify(MOD);  //把模块描述结构和时间戳拼接字符串 用于生成md5
                var md51=stro.MD5();  //生成md5
                var newClass=moduleName+'_'+md51;
                MOD.CheckCode = md51; //将模块的json结构转换成校验码
                MOD.Class=newClass;
                $('#pathModel').html('');
                addBox1('pathModel', 150, 200, MOD);
                $(this).parent().remove();
                bModuleName = false;  //创建新模块前首先把模块名称是否可行标志 置为false
                bCloudSync = false; //不允许允许云同步
            }
        }
    });

    //验证模块名称是否可用
    $('.content').on('blur', '#createarea .text', function () {
        var value = $(this).val();
        var packages = {
            "method": "checkName",
            "name": value
        };
        if (value) {
            //$.ajax({
            //    type: "POST",
            //    url: IP+'/services/create/',  //lipps temp test 20170806
            //    contentType: "application/x-www-form-urlencoded; charset=utf-8",
            //    data: {
            //        packages: JSON.stringify(packages)
            //    },
            //    success: function (res) {
            //        if (res.result == true) {  //返回结果为true
            //            bModuleName = true; //模块名称可用
            //            $('#createarea .error').css('display', 'none');
            //            $('#createarea .right').css('display', 'block');
            //        } else {
            //            $('#createarea .error').css('display', 'block');
            //            $('#createarea .right').css('display', 'none');
            //        }
            //    }
            //
            //});
            var reg =  /^([0-9a-zA-Z]|[\u4E00-\u9FA5])*$/g;  //定义正则校验模块名称
            if(!reg.test($('#createarea .text').val())){  //校验失败 提示
                $('#createarea .error').css('display', 'block');
                $('#createarea .right').css('display', 'none');
                //$('#createarea .err-tip').show().html('模块名称不能包含特殊字符');
                switch (localStorage.getItem('Switch')) {
                    case 'Switch_cn':
                        $('#createarea .err-tip').show().html('模块名称不能包含特殊字符');
                        break;
                    case 'Switch_en':
                        $('#createarea .err-tip').show().html('Module name cannot contain special characters');
                        break;
                    default:
                        $('#createarea .err-tip').show().html('模块名称不能包含特殊字符');
                        break;
                }
            }else{  //校验成功
                $('#createarea .error').css('display', 'none');
                $('#createarea .right').css('display', 'block');
                $('#createarea .err-tip').hide();
            }
        } else {  //模块名称为空时 提示
            $('#createarea .error').css('display', 'block');
            $('#createarea .right').css('display', 'none');
            //$('#createarea .err-tip').show().html('模块名称不能为空');
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    TabStyle();
                    $('#createarea .err-tip').show().html('模块名称不能为空');
                    break;
                case 'Switch_en':
                    TabStyle();
                    $('#createarea .err-tip').show().html('Module name cannot be empty');
                    break;
                default:
                    TabStyle();
                    $('#createarea .err-tip').show().html('模块名称不能为空');
                    break;
            }
        }
    });

    $('#pathModel').on('click', '.edit', openEdit);  //打开模块编辑区

    //云同步模块数据结构
    $('.write-btn').on('click', function () {
        if(bCloudSync){
            var packages={
                "method":"cloudSync",
                "description":MOD
            };
            $.ajax({
                type: "POST",
                url: IP+'/services/create/',
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    packages: JSON.stringify(packages)
                },
                success: function (res) {
                    if (res.result == true) {  //返回结果为true
                        bCloudSync = false; //不允许允许云同步
                        $('.mes-ok').css('display', 'block');
                        $('.mask').css('display', 'block');
                        //$('.mes-ok .mes-text').html('上传成功！');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.mes-ok .mes-text').html('上传成功！');
                                break;
                            case 'Switch_en':
                                $('.mes-ok .mes-text').html('Upload successful!');
                                break;
                            default:
                                $('.mes-ok .mes-text').html('上传成功！');
                                break;
                        }
                    } else {  //错误提示
                        $('.mes-err').css('display', 'block');
                        $('.mask').css('display', 'block');
                        //$('.mes-err .mes-text').html('上传失败！');
                        switch (localStorage.getItem('Switch')) {
                            case 'Switch_cn':
                                $('.mes-err .mes-text').html('上传失败！');
                                break;
                            case 'Switch_en':
                                $('.mes-err .mes-text').html('Upload failed!');
                                break;
                            default:
                                $('.mes-err .mes-text').html('上传失败！');
                                break;
                        }
                    }
                }

            });
        }else{  //校验失败
            $('.mes-err').css('display', 'block');
            $('.mask').css('display', 'block');
            //$('.mes-err .mes-text').html('模块没有验证通过！');
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    TabStyle();
                    $('.mes-err .mes-text').html('模块没有验证通过！');
                    break;
                case 'Switch_en':
                    TabStyle();
                    $('.mes-err .mes-text').html('Module has not been verified!');
                    break;
                default:
                    TabStyle();
                    $('.mes-err .mes-text').html('模块没有验证通过！');
                    break;
            }
        }
    });

    //删除模块
    $('.delete-btn').on('click', function () {
        $('.dragsource').remove();  //删除模块
        $('#module-edit').remove();  //删除编辑区
        bCloudSync = false; //不允许允许云同步
    });
    //运行函数
    $('.run-btn').on('click', function () {
        var MPV = {
            "Input": {},
            "Output": {},
            "StaticParameter": {},
            "SignalNameVSPos": {
                "Input": {},
                "Output": {},
                "StaticParameter": {}
            },
            "Refresh": [],
            "Token": ""
        };

        if ($('.dragsource').length == 0) {  //如果模块区没有模块提示错误
            $('.mes-err').css('display', 'block');
            $('.mask').css('display', 'block');
            //$('.mes-err .mes-text').html('没有可用模块！');
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    $('.mes-err .mes-text').html('没有可用模块！');
                    break;
                case 'Switch_en':
                    $('.mes-err .mes-text').html('No modules available!');
                    break;
                default:
                    $('.mes-err .mes-text').html('没有可用模块！');
                    break;
            }
            return;
        }
        if ($('#module-edit').length == 0) {  //如果模块编辑区没有打开
            $('.mes-err').css('display', 'block');
            $('.mask').css('display', 'block');
            //$('.mes-err .mes-text').html('模块编辑区没有打开！');
            switch (localStorage.getItem('Switch')) {
                case 'Switch_cn':
                    TabStyle();
                    $('.mes-err .mes-text').html('模块编辑区没有打开！');
                    break;
                case 'Switch_en':
                    TabStyle();
                    $('.mes-err .mes-text').html('Module edit area not open!');
                    break;
                default:
                    TabStyle();
                    $('.mes-err .mes-text').html('模块编辑区没有打开！');
                    break;
            }
            return;
        }
        var InCircleAll = $('.dragsource').find('.gIn circle');
        var OutCircleAll = $('.dragsource').find('.gOut circle');
        var StaticSignalAll = $('.dragsource').find('.gStatic foreignObject');
        for (var i = 0; i < InCircleAll.length; i++) {
            if (InCircleAll.eq(i).attr('data-optional') == "false" && $('#module-edit').find('.edit-In .edit-txt').eq(i).find('input').eq(0).val() == "") {
                $('.mes-err').css('display', 'block');
                $('.mask').css('display', 'block');
                //$('.mes-err .mes-text').html('不可选信号必须填写数值！');
                switch (localStorage.getItem('Switch')) {
                    case 'Switch_cn':
                        TabStyle();
                        $('.mes-err .mes-text').html('不可选信号必须填写数值！');
                        break;
                    case 'Switch_en':
                        TabStyle();
                        $('.mes-err .mes-text').html('No optional signal must input value!');
                        break;
                    default:
                        TabStyle();
                        $('.mes-err .mes-text').html('不可选信号必须填写数值！');
                        break;
                }
                return;
            }
        }
        for (var i = 0; i < StaticSignalAll.length; i++) {
            if (StaticSignalAll.eq(i).attr('data-optional') == "false" && $('#module-edit').find('.edit-Static .edit-select').eq(i).find('input').eq(0).val() == "") {
                $('.mes-err').css('display', 'block');
                $('.mask').css('display', 'block');
                //$('.mes-err .mes-text').html('不可选信号必须填写数值！');
                switch (localStorage.getItem('Switch')) {
                    case 'Switch_cn':
                        TabStyle();
                        $('.mes-err .mes-text').html('不可选信号必须填写数值！');
                        break;
                    case 'Switch_en':
                        TabStyle();
                        $('.mes-err .mes-text').html('No optional signal must input value!');
                        break;
                    default:
                        TabStyle();
                        $('.mes-err .mes-text').html('不可选信号必须填写数值！');
                        break;
                }
                return;
            }
        }
        var code = $('.code textarea').val();  //获取编码区代码
        var reg = /console.log/gm;  //定义匹配“console.log”字段正则规则
        if (reg.test(code)) {  //如果匹配到规则内字段，调试区提示错误
            $('.debugging').html('No permission, please contact the manufacturer');
            return;
        }
        var Code = code.replace(/return\s+MRV/g, "return JSON.stringify(MRV)");

        for (var i = 0; i < InCircleAll.length; i++) {
            if ($('#module-edit').find('.edit-In .edit-txt').eq(i).find('input').eq(0).val()) {
                var POS = "Pos" + (i + 1);
                MPV.Input[POS] = {
                    "SignalName": "",
                    "SignalType": "",
                    "SignalValue": ""
                };
                var SignalName = InCircleAll.eq(i).attr('data-signalname');
                var SignalType = InCircleAll.eq(i).attr('data-signaltype');
                MPV.Input[POS].SignalName = SignalName;
                MPV.Input[POS].SignalType = SignalType;
                switch (InCircleAll.eq(i).attr('data-signaltype')) {
                    case "digital":
                        var SignalValue = parseInt($('#module-edit').find('.edit-In .edit-txt').eq(i).find('input').eq(0).val());
                        MPV.Input[POS].SignalValue = SignalValue;
                        break;
                    case "analog":
                        var SignalValue = parseInt($('#module-edit').find('.edit-In .edit-txt').eq(i).find('input').eq(0).val());
                        MPV.Input[POS].SignalValue = SignalValue;
                        break;
                    case "serial":
                        var SignalValue = $('#module-edit').find('.edit-In .edit-txt').eq(i).find('input').eq(0).val();
                        MPV.Input[POS].SignalValue = SignalValue;
                        break;
                }
                MPV.Refresh.push(POS);  //把有数值的POS存入数据结构
            }
        }
        for (var i = 0; i < OutCircleAll.length; i++) {
            var POS = "Pos" + (i + 1);
            MPV.Output[POS] = {
                "SignalName": "",
                "SignalType": ""
            };
            var SignalName = OutCircleAll.eq(i).attr('data-signalname');
            var SignalType = OutCircleAll.eq(i).attr('data-signaltype');
            MPV.Output[POS].SignalName = SignalName;
            MPV.Output[POS].SignalType = SignalType;
        }
        for (var i = 0; i < StaticSignalAll.length; i++) {
            if ($('#module-edit').find('.edit-Static .edit-select').eq(i).find('input').eq(0).val()) {
                var POS = "Pos" + (i + 1);
                MPV.StaticParameter[POS] = {
                    "SignalName": "",
                    "SignalType": "",
                    "SignalValue": ""
                };
                var SignalName = StaticSignalAll.eq(i).attr('data-signalname');
                var SignalType = StaticSignalAll.eq(i).attr('data-signaltype');
                MPV.StaticParameter[POS].SignalName = SignalName;
                MPV.StaticParameter[POS].SignalType = SignalType;
                switch (StaticSignalAll.eq(i).attr('data-signaltype')) {
                    case "digital":
                        var SignalValue = parseInt($('#module-edit').find('.edit-Static .edit-select').eq(i).find('input').eq(0).val());
                        MPV.StaticParameter[POS].SignalValue = SignalValue;
                        break;
                    case "analog":
                        var SignalValue = parseInt($('#module-edit').find('.edit-Static .edit-select').eq(i).find('input').eq(0).val());
                        MPV.StaticParameter[POS].SignalValue = SignalValue;
                        break;
                    case "serial":
                        var SignalValue = stringToHex($('#module-edit').find('.edit-Static .edit-select').eq(i).find('input').eq(0).val());
                        MPV.StaticParameter[POS].SignalValue = SignalValue;
                        break;
                }

            }
        }
        var packages = {
            "method": "simulationOperation",
            "code": Code,
            "MPV": MPV
        };
        $.ajax({
            type: "POST",
            url: IP+'/services/create/',  //lipps temp test 20170806
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {
                packages: JSON.stringify(packages)
            },
            success: function (res) {
                if (res.result.ERR == "") {  //返回结果为true
                    bCloudSync = true; //允许云同步
                    var MRV=res.result.MRV;
                    for(var pos in MRV.Output){
                        var posNum=pos.match(/\d+/)[0];  //获取到位置的自然数 如"Pos2" 中的 2
                        $('#module-edit').find('.edit-Out .edit-txt').eq(posNum-1).find('input').eq(0).val(MRV.Output[pos])
                    }
                } else {
                    $('.debugging').html(res.result.ERR);  //如果返回错误，把错误信息填入调试区
                }
            }

        });
        //console.log(JSON.stringify(MPV))
    });
    $('.mes-close').on('click', function () {  //关闭提示框
        $(this).parent().css('display', 'none');
        $('.mask').css('display', 'none');  //关闭遮罩层
    });

    $('.backhome').on('click', function () {
        location.href = "/home";
    });

    function stringToHex(str) {  //字符串转十六进制字符串函数
        var str1 = str.replace(/\\x[0-9a-fA-F][0-9a-fA-F]/g, function (matchStr) {  //定义正则replacement函数，匹配形如"\\x5a"的字符串
            var s1 = matchStr.replace(/\\x/, "");  //将匹配的字符串去除"\x", 得到字符串如：5a
            var s2 = parseInt(s1, 16);  //将字符串解释为十六进制数值如：0x5a
            var s3 = String.fromCharCode(s2);  //将十六进制数值解释为对应ASCII字符
            return s3;  //返回正则(用于替换所有的匹配项)
        });
        return str1;
    }

    //模块生成函数
    function addBox1(id, dropPostionX, dropPostionY, json) {  //添加模块的函数
        var json=JSON.parse(JSON.stringify(json));
        var InY1 = 60;  //输入信号text初始Y值
        var InY2 = 56;  //输入信号Circle初始Y值
        var InY3 = 50;  // 输入动态参数框初始Y值
        var OutY1 = 60; //输出信号text初始Y值
        var OutY2 = 56;  //输出信号circle初始Y值
        var StaticY1 = 50;  //静态参数框初始Y值
        for (var name in json.Input) {  //循环模块描述结构输入信号
            json.Input[name].position = [{"x": 10, "y": InY1}, {"x": 0, "y": InY2}, {"x": 35, "y": InY3}];//生成输入信号的各个坐标
            InY1 += 20;
            InY2 += 20;
            InY3 += 20;
        }
        for (var name in json.Output) {  //循环模块描述结构输出信号
            json.Output[name].position = [{"x": 116, "y": OutY1}, {"x": 125, "y": OutY2}];  //生成输出信号坐标
            OutY1 += 20;
            OutY2 += 20;
        }
        for (var name in json.StaticParameter) {   //循环模块描述结构静态参数
            json.StaticParameter[name].position = [{"x": 35, "y": StaticY1}];//生成静态参数坐标
            StaticY1 += 20;
        }
        var oldHtml = $("#svgModule").html();
        var allModuleId = [];  //保存所有模块ID自然数
        for (var i = 0; i < $('.dragsource').length; i++) {  //截取所有模块Id自然数
            allModuleId.push(parseInt($('.dragsource').eq(i).attr('id').substring(1)));
        }
        var num = findMax(allModuleId) + 1;  //赋值找到模块Id中最大的自然数
        var mysvg = document.getElementById(id);  //获取svg画布      新增函数id参数
        var gObj = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if (gObj) {
            gObj.setAttribute("id", "M" + num);  //设置模块id
            if ($('#svgModule .dragsource[data-interface="TRUE"]').length > 0 && json.Interface == "TRUE") {  //如果工作区内有当前接口模块
                for (var i = 0; i < $('#svgModule .dragsource[data-interface="TRUE"]').length; i++) {
                    if ($('#svgModule .dragsource[data-interface="TRUE"]').eq(i).find('.textTop').html() == json.Class) {
                        gObj.setAttribute("data-root", $('#svgModule .dragsource[data-interface="TRUE"]').eq(i).attr('data-root'));  //设置模块data-root属性为根模块的data-root,相当于克隆出来的模块
                        break;
                    } else {
                        gObj.setAttribute("data-root", "M" + num);  //否则设置模块data-root属性为自己的ID
                    }
                }
            } else {
                gObj.setAttribute("data-root", "M" + num);  //否则设置模块data-root属性为自己的ID
            }
            gObj.setAttribute("class", "dragsource");  //设置模块类名
            gObj.setAttribute("transform", "translate(" + dropPostionX + "," + dropPostionY + ")");  //设置模块transform值（模块偏移量）
            gObj.setAttribute("data-group", json.Group);  //设置模块自定义属性，组
            gObj.setAttribute("data-interface", json.Interface);  //设置模块自定义属性，是不是接口模块
            gObj.setAttribute("data-port", json.Port);  //设置模块自定义属性，端口号
            gObj.setAttribute("data-type", json.Type);  //设置模块自定义属性，模块类型
            if (json.CONFIG) {
                gObj.setAttribute("data-config", JSON.stringify(json.CONFIG));  //设置模块自定义属性，模块端口设置
                gObj.setAttribute("data-mode", "RS232");  //设置模块自定义属性，模块端口设置
                gObj.setAttribute("data-rate", 9600);  //设置模块自定义属性，模块端口设置
                gObj.setAttribute("data-data", 8);  //设置模块自定义属性，模块端口设置
                gObj.setAttribute("data-stop", 1);  //设置模块自定义属性，模块端口设置
                gObj.setAttribute("data-parity", "NONE");  //设置模块自定义属性，模块端口设置
            }
            if (json.Type == "NET") {  //如果是网络模块
                gObj.setAttribute("data-ip", "");  //设置模块自定义属性，模块端口设置
                gObj.setAttribute("data-netport", "");  //设置模块自定义属性，模块端口设置
                if (json.Class == "Telnet Client") {  //如果是telnet模块
                    gObj.setAttribute("data-username", "");  //设置模块自定义属性，模块端口设置
                    gObj.setAttribute("data-password", "");  //设置模块自定义属性，模块端口设置
                }
            }
            mysvg.appendChild(gObj);  //把动态创建的模块插入到页面
            var str = '<g class = "rectT"><rect x="0" y="0" rx="0" ry="0" width="125" height="30" style="fill:#f5f5f5;stroke:#606060;stroke-width:2;"class = "rect1 rectTop rect"/><text x="63" y="21" fill="#5F5F5F"font-size = "14px" class = " textTop">' + json.Name + '</text><g transform="translate(3,5)" class = "img help" display="none"><g><rect class="st0" style="fill:#FFFFFF;" width="13" height="16.4"/><g><polygon class="st1" style="fill:#606060;" points="13,16.4 0,16.4 0,0 8.1,0 8.1,0.7 0.7,0.7 0.7,15.7 12.3,15.7 12.3,5 13,5"/><g><path style="fill:#606060;" class="st1" d="M2.7,3.5h0.8v4.2h5.9V3.5h0.8V13H9.4V8.5H3.5V13H2.7V3.5z"/></g></g></g></g><g transform="translate(108,5)" class = "img edit" display="none"><g><rect class="st0"width="13"height="16.4"/><g><path class="st1"d="M7.2,9.2"/><path class="st2"d="M12.7,5"/><polygon class="st3"points="12.4,5 12.4,5.5 12.4,15.6 0.6,15.6 0.6,0.7 6.5,0.7 8.1,0.7 8.1,0 6.5,0 0,0 0,0.4 0,16.2 0,16.4 13,16.4 13,16.2 13,5.5 13,5"/><rect x="1.2"y="2.7"class="st3"width="2.3"height="0.3"/><rect x="1.2"y="6.4"class="st3"width="2.3"height="0.3"/><rect x="1.2"y="10.2"class="st3"width="2.3"height="0.3"/><rect x="9.4"y="6.6"class="st3"width="2.3"height="0.3"/><rect x="9.4"y="10.3"class="st3"width="2.3"height="0.3"/><rect x="9.4"y="14.2"class="st3"width="2.3"height="0.3"/><rect x="1.2"y="14"class="st3"width="2.3"height="0.3"/><polygon class="st3"points="12.2,0.1 12.9,1.1 5.5,6.3 3.8,6.8 4.8,5.4"/></g></g></g></g><g class = "rectBg"><rect x="0" y="30" rx="0" ry="0" width="125" height="150" style="fill:#f5f5f5;stroke:#606060;stroke-width:2;" class = "rect1 rectB rect"/><g class = "gIn"></g><g class = "gStatic"></g><g class = "gOut"></g></g>';
            $("#M" + num).html(str);
            var that = $("#M" + num);  //当前模块
            positionModule = document.getElementById("M" + num);  //全局变量记录当前module
            var inHtml = [];  //存放输入信号代码
            var staticHtml = [];  //存放静态信号代码
            var outHtml = [];  //存放输出信号代码
            var inIdNum = 1;  //输入circle圆Id初始值
            var outIdNum = 1;  //输出circle圆ID初始值
            for (var name in json.Input) {   //循环描述模块数据结构json(自己生成的包含每个信号位置)
                switch (json.Input[name].Type) {  //判断信号类型
                    case 'Digital':  //如果是输入数字量
                        var fillColor = json.Input[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        //动态生成输入数字量代码
                        inHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.Input[name].IncreasableAccompany) + ' data-increasable="' + json.Input[name].Increasable + '" class="js-parameter digital"><text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "inText">' + json.Input[name].DefaultName + '</text><circle data-optional="' + (json.Input[name].Optional) + '" data-signalname="' + (json.Input[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Input[name].DefaultName + '" data-signaltype="digital" cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="blue" stroke-width="1" fill="' + fillColor + '" class="inCircle" id = "M' + num + '-in' + inIdNum + '" data-direction = "in"/></g>');
                        break;
                    case 'Analog':  //如果是输入模拟量
                        var fillColor = json.Input[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        //动态生成输入模拟量代码
                        inHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.Input[name].IncreasableAccompany) + ' data-increasable="' + json.Input[name].Increasable + '" class="js-parameter analog"><text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "inText">' + json.Input[name].DefaultName + '</text><circle data-optional="' + (json.Input[name].Optional) + '" data-signalname="' + (json.Input[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Input[name].DefaultName + '" data-signaltype="analog" cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="red" stroke-width="1" fill="' + fillColor + '" class="inCircle" id = "M' + num + '-in' + inIdNum + '" data-direction = "in"/></g>');
                        break;
                    case 'Serial':  //如果是输入串行量
                        var fillColor = json.Input[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        //动态生成输入串行量代码
                        inHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.Input[name].IncreasableAccompany) + ' data-increasable="' + json.Input[name].Increasable + '" class="js-parameter serial"><text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "inText">' + json.Input[name].DefaultName + '</text><circle data-optional="' + (json.Input[name].Optional) + '" data-signalname="' + (json.Input[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Input[name].DefaultName + '" data-signaltype="serial" cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="black" stroke-width="1" fill="' + fillColor + '" class="inCircle" id = "M' + num + '-in' + inIdNum + '" data-direction = "in"/></g>');
                        break;
                    case 'DynamicParameter':  //如果是输入动态量
                        var fillColor = json.Input[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        //动态生成输入动态量代码
                        inHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.Input[name].IncreasableAccompany) + ' data-increasable="' + json.Input[name].Increasable + '" class="js-parameter dynamic"><g><foreignObject  class="abc" x="' + (json.Input[name].position[2].x) + '" y="' + (json.Input[name].position[2].y) + '" width="50" height="15"><div class="dynamicFrame" xmlns="http:  //www.w3.org/1999/xhtml"></div></foreignObject></g><text x="' + (json.Input[name].position[0].x) + '" y="' + (json.Input[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "inText">' + json.Input[name].DefaultName + '</text><circle data-optional="' + (json.Input[name].Optional) + '" data-signalname="' + (json.Input[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Input[name].DefaultName + '" data-signaltype="dynamic" cx="' + (json.Input[name].position[1].x) + '" cy="' + (json.Input[name].position[1].y) + '" r="5" stroke="green" stroke-width="1" fill="' + fillColor + '" class="inCircle" id = "M' + num + '-in' + inIdNum + '" data-direction = "in"/></g>');
                        break;
                    case 'None':
                        break;
                }
                if (json.Input[name].Type != 'None') {
                    inIdNum++;  // 输入circle圆ID自然数 如M1-in(1)
                }
            }
            for (var name in json.Output) {
                switch (json.Output[name].Type) {
                    case 'Digital':
                        var fillColor = json.Output[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        outHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.Output[name].IncreasableAccompany) + ' data-increasable="' + json.Output[name].Increasable + '" class="js-parameter digital"><text text-anchor="end" x="' + (json.Output[name].position[0].x) + '" y="' + (json.Output[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "outText">' + json.Output[name].DefaultName + '</text><circle data-optional="' + (json.Output[name].Optional) + '" data-signalname="' + (json.Output[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Output[name].DefaultName + '" cx="' + (json.Output[name].position[1].x) + '" data-signaltype="digital" cy="' + (json.Output[name].position[1].y) + '" r="5" stroke="blue" stroke-width="1" fill="' + fillColor + '" class="outCircle" id = "M' + num + '-out' + outIdNum + '" data-direction = "out"/></g>');
                        break;
                    case 'Analog':
                        var fillColor = json.Output[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        outHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.Output[name].IncreasableAccompany) + ' data-increasable="' + json.Output[name].Increasable + '" class="js-parameter analog"><text text-anchor="end" x="' + (json.Output[name].position[0].x) + '" y="' + (json.Output[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "outText">' + json.Output[name].DefaultName + '</text><circle data-optional="' + (json.Output[name].Optional) + '" data-signalname="' + (json.Output[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Output[name].DefaultName + '" data-signaltype="analog" cx="' + (json.Output[name].position[1].x) + '" cy="' + (json.Output[name].position[1].y) + '" r="5" stroke="red" stroke-width="1" fill="' + fillColor + '" class="outCircle" id = "M' + num + '-out' + outIdNum + '" data-direction = "out"/></g>');
                        break;
                    case 'Serial':
                        var fillColor = json.Output[name].Increasable ? "white" : "#ccc";  //根据信号是否允许增删定义圆实心空心颜色
                        outHtml.push('<g data-anchor="true" data-increasable="' + json.Output[name].Increasable + '" class="js-parameter serial" data-increasableaccompany=' + JSON.stringify(json.Output[name].IncreasableAccompany) + '><text text-anchor="end" x="' + (json.Output[name].position[0].x) + '" y="' + (json.Output[name].position[0].y) + '" fill="#5F5F5F" font-size = "12px" class = "outText">' + json.Output[name].DefaultName + '</text><circle data-optional="' + (json.Output[name].Optional) + '" data-signalname="' + (json.Output[name].DefaultName) + '" data-signalvalue="" data-username="M' + num + '-' + json.Output[name].DefaultName + '" data-signaltype="serial" cx="' + (json.Output[name].position[1].x) + '" cy="' + (json.Output[name].position[1].y) + '" r="5" stroke="black" stroke-width="1" fill="' + fillColor + '" class="outCircle" id = "M' + num + '-out' + outIdNum + '" data-direction = "out"/></g>');
                        break;
                    case 'None':
                        break;
                }
                if (json.Output[name].Type != 'None') {
                    outIdNum++;  // 输入circle圆ID自然数 如M1-in(1)
                }
            }
            for (var name in json.StaticParameter) {
                if (json.StaticParameter[name].Type != 'None') {  //如果信号类型不是"None"，就创建静态参数
                    var signalType;  //定义静态参数类型
                    switch (json.StaticParameter[name].Type) {  //判断信号静态参数信号类型
                        case 'Digital':
                            signalType = "digital";
                            break;
                        case 'Serial':
                            signalType = "serial";
                            break;
                        case 'Analog':
                            signalType = "analog";
                            break;
                        case 'Time':
                            signalType = "time";
                            break;
                    }
                    staticHtml.push('<g data-anchor="true" data-increasableaccompany=' + JSON.stringify(json.StaticParameter[name].IncreasableAccompany) + ' data-increasable="' + json.StaticParameter[name].Increasable + '" class="js-parameter static"><foreignObject data-optional="' + (json.StaticParameter[name].Optional) + '" data-signalname="' + (json.StaticParameter[name].DefaultName) + '" data-signaltype="' + signalType + '" data-signalvalue="' + (json.StaticParameter[name].DefaultValue) + '" x="' + (json.StaticParameter[name].position[0].x) + '" y="' + (json.StaticParameter[name].position[0].y) + '" width="50" height="15"><div class="staticFrame" xmlns="http:  //www.w3.org/1999/xhtml"></div></foreignObject></g>');
                }

            }
            that.find('.gIn').html(inHtml.join(''));  //把模块区动态生成的输入信号代码插入
            that.find('.gOut').html(outHtml.join(''));  //把模块区动态生成的输出信号代码插入
            that.find('.gStatic').html(staticHtml.join(''));  //把模块区动态生成的静态信号代码插入

            //dynamicChange(that);  //调用动态参数框位置改变函数
            moduleHeight(that);  //调用模块高度变化函数

            var inSignalNameArr = [];  //用以保存输出信号通道名的数组
            var staticSignalNameArr = [];  //用以保存静态参数信号名的数组
            var outSignalNameArr = [];  //用以保存输出信号通道名的数组
            for (var i = 0; i < that.find('.gIn circle').length; i++) {
                inSignalNameArr.push(that.find('.gIn circle').eq(i).attr('data-signalname').replace(/\d+/g, ''));  //把输入信号通道名栈入队列
            }
            for (var i = 0; i < that.find('.gOut circle').length; i++) {
                outSignalNameArr.push(that.find('.gOut circle').eq(i).attr('data-signalname').replace(/\d+/g, ''));  //把输出信号通道名栈入队列
            }
            for (var i = 0; i < that.find('.gStatic foreignObject').length; i++) {
                staticSignalNameArr.push(that.find('.gStatic foreignObject').eq(i).attr('data-signalname').replace(/\d+/g, ''));  //把静态参数名栈入队列
            }
            for (var name in json.Input) {
                if (json.Input[name].HistoryCircle) {  //如果宏模块输入信号有历史信号ID,那么增加data-historycircle属性
                    var index = name.match(/\d+/g)[0];
                    that.find('.gIn circle').eq(index - 1).attr('data-historycircle', json.Input[name].HistoryCircle);
                }
            }
            for (var name in json.Output) {
                if (json.Output[name].HistoryCircle) {  //如果宏模块输出信号有历史信号ID,那么增加data-historycircle属性
                    var index = name.match(/\d+/g)[0];
                    that.find('.gOut circle').eq(index - 1).attr('data-historycircle', json.Output[name].HistoryCircle);
                }
            }
            for (var name in json.StaticParameter) {
                if (json.StaticParameter[name].HistoryModuleId) {  //如果宏模块静态参数有历史模块Id,那么增加data-historymoduleid属性
                    var index = name.match(/\d+/g)[0];
                    that.find('.gStatic foreignObject').eq(index - 1).attr('data-historymoduleid', json.StaticParameter[name].HistoryModuleId);
                }
            }
            gObj.setAttribute('data-insignalnamearr', inSignalNameArr);  //把输入参数名保存在自定义属性中
            gObj.setAttribute('data-staticsignalnamearr', staticSignalNameArr);  //把静态参数名保存在自定义属性中
            gObj.setAttribute('data-outsignalnamearr', outSignalNameArr);  //把输出信号名保存在自定义属性中
            //创建模块时，记录module位置，显示在定位中
            var positionStr = $(positionModule).attr("transform");  //获取该模块在svg中的位置,获取结果为translate(200,200)样式的字符串
            var indexStart = positionStr.indexOf("(");  //获取"("的位置
            var indexEnd = positionStr.indexOf(")");  //获取"）"的位置
            var positionStr1 = positionStr.substring(indexStart + 1, indexEnd);  //从index1+1截取到index2的字符串
            var positionArr = positionStr1.split(",");
            valX = positionArr[0];
            valY = positionArr[1];
            //measure(valX, valY);  //调用度量显示函数  显示最后一次选择的模块的坐标
            //workable();  //工具栏选择状态互斥函数
        }
    }
    //打开编辑区函数
    function openEdit() {  //打开编辑区函数
        var module = $(this).parent().parent(); //获取当前模块
        var translatePos = parseInt(module.attr("transform").length) - 1;  //取得模块位置移动"transform"属性数值的索引
        var translatePosX = module.attr("transform").substring(10, translatePos).split(",")[0];  //取得模块相对页面X坐标
        var translatePosY = module.attr("transform").substring(10, translatePos).split(",")[1];  //取得模块相对页面Y坐标
        var editModule = $('#edit-module').clone(); //克隆编辑区代码
        editModule.css({
            "left": translatePosX + "px",
            "top": translatePosY + "px",
            "display": "block",
            "height": parseInt(module.find('.rectB').attr('height')) + 30 + "px"
        }); //设置模块编辑区定位位置、模块编辑区动态高度
        editModule.attr({"data-moduleid": module.attr("id"), "id": "module-edit"}); //给模块添加自定义属性data-moduleid与当前模块相关联
        editModule.find('.edit-id').text(module.attr("id") + '(' + module.attr("data-root") + ')'); //设置编辑区底部显示当前模块ID
        editModule.appendTo($('.module')); //把动态克隆的编辑区插入页面
        for (var i = 0; i < module.find('.gIn circle').length; i++) { //循环输入信号总个数
            var inSignal = $('<div class="edit-txt"><input class="bj_input bj_input1" type="text"/></div>'); //动态创建输入信号名，数值代码
            $('.module').find('.edit-In').append(inSignal); //把动态加载的编辑区输入框插入到输入信号内
            inSignal.css({"left": "-85px", "top": (module.find('.gIn circle').eq(i).attr("cy") - 16) + "px"}); //根据每个信号circle的坐标区定位输入框位置
        }
        for (var i = 0; i < module.find('.gStatic foreignObject').length; i++) {
            var staticSignal = $('<div class="edit-select"><input style="width:68px; height: 13px; font-size: 12px; border:1px solid #ccc; vertical-align: top;"/></div>');
            $('.module').find('.edit-Static').append(staticSignal);  //插入到输入信号内
            staticSignal.css({"left": "25px", "top": (module.find('.gStatic foreignObject').eq(i).attr("y")) + "px"}); //根据模块动态参数显示框的位置定位编辑区动态参数调试框的位置
        }
        for (var i = 0; i < module.find('.gOut circle').length; i++) {
            var outSignal = $('<div data-circleid="' + module.find('.gOut circle').eq(i).attr('id') + '" class="edit-txt"><input class="bj_input bj_input1" type="text"/></div>');//动态创建输出信号名，数值代码
            $('.module').find('.edit-Out').append(outSignal); //把动态加载的编辑区输入框插入到输出信号内
            outSignal.css({"left": "125px", "top": (module.find('.gOut circle').eq(i).attr("cy") - 16) + "px"}); //根据每个信号circle的坐标区定位输入框位置
        }
        //workable();  //工具栏互斥操作函数；
        window._thisInput = null;  //记录被选择的input
        $(".bj_input").focus(function () {  //添加聚焦事件
            _thisInput = $(this);  //记录当前选择的input
            //FontStyle(_this);
            //record();  //记录输入的参数
        });
        $(".bj_input").blur(function () {  //添加失去焦点事件，调用模块视口属性函数
            $(this).attr("value", $(this).val());
            //ModuleAttribute();  //显示模块属性函数
        });
    }

    //数组找最大值函数
    function findMax(arr) {  //数组找最大值函数
        var max = arr[0];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        if (max == undefined) {
            max = 0;
        }
        return max;
    }

    //模块高度变化函数
    function moduleHeight(that) {
        var allCircleY = [];  //存储当前模块所有circle圆的cy值
        var allStaticY = [];  //存储当前模块所有静态参数框y值
        var max;  //定义一个最大值
        for (var i = 0; i < that.find('circle').length; i++) {  //循环所有circle
            allCircleY.push(parseInt(that.find('circle').eq(i).attr('cy')));  //把所有circle圆cy值存入数组
        }
        for (var i = 0; i < that.find('foreignObject').length; i++) {  //循环所有静态信号框
            allStaticY.push(parseInt(that.find('foreignObject').eq(i).attr('y')));  //把所有静态信号框的y值存入数组
        }
        if (findMax(allCircleY) > findMax(allStaticY)) {  //判断找到所有信号最大的Y值
            max = findMax(allCircleY);
        } else {
            max = findMax(allStaticY);
        }
        if (max < 160) {
            max = 150;
        } else {
            max = max + 5;
        }
        that.find('.rectB').attr('height', max);  //动态设置模块高度
        that.attr("data-moduleheight", 30 + parseInt(that.find('.rectB').attr('height')));  //设置模块自定义属性，用于存储模块高度

    }
    //切换中英文，改变部分样式
    function TabStyle(){
        if(tabFlag === 0){  //en
            console.log('cn')
            $('.mes-icon').css('marginLeft','20px');
        }else {  //cn
            console.log('en')
            $('.mes-icon').css('marginLeft','70px');
        }
    }
});


