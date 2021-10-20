const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 3000

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
    margin: 1rem 1.5rem;
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    text-align: left;
    align-items: center;
    margin: 0;
    padding: .5rem 0;
  }
  
  span {
    font-family: "Cousine", monospace;
    font-size: 2rem;
  }
  
  </style>
  </head>
  <body>
  <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += `<li>
          <span>${makeName(game.teamA)}</span>&nbsp;-&nbsp;
          <span>${makeName(game.teamB)}</span> ${game.delta < 10 ? ' ⭐' : ''}
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
