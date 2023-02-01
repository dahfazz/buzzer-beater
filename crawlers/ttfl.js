const fs = require('fs');

const axios = require('axios');
const cheerio = require('cheerio');

const getTTFLscores = async () => {
  const result = await axios.get(`https://www.basketball-reference.com/leagues/NBA_2023_per_game.html`);
  const $ = cheerio.load(result.data);

  const PLAYERS = []

  $('table#per_game_stats tbody tr').each(async (x, line) => {
    const p = {};
    $(line).find('td').each((_, cell) => {
      const key = $(cell).attr('data-stat');
      p[key] = ['player', 'team_id'].indexOf(key) === -1 ? parseFloat($(cell).text()) : $(cell).text();
    })
    const missed_fg = p['fga_per_g'] - p['fg_per_g'];
    const missed_fg3 = p['fg3a_per_g'] - p['fg3_per_g'];
    const missed_ft = p['fta_per_g'] - p['ft_per_g'];
    const TTFLSCORE = p['pts_per_g'] + p['trb_per_g'] + p['ast_per_g'] + p['stl_per_g'] + p['blk_per_g'] + p['fg_per_g'] + p['fg3_per_g'] + p['ft_per_g'] - p['tov_per_g'] - missed_fg - missed_fg3 - missed_ft;
    p['TTFL'] = TTFLSCORE;
    PLAYERS.push(p)
  });

  PLAYERS.sort((a, b) => a.TTFL < b.TTFL ? 1 : -1)

  return PLAYERS;
}

const getInjuries = async () => {
  const result = await axios.get(`https://www.espn.com/nba/injuries`);
  const $ = cheerio.load(result.data);

  const INJURIES = {}

  $('table tbody tr').each(async (x, line) => {
    const p = {};
    const player = $(line).find('td.col-name').text().toLowerCase();
    p.player = player;
    p.status = $(line).find('td.col-stat').text()
    p.desc = $(line).find('td.col-desc').text()
    INJURIES[player] = p
  });

  return INJURIES;
}

const getNightGames = async () => {
  const today = new Date()
  const year = today.getFullYear()
  let month = today.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = today.getDate()
  day = day < 10 ? '0' + day : day
  // const URL = `https://www.cbssports.com/nba/schedule/${year}${month}${day}/`;
  const URL = `https://www.cbssports.com/nba/schedule/`;
  const result = await axios.get(URL);
  const $ = cheerio.load(result.data);

  const makeTeamName = (team) => {

    switch (team) {
      case 'New York':
        return 'NYK';
      case 'L.A. Lakers':
        return 'LAL';
      case 'Brooklyn':
        return 'BRK';
      case 'L.A. Clippers':
        return 'LAC';
      case 'New Orleans':
        return 'NOP';
      default:
        return team.substr(0, 3).toUpperCase()
    }
  }

  const GAMES = {
    engaged: [],
    oppositions: {}
  }

  $('table.TableBase-table tbody tr').each(async (x, line) => {
    let home, away;
    $(line).find('td').each(async (x, cell) => {
      if (x === 0) {
        away = makeTeamName($(cell).text())
      }
      if (x === 1) {
        home = makeTeamName($(cell).text())
      }

      if (home && away) {
        if (GAMES.engaged.indexOf(home) === -1) {
          GAMES.engaged.push(home)
        }
        if (GAMES.engaged.indexOf(away) === -1) {
          GAMES.engaged.push(away)
        }

        GAMES.oppositions[home] = away;
        GAMES.oppositions[away] = home;
      }

    })
  });

  return GAMES;
}

module.exports = { getTTFLscores, getInjuries, getNightGames };