const express = require('express');
const PORT = process.env.PORT || 3000

const displayGame = require('./game');
const TEAMS = require('./teams');

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

let date;

const app = express();

app.get('/', async (req, res) => {
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
    <link href="styles.css" rel="stylesheet">
  </head>
  <body>
  <div class="date">${formatted}</div>
  <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += displayGame(game);
    }
  });

  html += `
  </ul>
  </body>
  </html>`;

  return res.send(html);
  });

  app.use(express.static(__dirname + '/public'));

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
