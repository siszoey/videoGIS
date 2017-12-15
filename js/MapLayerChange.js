/*
* 调用地图，进行地图操作以及摄像头的操作
* */
/*--------------------------------------------初始化地图---------------------------------------------*/
//定义全局变量
var map,
    layerMap,
    layerCamera,
    layerCar,
    layerCameraPhoto,
    layerCarPhoto,
    photoMap,
    vectors,
    vectorsCar,
    menuInfoWin = null,
    tabsInfoWin = null,
    featureShadow = null,
    featureShadow1 = null,
    menuInfoWinCar = null,
    tabsInfoWinCar = null,
    featureShadowCar = null,
    flag = false,
    isCar = false,
    cam_info = {},
    car_info = {},
    jb = 3,
    drawLine,
    lineLayer,
    drawLayer1,
    drowLayer,
    drawCricle,
    drawPolygon,
    pointLayer,
    lineLayer1,
    resultLayer,
    drawLine1,
    drowLayer1,
    markers,
    imgMarker,
    markers1,
    a, b, c, d, e, f, bt = false,
    camera_setting,
    car_setting,
    vectorLayer,
    vectorLayer1,
    vectorSearch,
    lineVector1,
    cam_selectId = [],
    car_selectId = [],
    hcLength = 0,
    bt = false;

var obj = readData('USER_KEY');
var token = obj.token;
var mobile = obj.mobile;
$("#name").text(obj.name);

/*
* 关于地图图层切换逻辑
* 现有图层包括摄像头图层、车辆图层、电子地图、影像地图、矢量绘制图层等
* 各个图层层级大小以addlayer后在图层数组中大小
* 摄像头车辆图层相关获取数据操作不冲突
* 图层隐藏显示，以及矢量选择状态激活与不激活
* */

/*--------------------------初始化地图对象------------------------------------*/
function init() {
    //初始化地图对象。
    map = new SuperMap.Map("map", {
        //添加控件
        controls: [
            new SuperMap.Control.MousePosition(),
            new SuperMap.Control.Navigation(),
            new SuperMap.Control.ScaleLine({
                isImperialUnits: false
            }),
            new SuperMap.Control.LayerSwitcher()
        ],
        //地图所有图层都被当做叠加图层来使用。
        allOverlays: true
    });
    //初始化地图图层
    layerMap = new SuperMap.Layer.TiledDynamicRESTLayer("西城", urlMap, null, {maxResolution: "auto"}, {
        transparent: true,
        cacheEnabled: false
    });
    layerMap.events.on({"layerInitialized": addLayer});
    //初始化摄像头图层
    layerCamera = new SuperMap.Layer.TiledDynamicRESTLayer("摄像头", urlCamera, {
        transparent: true,
        cacheEnabled: false
    }, {maxResolution: "auto"});
    layerCameraPhoto = new SuperMap.Layer.TiledDynamicRESTLayer("影像摄像头", urlCameraPhoto, {
        transparent: true,
        cacheEnabled: false
    }, {maxResolution: "auto"});
    //初始化车辆图层
    layerCar = new SuperMap.Layer.TiledDynamicRESTLayer("车辆", urlCar, {
        transparent: true,
        cacheEnabled: false
    }, {maxResolution: "auto"});
    //初始化影像车辆图层
    layerCarPhoto = new SuperMap.Layer.TiledDynamicRESTLayer("影像车辆", urlCarPhoto, {
        transparent: true,
        cacheEnabled: false
    }, {maxResolution: "auto"});
    /*---------------------------搜索定位-------------------------------*/
    markers1 = new SuperMap.Layer.Markers("Markers1");
    vectorSearch = new SuperMap.Layer.Vector("vectorSearch", {
        styleMap: new SuperMap.StyleMap(
            new SuperMap.Style({
                fillColor: "rgba(20,88,167,.5)",
                strokeColor: "#1458a7",
                strokeWidth: 2,
                graphicZIndex: 1
            })
        )
    });
    /*---------------------------模拟摄像头矢量图层-------------------------------*/
    //构建 矢量覆盖物 图层。
    vectors = new SuperMap.Layer.Vector("vectors");
    //矢量覆盖物回传事件
    callbacks = {
        over: onFeatureHovered,
        click: onFeatureSelected,
        out: closeTabsInfoWin,
        clickout: closeMenuInfoWin,
        dblclick: function () {
            console.log(22222);
            return
        }
    };
    //创建一个矢量选择要素的控件，在指定图层上单击鼠标选择矢量要素。
    selectFeature = new SuperMap.Control.SelectFeature(vectors,
        {
            callbacks: callbacks,
            hover: false
        }, {allowSelectTheSameFeature: true});
    map.addControls([drawCricle, drawPolygon, drawLine, drawLine1, drawBounds, selectFeature, selectFeatureCar]);
    //获取摄像头信息
    getCameraInfo();
    //初始化摄像头属性
    getCameraAttr();
    //初始化警车信息
    getCarInfo();
    //初始化警车属性
    getCarAttr();
    /*---------------------------鼠标滚轴监听事件-------------------------------*/
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mousewheelupdate, false);
    }//W3C
    window.onmousewheel = document.onmousewheel = mousewheelupdate;//IE/Opera/Chrome
}

