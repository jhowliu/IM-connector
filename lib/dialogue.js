const path = require('path');
const requireDir = require('require-dir');

const manifest = requireDir('../manifest');

const Net = require('./networks');
const Train = require('./train');
const Redis = require('./redis');
const MsgWrapper = require('./message/wrapper');

// dialog control-flow
flow = (user) => {
    let option = Net.buildOpt('GET', manifest.services.apis.dialog.uri);
    let payload = _buildDiagObj();

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
        let reply = _buildReplyObj();
        Net.invokeApi(requestOption).then( body => {
            reply.state = body.dialogue_state;
            if ('dialogueReply' in body) {
                reply.data.text = body.dialogueReply;
            }
            if (reply.state == 'completed' && 'task' in body) {
                reply = _wrapTemplateReply(reply, body.task);
            }
            resolve(reply);
        }).catch( (err) => {
            if (err) { console.log(err); }
            resolve(reply);   
        });
    });
}
// body: Claude api response
_wrapTemplateReply = (reply, task) => {
    console.log(JSON.stringify(task, null, '  '));
    if (task.TaskName == 'HSRScheduleInfo') {
        reply.type = 'template';
        const trains = Train.getSchedule(task); 
        reply.data.template = MsgWrapper.wrapTemplateElements(reply.platform, trains);
    }

    return reply;
}

_buildReplyObj = () => {
    return {
        type: 'text',
        state: 'start',
        data: { 
            text: 'I dont understand, plz say again.',
            stickerId: undefined,
            url: undefined,
        }
    }
}

// q, session, appid are required
_buildDiagObj = () => {
    return {
        q: undefined,
        session: undefined,
        appid: undefined,
    }
}



const Dialog = {
    flow,
}

module.exports = Dialog;
