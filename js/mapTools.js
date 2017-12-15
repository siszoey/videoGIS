/**
 * 地图查询操作及基础操作
 * 定义缓冲全局变量以buffter_开头
 * 矢量点数组对象 buffer_points=[]
 * 缓冲区距离buffer_length=0
 * 缓冲区展开buffer_flag=false
 */
/*-----------------------------------获取缓冲距离-------------------------------*/
var buffer_points = [], buffer_length = 100, buffer_flag = false;
var pointFlag = false, lineFlag = false, boundFlag = false, circleFlag = false, PolygonFlag = false;
//当工具栏点击选中时添加相应数值如绘制1，点选2...
var toolsNum = 0;
//tools查询颜色设置
var drawColor = "#1458a7";
//缓冲区矢量图层
resultLayer = new SuperMap.Layer.Vector("缓冲");
//缓冲区输入
$('#searchSelect').blur(function () {
    if ($('#searchSelect').val() != '') {
        buffer_length = parseInt($('#searchSelect').val());
    } else {
        buffer_length = 100;
    }
})
//监听回车键
$('#searchSelect').on('keyup', function (event) {
    $('#searchSelect').focus();
    if (event.keyCode == "13") {
        //回车执行查询
        if ($('#searchSelect').val() != '') {
            if (isNaN($('#searchSelect').val())) {
                $("#searchSelect").attr('placeholder', '请填入数字');
                $('#searchSelect').val('');
                // $('#searchSelect').focus();
            } else {
                buffer_length = parseInt($('#searchSelect').val());
                console.log();
                console.log(buffer_length);
                hcQuery();
            }
        } else {
            buffer_length = 100;
            hcQuery();
        }
    }
});

//缓冲距离确定确定
function hcQuery() {
    if (buffer_flag) {
        buffer(buffer_points, buffer_length)
    } else {
        if ($("#search").val() != "") {
            return;
        }
        //$('#searchSelect').val('');
        buffer_length = 100;
        win.alert('提示', '仅工具栏第一栏可以设置缓冲区')
    }
}

/*-----------------------------------右键结束-----------------------------*/
$(document).mousedown(function (e) {
    if (3 == e.which) {
        //禁止鼠标原生右键菜单
        e.cancelBubble = true
        e.returnValue = false;

        $('#search').val('');
        closeMenuInfoWin();//关闭左键选中
        //注销
        deleteData('camerasList');
        deleteData('carsList');
        //清除maker
        markers.clearMarkers();
        //清除layer
        for (var i = 2; i < map.layers.length - 2; i++) {
            if (map.layers[i].removeAllFeatures) {
                map.layers[i].removeAllFeatures();
            }
        }
        map.removeAllPopup();
        buffer_points.splice(0, buffer_points.length);//清空数组
        //toolsNum为1-5时可设置缓冲区
        vectorControl()
    }
})

function vectorControl() {
    //取消矢量选择事件
    selectFeature.deactivate();
    selectFeatureCar.deactivate();
    buffer_points.splice(0, buffer_points.length);//清空数组
    switch (toolsNum) {
        case 1:
            buffer_flag = true;
            drawLine1.activate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawPolygon.deactivate();
            break;
        case 2:
            buffer_flag = true;
            map.events.on({"click": drawpoint});
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawPolygon.deactivate();
            break;
        case 3:
            buffer_flag = true;
            drawLine.deactivate();
            drawLine1.deactivate();
            drawBounds.activate();
            drawCricle.deactivate();
            drawPolygon.deactivate();
            break;
        case 4:
            buffer_flag = true;
            drawLine.deactivate();
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.activate();
            drawPolygon.deactivate();
            break;
        case 5:
            buffer_flag = true;
            drawPolygon.events.un({"featureadded": drawPolygonCompleted});
            drawPolygon.events.on({"featureadded": drawPolygonCompleted});
            drawLine.deactivate();
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawPolygon.activate();
            break;
        case 9:
            buffer_flag = false;
            cli();
            drawLine.deactivate();
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawPolygon.deactivate();
            break;
        case 10:
            buffer_flag = false;
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawLine.activate();
            drawPolygon.deactivate();
            break;
        case 11:
            buffer_flag = false;
            drawPolygon.events.un({"featureadded": drawPolygonCompleted1});
            drawPolygon.events.on({"featureadded": drawPolygonCompleted1});
            drawLine.deactivate();
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawPolygon.activate();
            break;
        default:
            buffer_flag = false;
            drawLine.deactivate();
            drawLine1.deactivate();
            drawBounds.deactivate();
            drawCricle.deactivate();
            drawPolygon.deactivate();
    }
    clean();
}

