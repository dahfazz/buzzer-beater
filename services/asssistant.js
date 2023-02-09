const getDateGames = require('../crawlers/scores')

module.exports = async (_, res) => {
  res.setHeader('Content-Type', 'application/json');

  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  const games = await (await getDateGames(yesterday)).sort((a, b) => a.delta > b.delta ? 1 : -1)

  return res.send(games);
}
