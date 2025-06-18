
var map = new AMap.Map('gd-map', {
      center: [120.35877795241751, 30.318096371636983], 
      zoom: 15,
      showIndoorMap: false,
    });


var isCheckinpanelOpen = false;
var isCreatepanelOpen = false;
var checkWhichActivity = -1;
var height = window.innerHeight;


window.addEventListener('DOMContentLoaded', () => {
    const targetActIDFromUrl = new URLSearchParams(window.location.search).get("activityId");
    if (targetActIDFromUrl) {
        checkWhichActivity = targetActIDFromUrl; // 
        //清空url参数
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', baseUrl);

    }
});

map.on('click', clickonmap);
function clickonmap(e){
    if (isCheckinpanelOpen){
        closeCheckInPanel();
    }

    if(isCreatepanelOpen){
        //console.log((e.lnglat.getLng(),e.lnglat.getLat()))
        setActMarker(e.lnglat.getLng(),e.lnglat.getLat());
    }
}




function showAllActivityonMap() {
    axios.get('/activity/list', {
        params: {}
    })
    .then(function (response) {
        activitys = response.data.data; 
        var points=[];
        var texts=[];
        if (activitys.length !=0){
            for (var i=0;i<activitys.length;i++){
                //a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png
                var marker = new AMap.Marker({
                    position: new AMap.LngLat(activitys[i].location.longitude, activitys[i].location.latitude),
                    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                    offset: new AMap.Pixel(-25, -60),
                    zooms:[13.8,20],
                    extData:{id : activitys[i].id},
                    //显示活动标题(丑)
                    // label:{content:activitys[i].title,direction:"bottom"}
                });
                marker.on('click', showMarkerDetail);
                points.push(marker);

                var titletext = new AMap.Text({
                    text:activitys[i].title,
                    anchor:'top-center', // 设置文本标记锚点
                    draggable:false,
                    clickable:false,
                    zooms:[13.8,20],
                    offset:[0,5],
                    style:{
                        'padding': '4px 8px',
                        'margin-bottom': '1rem',
                        'border-radius': '8px',
                        'background-color': '#f0f0f0',
                        'width': '7em',
                        'border-width': 0,
                        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                        'text-align': 'center',
                        'font-size': '10px',
                        'color': '#333',
                        'overflow':'hidden',
                    },
                    position: [activitys[i].location.longitude,activitys[i].location.latitude]
                });
                texts.push(titletext);


            }

            map.add(points);
            map.add(texts);
            //用于加载完成点后，如果是从全部活动列表跳过来的，就显示相应的详情
            if (checkWhichActivity !=-1){
                console.log(checkWhichActivity);
                openCheckInPanel(checkWhichActivity);
            }
        }
    })
    .catch(function (error) {
        alert("网络异常"+error, "error");
    });
}




function showMarkerDetail(){
    id = this.getExtData().id;
    openCheckInPanel(id);
}

function showSelfPositionOnMap(){

}


function closeCheckInPanel(){

    checkWhichActivity = -1;
    isCheckinpanelOpen = false;
    document.getElementById("checkin-card").classList.remove("active");
    map.clearMap();

    showAllActivityonMap();
    document.getElementById("actDetailForm").reset()
    
}

function openCheckInPanel(act_id){
    var overlays = map.getAllOverlays("circle");
    map.remove(overlays);
    document.documentElement.scrollTop = 0;
    document.getElementById("checkin-card").classList.add("active");
    isCheckinpanelOpen = true;
    // console.log(url+'/activity/' + act_id);
    axios.get('/activity/' + act_id)
    .then(function (response) {
        console.log(response)
        response = response.data.data;

        document.getElementById('creator').textContent = response.createName;
        document.getElementById('title').textContent = response.title;
        document.getElementById('description').textContent = response.description;
        document.getElementById('radius').textContent = response.radius;
        document.getElementById('startTime').textContent = response.startTime;
        document.getElementById('endTime').textContent = response.endTime;
        document.getElementById('actID').textContent = response.id;
        
        var circle = new AMap.Circle({
            center: new AMap.LngLat(response.location.longitude,response.location.latitude),//new AMap.LngLat("116.403322", "39.920255"), // 圆心位置
            radius: response.radius,  //半径/m
            strokeColor: "#F33",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 3,  //线粗细度
            fillColor: "#ee2200",  //填充颜色
            fillOpacity: 0.35, //填充透明度
        });
        map.add(circle);
        map.setFitView([circle],false,[0,0.25*height,50,50],18);//调整视角


    })
    .catch(function (error) {
        console.log(error);
        alert("获取活动详情失败。"+error, "error");
    });

}

