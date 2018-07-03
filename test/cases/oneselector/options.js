const path = require('path');

module.exports = basePath => ({
    files: [path.resolve(basePath, 'files')]
});
