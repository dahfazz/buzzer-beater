import { getEvaluations } from "../bots/main";

const displayTeam = (team: string): string => {
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
  const games = await getEvaluations(yesterday.getDate(), yesterday.getMonth() + 1, yesterday.getFullYear())

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

  games.sort((a, b) => a.evaluation < b.evaluation ? 1 : -1).forEach(game => {
    html += `<li>`;
    html += `<div class="txt">${displayTeam(game.away.team)} - ${displayTeam(game.home.team)} eval: ${game.evaluation}</div>
    </li>`
  })

  html += `</ul></main>
    </body>
  </html>`;

  return res.send(html);
}
