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
          obj.team = $(th)
            .find('a')
            .text()
            .replace('NYK', 'NY')
            .replace('GSW', 'GS')
            .replace('CHO', 'CHA')
            .replace('BRK', 'BK')
            .replace('SAS', 'SA')
            .replace('NOP', 'NO');

          obj.rank = parseInt($(th)
            .find('.seed')
            .text()
            .replace('(', "")
            .replace(')', "")
            .trim());
          obj.conference = conf;
        })

        $(tr).find('td:nth-child(4)').each((_, td) => {
          obj.wins = parseInt($(td).text())
        })
        $(tr).find('td:nth-child(5)').each((_, td) => {
          obj.losses = parseInt($(td).text())
        })

        if (obj.team) {
          STANDINGS.push(obj);
        }
      });
    });
  })

  fs.writeFileSync('STANDINGS.json', JSON.stringify(STANDINGS, null, 2))
}

module.exports = getStandings;