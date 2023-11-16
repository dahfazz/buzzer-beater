const STANDINGS = require('./STANDINGS.json');

module.exports = (data) => {
  console.log(data.teamA)
  let score = 100;

  const delta = data.delta || 0;
  const standA = STANDINGS.filter(st => st.team === data.teamA)[0].rank;
  const standB = STANDINGS.filter(st => st.team === data.teamB)[0].rank;

  score -= delta;
  score -= standA;
  score -= standB;

  return score;
}