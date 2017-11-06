module.exports.generateRandomString = function () {
    return (Math.random() * new Date().getTime()).toString(32).replace( /\./g , '');
}
