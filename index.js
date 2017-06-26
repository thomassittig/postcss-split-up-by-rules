var postcss = require( 'postcss' );
/**
 * Split a single rule definition into two
 *
 */
const extractDeclarations = ( rule, names ) => {
    let extractedDecls = [];
    names.forEach( ( declName ) => {
        rule.walkDecls( declName, ( decl ) => {
            extractedDecls.push( decl );
            decl.remove();
        } );
    } );

    return extractedDecls;

};
const handleForContext = ( selector, opts, postcssOpts ) => {
    let regexSelector = new RegExp( `(${selector}\\s{1})`, 'g' ),
        skipNext = false;

    if (postcssOpts.originRule.selector.indexOf( selector ) === 0) {
        let themedRule = postcssOpts.originRule.clone(),
            dcls;
        themedRule.removeAll();

        dcls = extractDeclarations( postcssOpts.originRule, opts.extract );

        postcssOpts.originRule.selector = postcssOpts
            .originRule
            .selector
            .replace( regexSelector, '' );

        dcls.map( ( dcl ) => {
            themedRule.append( dcl );
        } );

        postcssOpts.root.insertAfter( postcssOpts.originRule, themedRule );
        skipNext = true;
    }

    return skipNext;
};

module.exports = postcss.plugin( 'postcss-split-up-by-rules', ( opts ) => {
    opts = Object.assign( {}, { listenFor: [], extract: [] }, opts || {} );
    // Work with options here

    return ( root ) => {
        // Transform CSS AST here
        opts.listenFor.forEach( ( selector ) => {
            let skipNext = false;
            root.walkRules( ( originRule ) => {
                if (skipNext) {
                    skipNext = false;
                } else {
                    skipNext = handleForContext( selector, opts, {
                        originRule,
                        root
                    } );
                }
            } );
        } );
    };
} );
