import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { reactVirtualized } from './vitePlugins/reactVirtualized';

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
  plugins: [react(), reactVirtualized()],
  server: {
    host: true,
    port: 8888, // 开发环境启动的端口
    proxy: {
      '/taobao_m_api': {
        target: 'http://api.m.taobao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/taobao_m_api/, ''),
      }
    }
  },
})
