const helpers = require('../crawlers/ttfl');
const pics = require('./pics');

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'text/html');


  const load = async () => {
    const lines = await helpers.getTTFLscores()
    const injuries = await helpers.getInjuries()
    const nightGames = await helpers.getNightGames()

    const tonight = lines.filter(line => {
      return nightGames.engaged.indexOf(line.team_id) > -1
    })


    const getInjuryStatus = (player) => {
      const key = player.toLowerCase();
      return injuries[key]
    }

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TTFL HELPER</title>

      <link rel="manifest" href="manifest.json">

      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="application-name" content="Buzzer Beater">
      <meta name="apple-mobile-web-app-title" content="Buzzer Beater">
      <meta name="theme-color" content="#000">
      <meta name="msapplication-navbutton-color" content="#000">
      <meta name="apple-mobile-web-app-status-bar-style" content="black">
      <meta name="msapplication-starturl" content="/">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <link rel="icon" type="image/png" sizes="144x144" href="favicon.png">
      <link rel="apple-touch-icon" type="image/png" sizes="110x110" href="favicon.png">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <style>
      .player-blocked {
        background: rgba(0,0,0,1)
      }
      .player-blocked .position-absolute.p-2 {
        background: rgba(0,0,0,.95)
      }
      </style>
    </head>

    </head>
    <body>
    <div class="container g-0">
    <div class="row g-2">`


    tonight.filter(a => !!a.player).sort((a, b) => a.TTFL < b.TTFL ? 1 : -1).forEach((line, index) => {
      line.player = line.player.replaceAll('č', 'c')
      line.player = line.player.replaceAll('ć', 'c')
      line.player = line.player.replaceAll('ģ', 'g')
      line.player = line.player.replaceAll('ü', 'u')
      line.player = line.player.replaceAll('Ş', 'S')
      line.player = line.player.replaceAll('ņ', 'n')
      const injuryStatus = getInjuryStatus(line.player);

      html += `<div class="position-relative col col-lg-2" id="player-${line.player.replaceAll(' ', '-')}">
      <div class="position-relative" style="height: 280px; background: url(${pics[line.player]}) no-repeat center; background-size: cover">
      <div class="position-absolute p-2" style="top:0; right: 0; bottom: 0; left: 0; background: rgba(0, 0,0,.5)">
      <span style="" class="fs-5 fw-bold text-white">${line.player}<br><span class="fs-6 fw-light">${line.team_id} vs ${nightGames.oppositions[line.team_id]}</span></span>`

      if (injuryStatus) {
        html += `<span style="bottom:0; top:0;right:0;left:0; margin: auto;" class="fs-4 position-absolute d-flex justify-content-center align-items-center text-danger">${injuryStatus.status}</span>`
      }




      html += `
      <select data-player="${line.player}" style="height: 46px; bottom: 10px; left: 10px; width: 110px" class="me-2 form-select position-absolute select-blocking-days">
      <option value="">bloqué ?</option>`

      Array.from(Array(31).keys()).forEach(nb => {

        html += `<option value="${nb}">${nb} days</option>`
      })

      html += `</select>
      <span style="bottom: 10px; right: 10px" class="position-absolute fs-3 badge bg-primary d-flex align-items-center">${parseInt(line.TTFL, 10)}</span></div></div>
      </div>`
    })
    html += `
    </div>
    </div>
    </div>
    <script>
      Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      }

      const daysBetween = (t1, t2) => (t2 - t1) / (1000 * 3600 * 24)

      const selects = Array.from(document.querySelectorAll('.select-blocking-days'))
      selects.forEach(select => {
        select.addEventListener('change', (e) => {
          const el = e.target;
          const player = el.getAttribute('data-player')
          const days = parseInt(el.value, 10);

          const today = new Date()
          const end = today.addDays(days)
          window.localStorage.setItem(player, end.getTime());
        })
      })

      selects.forEach(select => {
        const player = select.getAttribute('data-player')
        const storage = parseInt(window.localStorage.getItem(player), 10)
        const today = new Date().getTime()
        const isInFuture = storage && storage > today;

        if (storage) {
          if (isInFuture) {
            const playerEl = document.querySelector('#player-' + player.replaceAll(' ', '-'));
            if (playerEl){
              playerEl.classList.add('player-blocked')
            }
            select.value = Math.round(daysBetween(today, storage));
          } else {
            window.localStorage.removeItem(player)
          }
        }
      })
    </script>
    </body>
  </html>`;

    return res.send(html);
  }

  return load()


}
