const MATCHUPS = require('../MATCHUPS.json');
const RATINGS = require('../RATINGS.json');
const SCHEDULE = require('../SCHEDULE.json');
const STATS = require('../STATS.json');
const TEAMS = require('../teams.json');
const TEAMS_KEYS = require('../TEAMS_KEYS.json');

const { getInjuries } = require('../crawlers/ttfl');

const DB = require('../public/DB.json')
const PLAYER = 'dahfazz'
const PICKS = DB[PLAYER].picks;



module.exports = async (_, res) => {


  // DATES
  const date = 'Wed, Nov 15, 2023';
  const y = new Date(new Date(date).setDate(new Date(date).getDate() - 1))
  const yesterday = Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium'
  }).format(y);

  // INJURY REPORT
  const injuries = await getInjuries();

  const scheduleTeams = SCHEDULE.filter(game => game.date === date)
    .reduce((games, game) => {
      games.push(game.away)
      games.push(game.home)
      return games;
    }, []);

  let i = 1;
  const spots = Object.keys(RATINGS).map(team => ({
    team, rating: RATINGS[team]
  })).sort((a, b) => a.rating > b.rating ? 1 : -1).map(spt => ({
    ...spt,
    pos: i++
  }));

  const oppo = SCHEDULE.filter(game => game.date === date)
    .reduce((oppo, game) => {
      oppo[game.away] = game.home, 10;
      oppo[game.home] = game.away, 10;
      return oppo;
    }, {});

  let schedulePlayers = STATS.filter(player => scheduleTeams.indexOf(player.team_id) > -1)

  let improvedSchedulePlayers = schedulePlayers.sort((b, a) => a.TTFL > b.TTFL ? 1 : -1).slice(0, 60).map(line => {
    try {
      MATCHUPS[TEAMS_KEYS[oppo[line.team_id]]][line.pos]
    } catch (err) {
      console.log(oppo[line.team_id], line.team_id, err,)
    }
    const matchup = MATCHUPS[TEAMS_KEYS[oppo[line.team_id]]][line.pos]

    let posMatch = '';
    if (matchup.easy) posMatch = 'EASY'
    if (matchup.hard) posMatch = 'HARD'

    const P = {
      player: line.player,
      team: line.team_id,
      // picked: isPicked(line.player),
      average: parseInt(line.TTFL, 10),
      oppo: TEAMS[oppo[line.team_id]].key,
      spot: spots.filter(spt => spt.team === oppo[line.team_id])[0].pos,
      matchup: posMatch,
      status: injuries[line.player.toLowerCase()] ? injuries[line.player.toLowerCase()].status : '-',
      // backToBack: SCHEDULE.filter(game => game.date === yesterday && (game.home === line.team_id || game.away === line.team_id)).length > 0 ? 'Y' : '',
      // 'teammates out': displayComments(getComment(line, injuries))
    }

    return P
  })

  let sortedImprovedSchedulePlayers = improvedSchedulePlayers.sort((b, a) => a.average > b.average ? 1 : -1)


  res.setHeader('Content-Type', 'text/html');

  let html = `
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
  <meta charset="UTF-8">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="assistant.css" rel="stylesheet">
</head>

<body class="bg-dark-subtle">
  <div class="container-xxl">
    <div class="row vh-100">
      <div class="col-12">
        <table class="table table-sm table-hover table-striped">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name</th>
              <th class="text-center">Average</th>
              <th class="text-center">Opposition</th>
              <th class="text-center">Def Spot?</th>
              <th class="text-center">Matchup?</th>
              <th class="text-center">Injury report</th>
            </tr>
          </thead>
          <tbody>`

  sortedImprovedSchedulePlayers.map((line, index) => {
    let tdTag = '<td class="align-middle">';
    if (line.status.toLowerCase() === 'day-to-day') {
      tdTag = '<td class="align-middle bg-warning" style="--bs-bg-opacity: .3;">'
    }
    if (line.status.toLowerCase() === 'out') {
      tdTag = '<td class="align-middle bg-danger" style="--bs-bg-opacity: .3;">'
    }
    html += `<tr>
              ${tdTag}<div class="text-center">${index + 1}</div></td>
              ${tdTag}
              <div class="d-flex">
              <div class="animated-logo me-3" style="background-image: url('logos/${line.team}.gif')"></div>
              ${line.player}
              </div>
              </td>
              ${tdTag}<div class="text-center">${line.average}</div></td>
              ${tdTag}<div class="text-center"><div class="mt-2 animated-logo" style="background-image: url('logos/${line.oppo}.gif')"></div></div></td>
              ${tdTag}<div class="text-center">${line.spot}${line.spot === 1 ? 'st' : line.spot === 2 ? 'nd' : line.spot === 3 ? 'rd' : 'th'}</div></td>
              ${tdTag}<div class="text-center">${line.matchup}</div></td>
              ${tdTag}<div class="text-center">${line.status}</div></td>
            </td>`
  })

  html += `</tbody>
        </table>
      </div>
    </div>
  </div>

</body>

</html>`;

  return res.send(html);
}

const cleanChars = (str) => {
  return str.replace('č', 'c').replace('ć', 'c')
}

const isPicked = (player) => {
  return Object.values(picks).map(name => cleanChars(name)).indexOf(cleanChars(player)) > -1
}