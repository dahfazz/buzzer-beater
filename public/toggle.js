const btn = document.querySelector('#toggle');
if (btn) {
  btn.addEventListener('click', _ => {
    document.body.classList.toggle('scores')
  })

}