/*-----------------------------------绘制------------------------------------*/
lineLayer1 = new SuperMap.Layer.Vector("lineLayer1", {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: drawColor,
            strokeColor: drawColor,
            strokeWidth: 2,
            graphicZIndex: 1,
            strokeDashstyle: 'dash'
        })
    )
});
var lineDownFlag = false;
var addFlag = false;
var lineDownNum = 0;
var hzLength = 0;
drawLine1 = new SuperMap.Control.DrawFeature(lineLayer1, SuperMap.Handler.Path, {multi: true});
drawLine1.events.on({"featureadded": drawCompleted2});
/*---------------------------画线-------------------------------*/

//绘制
function hz() {
    $(document).mousedown(function (e) {
        console.log(11);
        if (3 == e.which) {
            e.returnValue = false;
        }
    });
    lineLayer1.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        strokeDashstyle: 'dash'
    };
    drawLine1.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        strokeDashstyle: 'dash'
    };
    toolsNum = 1;
    // clean();
    vectorControl();
    SuperMap.Handler.Path.prototype.down = function (a) {
        var ePoint = map.getLonLatFromPixel(a.xy);
        lineDownNum++;
        var point = new SuperMap.Geometry.Point(ePoint.lon, ePoint.lat);
        var pointVector = new SuperMap.Feature.Vector(point);
        pointVector.style = {
            strokeColor: drawColor,
            strokeWidth: 0,
            pointerEvents: "visiblePainted",
            fillColor: drawColor,
            fillOpacity: 0.8,
            pointRadius: 4
        };
        lineLayer1.addFeatures(pointVector);
        buffer_points.push(point);
        lineDownFlag = true;
        addFlag = true;
        var b = this.stopDown;
        if (this.freehandMode(a)) {
            b = true;
            if (this.touch) {
                this.modifyFeature(a.xy, !!this.lastUp);
                SuperMap.Event.stop(a)
            }
        }
        if (!this.touch && (!this.lastDown || !this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance))) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        this.mouseDown = true;
        this.lastDown = a.xy;
        this.stoppedDown = b;
        console.log(b)
        return !b
    }
    SuperMap.Handler.Path.prototype.move = function (a) {
        if (lineDownFlag == true) {
            $("#huzhiPopup" + lineDownNum).remove();
            var onepointX = buffer_points[lineDownNum - 1].x;
            var onepointY = buffer_points[lineDownNum - 1].y;
            var ePoint = map.getLonLatFromPixel(a.xy);
            var xDiff = onepointX - ePoint.lon;
            var yDiff = onepointY - ePoint.lat;
            var distance = (Math.pow((xDiff * xDiff + yDiff * yDiff), 0.5) + hzLength).toFixed(2);
            addPopUp("huzhiPopup" + lineDownNum,
                ePoint.lon + 10,
                ePoint.lat,
                "测量长度:" + Math.abs(distance) + "m",
                drawColor,
                map);
            if (lineDownNum > 1) {
                if (addFlag == true) {
                    console.log(lineDownNum)
                    $("#huzhiPopup" + (lineDownNum - 1)).remove();
                    var secondpointX = buffer_points[lineDownNum - 2].x;
                    var secondpointY = buffer_points[lineDownNum - 2].y;
                    var xDif = onepointX - secondpointX;
                    var yDif = onepointY - secondpointY;
                    hzLength += Math.pow((xDif * xDif + yDif * yDif), 0.5);
                    addFlag = false;
                    // addPopUp("huzhiPopup"+(lineDownNum-1),
                    //    onepointX+10,
                    //    onepointY,
                    //    "测量结果:" + Math.abs(hzLength.toFixed(2)) + "m",
                    //    "#1458a7",
                    //    map);
                }
            }
        }
        if (this.stoppedDown && this.freehandMode(a)) {
            if (this.persist) {
                this.destroyPersistedFeature()
            }
            if (this.maxVertices && this.line && this.line.geometry.components.length === this.maxVertices) {
                this.removePoint();
                this.finalize()
            } else {
                this.addPoint(a.xy)
            }
            return false
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        return true
    }
}

