/*
©2017-2018 Beijing Tsingli Technology Co., Ltd. All Rights Reserved.
©2017-2018 北京清立科技有限公司。保留所有权利。

文件名称: board.js
功能: 显示集成板卡信息
作者: 马跃

版本说明: V1.0.0
修改描述:
*/
$(function () {
    //判断是本地主机还是远程云平台
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
            if(data.result.type === 'local'){//本地
                $('.home').attr('href','/home');
                //$('.cn_en').css('display','none');
            }else if(data.result.type === 'remote'){//远程
                $('.home').attr('href','/');
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
            'home': ['首页', 'Home'],
            'title1': ['自由设定功能组合','Functions Customizable'],
            'title2': ['专享原创风格设计','Innovative Features'],
            'title3': ['定制私有通讯协议','Private Protocol'],
            'title4': ['可选任意硬件平台','Hardware Independent'],
            'title5': ['———————&nbsp;&nbsp;&nbsp;&nbsp;跨平台跨网域跨行业&nbsp;&nbsp;&nbsp;&nbsp;———————', '———————&nbsp;&nbsp;&nbsp;&nbsp;Cross Platform and Industry&nbsp;&nbsp;&nbsp;&nbsp;———————'],
            'title6': ['第五代智能控制集成板卡ODM设计开发','Control Card ODM'],
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
            'background': '#000',
            'color': '#fff'
        });
    }
});