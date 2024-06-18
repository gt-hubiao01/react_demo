import { useRef } from 'react'

/**
 * 返回一个 ref 对象，该对象始终保存传递给它的最新值。
 *
 * @template T - 值的类型。
 * @param {T} value - 初始值。
 * @returns {{ readonly current: T }} - 带有最新值的 ref 对象。
 */
const useLatest = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value)
  ref.current = value

  return ref
}

export default useLatest
