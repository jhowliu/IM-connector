const express = require('express');
const bodyParser = require('body-parser');
const line = require('messaging-api-line');

const meta = require('./config/line-meta');
const Parser = require('./lib/parse');
const dialogControl = require('./lib/dialogue');
const utils = require('./lib/utils'); 

const client = line.LineClient.connect(meta.accessToken, meta.secret);

const app = express();

const redis = require('./lib/redis');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));

const port = process.env.PORT || 8080;

client.pushText(meta.userid, 'PUSH TEXT').then(() => {
    console.log('PUSH TEXT');
}).catch((err) => {
    console.log(err);
});

app.post('/webhook', (req, res) => {
    // Parse events to users (Promise Object)
    users = Parser.parse(req.body.events);

    const promises = users.map(user => {
        return dialogControl.dialog(user);
    });

    Promise.all(promises).then(replies => {
        replies.map(reply => {
            client.replyText(reply.token, reply.text);
        });
    });

    return res.send({ success: true, msg: 'please wait response' });
});

app.listen(port, () => {
    console.log('Server start on PORT: '+ port);
});
