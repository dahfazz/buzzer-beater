import { getMonthBeginningDelta, getMonthDays } from "./calendar";

describe('Calendar services', () => {
  fit('Month delta', () => {
    expect(getMonthBeginningDelta(10, 2023)).toBe(2);
    expect(getMonthBeginningDelta(6, 2022)).toBe(4);
  });
  fit('Month days', () => {
    expect(getMonthDays(10, 2023)).toEqual([null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  });
});