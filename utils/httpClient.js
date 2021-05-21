/**
 * 请求器
 */
const https = require('https')

// pdd 的小程序appid
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
const APP_ID = 'wx32540bd863b27570'

// 缓存
let token = null

/**
 *
 * @param mode
 * @param id
 * @param token
 * @returns {string}
 */
const getPath = (mode = '', id = '', token = '') => {
  if (!['mall', 'goods'].includes(mode)) {
    throw new Error(`mode: ${mode} 不存在`)
  }

  const mpPath = mode === 'mall'
    ? `package_a/mall_page/mall_page.html?mall_id=${id}`
    : `package_c/goods/goods.html?goods_id=${id}`

  const path = `/wxopen/wxaqrcode?action=getqrcode&f=json&appid=${APP_ID}&path=${encodeURIComponent(encodeURIComponent(mpPath))}&lang=zh_CN`

  return `/wxamp/cgi/route?path=${encodeURIComponent(path)})&token=${token}&lang=zh_CN`
}

/**
 *
 * @param cookies
 * @param options
 * @returns {object}
 */
const getOptions = (cookies = '', options = {}) => {
  if (!cookies) {
    throw new Error(`cookies 不存在`)
  }

  return {
    protocol: 'https:',
    hostname: 'mp.weixin.qq.com',
    port: 443,
    path: '/',
    method: 'GET',
    headers: {
      accept: '*/*',
      cookie: cookies,
      'User-Agent': USER_AGENT
    },
    ...(options ? options : {})
  }
}

/**
 *
 * @param data
 * @returns {string}
 */
const getToken = (data = '') => {
  if (!data || typeof data !== 'string') {
    throw new Error(`data 不存在 或 data 格式有误`)
  }

  const matches = /\/wxamp\/index\/index\?lang=zh_CN&token=(?<token>\d+)/.exec(data)

  return matches.groups?.token
}

/**
 *
 * @param options
 * @returns {Promise<unknown>}
 */
const request = (options = {}) => new Promise((resolve, reject) => {
  const req = https.request(options, (res) => {
    let ret = ''

    res.on('data', chunk => {
      ret += chunk
    })

    res.on('end', () => {
      switch (res.statusCode) {
        case 301:
        case 302:
          resolve(res.headers.location)
          break

        case 200:
          try {
            resolve(ret.toString())
          } catch (e) {
            reject(e)
          }
          break

        default:
          reject(res)
          break
      }
    })
  })

  req.on('error', e => {
    reject(e)
  })

  req.end()
})

// main
module.exports = async (cookies, mode, id) => {
  try {
    if (!token) {
      const step1Res = await request(getOptions(cookies))
      token = getToken(step1Res)
    }
    const step2Res = await request(getOptions(cookies, {
      path: getPath(mode, id, token)
    }))
    return (JSON.parse(step2Res))?.base64img
  } catch (e) {
    throw new Error(e)
  }
}
