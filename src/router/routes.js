import NotFound from '@/pages/NotFound/NotFound.vue'
import Login from '@/pages/Login/Login.vue'
import Home from '@/pages/Home/Home.vue'
import HomeInfo from "@/pages/Home/HomeInfo.vue";

//商品管理
import Goods from '@/pages/GoodManagement/Goods/Goods.vue'
import Category from '@/pages/GoodManagement/Category/Category.vue'
import Skus from '@/pages/GoodManagement/Skus/Skus.vue'
import Coupon from '@/pages/GoodManagement/Coupon/Coupon.vue'

//用户管理
import User from '@/pages/UserManagement/User/User.vue'
import Level from '@/pages/UserManagement/Level/Level.vue'

//订单管理
import Order from '@/pages/OrderManagement/Order/Order.vue'
import Comment from '@/pages/OrderManagement/Comment/Comment.vue'

//管理员管理
import Manager from "@/pages/AdministratorManagement/Manager/Manager.vue";
import Access from "@/pages/AdministratorManagement/Access/Access.vue";
import Role from "@/pages/AdministratorManagement/Role/Role.vue";

//系统设置
import BaseSetting from "@/pages/SystemSettings/BaseSetting/BaseSetting.vue";
import BuySetting from "@/pages/SystemSettings/BuySetting/BuySetting.vue";
import ShipSetting from "@/pages/SystemSettings/ShipSetting/ShipSetting.vue";

//分销模块
import Distribution from "@/pages/DistributionModule/Distribution/Distribution.vue";
import DistributionSetting from "@/pages/DistributionModule/DistributionSetting/DistributionSetting.vue";

//其他模块
import Image from "@/pages/OtherModules/Image/Image.vue";
import Notice from "@/pages/OtherModules/Notice/Notice.vue";


// const routerList = import.meta.glob('./modules/*.js')

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Not Found'
    }
  },
]

//动态路由
export const asyncRouters = [
  {path: '/', name: 'HomeInfo', component: HomeInfo, meta: {title: '主控台'}},
  {path: '/goods/list', name: 'goods', component: Goods, meta: {title: '商品管理'}},
  {path: '/category/list', name: 'category', component: Category, meta: {title: '分类管理'}},
  {path: '/skus/list', name: 'skus', component: Skus, meta: {title: '规格管理'}},
  {path: '/coupon/list', name: 'coupon', component: Coupon, meta: {title: '优惠劵管理'}},
  {path: '/user/list', name: 'user', component: User, meta: {title: '用户管理'}},
  {path: '/level/list', name: 'level', component: Level, meta: {title: '会员等级'}},
  {path: '/order/list', name: 'order', component: Order, meta: {title: '订单管理'}},
  {path: '/comment/list', name: 'comment', component: Comment, meta: {title: '评论管理'}},
  {path: '/manager/list', name: 'manager', component: Manager, meta: {title: '管理员管理'}},
  {path: '/access/list', name: 'access', component: Access, meta: {title: '权限管理'}},
  {path: '/role/list', name: 'role', component: Role, meta: {title: '角色管理'}},
  {path: '/setting/base', name: 'baseSetting', component: BaseSetting, meta: {title: '基础设置'}},
  {path: '/setting/buy', name: 'buySetting', component: BuySetting, meta: {title: '交易设置'}},
  {path: '/setting/ship', name: 'shipSetting', component: ShipSetting, meta: {title: '物流设置'}},
  {path: '/distribution/index', name: 'distribution', component: Distribution, meta: {title: '分销员管理'}},
  {
    path: '/distribution/setting',
    name: 'distributionSetting',
    component: DistributionSetting,
    meta: {title: '分销设置'}
  },
  {path: '/image/list', name: 'image', component: Image, meta: {title: '图库管理'}},
  {path: '/notice/list', name: 'notice', component: Notice, meta: {title: '公告管理'}}
]