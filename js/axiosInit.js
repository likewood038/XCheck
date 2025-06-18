axios.defaults.baseURL = "【你的后端api地址】"


// 全局 请求 拦截器（所有请求都会触发）
axios.interceptors.request.use(
  (config) => {
    // 示例：在请求头中添加 Token
    const token = localStorage.getItem('token');
    console.log(`当前token: ${token}`);
    if (token) {
      config.headers.token = token;
    }
    return config; // 必须返回 config，否则请求会被中断
  },
  (error) => {
    return Promise.reject(error); // 处理请求错误（如超时）
  }
);

// 全局 响应 拦截器（所有响应都会触发）
axios.interceptors.response.use(
  (response) => {
    // // 示例：处理成功响应（如过滤无效数据）
    // if (response.data.code === 200) {
    //   return response.data.data; // 返回处理后的数据
    // }
    return response;
  },
  (error) => {
    // 处理错误响应（如 401、500 状态码）
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401: // 未认证，跳转登录页
          localStorage.removeItem('token'); // 清除登录状态
          window.location.href = '/xlogin.html'; // 原生 JS 跳转页面
          break;
        case 403: // 禁止访问
          alert('权限不足', "error");
          break;
        case 500: // 服务器错误
          alert('服务器内部错误', "error");
          break;
      }
    }
    return Promise.reject(error); // 继续抛出错误，可在调用处捕获
  }
);