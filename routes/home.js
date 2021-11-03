const dateFormat = require('dateformat');

const SCORES = require('../SCORES.json')

const htmlHeader = require('../partials/htmlheader');
const mainheader = require('../partials/mainheader');
const footer = require('../partials/footer');
const nav = require('../partials/nav');
const dates = require('../partials/dates');

const displayGame = require('../game');

let date;

const getDayBefore = (_date) => {
  const _d = new Date(_date);
  return _d.setDate(_d.getDate() - 1)
};
const getDayAfter = (_date) => {
  const _d = new Date(_date);
  return _d.setDate(_d.getDate() + 1)
};

module.exports = async (req, res) => {
  
  res.setHeader('Content-Type', 'text/html');

    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    date = req.query.date || dateFormat(`${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`, 'yyyy-mm-dd');

    previous = dateFormat(getDayBefore(date), 'yyyy-mm-dd')
    next = dateFormat(getDayAfter(date), 'yyyy-mm-dd')
    
    const games = SCORES.filter(game => {
      return game.date === date
    })

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    ${htmlHeader}
    <body class="homebody" data-long-press-delay="1000">
      ${mainheader}
      <ul class="datewrapper">
        ${dates(date)}  
      </ul>
      <header class="secondaryheader">
        <div class="container">
          <div>
            <label id="scoresflag" for="scores" class="flag">
              <input type="checkbox" id="scores"/> Show scores
            </label>
            <label id="tightflag" for="tight" class="flag">
              <input type="checkbox" id="tight"/> Only tight scores
            </label>
          </div>
        </div>
      </header>
      ${nav()}
      <div class="container">
      <ul class="games">`;

    games.sort((a, b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
      if (game.delta) {
        html += displayGame(game);
      }
    });

    html += `
    </>
    </div>
    ${footer(req.originalUrl)}
    <script src="js/index.js"></script>
    </body>
    </html>`;

    return res.send(html);
}