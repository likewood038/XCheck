
window.addEventListener('DOMContentLoaded', () => {
    axios.get('/activity/listMyActivities')
        .then((response) => {
            console.log(response);
            data = response.data.data;
            document.getElementById('creator').textContent = data.name;

            activitys = data.activities;
            if (activitys.length != 0) {
                renderActivities(activitys);
                console.log(activitys);
            }
    })
    .catch(function (error) {
        alert("网络异常"+error, "error");
    });
});

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
            document.getElementById("modal").style.display = "flex";
            document.getElementById('checkin-title').textContent = activity.title;
            document.getElementById('checkin-total').textContent = "签到总数：0"
            // alert(`你点击了活动：${activity.title} id: ${activity.id}`, "success");
            // window.location.href = `index.html?activityId=${activity.id}`;
            axios.get('/checkin/list', {
                params: { activityId: activity.id }
            })
            .then((response) => {
                const checkins = response.data.data;

                if (checkins.length != 0) {
                    document.getElementById('checkin-total').textContent = "签到总数：" + checkins.length;
                    renderCheckins(checkins);
                    console.log(checkins);
                }
            })
            .catch(function (error) {
                alert("网络异常"+error, "error");
            });

        };

        card.innerHTML = `
            <div class="activity-title">${activity.title}</div>
            <div class="activity-desc">${activity.description}</div>
            <div class="activity-time">开始时间：${formatDate(activity.startTime)}</div>
            <div class="activity-time">结束时间：${formatDate(activity.endTime)}</div>
        `;
        container.appendChild(card);
    }
}

function renderCheckins(checkins) {
    const checkinTable = document.getElementById("checkin-table");
    
    for (var i = 0; i < checkins.length; i++) {
        const checkin = checkins[i];

        const item = document.createElement("tr");
        item.className = "checkin-item";

        item.innerHTML = `
            <td class="checin-username">${checkin.username}</td>
            <td class="checin-name">${checkin.name}</td>
            <td class="checin-checkinTime">${checkin.checkinTime}</td>
        `;
        checkinTable.appendChild(item);
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("checkin-table").innerHTML = '';
}
