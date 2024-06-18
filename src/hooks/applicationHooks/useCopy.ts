import writeText from 'copy-to-clipboard'
import { useSafeState } from '../basicHooks'
import { useCallback } from 'react'

type copyTextProps = string | undefined
type CopyFn = (text: string) => void // Return success

/**
 * 自定义Hook：用于复制文本内容
 * @returns 返回一个包含复制文本和复制函数的元组
 */
const useCopy = (): [copyTextProps, CopyFn] => {
  const [copyText, setCopyText] = useSafeState<copyTextProps>(undefined)

  const copy = useCallback((value?: string | number) => {
    if (!value) return setCopyText('')
    try {
      writeText(value.toString())
      setCopyText(value.toString())
    } catch (err) {
      setCopyText('')
    }
  }, [])

  return [copyText, copy]
}

export default useCopy
