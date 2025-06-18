// 获取错误容器
const errorContainer = document.getElementById('errorContainer');

// 错误弹窗计数器
let errorCounter = 0;

// 显示错误弹窗函数
function showAlertModal(message, type = 'error') {
  // 为新弹窗创建唯一ID
  const modalId = `error-modal-${errorCounter++}`;
  
  // 根据类型设置图标和样式
  let icon, bgColor, borderColor, textColor;

  if (type === 'success') {
    icon = '✅';
    bgColor = '#e8f5e9'; // 淡绿色背景
    borderColor = '#c8e6c9'; // 绿色边框
    textColor = '#2e7d32'; // 深绿色文字
  } else {
    // 默认错误类型
    icon = '❌';
    bgColor = '#ffebee'; // 淡红色背景
    borderColor = '#f8cacc'; // 红色边框
    textColor = '#b71c1c'; // 深红色文字
  }

  // 创建新的弹窗元素
  const alertModal = document.createElement('div');
  alertModal.className = 'alert-modal';
  alertModal.id = modalId;
  alertModal.style.backgroundColor = bgColor;
  alertModal.style.borderColor = borderColor;
  alertModal.innerHTML = `
    <span class="close-icon">&times;</span>
    <span class="alert-icon">${icon}</span>
    <p class="alert-message" style="color: ${textColor};">${message}</p>
  `;
  
  // 添加到容器中
  errorContainer.appendChild(alertModal);

  // 等待DOM渲染后添加show类，触发动画
  setTimeout(() => {
    alertModal.classList.add('show');
  }, 10);

  // 设置5秒后自动关闭
  const autoCloseTimer = setTimeout(() => {
    hideAlertModal(alertModal);
  }, 5000);

  // 为关闭图标添加点击事件
  const closeIcon = alertModal.querySelector('.close-icon');
  closeIcon.style.color = textColor;
  closeIcon.addEventListener('click', () => {
    clearTimeout(autoCloseTimer);
    hideAlertModal(alertModal);
  });

  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
}

// 隐藏弹窗函数
function hideAlertModal(alertModal) {
  // 添加closing类，触发关闭动画
  alertModal.classList.remove('show');
  alertModal.classList.add('closing');

  // 动画结束后移除元素
  setTimeout(() => {
    if (alertModal.parentNode) {
      alertModal.parentNode.removeChild(alertModal);
    }
  }, 300);
}

// 重写window.alert方法 - 添加类型参数
  const originalAlert = window.alert;
  window.alert = function(message, type = 'error') {
    if (errorContainer) {
      return showAlertModal(message, type);
    } else {
      return originalAlert(message);
    }
  };