//初始化地图
init();
/*********************5s refresh car layer*****************************/
window.carRefreshInterval = setInterval(function () {
    console.log("auto refresh car");
    window.car = [];
    getCarInfo();
    layerCar.redraw();
}, 500000);

/*--------------------------将地图添加到地图上------------------------------------*/
function addLayer() {
    //初始化地图图层
    photoMap = new SuperMap.Layer.TiledDynamicRESTLayer("影像", urlPhotoMap, null, {maxResolution: "auto"}, {
        transparent: true,
        cacheEnabled: false
    });
    photoMap.events.on({"layerInitialized": addLayer2});
    //设置中心点，指定放缩级别。
    //map.setCenter(new SuperMap.LonLat(500377.96 , 305971.1), jb);
}

function addLayer2() {
    layerMap.isBaseLayer = true;
    //photoMap.isBaseLayer=true;
    //将 底图 和 两类覆盖物图层 添加到地图上。
    map.addLayers([layerMap, photoMap, layerCamera, layerCar, pointLayer, lineLayer, resultLayer, vectorSearch, lineLayer1,
        vectorLayer1, drowLayer, drawLayer1, drowLayer1,
        markers, vectorsCar, vectors]);
    photoMap.setVisibility(false);
    map.setCenter(new SuperMap.LonLat(500377.96, 305971.1), jb);
    selectFeatureCar.activate();
    selectFeature.activate();
}

function changeMap() {
    if (bt == false) {
        layerMap.setVisibility(false);
        photoMap.setVisibility(true);
        map.removeLayer(layerCamera);
        map.removeLayer(layerCar);
        map.removeLayer(vectors);
        map.removeLayer(vectorsCar);
        map.addLayers([layerCameraPhoto, layerCarPhoto, vectorsCar, vectors])
        map.setBaseLayer(photoMap);
        //设置图层级别
        map.setLayerIndex(layerCarPhoto, 3);
        map.setLayerIndex(layerCameraPhoto, 4);
        if (layerFlagNum == 1) {
            layerCameraPhoto.setVisibility(true);
            layerCarPhoto.setVisibility(false);
        } else if (layerFlagNum == 2) {
            layerCameraPhoto.setVisibility(false);
            layerCarPhoto.setVisibility(true);
        } else if (layerFlagNum == 3) {
            layerCameraPhoto.setVisibility(true);
            layerCarPhoto.setVisibility(true);
        } else {
            layerCameraPhoto.setVisibility(false);
            layerCarPhoto.setVisibility(false);
        }
        // $('.h-line').hide();
        $('.photoMap>img').attr('src', './images/map.png');
        $('.camList>img').attr('src', './images/camera-list-photo.png');
        $('.carList>img').attr('src', './images/car-list-photo.png');
        $('.layerList>img').attr('src', './images/layer-list-photo.png');
        bt = true;
        //区分影像地图与普通地图绘制颜色
        drawColor = "white";
        cleans();
    } else if (bt == true) {
        layerMap.setVisibility(true);
        photoMap.setVisibility(false);
        map.removeLayer(layerCameraPhoto);
        map.removeLayer(layerCarPhoto);
        map.removeLayer(vectors);
        map.removeLayer(vectorsCar);
        map.addLayers([layerCamera, layerCar, vectorsCar, vectors])
        map.setBaseLayer(layerMap);
        map.setLayerIndex(layerCar, 3);
        map.setLayerIndex(layerCamera, 4);
        if (layerFlagNum == 1) {
            layerCamera.setVisibility(true);
            layerCar.setVisibility(false);
        } else if (layerFlagNum == 2) {
            layerCamera.setVisibility(false);
            layerCar.setVisibility(true);
        } else if (layerFlagNum == 3) {
            layerCamera.setVisibility(true);
            layerCar.setVisibility(true);
        } else {
            layerCamera.setVisibility(false);
            layerCar.setVisibility(false);
        }
        $('.h-line').show();
        $('.camList>img').attr('src', './images/camera-list.png');
        $('.carList>img').attr('src', './images/car-list.png');
        $('.layerList>img').attr('src', './images/layer-list.png');
        $('.photoMap>img').attr('src', './images/photoMap.png');
        bt = false;
        //区分影像地图与普通地图绘制颜色
        drawColor = "#1458a7";
        cleans();
    }
}

