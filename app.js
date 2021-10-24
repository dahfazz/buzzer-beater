const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 3000

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

let date;

const TEAMS = {
  ATL: {key: 'ATL', name: 'Hawks', colorA: '#ff0000', colorB: '#fff'},
  BK: {key: 'BKL', name: 'Nets', colorA: '#fff', colorB: '#fff'},
  BOS: {key: 'BOS', name: 'Celtics', colorA: '#00853F', colorB: '#fff'},
  CHA: {key: 'CHA', name: 'Hornets', colorA: '#000000', colorB: '#fff'},
  CHI: {key: 'CHI', name: 'Bulls', colorA: '#ff0000', colorB: '#fff'},
  CLE: {key: 'CLE', name: 'Cavs', colorA: '#000000', colorB: '#fff'},
  DAL: {key: 'DAL', name: 'Mavs', colorA: '#3345f2', colorB: '#fff'},
  DEN: {key: 'DEN', name: 'Nuggets', colorA: '#000000', colorB: '#fff'},
  DET: {key: 'DET', name: 'Pistons', colorA: '#3345f2', colorB: '#fff'},
  GS: {key: 'GSW', name: 'Warriors', colorA: '#000000', colorB: '#fff'},
  HOU: {key: 'HOU', name: 'Rockets', colorA: '#000000', colorB: '#fff'},
  IND: {key: 'IND', name: 'Pacers', colorA: '#000000', colorB: '#fff'},
  LAC: {key: 'LAC', name: 'Clippers', colorA: '#3345f2', colorB: '#fff'},
  LAL: {key: 'LAL', name: 'Lakers', colorA: '#000000', colorB: '#fff'},
  MEM: {key: 'MEM', name: 'Grizzlies', colorA: '#000000', colorB: '#fff'},
  MIA: {key: 'MIA', name: 'Heat', colorA: '#000000', colorB: '#fff'},
  MIL: {key: 'MIL', name: 'Bucks', colorA: '#000000', colorB: '#fff'},
  MIN: {key: 'MIN', name: 'Wolves', colorA: '#000000', colorB: '#fff'},
  NO: {key: 'NOL', name: 'Pelicans', colorA: '#000000', colorB: '#fff'},
  NY: {key: 'NYC', name: 'Knicks', colorA: '#000000', colorB: '#fff'},
  OKC: {key: 'OKC', name: 'Thunder', colorA: '#000000', colorB: '#fff'},
  ORL: {key: 'ORL', name: 'Magic', colorA: '#000000', colorB: '#fff'},
  PHI: {key: 'PHI', name: 'Sixers', colorA: '#000000', colorB: '#fff'},
  PHO: {key: 'PHO', name: 'Suns', colorA: '#000000', colorB: '#fff'},
  POR: {key: 'POR', name: 'Blazers', colorA: '#fff', colorB: '#fff'},
  SA: {key: 'SAS', name: 'Spurs', colorA: '#fff', colorB: '#fff'},
  SAC: {key: 'SAC', name: 'Kings', colorA: '#000000', colorB: '#fff'},
  TOR: {key: 'TOR', name: 'Raptors', colorA: '#f00', colorB: '#fff'},
  UTA: {key: 'UTA', name: 'Jazz', colorA: '#000000', colorB: '#fff'},
  WAS: {key: 'WAS', name: 'Wizards', colorA: '#f00', colorB: '#fff'},
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

  date = new Date();
  yesterday = date.setDate(date.getDate() - 1);
  formatted = req.query.date || dateFormat(yesterday, 'yyyy-mm-dd');
  
  const url = `https://www.covers.com/Sports/NBA/Matchups?selectedDate=${formatted}`;
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);

  const games = []

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

    obj.date = formatted;
    games.push(obj)
  });

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap" rel="stylesheet">
  <style>
  body {
    padding: 0;
    margin: 0;
    background: #000;
  }
  ul {
    margin: 0 auto;
    padding: 0;
    list-style: none;
    max-width: 400px;
  }
  li {
    margin: 0 0 2rem;
    padding: 0;
    font-family: "Major Mono Display", monospace;
    font-size: 1.6rem;
    text-align: center;
    color: white;
  }
  .date {
    font-family: "Major Mono Display", monospace;
    font-size: 1.5rem;
    text-align: center;
    color: white;
    margin: 0 0 2rem;
    padding: 1rem 0;
    border-bottom: 1px solid #333;
  }
  
  </style>
  </head>
  <body>
  <div class="date">${formatted}</div>
  <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += `<li>${TEAMS[game.teamA].key}-${TEAMS[game.teamB].key}</li>`;
    }
  });

  html += `
    </li>
  </ul>
  </body>
  </html>`;

  return res.send(html);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
