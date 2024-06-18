import { useLatest, useUnmount, useCreation } from '../basicHooks'
import { debounce } from 'lodash'

type noop = (...args: any[]) => any

export interface DebounceOptions {
  wait?: number
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

/**
 * 使用防抖函数的自定义Hook。
 * @template T - 函数类型
 * @param {T} fn - 要进行防抖的函数
 * @param {DebounceOptions} [options] - 防抖选项
 * @returns {T} - 防抖后的函数
 */
const useDebounceFn = <T extends noop>(fn: T, options?: DebounceOptions) => {
  const fnRef = useLatest(fn)

  const debounced = useCreation(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => fnRef.current(...args),
        options?.wait ?? 1000,
        options
      ),
    []
  )

  useUnmount(() => {
    debounced.cancel()
  })

  return debounced
}

export default useDebounceFn
