export function formatNumber(num: number) {
  const minusStr = num < 0 ? '-' : ''
  num = num < 0 ? -num : num
  const numArr = (Math.round(num * 100) / 100).toString().split('.') || ['']
  const prefix = numArr[0]
    .split('')
    .reverse()
    .reduce((prev: string[], next, idx) => {
      if (idx % 3 === 0) {
        return [...prev, ',', next]
      }
      return [...prev, next]
    }, [])
    .reverse()
    .join('')
    .replace(/,$/, '')
  return numArr.length > 1
    ? `${minusStr}${prefix}.${numArr[1]}`
    : `${minusStr}${prefix}`
}
