import { formatNumber } from './formatNumber'

export function formatTime(duration: number) {
  return `${formatNumber(Math.round(duration / 36) / 100)}h`
}

export function formatHourMinute(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours === 0 && minutes === 0) {
    return `${remainingSeconds}s`
  } else if (hours === 0) {
    return `${minutes}m`
  } else if (minutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h${minutes}m`
  }
}

export function formatMinuteSecond(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const result = (minutes > 0 ? `${minutes}m` : '') + `${remainingSeconds}s`
  return result
}