/*----------------------------------------控制图层显示隐藏-----------------------------------*/
/*
 * 定义全局变量区分图层加载
 * layerFlagNum
 * 0 都不加载    1 摄像头  2 车辆  3 车辆和摄像头
 */
var layerFlagNum = 3;

function layerShow(type) {
    switch (type) {
        case 1:
            if ($('#all-layer').prop("checked")) {
                $('#cam-layer').prop("checked", "checked");
                $('#car-layer').prop("checked", "checked");
            } else {
                $('#cam-layer').prop("checked", "");
                $('#car-layer').prop("checked", "");
            }
            break;
        case 2:
            if ($('#cam-layer').prop("checked")) {
                if ($('#car-layer').prop("checked")) {
                    $('#all-layer').prop("checked", "checked");
                }
            } else {
                $('#all-layer').prop("checked", "");
            }
            break;
        case 3:
            if ($('#car-layer').prop("checked")) {
                if ($('#cam-layer').prop("checked")) {
                    $('#all-layer').prop("checked", "checked");
                }
            } else {
                $('#all-layer').prop("checked", "");
            }
            break;
    }
    /*----------------------------图层切换点击事件----------------------------------*/
    if ($('#all-layer').prop("checked")) {
        console.log('---------------------');
        console.log(bt);
        //bt为true时为影像地图
        console.log('全选');
        //图标
        $('.carList').show();
        $('.camList').show();
        $('.carList').css('top', '28%');

        //图标属性
        $('.camType1').show();//摄像头列表
        $('.camType2').show();
        $('.camType2').css('bottom', '65px')
        $('#layer_list').hide();
        if (bt == true) {
            layerCameraPhoto.setVisibility(true);
            layerCarPhoto.setVisibility(true);
            $('.layerList>img').attr('src', './images/layer-list-photo.png');
        } else {
            layerCamera.setVisibility(true);
            layerCar.setVisibility(true);
            $('.layerList>img').attr('src', './images/layer-list.png');
        }
        $('#cam_list').hide();
        $('#car_list').hide();
        //控制事件是否激活
        selectFeature.activate();
        selectFeatureCar.activate();
        layerFlagNum = 3;
        clean();
    } else if ($('#cam-layer').prop("checked") && !$('#car-layer').prop("checked")) {
        console.log('选中摄像头');
        map.setLayerIndex(vectors, map.layers.length - 1);
        map.setLayerIndex(vectorsCar, map.layers.length - 2);
        //矢量选择事件状态修改
        selectFeature.activate();
        selectFeatureCar.deactivate();
        //三个图标显隐
        $('.carList').hide();
        $('.camList').show();
        $('.carList').css('top', '28%');
        //图标属性
        $('.camType1').show();
        $('.camType2').hide();
        $('.camType2').css('bottom', '65px')
        $('#layer_list').hide();

        //车列表隐藏
        $('#cam_list').hide();
        $('#car_list').hide();
        if (bt == true) {
            layerCameraPhoto.setVisibility(true);
            layerCarPhoto.setVisibility(false);
            $('.layerList>img').attr('src', './images/layer-list-photo.png');
        } else {
            layerCamera.setVisibility(true);
            layerCar.setVisibility(false);
            $('.layerList>img').attr('src', './images/layer-list.png');
        }
        layerFlagNum = 1;
        clean();
    }
    else if (!$('#cam-layer').prop("checked") && $('#car-layer').prop("checked")) {
        console.log('选中车辆');
        map.setLayerIndex(vectors, map.layers.length - 2);
        map.setLayerIndex(vectorsCar, map.layers.length - 1);
        //矢量选择事件状态修改
        selectFeature.deactivate();
        selectFeatureCar.activate();
        //三个图标显隐
        $('.carList').show();
        $('.camList').hide();
        $('.carList').css('top', '28%');
        //图标属性
        $('.camType1').hide();
        $('.camType2').show();
        $('.camType2').css('bottom', '65px')
        $('#layer_list').hide();
        //车列表隐藏
        $('#cam_list').hide();
        $('#car_list').hide();
        if (bt == true) {
            layerCameraPhoto.setVisibility(false);
            layerCarPhoto.setVisibility(true);
            $('.layerList>img').attr('src', './images/layer-list-photo.png');
        } else {
            layerCamera.setVisibility(false);
            layerCar.setVisibility(true);
            $('.layerList>img').attr('src', './images/layer-list.png');
        }
        layerFlagNum = 2;
        clean();
    } else {
        console.log('都未选中');

        if (bt == true) {
            layerCameraPhoto.setVisibility(false);
            layerCarPhoto.setVisibility(false);
            $('.layerList>img').attr('src', './images/layer-list-photo.png');
        } else {
            layerCamera.setVisibility(false);
            layerCar.setVisibility(false);
            $('.layerList>img').attr('src', './images/layer-list.png');
        }
        //矢量选择事件状态修改
        selectFeature.deactivate();
        selectFeatureCar.deactivate();
        //三个图标显隐
        $('.carList').hide();
        $('.camList').hide();
        $('.carList').css('top', '28%');
        //图标属性
        $('.camType1').hide();
        $('.camType2').hide();
        $('.camType2').css('bottom', '65px')
        $('#layer_list').hide();

        //车列表隐藏
        $('#cam_list').hide();
        $('#car_list').hide();
        layerFlagNum = 0;
        clean();
    }

}

