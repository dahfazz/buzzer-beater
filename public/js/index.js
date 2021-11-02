const scores = document.querySelector('#scoresflag');
if (scores) {
  scores.addEventListener('change', (e) => {
    e.currentTarget.querySelector('input').checked
    ? e.currentTarget.classList.add('selected')
    : e.currentTarget.classList.remove('selected')
    document.body.classList.toggle('withscores')
  })
}

const navcontrol = document.querySelector('#navcontrol');
if (navcontrol) {
  navcontrol.addEventListener('click', (e) => {
    document.querySelector('#nav').classList.toggle('visible')
  })
}

const tights = document.querySelector('#tightflag');
if (tights) {
  tights.addEventListener('change', (e) => {
    e.currentTarget.querySelector('input').checked
    ? e.currentTarget.classList.add('selected')
    : e.currentTarget.classList.remove('selected')
    document.body.classList.toggle('onlytop')
  })
}
