import {store} from "@/store/index.js";

/**
 * 全局自定义指令
 */

/**
 * 根据权限展示组件
 * 任何标签上绑定 v-permission="['权限']"
 */
export const permission = {
  install(app) {
    app.directive('permission', {
      mounted(el, bindings) {
        //传入的不是数组表示没有任何权限
        if (!Array.isArray(bindings.value)) {
          el.style.display = 'none'
          return
        }
        //判断传入的所有权限是否都符合
        let flag = bindings.value.find(item => {
          if (store.state.manager.ruleNames.indexOf(item) === -1) return true
        })
        // if (flag) el.parentNode && el.parentNode.removeChild(el)
        if (flag) el.style.display = 'none'
      }
    })
  }
}
