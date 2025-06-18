
let isRegisterMode = false;

function toggleMode() {
  isRegisterMode = !isRegisterMode;

  // 显示或隐藏昵称字段组
  document.getElementById("nameGroup").classList.toggle("d-none", !isRegisterMode);

  // 改变按钮文字
  document.getElementById("submitBtn").innerText = isRegisterMode ? "注册" : "登录";

  // 改变切换提示文字
  document.getElementById("toggleText").innerText = isRegisterMode
    ? "已有账号？立即登录"
    : "还没有账号？立即注册";
}

function handleSubmit() {
  //注册
  const userID = document.getElementById("user-ID").value;
  const password = document.getElementById("password").value;

  if (isRegisterMode) {
    const name = document.getElementById("name").value;

    // 非空校验
    if (!userID || !name || !password) {
      alert("请填写所有注册信息（学号、用户名和密码）", "error");
      return;
    }

    alert(`注册信息：\n学号：${userID}\n用户名：${name}\n密码：${password}`, "success");
 
    data = {
      username: userID,
      password: password,
      name: name
    };

    console.log(data);
    axios.post('/user/register', data,{})
      .then(response => {

        response=response.data
        console.log(response);
        if(response.code ==1){
          //todo注册成功后的逻辑
          
          localStorage.setItem('token', response.data.token);
          //const token = localStorage.getItem('token');
          
          window.location.href='index.html';

        }else{

          alert(response.msg+",请重试", "error");
        }
      })
      .catch(error => {
        alert("注册失败请重试。原因：" + error, "error");
        console.error(error);

      });


  } else {
    //登录
    if (!userID || !password) {
      alert("请填写学号和密码", "error");
      return;
    }

    // alert(`登录信息：\n学号：${userID}\n密码：${password}`, "success");
    logindata={
      username: userID,
      password: password
    }
    axios.post('/user/login', logindata,{})
    .then(response => {

      response = response.data;
      console.log(response);
      if(response.code ==1){
        //todo登录成功后的逻辑

        localStorage.setItem('token', response.data.token);
        //const token = localStorage.getItem('token');

        window.location.href='index.html';

      }else{

        alert(response.msg+",请重试", "error");
      }

    })
    .catch(error => {
      alert("登录失败请重试。原因：" + error, "error");
      console.error(error);
    });
    


  }
}
