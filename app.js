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
app.get('/assistant', assistant);
app.get('/scheduler', scheduler);
app.get('/standings', standings);

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
