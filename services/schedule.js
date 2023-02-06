const { getNightGames } = require('../crawlers/ttfl');

module.exports = async (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  const ref = req.query.date ? new Date(req.query.date) : new Date()
  year = ref.getFullYear()
  month = ref.getMonth() + 1
  month = month < 10 ? '0' + month : month
  day = ref.getDate()
  day = day < 10 ? '0' + day : day
  let _date = `${year}${month}${day}`

  const schedule = await getNightGames(_date)

  return res.send(schedule);
}