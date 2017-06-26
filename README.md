# postcss-split-up-by-rules [![Build Status][ci-img]][ci]

[PostCSS] plugin Split up and filter a ruleset.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/thomassittig/postcss-split-up-by-rules.svg
[ci]:      https://travis-ci.org/thomassittig/postcss-split-up-by-rules


```CSS
.themed .selector .for .any .element {
    margin: 0;
    color: #ffffff;
}
```

```CSS
.for .any .element {
    margin: 0;
}

.themed .selector .for .any .element {
    color: #ffffff;
}
```

## Usage

```js
    module.exports = {
      plugins: {
        'postcss-split-up-by-rules': { 
            listenFor: ['.themed .selector'], 
            extract: ['color', 'background-color'] 
         },
      },
    };
```

See [PostCSS] docs for examples for your environment.