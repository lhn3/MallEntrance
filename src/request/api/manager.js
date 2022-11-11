import myAxios from '../index'

//获取验证码
export const code = () => {
  return myAxios.get({url: '/getVerifyCode'})
}

//请求登录
export const login = (data) => {
  return myAxios.post({
    url: '/login',
    data
  })
}

//获取用户信息
export const getUserInfo = id => {
  return myAxios.post({
    url: `/getUserInfo/${id}`
  })
}

//获取用户菜单
export const getUserMenu = id => {
  return myAxios.get({
    url: '/getMenuListById',
    data:{userId: id}
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
export const loginOut = id => {
  return myAxios.post({
    url: `/logout/${id}`
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