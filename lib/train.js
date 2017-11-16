const requireDir = require('require-dir');

const manifest = requireDir('../manifest');
const Net = require('./networks');

getSchedule = (info) => {
    let options = Net.buildOpt('POST', manifest.services.apis.train.uri);

    options.body = {
        startStation: info.DepartureLocation,
        endStation: info.ArrivalLocation,
        departureTime: info.DepartureTime.toString(),
    }
    return Net.invokeApi(options)
}

const Train = {
    getSchedule
}

module.exports = Train;


