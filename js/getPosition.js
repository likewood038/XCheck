//此文件要加在填写了高德key的脚本链接后面，



var now_position=[null, null];//lng,lat
AMap.plugin('AMap.Geolocation', function() {
    var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        position:'RB',    //定位按钮的停靠位置
        offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
        showCircle: false,
        zoomToAccuracy:false,
        panToLocation:false
    });
    if(map){map.addControl(geolocation);}//给主页面的地图上添加自己的标记

    var locationerror=0;//记录失败定位次数
    var intervalId = setInterval(() => {
        
        geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
                    localStorage.setItem('location',result.position.lng+","+result.position.lat);

                    console.log("当前位置："+result.position.lng+","+result.position.lat);
                //周期定位成功执行
                //onComplete(result)
            }else{
                locationerror +=1;
                console.log(`第${locationerror}次定位失败`)
                if (locationerror>10){
                    intervalId = clearInterval(intervalId);//关闭周期定位
                    alert("定位多次失败", "error");
                }
                //周期定位失败执行
                //
            }
            
        });
        
    }, 20000); //周期时间
    //首次定位
    geolocation.getCurrentPosition(function(status,result){
        
        if(status=='complete'){
            localStorage.setItem('location',result.position.lng+","+result.position.lat);

            console.log("第一次当前位置："+result.position.lng+","+result.position.lat);
            //onComplete(result)
        }else{
            console.log('失败原因排查信息:'+result.message+'</br>浏览器返回信息：'+result.originMessage)
            //onError(result)
            //关闭周期定位
        }
    });
});