/*--------------------------------------切换摄像头、警车列表、图层切换-------------------------------------*/
function changeCameraList() {
    if ($('#cam_list').css('display') == 'none') {//要变成block是触发
        console.log('heng,23333333333333333333')
        $('.carList').css({'top': '57%', 'z-index': '2'});
        if ($('#car_list').css('display') == 'block') {
            $('#car_list').css({'top': '61%', 'z-index': '2'})
        }

    } else {
        console.log('zhang,yigyingying')
        $('.carList').css({'top': '28%', 'z-index': '2'})
        if ($('#car_list').css('display') == 'block') {
            $('#car_list').css({'top': '32%', 'z-index': '2'})
        }
    }
    $('.message').hide();
    $('#video').hide();
    $('#layer_list').hide();
    $('#cameradetailsWin').hide();
}

function changeCarList() {
    if ($('#cam_list').css('display') == 'none') {
        $('.carList').css({'top': '28%', 'z-index': '2'});
        $('#car_list').css({'top': '30%', 'z-index': '1'})
    } else {
        $('.carList').css({'top': '57%', 'z-index': '2'});
        $('#car_list').css({'top': '60%', 'z-index': '1'})
    }
    $('.message').hide();
    $('#video').hide();
    $('#layer_list').hide();
    $('#cameradetailsWin').hide();
}

