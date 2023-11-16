const SCHEDULE = require('../SCHEDULE.json');
const DROMADAIRES = require('../DROMADAIRES.json');

const DB = require('../public/DB.json')

module.exports = async (req, res) => {
  const PLAYER = req.query.dromadaire
  const PICKS = DB[PLAYER].picks;

  const getDatePick = (date) => {
    const d = Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(date))

    return PICKS.filter(pi => pi.date === d).length ? PICKS.filter(pi => pi.date === d)[0].player : null
  }

  res.setHeader('Content-Type', 'text/html');

  let dates = SCHEDULE.filter(sch => !!sch.date).sort((a, b) => {
    return new Date(a.date) > new Date(b.date) ? 1 : -1
  }).map(sch => sch.date)

  let html = `
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="scheduler.css" rel="stylesheet">
</head>

<body class="bg-dark-subtle">
  <div class="d-flex m-3">
  <nav class="list-group vh-100 position-fixed">`;

  DROMADAIRES.forEach(drm => {
    html += `<a href="?dromadaire=${drm}" class="${drm === PLAYER ? 'active' : ''} list-group-item list-group-item-action">${drm}</a>`
  })

  html += `</nav>
  <main style="margin-left: 140px">`

  dates = dates.filter((s, index) => dates.indexOf(s) === index)
    .forEach(_date => {
      const dayPick = getDatePick(_date)
      html += `<div class="mb-1 d-flex align-items-center gap-3 text-white p-3 ${!!dayPick ? 'has-pick' : 'no-pick'}">
    <div>${_date}</div>
      <div class="pick">${dayPick || ''}</div>
      <button data-date="${_date}" onClick="cancelPick(event)" class="cancel-btn btn btn-link btn-danger text-danger py-0">cancel</button>`;


      html += `<div class="search ms-auto">
          <div class="input-group">
            <span class="input-group-text">
              <span class="material-icons">search</span>
            </span>
            <input data-date="${_date}" type="search" class="form-control" placeholder="player name" onKeyUp="keyPressed(event)" onClick="focusSearch(event)">
          </div>
          <div class="list-group results"></div>
        </div>`

      html += `</div>`
    })

  html += `</main>

  <script>

  const closeAllResults = () => {
    Array.from(document.querySelectorAll('.results')).forEach(r => {
      r.innerHTML = ''
      r.classList.remove('d-block')
    })
    document.body.classList.remove('overflow-hidden');
  }

  document.body.addEventListener('click', () => {
    closeAllResults()
  })

  const focusSearch = (event) => {
    openOneResultList(event.currentTarget)
  }

  const openOneResultList = (target) => {
    event.stopPropagation();
    const wrapper = target.parentElement.parentElement;
    if (!wrapper) return;
    const results = wrapper.querySelector('.results');
    if (!results) return;
    closeAllResults()
    results.classList.add('d-block')
    document.body.classList.add('overflow-hidden');

    fetch('helper?date=' + target.getAttribute('data-date')).then(resp => {
      resp.json().then(json => {

        json.map((j, i) => {
          const btn = document.createElement('button');
          btn.classList.add('result', 'list-group-item', 'list-group-item-action', 'list-group-item-light')
          btn.innerHTML = (i+1) + '. ' + j.player + ' (' + j.average + ')'
          btn.addEventListener('click', () => {
            target.value = j.player;
            
            // SAVE PICK
            const __date = target.getAttribute('data-date').split(',').slice(1, 3).join(',').trim()
            const body = { date: __date, player: j.player }
            const requestOptions = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            };
            fetch('picks/dahfazz', requestOptions).then(_ => {
              target.value = ''
              wrapper.parentElement.classList.add('has-pick')
              wrapper.parentElement.classList.remove('no-pick')
              wrapper.parentElement.querySelector('.pick').innerText = j.player;
            })
          })
          results.appendChild(btn)
        })
      })
    })
  }

  const resetFilter = () => {
    Array.from(document.querySelectorAll('.result')).forEach(r => r.classList.remove('d-none'))
  }

  const keyPressed = (event) => {
    if (event.key === 'Escape') closeAllResults();
    if (event.key === 'Enter') openOneResultList(event.currentTarget);

    if (event.currentTarget.value.length >= 3) {
       const wrapper = event.currentTarget.parentElement.parentElement;
        if (!wrapper) return;
        const btns = Array.from(wrapper.querySelectorAll('.result'));
        if (!btns) return;

        btns.forEach(btn => {
          if (btn.innerText.toLowerCase().indexOf(event.currentTarget.value.toLowerCase()) < 0) {
            btn.classList.add('d-none')
          }
        })
    } else {
      resetFilter()
    }
  }

  const cancelPick = (event) => {
    const wrapper = event.currentTarget.parentElement;
    if (!wrapper) return;
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('picks/dahfazz/' + event.currentTarget.getAttribute('data-date').split(',').slice(1, 3).join(',').trim(), requestOptions).then(_ => {
      wrapper.classList.remove('has-pick')
      wrapper.classList.add('no-pick')
      wrapper.querySelector('.pick').innerText = '';
    })
  }

  </script>
</body>
</html>`;
  return res.send(html);
}
