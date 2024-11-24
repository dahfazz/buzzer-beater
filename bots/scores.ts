import axios, { AxiosResponse } from 'axios';
import { CheerioAPI, load } from 'cheerio';

interface GameTeam {
  score: number,
  team: string,
}
export interface Game {
  away: GameTeam,
  home: GameTeam,
  ties?: number,
  leads?: number,
  evaluation?: number,
  deltas?: {
    qt1: number;
    qt2: number;
    qt3: number;
    qt4: number;
  },
  leaders?: {
    qt1: string;
    qt2: string;
    qt3: string;
    qt4: string;
  }
}

export const getEvaluations = async (day: number, month: number, year: number): Promise<Game[]> => {
  const URL = `https://www.covers.com/sports/nba/matchups?selectedDate=${year}-${month}-${day}`

  const DATA: Game[] = []

  const resp: AxiosResponse = await axios.get(URL);
  const $: CheerioAPI = load(resp.data);

  $('.covers-CoversScoreboard-gameBox').each((_, gameBox) => {
    const home: GameTeam = {
      team: $(gameBox).find('h2').text().split('@')[1].trim(),
      score: parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(2) .winner-highlight').text())
    }
    const away: GameTeam = {
      team: $(gameBox).find('h2').text().split('@')[0].trim(),
      score: parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(1) .winner-highlight').text())
    }

    const hScores = [
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(2) td:nth-child(1)').text()),
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(2) td:nth-child(2)').text()),
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(2) td:nth-child(3)').text()),
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(2) td:nth-child(4)').text()),
    ]
    const aScores = [
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(1) td:nth-child(1)').text()),
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(1) td:nth-child(2)').text()),
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(1) td:nth-child(3)').text()),
      parseInt($(gameBox).find('.covers-CoversScoreboard-gameBox-ScoringTable tbody tr:nth-child(1) td:nth-child(4)').text()),
    ]

    const scores = {
      away: {
        qt1: aScores[0],
        qt2: aScores[0] + aScores[1],
        qt3: aScores[0] + aScores[1] + aScores[2],
        qt4: away.score,
      },
      home: {
        qt1: hScores[0],
        qt2: hScores[0] + hScores[1],
        qt3: hScores[0] + hScores[1] + hScores[2],
        qt4: home.score,
      },
    }

    const deltas = {
      qt1: Math.abs(aScores[0] - hScores[0]),
      qt2: Math.abs((scores.away.qt2) - (scores.home.qt2)),
      qt3: Math.abs((scores.away.qt3) - (scores.home.qt3)),
      qt4: Math.abs(away.score - home.score)
    }

    const leaders = {
      qt1: scores.away.qt1 === scores.home.qt1 ? 'DRAW' : scores.away.qt1 > scores.home.qt1 ? away.team : home.team,
      qt2: scores.away.qt2 === scores.home.qt2 ? 'DRAW' : scores.away.qt2 > scores.home.qt2 ? away.team : home.team,
      qt3: scores.away.qt3 === scores.home.qt3 ? 'DRAW' : scores.away.qt3 > scores.home.qt3 ? away.team : home.team,
      qt4: away.score === home.score ? 'DRAW' : away.score > home.score ? away.team : home.team,
    }

    DATA.push({
      home,
      away,
      deltas,
      leaders,
    })

  })

  return DATA;
}
