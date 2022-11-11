//不同环境定义不同的环境变量
let BASE_URL = ''
const TIME_OUT = 3000

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://shop.cyljx.xyz:8089'
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://shop.cyljx.xyz:8089'
} else {
  BASE_URL = ''
}

export {BASE_URL, TIME_OUT}
