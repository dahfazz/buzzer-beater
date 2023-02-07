import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [schedule, setSchedule] = useState();

  useEffect(() => {
    const init = async () => {
      const req = await fetch('https://buzzer-beater.onrender.com/services/schedule')
      const json = await req.json()
      console.log(json)
      setSchedule(json);
    }

    init()
  }, [])
  return (
    <div className="App">
      <h1>Hello.</h1>
      {JSON.stringify(schedule)}
    </div>
  );
}

export default App;
