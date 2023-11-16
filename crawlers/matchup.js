const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.fantasypros.com/nba/defense-vs-position.php';


// GET GAMES FOR THIS MONTH
const getMatchups = async () => {


  const result = await axios.get(URL);
  const $ = cheerio.load(result.data);

  // const hrefToTeamKey = (href) => {
  //   return href ? href.replace('/teams/', '').replace('/2024.html', '') : null
  // }

  const values = {};

  ['PG', 'SG', 'SF', 'PF', 'C'].forEach(pos => {
    $('#data-table tr.GC-15.' + pos).each((_, tr) => {
      const team = $(tr).find('td.left').first().text();
      if (!values[team]) { values[team] = {}; console.log(team) }
      values[team][pos] = {
        value: parseInt($(tr).find('td:nth-child(2)').first().text()),
        hard: $(tr).find('td:nth-child(2)').first().hasClass('hard'),
        easy: $(tr).find('td:nth-child(2)').first().hasClass('easy')
      },
        fs.writeFileSync('MATCHUPS.json', JSON.stringify(values, null, 2));
    })
  })


}



module.exports = { getMatchups };