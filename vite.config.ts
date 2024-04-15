import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function resolve(pathname: string) {
  return path.join(__dirname, pathname)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: resolve('./node_modules/'),
      },
      {
        find: '@',
        replacement: resolve('./src'),
      },
    ],
  },
  plugins: [react()],
  server: {
    host: true,
    port: 8888, // 开发环境启动的端口
  },
})
