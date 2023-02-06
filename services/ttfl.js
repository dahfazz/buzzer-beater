const { getTTFLscores } = require('../crawlers/ttfl');

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  const scores = await getTTFLscores()

  return res.send(scores);
}