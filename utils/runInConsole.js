/**
 * 关键信息提炼
 *   - 页面 https://mms.pinduoduo.com/goods/goods_list
 *   - 分页调到最大
 *   - console 执行下面命令
 */

{
  const {
    mall_id: mallId,
    mall_name: mallName
  } = JSON.parse(document.querySelector('#__NEXT_DATA__').textContent).props.headerProps.serverData.userInfo.mall

  const items = Array.from(document
    .querySelector('[data-testid=beast-core-table]')
    .querySelectorAll('tbody > tr'))

  const mallGoods = items.reduce((pre, cur) => {
    const goodsId = cur.querySelector('.goods-id').textContent.split(' ').pop()
    const goodsName = cur.querySelector('.goods-name').textContent
    return [
      ...pre,
      {
        goodsId,
        goodsName
      }
    ]
  }, [])

  const ret = {
    mallId,
    mallName,
    mallGoods
  }

  // 打印到控制台
  console.log(ret)

  // 复制到剪贴板
  window.copy && window.copy(JSON.stringify(ret, null, 2))
}
