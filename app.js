"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const main_1 = require("./bots/main");
const PORT = process.env.PORT || 3000;
const jsonParser = (0, body_parser_1.json)();
const displayTeam = (team) => {
    switch (team) {
        case 'GS': return 'GSW';
        case 'NY': return 'NYK';
        case 'SA': return 'SAS';
        default: return team;
    }
};
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
// ROUTER
app.get('/', async (_, res) => {
    res.setHeader('Content-Type', 'text/html');
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const games = await (0, main_1.getEvaluations)(yesterday.getDate(), yesterday.getMonth() + 1, yesterday.getFullYear());
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
    </li>`;
    });
    html += `</ul></main>
    </body>
  </html>`;
    return res.send(html);
});
app.use(express_1.default.static(__dirname + '/public'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
