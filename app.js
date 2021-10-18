const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening', port);
});

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

let date;

const makeName = (name) => {
  const PRESETS = {
    NY: 'NYC',
    GS: 'GSW',
    SA: 'SAS',
    BK: 'BKL'
  }

  return PRESETS[name] || name;
}

app.get('/', async (_, res) => {
  res.setHeader('Content-Type', 'text/html');

  date = new Date('03-10-2021');
  yesterday = date.setDate(date.getDate() - 1);
  formatted = dateFormat(yesterday, 'yyyy-mm-dd')

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
<link href="https://fonts.googleapis.com/css2?family=Cousine:wght@700&display=swap" rel="stylesheet">
  <style>
  body {
    background: #040405;
    color: white;
    padding: 0;
    margin: 0;
    position: relative;
  }
  ul {
    margin: 2rem 0;
    padding: 0;
    list-style: none;
  }
  li {
    font-size: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 0;
  }
  
  span {font-family: 'Cousine', sans-serif;}
  button {
    font-size: 1rem;
    padding: 1rem 2rem;
    text-align: center;
    background: #000;
    color: white;
    border: none;
    text-transform: uppercase;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
  }
  
  .score {
    opacity: 0;
    margin: 0 10px;
    font-size: 1rem;
    transition: opacity 300ms linear;
  }
  .show-scores .score {
    opacity: 1;
  }
  
  </style>
  </head>
  <body>
  <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += `<li>
          <span class="score">${game.scoreA}</span><span>${makeName(game.teamA)}</span>
          -<span>${makeName(game.teamB)}</span><span class="score">${game.scoreB}</span>
        </li>`;
    }
  });

  html += `
    </li>
  </ul>
  <button id="scores">scores</button>
  <script>
    const btn = document.getElementById('scores');
    btn.addEventListener('click', () => {
      document.body.classList.toggle('show-scores')
    })
  </script>
  </body>
  </html>`;

  res.send(html);
});

module.exports = app;
