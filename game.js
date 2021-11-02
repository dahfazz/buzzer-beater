const TEAMS = require('./teams');

module.exports = (data) => {
  let winner = 'A';

  if (parseInt(data.scoreB) > parseInt(data.scoreA)) {
    winner = 'B';
  }

  const top = data.delta < 10;

  MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const date = new Date(data.date);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()

  return `<li class="item ${top ? 'top' : ''}">
  <div class="gamedate">
    <span class="day">${day}</span>
    <span class='month'>${month}</span>
    <span class='year'>${year}</span>
  </div>
  <div class="team away">
    <div class="logo" style="background-image: url('logos/${TEAMS[data.teamA].key.toLowerCase()}.gif')" class="logo"></div>
  </div>
  <div class="score">
    <span class="${winner === 'A' ? 'winner' : ''}">${data.scoreA}</span> - 
    <span class="${winner === 'B' ? 'winner' : ''}">${data.scoreB}</span>
  </div>
  <div class="team home">
    <div class="logo" style="background-image: url('logos/${TEAMS[data.teamB].key.toLowerCase()}.gif')" class="logo"></div>
  </div>
</li>` 
}