const express = require('express')
const app = express();

app.get("/", (req, res) => {
  res.send('<h1>Hello!</h1>');
});

app.use(express.static('assets'))

app.listen(port, () => console.log(`listening on port ${port}!`))

