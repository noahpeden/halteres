export const formatDuration = {
  // Convert seconds to mm:ss format
  toMMSS: (totalSeconds: number): string => {
    if (!totalSeconds) return ''

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  },

  // Parse mm:ss format to total seconds
  fromMMSS: (timeString: string): number | null => {
    if (!timeString) return null

    const [minutes, seconds] = timeString.split(':').map(Number)

    // Validate input
    if (isNaN(minutes) || isNaN(seconds)) return null
    if (seconds >= 60) return null
    if (minutes < 0 || seconds < 0) return null

    return minutes * 60 + seconds
  },

  // Convert seconds to human readable format (e.g. "5 minutes 30 seconds")
  toHuman: (totalSeconds: number): string => {
    if (!totalSeconds) return ''

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const minutesText = minutes ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : ''
    const secondsText = seconds ? `${seconds} second${seconds !== 1 ? 's' : ''}` : ''

    if (minutesText && secondsText) {
      return `${minutesText} and ${secondsText}`
    }
    return minutesText || secondsText
  }
}