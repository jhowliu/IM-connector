const express = require('express');
const bodyParser = require('body-parser');
const line = require('messaging-api-line');
const facebook = require('messaging-api-messenger');

const tokens = require('./config/tokens');

const Dialog = require('./lib/dialogue');
const Parser = require('./lib/message/parser');

const lineClient = line.LineClient.connect(tokens.line.accessToken, tokens.line.secret);
const facebookClient = facebook.MessengerClient.connect(tokens.facebook.accessToken);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));

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
            if (reply.type == 'text') { 
                lineClient.replyText(reply.token, reply.data.text);
            } else if (reply.type == 'template') {
                lineClient.replyCarouselTemplate(reply.token, 'Train Schedule', reply.data.template);
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
            console.log(JSON.stringify(reply, null, '  '));
            if (reply.type == 'text') { 
                facebookClient.sendText(reply.token, reply.data.text);
            } else if (reply.type == 'template') {
                facebookClient.sendGenericTemplate(reply.token, reply.data.template);
            }
        });
    });

    return res.sendStatus(200);
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
