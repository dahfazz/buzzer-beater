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
const OPENING_NIGHT = '10-19-2021';
const LAST_NIGHT = '04-10-2022';

const fillDaysArray = (date) => {
  date = date || new Date(LAST_NIGHT);

  const yesterday = new Date(date.setDate(date.getDate() - 1));

  if (yesterday.getTime() >= new Date(OPENING_NIGHT).getTime()) {
    DATES.push(formatDateForURL(date));
    fillDaysArray(yesterday)
  }
}



// GET GAMES FOR THIS DATE
const getDateGames = async (date) => {

  const _GAMES = [];

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

    // OT
    const final = $(element).find('.cmg_matchup_list_status').text();
    if (final.indexOf('OT') > -1) {
      obj.delta = 0;
      obj.ot = true;
    }

    obj.date = formatDateForURL(date);
    _GAMES.push(obj)
  });

  return _GAMES;
}

const getScores = async () => {
  fillDaysArray();

  const requests = [];
  DATES.forEach(async (date) => {
    requests.push(getDateGames(date))
  })

  return Promise.all(requests)
    .then(() => fs.writeFileSync('SCORES.json', JSON.stringify(GAMES, null, 2)))
}

module.exports = { getDateGames, getScores };