const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.basketball-reference.com/boxscores/?month=11&day=17&year=2024`);

  const games = await page.$$('.game_summary');
  games.forEach(async game => {
    // const lines = await game.$$('tr');
    // const awayLine = lines[0]
    // const homeLine = lines[1]

    // const away = {
    //   team: awayLine.$$('td')[0].innerText,
    //   score: awayLine.$$('td')[1].innerText
    // }

    // console.log(away)
  })

  // Use Promise.all to wait for two actions (navigation and click)
  // await Promise.all([
  //   page.waitForNavigation(), // wait for navigation to happen
  //   page.click('a'), // click link to cause navigation
  // ]);

  // // another example, this time using the evaluate function to return innerText of body
  // const moreContent = await page.evaluate(() => document.body.innerText);
  // console.log(moreContent)

  // close brower when we are done
  await browser.close();
})();