var create_marker;
var create_circle;
function openCreatePanel(){
    document.getElementById("create-card").classList.add("active");
    isCreatepanelOpen = true;
    map.clearMap();
    //todo:上移地图中心点
    
    create_marker = new AMap.Marker({
        position: null,
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-25, -60),
        clickable:false,
        visible:false
    });
    map.add(create_marker);

    create_circle = new AMap.Circle({
        center: null,//new AMap.LngLat("116.403322", "39.920255"), // 圆心位置
        radius: 50,  //半径/m
        strokeColor: "#F33",  //线颜色
        strokeOpacity: 1,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#ee2200",  //填充颜色
        fillOpacity: 0.35, //填充透明度
        visible:false
    });
    create_circle.on('click', clickonmap);
    map.add(create_circle);
}

function closeCreatepanel(){
    document.getElementById("create-card").classList.remove("active");
    document.getElementById("creatActForm").reset()
    
    map.clearMap();
    showAllActivityonMap();

}


function setActMarker(lng,lat){
   
   
    pos = new AMap.LngLat(lng,lat);

    document.getElementById("create-position").value =lng+","+lat;

    create_marker.setPosition(pos);
    create_circle.setCenter(pos);

    create_marker.show();
    create_circle.show();
    
}


const radiusSlider = document.getElementById('create-checkinRadius');
const radiusValue = document.getElementById('create-radiusValue');
radiusSlider.addEventListener('input', function () {
    radiusValue.textContent = radiusSlider.value;
    create_circle.setRadius(radiusSlider.value)
});


//提交活动创建表单
document.getElementById('creatActForm').addEventListener('submit', function (e) {
    e.preventDefault(); // 阻止自动刷新
    const positionStr = document.getElementById("create-position").value.trim(); // "lng,lat"
    if (positionStr==""){
        alert("请选择位置", "error");
        return;
    }
    const title = document.getElementById("create-activityTitle").value;
    const description = document.getElementById("create-activityDescription").value;
    const [longitude, latitude] = positionStr.split(',').map(Number);
    const radius =parseInt(document.getElementById("create-checkinRadius").value);
    const startTime = document.getElementById("create-startTime").value.replace('T', ' ') + ':00';
    const endTime = document.getElementById("create-endTime").value.replace('T', ' ') + ':00';
    const data = {
        title: title,
        description: description,
        radius: radius,
        startTime: startTime,
        endTime: endTime,
        location: {
        longitude: longitude,
        latitude: latitude
        }
    };
    console.log(data);

    //const data = { name: 'Alice', age: 30 };

    axios.post('/activity', data)
    .then(response => {
        console.log(response.data);
        closeCreatepanel();
    })
    .catch(error => {
        
        alert("创建失败请重试。原因："+error, "error");
        
        console.error(error);
    });
});

//发起签到
function checkin(){

    var ID = document.getElementById('actID').textContent;//签到按钮必须在详情页面点,所以在这里获取一次就行
    // if (ID==""){
    //     alert("kong");
    // }else{
    //     alert(ID);
    // }
    loc = localStorage.getItem('location');
    if (loc !=null){
            data={
            "activityId": parseInt(ID),
            "location": {
                "longitude": Number(loc.split(',')[0]),
                "latitude": Number(loc.split(',')[1])
            }};
            console.log("准备用"+loc);

            axios.post('/checkin', data)
            .then(response => {
                response=response.data;
                if (response.code==1){
                    alert("签到成功", "success");
                    console.log(response);
                }else{
                    alert("错误：" + response.msg, "error");
                }

            })
            .catch(error => {
                alert("签到失败请重试。原因：" + error, "error");
            });
    }else{
        alert("无法获取定位信息", "error");
    }

}


//初始化地图
showAllActivityonMap();

// 全局 请求 拦截器（所有请求都会触发）
// axios.interceptors.request.use(
//   (config) => {
//     // 示例：在请求头中添加 Token
//     const token = localStorage.getItem('token');
//     console.log(`当前token: ${token}`);
//     if (token) {
//       config.headers.token = token;
//     }
//     return config; // 必须返回 config，否则请求会被中断
//   },
//   (error) => {
//     return Promise.reject(error); // 处理请求错误（如超时）
//   }
// );

// // 全局 响应 拦截器（所有响应都会触发）
// axios.interceptors.response.use(
//   (response) => {
//     // // 示例：处理成功响应（如过滤无效数据）
//     // if (response.data.code === 200) {
//     //   return response.data.data; // 返回处理后的数据
//     // }
//     return response;
//   },
//   (error) => {
//     // 处理错误响应（如 401、500 状态码）
//     if (error.response) {
//       const status = error.response.status;
//       switch (status) {
//         case 401: // 未认证，跳转登录页
//           localStorage.removeItem('token'); // 清除登录状态
//           window.location.href = '/xlogin.html'; // 原生 JS 跳转页面
//           break;
//         case 403: // 禁止访问
//           alert('权限不足');
//           break;
//         case 500: // 服务器错误
//           alert('服务器内部错误');
//           break;
//       }
//     }
//     return Promise.reject(error); // 继续抛出错误，可在调用处捕获
//   }
// );
