const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 3000

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

let date;

const TEAMS = {
  ATL: {name: 'Hawks', colorA: '#ff0000', colorB: '#000000'},
  BK: {name: 'Nets', colorA: '#fff', colorB: '#000000'},
  BOS: {name: 'Celtics', colorA: '#00853F', colorB: '#000000'},
  CHA: {name: 'Hornets', colorA: '#000000', colorB: '#000000'},
  CHI: {name: 'Bulls', colorA: '#ff0000', colorB: '#000000'},
  CLE: {name: 'Cavs', colorA: '#000000', colorB: '#000000'},
  DAL: {name: 'Mavs', colorA: '#3345f2', colorB: '#000000'},
  DEN: {name: 'Nuggets', colorA: '#000000', colorB: '#000000'},
  DET: {name: 'Pistons', colorA: '#3345f2', colorB: '#000000'},
  GS: {name: 'Warriors', colorA: '#000000', colorB: '#000000'},
  HOU: {name: 'Rockets', colorA: '#000000', colorB: '#000000'},
  IND: {name: 'Pacers', colorA: '#000000', colorB: '#000000'},
  LAC: {name: 'Clippers', colorA: '#3345f2', colorB: '#000000'},
  LAL: {name: 'Lakers', colorA: '#000000', colorB: '#000000'},
  MEM: {name: 'Grizzlies', colorA: '#000000', colorB: '#000000'},
  MIA: {name: 'Heat', colorA: '#000000', colorB: '#000000'},
  MIL: {name: 'Bucks', colorA: '#000000', colorB: '#000000'},
  MIN: {name: 'Wolves', colorA: '#000000', colorB: '#000000'},
  NO: {name: 'Pelicans', colorA: '#000000', colorB: '#000000'},
  NY: {name: 'Knicks', colorA: '#000000', colorB: '#000000'},
  OKC: {name: 'Thunder', colorA: '#000000', colorB: '#000000'},
  ORL: {name: 'Magic', colorA: '#000000', colorB: '#000000'},
  PHI: {name: 'Sixers', colorA: '#000000', colorB: '#000000'},
  PHO: {name: 'Suns', colorA: '#000000', colorB: '#000000'},
  POR: {name: 'Blazers', colorA: '#fff', colorB: '#000000'},
  SA: {name: 'Spurs', colorA: '#fff', colorB: '#000000'},
  SAC: {name: 'Kings', colorA: '#000000', colorB: '#000000'},
  TOR: {name: 'Raptors', colorA: '#f00', colorB: '#000000'},
  UTA: {name: 'Jazz', colorA: '#000000', colorB: '#000000'},
  WAS: {name: 'Wizards', colorA: '#f00', colorB: '#000000'},
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
    <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">
  <style>
  body {
    --bg: #000;
    --text: #fff;

    padding: 0;
    margin: 0;
    background: var(--bg);
    color: var(--text);
  }
  ul {
    margin: 1rem 0rem;
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    text-align: left;
    align-items:center;
    justify-content: center;
    margin: 0;
    padding: 1rem 2rem;
  }
  
  span {
    margin-left: .5rem;
    font-family: "Lobster";
    font-size: 1.9rem;
  }
  
  li > span:first-child {
    margin-right: .5rem;
    margin-left: 0;
    text-align: right;
  }
  
  </style>
  </head>
  <body>
  <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += `<li>
          <span>${TEAMS[game.teamA].name}</span> •
          <span>${TEAMS[game.teamB].name}</span>
        </li>`;
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
