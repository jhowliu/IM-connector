const request = require('requestretry');
const requireDir = require('require-dir');

// Invoke request
module.exports.invokeApi = (requestOpts) => {
    return new Promise((resolve) => {
        request(requestOpts, (err, res, body) => {
            let reply = {
                text: "I don't understand, plz say again.",
            }
            if (res.statusCode == 200 && 'dialogueReply' in body) {
                reply.text = body['dialogueReply'];
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
        form: undefined,
        json: json,
        maxAttempts: 5,
        retryStrategy: request.RetryStrategies.HTTPOrNetworkError
    };

    return options
}


// session, appid are required
module.exports.buildDiagObj = () => {
    return {
        q: undefined,
        session: undefined,
        appid: undefined,
    }
}

