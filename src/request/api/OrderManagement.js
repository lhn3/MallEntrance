import myAxios from '../index'

//导出订单
export const exportOrder = data => {
  return myAxios.post({
    url: `/admin/order/excelexport?tab=${data.tab}`,
    data,
    responseType: 'blob'
  })
}

//获取物流信息
export const getShip = id => {
  return myAxios.get({
    url: `/admin/order/${id}/get_ship_info`
  })
}