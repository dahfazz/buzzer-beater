import axios, { AxiosResponse } from 'axios';
import { CheerioAPI, load } from 'cheerio';

interface GameTeam {
  score: number,
  team: string,
}
export interface Game {
  away: GameTeam,
  home: GameTeam,
  delta?: number,
}

export const getEvaluations = async (day: number, month: number, year: number): Promise<Game[]> => {
  console.log(day, month, year)
  const URL = `https://www.covers.com/sports/nba/matchups?selectedDate=${year}-${month}-${day}`
  console.log(URL)
  const DATA: Game[] = []

  const resp: AxiosResponse = await axios.get(URL);
  const $: CheerioAPI = load(resp.data);

  $('.gamebox.pregamebox').each((_, gameBox) => {
    const home: GameTeam = {
      team: $(gameBox).find('.gamebox-header').text().split('@')[1].trim(),
      score: parseInt($(gameBox).find('.gamebox-team-anchor strong').text())
    }
    const away: GameTeam = {
      team: $(gameBox).find('gamebox-header').text().split('@')[0].trim(),
      score: parseInt($(gameBox).find('.gamebox-team-anchor strong').text())
    }

    DATA.push({
      home,
      away,
      delta: Math.abs(home.score - away.score)
    })

  })

  return DATA;
}
