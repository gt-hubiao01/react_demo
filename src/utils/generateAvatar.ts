const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

export const generateAvatar = (
  letter: string,
  config: {
    size: number
    bgColorStart: string
    bgColorEnd: string
    letterColor: string
    letterSize: number
  } = {
    size: 37,
    bgColorStart: '#4B9DE8',
    bgColorEnd: '#2E6DD8',
    letterColor: '#FFF',
    letterSize: 22,
  }
) => {
  const { size, bgColorStart, bgColorEnd, letterColor, letterSize } = config

  canvas.width = size
  canvas.height = size

  if (!context) return ''

  const gradient = context.createLinearGradient(0, 0, 0, size) 
  gradient.addColorStop(0, bgColorStart) 
  gradient.addColorStop(1, bgColorEnd) 

  context.fillStyle = gradient
  context.beginPath()
  context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
  context.fill()

  context.fillStyle = letterColor
  context.font = `600 ${letterSize}px PingFang SC`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(letter, size / 2, size / 2)

  return canvas.toDataURL('image/png')
}
