﻿(function (w) {
    //地图接口
    // w.localhost = 'http://211.103.178.205:8090';
    w.localhost = 'http://211.103.178.205:8090';
    //后台接口
    // w.urlName1 = 'http://police.xiaofen809.com:8080';
    w.urlName = 'http://211.103.178.205:8081';
    //w.urlName = 'http://192.168.1.200:8081';
    //地图图层
    //w.urlMap = localhost + '/iserver/services/map-XC_ZW/rest/maps/XCZW2017DLG';
    //影像地图
    w.urlPhotoMap = localhost + '/iserver/services/map-XC_ZW/rest/maps/XCZW2017DOM';
    //摄像头图层
    w.urlCamera = localhost + '/iserver/services/map-xc_baymin/rest/maps/camera@192.168.1.200_xc_baymin1';
    //影像地图摄像头图层
    w.urlCameraPhoto = localhost + '/iserver/services/map-xc_baymin/rest/maps/camera@192.168.1.200_xc_baymin2';
    //车辆图层
    w.urlCar = localhost + '/iserver/services/map-car/rest/maps/car01';
    //影像地图车辆图层
    w.urlCarPhoto = localhost + '/iserver/services/map-car/rest/maps/car02';

//  //地图图层
    w.urlMap = localhost + '/iserver/services/map-ugcv5-XCZW2017DLG/rest/maps/XCZW2017DLG';
//  //影像地图
    w.urlPhotoMap = localhost + '/iserver/services/map-ugcv5-XCZW2017DOM/rest/maps/XCZW2017DOM';
//  //摄像头图层
//  w.urlCamera = localhost + '/iserver/services/map-ugcv5-camera1921681200xcbaymin1/rest/maps/camera@192.168.1.200_xc_baymin1';
//  //影像地图摄像头图层
//  w.urlCameraPhoto = localhost + '/iserver/services/map-ugcv5-camera1921681200xcbaymin2/rest/maps/camera@192.168.1.200_xc_baymin2';
//  //车辆图层
//  w.urlCar = localhost + '/iserver/services/map-ugcv5-car01/rest/maps/car01';
//  //影像地图车辆图层
//  w.urlCarPhoto = localhost + '/iserver/services/map-ugcv5-car02/rest/maps/car02';

    //摄像头缓存时间
    w.cameraCacheTime = 10 * 60 * 1000;
    //车辆缓存时间
    w.carCacheTime = 10 * 60 * 1000;
})(window);
