const { readFile } = require('./utils');
const { reduce, map } = require('asyncro');
const postcss = require('postcss');
const globby = require('globby');
const checkers = require('./checkers');

// noinspection JSCheckFunctionSignatures
module.exports = postcss.plugin('postcss-cherrypicker', opts => {
    opts = opts || {};
    let globs = opts.files || [];
    globs = Array.isArray(opts.files) ? globs : [globs];

    globs = globs.map(glob => {
        if (glob.constructor.name === 'String') {
            return {
                path: glob,
                options: {}
            };
        } else {
            // noinspection JSUndefinedPropertyAssignment
            glob.options = glob.options || {};
            return glob;
        }
    });

    return async root => {
        const files = (await reduce(globs, async (list = [], glob) => {
            const matches = await globby(glob.path);
            return list.concat(await map(matches, async match => {
                const content = await readFile(match, { encoding: 'utf-8' });
                const ext = match.substring(
                    match.lastIndexOf('.') + 1
                );

                if (ext in checkers)
                    return checkers[ext](content, glob.options);
                else
                    return false;
            }));
        })).filter(file => file);

        root.walkRules(rule => {
            const selectors = rule.selectors.filter(selector => {
                const colonIndex = selector.indexOf(':');
                if (colonIndex !== -1)
                    selector = selector.substring(0, colonIndex);

                try {
                    return files.some(file =>
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
