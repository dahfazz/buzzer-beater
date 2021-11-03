const SCORES = require('../SCORES.json')

const htmlHeader = require('../partials/htmlheader');
const mainheader = require('../partials/mainheader');
const footer = require('../partials/footer');
const nav = require('../partials/nav');

const displayGame = require('../game');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  
  const games = SCORES.sort((a,b) => a.delta < b.delta ? -1 : 1).slice(0, 20);

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  ${htmlHeader}
  <body class="topbody" data-long-press-delay="1000">
    ${mainheader}
    <header class="secondaryheader">
      <div class="container">
        <div>
          <label id="scoresflag" for="scores" class="flag">
            <input type="checkbox" id="scores"/> Show scores
          </label>
        </div>
      </div>
    </header>
    ${nav()}
    <div class="container">
    <ul class="games">`;

  games.sort((a, b) => a.rating < b.rating ? 1 : -1).forEach((game) => {
    html += displayGame(game);
  });

  html += `
  </ul>
  </div>
  ${footer(req.originalUrl)}
  <script src="js/index.js"></script>
  </body>
  </html>`;

  return res.send(html);
};
