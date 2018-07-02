const cheerio = require('cheerio');

module.exports = content => {
    const $ = cheerio.load(content);
    const $template = $('template');

    if ($template.get().length === 0)
        return false;

    return {
        data: {
            $: cheerio.load($template.html())
        },
        check: (data, selector) => data.$(selector).length > 0
    };
};
