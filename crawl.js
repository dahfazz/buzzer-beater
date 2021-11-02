const fs = require('fs');

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

const DATES = [];
const GAMES = [];

// PREPARE DATE FOR URL
const formatDateForURL = (date) => {
  const d = date;
  return dateFormat(d, 'yyyy-mm-dd');
}

const getStandings = async () => {
  const result = await axios.get('https://www.basketball-reference.com/');
  const $ = cheerio.load(result.data);

  const STANDINGS = [];

  ['E', 'W'].map(conf => {
    $('#confs_standings_' + conf + ' th.left').each((_, element) => {
      const obj = {}
      obj.wins = parseInt($(element)
        .find('td[data-stat="wins"]')
        .text())
      obj.losses = parseInt($(element)
        .find('td[data-stat="losses"]')
        .text())
      obj.team = $(element)
        .find('a')
        .text()
        .replace('NYK', 'NY')
        .replace('GSW', 'GS')
        .replace('CHO', 'CHA')
        .replace('BRK', 'BK')
        .replace('SAS', 'SA')
        .replace('NOP', 'NO')
      obj.rank = parseInt($(element)
        .find('.seed')
        .text()
        .replace('(', "")
        .replace(')', "")
        .trim());
      obj.conference = conf
      if (obj.team) {
        STANDINGS.push(obj);
      }

    });
  })

  fs.writeFileSync('STANDINGS.json', JSON.stringify(STANDINGS, null, 2))
}



const OPENING_NIGHT = '10-19-2021';

const fillDaysArray = (date) => {
  date = date || new Date();

  const yesterday = new Date(date.setDate(date.getDate() - 1));

  if (yesterday.getTime() >= new Date(OPENING_NIGHT).getTime()) {
    DATES.push(formatDateForURL(date));
    fillDaysArray(yesterday)
  }
}



// GET GAMES FOR THIS DATE
const getDateGames = async (date) => {

  const url = `https://www.covers.com/Sports/NBA/Matchups?selectedDate=${formatDateForURL(date)}`;
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);

  $('.cmg_matchup_game_box').each((_, element) => {
    const obj = {}
    obj.teamA = $(element).find('.cmg_matchup_list_column_1 .cmg_team_name').text().replace(/[^A-Za-z]/g, "")
    obj.teamB = $(element).find('.cmg_matchup_list_column_3 .cmg_team_name').text().replace(/[^A-Za-z]/g, "")

    const scoreA = $(element).find('.cmg_matchup_list_score_away').text()
    const scoreB = $(element).find('.cmg_matchup_list_score_home').text()

    obj.scoreA = scoreA;
    obj.scoreB = scoreB;

    obj.delta = Math.abs(parseInt(scoreA, 10) - parseInt(scoreB));
    obj.sum = Math.abs(parseInt(scoreA, 10) + parseInt(scoreB));

    obj.date = formatDateForURL(date);
    GAMES.push(obj)
  });
}

const init = async () => {
  fillDaysArray();

  const requests = [];
  DATES.forEach(async (date) => {
    requests.push(getDateGames(date))
  })

  Promise.all(requests)
    .then(() => fs.writeFileSync('SCORES.json', JSON.stringify(GAMES, null, 2)))
}

init()
getStandings()
