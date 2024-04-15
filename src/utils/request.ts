import { message } from 'antd'
import { captureException } from '@sentry/react'
import { getUuid } from '@yunying-wh/utils-fe/es/uuid'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import ErrorModal from '@/components/ErrorModal'

const HTTP_STATUS_REDIRECT = 403

const instance = axios.create({
  timeout: 10_000, // 5秒超时
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
})

const requestSuccess = (config: InternalAxiosRequestConfig) => {
  // mock接口更换bseURL
  if (config.url?.startsWith('/mock')) {
    config.baseURL = 'http://localhost:4001'
  }
  // 请求唯一标识
  config.headers['x-request-id'] = getUuid()
  config.headers['x-referer'] = location.href

  return config
}

// 请求失败的处理
const requestFail = (error: Error) => Promise.reject(error)

instance.interceptors.request.use(requestSuccess, requestFail)

const success = (result: AxiosResponse) => {
  const { data, config } = result // { data, headers, config, request }
  const rid = result.config?.headers['x-request-id']

  // 登录
  if (data.code === HTTP_STATUS_REDIRECT) {
    window.location.href = data.data

    setTimeout(() => {
      ErrorModal('未登录', rid, data.code || data.status)
    }, 1200)

    return Promise.reject(new Error())
  } else if (data.code === 0) {
    return data
  } else {
    if (data.msg) {
      if (data.code > 10_000 && data.code < 20_000) {
        // 业务正常逻辑的错误提示，譬如用户的错误操作，不提示 rid
        message.error(data.msg.slice(0, 512))
      } else {
        // message.error(`${data.msg} ${rid}`.slice(0, 512))
        ErrorModal(data.msg.slice(0, 512), rid, data.code)
      }
    } else {
      // 有的报错服务端没有包装，最外层就是status
      // message.error(`${config.url} 接口出错 ${data.code || data.status} ${rid}`)
      ErrorModal(`${config.url} 接口出错`, rid, data.code || data.status)
    }

    return Promise.reject(data)
  }
}

export const CANCEL_REASON = 'active_cancellation'
const release = import.meta.env.VITE_TAG_NAME

const fail = (result: AxiosError) => {
  if (result.code === 'ERR_CANCELED') {
    return Promise.reject(result)
  }

  const { config } = result

  const HTTPCode = (result?.response?.data as any)?.status
  const HTTPCodeText = (result?.response?.data as any)?.error
  const rid = result.config?.headers['x-request-id']

  if (HTTPCode) {
    message.error(`${config?.url} 请求失败 ${HTTPCode} ${HTTPCodeText} ${rid}`)
  } else if (result.code === 'ECONNABORTED') {
    // 自己主动cancel也会走这部分的逻辑
    message.error(`${config?.url} 请求超时 ${rid}`)
  } else if (result.message?.startsWith('maxContentLength size of')) {
    message.error(`${config?.url} 请求内容超长 ${rid}`)
  } else if (result.message?.startsWith('Network Error')) {
    message.error(`${config?.url} 网络错误 ${rid}`)
  } else if (
    result.message &&
    result.message !== 'CANCEL_REASON' &&
    result.message !== CANCEL_REASON
  ) {
    message.error(`${config?.url} 未知错误 ${result.message} ${rid}`)
  }

  // 有 sentry 的情况下才上报
  if (
    release &&
    result.message !== 'CANCEL_REASON' &&
    result.message !== CANCEL_REASON
  ) {
    // 主动上报sentry
    captureException(result, {
      extra: { rid },
    })
  }

  return Promise.reject(result)
}

instance.interceptors.response.use(success, fail)

export { instance }
