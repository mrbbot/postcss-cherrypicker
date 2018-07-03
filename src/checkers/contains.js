module.exports = (data, selector) => {
    const splitSelector = selector.split(/[ >+~]/);
    let checkSelector =
        splitSelector[splitSelector.length - 1];
    if (
        checkSelector.startsWith('.') ||
        checkSelector.startsWith('#')
    ) {
        checkSelector = checkSelector.substring(1);
    }
    return data.content.includes(checkSelector);
};