function drawCompleted2(eventArgs) {
    lineDownFlag = false;
    $("#huzhiPopup" + (lineDownNum - 2)).remove();
    $("#huzhiPopup" + (lineDownNum - 1)).remove();
    $("#huzhiPopup" + lineDownNum).remove();
    lineDownNum = 0;
    hzLength = 0;
    //drawLine1.deactivate()
    //all positions
    var positions = eventArgs.feature.geometry.components[0].components;
    //caculate the distance
    var distance = 0;
    for (var i = 1; i < positions.length; i++) {
        temp = (positions[i].x - positions[i - 1].x) * (positions[i].x - positions[i - 1].x);
        temp += (positions[i].y - positions[i - 1].y) * (positions[i].y - positions[i - 1].y);
        distance += Math.sqrt(temp);
    }
    distance = distance.toFixed(2);
    addPopUp("huzhiPopup",
        positions[positions.length - 1].x,
        positions[positions.length - 1].y,
        "测量结果:" + Math.abs(distance) + "m",
        drawColor,
        map);
    //创建点数组
    linepoints = [];
    for (var i = 0; i < positions.length; i++) {
        var temp = {};
        temp.X = positions[i].y;
        temp.Y = positions[i].x;
        linepoints.push(temp);
//      buffer_points.push(new SuperMap.Geometry.Point(positions[i].x, positions[i].y))
    }
    //缓冲区
    buffer(buffer_points, buffer_length);
    drawLine1.deactivate();
}

/*-----------------------------------点选-----------------------------*/
pointLayer = new SuperMap.Layer.Vector('pointLayer', {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: "#fff",
            strokeColor: "#fff",
            strokeWidth: 2,
            graphicZIndex: 2,
            strokeDashstyle: 'dash',
            fillOpacity: 0.5
        })
    )
});

function dx() {
    toolsNum = 2;
    // clean();
    vectorControl()
}

function drawpoint(e) {
    pointLayer.removeAllFeatures();
    buffer_flag = true;
    pointFlag = true;
    buffer_points.splice(0, buffer_points.length);//清空数组
    var pL = map.getLonLatFromPixel(e.xy);
    //drawCenter=pL;
    var point = new SuperMap.Geometry.Point(pL.lon, pL.lat);
    var pointVector = new SuperMap.Feature.Vector(point);
    pointVector.style = {
        strokeColor: drawColor,
        strokeWidth: 0,
        pointerEvents: "visiblePainted",
        fillColor: drawColor,
        fillOpacity: 0.8,
        pointRadius: 4
    };
    pointLayer.addFeatures(pointVector);
    buffer_points.push(point)
    console.log(buffer_points)
    //点缓冲
    buffer(buffer_points, buffer_length)
    map.events.un({"click": drawpoint});
}

/*----------------------------矩形选-----------------------------*/
/*---------------------------矩形-------------------------------*/
drowLayer1 = new SuperMap.Layer.Vector("DrowLayer1", {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: drawColor,
            strokeColor: drawColor,
            strokeWidth: 2,
            graphicZIndex: 1,
            fillOpacity: 0.4
        })
    )
});
SuperMap.Handler.Box.prototype.moveBox = function (xy) {
    $('#box').remove();
    var startX = this.dragHandler.start.x;
    var startY = this.dragHandler.start.y;
    var deltaX = Math.abs(startX - xy.x);
    var deltaY = Math.abs(startY - xy.y);
    var offset = this.getBoxOffsets();
    this.zoomBox.style.width = (deltaX + offset.width + 1) + "px";
    this.zoomBox.style.height = (deltaY + offset.height + 1) + "px";
    this.zoomBox.style.left = (xy.x < startX ?
        startX - deltaX - offset.left : startX - offset.left) + "px";
    this.zoomBox.style.top = (xy.y < startY ?
        startY - deltaY - offset.top : startY - offset.top) + "px";
    var lonlat = {};
    lonlat.x = this.dragHandler.start.x;
    lonlat.y = this.dragHandler.start.y;
    var cPoint = map.getLonLatFromPixel(lonlat);
    var ePoint = map.getLonLatFromPixel(xy);
    var boundWidth = ePoint.lon - cPoint.lon;
    var boundLength = cPoint.lat - ePoint.lat
    var Area = (boundWidth * boundLength).toFixed(2);
    addPopUp("box",
        cPoint.lon + boundWidth / 8,
        cPoint.lat - boundLength / 3,
        Math.abs(boundWidth.toFixed(2)) + " X " + Math.abs(boundLength.toFixed(2)) + 'm' + '<br/>' + '面积：' + Math.abs(Area) + ' ㎡',
        "#fff",
        map);
};

