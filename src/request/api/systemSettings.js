import myAxios from '../index'

//获取原有基础设置信息
export const getBaseSetting = () => {
  return myAxios.get({
    url: `/admin/sysconfig`
  })
}

//修改基础设置
export const setBaseSetting = data => {
  return myAxios.post({
    url: `/admin/sysconfig`,
    data
  })
}