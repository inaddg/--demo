import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config;
  },
   (err) => Promise.reject(err)
    // 对请求错误做些什么
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 对响应数据做点什么
    if (res.data.code === 0) {
      return res
    }
    ElMessage.error(res.data.message || '请求异常')
    return Promise.reject(res.data)
  },
  (err) => {
    if (err.response?.status === 401) {
      // TODO 2. 401 跳转到登录页面
      router.push('/login')
    }
    // 对响应错误做点什么
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  })

export default instance
export { baseURL }
