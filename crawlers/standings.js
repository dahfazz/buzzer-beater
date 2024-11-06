const fs = require('fs');

const axios = require('axios');
const cheerio = require('cheerio');

const getStandings = async () => {
  const result = await axios.get('https://www.basketball-reference.com/');
  const $ = cheerio.load(result.data);

  const STANDINGS = [];

  ['E', 'W'].map(conf => {
    $('#confs_standings_' + conf).each((_, table) => {

      $(table).find('tr.full_table').each((_, tr) => {
        let obj = {};

        $(tr).find('th.left').each((_, th) => {
          const team = $(th)
            .find('a')
            .text()
            .replace('NYK', 'NY')
            .replace('GSW', 'GS')
            .replace('CHO', 'CHA')
            .replace('BRK', 'BK')
            .replace('SAS', 'SA')
            .replace('NOP', 'NO');

          const rank = parseInt($(th)
            .find('.seed')
            .text()
            .replace('(', "")
            .replace(')', "")
            .trim());

          const wins = parseInt($(tr).find('td:nth-child(4)').text())
          const loses = parseInt($(tr).find('td:nth-child(5)').text())
          const pct = Math.floor(100 * wins / (wins + loses))

          if (team) {
            STANDINGS[team] = {
              pct, rank, conf
            }
          }
        })
      })
    });
  })


  return STANDINGS
}

module.exports = { getStandings };