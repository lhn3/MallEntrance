//本地缓存
class localCache {
  //写入
  setCache(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  //取出
  getCache(key) {
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }

  //删除
  delCache(key) {
    window.localStorage.removeItem(key)
  }

  //清空
  clearCache() {
    window.localStorage.clear()
  }
}

export default new localCache()
