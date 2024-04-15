export function transformNumber(num: number | null | undefined): {
  value: number | string
  unit: string
} {
  let value = num
  let unit = ''

  if (value === null || value === undefined) {
    return { value: '--', unit: '' }
  }

  switch (true) {
    case value > 1_0000_0000:
      value = value / 1_0000_0000
      unit = '亿'
      break
    case value > 1_0000:
      value = value / 1_0000
      unit = '万'
      break
  }

  if (unit) {
    return { value: Math.round(value * 100) / 100, unit }
  }

  return { value, unit }
}

export function transformCash(num: number) {
  if (num === null) return '--'
  const { value, unit } = transformNumber(num / 100)
  return unit ? `${value}${unit}` : `${value}`
}

export function formatNumber(num: number) {
  const { value, unit } = transformNumber(num)
  return unit ? `${value}${unit}` : value
}
