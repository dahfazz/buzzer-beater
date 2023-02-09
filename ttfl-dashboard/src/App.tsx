import React, { useEffect, useState } from 'react';
import './App.css';
import { getAllPicks, isPicked, pickPlayer } from './storage';

const App = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState({
    score: true,
    injuries: true,
    schedule: true,
  });
  const [schedule, setSchedule] = useState<any>();
  const [scores, setScores] = useState<any>();
  const [picks, setPicks] = useState<any>();
  const [injuries, setInjuries] = useState<any>();

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

  const pick = (player: string) => {
    pickPlayer(player, date);
    const temp: { [key: string]: number } = {};
    temp[player] = new Date(date.setHours(0, 0, 0, 0)).getTime()
    setPicks({ ...picks, ...temp })
  }

  const getReleaseDate = (pickDate: number): number => {
    let pickD = new Date(pickDate);
    pickD = new Date(new Date(pickD.setDate(pickD.getDate() + 30)).setHours(0, 0, 0, 0));
    return pickD.getTime();
  }

  const daysUntilReleased = (pickTimestamp: number) => Math.round((getReleaseDate(pickTimestamp) - date.getTime()) / (1000 * 3600 * 24))

  return (
    <>
      <div className="bg-dark mb-4">
        <div className="container d-flex py-3 justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <input onChange={changeDate} defaultValue={`${formatDate()}`} type="date" className="align-self-center form-control" />
            <ul className='w-100 text-white'>
              <li className="d-flex">score: {loading.score && 'loading'}</li>
              <li className="d-flex">schedule: {loading.schedule && 'loading'}</li>
              <li className="d-flex">injuries: {loading.injuries && 'loading'}</li>
            </ul>
          </div>
          <div className="ms-auto d-flex gap-2">
            {
              schedule && Object.keys(schedule.oppositions)
                .map(key =>
                  <div key={Math.random()} className="fs-6 text-white border border-white py-2 px-3 border d-flex flex-column justify-content-center align-items-center"><span>{key}</span><span>{schedule.oppositions[key]}</span></div>

                )
            }
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col col-lg-4">
            <h3>Available</h3>
            <ul className="list-group">
              {
                scores && schedule && injuries && scores
                  .filter((a: any) => !!a.player)
                  .filter((a: any) => schedule.engaged.includes(a.team_id))
                  .filter((line: any) => !getInjuryStatus(line.player))
                  .sort((a: any, b: any) => a.TTFL < b.TTFL ? 1 : -1)
                  .map((line: any) =>
                    <li key={Math.random()} id={`player-${line.player.replaceAll(' ', '-')}`} className="available list-group-item align-items-center d-flex justify-content-between">
                      <div className="d-flex">
                        <span className="badge bg-primary d-flex me-2 align-items-center">{parseInt(line.TTFL, 10)}</span>
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
            <h3>Blocked</h3>
            <div className="list-group">
              {
                picks && Object.keys(picks).sort((a: string, b: string) => picks[b] - picks[a]).map((player: string) =>
                  <div key={Math.random()} className="list-group-item d-flex">{player} {daysUntilReleased(parseInt(picks[player]))}</div>
                )
              }
            </div>
          </div>
          <div className="col col-lg-4">
            <h3>Injury list</h3>
            <div className="list-group">
              {
                scores && schedule && injuries && scores
                  .filter((a: any) => !!a.player)
                  .filter((a: any) => schedule.engaged.includes(a.team_id))
                  .filter((line: any) => getInjuryStatus(line.player))
                  .sort((a: any, b: any) => getInjuryStatus(a.player).statusCode - getInjuryStatus(b.player).statusCode || b.TTFL - a.TTFL).map((line: any) =>
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
