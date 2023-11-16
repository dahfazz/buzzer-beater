import React, { useEffect, useState } from 'react';
import { getTTFLmonth } from './services/calendar';

import './App.css';


const App = () => {

  const date = new Date();

  const [days] = useState(getTTFLmonth(date.getMonth(), date.getFullYear()));

  return (
    <div className="d-flex week">
      {
        days.map((day, i) => <div key={i} className={`day border ${day?.player && 'bg-info'}`}>{day?.day}</div>)
      }
    </div>
  );
}

export default App;
