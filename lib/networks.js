const request = require('requestretry');
const requireDir = require('require-dir');

// Invoke request
module.exports.invokeApi = (requestOpts) => {
    return new Promise( resolve => {
        request(requestOpts, (err, res, body) => {
            if (err) { console.log('== Occur error == \n' + err); }
            if (typeof(body)==typeof({})) {
                resolve(body);
            }
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

