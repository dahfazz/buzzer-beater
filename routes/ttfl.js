const helpers = require('../crawlers/ttfl');

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'text/html');

  let year, month, day;

  const load = async () => {
    const ref = req.query.date ? new Date(req.query.date) : new Date()
    year = ref.getFullYear()
    month = ref.getMonth() + 1
    month = month < 10 ? '0' + month : month
    day = ref.getDate()
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
    <div class="bg-dark mb-4">
    <div class="container">

    <div class="d-flex gap-2 py-3">
      <div class="d-flex gap-2 align-self-center" style="min-width: 400px">
          <select id="select_day" class="form-select">
            <option ${day === '01' ? 'selected' : ''} value="01">01</option>
            <option ${day === '02' ? 'selected' : ''} value="02">02</option>
            <option ${day === '03' ? 'selected' : ''} value="03">03</option>
            <option ${day === '04' ? 'selected' : ''} value="04">04</option>
            <option ${day === '05' ? 'selected' : ''} value="05">05</option>
            <option ${day === '06' ? 'selected' : ''} value="06">06</option>
            <option ${day === '07' ? 'selected' : ''} value="07">07</option>
            <option ${day === '08' ? 'selected' : ''} value="08">08</option>
            <option ${day === '09' ? 'selected' : ''} value="09">09</option>
            <option ${day === '10' ? 'selected' : ''} value="10">10</option>
            <option ${day === '11' ? 'selected' : ''} value="11">11</option>
            <option ${day === '12' ? 'selected' : ''} value="12">12</option>
            <option ${day === '13' ? 'selected' : ''} value="13">13</option>
            <option ${day === '14' ? 'selected' : ''} value="14">14</option>
            <option ${day === '15' ? 'selected' : ''} value="15">15</option>
            <option ${day === '16' ? 'selected' : ''} value="16">16</option>
            <option ${day === '17' ? 'selected' : ''} value="17">17</option>
            <option ${day === '18' ? 'selected' : ''} value="18">18</option>
            <option ${day === '19' ? 'selected' : ''} value="19">19</option>
            <option ${day === '20' ? 'selected' : ''} value="20">20</option>
            <option ${day === '21' ? 'selected' : ''} value="21">21</option>
            <option ${day === '22' ? 'selected' : ''} value="22">22</option>
            <option ${day === '23' ? 'selected' : ''} value="23">23</option>
            <option ${day === '24' ? 'selected' : ''} value="24">24</option>
            <option ${day === '25' ? 'selected' : ''} value="25">25</option>
            <option ${day === '26' ? 'selected' : ''} value="26">26</option>
            <option ${day === '27' ? 'selected' : ''} value="27">27</option>
            <option ${day === '28' ? 'selected' : ''} value="28">28</option>
            <option ${day === '29' ? 'selected' : ''} value="29">29</option>
            <option ${day === '30' ? 'selected' : ''} value="30">30</option>
            <option ${day === '31' ? 'selected' : ''} value="31">31</option>
          </select>
          <select id="select_month" class="form-select">
            <option ${month === '01' ? 'selected' : ''} value="01">JAN</option>
            <option ${month === '02' ? 'selected' : ''} value="02">FEB</option>
            <option ${month === '03' ? 'selected' : ''} value="03">MAR</option>
            <option ${month === '04' ? 'selected' : ''} value="04">APR</option>
            <option ${month === '05' ? 'selected' : ''} value="05">MAY</option>
            <option ${month === '06' ? 'selected' : ''} value="06">JUN</option>
            <option ${month === '07' ? 'selected' : ''} value="07">JUL</option>
            <option ${month === '08' ? 'selected' : ''} value="08">AUG</option>
            <option ${month === '09' ? 'selected' : ''} value="09">SEP</option>
            <option ${month === '10' ? 'selected' : ''} value="10">OCT</option>
            <option ${month === '11' ? 'selected' : ''} value="11">NOV</option>
            <option ${month === '12' ? 'selected' : ''} value="12">DEC</option>
          </select>
          <select id="select_year" class="form-select">
            <option ${year === '2023' ? 'selected' : ''} value="2023">2023</option>
            <option ${year === '2024' ? 'selected' : ''} value="2024">2024</option>
            <option ${year === '2025' ? 'selected' : ''} value="2025">2025</option>
            <option ${year === '2026' ? 'selected' : ''} value="2026">2026</option>
            <option ${year === '2027' ? 'selected' : ''} value="2027">2027</option>
          </select>
          <button onClick="(() =>{
            const d = document.querySelector('#select_day').value;
            const m = document.querySelector('#select_month').value;
            const y = document.querySelector('#select_year').value;
            
            if (d && m && y) {
              
                let searchParams = new URLSearchParams(window.location.search);
                searchParams.set('date', m+'-'+d+'-'+y);
                window.location.search = searchParams.toString();
            }

})(arguments[0]);return false;" class="btn btn-primary">&gt;</button>
          <button onClick="(() =>{
                window.location.search = '';

})(arguments[0]);return false;" class="ms-1 btn btn-outline-primary text-white">today</button>
      </div>
      <div class="ms-auto d-flex gap-2">`

    const temp = []
    Object.keys(nightGames.oppositions).forEach(key => {
      if (!temp.includes(nightGames.oppositions[key])) {
        html += `<div style="" class="text-white border border-white py-2 px-3 border d-flex flex-column justify-content-center align-items-center"><span>${key}</span><span>${nightGames.oppositions[key]}</span></div>`;
      }
      temp.push(key)
    })

    html += `</div></div></div>
    </div>

    <div class="container">
    <div class="row">
    <div class="col col-lg-4">
    <h3 class="mb-3">Available</h3>

    <ul class="list-group">`;


    tonight.filter(a => !!a.player).filter(line => !getInjuryStatus(line.player)).sort((a, b) => a.TTFL < b.TTFL ? 1 : -1).forEach((line) => {
      const injuryStatus = getInjuryStatus(line.player);

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
      <div class="d-flex justify-content-end">
      
      <button data-player="${line.player}" class="btn btn-link text-primary" onClick="((e) =>{
        let ref = window.location.search.split('?date=')[1] ? new Date(window.location.search.split('?date=')[1]) : new Date()
        ref = new Date(ref.setHours(0,0,0,0))
        const player = e.currentTarget.getAttribute('data-player')
        const end = new Date(ref.setHours(0,0,0,0)).getTime()
        window.localStorage.setItem(player, end);
      })(arguments[0]);return false;">PICK!</button>`

      // <select data-player="${line.player}" class="me-2 form-select select-blocking-days">
      // <option value="">bloqué ?</option>`

      // Array.from(Array(40).keys()).forEach(nb => {

      //   html += `<option value = "${nb}" > ${nb}</option>`
      // })

      // html += `</select>`
      html += `</div></li>\n`
    })
    html += `</ul></div>
    
    <div class="col col-lg-4">
      <h3 class="mb-3">Blocked</h3>
      <div id="blocked" class="list-group">
      </div>
    </div>
    <div class="col col-lg-4">
    <h3 class="mb-3">Injury list</h3>
      <div class="list-group">`

    tonight.filter(a => !!a.player).filter(line => getInjuryStatus(line.player)).sort((a, b) => getInjuryStatus(a.player).statusCode - getInjuryStatus(b.player).statusCode || b.TTFL - a.TTFL).forEach(line => {
      html += `<div class="list-group-item d-flex"><span class="badge text-primary border border-primary d-flex me-2 align-items-center">${parseInt(line.TTFL, 10)}</span> ${line.player} ${getInjuryStatus(line.player).status}</div>`;
    })

    Object.keys(injuries)
    html += `</div>
    </div>
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
        const refDate = window.location.search.split('?date=')[1] ? new Date(window.location.search.split('?date=')[1]) : new Date()
        let ref = refDate.getTime()
        ref = new Date(new Date(ref).setHours(0,0,0,0))
        const item = document.createElement('div');
        item.classList.add('list-group-item')

        const select = document.createElement('select');
        select.classList.add('form-select')
        select.classList.add('select-blocking-days')
        select.setAttribute('data-player', key)
        select.classList.add('w-auto')
        const value = Math.round(30 - daysBetween(parseInt(blocks[key]), ref))
        if(value === 30) {
          item.classList.add('bg-primary')
          item.classList.add('text-white')
        }

        Array.from(Array(40).keys()).forEach((nb, index) => {
          const opt = document.createElement("option")
          opt.value = nb
          opt.text = nb + ' days'
          select.add(opt, null)
          if (nb === value) {
            console.log('setselect value')
            select.value = value;
            console.log(value, select)
            // opt.setAttribute('selected', true)
          }
        })


        
        item.innerHTML =  '<div class="w-100 d-flex justify-content-between align-items-center"><span>' + key + '</span>' + select.outerHTML + '</div>';
        if (value > 0) {
          value === 30 ? blockList.insertBefore(item, blockList.firstChild) : blockList.appendChild(item)
        }
      })

      const selects = Array.from(document.querySelectorAll('.select-blocking-days'))
      selects.forEach(select => {
        select.addEventListener('change', (e) => {
          const el = e.target;
          const player = el.getAttribute('data-player')
          const days = parseInt(el.value, 10);

          let ref = window.location.search.split('?date=')[1] ? new Date(window.location.search.split('?date=')[1]) : new Date();
          ref = new Date(ref.setHours(0,0,0,0))
        })
      })

      selects.forEach(select => {
        const player = select.getAttribute('data-player')
        const pickTime = parseInt(window.localStorage.getItem(player), 10)
        let pageDate = window.location.search.split('?date=')[1] ? new Date(window.location.search.split('?date=')[1]) : new Date()
        pageDate = new Date(pageDate.setHours(0,0,0,0))
        const pageTime = pageDate.getTime()
        const isConsumed = false;

        if (pickTime) {
          if (!isConsumed) {
            const nameEl = document.querySelector('#player-' + player.replaceAll(' ', '-'));
            select.value = 30 - Math.round(daysBetween(pageTime, pickTime));
          } else {
            // window.localStorage.removeItem(player)
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
