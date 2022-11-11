import {createRouter, createWebHashHistory} from "vue-router";
import {routes, asyncRouters} from "./routes";
import {useCookies} from '@vueuse/integrations/useCookies'
import {ElMessage} from "element-plus";
import nprogress from 'nprogress'
import cache from "@/utils/cache.js";

export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

//添加动态路由
export function addRoutesFunc(menu) {
  let flag = false
  const addRoutes = (menuArray) => {
    menuArray.forEach(item => {
      if (item.child && item.child.length > 0) {
        //递归
        addRoutes(item.child)
      } else {
        let path = asyncRouters.find(i => i.path === item.frontpath)
        if (path && !router.hasRoute(path.name)) {
          router.addRoute('home', path)
          flag = true
        }
      }
    })
  }
  addRoutes(menu)
  return flag
}

//全局路由守卫
router.beforeEach((to, from, next) => {
  nprogress.start()
  let token = useCookies().get('disha-token')
  const userInfo = cache.getCache('disha-userInfo')

  // 没有token前往任何页面都被定向到登录页
  if (!token && to.name !== 'login') {
    // ElMessage.error('请先登录！')
    next({name: 'login'})
  }
  // 有token前往登录页定向到首页
  if (to.name === 'login' && token) {
    next({name: from.name ? from.name : 'home'})
  }
  document.title = to.meta.title ? to.meta.title : ''

  //有token，动态加路由
  let flag = false
  if (token) {
    flag = addRoutesFunc(userInfo.menus)
  }
  flag ? next(to.fullPath) : next()
})

//取消进度条
router.afterEach(() => {
  nprogress.done()
})