function changeLayer() {
    if ($('.layerList>img').attr('src') == './images/layer-list.png') {
        $('.layerList>img').attr('src', './images/layer-list-on.png');
    } else if ($('.layerList>img').attr('src') == './images/layer-list-on.png') {
        $('.layerList>img').attr('src', './images/layer-list.png');
    } else if ($('.layerList>img').attr('src') == './images/layer-list-photo.png') {
        $('.layerList>img').attr('src', './images/layer-list-on-photo.png');
    } else if ($('.layerList>img').attr('src') == './images/layer-list-on-photo.png') {
        $('.layerList>img').attr('src', './images/layer-list-photo.png');
    }
    if ($("#layer_list").css('display') === 'none') {
        $('.carList').css({'top': '28%', 'z-index': '2'})
    }
    $('.message').hide();
    $('#video').hide();
    $('#cam_list').hide();
    $('#car_list').hide();
    $('#cameradetailsWin').hide();
}

/*--------------------------滚轮滑动时纠正弹窗位置------------------------------------*/
function mousewheelupdate(e) {
    if (e.wheelDelta > 0) {
        if (jb == map.getNumZoomLevels() - 1) {
            fla = true
        }
        if (jb < map.getNumZoomLevels() - 1) {
            jb++;
            var fla = false
        }

    } else {
        if (jb > 0) {
            jb--;
            var fla = false
        }
        if (jb == 0) {
            fla = true
        }
    }
    if (jb == map.getZoom() && fla == false) {
        updatePop();
    }
    if (jb != map.getZoom()) {
        jb = map.getZoom()
    }
}

function updatePop() {
    $('#menuInfo').css({
        'left': parseInt($('#menuInfo').css('left')) + 36 + "px",
        'top': parseInt($('#menuInfo').css('top')) - 36 + "px",
        'width': '105px',
        'height': '185px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px rgba(0,0,0,.3)',
        'background': 'rgba(255,255,255,.9)',
        'cursor': ' pointer'
    });
    $('#tabsInfo1').css({
        'left': parseInt($('#tabsInfo1').css('left')) + 36 + "px",
        'top': parseInt($('#tabsInfo1').css('top')) - 36 + "px",
        'width': '280px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px #999',
        'background': 'rgba(255,255,255,.9)',
    });
    $('#tabsInfo').css({
        'left': parseInt($('#tabsInfo').css('left')) + 36 + "px",
        'top': parseInt($('#tabsInfo').css('top')) - 36 + "px",
        'width': '280px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px #999',
        'background': 'rgba(255,255,255,.9)',
    });
    $('#tabsInfoCar1').css({
        'left': parseInt($('#tabsInfoCar1').css('left')) + 36 + "px",
        'top': parseInt($('#tabsInfoCar1').css('top')) - 36 + "px",
        'width': '280px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px #999',
        'background': 'rgba(255,255,255,.9)',
    });
    $('#tabsInfoCar').css({
        'left': parseInt($('#tabsInfoCar').css('left')) + 36 + "px",
        'top': parseInt($('#tabsInfoCar').css('top')) - 36 + "px",
        'width': '280px',
        'border': '1px solid #999',
        'box-shadow': '2px 2px 12px #999',
        'background': 'rgba(255,255,255,.9)',
    });
    $('#featureShadow').css({
        'left': parseInt($('#featureShadow').css('left')) - 25 + "px",
        'top': parseInt($('#featureShadow').css('top')) - 25 + "px",
        'box-shadow': '2px 2px 12px #AFEEEE',
        'width': '50px',
        'height': '50px',
        'border-radius': '50%',
        'background': '#1458a7',
        'opacity': '.2',
        'z-index': '3329'
    });
    $('#featureShadow1').css({
        'left': parseInt($('#featureShadow1').css('left')) - 25 + "px",
        'top': parseInt($('#featureShadow1').css('top')) - 25 + "px",
        'width': '50px',
        'height': '50px',
        'border-radius': '50%',
        'background': '#1458a7',
        'opacity': '.2',
        'z-index': '3329'
    });
    $('#featureShadowCar').css({
        'left': parseInt($('#featureShadowCar').css('left')) - 25 + "px",
        'top': parseInt($('#featureShadowCar').css('top')) - 25 + "px",
        'box-shadow': '2px 2px 12px #AFEEEE',
        'width': '50px',
        'height': '50px',
        'border-radius': '50%',
        'background': 'rgba(20,88,167,.3)',
        'opacity': '.2',
        'z-index': '3329'
    });
    $('#featureShadowCar1').css({
        'left': parseInt($('#featureShadowCar1').css('left')) - 25 + "px",
        'top': parseInt($('#featureShadowCar1').css('top')) - 25 + "px",
        'width': '50px',
        'height': '50px',
        'border-radius': '50%',
        'background': 'rgba(20,88,167,.3)',
        'opacity': '.2',
        'z-index': '3329'
    });
    $('#cameraSelected').css({
        'left': parseInt($('#cameraSelected').css('left')) - 15 + "px",
        'top': parseInt($('#cameraSelected').css('top')) - 15 + "px",
        'width': '30px',
        'height': '30px',
        'border-radius': '50%',
        'background': '#ff0000',
        'opacity': '.4',
        'z-index': '3329'
    });
    $('#carSelected').css({
        'left': parseInt($('#carSelected').css('left')) - 15 + "px",
        'top': parseInt($('#carSelected').css('top')) - 15 + "px",
        'width': '30px',
        'height': '30px',
        'border-radius': '50%',
        'background': '#ff0000',
        'opacity': '.4',
        'z-index': '3329'
    });
    for (var i = 0; i < cam_selectId.length; i++) {
        //console.log(cam_selectId)
        $("#" + cam_selectId[i]).css({
            'left': parseInt($("#" + cam_selectId[i]).css('left')) - 15 + "px",
            'top': parseInt($("#" + cam_selectId[i]).css('top')) - 15 + "px",
            'width': '30px',
            'height': '30px',
            'border-radius': '50%',
            'background': 'rgba(20,88,167,.3)',
            'opacity': '.4',
            'z-index': '3329'
        });
    }
    for (var i = 0; i < car_selectId.length; i++) {
        //console.log(cam_selectId)
        $("#" + car_selectId[i]).css({
            'left': parseInt($("#" + car_selectId[i]).css('left')) - 15 + "px",
            'top': parseInt($("#" + car_selectId[i]).css('top')) - 15 + "px",
            'width': '30px',
            'height': '30px',
            'border-radius': '50%',
            'background': 'rgba(20,88,167,.3)',
            'opacity': '.4',
            'z-index': '3329'
        });
    }
}

