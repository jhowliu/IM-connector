const request = require('requestretry');
const requireDir = require('require-dir');

// Invoke request
invokeApi = (requestOpts) => {
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
buildOpt = (method, host, json=true) => {
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

const Net = {
    invokeApi,
    buildOpt,
}

module.exports = Net;



