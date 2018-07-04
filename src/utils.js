const fs = require('fs');
const path = require('path');

const promisify = f => (...args) =>
    new Promise((resolve, reject) =>
        f.apply(this, [
            ...args,
            (err, result) => err ? reject(err) : resolve(result)
        ])
    );

// noinspection JSValidateTypes
const getDirs = src =>
    fs
        .readdirSync(src)
        .filter(file => fs.statSync(path.join(src, file)).isDirectory());

const readFile = promisify(fs.readFile);

module.exports = {
    promisify,
    getDirs,
    readFile
};
