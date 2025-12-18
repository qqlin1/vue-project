//进行axios的二次封装：使用请求与响应拦截器
import axios from "axios";
// 导入Element Plus的消息提示组件
import { ElMessage } from "element-plus";
//第一步:利用axios对象的create方法，去创建axios实例(其他的配置：基础路径、超市的时间)
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,//基础路径会带上/api
  timeout: 5000//超时的时间设置
})
//第二部：request实力添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //从localStorage获取token并设置到请求头中
  // 检查localStorage是否存在，避免在非浏览器环境中抛出错误
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('TOKEN') : null;
  if (token) {
    config.headers.Token = token
  }
  return config;
})
//第三步；响应拦截器
request.interceptors.response.use((response) => {
  //成功回调
  console.log('响应拦截器 - 原始响应:', response)

  // 根据后端API文档，所有接口都返回200状态码，需要根据code判断
  const code = response.data.code
  console.log('响应拦截器 - 响应码:', code)
  if (code !== 200) {
    // 提示错误信息
    const errorMessage = response.data.message || '请求失败'
    console.error('响应拦截器 - 错误信息:', errorMessage)
    ElMessage({
      type: 'error',
      message: errorMessage,
    })
    // 抛出错误
    return Promise.reject(new Error(errorMessage))
  }

  console.log('响应拦截器 - 成功响应:', response.data)
  return response.data
}, (error) => {
  //失败回调
  //处理http网络错误
  console.error('响应拦截器 - 网络错误:', error)
  //定义一个变量，存储网络错误信息
  let message = ''
  if (error.response) {
    // 如果服务器返回了响应
    console.error('响应拦截器 - 服务器错误响应:', error.response)
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break;
      case 403:
        message = '无权访问'
        break;
      case 404:
        message = '请求地址错误'
        break;
      case 500:
        message = '服务器出现问题'
        break;
      default:
        message = `请求失败，状态码: ${status}`
        break;
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    console.error('响应拦截器 - 无响应:', error.request)
    message = '服务器无响应，请检查网络连接'
  } else {
    // 请求配置有误
    console.error('响应拦截器 - 请求配置错误:', error.message)
    message = error.message
  }
  //提示错误信息
  ElMessage({
    type: 'error',
    message
  })
  return Promise.reject(error)
})
export default request

