const helpers = require('../crawlers/ttfl');

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'text/html');


  const load = async () => {
    const ref = req.query.date ? new Date(req.query.date) : new Date()
    const year = ref.getFullYear()
    let month = ref.getMonth() + 1
    month = month < 10 ? '0' + month : month
    let day = ref.getDate()
    day = day < 10 ? '0' + day : day
    let _date = `${year}${month}${day}`

    const lines = await helpers.getTTFLscores()
    const injuries = await helpers.getInjuries()
    const nightGames = await helpers.getNightGames(_date)

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
        .available .player {
          color: green;
        }
      </style>
    </head>

    </head>
    <body>
    <div class="container g-0">
    <div class="row">
    <div class="col col-lg-5">
    <h3>${_date}</h3>
    <ul class="list-group">`


    tonight.filter(a => !!a.player).sort((a, b) => a.TTFL < b.TTFL ? 1 : -1).forEach((line) => {
      const injuryStatus = getInjuryStatus(line.player);

      if (injuryStatus) return;

      html += `<li style="`;

      html += injuryStatus ? 'background: rgba(255, 0, 0, .03)' : ''

      html += `" id="player-${line.player.replaceAll(' ', '-')}" class="available list-group-item align-items-center d-flex justify-content-between">
      <div class="d-flex">
      <span class="badge bg-primary d-flex me-2 align-items-center">${parseInt(line.TTFL, 10)}</span>
      <span class="player me-2">${line.player}</span> <span class="fs-6 text-secondary">(vs ${nightGames.oppositions[line.team_id]})</span>`

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

      html += `</select></div></li>\n`
    })
    html += `</ul></div>
    
    <div class="col col-lg-3">
      <div id="blocked" class="list-group">
      </div>
    </div>
    <div class="col col-lg-3">
      <div id="injured" class="list-group">`

    Object.keys(injuries).forEach(key => {
      html += `<div class="list-group-item">${key} ${getInjuryStatus(key).status}</div>`;
    })
    html += `</div>
    </div>
    </div>
    </div>
    <script>
      const blocks = {...localStorage};
      const blockList = document.querySelector('#blocked');
      
      Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      }
      
      const daysBetween = (t1, t2) => (t2 - t1) / (1000 * 3600 * 24)
      
      const sortable = Object.keys(blocks).sort((a,b) => parseInt(blocks[a]) > parseInt(blocks[b]) ? 1 : -1)
      
      sortable.forEach(key => {
        const refDate = window.location.search['date'] ? new Date(window.location.search['date']) : new Date()
        const ref = refDate.getTime()
        const item = document.createElement('div');
        item.classList.add('list-group-item')

        const value = Math.round(daysBetween(ref, parseInt(blocks[key])))
        item.innerText = key + ' ' + value;
        if (value > 0) blockList.appendChild(item)
      })

      const selects = Array.from(document.querySelectorAll('.select-blocking-days'))
      selects.forEach(select => {
        select.addEventListener('change', (e) => {
          const el = e.target;
          const player = el.getAttribute('data-player')
          const days = parseInt(el.value, 10);

          const refDate = window.location.search['date'] ? new Date(window.location.search['date']) : new Date()
          const end = refDate.addDays(days)
          window.localStorage.setItem(player, end.getTime());
        })
      })

      selects.forEach(select => {
        const player = select.getAttribute('data-player')
        const storage = parseInt(window.localStorage.getItem(player), 10)
        const refDate = window.location.search['date'] ? new Date(window.location.search['date']) : new Date()
        const ref = refDate.getTime()
        const isInFuture = storage && storage > ref;

        if (storage) {
          if (isInFuture) {
            const nameEl = document.querySelector('#player-' + player.replaceAll(' ', '-'));
            if (nameEl){
              nameEl.remove()
            }
            select.value = Math.round(daysBetween(ref, storage));
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
