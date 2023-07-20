export default function formatSeconds(gametimeArg: number | string): string {
  let gametime: number
  if (typeof gametimeArg === 'string') {
    gametime = parseInt(gametimeArg)
  } else {
    gametime = gametimeArg
  }
  const minutes: number = Math.floor(gametime / 60)
  const seconds: number = gametime % 60
  let minutesString
  if(minutes < 10) {
    minutesString = `0${minutes}`
  } else {
    minutesString = `${minutes}`
  }
  let secondsString
  if(seconds < 10) {
    secondsString = `0${seconds}`;
  } else {
    secondsString = `${seconds}`;
  }
  const result: string = `${minutesString}:${secondsString}`;
  return result;
}