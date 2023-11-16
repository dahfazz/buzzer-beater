const STATS = require('./STATS.json');
const RATINGS = require('./RATINGS.json');
const SCHEDULE = require('./SCHEDULE.json');
const TEAMS = require('./teams.json');
const TEAMS_KEYS = require('./TEAMS_KEYS.json');
const MATCHUPS = require('./MATCHUPS.json');

const { cleanChars } = require('./utils')
const { getTTFLscores, getInjuries, getPicks } = require('./crawlers/ttfl');
// getTTFLscores()

// const { getMatchups } = require('./crawlers/matchup');
// getMatchups()

const date = 'Wed, Nov 15, 2023';
const y = new Date(new Date(date).setDate(new Date(date).getDate() - 1))
const yesterday = Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium'
}).format(y);

const scheduleTeams = SCHEDULE.filter(game => game.date === date)
  .reduce((games, game) => {
    games.push(game.away)
    games.push(game.home)
    return games;
  }, []);

const spots = Object.keys(RATINGS).map(team => ({
  team, rating: RATINGS[team]
})).sort((b, a) => a.rating > b.rating ? 1 : -1)
  .slice(0, 10).map(rating => rating.team);

const oppo = SCHEDULE.filter(game => game.date === date)
  .reduce((oppo, game) => {
    oppo[game.away] = game.home, 10;
    oppo[game.home] = game.away, 10;
    return oppo;
  }, {});

let schedulePlayers = STATS.filter(player => scheduleTeams.indexOf(player.team_id) > -1)

const launch = async () => {
  const injuries = await getInjuries();
  // const picks = await getPicks();
  const picks = require('./PICKS.json')

  const isPicked = (player) => {
    return Object.values(picks).map(name => cleanChars(name)).indexOf(cleanChars(player)) > -1
  }

  schedulePlayers = schedulePlayers.sort((b, a) => a.TTFL > b.TTFL ? 1 : -1).slice(0, 60).map(line => {
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
      // picked: isPicked(line.player),
      average: parseInt(line.TTFL, 10),
      oppo: TEAMS[oppo[line.team_id]].name,
      spot: spots.indexOf(oppo[line.team_id]) > -1 ? 'LOW DEF RATING' : '',
      matchup: posMatch,
      status: injuries[line.player.toLowerCase()] ? injuries[line.player.toLowerCase()].status : '-',
      // backToBack: SCHEDULE.filter(game => game.date === yesterday && (game.home === line.team_id || game.away === line.team_id)).length > 0 ? 'Y' : '',
      // 'teammates out': displayComments(getComment(line, injuries))
    }

    return P
  })

  schedulePlayers = schedulePlayers.sort((b, a) => a.average > b.average ? 1 : -1)

  const availableForMe = schedulePlayers.filter(line => {
    return !isPicked(line.player)
  })
  // console.table(availableForMe);
  console.table(schedulePlayers);
}

const getComment = (line, injuries) => {
  const back2back = SCHEDULE.filter(game => game.date === yesterday && (game.home === line.team_id || game.away === line.team_id)).length > 0;
  const teamInjuries = {};

  const comments = {
    back2back: false,
    injuries: []
  };

  Object.keys(injuries).forEach(injured => {
    const t = STATS.filter(line => {
      return cleanChars(line.player.toLowerCase()) === cleanChars(injured.toLowerCase())
    })

    if (t && t.length) {
      const team = t[0].team_id
      if (!teamInjuries[team]) { teamInjuries[team] = [] };

      teamInjuries[team].push(injuries[injured]);
    }

  })

  const getTeamInjuries = (team) => {
    return teamInjuries[team];
  }

  if (back2back) comments.back2back = true;

  if (Object.keys(teamInjuries).indexOf(line.team_id) > -1) {
    comments.injuries.push(getTeamInjuries(line.team_id).filter(i => i.player !== line.player))
  }

  return comments;
}

const displayComments = (comments) => {
  let str = ``;

  if (comments.injuries.length) {
    comments.injuries.forEach(injuries => {
      injuries.forEach(inj => {
        return str += `${inj.player}(${inj.status}) `
      })
    })
  }

  return str;
}



launch()
