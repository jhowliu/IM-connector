const path = require('path');
const requireDir = require('require-dir');

const net = require('./networks');
const manifest = requireDir('../manifest');
const Redis = require('./redis');

// dialog control-flow
flow = (user) => {
    let option = net.buildOpt('GET', manifest.services.apis.dialog.uri);
    let payload = net.buildDiagObj();

    return new Promise( (resolve, reject) => {
        user.then( msg => {
            console.log('== Incoming message == \n'+ JSON.stringify(msg, null, '  '));
            payload.appid = msg.appId;
            payload.session = msg.sid;
            // only support for text now
            payload.q = (msg.type == 'text') ?  msg.data.text : '';

            option.qs = payload;
            // Dialog API needs appid/session/q(text)
            _wrapReply(option).then( reply => {
                console.log('== Reply == \n' + JSON.stringify(reply, null, '  '));
                reply.token = msg.replyToken;
                // REMOVE the session if conversation is finished.
                if (reply.state == 'completed') {
                    console.log('== DELELTE the finished session ==');
                    Redis.delSession(msg.uid); 
                }
                resolve(reply);
            });
        });
    });
}

_wrapReply = (requestOption) => {
    return new Promise( resolve => {
        net.invokeApi(requestOption).then( body => {
            let reply = _buildReplyObj();
            reply.state = body['dialogue_state'];
            if ('dialogueReply' in body) {
                reply.data.text = body['dialogueReply'];
            }
            resolve(reply);
        });
    });
}

_buildReplyObj = () => {
    return {
        type: 'text',
        state:'start',
        data: { 
            text: 'I dont understand, plz say again.',
            stickerId: undefined,
            url: undefined,
        }
    }
}


const Dialog = {
    flow,
}

module.exports = Dialog;
