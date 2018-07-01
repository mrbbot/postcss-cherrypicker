# PostCSS Cherrypicker [![Build Status][ci-img]][ci]

[PostCSS] plugin that removes unused CSS styles.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/mrbbot/postcss-cherrypicker.svg
[ci]:      https://travis-ci.org/mrbbot/postcss-cherrypicker

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-cherrypicker') ])
```

See [PostCSS] docs for examples for your environment.
