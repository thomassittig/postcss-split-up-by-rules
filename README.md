# PostCSS Plugin postcss-split-up-by-rules

## Example usage and result

Add the plugin and configuration to your postcss.config.js:

```JavaScript
    module.exports = {
      plugins: {
        'postcss-split-up-by-rules': { 
            listenFor: ['.themed .selector'], 
            extract: ['color', 'background-color'] 
         },
      },
    };
```

So now, if you have a css like

```CSS
.themed .selector .for .any .element {
    margin: 0;
    color: #ffffff;
}
```

You will get:


```CSS
.for .any .element {
    margin: 0;
}

.themed .selector .for .any .element {
    color: #ffffff;
}
```
