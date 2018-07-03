const path = require('path');

module.exports = basePath => ({
    files: [
        {
            path: path.resolve(basePath, 'files'),
            options: {
                contains: true
            }
        }
    ]
});
