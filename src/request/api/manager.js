import myAxios from '../index'

//请求登录
export const login = (data) => {
  return myAxios.post({
    url: '/admin/login',
    data
  })
}

//获取用户信息
export const getUserInfo = () => {
  return myAxios.post({
    url: '/admin/getinfo'
  })
}

//修改密码
export const changePassword = (data) => {
  return myAxios.post({
    url: '/admin/updatepassword',
    data
  })
}

//退出登录
export const loginOut = () => {
  return myAxios.post({
    url: '/admin/logout'
  })
}

//首页数据
export const getHomeInfo = () => {
  return myAxios.get({
    url: '/admin/statistics1'
  })
}

//echarts数据
export const getHomeEcharts = (data) => {
  return myAxios.get({
    url: '/admin/statistics3',
    data
  })
}

export const getHomeOther = () => {
  return myAxios.get({
    url: '/admin/statistics2'
  })
}