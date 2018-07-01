const { getDirs, readFile } = require('../utils');
const path = require('path');
const postcss = require('postcss');
const plugin = require('../');

const lineFeedRegex = new RegExp('\r\n', 'g');

const casesPath = path.resolve(__dirname, 'cases');
for (const testCase of getDirs(casesPath)) {
    // noinspection JSUnresolvedFunction
    it(`should work with the "${testCase}" test case`, async () => {
        const basePath = path.resolve(casesPath, testCase);
        const input = await readFile(
            path.resolve(basePath, 'input.css'),
            { encoding: 'utf-8' }
        );
        const output = (await readFile(
            path.resolve(basePath, 'output.css'),
            { encoding: 'utf-8' }
        )).replace(lineFeedRegex, '\n');

        const opts = {
            markupFiles: [path.resolve(basePath, 'markup')]
        };

        return postcss([ plugin(opts) ]).process(input, { from: undefined })
            .then(result => {
                // noinspection JSUnresolvedFunction
                expect(result.css).toEqual(output);
                // noinspection JSUnresolvedFunction
                expect(result.warnings().length).toBe(0);
            });

    });
}
