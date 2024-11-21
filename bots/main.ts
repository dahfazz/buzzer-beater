import puppeteer from 'puppeteer'

const HEADLESS = true;

interface GameTeam {
  score: number,
  team: string,
  rating: string,
}
interface Game {
  away: GameTeam,
  home: GameTeam,
  delta: number,
  rating: number,
  ties: number,
  leads: number,
  evaluation?: number,
}

const calculateRating = (rating1: string, rating2: string): number => {
  const path1 = rating1.split('-').map(s => parseInt(s.trim()))
  const path2 = rating2.split('-').map(s => parseInt(s.trim()))

  const pct1 = Math.floor((path1[0] / (path1[0] + path1[1])) * 100)
  const pct2 = Math.floor((path2[0] / (path2[0] + path2[1])) * 100)
  const pct = pct1 + pct2;

  return pct
}

const evaluateGame = (game: Game): number => {
  return Math.floor(40 * game.leads + (1 / game.delta * 30) + (50 * game.rating))
}

const tryClick = async (page, selector: string): Promise<void> => {
  if ((await page.$(selector)) !== null) {
    await page.click(selector);
  }
}

export const getEvaluations = async (day: number, month: number, year: number): Promise<Game[]> => {
  return []
  // const DOMAIN = 'https://www.basketball-reference.com/'
  // const URL = `boxscores/?month=${month}&day=${day}&year=${year}`

  // const DATA: Game[] = []
  // const browser = await puppeteer.launch({ headless: HEADLESS, executablePath: '/opt/render/project/src/node_modules/.bin' })
  // const page = await browser.newPage();
  // await page.goto(DOMAIN + URL, { waitUntil: 'domcontentloaded' });

  // await tryClick(page, '.osano-cm-denyAll');

  // const urls = await page.$$eval('.game_summary a', links => links.filter(link => link.href.includes('pbp')).map(link => link.href))

  // for (let index = 0; index < urls.length; index++) {
  //   await page.goto(urls[index], { waitUntil: 'domcontentloaded' });

  //   const awayTeam = await page.$eval('.scorebox div:nth-child(1) strong a', node => node.innerText)
  //   const awayScore = parseInt(await page.$eval('.scorebox div:nth-child(1) .scores div.score', node => node.innerText))
  //   const awayRating = await page.$eval('.scorebox div:nth-child(1) div:nth-child(3)', node => node.innerText)

  //   const homeTeam = await page.$eval('.scorebox div:nth-child(2) strong a', node => node.innerText)
  //   const homeScore = parseInt(await page.$eval('.scorebox div:nth-child(2) .scores div.score', node => node.innerText))
  //   const homeRating = await page.$eval('.scorebox div:nth-child(2) div:nth-child(3)', node => node.innerText)

  //   const rating = calculateRating(awayRating, homeRating);
  //   const delta = Math.abs(awayScore - homeScore);
  //   const ties = parseInt(await page.$eval('#div_game-summary .stats_table#st_0 tbody tr:nth-child(2) td.right', node => node.innerText))
  //   const leads = parseInt(await page.$eval('#div_game-summary .stats_table#st_0 tbody tr:nth-child(3) td.right', node => node.innerText))

  //   await tryClick(page, '#modal-close');

  //   await page.click('.filter a');

  //   await tryClick(page, '#modal-close');

  //   // page.waitForSelector('#content div:nth-child(26)')
  //   // const inactives = await page.$$eval('#content div:nth-child(26) div:nth-child(1) a', links => links.map(link => link.textContent))

  //   const game: Game = {
  //     away: {
  //       score: awayScore,
  //       team: awayTeam,
  //       rating: awayRating,
  //     },
  //     home: {
  //       score: homeScore,
  //       team: homeTeam,
  //       rating: homeRating,
  //     },
  //     delta,
  //     rating,
  //     ties,
  //     leads,
  //     // inactives,
  //   }
  //   game.evaluation = evaluateGame(game);
  //   DATA.push(game)

  //   await tryClick(page, '#modal-close');

  // }

  // await browser.close();

  // return DATA;
}

getEvaluations(20, 11, 2024)
