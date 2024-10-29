const { getDateGames } = require('../crawlers/scores')

const NodeCache = require("node-cache");
const myCache = new NodeCache();

const displayTeam = team => {
  switch (team) {
    case 'GS': return 'GSW';
    case 'NY': return 'NYK';
    case 'SA': return 'SAS';
    default: return team;

  }
}

module.exports = async (_, res) => {

  res.setHeader('Content-Type', 'text/html');

  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  let all = []
  const cache = myCache.get(yesterday.toDateString());

  if (cache) {
    all = cache;
  } else {
    const nba = (await getDateGames(yesterday, 'NBA'))
    // const wnba = (await getDateGames(yesterday, 'WNBA'))
    all = [...nba]

    myCache.set(yesterday.toDateString(), all);
  }

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Buzzer Beater</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <link href="tweet.css" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans&display=swap" rel="stylesheet">
    </head>

    <body>
    <main>
      <ul class="moneytimes">`;

  const HOT_DELTA = 6;

  all.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach(game => {
    html += `<li class="${game.delta <= HOT_DELTA && 'hot'}">`;
    // <div class="logo ${game.league.toLowerCase()}"></div>
    html += `<div class="txt">${displayTeam(game.teamA)} <span class="score">${game.scoreA}</span> - <span class="score">${game.scoreB}</span> ${displayTeam(game.teamB)}</div>
    </li>`
  })

  html += `</ul></main>
  <button id="toggle">Toggle scores</button>
    </body>

    <script src="toggle.js"></script>
  </html>`;

  return res.send(html);
}
