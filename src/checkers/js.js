const parser = require('@babel/parser');
const cheerio = require('cheerio');

function findMarkup(node) {
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
                    result += findMarkup(child);
                });
            else
                result += findMarkup(value);
        });

    if (node.type === 'JSXElement') {
        result += `</${node.closingElement.name.name}>`;
    }

    return result;
}

module.exports = (content, options) => {
    const parseJs = !options.contains;
    return {
        data: {
            $: parseJs ? cheerio.load(
                findMarkup(
                    parser.parse(content, {
                        plugins: [
                            'jsx'
                        ]
                    })
                )
            ) : content
        },
        check: (data, selector) => {
            if (parseJs) {
                return data.$(selector).length > 0;
            } else {
                const splitSelector = selector.split(/[ >+~]/);
                let checkSelector = splitSelector[splitSelector.length - 1];
                if (
                    checkSelector.startsWith('.') ||
                    checkSelector.startsWith('#')
                ) {
                    checkSelector = checkSelector.substring(1);
                }
                return data.$.includes(checkSelector);
            }
        }
    };
};
