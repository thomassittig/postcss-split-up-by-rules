var postcss = require('postcss');
/**
 * Split a single rule definition into two
 *
 */

let handleForContext = (selector, originRule, root) =>{
    let regexSelector = new RegExp(`(${selector}\\s{1})`, 'g'),
        skipNext = false;

    if (originRule.selector.indexOf(selector) === 0) {
        let themedRule = originRule.clone(), dcls = [];
        themedRule.removeAll();

        originRule.walkDecls('color', (decl) =>{
            dcls.push(decl);
            decl.remove();
        });

        originRule.walkDecls('background-color', (decl) =>{
            dcls.push(decl);
            decl.remove();
        });

        originRule.selector = originRule.selector.replace(regexSelector, '');

        dcls.map((dcl) =>{
            themedRule.append(dcl);
        });

        root.insertAfter(originRule, themedRule);
        skipNext = true;

        console.log('duplicated: ', themedRule.selector, ' => ', originRule.selector);
    }

    return skipNext;
};

module.exports = postcss.plugin('postcss-split-up-by-rules', function (opts) {
    opts = Object.assign({}, { listenFor: [], extract: [] }, opts || {});
    // Work with options here

    return function (root) {
        // Transform CSS AST here
        opts.listenFor.forEach((selector) =>{
            let skipNext = false;
            root.walkRules(function (originRule) {
                if (skipNext) {
                    skipNext = false;
                } else {
                    skipNext = handleForContext(selector, originRule, root);
                }
            });
        });
    };
});