drawBounds = new SuperMap.Control.DrawFeature(drowLayer1, SuperMap.Handler.Box);
drawBounds.events.on({"featureadded": drawCompleted22, "includeXY": true});

//矩形
function draw() {
    drowLayer1.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        fillOpacity: 0.4
    };
    buffer_flag = true;
    toolsNum = 3;
    clean();
    vectorControl();
}

function drawCompleted22(drawBoundsArgs) {
    var feature = drawBoundsArgs.feature;
    drowLayer1.addFeatures(feature);
    var bounds = feature.geometry.bounds;
    var rectWidth = (bounds.right - bounds.left).toFixed(2);
    var rectHeight = (bounds.top - bounds.bottom).toFixed(2);
    var rectArea = rectWidth * rectHeight;
//  addPopUp("rectPopupBottom",
//      (bounds.right+bounds.left)/2-100,
//      (bounds.top+bounds.bottom)/2,
//      rectWidth+" X "+rectHeight+'m'+'<br/>'+
//      '面积：'+rectArea.toFixed(2)+'㎡',
//      '#fff',
//      map);
    drawBounds.deactivate();

    leftTopX = bounds.bottom;
    leftTopY = bounds.left;
    rightBottomX = bounds.top;
    rightBottomY = bounds.right;
    var points = [];
    buffer_points.push(new SuperMap.Geometry.Point(leftTopY, leftTopX));
    buffer_points.push(new SuperMap.Geometry.Point(leftTopY, rightBottomX));
    buffer_points.push(new SuperMap.Geometry.Point(rightBottomY, rightBottomX));
    buffer_points.push(new SuperMap.Geometry.Point(rightBottomY, leftTopX));
    //points.push(new SuperMap.Geometry.Point(leftTopY, leftTopX));
    // 调用添加缓冲区换上
    buffer(buffer_points, buffer_length);
}

/*----------------------------圆形选-----------------------------*/
/*---------------------------圆形-------------------------------*/
drawLayer1 = new SuperMap.Layer.Vector("DrawLayer", {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: drawColor,
            strokeColor: drawColor,
            strokeWidth: 2,
            graphicZIndex: 1,
            fillOpacity: 0.4
        })
    )
});
vectorLayer = new SuperMap.Layer.Vector('vectorLayer', {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: "#fff",
            strokeColor: "#fff",
            strokeWidth: 2,
            graphicZIndex: 2,
            strokeDashstyle: 'dash'
        })
    )
});
drawCricle = new SuperMap.Control.DrawFeature(drawLayer1, SuperMap.Handler.RegularPolygon, {handlerOptions: {sides: 500}});
drawCricle.events.on({"featureadded": drawCricleCompleted});
drawCricle.events.on({"beforefeatureadded": beforeDrawCricleCompleted});
vectorLayer1 = new SuperMap.Layer.Vector('vectorLayer1', {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: "#fff",
            strokeColor: "#fff",
            strokeWidth: 2,
            graphicZIndex: 2,
            strokeDashstyle: 'dash'
        })
    )
});

//圆形选
function yxx() {
    drawLayer1.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        fillOpacity: 0.4
    };
    buffer_flag = true;
    toolsNum = 4;
    clean();
    vectorControl()
}

function beforeDrawCricleCompleted(e) {
    var cPoint = map.getLonLatFromPixel(e.object.handler.evt.xy);
    //圆心
    var centerX = cPoint.lon;
    var centerY = cPoint.lat;
    var ydif = e.object.handler.evt.clientY - e.object.handler.evt.xy.y
    $(document).on('mousemove', beforeDrawCricle = function (e) {
        $('#circlePopup1').remove();
        vectorLayer1.removeFeatures(lineVector1);
        var lonlat = {};
        lonlat.x = e.clientX;
        lonlat.y = e.clientY - ydif;

        var ePoint = map.getLonLatFromPixel(lonlat);
        var endX = ePoint.lon;
        var endY = ePoint.lat;
        //圆心到截止点之间的半径
        var start = new SuperMap.Geometry.Point(centerX, centerY);
        var end = new SuperMap.Geometry.Point(endX, endY);
        var line = new SuperMap.Geometry.LineString([start, end]);
        lineVector1 = new SuperMap.Feature.Vector(line);
        vectorLayer1.addFeatures(lineVector1);
        //算出圆的半径
        var xDiff = endX - centerX;
        var yDiff = endY - centerY;
        var radius = (Math.pow((xDiff * xDiff + yDiff * yDiff), 0.5)).toFixed(2);
        var circleArea = (Math.PI * radius * radius).toFixed(2);
        addPopUp("circlePopup1",
            ((parseFloat(centerX) + parseFloat(endX)) / 2),
            ((parseFloat(centerY) + parseFloat(endY)) / 2),
            "半径：" + Math.abs(radius) + "m" + "<br/>" + "面积：" + Math.abs(circleArea) + "㎡",
            "#fff",
            map);
    })
}

