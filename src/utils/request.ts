import axios from 'axios'

const instance = axios.create({
  timeout: 10_000, // 5秒超时
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
})

export { instance }
