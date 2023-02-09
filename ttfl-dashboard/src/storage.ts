export const pickPlayer = (player: string, pickDate: Date) => {
  const timestamp = new Date(pickDate.setHours(0, 0, 0, 0)).getTime()
  window.localStorage.setItem(player, timestamp.toString());
  console.info(`${player} picked on ${new Date(pickDate)}`)
}

export const getAllPicks = () => {
  return { ...window.localStorage }
}

export const isPicked = (player: string) => {
  return window.localStorage.getItem(player)
}