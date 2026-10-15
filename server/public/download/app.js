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
    detected.textContent = '已识别为 iPhone，推荐安装 iOS 原生版';
    compatibility.textContent = '也可使用下方 PWA 网页版，无需安装包';
  } else if (platform === 'android') {
    detected.textContent = '已识别为安卓手机，推荐下载 APK';
    compatibility.textContent = '下方同时提供免安装 PWA 网页版';
  } else {
    detected.textContent = '请选择下载客户端或打开网页版';
    compatibility.textContent = '支持 Android、iOS 客户端与 PWA 网页版';
  }

  if (isEmbeddedBrowser) {
    browserTip.classList.add('show');
    browserTip.addEventListener('click', () => browserTip.classList.remove('show'));
  }
})();
