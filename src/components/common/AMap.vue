<template>
    <div>
        <div class="ci-map-search-wrap">
            <input placeholder="输入地址名称进行搜索" ref="tipinput" class="" type="text">
        </div>
    </div>
</template>
<script>
    var mapLoader = require('../../common/AMap.js');
    export default {
        replace: true,
        mounted() {
            var _this = this;
            mapLoader('3493c186f482d23f0fd456c2c4c93d87').then(AMap => {
                //地图加载
                _this.map = new AMap.Map(_this.$el, {
                    resizeEnable: true
                });
                //输入提示
                var autoOptions = {
                    input: this.$refs.tipinput
                };
                AMap.plugin(['AMap.Geolocation', 'AMap.ToolBar', 'AMap.Geocoder', 'AMap.CitySearch', 'AMap.Autocomplete','AMap.PlaceSearch'], function() {
                    //定位
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,               //是否使用高精度定位，默认:true
                        timeout: 10000,                         //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20),   //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,                  //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition:'RB'
                    });
                    _this.map.addControl(geolocation);
                    geolocation.getCurrentPosition();

                    //关键字搜索
                    var auto = new AMap.Autocomplete(autoOptions);
                    var placeSearch = new AMap.PlaceSearch({
                        map: _this.map
                    });  //构造地点查询类
                    AMap.event.addListener(auto, "select", function(e){
                        placeSearch.setCity(e.poi.adcode);
                        placeSearch.search(e.poi.name);  //关键字查询查询
                    });//注册监听，当选中某条记录时会触发

                    AMap.event.addListener(placeSearch, "markerClick", function(e,result){
                        var resultData = e.data;
                         _this.$emit('getMapData',resultData);
                    })

                    //工具条
                    var toolBar = new AMap.ToolBar({
                        visible: true
                    });
                    _this.map.addControl(toolBar);

                    var citysearch = new AMap.CitySearch(); //获取当前城市信息
                    citysearch.getLocalCity(function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.city && result.bounds) {
                                _this.cityinfo = result.city;
                                var citybounds = result.bounds;
                                _this.map.setBounds(citybounds);
                                _this.map.setZoom(15);
                            }
                        } else {}
                    });
                    var geocoder = new AMap.Geocoder({
                        batch: true
                    });
                    var marker = new AMap.Marker({
                        map: _this.map,
                        bubble: true
                    });
                    _this.map.on('click', function(e) {
                        marker.setPosition(e.lnglat);
                        geocoder.getAddress(e.lnglat, function(status, result) {
                            var address = "无法获取地址";
                            var location = null;
                            if (status == 'complete') {
                                address = result.regeocode.formattedAddress;
                                location = e.lnglat;
                            }
                            var addressObj = {
                                status: status,
                                location: location,
                                address: address,
                                result: result
                            }
                            _this.$emit('getMapData',addressObj);
                        })
                    })
                })
            })
        }
    }
</script>
<style lang="less" scope>
    .ci-map-search-wrap{
        position: absolute;
        right: 15px;
        top: 15px;
        width: 285px;
        z-index: 1130;
        height: 36px;
        border: 1px solid #eee;
        border-radius: 4px;
        box-shadow: 1px 1px 2px 0 rgba(56,56,56,.66);
        input{
            width: 283px;
            display: block;
            text-indent: 5px;
            float: left;
            height: 100%;
            border: none;
            outline: 0;
        }
    }
    
</style>