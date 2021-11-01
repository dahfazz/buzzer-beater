const TEAMS = require('./teams');

module.exports = (data) => `<li class="item">
  <div class="team">
    <div class="logo" style="background-image: url('logos/${TEAMS[data.teamA].key.toLowerCase()}.gif')" class="logo"></div>
  </div>
  <div class="team">
    <div class="logo" style="background-image: url('logos/${TEAMS[data.teamB].key.toLowerCase()}.gif')" class="logo"></div>
  </div>
</li>` 