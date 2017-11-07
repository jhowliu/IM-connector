const config = require('../config/redis');
const redis = require('redis');

const client = redis.createClient();

getSession = (uid) => {
    return new Promise( resolve => {
        client.get(uid, (err, value) => {
            if (err) { console.log('== Redis Error == \n'+ err); }
            else { resolve(value); }
        });
    });
}

setSession = (uid, sid) => {
    return new Promise( resolve => {
        client.set(uid, sid, 'EX', 300);
        resolve(true);
    });
}

delSession = (uid) => {
    return new Promise( resolve => {
        client.del(uid);
        resolve(true);
    });
}

const Redis = {
    getSession,
    setSession,
    delSession,
}

module.exports = Redis;
