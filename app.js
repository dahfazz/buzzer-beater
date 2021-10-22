const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 3000

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

let date;

const TEAMS = {
  ATL: {name: 'Hawks', colorA: '#ff0000', colorB: '#fff'},
  BK: {name: 'Nets', colorA: '#fff', colorB: '#fff'},
  BOS: {name: 'Celtics', colorA: '#00853F', colorB: '#fff'},
  CHA: {name: 'Hornets', colorA: '#000000', colorB: '#fff'},
  CHI: {name: 'Bulls', colorA: '#ff0000', colorB: '#fff'},
  CLE: {name: 'Cavs', colorA: '#000000', colorB: '#fff'},
  DAL: {name: 'Mavs', colorA: '#3345f2', colorB: '#fff'},
  DEN: {name: 'Nuggets', colorA: '#000000', colorB: '#fff'},
  DET: {name: 'Pistons', colorA: '#3345f2', colorB: '#fff'},
  GS: {name: 'Warriors', colorA: '#000000', colorB: '#fff'},
  HOU: {name: 'Rockets', colorA: '#000000', colorB: '#fff'},
  IND: {name: 'Pacers', colorA: '#000000', colorB: '#fff'},
  LAC: {name: 'Clippers', colorA: '#3345f2', colorB: '#fff'},
  LAL: {name: 'Lakers', colorA: '#000000', colorB: '#fff'},
  MEM: {name: 'Grizzlies', colorA: '#000000', colorB: '#fff'},
  MIA: {name: 'Heat', colorA: '#000000', colorB: '#fff'},
  MIL: {name: 'Bucks', colorA: '#000000', colorB: '#fff'},
  MIN: {name: 'Wolves', colorA: '#000000', colorB: '#fff'},
  NO: {name: 'Pelicans', colorA: '#000000', colorB: '#fff'},
  NY: {name: 'Knicks', colorA: '#000000', colorB: '#fff'},
  OKC: {name: 'Thunder', colorA: '#000000', colorB: '#fff'},
  ORL: {name: 'Magic', colorA: '#000000', colorB: '#fff'},
  PHI: {name: 'Sixers', colorA: '#000000', colorB: '#fff'},
  PHO: {name: 'Suns', colorA: '#000000', colorB: '#fff'},
  POR: {name: 'Blazers', colorA: '#fff', colorB: '#fff'},
  SA: {name: 'Spurs', colorA: '#fff', colorB: '#fff'},
  SAC: {name: 'Kings', colorA: '#000000', colorB: '#fff'},
  TOR: {name: 'Raptors', colorA: '#f00', colorB: '#fff'},
  UTA: {name: 'Jazz', colorA: '#000000', colorB: '#fff'},
  WAS: {name: 'Wizards', colorA: '#f00', colorB: '#fff'},
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
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,900&display=swap" rel="stylesheet">
  <style>
  body {
    padding: 0;
    margin: 0;
    background: #000;
  }
  ul {
    margin: 1rem 0rem;
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    align-items:center;
    justify-content: center;
    margin: 0;
    padding: .5rem 1rem;
  }
  
  span {
    border: 2px solid white;
    margin: 0;
    font-family: "Montserrat";
    font-size: 1.6rem;
    padding: .5rem;
    flex: 1;
    text-align: center;
    background: white;
  }
  
  li > span:first-child {
    border-right: 1px solid black
  }
  
  </style>
  </head>
  <body>
  <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += `<li>
          <span>${TEAMS[game.teamA].name}</span>
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
