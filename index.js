const { readFile } = require('./utils');
const { map } = require('asyncro');
const cheerio = require('cheerio');
const postcss = require('postcss');
const globby = require('globby');

// noinspection JSCheckFunctionSignatures
module.exports = postcss.plugin('postcss-cherrypicker', opts => {
    opts = opts || {};
    let markupGlobs = opts.markupFiles || [];
    markupGlobs = Array.isArray(opts.markupFiles) ? markupGlobs : [markupGlobs];

    return async root => {
        const markupFiles = (await map(
            await globby(markupGlobs),
            async markupFile => {
                const markup = await readFile(markupFile);
                const ext = markupFile.substring(
                    markupFile.lastIndexOf('.') + 1
                );
                switch (ext) {
                case 'html':
                    return {
                        data: {
                            $: cheerio.load(markup)
                        },
                        check: (data, selector) => data.$(selector).length > 0
                    };
                case 'vue':
                    const $ = cheerio.load(markup);
                    const $template = $('template');

                    if ($template.get().length === 0)
                        return false;

                    return {
                        data: {
                            $: cheerio.load($template.html())
                        },
                        check: (data, selector) => data.$(selector).length > 0
                    };
                default:
                    return false;
                }
            }
        )).filter(markupFile => !!markupFile);

        root.walkRules(rule => {
            const selectors = rule.selectors.filter(selector => {
                const colonIndex = selector.indexOf(':');
                if (colonIndex !== -1)
                    selector = selector.substring(0, colonIndex);

                try {
                    return markupFiles.some(file =>
                        file.check(file.data, selector));
                } catch (e) {
                    console.log(
                        '\x1b[33m%s\x1b[0m',
                        `Cherrypicker: ${e} (selector was not removed)`
                    );
                    return true;
                }
            });

            if (selectors.length === 0)
                rule.remove();
            else
                rule.selectors = selectors;
        });

        root.walkAtRules(atRule => {
            if (atRule.nodes.length === 0)
                atRule.remove();
        });
    };
});
