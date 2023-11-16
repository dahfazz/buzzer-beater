import PICKS from '../PICKS';

console.log(PICKS)

export interface DailyPick {
  day: number;
  month: number;
  year: number;
  player: string;
  points?: number;
}

export const getMonthBeginningDelta = (month: number, year: number): number => {
  const firstday = new Date(year, month).getDay() - 1;

  return firstday;
}

export const getMonthDays = (month: number, year: number): (null | number)[] => {
  const days: (null | number)[] = Array.from({ length: getMonthBeginningDelta(month, year) }, _ => null)

  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export const getTTFLmonth = (month: number, year: number): (null | DailyPick)[] => {
  return getMonthDays(month, year).map(day => {
    console.log(day)
    const pickIndex = `${month}-${day}-${year}`;
    console.log(pickIndex)
    const pick = PICKS[pickIndex];

    return day ? {
      month,
      year,
      day,
      player: pick
    } : null;
  })
}
