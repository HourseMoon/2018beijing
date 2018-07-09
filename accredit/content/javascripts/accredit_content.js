$(function () {
    $.ajax({
        url: 'http://192.168.0.96:3000/record',
        type: 'post',
        data: {
            packages:JSON.stringify({
                'method':'show'
            })
        },
        success: function (data) {
            console.log(data);
            if(data.result.info.length > 15){
                $('#title_list').css('width','99%');
            }
            for(var i = 0; i < data.result.info.length; i++){
                if(data.result.info[i].TYPE == undefined){
                    var _type = '<li><div class="contentTop"><p>' + parseInt(i + 1) + '</p><p></p><p>' + data.result.info[i]["CPU ID"] + '</p><p>' + data.result.info[i].SN + '</p><p>' + data.result.info[i].date + '</p></div></li>';
                }else{
                    var _type = '<li><div class="contentTop"><p>' + parseInt(i + 1) + '</p><p>' + data.result.info[i].TYPE + '</p><p>' + data.result.info[i]["CPU ID"] + '</p><p>' + data.result.info[i].SN + '</p><p>' + data.result.info[i].date + '</p></div></li>';
                }
                $("#content ul").append(_type);
            }
        }
    });
    $("#exportBtn").on("click",function(){
        $.ajax({
            url:"http://192.168.0.96:3000/record",
            type:"post",
            data:{
                packages:JSON.stringify({
                    "method":"create"
                })
            },
            success:function(data){
                console.log(data);
                if(data.result){
                    $("#exportBox").css("display","block");
                }
            }
        });
    });
    $("#no").on("click",function(){
        $("#exportBox").css("display","none");
    });
    $("#yes").on("click",function(){
        window.location.href = "http://192.168.0.96:3000/record/download";
        $("#exportBox").css("display","none");
    });
})

