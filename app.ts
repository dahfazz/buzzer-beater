import express from 'express'
import { json } from 'body-parser'
import axios, { AxiosResponse } from 'axios';
import { CheerioAPI, load } from 'cheerio';

const PORT = process.env.PORT || 3000;

const displayTeam = (team: string): string => {
  switch (team) {
    case 'GS': return 'GSW';
    case 'NY': return 'NYK';
    case 'SA': return 'SAS';
    default: return team;
  }
}

interface GameTeam {
  score: number,
  team: string,
}
export interface Game {
  away: GameTeam,
  home: GameTeam,
  delta?: number,
}

const getEvaluations = async (day: number, month: number, year: number): Promise<Game[]> => {
  const URL = `https://www.covers.com/sports/nba/matchups?selectedDate=${year}-${month}-${day}`
  const DATA: Game[] = []

  const resp: AxiosResponse = await axios.get(URL);
  const $: CheerioAPI = load(resp.data);

  $('.gamebox').each((_, gameBox) => {

    const home: GameTeam = {
      team: $(gameBox).find('.gamebox-header').text().split('@')[1].trim(),
      score: parseInt($(gameBox).find('.team-score.home').text())
    }
    const away: GameTeam = {
      team: $(gameBox).find('.gamebox-header').text().split('@')[0].trim(),
      score: parseInt($(gameBox).find('.team-score.away').text())
    }

    DATA.push({
      home,
      away,
      delta: Math.abs(home.score - away.score)
    })

  })

  return DATA;
}

const app = express();
app.use(json())

// ROUTER
app.get('/', async (_, res) => {
  res.setHeader('Content-Type', 'text/html');

  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  const games = await getEvaluations(yesterday.getDate(), yesterday.getMonth() + 1, yesterday.getFullYear())

  console.log(games)

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

  games.sort((a: Game, b: Game) => a.delta - b.delta).forEach((game: Game) => {
    html += `<li>`;
    html += `<div class="txt">${displayTeam(game.away.team)} - ${displayTeam(game.home.team)} (${game.delta})</div>
    </li>`
  })

  html += `</ul></main>
    </body>
  </html>`;

  return res.send(html);
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
