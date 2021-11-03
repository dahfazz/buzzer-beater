const dateFormat = require('dateformat');

const MONTHS = require('../months.json');

const DATES = [];

const OPENING_NIGHT = '10-19-2021';
const LAST_NIGHT = '04-11-2022';

const formatDateForURL = (date) => {
  const d = date;
  return dateFormat(d, 'yyyy-mm-dd');
}

const fillDaysArray = (date) => {
  date = date || new Date(LAST_NIGHT);

  const yesterday = new Date(date.setDate(date.getDate() - 1));

  if (yesterday.getTime() >= new Date(OPENING_NIGHT).getTime()) {
    DATES.push(formatDateForURL(date));
    fillDaysArray(yesterday)
  }
}

const areSameDate = (d1, d2) =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear()

module.exports = (date) => {
  fillDaysArray();

  const _date = new Date(date);

  return DATES.reverse().map(value => {
    const _d = new Date(value);
    return `<li>
    <a class="${areSameDate(_d, _date) ? 'current' : ''}" href="/?date=${dateFormat(formatDateForURL(_d), 'yyyy-mm-dd')}">
      <span class="day">${_d.getDate()}</span>
      <span class="month">${MONTHS[_d.getMonth()]}</span>
    </a>
  </li>`
  }).join('');
}