/*----------------------------拖动时不触发悬浮事件-----------------------------*/
/*$(document).mousemove(function(e){
    if(map.dragging){
        selectFeature.deactivate();
        selectFeatureCar.deactivate();
    }else{
        if ($('#all-layer').prop("checked")) {
            selectFeature.activate();
        } else {
            if ($('#cam-layer').prop("checked")) {
                selectFeature.activate();
                selectFeatureCar.deactivate();
            } else {
                selectFeature.deactivate();
            }
            if ($('#car-layer').prop("checked")) {
                selectFeatureCar.activate();
                selectFeature.deactivate();
            } else {
                layerCar.setVisibility(false);
                selectFeatureCar.deactivate();
            }
            if ($('#car-layer').prop("checked") && $('#cam-layer').prop("checked")) {
                selectFeature.activate();
                selectFeatureCar.deactivate();
            } else if (!$('#car-layer').prop("checked") && !$('#cam-layer').prop("checked")) {
                selectFeature.deactivate();
                selectFeatureCar.deactivate();
            }
        }
    }
});*/
/*---------------------------------------搜索定位以及出现弹窗----------------------------------------------*/
//passionZhang  12/2
// function numSelect(num){
// 	$('#searchSelect').val(num)
//     console.log('woshoubuliaole')
//     var $ouls = $('.dropdown-menu li a');
//     console.log($ouls)
//     $ouls.each(function () {
//         $(this).on("click", function () {
//             console.log('zhangheng-------------')
//             buffer_length =num;
//             // buffer(buffer_points, buffer_length)
//             hcQuery();
//         })
//     });
// }
function numSelect(num) {
    $('#searchSelect').val(num)
    buffer_length = num;
    if ($("#search").val() != "") {
        searchLocation();
    }
    // buffer(buffer_points, buffer_length)
    hcQuery();
}

