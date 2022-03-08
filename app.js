const express = require('express');
const PORT = process.env.PORT || 3000;

const getStandings = require('./crawlers/standings');
const getScores = require('./crawlers/scores');

// ROUTES
const home = require('./routes/home');
const tweet = require('./routes/tweet');
const team = require('./routes/team');
const standings = require('./routes/standings');
const top = require('./routes/top');

const app = express();

// ROUTER
app.get('/top', top);
app.get('/team', team);
app.get('/', tweet);
app.get('/', home);
app.get('/standings', standings);

app.get('/crawl', (req, res) => {
  getStandings();
  getScores().then(() => {
    res.end('Done')
  });
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