function drawCricleCompleted(eventArgs) {
    $(document).off('mousemove', beforeDrawCricle);
    var args = eventArgs;
    var geometry = args.feature.geometry.getBounds();
    //算出圆心
    circleCenterX = (geometry.right + geometry.left) / 2;
    circleCenterY = (geometry.top + geometry.bottom) / 2;
    //算出截止
    var endX = map.controls[0].div.innerText.split(',')[0];
    var endY = map.controls[0].div.innerText.split(',')[1];
    //算出圆的半径
    circleRadius = ((geometry.right - geometry.left) / 2).toFixed(2);
    //圆矢量
    var centerPoint = new SuperMap.Geometry.Point(circleCenterX, circleCenterY);
    var sides = 360, r = 360, angel = 360;
    //获取圆上的点
    var rR = r * Math.PI / (180 * sides);
    var rotatedAngle, x, y;
    for (var i = 0; i < sides; ++i) {
        rotatedAngle = rR * i;
        x = centerPoint.x + (circleRadius * Math.cos(rotatedAngle));
        y = centerPoint.y + (circleRadius * Math.sin(rotatedAngle));
        buffer_points.push(new SuperMap.Geometry.Point(x, y));
    }
    buffer(buffer_points, buffer_length);
    //circleBuffer(centerPoint,radius,430,360,360,100)
    drawCricle.deactivate();
}

/*----------------------------多边形选-----------------------------*/
/*---------------------------多边形-------------------------------*/
drowLayer = new SuperMap.Layer.Vector("DrowLayer", {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: drawColor,
            strokeColor: drawColor,
            strokeWidth: 2,
            graphicZIndex: 1,
            fillOpacity: 0.4
        })
    )
});
drawPolygon = new SuperMap.Control.DrawFeature(drowLayer, SuperMap.Handler.Polygon);

//多边形选
function dbxx() {
    drowLayer.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        fillOpacity: 0.4
    };
    drawPolygon.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        fillOpacity: 0.4
    };
    buffer_flag = true;
    toolsNum = 5;
    clean();
    vectorControl()
    SuperMap.Handler.Path.prototype.down = function (a) {
        var b = this.stopDown;
        if (this.freehandMode(a)) {
            b = true;
            if (this.touch) {
                this.modifyFeature(a.xy, !!this.lastUp);
                SuperMap.Event.stop(a)
            }
        }
        if (!this.touch && (!this.lastDown || !this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance))) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        this.mouseDown = true;
        this.lastDown = a.xy;
        this.stoppedDown = b;
        return !b
    }
    SuperMap.Handler.Path.prototype.move = function (a) {
        if (this.stoppedDown && this.freehandMode(a)) {
            if (this.persist) {
                this.destroyPersistedFeature()
            }
            if (this.maxVertices && this.line && this.line.geometry.components.length === this.maxVertices) {
                this.removePoint();
                this.finalize()
            } else {
                this.addPoint(a.xy)
            }
            return false
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        return true
    }
//  drawPolygon.deactivate();
}

