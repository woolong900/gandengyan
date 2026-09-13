const API_BASE = 'https://api.weixin.qq.com';

class WechatAuthError extends Error {
  constructor(message, code = 1, options) {
    super(message, options);
    this.name = 'WechatAuthError';
    this.code = code;
  }
}

const fetchJson = async (url, fetchImpl) => {
  let response;
  try {
    response = await fetchImpl(url, { signal: AbortSignal.timeout(8000) });
  } catch (err) {
    throw new WechatAuthError('连接微信登录服务失败', 2, { cause: err });
  }
  if (!response.ok) throw new WechatAuthError(`微信登录服务返回 HTTP ${response.status}`, 2);
  let body;
  try {
    body = await response.json();
  } catch {
    throw new WechatAuthError('微信登录服务返回了无效数据', 2);
  }
  if (body.errcode) {
    console.error(`微信登录接口错误 errcode=${body.errcode}`);
    throw new WechatAuthError('微信授权已失效，请重新登录', Number(body.errcode));
  }
  return body;
};

const authorizeWechat = async (code, options = {}) => {
  const appId = options.appId || process.env.QJQP_WECHAT_APPID || '';
  const appSecret = options.appSecret || process.env.QJQP_WECHAT_APPSECRET || '';
  const fetchImpl = options.fetchImpl || global.fetch;
  if (!appId || !appSecret) throw new WechatAuthError('服务器尚未配置微信登录', 3);
  if (!code) throw new WechatAuthError('缺少微信授权码', 4);

  const tokenUrl = new URL('/sns/oauth2/access_token', API_BASE);
  tokenUrl.search = new URLSearchParams({
    appid: appId,
    secret: appSecret,
    code: String(code),
    grant_type: 'authorization_code',
  });
  const token = await fetchJson(tokenUrl, fetchImpl);
  if (!token.access_token || !token.openid) {
    throw new WechatAuthError('微信授权响应缺少用户身份', 2);
  }

  const userUrl = new URL('/sns/userinfo', API_BASE);
  userUrl.search = new URLSearchParams({
    access_token: token.access_token,
    openid: token.openid,
    lang: 'zh_CN',
  });
  const user = await fetchJson(userUrl, fetchImpl);
  if (!user.openid) throw new WechatAuthError('微信用户信息缺少用户身份', 2);
  return {
    openid: String(user.openid),
    unionid: String(user.unionid || token.unionid || ''),
    nickname: String(user.nickname || ''),
    sex: Number(user.sex) || 1,
    avatarUrl: String(user.headimgurl || ''),
  };
};

module.exports = { WechatAuthError, authorizeWechat };
