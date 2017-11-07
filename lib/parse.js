const redis = require('./redis');
const utils = require('./utils');

function parse(events) {
    return events.map(_parse);
}

function _parse(obj) {
    let msg = buildMsgObj();

    msg.userId = obj.source.userId;
    msg.replyToken = obj.replyToken;
    msg.type = obj.message.type;
   
    if (msg.type == 'text') {
        msg.data.text = obj.message.text;
    } else if (obj.message.type == 'sticker') {
        msg.data.stickerId = obj.message.stickerId;
    }

    return new Promise( (resolve, reject) => {
        redis.get(msg.userId, (err, value) => {
            if (err) { reject(err) };

            if (value == undefined) {
                msg.sid = utils.generateRandomString();
                // Five-mins session
                redis.set(msg.userId, msg.sid, 'EX', 300);
            } else {
                msg.sid = value;
            }

            resolve(msg);
        });
    });
}

function buildMsgObj() {
    return {
        appId: 'renda',
        userId: undefined,
        type: undefined,
        data: {},
        sid: undefined,
        replyToken: undefined,
    }
}

const Parser = {
    parse,
};

module.exports = Parser;

