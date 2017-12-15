/**
 * 摄像头获取数据，悬浮框操作，点击弹出菜单框
 * */
/*------------------------------------------调用后台接口------------------------------------------------*/
///*----------------------------获取摄像头数据信息-----------------------------*/
//window.cameras = [];
//function getCameraInfo(page) {
//  if (!page) {
//      page = 1;
//  }
//  var i = 0;
//  var getData = {
//      "mobile": mobile,
//      "token": token,
//      "page": page,
//      "pageSize": 100
//
//  };
//  $.ajax({
//      url: window.urlName + "/camera/list",
//      type: 'POST',
//      data: getData,
//      async: true,
//      // success: function (data) {
//      //     if (data.code == 200) {
//      //         var data = data.data.rows;
//      //         addMulVector(data);
//      //         openCameraPanelAll(data);
//      //     } else if (data.code === 401) {
//      //         console.log(data.data.error);
//      //     } else if (data.code === 501) {
//      //         console.log(data.data.error);
//      //     } else if (data.code === 404) {
//      //         console.log(data.data.error);
//      //     } else if (data.code === 301) {
//      //         console.log(data.data.error);
//      //     } else if (data.code === 500) {
//      //         console.log(data.data.error);
//      //     }
//          success:function (data) {
//              if (data.code == 200) {
//                  var data = data.data.rows;
//                  if (data.length === 0) {
//                      addMulVector(window.cameras);
//                      openCameraPanelAll(window.cameras);
//                  } else {
//                      window.cameras = window.cameras.concat(data);
//                      getCameraInfo(parseInt(page) + 1);
//                  }
//              } else {
//                  console.log(data.data.error);
//              }
//          },
//          error: function (XMLHttpRequest, textStatus, errorThrown) {
//              console.log(XMLHttpRequest);
//              console.log(textStatus);
//              console.log(errorThrown);
//          }
//      });
//}
///*--------------------------根据摄像头id返回摄像头信息------------------------*/
//function selectCamInfoByID(id, callback) {
//  var getIdData = {
//      "mobile": mobile,
//      "token": token,
//      "cam_id": id
//  };
//  $.ajax({
//      url: window.urlName + "/camera/info",
//      type: 'POST',
//      data: getIdData,
//      async: false,
//      success: function (data) {
//          if (data.code == 200) {
//              cam_info = data.data.rows[0];
//              // if (cam_info.addtime) {
//              //     cam_info.addtime = getMyDate(parseFloat(cam_info.addtime))
//              // }
//              // if (cam_info.uptime) {
//              //     cam_info.uptime = getMyDate(parseFloat(cam_info.uptime))
//              // }
//              if (cam_info.cam_loc_lan) {
//                  cam_info.cam_loc_lan = parseFloat(cam_info.cam_loc_lan).toFixed(2)
//              }
//              if (cam_info.cam_loc_lon) {
//                  cam_info.cam_loc_lon = parseFloat(cam_info.cam_loc_lon).toFixed(2)
//              }
//              if (cam_info.cam_sta == 0) {
//                  cam_info.cam_sta = '未知'
//              } else if (cam_info.cam_sta == 1) {
//                  cam_info.cam_sta = '球型'
//              } else if (cam_info.cam_sta == 2) {
//                  cam_info.cam_sta = '半球型'
//              } else if (cam_info.cam_sta == 3) {
//                  cam_info.cam_sta = '固定枪机'
//              } else if (cam_info.cam_sta == 4) {
//                  cam_info.cam_sta = '遥控枪机'
//              } else if (cam_info.cam_sta == 5) {
//                  cam_info.cam_sta = '卡扣枪机'
//              }
//              callback(cam_info);
//          } else if (data.code === 401) {
//              console.log(data.data.error);
//          } else if (data.code === 501) {
//              console.log(data.data.error);
//          } else if (data.code === 404) {
//              console.log(data.data.error);
//          } else if (data.code === 301) {
//              console.log(data.data.error);
//          } else if (data.code === 500) {
//              console.log(data.data.error);
//          }
//      },
//      error: function (XMLHttpRequest, textStatus, errorThrown) {
//          console.log(XMLHttpRequest);
//          console.log(textStatus);
//          console.log(errorThrown);
//      }
//  });
//}
/*----------------------------获取摄像头数据信息-----------------------------*/
window.cameras = [];
function getCameraInfo(page) {
    /**
     * 添加缓存策略,一段时间内不从服务端获取数据
     * 缓存时间在config.js中配置
     * 缓存时间默认十分钟
     **/
     console.log(page);
     if(localStorage.getItem("cameraExpireTime") &&
        localStorage.getItem("cameraExpireTime")>=new Date().getTime() &&
        localStorage.getItem("cameras")){
        window.cameras = JSON.parse(localStorage.getItem("cameras"));
        addMulVector(JSON.parse(localStorage.getItem("cameras")));
        openCameraPanelAll(JSON.parse(localStorage.getItem("cameras")));
        console.log("use cameras in localStorage");
        return;
    }
    //如果没有传则默认1
    if (!page) {
        page = 1;
    }
    var i = 0;
    var getData = {
        "mobile": mobile,
        "token": token,
        "page": page,
        "pageSize": 100

    };
    $.ajax({
        url: window.urlName + "/camera/list",
        type: 'POST',
        data: getData,
        success:function (data) {
            if (data.code == 200) {
                var data = data.data.rows;
                if (data.length === 0) {
                    addMulVector(window.cameras);
                    openCameraPanelAll(window.cameras);
                    //配置缓存
                    localStorage.setItem("camerasAllList",JSON.stringify(window.cameras));
                    localStorage.setItem("cameraExpireTime",new Date().getTime()+window.cameraCacheTime);
                } else {
                    window.cameras = window.cameras.concat(data);
                    getCameraInfo(parseInt(page) + 1);
                }
            } else {
                console.log(data.data.error);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
/*--------------------------根据摄像头id返回摄像头信息------------------------*/
function selectCamInfoByID(id, callback) {
    var cam_sta = ['未知','球型','半球型','固定枪机','遥控枪机','卡扣枪机'];
    for(var i=0 ; i<window.cameras.length; i++){
        if(window.cameras[i].cam_id == id){
        	if(!isNaN(window.cameras[i].cam_sta )){
        		window.cameras[i].cam_sta = cam_sta[window.cameras[i].cam_sta];
        	}
            cam_info=window.cameras[i];
            callback(window.cameras[i]);
            console.log("use window.cameras");
            return;
        }
    }
    var getIdData = {
        "mobile": mobile,
        "token": token,
        "cam_id": id
    };
    $.ajax({
        url: window.urlName + "/camera/info",
        type: 'POST',
        data: getIdData,
        async: false,
        success: function (data) {
            if (data.code == 200) {
                cam_info = data.data.rows[0];
                cam_info.cam_sta = cam_sta[cam_info.cam_sta];
                callback(cam_info);
            } else {
                console.log(data.data.error);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}
/*------------------------------获取摄像头属性-------------------------------*/
function getCameraAttr() {
    //    初始化属性
    var settings = {
        "url": window.urlName + "/camera/getCameraAttrs",
        "method": "POST",
        "data": {
            mobile: mobile,
            token: token,
            type: -1
        }
    }
    $.ajax(settings).done(function (response) {
        if (response.code == 200) {
            camera_setting = response.data.rows;
        } else {
            console.log(response.data.error);
        }

    });
}
/* -------------------------------------添加摄像头矢量图层-------------------------------------------*/
/*----------------------------添加多个矢量点-----------------------------*/
function addMulVector(data) {
    //点特征数组
    var point_features = [];
    for (var i = 0; i < data.length; i++) {
        //声明几何图形点
        var point = new SuperMap.Geometry.Point(data[i].cam_loc_lan, data[i].cam_loc_lon);
        //声明矢量特征
        var feature = new SuperMap.Feature.Vector(point);
        //点特征样式
        feature.style = {
            fillColor: "transparent",//内填充
            strokeColor: "transparent",//外边线
            pointRadius: 11,//不同图层半径不同按参数r传递
            graphicZIndex: data[i].cam_id,
            dataName: data[i].cam_name,
            dataAddr: data[i].cam_addr,
            graphicOpacity: 0
        };
        //添加点特征到点特征数组
        point_features.push(feature);
    }
    //矢量图层添加一组点特征数组
    vectors.addFeatures(point_features);
}
/*------------------------------------------左键菜单弹框--------------------------------------------*/
/*----------------------点击矢量要素覆盖物，调用此函数---------------------*/
function onFeatureSelected(feature) {
    if (flag == true) {
        return false;
    }
     flag = true;
    var cam_id = feature.style.graphicZIndex;
    var cam_name = feature.style.dataName;
    var cam_addr = feature.style.dataAddr;
    var popup = new SuperMap.Popup(
        "menuInfo",
        new SuperMap.LonLat(feature.geometry.x, feature.geometry.y),
        new SuperMap.Size(125, 140),
        "<div style='width: 20px;height: 20px;background: rgba(255,255,255,.9);margin-top: 20px;margin-left: -30px;transform: rotate(45deg);border-bottom: 1px solid#999;border-left: 1px solid #999'></div>" +
        "<div style='position: relative;top:-35px'><li id='zjs' onclick='picture(" + feature.style.graphicZIndex + ");'  style='color: #333333;font-size: 14px;margin:10px 5px 10px 5px;border-bottom:1px solid #bbb;'><p style='display: inline-block; '>图片查看</p></li>" +
        "<li id='videoplay' onclick='videoPlayClick()' style='color: #333333;font-size: 14px;margin:10px 5px 10px 5px;border-bottom:1px solid #bbb;'><p style='display: inline-block; '>视频查看</p></li>" +
        "<li id='detailinfo' style='color: #333333;font-size: 14px;margin:10px 5px 10px 5px;border-bottom:1px solid #bbb;'><p style='display: inline-block; '>详细信息</p></li>" +
        "<li id='scs' onclick='manage("
        + cam_id +
        ",\"" + cam_name + "\",\"" + cam_addr + "\")' style='color: #333333;font-size: 14px;margin:10px 5px 10px 5px;'><p style='display: inline-block; '>任务下发</p></li></div>",
        null,
        true);
    map.setCenter(new SuperMap.LonLat(feature.geometry.x, feature.geometry.y), map.getZoom());
    //添加弹窗到map图层
    //popup.autoSize = true;
    map.addPopup(popup);
    //修改菜单样式注意必须等popup实例化后
    $('#menuInfo').css({
        'display': 'block',
        'left': parseInt($('#menuInfo').css('left')) + 36 + "px",
        'top': parseInt($('#menuInfo').css('top')) - 36 + "px",
        'width': '105px',
        'height': '185px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px rgba(0,0,0,.3)',
        'background': 'rgba(255,255,255,.9)',
        'cursor': ' pointer'
    });
    $('#menuInfo_contentDiv').css({
        'width': '100%',
        'height': '100%'
    });
    menuInfoWin = popup;
    pointClick();
    //根据摄像头ID后台获取摄像头信息
    //selectCamInfoByID(feature.style.graphicZIndex);
    //摄像头详细信息点击事件
    $('#detailinfo').click(function () {
        $('#cameradetailsWin').css({'display': 'block'});
        closeMenuInfoWin();//关闭左键选中
        $('#cam-list').hide();
        $('#car-list').hide();
        $('#layer-list').hide();
        // $('#cardetailsWin').hide();
        //添加特定摄像头详细信息
        var contentHtml = "";
        for (var i = 0; i < camera_setting.length; i++) {
            if (camera_setting[i].attr_show_2) {
                contentHtml += "<li id='gz' style='line-height: 15px;color: #333333;font-size: 14px;padding:10px 5px 5px;'>" +
                    "<span style='display: inline-block;width: 45%;vertical-align: top'>" + camera_setting[i].attr_desc + "：" + "</span>" +
                    "<span style='display: inline-block;width: 55%'>" + cam_info[camera_setting[i].attr_name] + "</span></li>"

            }
        }
        $('#detailscontent').html(contentHtml);

    });

}
/*--------------------------------------------详细信息可拖动---------------------------------------*/
$(function () {
    //创建小方块的jquery对象
    var $cameradetailsWin = $("#cameradetailsWin");
    //创建小方块的鼠标点按下事件
    $cameradetailsWin.mousedown(function (event) {
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
            if(new_position_top>$(document).height()-$cameradetailsWin.height()){
                new_position_top=$(document).height()-$cameradetailsWin.height();
            }
            //右限制
            if(new_position_left>$(document).width()-$cameradetailsWin.width()){
                new_position_left=$(document).width()-$cameradetailsWin.width();
            }
            if(new_position_left<0){//左边的偏移量小于0的时候设置 左边的位置为0
                new_position_left=0;
            }

            $cameradetailsWin.css({
                left: new_position_left + 'px',
                top: new_position_top + 'px'
            })
        });
        $cameradetailsWin.mouseup(function(){
            $(document).off("mousemove");
        })
    });
});
/*--------------------------摄像头点选高亮事件--------------------------*/
var pointPops = [];
var popNum = [];
function pointClick(feature) {
    var pointSha;
    var pointShaId;
    if (flag == false) {
        //判断0显示1消除
        if (feature.style.graphicOpacity == 0) {
            pointSha = parseInt(feature.style.graphicZIndex);
            popNum.push(pointSha);
            pointShaId = "#" + pointSha;
            pointPops[pointSha] = new SuperMap.Popup(
                pointSha,
                new SuperMap.LonLat(feature.geometry.x, feature.geometry.y),
                new SuperMap.Size(15, 15),
                null,
                null,
                true);
            pointPops[pointSha].autoSize = true;
            map.addPopup(pointPops[pointSha]);
            $(pointShaId).css({
                'left': parseInt($(pointShaId).css('left')) - 20 + "px",
                'top': parseInt($(pointShaId).css('top')) - 20 + "px",
                'box-shadow': '2px 2px 12px #AFEEEE',
                'width': '50px',
                'height': '50px',
                'border-radius': '50%',
                'background': '#fff',
                'opacity': '.2',
                'z-index': '340'
            });
            feature.style.graphicOpacity = 1;
        }
        else {
            feature.style.graphicOpacity = 0;
            pointPops[feature.style.graphicZIndex].hide();
            pointPops[feature.style.graphicZIndex].destroy();
        }
    }
}
/*--------------------------定义关闭Menu点击事件--------------------------*/
function closeMenuInfoWin() {
    if (flag) {
        flag = false;
        menuInfoWin.hide();
        menuInfoWin.destroy();
        featureShadow.hide();
        featureShadow.destroy();
    }
}
/*---------------------------------------鼠标悬停弹出Tabs-------------------------------------------*/
/*----------------鼠标悬停弹出Tabs popup，调用此函数。------------------*/
function onFeatureHovered(feature) {
	console.log('mmmmmm')
    //根据摄像头ID后台获取摄像头信息
    selectCamInfoByID(feature.style.graphicZIndex, function (cam_info) {
        var contentHtml = "";
        contentHtml += "<div style='width: 20px;height: 20px;background: rgba(255,255,255,.9);position: relative;top: 20px;left:-30px;transform: rotate(45deg);border-bottom: 1px solid #999;border-left: 1px solid #999'></div>"
        for (var i = 0; i < camera_setting.length; i++) {
            if (camera_setting[i].attr_show_1) {
                contentHtml += "<li id='gz' style='line-height: 13px;color: #333333;font-size: 12px;padding:5px;'>" +
                    "<span style='display: inline-block;width: 30%;vertical-align: top'>" + camera_setting[i].attr_desc + "：" + "</span>" +
                    "<span style='display: inline-block;width: 70%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap'>" + cam_info[camera_setting[i].attr_name] + "</span></li>"
            }
        }
        var popup1 = new SuperMap.Popup(
            "tabsInfo",
            new SuperMap.LonLat(feature.geometry.x, feature.geometry.y),
            new SuperMap.Size(295, 100),
            contentHtml,
            null,
            false);
        popup1.autoSize = true;
        tabsInfoWin = popup1;
        //添加弹窗map图层
        map.addPopup(popup1);
        $('#tabsInfo').css({
            'left': parseInt($('#tabsInfo').css('left')) + 36 + "px",
            'top': parseInt($('#tabsInfo').css('top')) - 36 + "px",
            'width': '280px',
            'height': '',
            'border': '1px solid #999',
            'box-shadow': '2px 2px 12px #999',
            'background': 'rgba(255,255,255,.9)',
        });
        $('#tabsInfo_contentDiv').css({
            'width': '100%',
            'height': '100%',
            'margin-bottom': '20px'
        });
        console.log(flag);
        if (flag == true) {
            tabsInfoWin.hide();
        } else {
            addPopUpCircle('featureShadow', feature.geometry.x, feature.geometry.y, map, 'rgba(20,88,167,.3)', '50', '50', 25, 25);
        }
    });
}
/*----------------点击摄像头列表Tabs popup，调用此函数。------------------*/
function onFeatureHovered1(feature) {
    //根据摄像头ID后台获取摄像头信息
    //selectCamInfoByID(feature.style.graphicZIndex);
    var contentHtml = "";
    contentHtml += "<div style='width: 20px;height: 20px;background: rgba(255,255,255,.9);position: relative;top: 20px;left:-30px;transform: rotate(45deg);border-bottom: 1px solid#999;border-left: 1px solid #999'></div>"
    for (var i = 0; i < camera_setting.length; i++) {
        if (camera_setting[i].attr_show_1) {
            contentHtml += "<li id='gz' style='line-height: 13px;color: #333333;font-size: 12px;padding:5px;'>" +
                "<span style='display: inline-block;width: 30%;vertical-align: top'>" + camera_setting[i].attr_desc + "：" + "</span>" +
                "<span style='display: inline-block;width: 60%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap'>" + cam_info[camera_setting[i].attr_name] + "</span></li>"
        }
    }
    var popup1 = new SuperMap.Popup(
        "tabsInfo1",
        new SuperMap.LonLat(feature.geometry.x, feature.geometry.y),
        new SuperMap.Size(295, 140),
        contentHtml,
        null,
        true);
    popup1.autoSize = true;
    tabsInfoWin = popup1;
    //添加弹窗map图层
    map.addPopup(popup1);
    $('#tabsInfo1').css({
        'left': parseInt($('#tabsInfo1').css('left')) + 36 + "px",
        'top': parseInt($('#tabsInfo1').css('top')) - 36 + "px",
        'width': '280px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px #999',
        'background': 'rgba(255,255,255,.9)',
    });
    $('#tabsInfo1_contentDiv').css({
        'width': '100%',
        'height': '100%'
    });
    if (flag == true) {
        tabsInfoWin.hide();
    } else {
        addPopUpCircle('featureShadow1', feature.geometry.x, feature.geometry.y, map, 'rgba(20,88,167,.3)', '50', '50', 25, 25);
    }
}
/*---------------------------------定义悬浮框关闭事件--------------------------------*/
function closeTabsInfoWin() {
    console.log(111111111);
    if (tabsInfoWin) {
        tabsInfoWin.hide();
        tabsInfoWin.destroy();
    }
    if (flag == false) {
        featureShadow.hide();
        featureShadow.destroy();
    }
}
/*-------------------------------------打开摄像头列表-------------------------------------*/
function openCameraPanel(cameras) {
    saveData('camerasList', cameras);
    var config = Array();
    var total = {
        text: '全部',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: true},
        selectable: true,
        nodes: Array()
    };//全部
    var ball = {
        text: '球机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//球机
    var hemisphere = {
        text: '半球',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//半球
    var fixed = {
        text: '固定枪机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//固定枪机
    var remote = {
        text: '遥控枪机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//遥控枪机
    var snap = {
        text: '卡扣枪机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//卡扣枪机
    var unKnow = {
        text: '未知',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//未知
    cam_selectId = [];
    for (var i = 0; i < cameras.length; i++) {
        var temp = {};
        temp.text = "名称:" + cameras[i].cam_name;
        temp.href = "javascript:cameraSelected('" + JSON.stringify(cameras[i]) + "');";
        // temp.tags = JSON.stringify(cameras[i]);
        addPopUpCircle('cam' + cameras[i].cam_id,
            cameras[i].cam_loc_lan,
            cameras[i].cam_loc_lon, map, 'rgba(20,88,167,.3)', '30', '30', 15, 15);
        total.nodes.push(temp);
        cam_selectId.push('cam' + cameras[i].cam_id);
        if (cameras[i].cam_sta == 1) {
            ball.nodes.push(temp);
        } else if (cameras[i].cam_sta == 2) {
            hemisphere.nodes.push(temp);
        } else if (cameras[i].cam_sta == 3) {
            fixed.nodes.push(temp);
        } else if (cameras[i].cam_sta == 4) {
            remote.nodes.push(temp);
        } else if (cameras[i].cam_sta == 5) {
            snap.nodes.push(temp);
        } else if (cameras[i].cam_sta == 0) {
            unKnow.nodes.push(temp);
        }
    }
    config.push(total);
    config.push(ball);
    config.push(hemisphere);
    config.push(fixed);
    config.push(remote);
    config.push(snap);
    config.push(unKnow);

    $('#cam_list').show();
    if ($('#cam_list').css('display') == 'none') {
        $('.carList').css({'top': '28%', 'z-index': '2'})
        $('#car_list').css({'top': '30%', 'z-index': '1'})
    } else {
        $('.carList').css({'top': '57%', 'z-index': '2'})
        $('#car_list').css({'top': '60%', 'z-index': '1'})
    }
    $('#treeviewCam').treeview({
        color: "#428bca",
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',
        data: config,
        enableLinks: true,
        highlightSelected: true,
    });
}
/*-------------------------------------通过属性搜索选中摄像头列表-------------------------------------*/
function openCameraPanelSelect(cameras) {
	map.removeAllPopup();
    saveData('camerasList', cameras);
    var config = Array();
    var total = {
        text: '查询结果',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: true},
        selectable: true,
        nodes: Array()
    };
    cam_selectId = [];
    for (var i = 0; i < cameras.length; i++) {
        var temp = {};
        temp.text = "名称:" + cameras[i].cam_name;
        temp.href = "javascript:cameraSelected('" + JSON.stringify(cameras[i]) + "');";
        // temp.tags = JSON.stringify(cameras[i]);
        addPopUpCircle('cam' + cameras[i].cam_id,
            cameras[i].cam_loc_lan,
            cameras[i].cam_loc_lon, map, 'rgba(20,88,167,.3)', '30', '30', 15, 15);
        total.nodes.push(temp);
        cam_selectId.push('cam' + cameras[i].cam_id);
    }
    config.push(total);

    $('#cam_list').show();
    if ($('#cam_list').css('display') == 'none') {
        $('.carList').css({'top': '28%', 'z-index': '2'})
        $('#car_list').css({'top': '30%', 'z-index': '1'})
    } else {
        $('.carList').css({'top': '57%', 'z-index': '2'})
        $('#car_list').css({'top': '60%', 'z-index': '1'})
    }
    $('#treeviewCam').treeview({
        color: "#428bca",
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',
        data: config,
        enableLinks: true,
        highlightSelected: true
    });
}
/*-------------------------------------初始化摄像头列表-----------------------------------*/
function openCameraPanelAll(cameras) {
    saveData('camerasAllList', cameras);
    var config = Array();
    var total = {
        text: '全部',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: true},
        selectable: true,
        nodes: Array()
    };//全部
    var ball = {
        text: '球机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//球机
    var hemisphere = {
        text: '半球',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//半球
    var fixed = {
        text: '固定枪机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//固定枪机
    var remote = {
        text: '遥控枪机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//遥控枪机
    var snap = {
        text: '卡扣枪机',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//卡扣枪机
    var unKnow = {
        text: '未知',
        href: 'javascript:;',
        tags: cameras.length,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//未知
    for (var i = 0; i < cameras.length; i++) {
        var temp = {};
        temp.text = "名称:" + cameras[i].cam_name;
        temp.href = "javascript:cameraSelected('" + JSON.stringify(cameras[i]) + "');";
        total.nodes.push(temp);
        if (cameras[i].cam_sta == 1) {
            ball.nodes.push(temp);
        } else if (cameras[i].cam_sta == 2) {
            hemisphere.nodes.push(temp);
        } else if (cameras[i].cam_sta == 3) {
            fixed.nodes.push(temp);
        } else if (cameras[i].cam_sta == 4) {
            remote.nodes.push(temp);
        } else if (cameras[i].cam_sta == 5) {
            snap.nodes.push(temp);
        } else if (cameras[i].cam_sta == 0) {
            unKnow.nodes.push(temp);
        }
    }
    config.push(total);
    config.push(ball);
    config.push(hemisphere);
    config.push(fixed);
    config.push(remote);
    config.push(snap);
    config.push(unKnow);

    if ($('#cam_list').css('display') == 'none') {
        $('.carList').css({'top': '28%', 'z-index': '2'})
        $('#car_list').css({'top': '30%', 'z-index': '1'})
    } else {
        $('.carList').css({'top': '57%', 'z-index': '2'})
        $('#car_list').css({'top': '60%', 'z-index': '1'})
    }
    $('#treeviewCam').treeview({
        color: "#428bca",
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',
        data: config,
        enableLinks: true,
        highlightSelected: true
    });
}
/*-------------------------------------关闭摄像头列表-----------------------------------*/
function closeCameraPanel() {
	return;
    var config = Array();
    var total = {
        text: '全部',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//全部
    var ball = {
        text: '球机',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//球机
    var hemisphere = {
        text: '半球',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//半球
    var fixed = {
        text: '固定枪机',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//固定枪机
    var remote = {
        text: '遥控枪机',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//遥控枪机
    var snap = {
        text: '卡扣枪机',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//卡扣枪机
    var unKnow = {
        text: '未知',
        href: 'javascript:;',
        tags: 0,
        state: {expanded: false},
        selectable: true,
        nodes: Array()
    };//未知
    config.push(total);
    config.push(ball);
    config.push(hemisphere);
    config.push(fixed);
    config.push(remote);
    config.push(snap);
    config.push(unKnow);
    $('#cam_list').show();
    $('#car_list').hide();
    if ($('#cam_list').css('display') == 'none') {
        $('.carList').css({'top': '28%', 'z-index': '2'})
        $('#car_list').css({'top': '30%', 'z-index': '1'})
    } else {
        $('.carList').css({'top': '57%', 'z-index': '2'})
        $('#car_list').css({'top': '60%', 'z-index': '1'})
    }
    $('#treeviewCam').treeview({
        color: "#428bca",
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',
        data: config,
        enableLinks: true,
        highlightSelected: true,
    });
}
/*-------------------------------------添加圆的弹窗---------------------------------------*/
function addPopUpCircle(name, x, y, map, backgroundColor, width, height, left, top) {
    var popup2 = new SuperMap.Popup(
        name,
        new SuperMap.LonLat(x, y),
        new SuperMap.Size(15, 15),
        null,
        null,
        true);
    popup2.autoSize = false;
    featureShadow = popup2;
    map.addPopup(popup2);
    $('#' + name).css({
        'left': parseInt($('#' + name).css('left')) - left + "px",
        'top': parseInt($('#' + name).css('top')) - top + "px",
        'box-shadow': '2px 2px 12px #fff',
        'width': width + 'px',
        'height': height + 'px',
        'border-radius': '50%',
        'background': backgroundColor,
        'z-index': '340'
    });
}
/*-------------------------------------添加圆的弹窗---------------------------------------*/
function addPopUpCircleN(name, x, y, map, backgroundColor, width, height, left, top) {
    var popup2 = new SuperMap.Popup(
        name,
        new SuperMap.LonLat(x, y),
        new SuperMap.Size(15, 15),
        null,
        null,
        true);
    popup2.autoSize = false;
    featureShadowCar = popup2;
    map.addPopup(popup2);
    $('#' + name).css({
        'left': parseInt($('#' + name).css('left')) - left + "px",
        'top': parseInt($('#' + name).css('top')) - top + "px",
        'box-shadow': '2px 2px 12px #fff',
        'width': width + 'px',
        'height': height + 'px',
        'border-radius': '50%',
        'background': backgroundColor,
        'z-index': '340'
    });
}
/*-------------------------------------摄像头高亮----------------------------------------*/
function cameraHighlight(name, x, y, map) {
    if (tabsInfoWin && tabsInfoWin.hide) {
        tabsInfoWin.hide();
        try {
            if (typeof(tabsInfoWin.destroy) == "function") {
                tabsInfoWin.destroy();
            }
        } catch (e) {
            console.log("destroy is not a function");
        }

    }
    if (featureShadow && featureShadow.hide) {
        featureShadow.hide();
        try {
            if (typeof(featureShadow.destroy) == "function") {
                featureShadow.destroy();
            }
        } catch (e) {
            console.log("destroy is not a function");
        }
    }
    popup2 = new SuperMap.Popup(
        name,
        new SuperMap.LonLat(x, y),
        new SuperMap.Size(15, 15),
        null,
        null,
        true);
    featureShadow = popup2;
    map.addPopup(popup2);
    $('#' + name).css({
        'left': parseInt($('#' + name).css('left')) - 15 + "px",
        'top': parseInt($('#' + name).css('top')) - 15 + "px",
        'width': '30px',
        'height': '30px',
        'border-radius': '50%',
        'background': '#ff0000',
        'opacity': '.4',
        'z-index': '340'
    });

}
/*------------------------------------摄像头选择事件-------------------------------------*/
function cameraSelected(camera) {
    camera = JSON.parse(camera);
    //清除弹窗
    // map.removeAllPopup();
    selectFeature.deactivate();
    selectFeatureCar.deactivate();
    $('#Polygon1').remove();
    $('#cejuPopup').remove();
    $('#huzhiPopup').remove();
    $('#Polygon').remove();
    $('#circlePopup1').remove();
    $('#box').remove();
    cleanLayers();
    $('#cameraSelected').remove();
    cameraHighlight('cameraSelected', camera.cam_loc_lan, camera.cam_loc_lon, map);
    cam_info = camera;
    var feature = {};
    feature.style = {};
    feature.style.graphicZIndex = camera.cam_id;
    feature.style.dataName = camera.cam_name;
    feature.style.dataAddr = camera.cam_addr;
    feature.geometry = {};
    feature.geometry.x = camera.cam_loc_lan;
    feature.geometry.y = camera.cam_loc_lon;
    onFeatureHovered1(feature);
    map.setCenter(new SuperMap.LonLat(camera.cam_loc_lan, camera.cam_loc_lon), map.getZoom());
}
/*--------------------------------------定义摄像头设置属性---------------------------------*/
//passionZhang  icon下来图标触发此事件
function openCamSettings() {
    console.log(camera_setting);
    var contentHtml = '';
    for (var i = 0; i < camera_setting.length; i++) {
        if (camera_setting[i].attr_show_2) {
            contentHtml += "<li><a href='javascript:;' onclick='searchSelect(" +
                "\"" + camera_setting[i].attr_desc + "\"" +
                ",\"" + camera_setting[i].attr_name + "\")'>" + camera_setting[i].attr_desc + "</a></li>"
        }
    }
    $('#menuCamSearch').html(contentHtml);
}
/*------------------------------------------------搜索摄像头属性---------------------------------------*/
function searchSelect(name, val) {
    $("#searchCamSelect").attr('placeholder', name)
    $("#searchCamSelect").attr('name', val)
}
function camSearchSettings() {
    deleteData('camerasList');
    if ($("#searchCamSelect").val() == "") {
        win.alert('提示', '搜索内容不能为空');
        return
    }
    if(!$("#searchCamSelect").attr('name')){
    	win.alert('提示', '请先选择摄像头属性');
    	$("#searchCamSelect").val('');
    	return
    }
    var attrName = $("#searchCamSelect").attr('name');
    console.log(attrName)
    var attrValue = $("#searchCamSelect").val();
    var settings = {
        "url": urlName + "/camera/pclistbyattr",
        "method": "POST",
        "data": {
            mobile: mobile,
            token: token,
            attrName: attrName,
            attrValue: attrValue,
            page: -1,
            pageSize: 10
        }
    };
    $.ajax(settings).done(function (response) {
    	console.log(response)
        if (response.code == 200) {
            console.log(response.data.rows);
            $("#searchCamSelect").val('');
            openCameraPanelSelect(response.data.rows)
        } else if (response.code === 401) {
            console.log(response.data.error);
        } else if (response.code === 501) {
            console.log(response.data.error);
        } else if (response.code === 500) {
            console.log(response.data.error);
        }
    });
}
/*---------------------------------------------导出摄像头--------------------------------------------*/
//打开摄像头导出列表
function excel() {
    $('.cam_td').remove();
    selectExcel();
    $('#excelDiv').show();
}
//点击关闭摄像头导出列表
function excelOff() {
    $('#excelDiv').hide();
}
//点击导出列表显示内容
function excelOut() {
    $('#excelDiv').hide();
    $("#sxtlb_tab").table2excel({
        exclude: ".noExl",
        filename: "camList.xls",
        name: "camList.xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
    $('.cam_td').remove();
}
//查询出的结果，重构表格
function selectExcel() {
    var Data = {};
    var html = '<tr id="sxt_tr"></tr>';
    Data.mobile = readData('USER_KEY').mobile;
    Data.token = readData('USER_KEY').token;
    Data.type = -1
    $.ajax({
        url: window.urlName + '/camera/getCameraAttrs',
        type: 'POST',
        data: Data,
        async: false,
        success: function (data) {
            var date1 = data.data.rows;
            //add By KingDragon
            window.camera_attrs = date1;
            for (var i = 1; i < date1.length; i++) {
                html += "<td class='cam_td'>" + date1[i].attr_desc + "</td>"
            }
            $('#sxtHead').html(html)
            var html = '';
            var html1 = '';
            var cameraList;
            //进行判断是否是全部列表
            if (readData('camerasList').length > 0) {
                cameraList = readData('camerasList');
            } else {
                cameraList = readData('camerasAllList');
            }
            for (var j = 0; j < cameraList.length; j++) {
                html1 += "<tr class='cam_td'>"
                var attrname = cameraList[j]
                for (key in attrname) {
                    for (var i = 1; i < date1.length; i++) {
                        html1 += "<td>" + attrname[date1[i].attr_name] + "</td>"
                    }
                    break
                }
                html1 += "</tr>"
            }
            $('#sxtlb_tab').append(html + html1)
        },
        error: function (data) {
            console.log(data);
        }
    });
}