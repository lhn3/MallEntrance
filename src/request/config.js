//不同环境定义不同的环境变量
let BASE_URL = ''
const TIME_OUT = 3000

if (process.env.NODE_ENV === 'development') {
  BASE_URL = '/api'
  // BASE_URL = 'http://ceshi13.dishait.cn'
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://ceshi13.dishait.cn'
} else {
  BASE_URL = ''
}

export {BASE_URL, TIME_OUT}
