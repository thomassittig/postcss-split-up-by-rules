var postcss = require( 'postcss' );

var plugin = require( './' );

function run( input, output, opts ) {
    return postcss( [ plugin( opts ) ] ).process( input )
        .then( result => {
            expect( result.css ).toEqual( output );
            expect( result.warnings().length ).toBe( 0 );
        } );
}

it( 'does nothing', () => {
    return run( 'a{ }', 'a{ }', {} );
} );


it( 'does split the rules', () => {
    let options = {
            listenFor: [ '.themed .selector' ],
            extract: [ 'color', 'background-color' ]
        },
        given = '.themed .selector .for .any ' +
            '.element {margin: 0;color: #ffffff;}',
        expected = '.for .any .element {margin: 0;}' +
            '.themed .selector .for .any .element {color: #ffffff;}';

    return run( given, expected, options );
} );

it( 'does moves the extracted rules to the end of the rules', () => {
    let options = {
            listenFor: [ '.themed .selector' ],
            extract: [ 'color', 'background-color' ]
        },
        given = '.themed .selector .for .any ' +
            '.element {margin: 0;color: #ffffff;}' +
            '.separator-element {padding: 0;color: #ffffff;}',
        expected = '.for .any .element {margin: 0;}' +
            '.separator-element {padding: 0;color: #ffffff;}' +
            '.themed .selector .for .any .element {color: #ffffff;}';
    return run( given, expected, options );
} );
