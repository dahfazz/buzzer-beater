const TEAMS = require('../teams');

module.exports = () => {
  let _h = `<nav class="nav" id="nav">
  <div class="container">
    <a class="navitem" href="/">HOME <span class="material-icons">navigate_next</span></a>
    <a class="navitem" href="/top">TOP 20 <span class="material-icons">navigate_next</span></a>
    <div class="teamgridtitle">Pick one team</div>
    <div class="teamgrid">`;

    Object.keys(TEAMS).forEach(team => _h += `<a href="/team?key=${team}" style="background-image: url('logos/${TEAMS[team].key.toLowerCase()}.gif')"></a>`);


    _h += `  </div>
    </div>
    </nav>`

  return _h;
};
