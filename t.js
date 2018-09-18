merge = require('webpack-merge');
console.log(merge({
    a: [1],
    b: 5,
    c: 20
}, {
    a: [2],
    b: 10,
    d: 421
}));
