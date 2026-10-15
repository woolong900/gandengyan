#!/usr/bin/env node
/** Turn a Cocos Creator web-mobile build into an installable PWA. */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BUILD = path.resolve(process.argv[2] || path.join(ROOT, 'cocos-client', 'build', 'web-mobile'));
const INDEX = path.join(BUILD, 'index.html');
const SOURCE_ICON = path.join(ROOT, 'assets', 'branding', 'icon.png');

if (!fs.existsSync(INDEX)) throw new Error(`Cocos Web 构建不存在：${INDEX}`);
if (!fs.existsSync(SOURCE_ICON)) throw new Error(`PWA 图标不存在：${SOURCE_ICON}`);

const writeIcon = (size) => {
  const output = path.join(BUILD, `icon-${size}.png`);
  try {
    execFileSync('/usr/bin/sips', ['-z', String(size), String(size), SOURCE_ICON, '--out', output], {
      stdio: 'ignore',
    });
  } catch (_) {
    fs.copyFileSync(SOURCE_ICON, output);
  }
};
writeIcon(192);
writeIcon(512);

fs.writeFileSync(path.join(BUILD, 'manifest.webmanifest'), `${JSON.stringify({
  id: '/pwa/',
  name: '潜江干瞪眼',
  short_name: '潜江干瞪眼',
  description: '潜江本地玩法，约上好友随时开局',
  lang: 'zh-CN',
  start_url: './',
  scope: './',
  display: 'fullscreen',
  orientation: 'landscape',
  background_color: '#073f3d',
  theme_color: '#073f3d',
  icons: [
    { src: './icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
    { src: './icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}, null, 2)}\n`);

const webConfig = `(() => {
  const local = /^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname) && location.port === "7456";
  window.QJQP_WEB_CONFIG = {
    apiBase: local ? "/__qjqp_api" : "/",
    websocketUrl: (location.protocol === "https:" ? "wss://" : "ws://")
      + location.host + (local ? "/__qjqp_ws" : "/ws")
  };
})();
`;
fs.writeFileSync(path.join(BUILD, 'web-config.js'), webConfig);
const webConfigVersion = crypto.createHash('sha256').update(webConfig).digest('hex').slice(0, 12);

fs.writeFileSync(path.join(BUILD, 'pwa-register.js'), `(() => {
  if (!("serviceWorker" in navigator)) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshed = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController && !refreshed) {
      refreshed = true;
      window.location.reload();
    }
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .catch((error) => console.warn("PWA service worker registration failed", error));
  });
})();
`);

let html = fs.readFileSync(INDEX, 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, '<title>潜江干瞪眼</title>');
html = html.replace(/(<script src=["'](?:\.\/)?web-config\.js)(?:\?[^"']*)?(["']><\/script>)/,
  `$1?v=${webConfigVersion}$2`);
if (!html.includes('manifest.webmanifest')) {
  html = html.replace('</head>', [
    '  <meta name="theme-color" content="#073f3d">',
    '  <meta name="description" content="潜江本地玩法，约上好友随时开局">',
    '  <meta name="apple-mobile-web-app-title" content="潜江干瞪眼">',
    '  <link rel="manifest" href="./manifest.webmanifest">',
    '  <link rel="apple-touch-icon" href="./icon-192.png">',
    '  <script src="./pwa-register.js" defer></script>',
    '</head>',
  ].join('\n'));
}
fs.writeFileSync(INDEX, html);

const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (entry.isFile() && entry.name !== 'sw.js') files.push(filename);
  }
};
walk(BUILD);
files.sort();
const fingerprint = crypto.createHash('sha256');
for (const filename of files) {
  fingerprint.update(path.relative(BUILD, filename));
  fingerprint.update(fs.readFileSync(filename));
}
const version = fingerprint.digest('hex').slice(0, 16);
const candidates = [
  'index.html', 'manifest.webmanifest', 'pwa-register.js', 'web-config.js',
  'icon-192.png', 'icon-512.png', 'style-mobile.css', 'main.js', 'src/settings.js',
];
const precache = candidates.filter((name) => fs.existsSync(path.join(BUILD, name)))
  .map((name) => `./${name}`);
precache.unshift('./');

fs.writeFileSync(path.join(BUILD, 'sw.js'), `const CACHE = "qjqp-pwa-${version}";
const PRECACHE = ${JSON.stringify(precache)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("qjqp-pwa-") && key !== CACHE)
      .map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("range")) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL("./", self.registration.scope).pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put("./index.html", response.clone()));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok && response.status === 200) {
      caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    }
    return response;
  })));
});
`);

console.log(`PWA_BUILD=${BUILD}`);
console.log(`PWA_VERSION=${version}`);
