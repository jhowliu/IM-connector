const express = require('express');
const bodyParser = require('body-parser');
const line = require('messaging-api-line');
const facebook = require('messaging-api-messenger');

const cors = require('cors')

const tokens = require('./config/tokens');

const Dialog = require('./lib/dialogue');
const Parser = require('./lib/message/parser');

const lineClient = line.LineClient.connect(tokens.line.accessToken, tokens.line.secret);
const facebookClient = facebook.MessengerClient.connect(tokens.facebook.accessToken);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));

app.use(cors());

const port = process.env.PORT || 8080;

app.post('/line', (req, res) => {
    // Parse events to users (Promise Object)
    users = Parser.lineParse(req.body.events);

    const promises = users.map(user => {
        return Dialog.flow(user);
    });

    // Get result for all Promise objects
    Promise.all(promises).then(replies => {
        replies.map(reply => {
            // Line reply token is one-time, cannot use second times
            if (reply.type == 'template') {
                lineClient.replyCarouselTemplate(reply.token, 'Train Schedule', reply.data.template);
            } else {
                lineClient.replyText(reply.token, reply.data.text);
            }
        });
    });

    return res.sendStatus(200);
});

app.post('/facebook', (req, res) => {
    users = Parser.facebookParse(req.body.entry[0].messaging);

    const promises = users.map(user => {
        return Dialog.flow(user);
    });

    // Get result for all Promise objects
    Promise.all(promises).then(replies => {
        replies.map(reply => {
            facebookClient.sendText(reply.token, reply.data.text);
            if (reply.type == 'template') {
                facebookClient.sendGenericTemplate(reply.token, reply.data.template);
            }
        });
    });

    return res.sendStatus(200);
});

app.post('/webapp', (req, res) => {
    users = Parser.webParse([req.body]);

    users.map(user => {
        user.then(obj => {
            console.log(JSON.stringify(obj, null, 4));
        });
    });
    res.sendStatus(200);
});

// webhook verify
app.get('/facebook', (req, res) => {
    if (req.query['hub.verify_token'] === fbMeta.accessToken) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');    
    }
});

app.listen(port, () => {
    console.log('Server start on PORT: '+ port);
});
