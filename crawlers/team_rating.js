const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.basketball-reference.com/leagues/NBA_2024_ratings.html';

const RATINGS = {};

// GET GAMES FOR THIS MONTH
const getTeamRatings = async () => {


  const result = await axios.get(URL);
  const $ = cheerio.load(result.data);

  const hrefToTeamKey = (href) => {
    return href ? href.replace('/teams/', '').replace('/2024.html', '') : null
  }

  $('#div_ratings tr').each((_, tr) => {
    const team = hrefToTeamKey($(tr).find('td:nth-child(2) a').first().attr('href'))
    const defRating = parseInt($(tr).find('td:nth-child(10)').first().text(), 10)

    if (team) {
      RATINGS[team] = defRating
    }
    fs.writeFileSync('RATINGS.json', JSON.stringify(RATINGS, null, 2));
  });
}



module.exports = { getTeamRatings };