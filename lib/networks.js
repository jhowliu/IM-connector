const request = require('requestretry');

// Invoke request
invokeApi = (requestOpts) => {
    return new Promise( (resolve, reject) => {
        request(requestOpts, (err, res, body) => {
            if (err) { reject(err); }
            if (typeof(body)==typeof({})) {
                resolve(body);
            } else {
                reject(false);
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



