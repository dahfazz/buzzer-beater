const STANDINGS = require('../STANDINGS.json')
const TEAMS = require('../teams')

const htmlHeader = require('../partials/htmlheader');
const mainheader = require('../partials/mainheader');
const footer = require('../partials/footer');
const nav = require('../partials/nav');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
    
  let html = `
  <!DOCTYPE html>
  <html lang="en">
  ${htmlHeader}
  <body class="stbody" data-long-press-delay="1000">
    ${mainheader}
    ${nav()}
    <div class="container">
    <div class="standingwrapper">
    <ol class="standing">`;

    html += `<li class="conf">Eastern Conference</li>`;
    STANDINGS
      .filter(line => line.conference === 'E')
      .sort((a, b) => a.rank > b.rank ? 1 : -1)
      .forEach((line, index) => {
      html += `<li>
      ${index+1}. ${TEAMS[line.team].name}
      </li>`;
  });

  html += `
  </ol>
  <ol class="standing">`;

    html += `<li class="conf">Western Conference</li>`;
    STANDINGS
      .filter(line => line.conference === 'W')
      .sort((a, b) => a.rank > b.rank ? 1 : -1)
      .forEach((line, index) => {
      html += `<li>
      ${index+1}. ${TEAMS[line.team].name}
      </li>`;
  });

  html += `
  </ol>
  </div>
  </div>
  ${footer(req.originalUrl)}
  <script src="js/index.js"></script>
  </body>
  </html>`;

  return res.send(html);
};
