# 视频专网GIS平台

[移动采集APP](https://github.com/zhanghao-blog/cameraInfoCollect)

### 前端技术：

- jquery
- boostrap
- jquery-jcImgScroll 轮播图插件
- bootstrap-treeview 树状列表展示插件
- bootstrap-typeahead 模糊查询插件
- jquery.table2excel exel导出

### js

1. config1 全局定义地图以及后台接口路径以及localstorage缓存时间
2. SuperMap.Include 超图 web SDK javasscript模块引用类库接口
3. mapLayerChange 初始化地图的图层，以及图层切换
4. mapTools 定义了右侧工具栏点击触发的相应方法
5. bufferService 生成相应缓存区，调用相应后台查询方法
6. cameraSelect JQuery ajax 调用多种摄像头选方法接口
7. cameraOperations 缓存摄像头数据（十分钟），摄像头鼠标事件：悬浮操作，左击弹出菜单（摄像头详情，派发任务，视频播放）
8. common 摄像头高亮以及菜单相应点击事件
9. carOperations 车辆相关操作

### 页面效果

![查询结果高亮定位信息展示](http://p13tmhwuq.bkt.clouddn.com/%E6%9F%A5%E8%AF%A2%E7%BB%93%E6%9E%9C%E9%AB%98%E4%BA%AE%E5%AE%9A%E4%BD%8D%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.png)

![鼠标浮选查询](http://p13tmhwuq.bkt.clouddn.com/%E9%BC%A0%E6%A0%87%E6%B5%AE%E9%80%89%E6%9F%A5%E8%AF%A2.png)

![详细信息](http://p13tmhwuq.bkt.clouddn.com/%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF.png)

![实时视频](http://p13tmhwuq.bkt.clouddn.com/%E5%AE%9E%E6%97%B6%E8%A7%86%E9%A2%91.png)


### 各种查询及缓冲区分析
- 线查询
![线查询](http://p13tmhwuq.bkt.clouddn.com/%E7%BB%98%E5%88%B6%E8%B7%AF%E7%BA%BF%E6%9F%A5%E8%AF%A2.png)
- 绘制路线缓冲区查询
![绘制路线宽度设置](http://p13tmhwuq.bkt.clouddn.com/%E7%BB%98%E5%88%B6%E8%B7%AF%E7%BA%BF%E5%AE%BD%E5%BA%A6%E8%AE%BE%E7%BD%AE.png)
- 矩形查询
![矩形查询](http://p13tmhwuq.bkt.clouddn.com/%E7%9F%A9%E5%BD%A2%E6%9F%A5%E8%AF%A2.png)
- 矩形缓冲区查询
![矩形缓冲区查询](http://p13tmhwuq.bkt.clouddn.com/%E7%9F%A9%E5%BD%A2%E7%BC%93%E5%86%B2%E5%8C%BA%E6%9F%A5%E8%AF%A2.png)
- 圆形查询
![圆形查询](http://p13tmhwuq.bkt.clouddn.com/%E5%9C%86%E5%BD%A2%E6%9F%A5%E8%AF%A2.png)
- 圆形缓冲区查询
![圆形缓冲区查询](http://p13tmhwuq.bkt.clouddn.com/%E5%9C%86%E5%BD%A2%E7%BC%93%E5%86%B2%E5%8C%BA%E6%9F%A5%E8%AF%A2.png)
- 多边形查询
![多边形查询](http://p13tmhwuq.bkt.clouddn.com/%E5%A4%9A%E8%BE%B9%E5%BD%A2%E6%9F%A5%E8%AF%A2.png)
- 多边形缓冲区查询
![多边形缓冲区查询](http://p13tmhwuq.bkt.clouddn.com/%E5%A4%9A%E8%BE%B9%E5%BD%A2%E7%BC%93%E5%86%B2%E5%8C%BA%E6%9F%A5%E8%AF%A2.png)
