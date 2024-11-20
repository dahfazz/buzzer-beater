Feature('boxscores');

import { writeFileSync } from "fs";

const eachElement = codeceptjs.container.plugins('eachElement');

const calculateRating = (rating1: string, rating2: string): number => {
  const path1 = rating1.split('-').map(s => parseInt(s.trim()))
  const path2 = rating2.split('-').map(s => parseInt(s.trim()))

  const pct1 = Math.floor((path1[0] / (path1[0] + path1[1])) * 100)
  const pct2 = Math.floor((path2[0] / (path2[0] + path2[1])) * 100)
  const pct = pct1 + pct2;

  return pct
}

Scenario('Box scores',  async ({ I }) => {
  const DATA = []
  const URL = `https://www.basketball-reference.com/boxscores/?month=11&day=17&year=2024`
  I.amOnPage(URL);

  I.waitForElement('.section_heading h2')
  
  const nb = parseInt(await I.grabTextFrom('h2'))
  
  await tryTo(() => I.click('.osano-cm-denyAll'));
  for (let index = 1; index <= nb; index++) {
    I.click(`.game_summary:nth-child(${index}) p.links a:nth-child(2)`);
    I.waitForElement('.scorebox');

    const awayTeam = await I.grabTextFrom('.scorebox div:nth-child(1) strong a')
    const awayScore = await I.grabTextFrom('.scorebox div:nth-child(1) .scores .score')
    const awayRating = await I.grabTextFrom('.scorebox div:nth-child(1) div:nth-child(3)')
    
    
    const homeTeam = await I.grabTextFrom('.scorebox div:nth-child(2) strong a')
    const homeScore = await I.grabTextFrom('.scorebox div:nth-child(2) .scores .score')
    const homeRating = await I.grabTextFrom('.scorebox div:nth-child(2) div:nth-child(3)')

    const rating = calculateRating(awayRating, homeRating);
    const delta = Math.abs(parseInt(awayScore) - parseInt(homeScore));
    const ties = parseInt(await I.grabTextFrom('#div_game-summary .stats_table#st_0 tbody tr:nth-child(2) td.right'))
    const leads = parseInt(await I.grabTextFrom('#div_game-summary .stats_table#st_0 tbody tr:nth-child(3) td.right'))
    
    await tryTo(() => I.click('#modal-close'));
    I.click('.filter a');

    await tryTo(() => I.click('#modal-close'));
    I.waitForElement('#content div:nth-child(26)')
    const inactives = await I.grabHTMLFromAll('#content div:nth-child(26) div:nth-child(1) a')
    
    DATA.push({
      away: {
        score: awayScore,
        team: awayTeam,
        rating: awayRating,
      },
      home: {
        score: homeScore,
        team: homeTeam,
        rating: homeRating,
      },
      delta,
      rating,
      ties,
      leads,
      inactives,
    })


    I.amOnPage(URL);
    I.waitForElement('.section_heading h2')

    await tryTo(() => I.click('#modal-close'));
  }

  writeFileSync('/var/data/DATA.json', JSON.stringify(DATA, null, 2))
});
