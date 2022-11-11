import {useCookies} from '@vueuse/integrations/useCookies'
import cache from '@/utils/cache'

const cookies = useCookies()

const managerStore = {
  namespaced: true,
  state() {
    return {
      token: '',
      avatar: '',
      id: null,
      menus: [],
      role: {},
      ruleNames: [],
      super: null,
      username: ''
    }
  },
  mutations: {
    saveToken(state, payload) {
      state.token = payload
    },

    saveUserInfo(state, payload) {
      state.avatar = payload.avatar
      state.id = payload.id
      state.menus = payload.menus
      state.role = payload.role
      state.ruleNames = payload.ruleNames
      state.super = payload.super
      state.username = payload.username
    }
  },
  getters: {},
  actions: {
    tokenAction(action, payload) {
      action.commit('saveToken', payload)
      cookies.set('disha-token', payload)
    },

    userInfoAction(action, payload) {
      //保存到vuex
      action.commit('saveUserInfo', payload)
      //保存到本地
      cache.setCache('disha-userInfo', payload)
    },

    // 退出登录
    loginOutAction(action, payload) {
      cookies.remove('disha-token')
      cache.delCache('disha-userInfo')
    },

    // 数据持久化
    keepStoreAction(action, payload) {
      const token = cookies.get('disha-token')
      const userInfo = cache.getCache('disha-userInfo')
      token ? action.commit('saveToken', token) : ''
      userInfo ? action.commit('saveUserInfo', userInfo) : ''
    }
  }
}

export default managerStore