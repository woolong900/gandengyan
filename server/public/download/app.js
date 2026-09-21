(() => {
  const root = document.documentElement;
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);
  const isEmbeddedBrowser = /micromessenger|weibo|qq\//.test(ua);
  const platform = isIOS ? 'ios' : (isAndroid ? 'android' : 'other');
  const detected = document.getElementById('installTitle');
  const compatibility = document.getElementById('compatibility');
  const browserTip = document.getElementById('browserTip');

  root.dataset.platform = platform;

  if (platform === 'ios') {
    detected.textContent = '已识别为 iPhone，推荐安装 iOS 版';
    compatibility.textContent = '如安装按钮无响应，请使用 Safari 打开本页';
  } else if (platform === 'android') {
    detected.textContent = '已识别为安卓手机，推荐下载 APK';
    compatibility.textContent = '下方同时保留 iPhone 安装入口';
  } else {
    detected.textContent = '请选择你的手机系统';
    compatibility.textContent = '支持 Android 手机与 iPhone';
  }

  if (isEmbeddedBrowser) {
    browserTip.classList.add('show');
    browserTip.addEventListener('click', () => browserTip.classList.remove('show'));
  }
})();
