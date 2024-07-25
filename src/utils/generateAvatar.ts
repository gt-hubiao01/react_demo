const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

export const generateAvatar = (
  letter: string,
  config?: {
    size?: number
    bgColorStart?: string
    bgColorEnd?: string
    bgColorAngle?: number
    letterColor?: string
    letterSize?: number
    scale?: number
  }
) => {
  const {
    size,
    bgColorStart,
    bgColorEnd,
    bgColorAngle,
    letterColor,
    letterSize,
    scale,
  } = {
    size: 36,
    bgColorStart: '#58AFFF',
    bgColorEnd: '#3982FF',
    bgColorAngle: 158,
    letterColor: '#FFF',
    letterSize: 20,
    ...(config || {}),
  }

  const ratio = scale || window.devicePixelRatio || 1

  const newSize = size * ratio
  const newLetterSize = letterSize * ratio

  canvas.width = newSize
  canvas.height = newSize

  if (!context) return ''

  const radians = (bgColorAngle * Math.PI) / 180

  const sinVal = Math.sin(radians)
  const cosVal = Math.cos(radians)

  const radius = Math.sqrt((newSize / 2) ** 2 * 2)
  const halfSize = newSize / 2

  const startX = halfSize - radius * sinVal
  const startY = halfSize + radius * cosVal
  const endX = halfSize + radius * sinVal
  const endY = halfSize - radius * cosVal

  const gradient = context.createLinearGradient(startX, startY, endX, endY)
  gradient.addColorStop(0, bgColorStart)
  gradient.addColorStop(1, bgColorEnd)

  context.fillStyle = gradient
  context.beginPath()
  context.arc(newSize / 2, newSize / 2, newSize / 2, 0, 2 * Math.PI)
  context.fill()

  context.fillStyle = letterColor
  context.font = `600 ${newLetterSize}px PingFang SC`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(letter, newSize / 2, newSize / 2)

  return canvas.toDataURL('image/png')
}
