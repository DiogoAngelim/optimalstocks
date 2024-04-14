require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
*
*	COMPUTE: covariance
*
*
*	DESCRIPTION:
*		- Computes the covariance between one or more numeric arrays.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );


// COVARIANCE //

/**
* FUNCTION: covariance( arr1[, arr2,...,opts] )
*	Computes the covariance between one or more numeric arrays.
*
* @param {...Array} arr - numeric array
* @param {Object} [opts] - function options
* @param {Boolean} [opts.bias] - boolean indicating whether to calculate a biased or unbiased estimate of the covariance (default: false)
* @returns {Array} covariance matrix
*/
function covariance() {
	var bias = false,
		args,
		opts,
		nArgs,
		len,
		deltas,
		delta,
		means,
		C,
		cov,
		arr,
		N, r, A, B, sum, val,
		i, j, n;

	args = Array.prototype.slice.call( arguments );
	nArgs = args.length;

	if ( isObject( args[nArgs-1] ) ) {
		opts = args.pop();
		nArgs = nArgs - 1;
		if ( opts.hasOwnProperty( 'bias' ) ) {
			if ( typeof opts.bias !== 'boolean' ) {
				throw new TypeError( 'covariance()::invalid input argument. Bias option must be a boolean.' );
			}
			bias = opts.bias;
		}
	}
	if ( !nArgs ) {
		throw new Error( 'covariance()::insufficient input arguments. Must provide array arguments.' );
	}
	for ( i = 0; i < nArgs; i++ ) {
		if ( !Array.isArray( args[i] ) ) {
			throw new TypeError( 'covariance()::invalid input argument. Must provide array arguments.' );
		}
	}
	if ( Array.isArray( args[0][0] ) ) {
		// If the first argument is an array of arrays, calculate the covariance over the nested arrays, disregarding any other arguments...
		args = args[ 0 ];
	}
	nArgs = args.length;
	len = args[ 0 ].length;
	for ( i = 1; i < nArgs; i++ ) {
		if ( args[i].length !== len ) {
			throw new Error( 'covariance()::invalid input argument. All arrays must have equal length.' );
		}
	}
	// [0] Initialization...
	deltas = new Array( nArgs );
	means = new Array( nArgs );
	C = new Array( nArgs );
	cov = new Array( nArgs );
	for ( i = 0; i < nArgs; i++ ) {
		means[ i ] = args[ i ][ 0 ];
		arr = new Array( nArgs );
		for ( j = 0; j < nArgs; j++ ) {
			arr[ j ] = 0;
		}
		C[ i ] = arr;
		cov[ i ] = arr.slice(); // copy!
	}
	if ( len < 2 ) {
		return cov;
	}
	// [1] Compute the covariance...
	for ( n = 1; n < len; n++ ) {

		N = n + 1;
		r = n / N;

		// [a] Extract the values and compute the deltas...
		for ( i = 0; i < nArgs; i++ ) {
			deltas[ i ] = args[ i ][ n ] - means[ i ];
		}

		// [b] Update the covariance between one array and every other array...
		for ( i = 0; i < nArgs; i++ ) {
			arr = C[ i ];
			delta = deltas[ i ];
			for ( j = i; j < nArgs; j++ ) {
				A = arr[ j ];
				B = r * delta * deltas[ j ];
				sum = A + B;
				// Exploit the fact that the covariance matrix is symmetric...
				if ( i !== j ) {
					C[ j ][ i ] = sum;
				}
				arr[ j ] = sum;
			} // end FOR j
		} // end FOR i

		// [c] Update the means...
		for ( i = 0; i < nArgs; i++ ) {
			means[ i ] += deltas[ i ] / N;
		}
	} // end FOR n

	// [2] Normalize the co-moments...
	n = N - 1;
	if ( bias ) {
		n = N;
	}
	for ( i = 0; i < nArgs; i++ ) {
		arr = C[ i ];
		for ( j = i; j < nArgs; j++ ) {
			val = arr[ j ] / n;
			cov[ i ][ j ] = val;
			if ( i !== j ) {
				cov[ j ][ i ] = val;
			}
		}
	}
	return cov;
} // end FUNCTION covariance()


// EXPORTS //

module.exports = covariance;
},{"validate.io-object":3}],2:[function(require,module,exports){
'use strict';

/**
* FUNCTION: isArray( value )
*	Validates if a value is an array.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is an array
*/
function isArray( value ) {
	return Object.prototype.toString.call( value ) === '[object Array]';
} // end FUNCTION isArray()

// EXPORTS //

module.exports = Array.isArray || isArray;

},{}],3:[function(require,module,exports){
'use strict';

// MODULES //

var isArray = require( 'validate.io-array' );


// ISOBJECT //

/**
* FUNCTION: isObject( value )
*	Validates if a value is a object; e.g., {}.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is a object
*/
function isObject( value ) {
	return ( typeof value === 'object' && value !== null && !isArray( value ) );
} // end FUNCTION isObject()


// EXPORTS //

module.exports = isObject;

},{"validate.io-array":2}]},{},[1]);

},{"validate.io-array":2,"validate.io-object":"validate.io-object"}],2:[function(require,module,exports){
'use strict';

/**
* FUNCTION: isArray( value )
*	Validates if a value is an array.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is an array
*/
function isArray( value ) {
	return Object.prototype.toString.call( value ) === '[object Array]';
} // end FUNCTION isArray()

// EXPORTS //

module.exports = Array.isArray || isArray;

},{}],"validate.io-object":[function(require,module,exports){
'use strict';

// MODULES //

var isArray = require( 'validate.io-array' );


// ISOBJECT //

/**
* FUNCTION: isObject( value )
*	Validates if a value is a object; e.g., {}.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is a object
*/
function isObject( value ) {
	return ( typeof value === 'object' && value !== null && !isArray( value ) );
} // end FUNCTION isObject()


// EXPORTS //

module.exports = isObject;

},{"validate.io-array":2}]},{},[1]);
