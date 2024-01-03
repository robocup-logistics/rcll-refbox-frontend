export default function formatTime(
  gameTimeArg: number | string,
  round: boolean = false
): string {
  let gameTime: number
  if (typeof gameTimeArg === 'string') {
    gameTime = parseInt(gameTimeArg)
  } else {
    gameTime = gameTimeArg
  }
  const minutes: number = Math.floor(gameTime / 60)
  let seconds: number = gameTime % 60
  if (round) {
    seconds = Math.round(seconds)
  }
  let minutesString
  if (minutes < 10) {
    minutesString = `0${minutes}`
  } else {
    minutesString = `${minutes}`
  }
  let secondsString
  if (seconds < 10) {
    secondsString = `0${seconds}`
  } else {
    secondsString = `${seconds}`
  }
  const result: string = `${minutesString}:${secondsString}`
  return result
}
