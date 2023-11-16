const MATCHUPS = require('../MATCHUPS.json');
const SCHEDULE = require('../SCHEDULE.json');
const STATS = require('../STATS.json');
const TEAMS = require('../teams.json');
const TEAMS_KEYS = require('../TEAMS_KEYS.json');

const { cleanChars } = require('../utils')

const PLAYER = 'dahfazz'
const DB = require('../public/DB.json')
const PICKS = DB[PLAYER].picks;

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const DATE = req.query.date;

  const getPlayerLastPick = (player) => {
    const picks = PICKS.filter(pick => cleanChars(pick.player).toLowerCase() === cleanChars(player).toLowerCase())

    if (picks.length) {
      return picks.reverse()[0];
    }

    return null;
  }

  const IsAvailable = (player, date = new Date()) => {
    const lastPickDate = getPlayerLastPick(player)


    if (!lastPickDate) return true;

    const nextAvailability = new Date(lastPickDate).setDate(new Date(lastPickDate).getDate() + 31);

    return (nextAvailability < new Date(date).getTime())
  }


  const getBestAvailablePlayers = (date = new Date(), NB_MAX = 20) => {
    const scheduleTeams = SCHEDULE.filter(game => game.date === date)
      .reduce((games, game) => {
        games.push(game.away)
        games.push(game.home)
        return games;
      }, []);

    const oppo = SCHEDULE.filter(game => game.date === date)
      .reduce((oppo, game) => {
        oppo[game.away] = game.home, 10;
        oppo[game.home] = game.away, 10;
        return oppo;
      }, {});

    let schedulePlayers = STATS.filter(player => scheduleTeams.indexOf(player.team_id) > -1)

    let improvedSchedulePlayers = schedulePlayers.sort((b, a) => a.TTFL > b.TTFL ? 1 : -1).map(line => {
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
        average: parseInt(line.TTFL, 10),
        oppo: TEAMS[oppo[line.team_id]].key,
        matchup: posMatch,
      }

      return P
    })

    const sortedImprovedSchedulePlayers = improvedSchedulePlayers
      .filter(line => IsAvailable(line.player, DATE))
      .sort((b, a) => a.average > b.average ? 1 : -1)
    return sortedImprovedSchedulePlayers.slice(0, NB_MAX);
  }

  const results = getBestAvailablePlayers(DATE)

  return res.send(results);
};
