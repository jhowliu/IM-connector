const path = require('path');
const requireDir = require('require-dir');

const net = require('./networks');
const manifest = requireDir('../manifest');

// dialog control-flow
module.exports.dialog = function(meta) {
    let options = net.buildOpt('GET', manifest.services.apis.dialog.uri);
    let payload = net.buildDiagObj();

    return new Promise( (resolve) => {
        meta.then( user => {
            console.log("Incoming user: \n"+ JSON.stringify(user, null, '\t'));
            payload.appid = user.appId;
            payload.session = user.sid;
            payload.q = user.text;

            options.qs = payload;

            net.invokeApi(options).then( (body) => {
                body.token = user.replyToken;
                resolve(body);
            });
        });
    });


}
