import { useRef, useCallback } from 'react'

/**
 * 自定义 Hook：用于创建一个带锁的异步函数
 * @template P - 函数参数的类型数组
 * @template V - 函数返回值的类型
 * @param {(...args: P) => Promise<V>} fn - 要包装的异步函数
 * @returns {(...args: P) => Promise<V>} - 带锁的异步函数
 */
const useLockFn = <P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) => {
  const lockRef = useRef(false)

  return useCallback(
    async (...args: P) => {
      if (lockRef.current) return
      lockRef.current = true
      try {
        const ret = await fn(...args)
        lockRef.current = false
        return ret
      } catch (e) {
        lockRef.current = false
        throw e
      }
    },
    [fn]
  )
}

export default useLockFn
