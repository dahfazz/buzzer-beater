const STANDINGS = require('./STANDINGS.json');

module.exports = (data) => {
  let score = 100;

  const delta = data.delta;
  const teamA = data.teamA;
  const teamB = data.teamB;
  const standA = STANDINGS.filter(st => st.team === data.teamA)[0].rank;
  const standB = STANDINGS.filter(st => st.team === data.teamB)[0].rank;
  const OT = data.ot;

  score -= delta;
  score -= standA;
  score -= standB;

  return score;
}