const request = require('requestretry');
const requireDir = require('require-dir');

// Invoke request
module.exports.invokeApi = (requestOpts) => {
    return new Promise( resolve => {
        request(requestOpts, (err, res, body) => {
            let reply = buildReplyObj();

            if (err) { console.log('== Occur error == \n' + err); }
            if (typeof(body)==typeof({})) {
                reply.state = body['dialogue_state'];
                if ('dialogueReply' in body) {
                    reply.data.text = body['dialogueReply'];
                }
            }
            resolve(reply);
        });
    });
}

// build options for requests
module.exports.buildOpt = (method, host, json=true) => {
    const options = {
        method: method,
        url: host,
        headers: undefined,
        body: undefined,
        json: json,
        maxAttempts: 5,
        retryStrategy: request.RetryStrategies.HTTPOrNetworkError
    };

    return options
}


// q, session, appid are required
module.exports.buildDiagObj = () => {
    return {
        q: undefined,
        session: undefined,
        appid: undefined,
    }
}

buildReplyObj = () => {
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

