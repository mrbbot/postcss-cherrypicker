const cheerio = require('cheerio');

module.exports = content => ({
    data: {
        $: cheerio.load(content)
    },
    check: (data, selector) => data.$(selector).length > 0
});
