const helpers = require('../crawlers/ttfl');

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
    </head>

    </head>
    <body>
    <div class="container g-0">
    <div class="row justify-content-center">
    <div class="col col-lg-6">
    <ul class="list-group">`


    tonight.filter(a => !!a.player).sort((a, b) => a.TTFL < b.TTFL ? 1 : -1).forEach((line, index) => {
      const injuryStatus = getInjuryStatus(line.player);
      html += `<li style="`;

      html += index % 2 ? '' : 'background: rgba(0, 0, 0, .05)'

      html += `" class="list-group-item align-items-center d-flex justify-content-between"><div><span id="player-${line.player.replaceAll(' ', '-')}" class="fw-bold">${line.player}</span> (${line.team_id} vs ${nightGames.oppositions[line.team_id]})`

      if (injuryStatus) {
        html += `<span class="ms-2 badge bg-danger">${injuryStatus.status}</span>`
      }



      html += `</div>`

      html += `
      <div class="d-flex justify-content-end"><select data-player="${line.player}" class="me-2 form-select select-blocking-days">
      <option value="">bloqué ?</option>`

      Array.from(Array(31).keys()).forEach(nb => {

        html += `<option value = "${nb}" > ${nb}</option>`
      })

      html += `</select>
      <span class="badge bg-primary d-flex align-items-center">${parseInt(line.TTFL, 10)}</span></div></li>\n`
    })
    html += `</ul></div>
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
            const nameEl = document.querySelector('#player-' + player.replaceAll(' ', '-'));
            if (nameEl){
              nameEl.classList.remove('fw-bold')
              nameEl.classList.add('text-secondary')
              nameEl.classList.add('fw-light')
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
