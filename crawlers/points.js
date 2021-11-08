const fs = require('fs');

const axios = require('axios');
const cheerio = require('cheerio');

const STATS = {}

const getBoxesHref = async () => {
  const MONTHS = ['october'];
  MONTHS.forEach(async (month) => {
    const result = await axios.get(`https://www.basketball-reference.com/leagues/NBA_2022_games-${month}.html`);
    const $ = cheerio.load(result.data);


    $('td.center a').each(async (x, element) => {
      const href = $(element).attr('href').replace('/boxscores/', '').replace('.html', '');
      const result2 = await axios.get(`https://www.basketball-reference.com/boxscores/${href}.html`);
      const $2 = cheerio.load(result2.data);

      $2('.section_wrapper .table_container table.sortable.stats_table').each((_, table) => {
        if ($(table).attr('id').includes('game-basic')) {
          $(table).find('tbody tr').each((_, line) => {
            const title = $2('h1').text()
            const player = $2(line).find('th.left a').text();
            const minutes = $2(line).find('td[data-stat="mp"]').text();
            const points = $2(line).find('td[data-stat="pts"]').text();
            if (minutes && points) {
              if (!STATS[player]) {
                STATS[player] = []
              }

              STATS[player].push({
                title, minutes, player, points
              })

              fs.writeFileSync('pts.json', JSON.stringify(STATS, null, 2));
            }
          })
        }
      })
    });
  })
}

getBoxesHref();