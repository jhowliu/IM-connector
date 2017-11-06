const redis = require('./redis');
const utils = require('./utils');

function parse(events) {
    return events.map(_parse);
}

function _parse(obj) {
    let reply = buildReplyObj();

    reply.userId = obj.source.userId;
    reply.replyToken = obj.replyToken;
   

    if (obj.message.type == 'text') {
        reply.type = obj.message.type;
        reply.text = obj.message.text;
    } else if (obj.message.type == 'sticker') {
        reply.type = obj.message.type;
        reply.stickerId = obj.message.stickerId;
    }

    return new Promise( (resolve, reject) => {
        redis.get(reply.userId, (err, value) => {
            if (err) { reject(err) };

            if (value == undefined) {
                reply.sid = utils.generateRandomString();
                // Five-mins session
                redis.set(reply.userId, reply.sid, 'EX', 300);
            } else {
                reply.sid = value;
            }

            resolve(reply);
        });
    });
}

function buildReplyObj() {
    return {
        appId: 'renda',
        userId: undefined,
        type: undefined,
        text: undefined,
        stickerId: undefined,
        sid: undefined,
        replyToken: undefined,
    }
}

const Parser = {
    parse,
};

module.exports = Parser;

