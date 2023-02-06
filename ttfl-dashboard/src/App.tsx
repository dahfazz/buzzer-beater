import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { setConstantValue } from 'typescript';
import { scheduler } from 'timers/promises';

const App = () => {
  const [schedule, setSchedule] = useState();

  useEffect(() => {
    const init = async () => {
      const req = await fetch('https://buzzer-beater.onrender.com/services/schedule')
      const json = await req.json()
      setSchedule(json);
    }

    init()
  }, [])
  return (
    <div className="App">
      {JSON.stringify(schedule)}
    </div>
  );
}

export default App;
