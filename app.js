const express = require('express');
const bodyParser = require('body-parser');
const line = require('messaging-api-line');

const meta = require('./config/line-meta');

const app = express();

const client = line.LineClient.connect(meta.accessToken, meta.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));

const port = process.env.PORT || 8080;

client.pushText(meta.userid, 'PUSH TEXT')
  .then(() => {
    console.log('PUSH TEXT');
  })
  .catch((err) => {
    console.log(err);
});

app.get('/webhook', (req, res) => {
  console.log(req.body); 
});

app.listen(port, () => {
  console.log('Server start on PORT: '+ port);
});
