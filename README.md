# PostCSS Cherrypicker [![Build Status][ci-img]][ci]

[PostCSS] plugin to reduce the size of CSS files by removing unused styles from them.

[PostCSS]: https://github.com/postcss/postcss
[Globby]:  https://github.com/sindresorhus/globby
[ci-img]:  https://travis-ci.org/mrbbot/postcss-cherrypicker.svg
[ci]:      https://travis-ci.org/mrbbot/postcss-cherrypicker

## Usage

Cherrypicker works by checking every CSS selector against your markup and removing any that don't match
anything.

Here is an example configuration:

```js
postcss([
    require('postcss-cherrypicker')(
        {
            files: [
                "src/index.html",           // single file
                "src/pages/**/*.html",      // glob with html files
                "src/more-pages",           // directory
                "src/jsx/*.js",             // glob with js files
                "src/vue/*.vue",            // glob with vue files
                {
                    path: "src/js/*.js",    // glob
                    contains: true          // in contains mode
                }
            ]
        }
    )
])
```

See [PostCSS] docs for examples on how to configure your environment.

You must provide an options object to the plugin containing a `files` array of all of the markup files you would like to
compare your CSS against. Internally, [Globby] is used so you can use files, directories, or globs. As shown above, you
can use a string or an object with a `path` field to represent a file set.

The file will be parsed differently depending on the extension.

|Extension|Parsing|
|-|-|
|html|The entire file is parsed|
|vue|The `template` section of the single file component is parsed|
|js|The file is scanned for JSX which is then converted to HTML and parsed|

If you're using an object to specify a file path, and you set the `contains` field to true, Cherrypicker won't parse
your file and will instead check if it contains the class name, id, or tag name. This can be helpful when adding classes
with `element.classList.add(...)` or with frameworks that use a virtual DOM and require calls to `createElement` or `h`.
