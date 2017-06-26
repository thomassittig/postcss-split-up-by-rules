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
const handleForContext = ( selector, options, postcssOptions ) => {
    let regexSelector = new RegExp( `(${selector}\\s{1})`, 'g' ),
        themedRule = null, declarations
    ;

    if (postcssOptions.originRule.selector.indexOf( selector ) === 0) {
        themedRule = postcssOptions.originRule.clone();
        themedRule.removeAll();

        declarations = extractDeclarations(
            postcssOptions.originRule,
            options.extract
        );

        postcssOptions.originRule.selector = postcssOptions
            .originRule
            .selector
            .replace( regexSelector, '' );

        declarations.map( ( declaration ) => {
            themedRule.append( declaration );
        } );
    }

    return themedRule;
};

module.exports = postcss.plugin( 'postcss-split-up-by-rules', ( options ) => {
    options = Object.assign(
        {},
        { listenFor: [], extract: [] },
        options || {}
    );

    const themedRules = [];

    return ( root ) => {
        options.listenFor.forEach( ( selector ) => {
            root.walkRules( ( originRule ) => {
                let themedRule = handleForContext( selector, options, {
                    originRule,
                    root
                } );

                if (themedRule) {
                    themedRules.push( themedRule );
                }
            } );
        } );

        themedRules.forEach( themedRule => {
            root.append( themedRule );
        } );
    };
} );
