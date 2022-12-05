const axios = require('axios')

const send = async () => {

  const recipientID = 'NBAlouvre'
  const text = 'It works! :)'
  
  // URL Link for twitter endpoint
  const urlLink = 'https://api.twitter.com/1.1/direct_messages/events/new.json';
  
  // Generating timestamp
  const ts = Math.floor(new Date().getTime() / 1000);
  const timestamp = ts.toString();
  
  // Authorization Parameters
  const TOKEN = "AAAAAAAAAAAAAAAAAAAAAJAHaAEAAAAAyIIgy559D8Hh0eRHqBhA7VZxFxg%3DvXlBQd6F3ZOqsAhCRVL5oUm954tVNPVmTJVhHFUqPZde8QmLIq"
  
  const dataString = `{"event": {"type": "message_create", "message_create": {"target": { "recipient_id": "${recipientID}"},"message_data": {"text": "${text}"}}}}`;
  
  const options = {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-type": 'application/json'
    },
    body: dataString
  }
  
  axios.post(urlLink, options).then(res => {
    console.log(`statusCode: ${res.status}`)
  })
  .catch(error => {
    console.error(error)
  })
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  send();

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <body>Yolo.
  </body >
  </html > `;

  return res.send(html);
};






