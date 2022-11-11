import myAxios from '../index'

//获取分销信息
export const getDistribution = () => {
  return myAxios.get({
    url: `/admin/agent/statistics`
  })
}

//获取原有分销设置信息
export const getDistSetting = () => {
  return myAxios.get({
    url: `/admin/distribution_setting/get`
  })
}

//修改分销设置
export const setDistSetting = data => {
  return myAxios.post({
    url: `/admin/distribution_setting/set`,
    data
  })
}