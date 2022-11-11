import {useCookies} from '@vueuse/integrations/useCookies'
import cache from '@/utils/cache'

const cookies = useCookies()

const managerStore = {
  namespaced: true,
  state() {
    return {
      token: '',
      userId: '',
      avatar: '',
      ruleNames: [],
      userName: '',
      menus: []
    }
  },
  mutations: {
    saveToken(state, payload) {
      state.token = payload
    },
    saveUserId(state, payload) {
      state.userId = payload
    },

    saveUserInfo(state, payload) {
      state.avatar = payload.headPortrait
      state.ruleNames = payload.permissions
      state.userName = payload.userName
      state.menus = payload.menus
    }
  },
  getters: {},
  actions: {
    tokenAction(action, payload) {
      action.commit('saveToken', payload.token)
      action.commit('saveUserId', payload.userId)
      cookies.set('disha-token', payload.token)
      cookies.set('disha-userId', payload.userId)
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
      cookies.remove('disha-userId')
      cache.delCache('disha-userInfo')
    },

    // 数据持久化
    keepStoreAction(action, payload) {
      const token = cookies.get('disha-token')
      const userId = cookies.get('disha-userId')
      const userInfo = cache.getCache('disha-userInfo')
      token ? action.commit('saveToken', token) : ''
      userId ? action.commit('saveUserId', userId) : ''
      userInfo ? action.commit('saveUserInfo', userInfo) : ''
    }
  }
}

export default managerStore