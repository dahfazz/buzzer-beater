const express = require('express');
const PORT = process.env.PORT || 3000;

const TEAMS = require('./teams');

const displayGame = require('./game');

const dateFormat = require('dateformat');

const getHTMLheader = () => `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Buzzer Beater</title>

<link rel="manifest" href="manifest.json">

<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="application-name" content="Buzzer Beater">
<meta name="apple-mobile-web-app-title" content="Buzzer Beater">
<meta name="theme-color" content="#000">
<meta name="msapplication-navbutton-color" content="#000">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="msapplication-starturl" content="/">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<link rel="icon" type="image/png" sizes="144x144" href="favicon.png">
<link rel="apple-touch-icon" type="image/png" sizes="110x110" href="favicon.png">

<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="styles.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>`

const getNav = () => {
  let _html = `<nav class="nav" id="nav">
  <div class="container">
    <a class="navitem" href="/top">Season top games...</a>
    <div class="teamgrid">`;
    Object.keys(TEAMS).forEach(team => _html += `<a href="/team?key=${team}" style="background-image: url('logos/${TEAMS[team].key.toLowerCase()}.gif')"></a>`);
  
    _html += `  </div>
    </div>
    </nav>`;

  return _html;
}



let date;

const app = express();

const SCORES = require('./SCORES.json')

const getDayBefore = (_date) => {
  const _d = new Date(_date);
  return _d.setDate(_d.getDate() - 1)
};
const getDayAfter = (_date) => {
  const _d = new Date(_date);
  return _d.setDate(_d.getDate() + 1)
};

const isToday = (_date) => {
  const _d = new Date(_date);
  const today = new Date(); 
  return _d.getDate() === today.getDate() && _d.getMonth() === today.getMonth() && _d.getFullYear() === today.getFullYear()
}

app.get('/top', async (_, res) => {
  res.setHeader('Content-Type', 'text/html');
  
  const games = SCORES.sort((a,b) => b.delta < a.delta ? 1 : 1).slice(0, 20);

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  ${getHTMLheader()}
  <body>
    <header class="mainheader">
      <div class="container">
        <div class="otherlogo">
          <span class="bg"></span>
          <span class="time"></span>
        </div>
      <div class="datewrapper">
        <span class="date">TOP 20</span>
      </div>
      </div>
    </header>
    <header class="secondaryheader">
      <div class="container">
        <div>
          <label id="scoresflag" for="scores" class="flag">
            <input type="checkbox" id="scores"/> Scores
          </label>
        </div>
        <button id="navcontrol" class="menuopener">
          <span class="material-icons">menu</span>
        </button>
      </div>
    </header>
    ${getNav()}
    <div class="container">
    <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += displayGame(game);
    }
  });

  html += `
  </ul>
  </div>
  <script>
    const scores = document.querySelector('#scoresflag');
    scores.addEventListener('change', (e) => {
      e.currentTarget.querySelector('input').checked
      ? e.currentTarget.classList.add('selected')
      : e.currentTarget.classList.remove('selected')
      document.body.classList.toggle('withscores')
    })

    const navcontrol = document.querySelector('#navcontrol');
      navcontrol.addEventListener('click', (e) => {
        document.querySelector('#nav').classList.toggle('visible')
      })
  </script>
  </body>
  </html>`;

  return res.send(html);
});

app.get('/team', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  
  const games = SCORES.filter(game => game.teamA === req.query.key || game.teamB === req.query.key);

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  ${getHTMLheader()}
  <body>
    <header class="mainheader">
      <div class="container">
        <div class="otherlogo">
          <span class="bg"></span>
          <span class="time"></span>
        </div>
      <div class="datewrapper">
        <span class="date">TOP 20</span>
      </div>
      </div>
    </header>
    <header class="secondaryheader">
      <div class="container">
        <div>
          <label id="scoresflag" for="scores" class="flag">
            <input type="checkbox" id="scores"/> Scores
          </label>
        </div>
        <button id="navcontrol" class="menuopener">
          <span class="material-icons">menu</span>
        </button>
      </div>
    </header>
    ${getNav()}
    <div class="container">
    <ul>`;

  games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += displayGame(game);
    }
  });

  html += `
  </ul>
  </div>
  <script>
    const scores = document.querySelector('#scoresflag');
    scores.addEventListener('change', (e) => {
      e.currentTarget.querySelector('input').checked
      ? e.currentTarget.classList.add('selected')
      : e.currentTarget.classList.remove('selected')
      document.body.classList.toggle('withscores')
    })

    const navcontrol = document.querySelector('#navcontrol');
      navcontrol.addEventListener('click', (e) => {
        document.querySelector('#nav').classList.toggle('visible')
      })
  </script>
  </body>
  </html>`;

  return res.send(html);
});

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    date = req.query.date || dateFormat(`${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`, 'yyyy-mm-dd');
    console.log(req.query.date, date)

    previous = dateFormat(getDayBefore(date), 'yyyy-mm-dd')
    next = dateFormat(getDayAfter(date), 'yyyy-mm-dd')
    
    const games = SCORES.filter(game => {
      return game.date === date
    })

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    ${getHTMLheader()}
    <body>
      <header class="mainheader">
        <div class="container">
          <div class="otherlogo">
            <span class="bg"></span>
            <span class="time"></span>
          </div>
        <div class="datewrapper">
        <span class="date">${date}</span>
        <a href="?date=${previous}"><span class="material-icons">navigate_before</span></a>
        ${
            isToday(date) ? `<a disabled><span class="material-icons">navigate_next</span></a>` : `<a href="?date=${next}"><span class="material-icons">navigate_next</span></a>`
          }
          
        </div>
        </div>
      </header>
      <header class="secondaryheader">
        <div class="container">
          <div>
            <label id="scoresflag" for="scores" class="flag">
              <input type="checkbox" id="scores"/> Scores
            </label>
            <label id="tightflag" for="tight" class="flag">
              <input type="checkbox" id="tight"/> Only tight scores
            </label>
          </div>
          <button id="navcontrol" class="menuopener">
            <span class="material-icons">menu</span>
          </button>
        </div>
      </header>
      ${getNav()}
      <div class="container">
      <ul>`;

    games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
      if (game.delta) {
        html += displayGame(game);
      }
    });

    html += `
    </ul>
    </div>
    <script>
      const scores = document.querySelector('#scoresflag');
      scores.addEventListener('change', (e) => {
        e.currentTarget.querySelector('input').checked
        ? e.currentTarget.classList.add('selected')
        : e.currentTarget.classList.remove('selected')
        document.body.classList.toggle('withscores')
      })

      const tights = document.querySelector('#tightflag');
      tights.addEventListener('change', (e) => {
        e.currentTarget.querySelector('input').checked
        ? e.currentTarget.classList.add('selected')
        : e.currentTarget.classList.remove('selected')
        document.body.classList.toggle('onlytop')
      })

      const navcontrol = document.querySelector('#navcontrol');
      navcontrol.addEventListener('click', (e) => {
        document.querySelector('#nav').classList.toggle('visible')
      })
    </script>
    </body>
    </html>`;

    return res.send(html);
  });

  app.use(express.static(__dirname + '/public'));

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
