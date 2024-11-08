const { getDateGames } = require('../crawlers/scores')
const { getStandings } = require('../crawlers/standings')

let standings;
getStandings().then(s => standings = s);

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
  const nba = (await getDateGames(yesterday, 'NBA')).map(game => ({
      ...game,
      heat: standings[game.teamA].pct + standings[game.teamB].pct
    }))
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

  nba.sort((a, b) => a.heat < b.heat ? 1 : -1).forEach(game => {
    html += `<li>`;
    html += `<div class="txt">${displayTeam(game.teamA)} - ${displayTeam(game.teamB)} ${game.delta <= 10 ? '[DELTA]' : ''} ${game.heat >= 100 ? '[MATCHUP]' : ''}</div>
    </li>`
  })

  html += `</ul></main>
    </body>
  </html>`;

  return res.send(html);
}