function drawPolygonCompleted(eventArgs) {
    //all positions
    var positions = eventArgs.feature.geometry.components[0].components;
    //创建点数组
    polygonPoints = [];
    var point1 = [];
    for (var i = 0; i < positions.length; i++) {
        var temp = {};
        temp.X = positions[i].y;
        temp.Y = positions[i].x;
        polygonPoints.push(temp);
        buffer_points.push(new SuperMap.Geometry.Point(positions[i].x, positions[i].y))
    }
    buffer(buffer_points, buffer_length);
    //获得图层几何对象
    var geometry = eventArgs.feature.geometry,
        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerService = new SuperMap.REST.MeasureService(urlMap); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
    myMeasuerService.events.on({"processCompleted": measureCompleted});

    //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA

    myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
    myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
    var args = eventArgs;
    var geometry = args.feature.geometry.getBounds();
    //算出中心
    var centerX = (geometry.right + geometry.left) / 2;
    var centerY = (geometry.top + geometry.bottom) / 2;

    //测量结束调用事件
    function measureCompleted(measureEventArgs) {
        var area = measureEventArgs.result.area,
            unit = measureEventArgs.result.unit;
        addPopUp("Polygon",
            centerX,
            centerY,
            "面积：" + Math.abs(area.toFixed(2)) + " ㎡",
            "#fff",
            map);
    }

    drawPolygon.events.un({"featureadded": drawPolygonCompleted});
    drawPolygon.deactivate();
}

/*----------------------------放大-----------------------------*/

//放大
function fd() {
    toolsNum = 6;
    var center = map.getCenter();
    map.zoomIn();
    map.setCenter(center);
    vectorControl();
    updatePop();

}

/*----------------------------缩小-----------------------------*/

//缩小
function sx() {
    toolsNum = 7;
    var center = map.getCenter();
    map.zoomOut();
    map.setCenter(center);
    vectorControl();
    updatePop();

}

/*----------------------------全图显示-----------------------------*/

//全图显示
function gx() {
    toolsNum = 8;
    map.setCenter(new SuperMap.LonLat(500377.96, 305971.1), 0);
    vectorControl();
}

/*----------------------------标记-----------------------------*/
//标记
var fla = false;
/*---------------------------标记-------------------------------*/
markers = new SuperMap.Layer.Markers("Markers");

function cli() {
    toolsNum = 9;
    fla = true;
    drawLine.deactivate();
    drawLine1.deactivate();
    drawBounds.deactivate();
    drawCricle.deactivate();
    drawPolygon.deactivate();
    clean();
    //var mapId = map.eventsDiv.id;
    map.events.on({'click': markClick})

}

function markClick() {
    if (fla == false) {
        return false;
    }
    //markers.clearMarkers();
    a = map.controls[0].div.innerText.split(',');
    b = parseInt(a[0])
    c = parseInt(a[1])
    map.addLayer(markers);
    //标记图层上添加标记
    var size = new SuperMap.Size(25, 25);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon('images/marker.png', size, offset);
    imgMarker = new SuperMap.Marker(new SuperMap.LonLat(b, c), icon)
    markers.addMarker(imgMarker);
    //注册 click 事件,触发 mouseClickHandler()方法
    imgMarker.events.on({
        "click": mouseClickHandler
    });
    fla = false;
    map.events.un({'click': markClick})
}

function mouseClickHandler(event) {
    //closeMarkerInfoWin();
    //构建固定位置浮动弹窗，自适应显示
    var popup = new SuperMap.Popup.FramedCloud(
        "popwin", //唯一标识
        imgMarker.getLonLat(), //标记覆盖物的坐标
        new SuperMap.Size(220, 140),
        '<div style="width: 350px;height: 200px;display: block;">' +
        '<p style="border-bottom: 1px solid #eee;font-size: 16px;padding: 5px">添加标记</p>' +
        '<div><div style="padding-bottom: 10px;padding-left: 25px;">' +
        '名称：<input class="bjInput" type="text" placeholder="我的标注" style="display:inline-block;width: 80%">' +
        '</div><div style="position:absolute;padding-bottom: 10px;padding-left: 25px;"><span>备注：</span>' +
        '<textarea class="bjInput" placeholder="我的备注" style="position: absolute;width: 260px;height: 60px;resize: none;"></textarea>' +
        '</div><div style="position: absolute;bottom: 10px;right: 35px">' +
        '<button class="btn" style="margin-right: 10px" onclick="manage()" >任务下发</button><button class="btn" style="margin-right: 10px">保存</button><button class="btn" onclick="remove()">删除</button>' +
        '</div></div></div>',
        null,
        true,
        null);
    popup.autoSize = true;
    markerInfoWin = popup;
    map.addPopup(popup);
    console.log(popup);
}

