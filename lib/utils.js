generateRandomString = () => {
    return (Math.random() * new Date().getTime()).toString(32).replace( /\./g , '');
}

const Tools = {
    generateRandomString,
}

module.exports = Tools;
