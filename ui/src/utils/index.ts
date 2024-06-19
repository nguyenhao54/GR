export { }

export const addSevenHours = (dateTime: string) => {
  return new Date(new Date(dateTime).getTime() + 7 * 60 * 60 * 1000).toISOString()
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getHourAndMinute = (dateTime: string) => {
  return new Date(dateTime).toLocaleString("en-GB", { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (dateTime: string) => {
  return new Date((dateTime)).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", hour: '2-digit', minute: '2-digit' })
}

export function eraseCookie(name: string) {
  document.cookie = name + '=; Max-Age=-99999999;';
}