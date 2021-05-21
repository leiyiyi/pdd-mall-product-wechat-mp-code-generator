/**
 * 解析cookies
 * @param data
 * @returns {string}
 */
module.exports = (data = '') => {
  const requiredList = [
    'slave_bizuin',
    'slave_sid',
    'slave_user',
    'data_bizuin',
    'data_ticket'
  ]

  const kvs = requiredList.reduce((pre, cur) => {
    const regex = new RegExp(`${cur}=(?<val>.*?);`)
    const val = regex.exec(data).groups?.val
    if (!val) {
      throw new Error(`Cookies 中 ${cur} 键值不存在`)
    }
    return [
      ...pre,
      `${cur}=${val}`
    ]
  }, [])

  return kvs.join('; ')
}
