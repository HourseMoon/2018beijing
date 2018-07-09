$(function () {
    var Ip = 'http://192.168.0.156';
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
                location.href = '/home?login=/factory';
            }
        }
    });
    //时间显示
    $.ajax({
        type: "POST",
        url: Ip + "/services/config/date",
        data: {
            packages: JSON.stringify({
                "method": "show"
            })
        },
        success: function (data) {
            //console.log(data);
            $('.content input').val(HandleTime(data.result.date));
        }
    });
    //显示sn
    $.ajax({
        "url":Ip + "/factory/sn/",
        "type": "POST",
        "data": {
            "packages": JSON.stringify({
                "method": "show"
            })
        },
        "success": function (data) {
            //console.log(data);
            $(".left .snInput").val(data.result.sn);
            $('.left .modelInput').val(data.result.type);
        }
    });

    //sn授权按钮
    $('.accredit').on('click', function () {
        if($('.modelInput').val().length == 8){
            $.ajax({
                "url": "/factory/sn/",
                "type": "POST",
                "timeout":3000,
                "data": {
                    "packages": JSON.stringify({
                        "method": "auth",
                        'type':$('.modelInput').val()
                    })
                },
                "success": function (data) {
                    //console.log(data);
                    if(data.result.sn != ""){
                        $('#tsingli').append('<div class="popout"><p>设备授权成功</p></div>');
                        $(".left .snInput").val(data.result.sn);
                        $(".left .modelInput").val(data.result.type);
                        setTimeout(function(){
                            $(".popout").remove();
                        },1000);
                    }
                },
                error:function(){
                    $('#tsingli').append('<div class="popout"><p>设备授权失败</p></div>');
                    $('.popout').css('backgroundImage','url(images/Warning.png)');
                    setTimeout(function(){
                        $(".popout").remove();
                    },1000);
                }
            });
        }else{
            $('.modelInput').val('').attr('placeholder','输入错误');
        }
        
    });
    
    //同步时间按钮
    $('.lockingtime').on('click', function () {
        var myDate = new Date();
        myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        myDate.getDate(); //获取当前日(1-31)
        myDate.getHours(); //获取当前小时数(0-23)
        myDate.getMinutes(); //获取当前分钟数(0-59)
        myDate.getSeconds(); //获取当前秒数(0-59)
        var timePackages = {
            "method": "set",
            "date": myDate.getFullYear() + '-' + parseInt(myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds()
        };
        $.ajax({
            type: "post",
            url: Ip + "/services/config/date",
            data: {
                packages: JSON.stringify(timePackages)
            },
            success: function (data) {
                //console.log(data);
                if (data.result.ERR == "") {
                    $.ajax({
                        type: "POST",
                        url: Ip+ "/services/config/date",
                        data: {
                            packages: JSON.stringify({
                                "method": "show"
                            })
                        },
                        success: function (data) {
                            //console.log(data);
                            $('.content input').val(HandleTime(data.result.date));
                        }
                    });
                }
            }
        });
    });
    //启动测试
    $('.start').on('mousedown', function () {
        $.ajax({
            type: "POST",
            url: Ip+ '/communication/control',
            data: {
                "cmd": JSON.stringify({
                    "type": 'digital',
                    "id": 86,
                    "value": true
                })
            },
            success: function (data) {
                //console.log(data);
            }
        });
    });
    $('.start').on('mouseup', function () {
        $.ajax({
            type: "POST",
            url: Ip + '/communication/control',
            data: {
                "cmd": JSON.stringify({
                    "type": 'digital',
                    "id": 86,
                    "value": false
                })
            },
            success: function (data) {
                //console.log(data);
            }
        });
    });
    //下载记录
    var downloadStr = {
        "串口A-232": "",
        "串口B-232": "",
        "串口C-232": "",
        "串口D-232": "",
        "串口D-422": "",
        "串口E-232": "",
        "串口E-422": "",
        "串口F-232": "",
        "串口F-422": "",
        "红外A": "",
        "红外B": "",
        "红外C": "",
        "红外D": "",
        "红外E": "",
        "红外F": "",
        "红外G": "",
        "红外H": "",
        "RY - I/O 1": "",
        "RY - I/O 2": "",
        "RY - I/O 3": "",
        "RY - I/O 4": "",
        "RY - I/O 5": "",
        "RY - I/O 6": "",
        "RY - I/O 7": "",
        "RY - I/O 8": ""
    };
    var downloadArr = [];
    var num = 0;
    $('.download').on('click', function () {
        $.ajax({
            type: "post",
            url:Ip+ "/communication/query",
            data: {},
            success: function (data) {
                //console.log(data);
                for (var key in data.MPV.Input) {
                    if (data.MPV.Input[key].SignalValue) {
                        downloadArr.push("通过");
                    } else {
                        downloadArr.push("不通过");
                    }
                }
                for (var i in downloadStr) {
                    downloadStr[i] = downloadArr[num];
                    num++
                }
                $('#downloadHistory').html(JSON.stringify(downloadStr));
                downloadArr.length = 0;
                SaveHistory();
            }
        });
    });

    function SaveHistory() { //保存前端工程文件
        var txtFileName = "history.txt"; //配置缺省保存工程文件名
        var oDiagram = document.getElementById("downloadHistory"); //读取selectable div内的内容
        var txtDiagram = oDiagram.innerHTML;
        var aFile = document.createElement("a");
        aFile.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(txtDiagram));
        aFile.setAttribute("download", txtFileName);
        aFile.style.display = "none";
        document.body.appendChild(aFile);
        aFile.click();
        document.body.removeChild(aFile);
        $("#downloadHistory").html('');
    }
    //usb功能
    $('.usb p').on("click", function () {
        $.ajax({
            type: "post",
            url: Ip+ "/factory/usb",
            data: {
                packages: JSON.stringify({
                    "method": "test"
                })
            },
            success: function (data) {
                //console.log(data);
                if (data.result) {
                    $('.usb p').css("background", "#52c04d");
                } else {
                    $(".usb p").css("background", "#c04d4d");
                }
            }
        });
    });
    //版本信息
    $('.versions').on("click", function () {
        $.ajax({
            type: "post",
            url:Ip+ "/factory/version",
            data: {
                packages: JSON.stringify({
                    "method": "show"
                })
            },
            success: function (data) {
                //console.log(data);
                $(".versionBox").find('ul').html("");
                $(".versionBox").css("display","block");
                for (var key in data.result.info) {
                    //console.log(data.result.info[key].name)
                    $('.versionBox ul').append('<li title= "' + data.result.info[key].version + '">' +
                        '<b>'+ data.result.info[key].name +'</b> : '+ data.result.info[key].version +
                        '</li>');
                }
                $('.closeVersion').on('click',function(){
                    $(".versionBox").css("display","none");
                    $(".versionBox").find('ul').html("");
                });
            }
        });
    });
    //时间处理函数
    function HandleTime(str){
        var getTime = str.split(' ')[1].split(':');
        if(getTime[0].length === 1){
            getTime[0] = '0' + getTime[0]
        }
        if(getTime[1].length === 1){
            getTime[1] = '0' + getTime[1]
        }
        if(getTime[2].length === 1){
            getTime[2] = '0' + getTime[2]
        }
        var date = str.split(' ')[0] + ' ' + getTime.join(':');
        return date
    }
})