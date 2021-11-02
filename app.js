const express = require('express');
const PORT = process.env.PORT || 3000

const displayGame = require('./game');
const TEAMS = require('./teams');

const dateFormat = require('dateformat');
const axios = require('axios');
const cheerio = require('cheerio');

let date;

const app = express();

const getDayBefore = (_date) => {
  const _d = new Date(_date);
  return _d.setDate(_d.getDate() - 1)
};
const getDayAfter = (_date) => {
  const _d = new Date(_date);
  return _d.setDate(_d.getDate() +1)
};

const isToday = (_date) => {
  const _d = new Date(_date);
  const today = new Date(); 
  return _d.getDate() === today.getDate() && _d.getMonth() === today.getMonth() && _d.getFullYear() === today.getFullYear()
}

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

  date = req.query.date || new Date();
  yesterday = getDayBefore(date);
  formatted = dateFormat(yesterday, 'yyyy-mm-dd');

  previous = dateFormat(getDayBefore(date), 'yyyy-mm-dd')
  next = dateFormat(getDayAfter(date), 'yyyy-mm-dd')
  
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
    <title>Buzzer Beater</title>
    <link rel="icon" href="favicon.png">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="styles.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  </head>
  <body>
    <header class="mainheader">
      <div class="otherlogo">
        <span class="bg"></span>
        <span class="time"></span>
      </div>
      <div class="datewrapper">
      <span class="date">${formatted}</span>
      <a href="?date=${previous}"><span class="material-icons">navigate_before</span></a>
      ${
          isToday(date) ? `<a disabled><span class="material-icons">navigate_next</span></a>` : `<a href="?date=${next}"><span class="material-icons">navigate_next</span></a>`
        }
        
      </div>
    </header>
    <header class="secondaryheader">
      <label id="scoresflag" for="scores" class="flag">
        <input type="checkbox" id="scores"/> Scores
      </label>
      <label id="topflag" for="top" class="flag">
        <input type="checkbox" id="top"/> Only tight scores
      </label>
    </header>
    <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += displayGame(game);
    }
  });

  html += `
  </ul>
  <script>
    const scores = document.querySelector('#scoresflag');
    scores.addEventListener('change', (e) => {
      e.currentTarget.querySelector('input').checked
      ? e.currentTarget.classList.add('selected')
      : e.currentTarget.classList.remove('selected')
      document.body.classList.toggle('withscores')
    })

    const tops = document.querySelector('#topflag');
    tops.addEventListener('change', (e) => {
      e.currentTarget.querySelector('input').checked
      ? e.currentTarget.classList.add('selected')
      : e.currentTarget.classList.remove('selected')
      document.body.classList.toggle('onlytop')
    })
  </script>
  </body>
  </html>`;

  return res.send(html);
  });

  app.use(express.static(__dirname + '/public'));

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
