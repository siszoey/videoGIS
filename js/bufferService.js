//points为矢量点数组
//point.push(new SuperMap.Geometry.Point(positions[i].x, positions[i].y))
function buffer(points, len) {
    if (layerFlagNum == 0) {
        return;
    }
    console.log(layerFlagNum)
    //len = parseFloat(len)
    window.len = len;
    if (toolsNum == 2) {
        map.removeAllPopup();
        resultLayer.removeAllFeatures();
        var sides = 360, r = 360, angel = 360;
        //获取圆上的点
        var rR = r * Math.PI / (180 * sides);
        var rotatedAngle, x, y;
        var circlePoints = [];
        for (var i = 0; i < sides; ++i) {
            rotatedAngle = rR * i;
            x = points[0].x + (len * Math.cos(rotatedAngle));
            y = points[0].y + (len * Math.sin(rotatedAngle));
            circlePoints.push(new SuperMap.Geometry.Point(x, y));
        }
        var pathFeature = new SuperMap.Feature.Vector();
        var Line = new SuperMap.Geometry.LineString(circlePoints);
        pathFeature.geometry = Line;
        pathFeature.style = {
            strokeColor: drawColor,
            strokeWidth: 2,
            pointerEvents: "visiblePainted",
            fillColor: drawColor,
            fillOpacity: 0.8
        };
        resultLayer.addFeatures(pathFeature);
        //从服务端拉去选中的数据   摄像头查询
        cameraSelectCircle(points[0].x, points[0].y, buffer_length, function (cameras) {
            if (layerFlagNum == 2) {
                return
            }
            if (cameras.length > 0) {
                openCameraPanel(cameras);
            } else {
                console.log("no camera selected");
            }
        });
        //汽车查询
        carSelectCircle(points[0].x, points[0].y, buffer_length, function (cars) {
            if (layerFlagNum == 1) {
                return
            }
            if (cars.length > 0) {
                openCarPanel(cars);
            } else {
                console.log("no car selected");
            }
        });
    } else {
        for (var i = 0; i < cam_selectId.length; i++) {
            $("#" + cam_selectId[i]).remove();
        }
        for (var i = 0; i < car_selectId.length; i++) {
            $("#" + car_selectId[i]).remove();
        }
        if (toolsNum == 1) {
//      	if(len==0){
//      		cameraSelectLine(points,len,callback(cameras){
//      			if(cameras.length>0){
//		                openCameraPanel(cameras);
//		            } else{
//		                console.log("no camera selected");
//		            }
//      		});
//      		carSelectLine(points,len,callback(cars){
//      			if(cars.length>0){
//		                openCarPanel(cars);
//		            } else{
//		                console.log("no car selected");
//		            }
//      		});
//      		return;
//      	}
            //resultLayer.removeAllFeatures();
            var pathFeature = new SuperMap.Feature.Vector();
            var Line = new SuperMap.Geometry.LineString(points);
            pathFeature.geometry = Line;
            resultLayer.addFeatures(pathFeature);
            bufferAnalystProcess(Line, len);

        } else if (toolsNum > 1 && toolsNum < 6) {
            console.log('00000')
            linearRings = new SuperMap.Geometry.LinearRing(points),
                region = new SuperMap.Geometry.Polygon([linearRings]);
            bufferAnalystProcess(region, len);
            if (len == 0) {
                if (toolsNum == 3) {
                    //绘制矩形查询
                    cameraSelectReact(parseFloat(leftTopX - len), parseFloat(leftTopY - len), parseFloat(rightBottomX + len), parseFloat(rightBottomY + len), function (cameras) {
                        if (layerFlagNum == 2) {
                            return
                        }
                        if (cameras.length > 0) {
                            openCameraPanel(cameras);
                        } else {
                            console.log("no camera selected");
                        }
                    })
                    carSelectReact(parseFloat(leftTopX - len), parseFloat(leftTopY - len), parseFloat(rightBottomX + len), parseFloat(rightBottomY + len), function (cars) {
                        if (layerFlagNum == 1) {
                            return
                        }
                        if (cars.length > 0) {
                            openCarPanel(cars);
                        } else {
                            console.log("no car selected");
                        }
                    })
                }
                else if (toolsNum == 4) {
                    //绘制的圆形查询
                    //摄像头查询
                    cameraSelectCircle(circleCenterX, circleCenterY, parseFloat(circleRadius) + len, function (cameras) {
                        if (layerFlagNum == 2) {
                            return
                        }
                        if (cameras.length > 0) {
                            openCameraPanel(cameras);
                        } else {
                            console.log("no camera selected");
                        }
                    })
                    //汽车查询
                    carSelectCircle(circleCenterX, circleCenterY, parseFloat(circleRadius) + len, function (cars) {
                        if (layerFlagNum == 1) {
                            return
                        }
                        if (cars.length > 0) {
                            openCarPanel(cars);
                        } else {
                            console.log("no car selected");
                        }
                    })
                } else {
                    //绘制的多边形查询
                    var polPoints = [];
                    for (var i = 0; i < points.length; i++) {
                        var temp = {};
                        temp.X = points[i].y;
                        temp.Y = points[i].x;
                        polPoints.push(temp);
                    }
                    //摄像头查询
                    cameraSelectPolygon(polPoints, function (cameras) {
                        if (layerFlagNum == 2) {
                            return
                        }
                        if (cameras.length > 0) {
                            openCameraPanel(cameras);
                        } else {
                            console.log("no camera selected");
                        }
                    });
                    //汽车查询
                    carSelectPolygon(polPoints, function (cars) {
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
            }
        }
//          else if(toolsNum==4){
//              //
//          }else{
//              var leng=Math.pow((len*len)/2, 0.5);
//              var polPoints=[];
//              for(var i=0; i<polygonPoints.length; i++){
//                  var temp ={};
//                  temp.X = polygonPoints[i].X+leng;
//                  temp.Y = polygonPoints[i].Y+leng;
//                  polPoints.push(temp);
//              }
//          }
    }
}

// }
//对生成的线路进行缓冲区分析
function bufferAnalystProcess(Line, len) {
    if (len == 0) {
        resultLayer.removeAllFeatures();
        return;
    }
    styleRegion = {
        strokeColor: drawColor,
        strokeWidth: 2,
        pointerEvents: "visiblePainted",
        fillColor: drawColor,
        fillOpacity: 0.4
    };
    bufferDistance = new SuperMap.REST.BufferDistance({
        value: len
    }),
        bufferSetting = new SuperMap.REST.BufferSetting({
            endType: SuperMap.REST.BufferEndType.ROUND,
            leftDistance: bufferDistance,
            rightDistance: bufferDistance,
            semicircleLineSegment: 30
        }),
        geoBufferAnalystParam = new SuperMap.REST.GeometryBufferAnalystParameters({
            sourceGeometry: Line,
            bufferSetting: bufferSetting
        });

    url2 = localhost + "/iserver/services/spatialAnalysis-car/restjsr/spatialanalyst";
    var bufferServiceByGeometry = new SuperMap.REST.BufferAnalystService(url2);
    bufferServiceByGeometry.events.on(
        {
            "processCompleted": bufferAnalystCompleted
        });
    bufferServiceByGeometry.processAsync(geoBufferAnalystParam);
}

var bufferfeature = new SuperMap.Feature.Vector();

function bufferAnalystCompleted(BufferAnalystEventArgs) {
    resultLayer.removeFeatures(bufferfeature);
    bufferResultGeometry = BufferAnalystEventArgs.result.resultGeometry;
    window.allPoints = bufferResultGeometry.components[0].components[0].components;
    bufferfeature.geometry = bufferResultGeometry;
    bufferfeature.style = styleRegion;
    resultLayer.addFeatures(bufferfeature);
    console.log('00000')
    if (toolsNum == 1) {
        //绘制线路查询
        var polPoints = [];
        for (var i = 0; i < allPoints.length; i++) {
            var temp = {};
            temp.X = allPoints[i].y;
            temp.Y = allPoints[i].x;
            polPoints.push(temp);
        }
        //摄像头查询
        cameraSelectPolygon(polPoints, function (cameras) {
            if (layerFlagNum == 2) {
                return
            }
            if (cameras.length > 0) {
                openCameraPanel(cameras);
            } else {
                console.log("no camera selected");
            }
        });
        //汽车查询
        carSelectPolygon(polPoints, function (cars) {
            if (layerFlagNum == 1) {
                return
            }
            if (cars.length > 0) {
                openCarPanel(cars);
            } else {
                console.log("no car selected");
            }
        });
        // lineFlag=false;
    } else if (toolsNum > 1 && toolsNum < 6) {
        if (toolsNum == 3) {
            //绘制矩形查询
            cameraSelectReact(parseFloat(leftTopX - len), parseFloat(leftTopY - len), parseFloat(rightBottomX + len), parseFloat(rightBottomY + len), function (cameras) {
                if (layerFlagNum == 2) {
                    return
                }
                if (cameras.length > 0) {
                    openCameraPanel(cameras);
                } else {
                    console.log("no camera selected");
                }
            })
            carSelectReact(parseFloat(leftTopX - len), parseFloat(leftTopY - len), parseFloat(rightBottomX + len), parseFloat(rightBottomY + len), function (cars) {
                if (layerFlagNum == 1) {
                    return
                }
                if (cars.length > 0) {
                    openCarPanel(cars);
                } else {
                    console.log("no car selected");
                }
            })
        }
        else if (toolsNum == 4) {
            //绘制的圆形查询
            //摄像头查询
            cameraSelectCircle(circleCenterX, circleCenterY, parseFloat(circleRadius) + len, function (cameras) {
                if (layerFlagNum == 2) {
                    return
                }
                if (cameras.length > 0) {
                    openCameraPanel(cameras);
                } else {
                    console.log("no camera selected");
                }
            })
            //汽车查询
            carSelectCircle(circleCenterX, circleCenterY, parseFloat(circleRadius) + len, function (cars) {
                if (layerFlagNum == 1) {
                    return
                }
                if (cars.length > 0) {
                    openCarPanel(cars);
                } else {
                    console.log("no car selected");
                }
            })
        } else {
            //绘制的多边形查询
            var polPoints = [];
            for (var i = 0; i < allPoints.length; i++) {
                var temp = {};
                temp.X = allPoints[i].y;
                temp.Y = allPoints[i].x;
                polPoints.push(temp);
            }
            //摄像头查询
            cameraSelectPolygon(polPoints, function (cameras) {
                if (layerFlagNum == 2) {
                    return
                }
                if (cameras.length > 0) {
                    openCameraPanel(cameras);
                } else {
                    console.log("no camera selected");
                }
            });
            //汽车查询
            carSelectPolygon(polPoints, function (cars) {
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
    }
}
