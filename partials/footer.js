module.exports = (current) => 
`<footer><div class="container">
  <a class="${current !== '/standings' ? 'active' : ''}" href="/">Scores</a>
  <button id="navcontrol" class="navopener">
    <span class="material-icons">menu</span>
  </button>
  <div></div>
  <a class="${current === '/standings' ? 'active' : ''}" href="/standings">Standings</a>
  </div>
  </footer>`;
  