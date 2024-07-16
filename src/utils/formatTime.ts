// function to format a given time (number of seconds). By default, the time is
// formatted in the usual MM:SS format or; with the 'verbal' option true, the
// output is (M)Mm or (S)Ss instead.
export default function formatTime(
  gameTimeArg: number | string,
  verbal: boolean = false,
): string {
  let gameTime: number
  if (typeof gameTimeArg === 'string') {
    gameTime = parseInt(gameTimeArg)
  } else {
    gameTime = gameTimeArg
  }
  const minutes: number = Math.floor(gameTime / 60)
  let seconds: number = Math.round(gameTime % 60)

  if (verbal) {
    if (minutes != 0) {
      return `${minutes}m`
    } else {
      return `${seconds}s`
    }
  } else {
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

    return `${minutesString}:${secondsString}`
  }
}
