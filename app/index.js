const getLastNight = require('../src/utils/update')

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const games = await getLastNight()

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
  <style>
  body {
    background: #040405;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0;
    margin: 0;
    position: relative;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: .1;
    ;
    margin: 5px 0;
  }
  
  ul li:nth-child(1) {opacity: 1;}
  ul li:nth-child(2) {opacity: .85;}
  ul li:nth-child(3) {opacity: .7;}
  ul li:nth-child(4) {opacity: .55;}
  ul li:nth-child(5) {opacity: .4;}
  ul li:nth-child(6) {opacity: .3;}
  ul li:nth-child(7) {opacity: .2;}
  ul li:nth-child(8) {opacity: .1;}
  
  
  span {font-family: 'Anton', sans-serif;}
  button {
    font-family: 'Anton', sans-serif;
    font-size: 1.3rem;
    padding: 1rem 2rem;
    text-align: center;
    margin: 4rem auto;
    border: 1px solid white;
    background: transparent;
    color: white;
    text-transform: uppercase;
  }
  
  .score {
    opacity: 0;
    margin: 0 10px;
    font-size: 1rem;
    transition: opacity 300ms linear;
  }
  .show-scores .score {
    opacity: 1;
  }
  
  </style>
  </head>
  <body>
  <ul>`;

  games.sort((a,b) => a.delta > b.delta ? 1 : -1).forEach((game) => {
    if (game.delta) {
      html += `<li>
          <span class="score">${game.scoreA}</span><span>${makeName(game.teamA)}</span>
          -<span>${makeName(game.teamB)}</span><span class="score">${game.scoreB}</span>
        </li>`;
    }
  });

  html += `
    </li>
  </ul>
  <button id="scores">scores</button>
  <script>
    const btn = document.getElementById('scores');
    btn.addEventListener('click', () => {
      document.body.classList.toggle('show-scores')
    })
  </script>
  </body>
  </html>`;

  res.send(html);

};
