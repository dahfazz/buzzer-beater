const express = require('express');
const bodyParser = require('body-parser')

const fs = require('fs');
const cors = require('cors')

const PORT = process.env.PORT || 3000;
const jsonParser = bodyParser.json()

const getStandings = require('./crawlers/standings');
const getScores = require('./crawlers/scores');

// ROUTES
const tweet = require('./routes/tweet');
const team = require('./routes/team');
const helper = require('./routes/helper');
const assistant = require('./routes/assistant');
const scheduler = require('./routes/scheduler');
const standings = require('./routes/standings');
const top = require('./routes/top');
const ttfl = require('./routes/ttfl');
const ttflService = require('./services/ttfl');
const injuryService = require('./services/injuries');
const scheduleService = require('./services/schedule');

const app = express();
app.use(cors())
app.use(bodyParser.json())

// ROUTER
app.get('/top', top);
app.get('/helper', helper);
app.get('/team', team);
app.get('/', tweet);
app.get('/ttfl', ttfl);
app.get('/assistant', assistant);
app.get('/scheduler', scheduler);
app.get('/standings', standings);
app.get('/services/ttfl', ttflService);
app.get('/services/injuries', injuryService);
app.get('/services/schedule', scheduleService);

const dataPath = 'public/DB.json';
app.get('/picks', (req, res) => {
  if (!req.query.player) {
    res.send();
    return;
  }

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data)[req.query.player]);
  });
});
app.put('/picks/:player', jsonParser, (req, res) => {
  readFile((data) => {
    const player = req.params['player'];
    data[player].picks.push(req.body);
    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send(`${player} picks updated!`);
    });
  }, true);
});

app.delete('/picks/:player/:date', jsonParser, (req, res) => {
  readFile((data) => {
    const player = req.params['player'];
    const date = req.params['date'];
    console.log(date)
    const newPicks = data[player].picks.filter(p => p.date !== date);
    data[player].picks = newPicks;
    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send(`Pick removed for ${player}!`);
    });
  }, true);
});

app.get('/crawl', (_, res) => {
  getStandings();
  getScores().then(() => {
    res.end('Done')
  });
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`))



const readFile = (
  callback,
  returnJson = false,
  filePath = dataPath,
  encoding = 'utf8'
) => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err;
    }

    callback(returnJson ? JSON.parse(data) : data);
  });
};

const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  encoding = 'utf8'
) => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err;
    }

    callback();
  });
};
