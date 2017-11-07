const path = require('path');
const requireDir = require('require-dir');

const net = require('./networks');
const manifest = requireDir('../manifest');
const Redis = require('./redis');

// dialog control-flow
module.exports.dialog = function(meta) {
    let options = net.buildOpt('GET', manifest.services.apis.dialog.uri);
    let payload = net.buildDiagObj();

    return new Promise( (resolve, reject) => {
        meta.then( msg => {
            console.log('== Incoming message == \n'+ JSON.stringify(msg, null, '  '));
            payload.appid = msg.appId;
            payload.session = msg.sid;
            // only support for text now
            payload.q = (msg.type == 'text') ?  msg.data.text : '';

            options.qs = payload;
            // Dialog API needs appid/session/q(text)
            net.invokeApi(options).then( (reply) => {
                console.log('== Reply == \n' + JSON.stringify(reply, null, '  '));
                reply.token = msg.replyToken;
                // REMOVE the session because conversation is finished.
                if (reply.state == 'completed') {
                    console.log('== DELELTE the finished session ==');
                    Redis.delSession(msg.uid); 
                }
                resolve(reply);
            });
        });
    });


}
