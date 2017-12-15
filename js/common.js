/*
* 摄像头列表展现以及摄像头选择事件
* */
/*-----------------------------------------时间转换-------------------------------------*/
function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);
    return oTime;
}
function getzf(num) {
    if(parseInt(num)<10){
        num = '0' + num;
    }
    return num;
}
/*----------------------------------------添加弹窗---------------------------------------*/
function addPopUp(name,x,y,txt,fontColor,map){
    popup = new SuperMap.Popup(name,
        new SuperMap.LonLat(x,y),
        new SuperMap.Size(200,20),
        txt,
        false);
    popup.graphicZIndex=100;
    popup.closeOnMove = false;
    map.addPopup(popup);
    $('#'+name).css({
        'background':'rgba(0,0,0,0)',
        'color':fontColor
    });
}
/*----------------------------------------打开图片查看-----------------------------------*/
function picture(id) {
    closeMenuInfoWin();//关闭左键选中
    var settings = {
        "url": window.urlName + "/camera/pccamfblist",
        "method": "POST",
        "data":{
            mobile:mobile,
            token:token,
            camId:id,
        }
    };
    $.ajax(settings).done(function (response) {
        var rows = [];
        rows = response.data;
        console.log(rows);
        if(rows.length>0){
            if(rows[0].taskFeedBacks.length==0){
                win.alert('提示','没有图片信息，请核对');
                return;
            }
            var pics = rows[0].taskFeedBacks[0].pics;
            console.log(pics.length);
            //设置轮播图
            var contentHtml = "";
            for(var i=0; i<pics.length; i++){
                console.log(pics[i].url);
                contentHtml += '<li><a href="javascript:;" path="'+pics[i].url+'"></a></li>';
            }
            console.log(contentHtml);
            $("#pic-content ul").html(contentHtml);
            $('#cameradetailsWin').hide();
            startPics(pics.length);
            $('.picture').show();
        }else {
            win.alert('提示','没有图片信息，请核对');
        }
    });
}
/*----------------------------------------初始化图片--------------------------------------*/
function startPics(totalPics){
    $('#pic-content>em,#pic-content>dl').remove();
    //轮播图
    $("#pic-content").jcImgScroll({
        arrow : {
            width:45,
            height:400,
            x:0,
            y:0
        },
        width : 330, //设置图片宽度
        height:469, //设置图片高度
        imgtop:22,//每张图片的上下偏移量
        imgleft:-30,//每张图片的左边偏移量
        imgwidth:20,//每张图片的宽度偏移量
        imgheight:24,//每张图片的高度偏移量
        count : totalPics,
        offsetX : 0,
        NumBtn : true,
        title:false,
        setZoom:.8,
    });
}
/*----------------------------------------初始化手机用户-----------------------------------*/
var settings = {
    "url": window.urlName+"/user/getMobileUsers",
    "method": "POST",
    "data":{
        mobile:mobile,
        token:token,
        page:1
    }
}
$.ajax(settings).done(function (response) {
    var users = response.data.data;
    var options = "";
    for(var i=0; i<users.length; i++){
        var sex = users[i].sex=='M'?'男':'女';
        options += '<option value="'+users[i].Id+'">'+users[i].company+'-'+users[i].name+'['+sex+']'+'</option>';
    }
    $("#mobileUsers").html(options);
});
/*-------------------------------------------采集信息---------------------------------------*/
currenTask = {
    cam_id:-1,
    cam_name:-1,
    cam_addr:-1
}
function manage(cam_id,cam_name,cam_addr,cam_loc_lan,cam_loc_lon) {
	console.log(22222)
	selectFeature.deactivate();
    selectFeatureCar.deactivate();
    closeMenuInfoWin();//关闭左键选中
    currenTask.cam_id = cam_id;
    currenTask.cam_name = cam_name;
    currenTask.cam_addr = cam_addr;
    currenTask.cam_loc_lan = cam_loc_lan;
    currenTask.cam_loc_lon = cam_loc_lon;
    $("#camera_name").val(cam_name);
    $("#camera_addr").val(cam_addr);
    $('#message').show();
    $('#popwin').hide();
    $('#layerContainerShadowDiv').hide();
}
/*----------------------------------------------发送任务-------------------------------------*/
function sendManage() {
    var userID = $('#mobileUsers').val();
    var taskDescription = $('#meg-describe').val();
    console.log(userID, taskDescription);
    if(taskDescription.length<1){
        win.alert('提示','描述信息不能为空');
        return
    }
    if(currenTask.cam_id){
        var settings = {
            "url": urlName +"/task/publishTask",
            "method": "POST",
            "data":{
                mobile:mobile,
                token:token,
                cameraName:currenTask.cam_name,
                cameraLocation:currenTask.cam_addr,
                taskDescription:taskDescription,
                userId:userID,
                cameraId:currenTask.cam_id,
            }
        }
        $.ajax(settings).done(function (response) {
            if(response.code !=200){
                console.log(response.data.error)
                $('#message').fadeOut();
            }else {
                win.alert('提示','发布成功');
                $('#meg-describe').val('');
                $('#message').fadeOut();
            }
        });
    } else {
        win.alert('提示','系统错误，请重新发布任务');
    }
}
/*----------------------------------------关闭摄像头详细信息-----------------------------------*/
$('#cameradetailsWinclose').click(function() {
    $('#menuInfo').hide();
    $('#featureShadow').hide();
    $('#layer_list').hide();
    $('#cam_list').hide();
    $('#car_list').hide();
    $('#cameradetailsWin').css({'display':'none'});
});
/*--------------------------------------------视频可拖动---------------------------------------*/
$(function () {
    //创建小方块的jquery对象
    var $video = $("#video");
    //创建小方块的鼠标点按下事件
    $video.mousedown(function (event) {
        //获取鼠标按下的时候左侧偏移量和上侧偏移量
        var old_left = event.pageX;//左侧偏移量
        var old_top = event.pageY;//竖直偏移量

        //获取鼠标的位置
        var old_position_left = $(this).position().left;
        var old_position_top = $(this).position().top;

        //鼠标移动
        $(document).mousemove(function (event) {
            var new_left = event.pageX;//新的鼠标左侧偏移量
            var new_top = event.pageY;//新的鼠标竖直方向上的偏移量

            //计算发生改变的偏移量是多少
            var chang_x = new_left - old_left;
            var change_y = new_top - old_top;

            //计算出现在的位置是多少

            var new_position_left = old_position_left + chang_x;
            var new_position_top = old_position_top + change_y;
            //加上边界限制
            if(new_position_top<0){//当上边的偏移量小于0的时候，就是上边的临界点，就让新的位置为0
                new_position_top=0;
            }
            //如果向下的偏移量大于文档对象的高度减去自身的高度，就让它等于这个高度
            if(new_position_top>$(document).height()-$video.height()){
                new_position_top=$(document).height()-$video.height();
            }
            //右限制
            if(new_position_left>$(document).width()-$video.width()){
                new_position_left=$(document).width()-$video.width();
            }
            if(new_position_left<0){//左边的偏移量小于0的时候设置 左边的位置为0
                new_position_left=0;
            }

            $video.css({
                left: new_position_left + 'px',
                top: new_position_top + 'px'
            })
        });
        $video.mouseup(function(){
            $(document).off("mousemove");
        })
    });
});
/*--------------------------------------------视频播放、关闭---------------------------------------*/
function videoPlayClick(){
    $('#video').show();
    closeMenuInfoWin();//关闭左键选中
    vedio=document.getElementById("myVideo");
    //调用视频接口
    $("#myVideo").attr("src","http://211.103.178.205:8081/upload/car.mp4");//更新url

    console.log(vedio)
}
//关闭视频播放弹窗
$('#btnPause').click(function() {

    $('#video').hide();
    vedio.pause();
    //是否结束
});
/*----------------------------------------清空标记input中的值-----------------------------------*/
function remove() {
    if($('#search').val().length>0){
        $('#search').val('')
    }
}
/*------------------------------------------------tips展现--------------------------------------------*/
$(function () {
    $("[data-toggle='tooltip']").tooltip() ;
    $('.tooltip').css('left','-65px')
});
/*--------------------------------------------详细信息可拖动---------------------------------------*/
function dragDiv(nameId){
    //创建小方块的jquery对象
    var $nameId = $(nameId);
    //创建小方块的鼠标点按下事件
    $nameId.mousedown(function (event) {
        //获取鼠标按下的时候左侧偏移量和上侧偏移量
        var old_left = event.pageX;//左侧偏移量
        var old_top = event.pageY;//竖直偏移量

        //获取鼠标的位置
        var old_position_left = $(this).position().left;
        var old_position_top = $(this).position().top;

        //鼠标移动
        $(document).mousemove(function (event) {
            var new_left = event.pageX;//新的鼠标左侧偏移量
            var new_top = event.pageY;//新的鼠标竖直方向上的偏移量

            //计算发生改变的偏移量是多少
            var chang_x = new_left - old_left;
            var change_y = new_top - old_top;

            //计算出现在的位置是多少

            var new_position_left = old_position_left + chang_x;
            var new_position_top = old_position_top + change_y;
            //加上边界限制
            if(new_position_top<0){//当上边的偏移量小于0的时候，就是上边的临界点，就让新的位置为0
                new_position_top=0;
            }
            //如果向下的偏移量大于文档对象的高度减去自身的高度，就让它等于这个高度
            if(new_position_top>$(document).height()-$nameId.height()){
                new_position_top=$(document).height()-$nameId.height();
            }
            //右限制
            if(new_position_left>$(document).width()-$nameId.width()){
                new_position_left=$(document).width()-$nameId.width();
            }
            if(new_position_left<0){//左边的偏移量小于0的时候设置 左边的位置为0
                new_position_left=0;
            }

            $nameId.css({
                left: new_position_left + 'px',
                top: new_position_top + 'px'
            })
        });
        $nameId.mouseup(function(){
            $(document).off("mousemove");
        })
    });
};
