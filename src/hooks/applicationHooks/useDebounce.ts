import { useSafeState, useCreation } from '../basicHooks'
import useDebounceFn from './useDebounceFn'
import type { DebounceOptions } from './useDebounceFn'

/**
 * 使用防抖功能的自定义Hook。
 * @template T - 值的类型
 * @param value - 要进行防抖的值
 * @param options - 防抖选项
 * @returns 防抖后的值
 */
const useDebounce = <T>(value: T, options?: DebounceOptions) => {
  const [debounced, setDebounced] = useSafeState(value)

  const run = useDebounceFn(() => {
    setDebounced(value)
  }, options)

  useCreation(() => {
    run()
  }, [value])

  return debounced
}

export default useDebounce
