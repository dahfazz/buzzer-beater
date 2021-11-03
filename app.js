const express = require('express');
const PORT = process.env.PORT || 3000;

// ROUTES
const home = require('./routes/home');
const team = require('./routes/team');
const standings = require('./routes/standings');
const top = require('./routes/top');

const app = express();

// ROUTER
app.get('/top', top);
app.get('/team', team);
app.get('/', home);
app.get('/standings', standings);

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
