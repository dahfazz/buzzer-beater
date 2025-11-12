"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const PORT = process.env.PORT || 3000;
const displayTeam = (team) => {
    switch (team) {
        case 'GS': return 'GSW';
        case 'NY': return 'NYK';
        case 'SA': return 'SAS';
        default: return team;
    }
};
const getEvaluations = async (day, month, year) => {
    const URL = `https://www.covers.com/sports/nba/matchups?selectedDate=${year}-${month}-${day}`;
    const DATA = [];
    const resp = await axios_1.default.get(URL);
    const $ = (0, cheerio_1.load)(resp.data);
    $('.gamebox').each((_, gameBox) => {
        const home = {
            team: $(gameBox).find('.gamebox-header').text().split('@')[1].trim(),
            score: parseInt($(gameBox).find('.team-score.home').text())
        };
        const away = {
            team: $(gameBox).find('.gamebox-header').text().split('@')[0].trim(),
            score: parseInt($(gameBox).find('.team-score.away').text())
        };
        DATA.push({
            home,
            away,
            delta: Math.abs(home.score - away.score)
        });
    });
    return DATA;
};
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
// ROUTER
app.get('/', async (_, res) => {
    res.setHeader('Content-Type', 'text/html');
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const games = await getEvaluations(yesterday.getDate(), yesterday.getMonth() + 1, yesterday.getFullYear());
    console.log(games);
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
    games.sort((a, b) => a.delta - b.delta).forEach((game) => {
        html += `<li>`;
        html += `<div class="txt">${displayTeam(game.away.team)} - ${displayTeam(game.home.team)} (${game.delta})</div>
    </li>`;
    });
    html += `</ul></main>
    </body>
  </html>`;
    return res.send(html);
});
app.use(express_1.default.static(__dirname + '/public'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
