const parser = require('@babel/parser');
const cheerio = require('cheerio');
const htmlBeautify = require('js-beautify').html;

/* function walkNodeDebug(node, level = 0) {
    Object.keys(node)
        .filter(key => key !== 'start' && key !== 'end' && key !== 'loc')
        .forEach(key => {
            const str =
                node[key] && node[key].constructor &&
                node[key].constructor.name === 'Node' ||
                Array.isArray(node[key]) ? '' : JSON.stringify(node[key]);
            console.log(`${' '.repeat(level * 2)}${key}: ${str}`);
            const value = node[key];
            if (!value) return;

            if (Array.isArray(value)) {
                value.forEach((child, i) => {
                    if (child && child.constructor &&
                    child.constructor.name === 'Node') {
                        console.log(`${' '.repeat((level + 1) * 2)}[${i}]`);
                        walkNodeDebug(child, level + 2);
                    }
                });
            } else if (value.constructor && value.constructor.name === 'Node') {
                walkNodeDebug(value, level + 1);
            }
        });
}*/

// eslint-disable-next-line no-unused-vars
function parseJsx(node) {
    let result = '';

    if (node.type === 'JSXElement') {
        result += `<${node.openingElement.name.name}${
            node.openingElement.attributes.length > 0 ? ' ' : ''
        }${
            node.openingElement.attributes
                .filter(attribute => attribute.value.value)
                .map(attribute => {
                    return `${
                        attribute.name.name.replace('className', 'class')
                    }=\"${attribute.value.value}\"`;
                })
                .join(' ')
        }>`;
    }

    Object.keys(node)
        .map(key => node[key])
        .filter(value =>
            value && value.constructor &&
            value.constructor.name === 'Node' ||
            Array.isArray(value))
        .forEach(value => {
            if (Array.isArray(value))
                value.forEach(child => {
                    result += parseJsx(child);
                });
            else
                result += parseJsx(value);
        });

    if (node.type === 'JSXElement') {
        result += `</${node.closingElement.name.name}>`;
    }

    return result;
}

module.exports = content => {
    const parsed = parser.parse(content, {
        plugins: [
            'jsx'
        ]
    });

    // walkNodeDebug(parsed);

    console.log(htmlBeautify(cheerio.load(parseJsx(parsed)).html()));

    return {
        data: {

        },
        // eslint-disable-next-line no-unused-vars
        check: (data, selector) => true
    };
};
