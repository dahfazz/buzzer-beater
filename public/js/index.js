const notify = (msg) => {
  const el = document.createElement('div')
  el.classList.add('notif')
  el.innerText = msg;

  document.body.appendChild(el);

  setTimeout(() => {
    document.body.removeChild(el)
  }, 2000)
}

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

const lps = document.querySelectorAll('.js-long-press');
const closeAll = () => {
  const array = Array.from(lps);
  array.forEach(lp => {
    lp.classList.remove('open');
  })
}

const dates = document.querySelector('.datewrapper')
if (dates) {
  const target = dates.querySelector('.current');
  target.scrollIntoView({
    inline: 'center',
  });
}