/*----------------------------------测距-------------------------------------*/
lineLayer = new SuperMap.Layer.Vector('lineLayer', {
    styleMap: new SuperMap.StyleMap(
        new SuperMap.Style({
            fillColor: drawColor,
            strokeColor: drawColor,
            strokeWidth: 2,
            graphicZIndex: 1,
            strokeDashstyle: 'dash'
        })
    )
});
drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, {multi: true});
/*注册featureadded事件drawCompleted()方法
 * 例如注册“loadstart”事件的单独监听
 * events.on({'loadstart':loadStratListener});*/
drawLine.events.on({"featureadded": drawCompleted1});

function cj() {
    lineLayer.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        fillOpacity: 0.4
    };
    toolsNum = 10;
    vectorControl();
    SuperMap.Handler.Path.prototype.down = function (a) {
        var ePoint = map.getLonLatFromPixel(a.xy);
        lineDownNum++;
        var point = new SuperMap.Geometry.Point(ePoint.lon, ePoint.lat);
        var pointVector = new SuperMap.Feature.Vector(point);
        pointVector.style = {
            strokeColor: drawColor,
            strokeWidth: 0,
            pointerEvents: "visiblePainted",
            fillColor: drawColor,
            fillOpacity: 0.8,
            pointRadius: 4
        };
        lineLayer1.addFeatures(pointVector);
        buffer_points.push(point)
        lineDownFlag = true;
        addFlag = true;
        var b = this.stopDown;
        if (this.freehandMode(a)) {
            b = true;
            if (this.touch) {
                this.modifyFeature(a.xy, !!this.lastUp);
                SuperMap.Event.stop(a)
            }
        }
        if (!this.touch && (!this.lastDown || !this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance))) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        this.mouseDown = true;
        this.lastDown = a.xy;
        this.stoppedDown = b;
        return !b
    }
    SuperMap.Handler.Path.prototype.move = function (a) {

        if (lineDownFlag == true) {
            $("#huzhiPopup" + lineDownNum).remove();
            var onepointX = buffer_points[lineDownNum - 1].x;
            var onepointY = buffer_points[lineDownNum - 1].y;
            var ePoint = map.getLonLatFromPixel(a.xy);
            var xDiff = onepointX - ePoint.lon;
            var yDiff = onepointY - ePoint.lat;
            var distance = (Math.pow((xDiff * xDiff + yDiff * yDiff), 0.5) + hzLength).toFixed(2);
            //console.log(parseFloat(distance))
            addPopUp("huzhiPopup" + lineDownNum,
                ePoint.lon + 10,
                ePoint.lat,
                "测量长度:" + distance + "m",
                "#1458a7",
                map);
            if (lineDownNum > 1) {
                if (addFlag == true) {
                    console.log(lineDownNum)
                    $("#huzhiPopup" + (lineDownNum - 1)).remove();
                    var secondpointX = buffer_points[lineDownNum - 2].x;
                    var secondpointY = buffer_points[lineDownNum - 2].y;
                    var xDif = onepointX - secondpointX;
                    var yDif = onepointY - secondpointY;
                    hzLength += Math.pow((xDif * xDif + yDif * yDif), 0.5);
                    console.log(hzLength.toFixed(2))
                    addFlag = false;
                    // addPopUp("huzhiPopup"+(lineDownNum-1),
                    //    onepointX+10,
                    //    onepointY,
                    //    "测量结果:" + hzLength.toFixed(2) + "m",
                    //    "#1458a7",
                    //    map);
                }
            }

        }
        if (this.stoppedDown && this.freehandMode(a)) {
            if (this.persist) {
                this.destroyPersistedFeature()
            }
            if (this.maxVertices && this.line && this.line.geometry.components.length === this.maxVertices) {
                this.removePoint();
                this.finalize()
            } else {
                this.addPoint(a.xy)
            }
            return false
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        return true
    }
    clean();
}

//绘完触发事件
function drawCompleted1(drawGeometryArgs) {
    //停止画面控制
    drawLine.deactivate();
    lineDownFlag = false;
    $("#huzhiPopup" + (lineDownNum - 2)).remove();
    $("#huzhiPopup" + (lineDownNum - 1)).remove();
    $("#huzhiPopup" + lineDownNum).remove();
    lineDownNum = 0;
    hzLength = 0;
    //all positions
    var positions = drawGeometryArgs.feature.geometry.components[0].components;
    console.log(positions);
    //caculate the distance
    var distance = 0;
    for (var i = 1; i < positions.length; i++) {
        temp = (positions[i].x - positions[i - 1].x) * (positions[i].x - positions[i - 1].x);
        temp += (positions[i].y - positions[i - 1].y) * (positions[i].y - positions[i - 1].y);
        distance += Math.sqrt(temp);
    }
    distance = distance.toFixed(2);
    addPopUp("cejuPopup",
        positions[positions.length - 1].x,
        positions[positions.length - 1].y,
        "测量结果:" + Math.abs(distance) + "m",
        drawColor,
        map);
    drawLine.deactivate();
}

