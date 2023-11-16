const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const months = [
  'october',
  'november',
  'december',
  'january',
  'february',
  'march',
  'april',
];

const URL = 'https://www.basketball-reference.com/leagues/NBA_2024_games-';

const SCH = [];

// GET GAMES FOR THIS MONTH
const getMonthSchedule = async (month) => {


  const result = await axios.get(URL + month + '.html');
  const $ = cheerio.load(result.data);

  const hrefToTeamKey = (href) => {
    return href ? href.replace('/teams/', '').replace('/2024.html', '') : null
  }

  $('#div_schedule tr').each((_, tr) => {
    const date = $(tr).find('th:nth-child(1) a').first().text();
    const away = hrefToTeamKey($(tr).find('td:nth-child(3) a').first().attr('href'))
    const awayPts = $(tr).find('td:nth-child(4)').first().text()
    const home = hrefToTeamKey($(tr).find('td:nth-child(5) a').first().attr('href'))
    const homePts = $(tr).find('td:nth-child(6)').first().text()

    SCH.push({
      date, home, away, awayPts, homePts
    })
    fs.writeFileSync('SCHEDULE.json', JSON.stringify(SCH, null, 2));
  });
}

const crawlSeasonSchedule = () => {
  months.forEach(month => getMonthSchedule(month));
}


module.exports = { crawlSeasonSchedule };