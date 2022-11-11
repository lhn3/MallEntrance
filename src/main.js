import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'virtual:windi.css'
//全局样式
import '@/assets/common.less'
import {router} from "./router"
import {store, keepStore} from "./store";
//全局进度条
import 'nprogress/nprogress.css'
//全局自定义指令
import {permission} from "@/utils/directive.js";

keepStore()
export const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(permission)
app.mount('#app')