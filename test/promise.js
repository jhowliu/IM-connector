const promise = function test(v) {
    return new Promise((resolve, reject) => {
        resolve(v);
    });
};


promise(100000).then( v => {
    console.log(v);
});
