
var loc =localStorage.getItem('location');
console.log(loc);

if (loc != null){

        //定位成功，根据距离请求所有活动
            axios.get('/activity/listByLocation', {
        // TODO: 改为当前定位坐标
            params: { 
                longitude : loc.split(',')[0],
                latitude : loc.split(',')[1]
            }
        }).then(function (response) {

            activitys = response.data.data; 
            if (activitys.length !=0){
                renderActivities(activitys);
                console.log(activitys);
            }

        })
        .catch(function (error) {
            alert("网络异常"+error, "error");
        });

  }else{
   

        //定位失败
        console.log("获取距离时，定位失败")
        axios.get('/activity/listByLocation', {
            // TODO: 改为当前定位坐标
            params: {}
        }).then(function (response) {

            activitys = response.data.data; 
            if (activitys.length !=0){
                renderActivities(activitys);
                console.log(activitys);
            }

        })
        .catch(function (error) {
            alert("网络异常"+error, "error");
        });

}

function formatDate(datetime) {
    return datetime.split(' ')[0]; // 只取日期部分
}

function renderActivities(activitys) {
    const container = document.getElementById("activityContainer");

    for (var i = 0; i < activitys.length; i++) {
        const activity = activitys[i];

        const card = document.createElement("div");
        card.className = "activity-card";

        card.onclick = () => {
            alert(`你点击了活动：${activity.title} id: ${activity.id}`, "success");
            window.location.href = `index.html?activityId=${activity.id}`;
        };
        if (activity.distance != null) {
            card.innerHTML = `
                <div class="activity-title">${activity.title}
                    <span class="activity-name">${activity.createName}</span>
                    <span class="activity-dist">${activity.distance.toFixed(1)}m</span>
                </div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">开始时间：${formatDate(activity.startTime)}</div>
                <div class="activity-time">结束时间：${formatDate(activity.endTime)}</div>
            `;
        } else {
            card.innerHTML = `
                <div class="activity-title">${activity.title}
                    <span class="activity-name">${activity.createName}</span>
                </div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">开始时间：${formatDate(activity.startTime)}</div>
                <div class="activity-time">结束时间：${formatDate(activity.endTime)}</div>
            `;
        }
        container.appendChild(card);
    }
    

}

// window.addEventListener('DOMContentLoaded', () => {
    
//     axios.get('/activity/list', {
//             params: {}
//         }).then(function (response) {

//             activitys = response.data.data; 
//             if (activitys.length !=0){
//                 renderActivities(activitys);
//                 console.log(activitys);
//             }

//         })
//         .catch(function (error) {
//             alert("网络异常"+error);
//         });
    
//     // axios.get('/activity/listByLocation', {
//     //     // TODO: 改为当前定位坐标
//     //     params: { 
//     //         longitude : 120.356059,
//     //         latitude : 30.312185
//     //     }
//     // }).then(function (response) {

//     //     activitys = response.data.data; 
//     //      if (activitys.length !=0){
//     //         renderActivities(activitys);
//     //         console.log(activitys);
//     //     }

//     // })
//     // .catch(function (error) {
//     //     alert("网络异常"+error);
//     // });
  
//     });






// function formatDate(datetime) {
//     return datetime.split(' ')[0]; // 只取日期部分
// }

// function renderActivities(activitys) {
//     const container = document.getElementById("activityContainer");

//     for (var i = 0; i < activitys.length; i++) {
//         const activity = activitys[i];

//         const card = document.createElement("div");
//         card.className = "activity-card";
//         card.id="card"+activity.id;

//         card.onclick = () => {
//             alert(`你点击了活动：${activity.title} id: ${activity.id}`);
//             window.location.href = `index.html?activityId=${activity.id}`;
//         };

//         card.innerHTML = `
//             <div class="activity-title">${activity.title}
//                 <span class="activity-name">${activity.createName}</span>
//                 <span class="activity-dist"></span>
//             </div>
//             <div class="activity-desc">${activity.description}</div>
//             <div class="activity-time">开始时间：${formatDate(activity.startTime)}</div>
//             <div class="activity-time">结束时间：${formatDate(activity.endTime)}</div>
//         `;
//         container.appendChild(card);
//     }
    

// }

// function navigateTo(page) {
//     alert("Navigate to: " + page);
// }

// function updatedistance(activityId, distance) {
//   // 通过 activityId 获取对应的 card
//   const card = document.getElementById("card"+activityId);
//   if (card) {
//     // 在该 card 内部查找 class="activity-desc" 的 div
//     const descDiv = card.querySelector(".activity-dist");
//     if (descDiv) {
//       descDiv.textContent = distance.toFixed(1)+"m";
//     }
//   }
// }



// AMap.plugin('AMap.Geolocation', function() {
//     var geolocation = new AMap.Geolocation({
//         enableHighAccuracy: true,//是否使用高精度定位，默认:true
//         timeout: 10000,          //超过10秒后停止定位，默认：5s
//         position:'RB',    //定位按钮的停靠位置
//         offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
//     });
//     geolocation.getCurrentPosition(function(status,result){
//         if(status=='complete'){
//             //定位成功，根据距离请求所有活动
//             axios.get('/activity/listByLocation', {
//                 params: { 
//                     longitude : result.position.lng,
//                     latitude : result.position.lat
//                 }
//             }).then(function (response) {

//                 activitys = response.data.data; 
//                 if (activitys.length !=0){

//                     for (let index = 0; index < activitys.length; index++) {
//                         updatedistance(activitys[index].id, activitys[index].distance);
//                     }
                    
//                 }

//             })
//             .catch(function (error) {
//                 alert("请求距离数据失败"+error);
//             });
            
//         }else{
//             //定位失败
//             console.log("获取距离时，定位失败")
//         }
//     });
// });