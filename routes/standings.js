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
    <div class="standingwrapper">`;

  ['Eastern', 'Western'].map(conf => {
    html += `<table class="standing" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th colspan="6">${conf} Conference</th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th class="center">W</th>
            <th class="center">L</th>
          </tr>
        </thead>
      <tbody>`;

    STANDINGS
      .filter(line => line.conference === conf[0])
      .sort((a, b) => a.rank > b.rank ? 1 : -1)
      .forEach((line, index) => {
        html += `<tr>
        <th>${index < 8 ? index + 1 : ''}</th>
        <td>${TEAMS[line.team].name}</td>
        <td class="center">${line.wins}</td>
        <td class="center">${line.losses}</td>
        </tr>`;
      });

    html += `
    </tbody>
    </table>`;
  })



  html += `</div >
  </div >
    ${footer(req.originalUrl)}
  <script src="js/index.js"></script>
  </body >
  </html > `;

  return res.send(html);
};
