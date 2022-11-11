import axios from 'axios'
import {ElLoading} from 'element-plus/lib'
import {BASE_URL, TIME_OUT} from './config'
// import localCache from '@/utils/cache'
import {useCookies} from '@vueuse/integrations/useCookies'

let cookies = useCookies()

//创建封装axios类
class myRequest {
  //创建实例化之后即调用
  //myRequestConfig自己定义的类型
  constructor(baseConfig) {
    this.loading = null
    //创建axios实例对象
    this.instance = axios.create(baseConfig)

    //传入的拦截器
    this.interceptors = baseConfig.interceptors

    //传入的请求拦截注册到拦截器中
    this.instance.interceptors.request.use(
      this.interceptors ? this.interceptors.requestInterceptor : "",      //传入的拦截器名字要固定，不然这里会报错
      this.interceptors ? this.interceptors.requestInterceptorCatch : "" //传入的拦截器名字要固定，不然这里会报错
    )

    //响应拦截
    this.instance.interceptors.response.use(
      this.interceptors ? this.interceptors.responseInterceptor : "",     //传入的拦截器名字要固定，不然这里会报错
      this.interceptors ? this.interceptors.responseInterceptorCatch : ""//传入的拦截器名字要固定，不然这里会报错
    )

    //定义全部请求拦截器
    this.instance.interceptors.request.use((config) => {
      //定请求时的加载动画
      this.loading = ElLoading.service({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0,0,0,0.2)'
      })
      return config
    })
    this.instance.interceptors.response.use(
      (res) => {
        console.log('全部响应拦截，成功')
        //删除加载动画
        this.loading ? this.loading.close() : ""
        res.data.code = 200
        return res.data
      },
      (err) => {
        //删除加载动画
        this.loading ? this.loading.close() : ""
        // err.response.data.code = 0
        return err.response?.data
      }
    )
  }

  //  定义request方法
  request(config) {
    //返回一个promise
    return new Promise((resolve, reject) => {
      this.instance.request(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
          return err
        })
    })
  }

  get(config) {
    return this.request({...config, params: config.data, method: 'GET'})
  }

  post(config) {
    return this.request({...config, method: 'POST'})
  }

  delete(config) {
    return this.request({...config, method: 'DELETE'})
  }

  put(config) {
    return this.request({...config, method: 'PUT'})
  }

  patch(config) {
    return this.request({...config, method: 'PATCH'})
  }
}


//在其他文件使用此类时--------------------------------------------------------------------------------------
//创建一个请求实例使用
const myAxios = new myRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  //自定义传入拦截器
  interceptors: {
    requestInterceptor(config) {
      //携带token发送请求
      let token = cookies.get('disha-token')
      if (token) {
        config.headers.token = token
      }
      return config
    }
  }
})

export default myAxios