//地名地址模糊查询
$("#search").typeahead({
    source: function (query, process) {
        return $.ajax({
            url: window.urlName + "/addressTest/addressTestGetByName",
            type: 'post',
            data: {
                "mobile": mobile,
                "token": token,
                "name": $('#search').val()
            },
            success: function (result) {
                var name2Id = [];
                $.each(result.data.message, function (index, ele) {
                    var name = {};
                    name['id'] = ele.id;
                    name['name'] = ele.addr_name;//键值对保存下来。
                    name['x'] = ele.addr_x;
                    name['y'] = ele['addr-y'];
                    name2Id.push(name);
                });
                return process(name2Id);
            },
        });
    },
    items: 8,
    afterSelect: function (item) {
        addr_x = item.x;
        addr_y = item.y;
    },
    delay: 500
});

function searchLocation() {
    if ($("#search").val() == "") {
        hcQuery();
    } else {
        if (isNaN($('#searchSelect').val())) {
            $('#searchSelect').val('请输入数字')
        } else if ($('#searchSelect').val() == '') {
            searchCircle(addr_x, addr_y, 100)
        } else {
            searchCircle(addr_x, addr_y, $('#searchSelect').val())
        }
    }
}

/*----------------------------定位-----------------------------*/
function searchCircle(x, y, radius) {
    cleans();
    //确定搜索位置的位置信息，用西城规划局代替
    //SuperMap.Size 用来描绘一对高宽值的实例
    var size = new SuperMap.Size(30, 40);
    //依据size创建屏幕坐标
    //SuperMap.Pixel 此类用x, y坐标描绘屏幕坐标
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    //SuperMap.Icon 创建图标，在网页中表现为div标签中的image标签
    var icon = new SuperMap.Icon('images/markerP.png', size, offset);
    //依据位置和大小初始化标记覆盖物
    imgMarker = new SuperMap.Marker(new SuperMap.LonLat(x, y), icon);
    map.setCenter(new SuperMap.LonLat(x, y), map.getZoom());
    //添加 标记覆盖物 到 标记图层
    markers.addMarker(imgMarker);

    var centerPoint = new SuperMap.Geometry.Point(x, y);
    var circleP = createCircle(centerPoint, radius, 256, 360, 360);
    var circleVector = new SuperMap.Feature.Vector(circleP);
    vectorSearch.addFeatures([circleVector]);

    //从服务端拉去选中的数据
    cameraSelectCircle(x, y, radius, function (cameras) {
        if (layerFlagNum == 2) {
            return
        }
        if (cameras.length > 0) {
            openCameraPanel(cameras);
            saveData('camerasList', cameras);
        } else {
            console.log("no camera selected");
        }
    });
    //汽车查询
    carSelectCircle(x, y, radius, function (cars) {
        if (layerFlagNum == 1) {
            return
        }
        if (cars.length > 0) {
            openCarPanel(cars);
        } else {
            console.log("no car selected");
        }
    });
}

/*----------------------------圆-----------------------------*/
function createCircle(origin, radius, sides, r, angel) {
    var rR = r * Math.PI / (180 * sides);
    var rotatedAngle, x, y;
    var points = [];
    for (var i = 0; i < sides; ++i) {
        rotatedAngle = rR * i;
        x = origin.x + (radius * Math.cos(rotatedAngle));
        y = origin.y + (radius * Math.sin(rotatedAngle));
        points.push(new SuperMap.Geometry.Point(x, y));
    }
    rotatedAngle = r * Math.PI / 180;
    x = origin.x + (radius * Math.cos(rotatedAngle));
    y = origin.y + (radius * Math.sin(rotatedAngle));
    points.push(new SuperMap.Geometry.Point(x, y));

    var ring = new SuperMap.Geometry.LinearRing(points);
    ring.rotate(parseFloat(angel), origin);
    var geo = new SuperMap.Geometry.Collection([ring]);
    geo.origin = origin;
    geo.radius = radius;
    geo.r = r;
    geo.angel = angel;
    geo.sides = sides;
    geo.polygonType = "Curve";
    return geo;
}

