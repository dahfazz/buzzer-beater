const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000

const HTML = '<h1>YOLO</h1>';

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (_, res) => {
    res.setHeader('Content-Type', 'text/html');
    return res.send(HTML)
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))