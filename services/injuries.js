const { getInjuries } = require('../crawlers/ttfl');

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  const injuries = await getInjuries()

  return res.send(injuries);
}