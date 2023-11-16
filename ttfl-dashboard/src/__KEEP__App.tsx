import React, { useEffect, useState } from 'react';
import './App.css';
import { colors } from './colors';
import { getAllPicks, isPicked, pickPlayer } from './storage';

interface StateLine {
  player: string;
  TTFL: number;
  team_id: string;
}

const App = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState({
    score: true,
    injuries: true,
    schedule: true,
  });
  const [schedule, setSchedule] = useState<any>();
  const [scores, setScores] = useState<StateLine[]>();
  const [picks, setPicks] = useState<any>();
  const [injuries, setInjuries] = useState<any>();
  const [players, setPlayers] = useState<string[]>();

  const loadSchedule = async () => {
    setLoading({ ...loading, schedule: true })
    const req = await fetch(`https://buzzer-beater.onrender.com/services/schedule?date=${formatDateForURL()}`)
    const json = await req.json()
    return json;
  }
  const loadInjuries = async () => {
    setLoading({ ...loading, injuries: true })
    const req = await await fetch('https://buzzer-beater.onrender.com/services/injuries')
    const json = await req.json()
    return json;
  }
  const loadScores = async () => {
    setLoading({ ...loading, score: true })
    const req = await fetch('https://buzzer-beater.onrender.com/services/ttfl')
    const json = await req.json()
    const p = json.map((line: StateLine) => line.player)
    const t = json.map((line: StateLine) => line.team_id).filter((a: string, b: string) => a !== b)
    setPlayers(p)
    return json;
  }

  useEffect(() => {
    const p = getAllPicks();
    setPicks(p);

    loadSchedule().then(json => {
      setSchedule(json)
      setLoading({ ...loading, schedule: false })
    })
    loadInjuries().then(json => {
      setInjuries(json)
      setLoading({ ...loading, injuries: false })
    })
    loadScores().then(json => {
      setScores(json)
      setLoading({ ...loading, score: false })
    })
  }, [date]);

  const formatDateForURL = () => {
    const y = date?.getFullYear()
    const m = date?.getMonth() + 1
    const d = date?.getDate()

    return `${m}-${d}-${y}`
  }

  const formatDate = () => {
    const y = date?.getFullYear()
    const m = date?.getMonth() > 8 ? date?.getMonth() + 1 : '0' + (date?.getMonth() + 1)
    const d = date?.getDate() > 9 ? date?.getDate().toString() : '0' + date?.getDate().toString()

    return `${y}-${m}-${d}`
  }

  const getInjuryStatus = (player: string) => {
    const key = player.toLowerCase();
    return injuries[key]
  }

  const changeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.valueAsDate || new Date())
  }

  const pick = (player: string, d?: Date) => {
    pickPlayer(player, d || date);
    const temp: { [key: string]: number } = {};
    temp[player] = new Date((d || date).setHours(0, 0, 0, 0)).getTime()
    setPicks({ ...picks, ...temp })
  }

  const getReleaseDate = (pickDate: number): number => {
    let pickD = new Date(pickDate);
    pickD = new Date(new Date(pickD.setDate(pickD.getDate() + 30)).setHours(0, 0, 0, 0));
    return pickD.getTime();
  }

  const [req, setReq] = useState<string>();
  const typePlayerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReq(e.target.value.toLowerCase())
  }

  const daysUntilReleased = (pickTimestamp: number) => Math.round((getReleaseDate(pickTimestamp) - date.getTime()) / (1000 * 3600 * 24))

  return (
    <>
      <div className="bg-light border-bottom">
        <div className="container d-flex py-1 justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <input onChange={changeDate} defaultValue={`${formatDate()}`} type="date" className="align-self-center form-control" />
            <ul className='w-100'>
              <li className="d-flex">score: {loading.score && 'loading'}</li>
              <li className="d-flex">schedule: {loading.schedule && 'loading'}</li>
              <li className="d-flex">injuries: {loading.injuries && 'loading'}</li>
            </ul>
          </div>
          <div className="ms-auto d-flex gap-2">
            {
              schedule && Object.keys(schedule.oppositions)
                .map(key =>
                  <div key={Math.random()} className="fs-6 border py-2 px-3 d-flex flex-column justify-content-center align-items-center"><span>{key}</span><span>{schedule.oppositions[key]}</span></div>

                )
            }
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col col-lg-4">
            <div className="d-flex align-items-center">
              <h3 className='h4 py-3'>Available</h3>
            </div>
            <ul className="list-group">
              {
                scores && schedule && injuries && scores
                  .filter((a) => !!a.player)
                  .filter((a) => schedule.engaged.includes(a.team_id))
                  .filter((line) => !getInjuryStatus(line.player))
                  .sort((a, b) => a.TTFL < b.TTFL ? 1 : -1)
                  .map((line) =>
                    <li key={Math.random()}
                      className="available list-group-item align-items-center d-flex justify-content-between"
                    >
                      <div className="d-flex">
                        <span className="badge bg-primary d-flex me-2 align-items-center">{Math.round(line.TTFL)}</span>
                        <span className="player me-2">{line.player}</span> <span className="fs-6 text-secondary">(vs {schedule.oppositions[line.team_id]})</span>
                      </div>
                      {
                        !isPicked(line.player) && <div className="d-flex justify-content-end">
                          <button onClick={() => pick(line.player)} className="btn btn-link text-primary">PICK!</button>
                        </div>
                      }
                    </li>)
              }
            </ul>
          </div>
          <div className="col col-lg-4">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <h3 className='h4 py-3'>Picked</h3>
                <button type="button" className="btn btn-link ms-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  Add +
                </button>

              </div>

              <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">Date</label>
                          <input type="date" className="form-control" id="date" />
                        </div>
                        <div>
                          <label htmlFor="player" className="form-label">Player</label>
                          <input onChange={typePlayerName} type="text" className="form-control" id="player" aria-describedby="player" />
                          <div className="list-group">
                            {
                              req && req.length > 2 && players && players
                                .filter(player => player && player.toLowerCase().indexOf(req) > -1)
                                .map(result => <button key={Math.random()} onClick={() => {
                                  document.querySelector<HTMLInputElement>('#player')!.value = result;
                                  setReq('')
                                }} className='list-group-item'>{result}</button>)
                            }
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button onClick={_ => {
                        const p = document.querySelector<HTMLInputElement>('#player')!.value;
                        const d = new Date(document.querySelector<HTMLInputElement>('#date')!.value);
                        pick(p, d)
                      }} type="button" className="btn btn-primary">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="list-group">
              {
                scores && picks && Object.keys(picks)
                  .sort((a: string, b: string) => picks[b] - picks[a])
                  .map((player: string) => {
                    return scores.map((score: StateLine) => {
                      if (score.player === player) {
                        return <div key={Math.random()} className={`${daysUntilReleased(parseInt(picks[player])) === 30 ? 'bg-primary text-white' : ''} list-group-item d-flex justify-content-between`}><span className={`${daysUntilReleased(parseInt(picks[player])) === 30 ? 'text-primary bg-white' : ''} badge bg-primary d-flex me-2 align-items-center`}>{Math.round(score.TTFL)}</span>{player} <span>{daysUntilReleased(parseInt(picks[player]))} days</span></div>
                      }
                    })
                  })
              }
            </div>
          </div>
          <div className="col col-lg-4 bg-light">
            <h3 className='h4 py-3'>Injury list</h3>
            <div className="list-group">
              {
                scores && schedule && injuries && scores
                  .filter((a) => !!a.player)
                  .filter((a) => schedule.engaged.includes(a.team_id))
                  .filter((line) => getInjuryStatus(line.player))
                  .sort((a, b) => getInjuryStatus(a.player).statusCode - getInjuryStatus(b.player).statusCode || b.TTFL - a.TTFL).map((line: any) =>
                    <div key={Math.random()} className={`list-group-item align-items-center d-flex ${getInjuryStatus(line.player).status === 'Out' ? 'text-danger' : ''}`}><span className={`badge ${getInjuryStatus(line.player).status === 'Out' ? 'text-danger border-danger' : 'text-dark'} border d-flex me-2 align-items-center`}>{parseInt(line.TTFL, 10)}</span> {line.player} {getInjuryStatus(line.player).status}
                      {
                        !isPicked(line.player) && <div className="d-flex justify-content-end">
                          <button onClick={() => pick(line.player)} className="btn btn-link text-primary">PICK!</button>
                        </div>
                      }
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