/*----------------------------测多边形面积-----------------------------*/
function cmj() {
    drowLayer.style = {
        fillColor: drawColor,
        strokeColor: drawColor,
        strokeWidth: 2,
        graphicZIndex: 1,
        fillOpacity: 0.4
    };
    toolsNum = 11;
    vectorControl();
    clean();
    SuperMap.Handler.Path.prototype.down = function (a) {
        var b = this.stopDown;
        if (this.freehandMode(a)) {
            b = true;
            if (this.touch) {
                this.modifyFeature(a.xy, !!this.lastUp);
                SuperMap.Event.stop(a)
            }
        }
        if (!this.touch && (!this.lastDown || !this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance))) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        this.mouseDown = true;
        this.lastDown = a.xy;
        this.stoppedDown = b;
        return !b
    }
    SuperMap.Handler.Path.prototype.move = function (a) {
        if (this.stoppedDown && this.freehandMode(a)) {
            if (this.persist) {
                this.destroyPersistedFeature()
            }
            if (this.maxVertices && this.line && this.line.geometry.components.length === this.maxVertices) {
                this.removePoint();
                this.finalize()
            } else {
                this.addPoint(a.xy)
            }
            return false
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(a.xy, !!this.lastUp)
        }
        return true
    }
}

function drawPolygonCompleted1(eventArgs) {
    //all positions
    //获得图层几何对象
    var geometry = eventArgs.feature.geometry,
        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
        myMeasuerService = new SuperMap.REST.MeasureService(urlMap); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
    myMeasuerService.events.on({"processCompleted": measureCompleted});
    //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
    myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;

    myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
    var args = eventArgs;
    var geometry = args.feature.geometry.getBounds();
    //算出圆心
    var centerX = (geometry.right + geometry.left) / 2;
    var centerY = (geometry.top + geometry.bottom) / 2;

    //测量结束调用事件
    function measureCompleted(measureEventArgs) {
        var area = measureEventArgs.result.area,
            unit = measureEventArgs.result.unit;
        addPopUp("Polygon1",
            centerX,
            centerY,
            "面积：" + Math.abs(area.toFixed(2)) + " ㎡",
            "#fff",
            map);
    }

    drawPolygon.events.un({"featureadded": drawPolygonCompleted1});
    drawPolygon.deactivate();
}

/*----------------------------清除-----------------------------*/

//清除
function clean() {
    //注销
    deleteData('camerasList');
    deleteData('carsList');
    //清除maker
    markers.clearMarkers();
    //清除layer
    for (var i = 2; i < map.layers.length - 2; i++) {
        if (map.layers[i].removeAllFeatures) {
            map.layers[i].removeAllFeatures();
        }
    }
    $('#cam_list').hide();
    $('#car_list').hide();
    map.removeAllPopup();
    closeCameraPanel();
    closeMenuInfoWin();//关闭左键选中
    closeMenuInfoWinCar();
    selectFeature.activate();
    selectFeatureCar.activate();
    //remove();
}

function cleans() {
    toolsNum = 0;
    //清除maker
    closeMenuInfoWin();//关闭左键选中
    closeMenuInfoWinCar();
    markers.clearMarkers();
    //清除layer
    for (var i = 2; i < map.layers.length - 2; i++) {
        if (map.layers[i].removeAllFeatures) {
            map.layers[i].removeAllFeatures();
        }
    }
    map.removeAllPopup();
    vectorControl();
    $('#cam_list').hide();
    $('#car_list').hide();
    $('.carList').css({'top': '28%', 'z-index': '2'})
    map.events.un({'click': markClick});
    selectFeature.activate();
    selectFeatureCar.activate();
}

function cleanLayers() {
    //清除maker
    markers.clearMarkers();
    //清除layer
    for (var i = 2; i < map.layers.length - 2; i++) {
        if (map.layers[i].removeAllFeatures) {
            map.layers[i].removeAllFeatures();
        }
    }
    if (vectorLayer1) {
        vectorLayer1.removeFeatures(lineVector1);
    }
    remove();
}