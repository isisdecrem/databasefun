/**!
Copyright © 2016-2019 - Convergence Labs, Inc.
@version 1.0.0-rc.4
@license Licensed under the terms of the GNU Lesser General Public License version 3 (GPLv3). See https://www.gnu.org/licenses/lgpl-3.0.html
*/
var Convergence =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = rxjs.operators;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Various utility functions.
 * @namespace
 */
var util = module.exports = __webpack_require__(2);

var roots = __webpack_require__(16);

var Type, // cyclic
    Enum;

util.codegen = __webpack_require__(41);
util.fetch   = __webpack_require__(42);
util.path    = __webpack_require__(43);

/**
 * Node's fs module if available.
 * @type {Object.<string,*>}
 */
util.fs = util.inquire("fs");

/**
 * Converts an object's values to an array.
 * @param {Object.<string,*>} object Object to convert
 * @returns {Array.<*>} Converted array
 */
util.toArray = function toArray(object) {
    if (object) {
        var keys  = Object.keys(object),
            array = new Array(keys.length),
            index = 0;
        while (index < keys.length)
            array[index] = object[keys[index++]];
        return array;
    }
    return [];
};

/**
 * Converts an array of keys immediately followed by their respective value to an object, omitting undefined values.
 * @param {Array.<*>} array Array to convert
 * @returns {Object.<string,*>} Converted object
 */
util.toObject = function toObject(array) {
    var object = {},
        index  = 0;
    while (index < array.length) {
        var key = array[index++],
            val = array[index++];
        if (val !== undefined)
            object[key] = val;
    }
    return object;
};

var safePropBackslashRe = /\\/g,
    safePropQuoteRe     = /"/g;

/**
 * Tests whether the specified name is a reserved word in JS.
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
util.isReserved = function isReserved(name) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
};

/**
 * Returns a safe property accessor for the specified property name.
 * @param {string} prop Property name
 * @returns {string} Safe accessor
 */
util.safeProp = function safeProp(prop) {
    if (!/^[$\w_]+$/.test(prop) || util.isReserved(prop))
        return "[\"" + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, "\\\"") + "\"]";
    return "." + prop;
};

/**
 * Converts the first character of a string to upper case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.ucFirst = function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
};

var camelCaseRe = /_([a-z])/g;

/**
 * Converts a string to camel case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.camelCase = function camelCase(str) {
    return str.substring(0, 1)
         + str.substring(1)
               .replace(camelCaseRe, function($0, $1) { return $1.toUpperCase(); });
};

/**
 * Compares reflected fields by id.
 * @param {Field} a First field
 * @param {Field} b Second field
 * @returns {number} Comparison value
 */
util.compareFieldsById = function compareFieldsById(a, b) {
    return a.id - b.id;
};

/**
 * Decorator helper for types (TypeScript).
 * @param {Constructor<T>} ctor Constructor function
 * @param {string} [typeName] Type name, defaults to the constructor's name
 * @returns {Type} Reflected type
 * @template T extends Message<T>
 * @property {Root} root Decorators root
 */
util.decorateType = function decorateType(ctor, typeName) {

    /* istanbul ignore if */
    if (ctor.$type) {
        if (typeName && ctor.$type.name !== typeName) {
            util.decorateRoot.remove(ctor.$type);
            ctor.$type.name = typeName;
            util.decorateRoot.add(ctor.$type);
        }
        return ctor.$type;
    }

    /* istanbul ignore next */
    if (!Type)
        Type = __webpack_require__(18);

    var type = new Type(typeName || ctor.name);
    util.decorateRoot.add(type);
    type.ctor = ctor; // sets up .encode, .decode etc.
    Object.defineProperty(ctor, "$type", { value: type, enumerable: false });
    Object.defineProperty(ctor.prototype, "$type", { value: type, enumerable: false });
    return type;
};

var decorateEnumIndex = 0;

/**
 * Decorator helper for enums (TypeScript).
 * @param {Object} object Enum object
 * @returns {Enum} Reflected enum
 */
util.decorateEnum = function decorateEnum(object) {

    /* istanbul ignore if */
    if (object.$type)
        return object.$type;

    /* istanbul ignore next */
    if (!Enum)
        Enum = __webpack_require__(3);

    var enm = new Enum("Enum" + decorateEnumIndex++, object);
    util.decorateRoot.add(enm);
    Object.defineProperty(object, "$type", { value: enm, enumerable: false });
    return enm;
};

/**
 * Decorator root (TypeScript).
 * @name util.decorateRoot
 * @type {Root}
 * @readonly
 */
Object.defineProperty(util, "decorateRoot", {
    get: function() {
        return roots["decorated"] || (roots["decorated"] = new (__webpack_require__(26))());
    }
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = __webpack_require__(13);

// converts to / from base64 encoded strings
util.base64 = __webpack_require__(32);

// base class of rpc.Service
util.EventEmitter = __webpack_require__(33);

// float handling accross browsers
util.float = __webpack_require__(34);

// requires modules optionally and hides the call from bundlers
util.inquire = __webpack_require__(14);

// converts to / from utf8 encoded strings
util.utf8 = __webpack_require__(35);

// provides a node-like buffer pool in the browser
util.pool = __webpack_require__(36);

// utility to work with the low and high bits of a 64 bit value
util.LongBits = __webpack_require__(37);

// global object reference
util.global = typeof window !== "undefined" && window
           || typeof global !== "undefined" && global
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 * @const
 */
util.isNode = Boolean(util.global.process && util.global.process.versions && util.global.process.versions.node);

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

        if (properties)
            merge(this, properties);
    }

    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

    CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
    };

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(31)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Enum;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(5);
((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";

var Namespace = __webpack_require__(7),
    util = __webpack_require__(1);

/**
 * Constructs a new enum instance.
 * @classdesc Reflected enum.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {Object.<string,number>} [values] Enum values as an object, by name
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] The comment for this enum
 * @param {Object.<string,string>} [comments] The value comments for this enum
 */
function Enum(name, values, options, comment, comments) {
    ReflectionObject.call(this, name, options);

    if (values && typeof values !== "object")
        throw TypeError("values must be an object");

    /**
     * Enum values by id.
     * @type {Object.<number,string>}
     */
    this.valuesById = {};

    /**
     * Enum values by name.
     * @type {Object.<string,number>}
     */
    this.values = Object.create(this.valuesById); // toJSON, marker

    /**
     * Enum comment text.
     * @type {string|null}
     */
    this.comment = comment;

    /**
     * Value comment texts, if any.
     * @type {Object.<string,string>}
     */
    this.comments = comments || {};

    /**
     * Reserved ranges, if any.
     * @type {Array.<number[]|string>}
     */
    this.reserved = undefined; // toJSON

    // Note that values inherit valuesById on their prototype which makes them a TypeScript-
    // compatible enum. This is used by pbts to write actual enum definitions that work for
    // static and reflection code alike instead of emitting generic object definitions.

    if (values)
        for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
            if (typeof values[keys[i]] === "number") // use forward entries only
                this.valuesById[ this.values[keys[i]] = values[keys[i]] ] = keys[i];
}

/**
 * Enum descriptor.
 * @interface IEnum
 * @property {Object.<string,number>} values Enum values
 * @property {Object.<string,*>} [options] Enum options
 */

/**
 * Constructs an enum from an enum descriptor.
 * @param {string} name Enum name
 * @param {IEnum} json Enum descriptor
 * @returns {Enum} Created enum
 * @throws {TypeError} If arguments are invalid
 */
Enum.fromJSON = function fromJSON(name, json) {
    var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
    enm.reserved = json.reserved;
    return enm;
};

/**
 * Converts this enum to an enum descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IEnum} Enum descriptor
 */
Enum.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options"  , this.options,
        "values"   , this.values,
        "reserved" , this.reserved && this.reserved.length ? this.reserved : undefined,
        "comment"  , keepComments ? this.comment : undefined,
        "comments" , keepComments ? this.comments : undefined
    ]);
};

/**
 * Adds a value to this enum.
 * @param {string} name Value name
 * @param {number} id Value id
 * @param {string} [comment] Comment, if any
 * @returns {Enum} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If there is already a value with this name or id
 */
Enum.prototype.add = function add(name, id, comment) {
    // utilized by the parser but not by .fromJSON

    if (!util.isString(name))
        throw TypeError("name must be a string");

    if (!util.isInteger(id))
        throw TypeError("id must be an integer");

    if (this.values[name] !== undefined)
        throw Error("duplicate name '" + name + "' in " + this);

    if (this.isReservedId(id))
        throw Error("id " + id + " is reserved in " + this);

    if (this.isReservedName(name))
        throw Error("name '" + name + "' is reserved in " + this);

    if (this.valuesById[id] !== undefined) {
        if (!(this.options && this.options.allow_alias))
            throw Error("duplicate id " + id + " in " + this);
        this.values[name] = id;
    } else
        this.valuesById[this.values[name] = id] = name;

    this.comments[name] = comment || null;
    return this;
};

/**
 * Removes a value from this enum
 * @param {string} name Value name
 * @returns {Enum} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If `name` is not a name of this enum
 */
Enum.prototype.remove = function remove(name) {

    if (!util.isString(name))
        throw TypeError("name must be a string");

    var val = this.values[name];
    if (val == null)
        throw Error("name '" + name + "' does not exist in " + this);

    delete this.valuesById[val];
    delete this.values[name];
    delete this.comments[name];

    return this;
};

/**
 * Tests if the specified id is reserved.
 * @param {number} id Id to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Enum.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
};

/**
 * Tests if the specified name is reserved.
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Enum.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = rxjs;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = ReflectionObject;

ReflectionObject.className = "ReflectionObject";

var util = __webpack_require__(1);

var Root; // cyclic

/**
 * Constructs a new reflection object instance.
 * @classdesc Base class of all reflection objects.
 * @constructor
 * @param {string} name Object name
 * @param {Object.<string,*>} [options] Declared options
 * @abstract
 */
function ReflectionObject(name, options) {

    if (!util.isString(name))
        throw TypeError("name must be a string");

    if (options && !util.isObject(options))
        throw TypeError("options must be an object");

    /**
     * Options.
     * @type {Object.<string,*>|undefined}
     */
    this.options = options; // toJSON

    /**
     * Unique name within its namespace.
     * @type {string}
     */
    this.name = name;

    /**
     * Parent namespace.
     * @type {Namespace|null}
     */
    this.parent = null;

    /**
     * Whether already resolved or not.
     * @type {boolean}
     */
    this.resolved = false;

    /**
     * Comment text, if any.
     * @type {string|null}
     */
    this.comment = null;

    /**
     * Defining file name.
     * @type {string|null}
     */
    this.filename = null;
}

Object.defineProperties(ReflectionObject.prototype, {

    /**
     * Reference to the root namespace.
     * @name ReflectionObject#root
     * @type {Root}
     * @readonly
     */
    root: {
        get: function() {
            var ptr = this;
            while (ptr.parent !== null)
                ptr = ptr.parent;
            return ptr;
        }
    },

    /**
     * Full name including leading dot.
     * @name ReflectionObject#fullName
     * @type {string}
     * @readonly
     */
    fullName: {
        get: function() {
            var path = [ this.name ],
                ptr = this.parent;
            while (ptr) {
                path.unshift(ptr.name);
                ptr = ptr.parent;
            }
            return path.join(".");
        }
    }
});

/**
 * Converts this reflection object to its descriptor representation.
 * @returns {Object.<string,*>} Descriptor
 * @abstract
 */
ReflectionObject.prototype.toJSON = /* istanbul ignore next */ function toJSON() {
    throw Error(); // not implemented, shouldn't happen
};

/**
 * Called when this object is added to a parent.
 * @param {ReflectionObject} parent Parent added to
 * @returns {undefined}
 */
ReflectionObject.prototype.onAdd = function onAdd(parent) {
    if (this.parent && this.parent !== parent)
        this.parent.remove(this);
    this.parent = parent;
    this.resolved = false;
    var root = parent.root;
    if (root instanceof Root)
        root._handleAdd(this);
};

/**
 * Called when this object is removed from a parent.
 * @param {ReflectionObject} parent Parent removed from
 * @returns {undefined}
 */
ReflectionObject.prototype.onRemove = function onRemove(parent) {
    var root = parent.root;
    if (root instanceof Root)
        root._handleRemove(this);
    this.parent = null;
    this.resolved = false;
};

/**
 * Resolves this objects type references.
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.resolve = function resolve() {
    if (this.resolved)
        return this;
    if (this.root instanceof Root)
        this.resolved = true; // only if part of a root
    return this;
};

/**
 * Gets an option value.
 * @param {string} name Option name
 * @returns {*} Option value or `undefined` if not set
 */
ReflectionObject.prototype.getOption = function getOption(name) {
    if (this.options)
        return this.options[name];
    return undefined;
};

/**
 * Sets an option.
 * @param {string} name Option name
 * @param {*} value Option value
 * @param {boolean} [ifNotSet] Sets the option only if it isn't currently set
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
    if (!ifNotSet || !this.options || this.options[name] === undefined)
        (this.options || (this.options = {}))[name] = value;
    return this;
};

/**
 * Sets multiple options.
 * @param {Object.<string,*>} options Options to set
 * @param {boolean} [ifNotSet] Sets an option only if it isn't currently set
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
    if (options)
        for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
            this.setOption(keys[i], options[keys[i]], ifNotSet);
    return this;
};

/**
 * Converts this instance to its string representation.
 * @returns {string} Class name[, space, full name]
 */
ReflectionObject.prototype.toString = function toString() {
    var className = this.constructor.className,
        fullName  = this.fullName;
    if (fullName.length)
        return className + " " + fullName;
    return className;
};

// Sets up cyclic dependencies (called in index-light)
ReflectionObject._configure = function(Root_) {
    Root = Root_;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Field;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(5);
((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";

var Enum  = __webpack_require__(3),
    types = __webpack_require__(8),
    util  = __webpack_require__(1);

var Type; // cyclic

var ruleRe = /^required|optional|repeated$/;

/**
 * Constructs a new message field instance. Note that {@link MapField|map fields} have their own class.
 * @name Field
 * @classdesc Reflected message field.
 * @extends FieldBase
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {number} id Unique id within its namespace
 * @param {string} type Value type
 * @param {string|Object.<string,*>} [rule="optional"] Field rule
 * @param {string|Object.<string,*>} [extend] Extended type if different from parent
 * @param {Object.<string,*>} [options] Declared options
 */

/**
 * Constructs a field from a field descriptor.
 * @param {string} name Field name
 * @param {IField} json Field descriptor
 * @returns {Field} Created field
 * @throws {TypeError} If arguments are invalid
 */
Field.fromJSON = function fromJSON(name, json) {
    return new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
};

/**
 * Not an actual constructor. Use {@link Field} instead.
 * @classdesc Base class of all reflected message fields. This is not an actual class but here for the sake of having consistent type definitions.
 * @exports FieldBase
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {number} id Unique id within its namespace
 * @param {string} type Value type
 * @param {string|Object.<string,*>} [rule="optional"] Field rule
 * @param {string|Object.<string,*>} [extend] Extended type if different from parent
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] Comment associated with this field
 */
function Field(name, id, type, rule, extend, options, comment) {

    if (util.isObject(rule)) {
        comment = extend;
        options = rule;
        rule = extend = undefined;
    } else if (util.isObject(extend)) {
        comment = options;
        options = extend;
        extend = undefined;
    }

    ReflectionObject.call(this, name, options);

    if (!util.isInteger(id) || id < 0)
        throw TypeError("id must be a non-negative integer");

    if (!util.isString(type))
        throw TypeError("type must be a string");

    if (rule !== undefined && !ruleRe.test(rule = rule.toString().toLowerCase()))
        throw TypeError("rule must be a string rule");

    if (extend !== undefined && !util.isString(extend))
        throw TypeError("extend must be a string");

    /**
     * Field rule, if any.
     * @type {string|undefined}
     */
    this.rule = rule && rule !== "optional" ? rule : undefined; // toJSON

    /**
     * Field type.
     * @type {string}
     */
    this.type = type; // toJSON

    /**
     * Unique field id.
     * @type {number}
     */
    this.id = id; // toJSON, marker

    /**
     * Extended type if different from parent.
     * @type {string|undefined}
     */
    this.extend = extend || undefined; // toJSON

    /**
     * Whether this field is required.
     * @type {boolean}
     */
    this.required = rule === "required";

    /**
     * Whether this field is optional.
     * @type {boolean}
     */
    this.optional = !this.required;

    /**
     * Whether this field is repeated.
     * @type {boolean}
     */
    this.repeated = rule === "repeated";

    /**
     * Whether this field is a map or not.
     * @type {boolean}
     */
    this.map = false;

    /**
     * Message this field belongs to.
     * @type {Type|null}
     */
    this.message = null;

    /**
     * OneOf this field belongs to, if any,
     * @type {OneOf|null}
     */
    this.partOf = null;

    /**
     * The field type's default value.
     * @type {*}
     */
    this.typeDefault = null;

    /**
     * The field's default value on prototypes.
     * @type {*}
     */
    this.defaultValue = null;

    /**
     * Whether this field's value should be treated as a long.
     * @type {boolean}
     */
    this.long = util.Long ? types.long[type] !== undefined : /* istanbul ignore next */ false;

    /**
     * Whether this field's value is a buffer.
     * @type {boolean}
     */
    this.bytes = type === "bytes";

    /**
     * Resolved type if not a basic type.
     * @type {Type|Enum|null}
     */
    this.resolvedType = null;

    /**
     * Sister-field within the extended type if a declaring extension field.
     * @type {Field|null}
     */
    this.extensionField = null;

    /**
     * Sister-field within the declaring namespace if an extended field.
     * @type {Field|null}
     */
    this.declaringField = null;

    /**
     * Internally remembers whether this field is packed.
     * @type {boolean|null}
     * @private
     */
    this._packed = null;

    /**
     * Comment for this field.
     * @type {string|null}
     */
    this.comment = comment;
}

/**
 * Determines whether this field is packed. Only relevant when repeated and working with proto2.
 * @name Field#packed
 * @type {boolean}
 * @readonly
 */
Object.defineProperty(Field.prototype, "packed", {
    get: function() {
        // defaults to packed=true if not explicity set to false
        if (this._packed === null)
            this._packed = this.getOption("packed") !== false;
        return this._packed;
    }
});

/**
 * @override
 */
Field.prototype.setOption = function setOption(name, value, ifNotSet) {
    if (name === "packed") // clear cached before setting
        this._packed = null;
    return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
};

/**
 * Field descriptor.
 * @interface IField
 * @property {string} [rule="optional"] Field rule
 * @property {string} type Field type
 * @property {number} id Field id
 * @property {Object.<string,*>} [options] Field options
 */

/**
 * Extension field descriptor.
 * @interface IExtensionField
 * @extends IField
 * @property {string} extend Extended type
 */

/**
 * Converts this field to a field descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IField} Field descriptor
 */
Field.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "rule"    , this.rule !== "optional" && this.rule || undefined,
        "type"    , this.type,
        "id"      , this.id,
        "extend"  , this.extend,
        "options" , this.options,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * Resolves this field's type references.
 * @returns {Field} `this`
 * @throws {Error} If any reference cannot be resolved
 */
Field.prototype.resolve = function resolve() {

    if (this.resolved)
        return this;

    if ((this.typeDefault = types.defaults[this.type]) === undefined) { // if not a basic type, resolve it
        this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
        if (this.resolvedType instanceof Type)
            this.typeDefault = null;
        else // instanceof Enum
            this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]; // first defined
    }

    // use explicitly set default value if present
    if (this.options && this.options["default"] != null) {
        this.typeDefault = this.options["default"];
        if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
            this.typeDefault = this.resolvedType.values[this.typeDefault];
    }

    // remove unnecessary options
    if (this.options) {
        if (this.options.packed === true || this.options.packed !== undefined && this.resolvedType && !(this.resolvedType instanceof Enum))
            delete this.options.packed;
        if (!Object.keys(this.options).length)
            this.options = undefined;
    }

    // convert to internal data type if necesssary
    if (this.long) {
        this.typeDefault = util.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");

        /* istanbul ignore else */
        if (Object.freeze)
            Object.freeze(this.typeDefault); // long instances are meant to be immutable anyway (i.e. use small int cache that even requires it)

    } else if (this.bytes && typeof this.typeDefault === "string") {
        var buf;
        if (util.base64.test(this.typeDefault))
            util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
        else
            util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
        this.typeDefault = buf;
    }

    // take special care of maps and repeated fields
    if (this.map)
        this.defaultValue = util.emptyObject;
    else if (this.repeated)
        this.defaultValue = util.emptyArray;
    else
        this.defaultValue = this.typeDefault;

    // ensure proper value on prototype
    if (this.parent instanceof Type)
        this.parent.ctor.prototype[this.name] = this.defaultValue;

    return ReflectionObject.prototype.resolve.call(this);
};

/**
 * Decorator function as returned by {@link Field.d} and {@link MapField.d} (TypeScript).
 * @typedef FieldDecorator
 * @type {function}
 * @param {Object} prototype Target prototype
 * @param {string} fieldName Field name
 * @returns {undefined}
 */

/**
 * Field decorator (TypeScript).
 * @name Field.d
 * @function
 * @param {number} fieldId Field id
 * @param {"double"|"float"|"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"string"|"bool"|"bytes"|Object} fieldType Field type
 * @param {"optional"|"required"|"repeated"} [fieldRule="optional"] Field rule
 * @param {T} [defaultValue] Default value
 * @returns {FieldDecorator} Decorator function
 * @template T extends number | number[] | Long | Long[] | string | string[] | boolean | boolean[] | Uint8Array | Uint8Array[] | Buffer | Buffer[]
 */
Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {

    // submessage: decorate the submessage and use its name as the type
    if (typeof fieldType === "function")
        fieldType = util.decorateType(fieldType).name;

    // enum reference: create a reflected copy of the enum and keep reuseing it
    else if (fieldType && typeof fieldType === "object")
        fieldType = util.decorateEnum(fieldType).name;

    return function fieldDecorator(prototype, fieldName) {
        util.decorateType(prototype.constructor)
            .add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
    };
};

/**
 * Field decorator (TypeScript).
 * @name Field.d
 * @function
 * @param {number} fieldId Field id
 * @param {Constructor<T>|string} fieldType Field type
 * @param {"optional"|"required"|"repeated"} [fieldRule="optional"] Field rule
 * @returns {FieldDecorator} Decorator function
 * @template T extends Message<T>
 * @variation 2
 */
// like Field.d but without a default value

// Sets up cyclic dependencies (called in index-light)
Field._configure = function configure(Type_) {
    Type = Type_;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Namespace;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(5);
((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";

var Field    = __webpack_require__(6),
    util     = __webpack_require__(1);

var Type,    // cyclic
    Service,
    Enum;

/**
 * Constructs a new namespace instance.
 * @name Namespace
 * @classdesc Reflected namespace.
 * @extends NamespaceBase
 * @constructor
 * @param {string} name Namespace name
 * @param {Object.<string,*>} [options] Declared options
 */

/**
 * Constructs a namespace from JSON.
 * @memberof Namespace
 * @function
 * @param {string} name Namespace name
 * @param {Object.<string,*>} json JSON object
 * @returns {Namespace} Created namespace
 * @throws {TypeError} If arguments are invalid
 */
Namespace.fromJSON = function fromJSON(name, json) {
    return new Namespace(name, json.options).addJSON(json.nested);
};

/**
 * Converts an array of reflection objects to JSON.
 * @memberof Namespace
 * @param {ReflectionObject[]} array Object array
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {Object.<string,*>|undefined} JSON object or `undefined` when array is empty
 */
function arrayToJSON(array, toJSONOptions) {
    if (!(array && array.length))
        return undefined;
    var obj = {};
    for (var i = 0; i < array.length; ++i)
        obj[array[i].name] = array[i].toJSON(toJSONOptions);
    return obj;
}

Namespace.arrayToJSON = arrayToJSON;

/**
 * Tests if the specified id is reserved.
 * @param {Array.<number[]|string>|undefined} reserved Array of reserved ranges and names
 * @param {number} id Id to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Namespace.isReservedId = function isReservedId(reserved, id) {
    if (reserved)
        for (var i = 0; i < reserved.length; ++i)
            if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] >= id)
                return true;
    return false;
};

/**
 * Tests if the specified name is reserved.
 * @param {Array.<number[]|string>|undefined} reserved Array of reserved ranges and names
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Namespace.isReservedName = function isReservedName(reserved, name) {
    if (reserved)
        for (var i = 0; i < reserved.length; ++i)
            if (reserved[i] === name)
                return true;
    return false;
};

/**
 * Not an actual constructor. Use {@link Namespace} instead.
 * @classdesc Base class of all reflection objects containing nested objects. This is not an actual class but here for the sake of having consistent type definitions.
 * @exports NamespaceBase
 * @extends ReflectionObject
 * @abstract
 * @constructor
 * @param {string} name Namespace name
 * @param {Object.<string,*>} [options] Declared options
 * @see {@link Namespace}
 */
function Namespace(name, options) {
    ReflectionObject.call(this, name, options);

    /**
     * Nested objects by name.
     * @type {Object.<string,ReflectionObject>|undefined}
     */
    this.nested = undefined; // toJSON

    /**
     * Cached nested objects as an array.
     * @type {ReflectionObject[]|null}
     * @private
     */
    this._nestedArray = null;
}

function clearCache(namespace) {
    namespace._nestedArray = null;
    return namespace;
}

/**
 * Nested objects of this namespace as an array for iteration.
 * @name NamespaceBase#nestedArray
 * @type {ReflectionObject[]}
 * @readonly
 */
Object.defineProperty(Namespace.prototype, "nestedArray", {
    get: function() {
        return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
    }
});

/**
 * Namespace descriptor.
 * @interface INamespace
 * @property {Object.<string,*>} [options] Namespace options
 * @property {Object.<string,AnyNestedObject>} [nested] Nested object descriptors
 */

/**
 * Any extension field descriptor.
 * @typedef AnyExtensionField
 * @type {IExtensionField|IExtensionMapField}
 */

/**
 * Any nested object descriptor.
 * @typedef AnyNestedObject
 * @type {IEnum|IType|IService|AnyExtensionField|INamespace}
 */
// ^ BEWARE: VSCode hangs forever when using more than 5 types (that's why AnyExtensionField exists in the first place)

/**
 * Converts this namespace to a namespace descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {INamespace} Namespace descriptor
 */
Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
    return util.toObject([
        "options" , this.options,
        "nested"  , arrayToJSON(this.nestedArray, toJSONOptions)
    ]);
};

/**
 * Adds nested objects to this namespace from nested object descriptors.
 * @param {Object.<string,AnyNestedObject>} nestedJson Any nested object descriptors
 * @returns {Namespace} `this`
 */
Namespace.prototype.addJSON = function addJSON(nestedJson) {
    var ns = this;
    /* istanbul ignore else */
    if (nestedJson) {
        for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
            nested = nestedJson[names[i]];
            ns.add( // most to least likely
                ( nested.fields !== undefined
                ? Type.fromJSON
                : nested.values !== undefined
                ? Enum.fromJSON
                : nested.methods !== undefined
                ? Service.fromJSON
                : nested.id !== undefined
                ? Field.fromJSON
                : Namespace.fromJSON )(names[i], nested)
            );
        }
    }
    return this;
};

/**
 * Gets the nested object of the specified name.
 * @param {string} name Nested object name
 * @returns {ReflectionObject|null} The reflection object or `null` if it doesn't exist
 */
Namespace.prototype.get = function get(name) {
    return this.nested && this.nested[name]
        || null;
};

/**
 * Gets the values of the nested {@link Enum|enum} of the specified name.
 * This methods differs from {@link Namespace#get|get} in that it returns an enum's values directly and throws instead of returning `null`.
 * @param {string} name Nested enum name
 * @returns {Object.<string,number>} Enum values
 * @throws {Error} If there is no such enum
 */
Namespace.prototype.getEnum = function getEnum(name) {
    if (this.nested && this.nested[name] instanceof Enum)
        return this.nested[name].values;
    throw Error("no such enum: " + name);
};

/**
 * Adds a nested object to this namespace.
 * @param {ReflectionObject} object Nested object to add
 * @returns {Namespace} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If there is already a nested object with this name
 */
Namespace.prototype.add = function add(object) {

    if (!(object instanceof Field && object.extend !== undefined || object instanceof Type || object instanceof Enum || object instanceof Service || object instanceof Namespace))
        throw TypeError("object must be a valid nested object");

    if (!this.nested)
        this.nested = {};
    else {
        var prev = this.get(object.name);
        if (prev) {
            if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
                // replace plain namespace but keep existing nested elements and options
                var nested = prev.nestedArray;
                for (var i = 0; i < nested.length; ++i)
                    object.add(nested[i]);
                this.remove(prev);
                if (!this.nested)
                    this.nested = {};
                object.setOptions(prev.options, true);

            } else
                throw Error("duplicate name '" + object.name + "' in " + this);
        }
    }
    this.nested[object.name] = object;
    object.onAdd(this);
    return clearCache(this);
};

/**
 * Removes a nested object from this namespace.
 * @param {ReflectionObject} object Nested object to remove
 * @returns {Namespace} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If `object` is not a member of this namespace
 */
Namespace.prototype.remove = function remove(object) {

    if (!(object instanceof ReflectionObject))
        throw TypeError("object must be a ReflectionObject");
    if (object.parent !== this)
        throw Error(object + " is not a member of " + this);

    delete this.nested[object.name];
    if (!Object.keys(this.nested).length)
        this.nested = undefined;

    object.onRemove(this);
    return clearCache(this);
};

/**
 * Defines additial namespaces within this one if not yet existing.
 * @param {string|string[]} path Path to create
 * @param {*} [json] Nested types to create from JSON
 * @returns {Namespace} Pointer to the last namespace created or `this` if path is empty
 */
Namespace.prototype.define = function define(path, json) {

    if (util.isString(path))
        path = path.split(".");
    else if (!Array.isArray(path))
        throw TypeError("illegal path");
    if (path && path.length && path[0] === "")
        throw Error("path must be relative");

    var ptr = this;
    while (path.length > 0) {
        var part = path.shift();
        if (ptr.nested && ptr.nested[part]) {
            ptr = ptr.nested[part];
            if (!(ptr instanceof Namespace))
                throw Error("path conflicts with non-namespace objects");
        } else
            ptr.add(ptr = new Namespace(part));
    }
    if (json)
        ptr.addJSON(json);
    return ptr;
};

/**
 * Resolves this namespace's and all its nested objects' type references. Useful to validate a reflection tree, but comes at a cost.
 * @returns {Namespace} `this`
 */
Namespace.prototype.resolveAll = function resolveAll() {
    var nested = this.nestedArray, i = 0;
    while (i < nested.length)
        if (nested[i] instanceof Namespace)
            nested[i++].resolveAll();
        else
            nested[i++].resolve();
    return this.resolve();
};

/**
 * Recursively looks up the reflection object matching the specified path in the scope of this namespace.
 * @param {string|string[]} path Path to look up
 * @param {*|Array.<*>} filterTypes Filter types, any combination of the constructors of `protobuf.Type`, `protobuf.Enum`, `protobuf.Service` etc.
 * @param {boolean} [parentAlreadyChecked=false] If known, whether the parent has already been checked
 * @returns {ReflectionObject|null} Looked up object or `null` if none could be found
 */
Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {

    /* istanbul ignore next */
    if (typeof filterTypes === "boolean") {
        parentAlreadyChecked = filterTypes;
        filterTypes = undefined;
    } else if (filterTypes && !Array.isArray(filterTypes))
        filterTypes = [ filterTypes ];

    if (util.isString(path) && path.length) {
        if (path === ".")
            return this.root;
        path = path.split(".");
    } else if (!path.length)
        return this;

    // Start at root if path is absolute
    if (path[0] === "")
        return this.root.lookup(path.slice(1), filterTypes);

    // Test if the first part matches any nested object, and if so, traverse if path contains more
    var found = this.get(path[0]);
    if (found) {
        if (path.length === 1) {
            if (!filterTypes || filterTypes.indexOf(found.constructor) > -1)
                return found;
        } else if (found instanceof Namespace && (found = found.lookup(path.slice(1), filterTypes, true)))
            return found;

    // Otherwise try each nested namespace
    } else
        for (var i = 0; i < this.nestedArray.length; ++i)
            if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i].lookup(path, filterTypes, true)))
                return found;

    // If there hasn't been a match, try again at the parent
    if (this.parent === null || parentAlreadyChecked)
        return null;
    return this.parent.lookup(path, filterTypes);
};

/**
 * Looks up the reflection object at the specified path, relative to this namespace.
 * @name NamespaceBase#lookup
 * @function
 * @param {string|string[]} path Path to look up
 * @param {boolean} [parentAlreadyChecked=false] Whether the parent has already been checked
 * @returns {ReflectionObject|null} Looked up object or `null` if none could be found
 * @variation 2
 */
// lookup(path: string, [parentAlreadyChecked: boolean])

/**
 * Looks up the {@link Type|type} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Type} Looked up type
 * @throws {Error} If `path` does not point to a type
 */
Namespace.prototype.lookupType = function lookupType(path) {
    var found = this.lookup(path, [ Type ]);
    if (!found)
        throw Error("no such type: " + path);
    return found;
};

/**
 * Looks up the values of the {@link Enum|enum} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Enum} Looked up enum
 * @throws {Error} If `path` does not point to an enum
 */
Namespace.prototype.lookupEnum = function lookupEnum(path) {
    var found = this.lookup(path, [ Enum ]);
    if (!found)
        throw Error("no such Enum '" + path + "' in " + this);
    return found;
};

/**
 * Looks up the {@link Type|type} or {@link Enum|enum} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Type} Looked up type or enum
 * @throws {Error} If `path` does not point to a type or enum
 */
Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
    var found = this.lookup(path, [ Type, Enum ]);
    if (!found)
        throw Error("no such Type or Enum '" + path + "' in " + this);
    return found;
};

/**
 * Looks up the {@link Service|service} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Service} Looked up service
 * @throws {Error} If `path` does not point to a service
 */
Namespace.prototype.lookupService = function lookupService(path) {
    var found = this.lookup(path, [ Service ]);
    if (!found)
        throw Error("no such Service '" + path + "' in " + this);
    return found;
};

// Sets up cyclic dependencies (called in index-light)
Namespace._configure = function(Type_, Service_, Enum_) {
    Type    = Type_;
    Service = Service_;
    Enum    = Enum_;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Common type constants.
 * @namespace
 */
var types = exports;

var util = __webpack_require__(1);

var s = [
    "double",   // 0
    "float",    // 1
    "int32",    // 2
    "uint32",   // 3
    "sint32",   // 4
    "fixed32",  // 5
    "sfixed32", // 6
    "int64",    // 7
    "uint64",   // 8
    "sint64",   // 9
    "fixed64",  // 10
    "sfixed64", // 11
    "bool",     // 12
    "string",   // 13
    "bytes"     // 14
];

function bake(values, offset) {
    var i = 0, o = {};
    offset |= 0;
    while (i < values.length) o[s[i + offset]] = values[i++];
    return o;
}

/**
 * Basic type wire types.
 * @type {Object.<string,number>}
 * @const
 * @property {number} double=1 Fixed64 wire type
 * @property {number} float=5 Fixed32 wire type
 * @property {number} int32=0 Varint wire type
 * @property {number} uint32=0 Varint wire type
 * @property {number} sint32=0 Varint wire type
 * @property {number} fixed32=5 Fixed32 wire type
 * @property {number} sfixed32=5 Fixed32 wire type
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 * @property {number} bool=0 Varint wire type
 * @property {number} string=2 Ldelim wire type
 * @property {number} bytes=2 Ldelim wire type
 */
types.basic = bake([
    /* double   */ 1,
    /* float    */ 5,
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 5,
    /* sfixed32 */ 5,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1,
    /* bool     */ 0,
    /* string   */ 2,
    /* bytes    */ 2
]);

/**
 * Basic type defaults.
 * @type {Object.<string,*>}
 * @const
 * @property {number} double=0 Double default
 * @property {number} float=0 Float default
 * @property {number} int32=0 Int32 default
 * @property {number} uint32=0 Uint32 default
 * @property {number} sint32=0 Sint32 default
 * @property {number} fixed32=0 Fixed32 default
 * @property {number} sfixed32=0 Sfixed32 default
 * @property {number} int64=0 Int64 default
 * @property {number} uint64=0 Uint64 default
 * @property {number} sint64=0 Sint32 default
 * @property {number} fixed64=0 Fixed64 default
 * @property {number} sfixed64=0 Sfixed64 default
 * @property {boolean} bool=false Bool default
 * @property {string} string="" String default
 * @property {Array.<number>} bytes=Array(0) Bytes default
 * @property {null} message=null Message default
 */
types.defaults = bake([
    /* double   */ 0,
    /* float    */ 0,
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 0,
    /* sfixed32 */ 0,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 0,
    /* sfixed64 */ 0,
    /* bool     */ false,
    /* string   */ "",
    /* bytes    */ util.emptyArray,
    /* message  */ null
]);

/**
 * Basic long type wire types.
 * @type {Object.<string,number>}
 * @const
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 */
types.long = bake([
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1
], 7);

/**
 * Allowed types for map keys with their associated wire type.
 * @type {Object.<string,number>}
 * @const
 * @property {number} int32=0 Varint wire type
 * @property {number} uint32=0 Varint wire type
 * @property {number} sint32=0 Varint wire type
 * @property {number} fixed32=5 Fixed32 wire type
 * @property {number} sfixed32=5 Fixed32 wire type
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 * @property {number} bool=0 Varint wire type
 * @property {number} string=2 Ldelim wire type
 */
types.mapKey = bake([
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 5,
    /* sfixed32 */ 5,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1,
    /* bool     */ 0,
    /* string   */ 2
], 2);

/**
 * Allowed types for packed repeated fields with their associated wire type.
 * @type {Object.<string,number>}
 * @const
 * @property {number} double=1 Fixed64 wire type
 * @property {number} float=5 Fixed32 wire type
 * @property {number} int32=0 Varint wire type
 * @property {number} uint32=0 Varint wire type
 * @property {number} sint32=0 Varint wire type
 * @property {number} fixed32=5 Fixed32 wire type
 * @property {number} sfixed32=5 Fixed32 wire type
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 * @property {number} bool=0 Varint wire type
 */
types.packed = bake([
    /* double   */ 1,
    /* float    */ 5,
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 5,
    /* sfixed32 */ 5,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1,
    /* bool     */ 0
]);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Writer;

var util      = __webpack_require__(2);

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = util.Buffer
    ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
            return new BufferWriter();
        })();
    }
    /* istanbul ignore next */
    : function create_array() {
        return new Writer();
    };

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Reader;

var util      = __webpack_require__(2);

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = util.Buffer
    ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer) {
            return util.Buffer.isBuffer(buffer)
                ? new BufferReader(buffer)
                /* istanbul ignore next */
                : create_array(buffer);
        })(buffer);
    }
    /* istanbul ignore next */
    : create_array;

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = OneOf;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(5);
((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";

var Field = __webpack_require__(6),
    util  = __webpack_require__(1);

/**
 * Constructs a new oneof instance.
 * @classdesc Reflected oneof.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Oneof name
 * @param {string[]|Object.<string,*>} [fieldNames] Field names
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] Comment associated with this field
 */
function OneOf(name, fieldNames, options, comment) {
    if (!Array.isArray(fieldNames)) {
        options = fieldNames;
        fieldNames = undefined;
    }
    ReflectionObject.call(this, name, options);

    /* istanbul ignore if */
    if (!(fieldNames === undefined || Array.isArray(fieldNames)))
        throw TypeError("fieldNames must be an Array");

    /**
     * Field names that belong to this oneof.
     * @type {string[]}
     */
    this.oneof = fieldNames || []; // toJSON, marker

    /**
     * Fields that belong to this oneof as an array for iteration.
     * @type {Field[]}
     * @readonly
     */
    this.fieldsArray = []; // declared readonly for conformance, possibly not yet added to parent

    /**
     * Comment for this field.
     * @type {string|null}
     */
    this.comment = comment;
}

/**
 * Oneof descriptor.
 * @interface IOneOf
 * @property {Array.<string>} oneof Oneof field names
 * @property {Object.<string,*>} [options] Oneof options
 */

/**
 * Constructs a oneof from a oneof descriptor.
 * @param {string} name Oneof name
 * @param {IOneOf} json Oneof descriptor
 * @returns {OneOf} Created oneof
 * @throws {TypeError} If arguments are invalid
 */
OneOf.fromJSON = function fromJSON(name, json) {
    return new OneOf(name, json.oneof, json.options, json.comment);
};

/**
 * Converts this oneof to a oneof descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IOneOf} Oneof descriptor
 */
OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options" , this.options,
        "oneof"   , this.oneof,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * Adds the fields of the specified oneof to the parent if not already done so.
 * @param {OneOf} oneof The oneof
 * @returns {undefined}
 * @inner
 * @ignore
 */
function addFieldsToParent(oneof) {
    if (oneof.parent)
        for (var i = 0; i < oneof.fieldsArray.length; ++i)
            if (!oneof.fieldsArray[i].parent)
                oneof.parent.add(oneof.fieldsArray[i]);
}

/**
 * Adds a field to this oneof and removes it from its current parent, if any.
 * @param {Field} field Field to add
 * @returns {OneOf} `this`
 */
OneOf.prototype.add = function add(field) {

    /* istanbul ignore if */
    if (!(field instanceof Field))
        throw TypeError("field must be a Field");

    if (field.parent && field.parent !== this.parent)
        field.parent.remove(field);
    this.oneof.push(field.name);
    this.fieldsArray.push(field);
    field.partOf = this; // field.parent remains null
    addFieldsToParent(this);
    return this;
};

/**
 * Removes a field from this oneof and puts it back to the oneof's parent.
 * @param {Field} field Field to remove
 * @returns {OneOf} `this`
 */
OneOf.prototype.remove = function remove(field) {

    /* istanbul ignore if */
    if (!(field instanceof Field))
        throw TypeError("field must be a Field");

    var index = this.fieldsArray.indexOf(field);

    /* istanbul ignore if */
    if (index < 0)
        throw Error(field + " is not a member of " + this);

    this.fieldsArray.splice(index, 1);
    index = this.oneof.indexOf(field.name);

    /* istanbul ignore else */
    if (index > -1) // theoretical
        this.oneof.splice(index, 1);

    field.partOf = null;
    return this;
};

/**
 * @override
 */
OneOf.prototype.onAdd = function onAdd(parent) {
    ReflectionObject.prototype.onAdd.call(this, parent);
    var self = this;
    // Collect present fields
    for (var i = 0; i < this.oneof.length; ++i) {
        var field = parent.get(this.oneof[i]);
        if (field && !field.partOf) {
            field.partOf = self;
            self.fieldsArray.push(field);
        }
    }
    // Add not yet present fields
    addFieldsToParent(this);
};

/**
 * @override
 */
OneOf.prototype.onRemove = function onRemove(parent) {
    for (var i = 0, field; i < this.fieldsArray.length; ++i)
        if ((field = this.fieldsArray[i]).parent)
            field.parent.remove(field);
    ReflectionObject.prototype.onRemove.call(this, parent);
};

/**
 * Decorator function as returned by {@link OneOf.d} (TypeScript).
 * @typedef OneOfDecorator
 * @type {function}
 * @param {Object} prototype Target prototype
 * @param {string} oneofName OneOf name
 * @returns {undefined}
 */

/**
 * OneOf decorator (TypeScript).
 * @function
 * @param {...string} fieldNames Field names
 * @returns {OneOfDecorator} Decorator function
 * @template T extends string
 */
OneOf.d = function decorateOneOf() {
    var fieldNames = new Array(arguments.length),
        index = 0;
    while (index < arguments.length)
        fieldNames[index] = arguments[index++];
    return function oneOfDecorator(prototype, oneofName) {
        util.decorateType(prototype.constructor)
            .add(new OneOf(oneofName, fieldNames));
        Object.defineProperty(prototype, oneofName, {
            get: util.oneOfGetter(fieldNames),
            set: util.oneOfSetter(fieldNames)
        });
    };
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Message;

var util = __webpack_require__(2);

/**
 * Constructs a new message instance.
 * @classdesc Abstract runtime message.
 * @constructor
 * @param {Properties<T>} [properties] Properties to set
 * @template T extends object = object
 */
function Message(properties) {
    // not used internally
    if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            this[keys[i]] = properties[keys[i]];
}

/**
 * Reference to the reflected type.
 * @name Message.$type
 * @type {Type}
 * @readonly
 */

/**
 * Reference to the reflected type.
 * @name Message#$type
 * @type {Type}
 * @readonly
 */

/*eslint-disable valid-jsdoc*/

/**
 * Creates a new message of this type using the specified properties.
 * @param {Object.<string,*>} [properties] Properties to set
 * @returns {Message<T>} Message instance
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.create = function create(properties) {
    return this.$type.create(properties);
};

/**
 * Encodes a message of this type.
 * @param {T|Object.<string,*>} message Message to encode
 * @param {Writer} [writer] Writer to use
 * @returns {Writer} Writer
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.encode = function encode(message, writer) {
    return this.$type.encode(message, writer);
};

/**
 * Encodes a message of this type preceeded by its length as a varint.
 * @param {T|Object.<string,*>} message Message to encode
 * @param {Writer} [writer] Writer to use
 * @returns {Writer} Writer
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.encodeDelimited = function encodeDelimited(message, writer) {
    return this.$type.encodeDelimited(message, writer);
};

/**
 * Decodes a message of this type.
 * @name Message.decode
 * @function
 * @param {Reader|Uint8Array} reader Reader or buffer to decode
 * @returns {T} Decoded message
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.decode = function decode(reader) {
    return this.$type.decode(reader);
};

/**
 * Decodes a message of this type preceeded by its length as a varint.
 * @name Message.decodeDelimited
 * @function
 * @param {Reader|Uint8Array} reader Reader or buffer to decode
 * @returns {T} Decoded message
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.decodeDelimited = function decodeDelimited(reader) {
    return this.$type.decodeDelimited(reader);
};

/**
 * Verifies a message of this type.
 * @name Message.verify
 * @function
 * @param {Object.<string,*>} message Plain object to verify
 * @returns {string|null} `null` if valid, otherwise the reason why it is not
 */
Message.verify = function verify(message) {
    return this.$type.verify(message);
};

/**
 * Creates a new message of this type from a plain object. Also converts values to their respective internal types.
 * @param {Object.<string,*>} object Plain object
 * @returns {T} Message instance
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.fromObject = function fromObject(object) {
    return this.$type.fromObject(object);
};

/**
 * Creates a plain object from a message of this type. Also converts values to other types if specified.
 * @param {T} message Message instance
 * @param {IConversionOptions} [options] Conversion options
 * @returns {Object.<string,*>} Plain object
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.toObject = function toObject(message, options) {
    return this.$type.toObject(message, options);
};

/**
 * Converts this message to JSON.
 * @returns {Object.<string,*>} JSON object
 */
Message.prototype.toJSON = function toJSON() {
    return this.$type.toObject(this, util.toJSONOptions);
};

/*eslint-enable valid-jsdoc*/

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = __webpack_require__(40);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available accross modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = encoder;

var Enum     = __webpack_require__(3),
    types    = __webpack_require__(8),
    util     = __webpack_require__(1);

/**
 * Generates a partial message type encoder.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genTypePartial(gen, field, fieldIndex, ref) {
    return field.resolvedType.group
        ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0)
        : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
}

/**
 * Generates an encoder specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function encoder(mtype) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    var gen = util.codegen(["m", "w"], mtype.name + "$encode")
    ("if(!w)")
        ("w=Writer.create()");

    var i, ref;

    // "when a message is serialized its known fields should be written sequentially by field number"
    var fields = /* initializes */ mtype.fieldsArray.slice().sort(util.compareFieldsById);

    for (var i = 0; i < fields.length; ++i) {
        var field    = fields[i].resolve(),
            index    = mtype._fieldsArray.indexOf(field),
            type     = field.resolvedType instanceof Enum ? "int32" : field.type,
            wireType = types.basic[type];
            ref      = "m" + util.safeProp(field.name);

        // Map fields
        if (field.map) {
            gen
    ("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name) // !== undefined && !== null
        ("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)
            ("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
            if (wireType === undefined) gen
            ("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref); // can't be groups
            else gen
            (".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
            gen
        ("}")
    ("}");

            // Repeated fields
        } else if (field.repeated) { gen
    ("if(%s!=null&&%s.length){", ref, ref); // !== undefined && !== null

            // Packed repeated
            if (field.packed && types.packed[type] !== undefined) { gen

        ("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)
        ("for(var i=0;i<%s.length;++i)", ref)
            ("w.%s(%s[i])", type, ref)
        ("w.ldelim()");

            // Non-packed
            } else { gen

        ("for(var i=0;i<%s.length;++i)", ref);
                if (wireType === undefined)
            genTypePartial(gen, field, index, ref + "[i]");
                else gen
            ("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);

            } gen
    ("}");

        // Non-repeated
        } else {
            if (field.optional) gen
    ("if(%s!=null&&m.hasOwnProperty(%j))", ref, field.name); // !== undefined && !== null

            if (wireType === undefined)
        genTypePartial(gen, field, index, ref);
            else gen
        ("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);

        }
    }

    return gen
    ("return w");
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Type;

// extends Namespace
var Namespace = __webpack_require__(7);
((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";

var Enum      = __webpack_require__(3),
    OneOf     = __webpack_require__(11),
    Field     = __webpack_require__(6),
    MapField  = __webpack_require__(19),
    Service   = __webpack_require__(20),
    Message   = __webpack_require__(12),
    Reader    = __webpack_require__(10),
    Writer    = __webpack_require__(9),
    util      = __webpack_require__(1),
    encoder   = __webpack_require__(17),
    decoder   = __webpack_require__(22),
    verifier  = __webpack_require__(23),
    converter = __webpack_require__(24),
    wrappers  = __webpack_require__(25);

/**
 * Constructs a new reflected message type instance.
 * @classdesc Reflected message type.
 * @extends NamespaceBase
 * @constructor
 * @param {string} name Message name
 * @param {Object.<string,*>} [options] Declared options
 */
function Type(name, options) {
    Namespace.call(this, name, options);

    /**
     * Message fields.
     * @type {Object.<string,Field>}
     */
    this.fields = {};  // toJSON, marker

    /**
     * Oneofs declared within this namespace, if any.
     * @type {Object.<string,OneOf>}
     */
    this.oneofs = undefined; // toJSON

    /**
     * Extension ranges, if any.
     * @type {number[][]}
     */
    this.extensions = undefined; // toJSON

    /**
     * Reserved ranges, if any.
     * @type {Array.<number[]|string>}
     */
    this.reserved = undefined; // toJSON

    /*?
     * Whether this type is a legacy group.
     * @type {boolean|undefined}
     */
    this.group = undefined; // toJSON

    /**
     * Cached fields by id.
     * @type {Object.<number,Field>|null}
     * @private
     */
    this._fieldsById = null;

    /**
     * Cached fields as an array.
     * @type {Field[]|null}
     * @private
     */
    this._fieldsArray = null;

    /**
     * Cached oneofs as an array.
     * @type {OneOf[]|null}
     * @private
     */
    this._oneofsArray = null;

    /**
     * Cached constructor.
     * @type {Constructor<{}>}
     * @private
     */
    this._ctor = null;
}

Object.defineProperties(Type.prototype, {

    /**
     * Message fields by id.
     * @name Type#fieldsById
     * @type {Object.<number,Field>}
     * @readonly
     */
    fieldsById: {
        get: function() {

            /* istanbul ignore if */
            if (this._fieldsById)
                return this._fieldsById;

            this._fieldsById = {};
            for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
                var field = this.fields[names[i]],
                    id = field.id;

                /* istanbul ignore if */
                if (this._fieldsById[id])
                    throw Error("duplicate id " + id + " in " + this);

                this._fieldsById[id] = field;
            }
            return this._fieldsById;
        }
    },

    /**
     * Fields of this message as an array for iteration.
     * @name Type#fieldsArray
     * @type {Field[]}
     * @readonly
     */
    fieldsArray: {
        get: function() {
            return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
        }
    },

    /**
     * Oneofs of this message as an array for iteration.
     * @name Type#oneofsArray
     * @type {OneOf[]}
     * @readonly
     */
    oneofsArray: {
        get: function() {
            return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
        }
    },

    /**
     * The registered constructor, if any registered, otherwise a generic constructor.
     * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
     * @name Type#ctor
     * @type {Constructor<{}>}
     */
    ctor: {
        get: function() {
            return this._ctor || (this.ctor = Type.generateConstructor(this)());
        },
        set: function(ctor) {

            // Ensure proper prototype
            var prototype = ctor.prototype;
            if (!(prototype instanceof Message)) {
                (ctor.prototype = new Message()).constructor = ctor;
                util.merge(ctor.prototype, prototype);
            }

            // Classes and messages reference their reflected type
            ctor.$type = ctor.prototype.$type = this;

            // Mix in static methods
            util.merge(ctor, Message, true);

            this._ctor = ctor;

            // Messages have non-enumerable default values on their prototype
            var i = 0;
            for (; i < /* initializes */ this.fieldsArray.length; ++i)
                this._fieldsArray[i].resolve(); // ensures a proper value

            // Messages have non-enumerable getters and setters for each virtual oneof field
            var ctorProperties = {};
            for (i = 0; i < /* initializes */ this.oneofsArray.length; ++i)
                ctorProperties[this._oneofsArray[i].resolve().name] = {
                    get: util.oneOfGetter(this._oneofsArray[i].oneof),
                    set: util.oneOfSetter(this._oneofsArray[i].oneof)
                };
            if (i)
                Object.defineProperties(ctor.prototype, ctorProperties);
        }
    }
});

/**
 * Generates a constructor function for the specified type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
Type.generateConstructor = function generateConstructor(mtype) {
    /* eslint-disable no-unexpected-multiline */
    var gen = util.codegen(["p"], mtype.name);
    // explicitly initialize mutable object/array fields so that these aren't just inherited from the prototype
    for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
        if ((field = mtype._fieldsArray[i]).map) gen
            ("this%s={}", util.safeProp(field.name));
        else if (field.repeated) gen
            ("this%s=[]", util.safeProp(field.name));
    return gen
    ("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)") // omit undefined or null
        ("this[ks[i]]=p[ks[i]]");
    /* eslint-enable no-unexpected-multiline */
};

function clearCache(type) {
    type._fieldsById = type._fieldsArray = type._oneofsArray = null;
    delete type.encode;
    delete type.decode;
    delete type.verify;
    return type;
}

/**
 * Message type descriptor.
 * @interface IType
 * @extends INamespace
 * @property {Object.<string,IOneOf>} [oneofs] Oneof descriptors
 * @property {Object.<string,IField>} fields Field descriptors
 * @property {number[][]} [extensions] Extension ranges
 * @property {number[][]} [reserved] Reserved ranges
 * @property {boolean} [group=false] Whether a legacy group or not
 */

/**
 * Creates a message type from a message type descriptor.
 * @param {string} name Message name
 * @param {IType} json Message type descriptor
 * @returns {Type} Created message type
 */
Type.fromJSON = function fromJSON(name, json) {
    var type = new Type(name, json.options);
    type.extensions = json.extensions;
    type.reserved = json.reserved;
    var names = Object.keys(json.fields),
        i = 0;
    for (; i < names.length; ++i)
        type.add(
            ( typeof json.fields[names[i]].keyType !== "undefined"
            ? MapField.fromJSON
            : Field.fromJSON )(names[i], json.fields[names[i]])
        );
    if (json.oneofs)
        for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
            type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
    if (json.nested)
        for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
            var nested = json.nested[names[i]];
            type.add( // most to least likely
                ( nested.id !== undefined
                ? Field.fromJSON
                : nested.fields !== undefined
                ? Type.fromJSON
                : nested.values !== undefined
                ? Enum.fromJSON
                : nested.methods !== undefined
                ? Service.fromJSON
                : Namespace.fromJSON )(names[i], nested)
            );
        }
    if (json.extensions && json.extensions.length)
        type.extensions = json.extensions;
    if (json.reserved && json.reserved.length)
        type.reserved = json.reserved;
    if (json.group)
        type.group = true;
    if (json.comment)
        type.comment = json.comment;
    return type;
};

/**
 * Converts this message type to a message type descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IType} Message type descriptor
 */
Type.prototype.toJSON = function toJSON(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options"    , inherited && inherited.options || undefined,
        "oneofs"     , Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
        "fields"     , Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) { return !obj.declaringField; }), toJSONOptions) || {},
        "extensions" , this.extensions && this.extensions.length ? this.extensions : undefined,
        "reserved"   , this.reserved && this.reserved.length ? this.reserved : undefined,
        "group"      , this.group || undefined,
        "nested"     , inherited && inherited.nested || undefined,
        "comment"    , keepComments ? this.comment : undefined
    ]);
};

/**
 * @override
 */
Type.prototype.resolveAll = function resolveAll() {
    var fields = this.fieldsArray, i = 0;
    while (i < fields.length)
        fields[i++].resolve();
    var oneofs = this.oneofsArray; i = 0;
    while (i < oneofs.length)
        oneofs[i++].resolve();
    return Namespace.prototype.resolveAll.call(this);
};

/**
 * @override
 */
Type.prototype.get = function get(name) {
    return this.fields[name]
        || this.oneofs && this.oneofs[name]
        || this.nested && this.nested[name]
        || null;
};

/**
 * Adds a nested object to this type.
 * @param {ReflectionObject} object Nested object to add
 * @returns {Type} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If there is already a nested object with this name or, if a field, when there is already a field with this id
 */
Type.prototype.add = function add(object) {

    if (this.get(object.name))
        throw Error("duplicate name '" + object.name + "' in " + this);

    if (object instanceof Field && object.extend === undefined) {
        // NOTE: Extension fields aren't actual fields on the declaring type, but nested objects.
        // The root object takes care of adding distinct sister-fields to the respective extended
        // type instead.

        // avoids calling the getter if not absolutely necessary because it's called quite frequently
        if (this._fieldsById ? /* istanbul ignore next */ this._fieldsById[object.id] : this.fieldsById[object.id])
            throw Error("duplicate id " + object.id + " in " + this);
        if (this.isReservedId(object.id))
            throw Error("id " + object.id + " is reserved in " + this);
        if (this.isReservedName(object.name))
            throw Error("name '" + object.name + "' is reserved in " + this);

        if (object.parent)
            object.parent.remove(object);
        this.fields[object.name] = object;
        object.message = this;
        object.onAdd(this);
        return clearCache(this);
    }
    if (object instanceof OneOf) {
        if (!this.oneofs)
            this.oneofs = {};
        this.oneofs[object.name] = object;
        object.onAdd(this);
        return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object);
};

/**
 * Removes a nested object from this type.
 * @param {ReflectionObject} object Nested object to remove
 * @returns {Type} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If `object` is not a member of this type
 */
Type.prototype.remove = function remove(object) {
    if (object instanceof Field && object.extend === undefined) {
        // See Type#add for the reason why extension fields are excluded here.

        /* istanbul ignore if */
        if (!this.fields || this.fields[object.name] !== object)
            throw Error(object + " is not a member of " + this);

        delete this.fields[object.name];
        object.parent = null;
        object.onRemove(this);
        return clearCache(this);
    }
    if (object instanceof OneOf) {

        /* istanbul ignore if */
        if (!this.oneofs || this.oneofs[object.name] !== object)
            throw Error(object + " is not a member of " + this);

        delete this.oneofs[object.name];
        object.parent = null;
        object.onRemove(this);
        return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object);
};

/**
 * Tests if the specified id is reserved.
 * @param {number} id Id to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Type.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
};

/**
 * Tests if the specified name is reserved.
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Type.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
};

/**
 * Creates a new message of this type using the specified properties.
 * @param {Object.<string,*>} [properties] Properties to set
 * @returns {Message<{}>} Message instance
 */
Type.prototype.create = function create(properties) {
    return new this.ctor(properties);
};

/**
 * Sets up {@link Type#encode|encode}, {@link Type#decode|decode} and {@link Type#verify|verify}.
 * @returns {Type} `this`
 */
Type.prototype.setup = function setup() {
    // Sets up everything at once so that the prototype chain does not have to be re-evaluated
    // multiple times (V8, soft-deopt prototype-check).

    var fullName = this.fullName,
        types    = [];
    for (var i = 0; i < /* initializes */ this.fieldsArray.length; ++i)
        types.push(this._fieldsArray[i].resolve().resolvedType);

    // Replace setup methods with type-specific generated functions
    this.encode = encoder(this)({
        Writer : Writer,
        types  : types,
        util   : util
    });
    this.decode = decoder(this)({
        Reader : Reader,
        types  : types,
        util   : util
    });
    this.verify = verifier(this)({
        types : types,
        util  : util
    });
    this.fromObject = converter.fromObject(this)({
        types : types,
        util  : util
    });
    this.toObject = converter.toObject(this)({
        types : types,
        util  : util
    });

    // Inject custom wrappers for common types
    var wrapper = wrappers[fullName];
    if (wrapper) {
        var originalThis = Object.create(this);
        // if (wrapper.fromObject) {
            originalThis.fromObject = this.fromObject;
            this.fromObject = wrapper.fromObject.bind(originalThis);
        // }
        // if (wrapper.toObject) {
            originalThis.toObject = this.toObject;
            this.toObject = wrapper.toObject.bind(originalThis);
        // }
    }

    return this;
};

/**
 * Encodes a message of this type. Does not implicitly {@link Type#verify|verify} messages.
 * @param {Message<{}>|Object.<string,*>} message Message instance or plain object
 * @param {Writer} [writer] Writer to encode to
 * @returns {Writer} writer
 */
Type.prototype.encode = function encode_setup(message, writer) {
    return this.setup().encode(message, writer); // overrides this method
};

/**
 * Encodes a message of this type preceeded by its byte length as a varint. Does not implicitly {@link Type#verify|verify} messages.
 * @param {Message<{}>|Object.<string,*>} message Message instance or plain object
 * @param {Writer} [writer] Writer to encode to
 * @returns {Writer} writer
 */
Type.prototype.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
};

/**
 * Decodes a message of this type.
 * @param {Reader|Uint8Array} reader Reader or buffer to decode from
 * @param {number} [length] Length of the message, if known beforehand
 * @returns {Message<{}>} Decoded message
 * @throws {Error} If the payload is not a reader or valid buffer
 * @throws {util.ProtocolError<{}>} If required fields are missing
 */
Type.prototype.decode = function decode_setup(reader, length) {
    return this.setup().decode(reader, length); // overrides this method
};

/**
 * Decodes a message of this type preceeded by its byte length as a varint.
 * @param {Reader|Uint8Array} reader Reader or buffer to decode from
 * @returns {Message<{}>} Decoded message
 * @throws {Error} If the payload is not a reader or valid buffer
 * @throws {util.ProtocolError} If required fields are missing
 */
Type.prototype.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof Reader))
        reader = Reader.create(reader);
    return this.decode(reader, reader.uint32());
};

/**
 * Verifies that field values are valid and that required fields are present.
 * @param {Object.<string,*>} message Plain object to verify
 * @returns {null|string} `null` if valid, otherwise the reason why it is not
 */
Type.prototype.verify = function verify_setup(message) {
    return this.setup().verify(message); // overrides this method
};

/**
 * Creates a new message of this type from a plain object. Also converts values to their respective internal types.
 * @param {Object.<string,*>} object Plain object to convert
 * @returns {Message<{}>} Message instance
 */
Type.prototype.fromObject = function fromObject(object) {
    return this.setup().fromObject(object);
};

/**
 * Conversion options as used by {@link Type#toObject} and {@link Message.toObject}.
 * @interface IConversionOptions
 * @property {Function} [longs] Long conversion type.
 * Valid values are `String` and `Number` (the global types).
 * Defaults to copy the present value, which is a possibly unsafe number without and a {@link Long} with a long library.
 * @property {Function} [enums] Enum value conversion type.
 * Only valid value is `String` (the global type).
 * Defaults to copy the present value, which is the numeric id.
 * @property {Function} [bytes] Bytes value conversion type.
 * Valid values are `Array` and (a base64 encoded) `String` (the global types).
 * Defaults to copy the present value, which usually is a Buffer under node and an Uint8Array in the browser.
 * @property {boolean} [defaults=false] Also sets default values on the resulting object
 * @property {boolean} [arrays=false] Sets empty arrays for missing repeated fields even if `defaults=false`
 * @property {boolean} [objects=false] Sets empty objects for missing map fields even if `defaults=false`
 * @property {boolean} [oneofs=false] Includes virtual oneof properties set to the present field's name, if any
 * @property {boolean} [json=false] Performs additional JSON compatibility conversions, i.e. NaN and Infinity to strings
 */

/**
 * Creates a plain object from a message of this type. Also converts values to other types if specified.
 * @param {Message<{}>} message Message instance
 * @param {IConversionOptions} [options] Conversion options
 * @returns {Object.<string,*>} Plain object
 */
Type.prototype.toObject = function toObject(message, options) {
    return this.setup().toObject(message, options);
};

/**
 * Decorator function as returned by {@link Type.d} (TypeScript).
 * @typedef TypeDecorator
 * @type {function}
 * @param {Constructor<T>} target Target constructor
 * @returns {undefined}
 * @template T extends Message<T>
 */

/**
 * Type decorator (TypeScript).
 * @param {string} [typeName] Type name, defaults to the constructor's name
 * @returns {TypeDecorator<T>} Decorator function
 * @template T extends Message<T>
 */
Type.d = function decorateType(typeName) {
    return function typeDecorator(target) {
        util.decorateType(target, typeName);
    };
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = MapField;

// extends Field
var Field = __webpack_require__(6);
((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";

var types   = __webpack_require__(8),
    util    = __webpack_require__(1);

/**
 * Constructs a new map field instance.
 * @classdesc Reflected map field.
 * @extends FieldBase
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {number} id Unique id within its namespace
 * @param {string} keyType Key type
 * @param {string} type Value type
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] Comment associated with this field
 */
function MapField(name, id, keyType, type, options, comment) {
    Field.call(this, name, id, type, undefined, undefined, options, comment);

    /* istanbul ignore if */
    if (!util.isString(keyType))
        throw TypeError("keyType must be a string");

    /**
     * Key type.
     * @type {string}
     */
    this.keyType = keyType; // toJSON, marker

    /**
     * Resolved key type if not a basic type.
     * @type {ReflectionObject|null}
     */
    this.resolvedKeyType = null;

    // Overrides Field#map
    this.map = true;
}

/**
 * Map field descriptor.
 * @interface IMapField
 * @extends {IField}
 * @property {string} keyType Key type
 */

/**
 * Extension map field descriptor.
 * @interface IExtensionMapField
 * @extends IMapField
 * @property {string} extend Extended type
 */

/**
 * Constructs a map field from a map field descriptor.
 * @param {string} name Field name
 * @param {IMapField} json Map field descriptor
 * @returns {MapField} Created map field
 * @throws {TypeError} If arguments are invalid
 */
MapField.fromJSON = function fromJSON(name, json) {
    return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
};

/**
 * Converts this map field to a map field descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IMapField} Map field descriptor
 */
MapField.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "keyType" , this.keyType,
        "type"    , this.type,
        "id"      , this.id,
        "extend"  , this.extend,
        "options" , this.options,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * @override
 */
MapField.prototype.resolve = function resolve() {
    if (this.resolved)
        return this;

    // Besides a value type, map fields have a key type that may be "any scalar type except for floating point types and bytes"
    if (types.mapKey[this.keyType] === undefined)
        throw Error("invalid key type: " + this.keyType);

    return Field.prototype.resolve.call(this);
};

/**
 * Map field decorator (TypeScript).
 * @name MapField.d
 * @function
 * @param {number} fieldId Field id
 * @param {"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"bool"|"string"} fieldKeyType Field key type
 * @param {"double"|"float"|"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"bool"|"string"|"bytes"|Object|Constructor<{}>} fieldValueType Field value type
 * @returns {FieldDecorator} Decorator function
 * @template T extends { [key: string]: number | Long | string | boolean | Uint8Array | Buffer | number[] | Message<{}> }
 */
MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {

    // submessage value: decorate the submessage and use its name as the type
    if (typeof fieldValueType === "function")
        fieldValueType = util.decorateType(fieldValueType).name;

    // enum reference value: create a reflected copy of the enum and keep reuseing it
    else if (fieldValueType && typeof fieldValueType === "object")
        fieldValueType = util.decorateEnum(fieldValueType).name;

    return function mapFieldDecorator(prototype, fieldName) {
        util.decorateType(prototype.constructor)
            .add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
    };
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Service;

// extends Namespace
var Namespace = __webpack_require__(7);
((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";

var Method = __webpack_require__(21),
    util   = __webpack_require__(1),
    rpc    = __webpack_require__(15);

/**
 * Constructs a new service instance.
 * @classdesc Reflected service.
 * @extends NamespaceBase
 * @constructor
 * @param {string} name Service name
 * @param {Object.<string,*>} [options] Service options
 * @throws {TypeError} If arguments are invalid
 */
function Service(name, options) {
    Namespace.call(this, name, options);

    /**
     * Service methods.
     * @type {Object.<string,Method>}
     */
    this.methods = {}; // toJSON, marker

    /**
     * Cached methods as an array.
     * @type {Method[]|null}
     * @private
     */
    this._methodsArray = null;
}

/**
 * Service descriptor.
 * @interface IService
 * @extends INamespace
 * @property {Object.<string,IMethod>} methods Method descriptors
 */

/**
 * Constructs a service from a service descriptor.
 * @param {string} name Service name
 * @param {IService} json Service descriptor
 * @returns {Service} Created service
 * @throws {TypeError} If arguments are invalid
 */
Service.fromJSON = function fromJSON(name, json) {
    var service = new Service(name, json.options);
    /* istanbul ignore else */
    if (json.methods)
        for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
            service.add(Method.fromJSON(names[i], json.methods[names[i]]));
    if (json.nested)
        service.addJSON(json.nested);
    service.comment = json.comment;
    return service;
};

/**
 * Converts this service to a service descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IService} Service descriptor
 */
Service.prototype.toJSON = function toJSON(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options" , inherited && inherited.options || undefined,
        "methods" , Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */ {},
        "nested"  , inherited && inherited.nested || undefined,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * Methods of this service as an array for iteration.
 * @name Service#methodsArray
 * @type {Method[]}
 * @readonly
 */
Object.defineProperty(Service.prototype, "methodsArray", {
    get: function() {
        return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
    }
});

function clearCache(service) {
    service._methodsArray = null;
    return service;
}

/**
 * @override
 */
Service.prototype.get = function get(name) {
    return this.methods[name]
        || Namespace.prototype.get.call(this, name);
};

/**
 * @override
 */
Service.prototype.resolveAll = function resolveAll() {
    var methods = this.methodsArray;
    for (var i = 0; i < methods.length; ++i)
        methods[i].resolve();
    return Namespace.prototype.resolve.call(this);
};

/**
 * @override
 */
Service.prototype.add = function add(object) {

    /* istanbul ignore if */
    if (this.get(object.name))
        throw Error("duplicate name '" + object.name + "' in " + this);

    if (object instanceof Method) {
        this.methods[object.name] = object;
        object.parent = this;
        return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object);
};

/**
 * @override
 */
Service.prototype.remove = function remove(object) {
    if (object instanceof Method) {

        /* istanbul ignore if */
        if (this.methods[object.name] !== object)
            throw Error(object + " is not a member of " + this);

        delete this.methods[object.name];
        object.parent = null;
        return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object);
};

/**
 * Creates a runtime service using the specified rpc implementation.
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 * @returns {rpc.Service} RPC service. Useful where requests and/or responses are streamed.
 */
Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
    var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
    for (var i = 0, method; i < /* initializes */ this.methodsArray.length; ++i) {
        var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
        rpcService[methodName] = util.codegen(["r","c"], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
            m: method,
            q: method.resolvedRequestType.ctor,
            s: method.resolvedResponseType.ctor
        });
    }
    return rpcService;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Method;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(5);
((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";

var util = __webpack_require__(1);

/**
 * Constructs a new service method instance.
 * @classdesc Reflected service method.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Method name
 * @param {string|undefined} type Method type, usually `"rpc"`
 * @param {string} requestType Request message type
 * @param {string} responseType Response message type
 * @param {boolean|Object.<string,*>} [requestStream] Whether the request is streamed
 * @param {boolean|Object.<string,*>} [responseStream] Whether the response is streamed
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] The comment for this method
 */
function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment) {

    /* istanbul ignore next */
    if (util.isObject(requestStream)) {
        options = requestStream;
        requestStream = responseStream = undefined;
    } else if (util.isObject(responseStream)) {
        options = responseStream;
        responseStream = undefined;
    }

    /* istanbul ignore if */
    if (!(type === undefined || util.isString(type)))
        throw TypeError("type must be a string");

    /* istanbul ignore if */
    if (!util.isString(requestType))
        throw TypeError("requestType must be a string");

    /* istanbul ignore if */
    if (!util.isString(responseType))
        throw TypeError("responseType must be a string");

    ReflectionObject.call(this, name, options);

    /**
     * Method type.
     * @type {string}
     */
    this.type = type || "rpc"; // toJSON

    /**
     * Request type.
     * @type {string}
     */
    this.requestType = requestType; // toJSON, marker

    /**
     * Whether requests are streamed or not.
     * @type {boolean|undefined}
     */
    this.requestStream = requestStream ? true : undefined; // toJSON

    /**
     * Response type.
     * @type {string}
     */
    this.responseType = responseType; // toJSON

    /**
     * Whether responses are streamed or not.
     * @type {boolean|undefined}
     */
    this.responseStream = responseStream ? true : undefined; // toJSON

    /**
     * Resolved request type.
     * @type {Type|null}
     */
    this.resolvedRequestType = null;

    /**
     * Resolved response type.
     * @type {Type|null}
     */
    this.resolvedResponseType = null;

    /**
     * Comment for this method
     * @type {string|null}
     */
    this.comment = comment;
}

/**
 * Method descriptor.
 * @interface IMethod
 * @property {string} [type="rpc"] Method type
 * @property {string} requestType Request type
 * @property {string} responseType Response type
 * @property {boolean} [requestStream=false] Whether requests are streamed
 * @property {boolean} [responseStream=false] Whether responses are streamed
 * @property {Object.<string,*>} [options] Method options
 */

/**
 * Constructs a method from a method descriptor.
 * @param {string} name Method name
 * @param {IMethod} json Method descriptor
 * @returns {Method} Created method
 * @throws {TypeError} If arguments are invalid
 */
Method.fromJSON = function fromJSON(name, json) {
    return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment);
};

/**
 * Converts this method to a method descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IMethod} Method descriptor
 */
Method.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "type"           , this.type !== "rpc" && /* istanbul ignore next */ this.type || undefined,
        "requestType"    , this.requestType,
        "requestStream"  , this.requestStream,
        "responseType"   , this.responseType,
        "responseStream" , this.responseStream,
        "options"        , this.options,
        "comment"        , keepComments ? this.comment : undefined
    ]);
};

/**
 * @override
 */
Method.prototype.resolve = function resolve() {

    /* istanbul ignore if */
    if (this.resolved)
        return this;

    this.resolvedRequestType = this.parent.lookupType(this.requestType);
    this.resolvedResponseType = this.parent.lookupType(this.responseType);

    return ReflectionObject.prototype.resolve.call(this);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = decoder;

var Enum    = __webpack_require__(3),
    types   = __webpack_require__(8),
    util    = __webpack_require__(1);

function missing(field) {
    return "missing required '" + field.name + "'";
}

/**
 * Generates a decoder specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function decoder(mtype) {
    /* eslint-disable no-unexpected-multiline */
    var gen = util.codegen(["r", "l"], mtype.name + "$decode")
    ("if(!(r instanceof Reader))")
        ("r=Reader.create(r)")
    ("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field) { return field.map; }).length ? ",k" : ""))
    ("while(r.pos<c){")
        ("var t=r.uint32()");
    if (mtype.group) gen
        ("if((t&7)===4)")
            ("break");
    gen
        ("switch(t>>>3){");

    var i = 0;
    for (; i < /* initializes */ mtype.fieldsArray.length; ++i) {
        var field = mtype._fieldsArray[i].resolve(),
            type  = field.resolvedType instanceof Enum ? "int32" : field.type,
            ref   = "m" + util.safeProp(field.name); gen
            ("case %i:", field.id);

        // Map fields
        if (field.map) { gen
                ("r.skip().pos++") // assumes id 1 + key wireType
                ("if(%s===util.emptyObject)", ref)
                    ("%s={}", ref)
                ("k=r.%s()", field.keyType)
                ("r.pos++"); // assumes id 2 + value wireType
            if (types.long[field.keyType] !== undefined) {
                if (types.basic[type] === undefined) gen
                ("%s[typeof k===\"object\"?util.longToHash(k):k]=types[%i].decode(r,r.uint32())", ref, i); // can't be groups
                else gen
                ("%s[typeof k===\"object\"?util.longToHash(k):k]=r.%s()", ref, type);
            } else {
                if (types.basic[type] === undefined) gen
                ("%s[k]=types[%i].decode(r,r.uint32())", ref, i); // can't be groups
                else gen
                ("%s[k]=r.%s()", ref, type);
            }

        // Repeated fields
        } else if (field.repeated) { gen

                ("if(!(%s&&%s.length))", ref, ref)
                    ("%s=[]", ref);

            // Packable (always check for forward and backward compatiblity)
            if (types.packed[type] !== undefined) gen
                ("if((t&7)===2){")
                    ("var c2=r.uint32()+r.pos")
                    ("while(r.pos<c2)")
                        ("%s.push(r.%s())", ref, type)
                ("}else");

            // Non-packed
            if (types.basic[type] === undefined) gen(field.resolvedType.group
                    ? "%s.push(types[%i].decode(r))"
                    : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);
            else gen
                    ("%s.push(r.%s())", ref, type);

        // Non-repeated
        } else if (types.basic[type] === undefined) gen(field.resolvedType.group
                ? "%s=types[%i].decode(r)"
                : "%s=types[%i].decode(r,r.uint32())", ref, i);
        else gen
                ("%s=r.%s()", ref, type);
        gen
                ("break");
    // Unknown fields
    } gen
            ("default:")
                ("r.skipType(t&7)")
                ("break")

        ("}")
    ("}");

    // Field presence
    for (i = 0; i < mtype._fieldsArray.length; ++i) {
        var rfield = mtype._fieldsArray[i];
        if (rfield.required) gen
    ("if(!m.hasOwnProperty(%j))", rfield.name)
        ("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
    }

    return gen
    ("return m");
    /* eslint-enable no-unexpected-multiline */
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = verifier;

var Enum      = __webpack_require__(3),
    util      = __webpack_require__(1);

function invalid(field, expected) {
    return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:"+field.keyType+"}" : "") + " expected";
}

/**
 * Generates a partial value verifier.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genVerifyValue(gen, field, fieldIndex, ref) {
    /* eslint-disable no-unexpected-multiline */
    if (field.resolvedType) {
        if (field.resolvedType instanceof Enum) { gen
            ("switch(%s){", ref)
                ("default:")
                    ("return%j", invalid(field, "enum value"));
            for (var keys = Object.keys(field.resolvedType.values), j = 0; j < keys.length; ++j) gen
                ("case %i:", field.resolvedType.values[keys[j]]);
            gen
                    ("break")
            ("}");
        } else {
            gen
            ("{")
                ("var e=types[%i].verify(%s);", fieldIndex, ref)
                ("if(e)")
                    ("return%j+e", field.name + ".")
            ("}");
        }
    } else {
        switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32": gen
                ("if(!util.isInteger(%s))", ref)
                    ("return%j", invalid(field, "integer"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64": gen
                ("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)
                    ("return%j", invalid(field, "integer|Long"));
                break;
            case "float":
            case "double": gen
                ("if(typeof %s!==\"number\")", ref)
                    ("return%j", invalid(field, "number"));
                break;
            case "bool": gen
                ("if(typeof %s!==\"boolean\")", ref)
                    ("return%j", invalid(field, "boolean"));
                break;
            case "string": gen
                ("if(!util.isString(%s))", ref)
                    ("return%j", invalid(field, "string"));
                break;
            case "bytes": gen
                ("if(!(%s&&typeof %s.length===\"number\"||util.isString(%s)))", ref, ref, ref)
                    ("return%j", invalid(field, "buffer"));
                break;
        }
    }
    return gen;
    /* eslint-enable no-unexpected-multiline */
}

/**
 * Generates a partial key verifier.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genVerifyKey(gen, field, ref) {
    /* eslint-disable no-unexpected-multiline */
    switch (field.keyType) {
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32": gen
            ("if(!util.key32Re.test(%s))", ref)
                ("return%j", invalid(field, "integer key"));
            break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64": gen
            ("if(!util.key64Re.test(%s))", ref) // see comment above: x is ok, d is not
                ("return%j", invalid(field, "integer|Long key"));
            break;
        case "bool": gen
            ("if(!util.key2Re.test(%s))", ref)
                ("return%j", invalid(field, "boolean key"));
            break;
    }
    return gen;
    /* eslint-enable no-unexpected-multiline */
}

/**
 * Generates a verifier specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function verifier(mtype) {
    /* eslint-disable no-unexpected-multiline */

    var gen = util.codegen(["m"], mtype.name + "$verify")
    ("if(typeof m!==\"object\"||m===null)")
        ("return%j", "object expected");
    var oneofs = mtype.oneofsArray,
        seenFirstField = {};
    if (oneofs.length) gen
    ("var p={}");

    for (var i = 0; i < /* initializes */ mtype.fieldsArray.length; ++i) {
        var field = mtype._fieldsArray[i].resolve(),
            ref   = "m" + util.safeProp(field.name);

        if (field.optional) gen
        ("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name); // !== undefined && !== null

        // map fields
        if (field.map) { gen
            ("if(!util.isObject(%s))", ref)
                ("return%j", invalid(field, "object"))
            ("var k=Object.keys(%s)", ref)
            ("for(var i=0;i<k.length;++i){");
                genVerifyKey(gen, field, "k[i]");
                genVerifyValue(gen, field, i, ref + "[k[i]]")
            ("}");

        // repeated fields
        } else if (field.repeated) { gen
            ("if(!Array.isArray(%s))", ref)
                ("return%j", invalid(field, "array"))
            ("for(var i=0;i<%s.length;++i){", ref);
                genVerifyValue(gen, field, i, ref + "[i]")
            ("}");

        // required or present fields
        } else {
            if (field.partOf) {
                var oneofProp = util.safeProp(field.partOf.name);
                if (seenFirstField[field.partOf.name] === 1) gen
            ("if(p%s===1)", oneofProp)
                ("return%j", field.partOf.name + ": multiple values");
                seenFirstField[field.partOf.name] = 1;
                gen
            ("p%s=1", oneofProp);
            }
            genVerifyValue(gen, field, i, ref);
        }
        if (field.optional) gen
        ("}");
    }
    return gen
    ("return null");
    /* eslint-enable no-unexpected-multiline */
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Runtime message from/to plain object converters.
 * @namespace
 */
var converter = exports;

var Enum = __webpack_require__(3),
    util = __webpack_require__(1);

/**
 * Generates a partial value fromObject conveter.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} prop Property reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    if (field.resolvedType) {
        if (field.resolvedType instanceof Enum) { gen
            ("switch(d%s){", prop);
            for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
                if (field.repeated && values[keys[i]] === field.typeDefault) gen
                ("default:");
                gen
                ("case%j:", keys[i])
                ("case %i:", values[keys[i]])
                    ("m%s=%j", prop, values[keys[i]])
                    ("break");
            } gen
            ("}");
        } else gen
            ("if(typeof d%s!==\"object\")", prop)
                ("throw TypeError(%j)", field.fullName + ": object expected")
            ("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
    } else {
        var isUnsigned = false;
        switch (field.type) {
            case "double":
            case "float": gen
                ("m%s=Number(d%s)", prop, prop); // also catches "NaN", "Infinity"
                break;
            case "uint32":
            case "fixed32": gen
                ("m%s=d%s>>>0", prop, prop);
                break;
            case "int32":
            case "sint32":
            case "sfixed32": gen
                ("m%s=d%s|0", prop, prop);
                break;
            case "uint64":
                isUnsigned = true;
                // eslint-disable-line no-fallthrough
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64": gen
                ("if(util.Long)")
                    ("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)
                ("else if(typeof d%s===\"string\")", prop)
                    ("m%s=parseInt(d%s,10)", prop, prop)
                ("else if(typeof d%s===\"number\")", prop)
                    ("m%s=d%s", prop, prop)
                ("else if(typeof d%s===\"object\")", prop)
                    ("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
                break;
            case "bytes": gen
                ("if(typeof d%s===\"string\")", prop)
                    ("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)
                ("else if(d%s.length)", prop)
                    ("m%s=d%s", prop, prop);
                break;
            case "string": gen
                ("m%s=String(d%s)", prop, prop);
                break;
            case "bool": gen
                ("m%s=Boolean(d%s)", prop, prop);
                break;
            /* default: gen
                ("m%s=d%s", prop, prop);
                break; */
        }
    }
    return gen;
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
}

/**
 * Generates a plain object to runtime message converter specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
converter.fromObject = function fromObject(mtype) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    var fields = mtype.fieldsArray;
    var gen = util.codegen(["d"], mtype.name + "$fromObject")
    ("if(d instanceof this.ctor)")
        ("return d");
    if (!fields.length) return gen
    ("return new this.ctor");
    gen
    ("var m=new this.ctor");
    for (var i = 0; i < fields.length; ++i) {
        var field  = fields[i].resolve(),
            prop   = util.safeProp(field.name);

        // Map fields
        if (field.map) { gen
    ("if(d%s){", prop)
        ("if(typeof d%s!==\"object\")", prop)
            ("throw TypeError(%j)", field.fullName + ": object expected")
        ("m%s={}", prop)
        ("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
            genValuePartial_fromObject(gen, field, /* not sorted */ i, prop + "[ks[i]]")
        ("}")
    ("}");

        // Repeated fields
        } else if (field.repeated) { gen
    ("if(d%s){", prop)
        ("if(!Array.isArray(d%s))", prop)
            ("throw TypeError(%j)", field.fullName + ": array expected")
        ("m%s=[]", prop)
        ("for(var i=0;i<d%s.length;++i){", prop);
            genValuePartial_fromObject(gen, field, /* not sorted */ i, prop + "[i]")
        ("}")
    ("}");

        // Non-repeated fields
        } else {
            if (!(field.resolvedType instanceof Enum)) gen // no need to test for null/undefined if an enum (uses switch)
    ("if(d%s!=null){", prop); // !== undefined && !== null
        genValuePartial_fromObject(gen, field, /* not sorted */ i, prop);
            if (!(field.resolvedType instanceof Enum)) gen
    ("}");
        }
    } return gen
    ("return m");
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
};

/**
 * Generates a partial value toObject converter.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} prop Property reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genValuePartial_toObject(gen, field, fieldIndex, prop) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    if (field.resolvedType) {
        if (field.resolvedType instanceof Enum) gen
            ("d%s=o.enums===String?types[%i].values[m%s]:m%s", prop, fieldIndex, prop, prop);
        else gen
            ("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
    } else {
        var isUnsigned = false;
        switch (field.type) {
            case "double":
            case "float": gen
            ("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
                break;
            case "uint64":
                isUnsigned = true;
                // eslint-disable-line no-fallthrough
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64": gen
            ("if(typeof m%s===\"number\")", prop)
                ("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)
            ("else") // Long-like
                ("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true": "", prop);
                break;
            case "bytes": gen
            ("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
                break;
            default: gen
            ("d%s=m%s", prop, prop);
                break;
        }
    }
    return gen;
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
}

/**
 * Generates a runtime message to plain object converter specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
converter.toObject = function toObject(mtype) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
    if (!fields.length)
        return util.codegen()("return {}");
    var gen = util.codegen(["m", "o"], mtype.name + "$toObject")
    ("if(!o)")
        ("o={}")
    ("var d={}");

    var repeatedFields = [],
        mapFields = [],
        normalFields = [],
        i = 0;
    for (; i < fields.length; ++i)
        if (!fields[i].partOf)
            ( fields[i].resolve().repeated ? repeatedFields
            : fields[i].map ? mapFields
            : normalFields).push(fields[i]);

    if (repeatedFields.length) { gen
    ("if(o.arrays||o.defaults){");
        for (i = 0; i < repeatedFields.length; ++i) gen
        ("d%s=[]", util.safeProp(repeatedFields[i].name));
        gen
    ("}");
    }

    if (mapFields.length) { gen
    ("if(o.objects||o.defaults){");
        for (i = 0; i < mapFields.length; ++i) gen
        ("d%s={}", util.safeProp(mapFields[i].name));
        gen
    ("}");
    }

    if (normalFields.length) { gen
    ("if(o.defaults){");
        for (i = 0; i < normalFields.length; ++i) {
            var field = normalFields[i],
                prop  = util.safeProp(field.name);
            if (field.resolvedType instanceof Enum) gen
        ("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
            else if (field.long) gen
        ("if(util.Long){")
            ("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)
            ("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)
        ("}else")
            ("d%s=o.longs===String?%j:%i", prop, field.typeDefault.toString(), field.typeDefault.toNumber());
            else if (field.bytes) {
                var arrayDefault = "[" + Array.prototype.slice.call(field.typeDefault).join(",") + "]";
                gen
        ("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field.typeDefault))
        ("else{")
            ("d%s=%s", prop, arrayDefault)
            ("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)
        ("}");
            } else gen
        ("d%s=%j", prop, field.typeDefault); // also messages (=null)
        } gen
    ("}");
    }
    var hasKs2 = false;
    for (i = 0; i < fields.length; ++i) {
        var field = fields[i],
            index = mtype._fieldsArray.indexOf(field),
            prop  = util.safeProp(field.name);
        if (field.map) {
            if (!hasKs2) { hasKs2 = true; gen
    ("var ks2");
            } gen
    ("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)
        ("d%s={}", prop)
        ("for(var j=0;j<ks2.length;++j){");
            genValuePartial_toObject(gen, field, /* sorted */ index, prop + "[ks2[j]]")
        ("}");
        } else if (field.repeated) { gen
    ("if(m%s&&m%s.length){", prop, prop)
        ("d%s=[]", prop)
        ("for(var j=0;j<m%s.length;++j){", prop);
            genValuePartial_toObject(gen, field, /* sorted */ index, prop + "[j]")
        ("}");
        } else { gen
    ("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name); // !== undefined && !== null
        genValuePartial_toObject(gen, field, /* sorted */ index, prop);
        if (field.partOf) gen
        ("if(o.oneofs)")
            ("d%s=%j", util.safeProp(field.partOf.name), field.name);
        }
        gen
    ("}");
    }
    return gen
    ("return d");
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Wrappers for common types.
 * @type {Object.<string,IWrapper>}
 * @const
 */
var wrappers = exports;

var Message = __webpack_require__(12);

/**
 * From object converter part of an {@link IWrapper}.
 * @typedef WrapperFromObjectConverter
 * @type {function}
 * @param {Object.<string,*>} object Plain object
 * @returns {Message<{}>} Message instance
 * @this Type
 */

/**
 * To object converter part of an {@link IWrapper}.
 * @typedef WrapperToObjectConverter
 * @type {function}
 * @param {Message<{}>} message Message instance
 * @param {IConversionOptions} [options] Conversion options
 * @returns {Object.<string,*>} Plain object
 * @this Type
 */

/**
 * Common type wrapper part of {@link wrappers}.
 * @interface IWrapper
 * @property {WrapperFromObjectConverter} [fromObject] From object converter
 * @property {WrapperToObjectConverter} [toObject] To object converter
 */

// Custom wrapper for Any
wrappers[".google.protobuf.Any"] = {

    fromObject: function(object) {

        // unwrap value type if mapped
        if (object && object["@type"]) {
            var type = this.lookup(object["@type"]);
            /* istanbul ignore else */
            if (type) {
                // type_url does not accept leading "."
                var type_url = object["@type"].charAt(0) === "." ?
                    object["@type"].substr(1) : object["@type"];
                // type_url prefix is optional, but path seperator is required
                return this.create({
                    type_url: "/" + type_url,
                    value: type.encode(type.fromObject(object)).finish()
                });
            }
        }

        return this.fromObject(object);
    },

    toObject: function(message, options) {

        // decode value if requested and unmapped
        if (options && options.json && message.type_url && message.value) {
            // Only use fully qualified type name after the last '/'
            var name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
            var type = this.lookup(name);
            /* istanbul ignore else */
            if (type)
                message = type.decode(message.value);
        }

        // wrap value if unmapped
        if (!(message instanceof this.ctor) && message instanceof Message) {
            var object = message.$type.toObject(message, options);
            object["@type"] = message.$type.fullName;
            return object;
        }

        return this.toObject(message, options);
    }
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Root;

// extends Namespace
var Namespace = __webpack_require__(7);
((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";

var Field   = __webpack_require__(6),
    Enum    = __webpack_require__(3),
    OneOf   = __webpack_require__(11),
    util    = __webpack_require__(1);

var Type,   // cyclic
    parse,  // might be excluded
    common; // "

/**
 * Constructs a new root namespace instance.
 * @classdesc Root namespace wrapping all types, enums, services, sub-namespaces etc. that belong together.
 * @extends NamespaceBase
 * @constructor
 * @param {Object.<string,*>} [options] Top level options
 */
function Root(options) {
    Namespace.call(this, "", options);

    /**
     * Deferred extension fields.
     * @type {Field[]}
     */
    this.deferred = [];

    /**
     * Resolved file names of loaded files.
     * @type {string[]}
     */
    this.files = [];
}

/**
 * Loads a namespace descriptor into a root namespace.
 * @param {INamespace} json Nameespace descriptor
 * @param {Root} [root] Root namespace, defaults to create a new one if omitted
 * @returns {Root} Root namespace
 */
Root.fromJSON = function fromJSON(json, root) {
    if (!root)
        root = new Root();
    if (json.options)
        root.setOptions(json.options);
    return root.addJSON(json.nested);
};

/**
 * Resolves the path of an imported file, relative to the importing origin.
 * This method exists so you can override it with your own logic in case your imports are scattered over multiple directories.
 * @function
 * @param {string} origin The file name of the importing file
 * @param {string} target The file name being imported
 * @returns {string|null} Resolved path to `target` or `null` to skip the file
 */
Root.prototype.resolvePath = util.path.resolve;

// A symbol-like function to safely signal synchronous loading
/* istanbul ignore next */
function SYNC() {} // eslint-disable-line no-empty-function

/**
 * Loads one or multiple .proto or preprocessed .json files into this root namespace and calls the callback.
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {IParseOptions} options Parse options
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 */
Root.prototype.load = function load(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    var self = this;
    if (!callback)
        return util.asPromise(load, self, filename, options);

    var sync = callback === SYNC; // undocumented

    // Finishes loading by calling the callback (exactly once)
    function finish(err, root) {
        /* istanbul ignore if */
        if (!callback)
            return;
        var cb = callback;
        callback = null;
        if (sync)
            throw err;
        cb(err, root);
    }

    // Processes a single file
    function process(filename, source) {
        try {
            if (util.isString(source) && source.charAt(0) === "{")
                source = JSON.parse(source);
            if (!util.isString(source))
                self.setOptions(source.options).addJSON(source.nested);
            else {
                parse.filename = filename;
                var parsed = parse(source, self, options),
                    resolved,
                    i = 0;
                if (parsed.imports)
                    for (; i < parsed.imports.length; ++i)
                        if (resolved = self.resolvePath(filename, parsed.imports[i]))
                            fetch(resolved);
                if (parsed.weakImports)
                    for (i = 0; i < parsed.weakImports.length; ++i)
                        if (resolved = self.resolvePath(filename, parsed.weakImports[i]))
                            fetch(resolved, true);
            }
        } catch (err) {
            finish(err);
        }
        if (!sync && !queued)
            finish(null, self); // only once anyway
    }

    // Fetches a single file
    function fetch(filename, weak) {

        // Strip path if this file references a bundled definition
        var idx = filename.lastIndexOf("google/protobuf/");
        if (idx > -1) {
            var altname = filename.substring(idx);
            if (altname in common)
                filename = altname;
        }

        // Skip if already loaded / attempted
        if (self.files.indexOf(filename) > -1)
            return;
        self.files.push(filename);

        // Shortcut bundled definitions
        if (filename in common) {
            if (sync)
                process(filename, common[filename]);
            else {
                ++queued;
                setTimeout(function() {
                    --queued;
                    process(filename, common[filename]);
                });
            }
            return;
        }

        // Otherwise fetch from disk or network
        if (sync) {
            var source;
            try {
                source = util.fs.readFileSync(filename).toString("utf8");
            } catch (err) {
                if (!weak)
                    finish(err);
                return;
            }
            process(filename, source);
        } else {
            ++queued;
            util.fetch(filename, function(err, source) {
                --queued;
                /* istanbul ignore if */
                if (!callback)
                    return; // terminated meanwhile
                if (err) {
                    /* istanbul ignore else */
                    if (!weak)
                        finish(err);
                    else if (!queued) // can't be covered reliably
                        finish(null, self);
                    return;
                }
                process(filename, source);
            });
        }
    }
    var queued = 0;

    // Assembling the root namespace doesn't require working type
    // references anymore, so we can load everything in parallel
    if (util.isString(filename))
        filename = [ filename ];
    for (var i = 0, resolved; i < filename.length; ++i)
        if (resolved = self.resolvePath("", filename[i]))
            fetch(resolved);

    if (sync)
        return self;
    if (!queued)
        finish(null, self);
    return undefined;
};
// function load(filename:string, options:IParseOptions, callback:LoadCallback):undefined

/**
 * Loads one or multiple .proto or preprocessed .json files into this root namespace and calls the callback.
 * @function Root#load
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 * @variation 2
 */
// function load(filename:string, callback:LoadCallback):undefined

/**
 * Loads one or multiple .proto or preprocessed .json files into this root namespace and returns a promise.
 * @function Root#load
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {IParseOptions} [options] Parse options. Defaults to {@link parse.defaults} when omitted.
 * @returns {Promise<Root>} Promise
 * @variation 3
 */
// function load(filename:string, [options:IParseOptions]):Promise<Root>

/**
 * Synchronously loads one or multiple .proto or preprocessed .json files into this root namespace (node only).
 * @function Root#loadSync
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {IParseOptions} [options] Parse options. Defaults to {@link parse.defaults} when omitted.
 * @returns {Root} Root namespace
 * @throws {Error} If synchronous fetching is not supported (i.e. in browsers) or if a file's syntax is invalid
 */
Root.prototype.loadSync = function loadSync(filename, options) {
    if (!util.isNode)
        throw Error("not supported");
    return this.load(filename, options, SYNC);
};

/**
 * @override
 */
Root.prototype.resolveAll = function resolveAll() {
    if (this.deferred.length)
        throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
            return "'extend " + field.extend + "' in " + field.parent.fullName;
        }).join(", "));
    return Namespace.prototype.resolveAll.call(this);
};

// only uppercased (and thus conflict-free) children are exposed, see below
var exposeRe = /^[A-Z]/;

/**
 * Handles a deferred declaring extension field by creating a sister field to represent it within its extended type.
 * @param {Root} root Root instance
 * @param {Field} field Declaring extension field witin the declaring type
 * @returns {boolean} `true` if successfully added to the extended type, `false` otherwise
 * @inner
 * @ignore
 */
function tryHandleExtension(root, field) {
    var extendedType = field.parent.lookup(field.extend);
    if (extendedType) {
        var sisterField = new Field(field.fullName, field.id, field.type, field.rule, undefined, field.options);
        sisterField.declaringField = field;
        field.extensionField = sisterField;
        extendedType.add(sisterField);
        return true;
    }
    return false;
}

/**
 * Called when any object is added to this root or its sub-namespaces.
 * @param {ReflectionObject} object Object added
 * @returns {undefined}
 * @private
 */
Root.prototype._handleAdd = function _handleAdd(object) {
    if (object instanceof Field) {

        if (/* an extension field (implies not part of a oneof) */ object.extend !== undefined && /* not already handled */ !object.extensionField)
            if (!tryHandleExtension(this, object))
                this.deferred.push(object);

    } else if (object instanceof Enum) {

        if (exposeRe.test(object.name))
            object.parent[object.name] = object.values; // expose enum values as property of its parent

    } else if (!(object instanceof OneOf)) /* everything else is a namespace */ {

        if (object instanceof Type) // Try to handle any deferred extensions
            for (var i = 0; i < this.deferred.length;)
                if (tryHandleExtension(this, this.deferred[i]))
                    this.deferred.splice(i, 1);
                else
                    ++i;
        for (var j = 0; j < /* initializes */ object.nestedArray.length; ++j) // recurse into the namespace
            this._handleAdd(object._nestedArray[j]);
        if (exposeRe.test(object.name))
            object.parent[object.name] = object; // expose namespace as property of its parent
    }

    // The above also adds uppercased (and thus conflict-free) nested types, services and enums as
    // properties of namespaces just like static code does. This allows using a .d.ts generated for
    // a static module with reflection-based solutions where the condition is met.
};

/**
 * Called when any object is removed from this root or its sub-namespaces.
 * @param {ReflectionObject} object Object removed
 * @returns {undefined}
 * @private
 */
Root.prototype._handleRemove = function _handleRemove(object) {
    if (object instanceof Field) {

        if (/* an extension field */ object.extend !== undefined) {
            if (/* already handled */ object.extensionField) { // remove its sister field
                object.extensionField.parent.remove(object.extensionField);
                object.extensionField = null;
            } else { // cancel the extension
                var index = this.deferred.indexOf(object);
                /* istanbul ignore else */
                if (index > -1)
                    this.deferred.splice(index, 1);
            }
        }

    } else if (object instanceof Enum) {

        if (exposeRe.test(object.name))
            delete object.parent[object.name]; // unexpose enum values

    } else if (object instanceof Namespace) {

        for (var i = 0; i < /* initializes */ object.nestedArray.length; ++i) // recurse into the namespace
            this._handleRemove(object._nestedArray[i]);

        if (exposeRe.test(object.name))
            delete object.parent[object.name]; // unexpose namespaces

    }
};

// Sets up cyclic dependencies (called in index-light)
Root._configure = function(Type_, parse_, common_) {
    Type   = Type_;
    parse  = parse_;
    common = common_;
};


/***/ }),
/* 27 */
/***/ (function(module) {

module.exports = JSON.parse("{\"nested\":{\"com\":{\"nested\":{\"convergencelabs\":{\"nested\":{\"convergence\":{\"nested\":{\"proto\":{\"nested\":{\"ConvergenceMessage\":{\"oneofs\":{\"body\":{\"oneof\":[\"ok\",\"error\",\"ping\",\"pong\",\"handshakeRequest\",\"handshakeResponse\",\"authenticationRequest\",\"authenticationResponse\",\"getClientPermissionsRequest\",\"getClientPermissionsResponse\",\"addPermissionsRequest\",\"addPermissionsResponse\",\"removePermissionsRequest\",\"removePermissionsResponse\",\"setPermissionsRequest\",\"setPermissionsResponse\",\"getWorldPermissionsRequest\",\"getWorldPermissionsResponse\",\"getAllUserPermissionsRequest\",\"getAllUserPermissionsResponse\",\"getUserPermissionsRequest\",\"getUserPermissionsResponse\",\"getAllGroupPermissionsRequest\",\"getAllGroupPermissionsResponse\",\"getGroupPermissionsRequest\",\"getGroupPermissionsResponse\",\"openRealTimeModelRequest\",\"openRealTimeModelResponse\",\"closeRealTimeModelRequest\",\"closeRealTimeModelResponse\",\"createRealTimeModelRequest\",\"createRealTimeModelResponse\",\"deleteRealtimeModelRequest\",\"deleteRealtimeModelResponse\",\"forceCloseRealTimeModel\",\"remoteClientOpenedModel\",\"remoteClientClosedModel\",\"modelAutoCreateConfigRequest\",\"modelAutoCreateConfigResponse\",\"remoteOperation\",\"operationSubmission\",\"operationAck\",\"shareReference\",\"setReference\",\"clearReference\",\"unshareReference\",\"referenceShared\",\"referenceSet\",\"referenceCleared\",\"referenceUnshared\",\"modelsQueryRequest\",\"modelsQueryResponse\",\"getModelPermissionsRequest\",\"getModelPermissionsResponse\",\"setModelPermissionsRequest\",\"setModelPermissionsResponse\",\"modelPermissionsChanged\",\"modelResyncRequest\",\"modelResyncResponse\",\"modelResyncCompleteRequest\",\"modelResyncCompleteResponse\",\"remoteClientResyncStarted\",\"remoteClientResyncCompleted\",\"modelOfflineSubscriptionChange\",\"modelOfflineUpdated\",\"historicalDataRequest\",\"historicalDataResponse\",\"historicalOperationsRequest\",\"historicalOperationsResponse\",\"identityCacheUpdate\",\"usersGetRequest\",\"userSearchRequest\",\"userListResponse\",\"userGroupsRequest\",\"userGroupsResponse\",\"userGroupsForUsersRequest\",\"userGroupsForUsersResponse\",\"activityParticipantsRequest\",\"activityParticipantsResponse\",\"activityJoinRequest\",\"activityJoinResponse\",\"activityLeaveRequest\",\"activitySessionJoined\",\"activitySessionLeft\",\"activityUpdateState\",\"activityStateUpdated\",\"presenceSetState\",\"presenceRemoveState\",\"presenceClearState\",\"presenceStateSet\",\"presenceStateRemoved\",\"presenceStateCleared\",\"presenceAvailabilityChanged\",\"presenceRequest\",\"presenceResponse\",\"presenceSubscribeRequest\",\"presenceSubscribeResponse\",\"presenceUnsubscribe\",\"createChatRequest\",\"createChatResponse\",\"removeChatRequest\",\"removeChatResponse\",\"chatRemoved\",\"getChatsRequest\",\"getChatsResponse\",\"chatsExistRequest\",\"chatsExistResponse\",\"getDirectChatsRequest\",\"getDirectChatsResponse\",\"getJoinedChatsRequest\",\"getJoinedChatsResponse\",\"joinChatRequest\",\"joinChatResponse\",\"userJoinedChat\",\"leaveChatRequest\",\"leaveChatResponse\",\"userLeftChat\",\"addUserToChatChannelRequest\",\"addUserToChatChannelResponse\",\"userAddedToChatChannel\",\"removeUserFromChatChannelRequest\",\"removeUserFromChatChannelResponse\",\"userRemovedFromChatChannel\",\"setChatNameRequest\",\"setChatNameResponse\",\"chatNameChanged\",\"setChatTopicRequest\",\"setChatTopicResponse\",\"chatTopicChanged\",\"markChatEventsSeenRequest\",\"markChatEventsSeenResponse\",\"chatEventsMarkedSeen\",\"publishChatMessageRequest\",\"publishChatMessageResponse\",\"remoteChatMessage\",\"getChatHistoryRequest\",\"getChatHistoryResponse\"]}},\"fields\":{\"requestId\":{\"type\":\"google.protobuf.Int32Value\",\"id\":1},\"responseId\":{\"type\":\"google.protobuf.Int32Value\",\"id\":2},\"ok\":{\"type\":\"core.OkResponse\",\"id\":3},\"error\":{\"type\":\"core.ErrorMessage\",\"id\":4},\"ping\":{\"type\":\"core.PingMessage\",\"id\":5},\"pong\":{\"type\":\"core.PongMessage\",\"id\":6},\"handshakeRequest\":{\"type\":\"core.HandshakeRequestMessage\",\"id\":7},\"handshakeResponse\":{\"type\":\"core.HandshakeResponseMessage\",\"id\":8},\"authenticationRequest\":{\"type\":\"core.AuthenticationRequestMessage\",\"id\":9},\"authenticationResponse\":{\"type\":\"core.AuthenticationResponseMessage\",\"id\":10},\"getClientPermissionsRequest\":{\"type\":\"core.GetClientPermissionsRequestMessage\",\"id\":601},\"getClientPermissionsResponse\":{\"type\":\"core.GetClientPermissionsResponseMessage\",\"id\":602},\"addPermissionsRequest\":{\"type\":\"core.AddPermissionsRequestMessage\",\"id\":603},\"addPermissionsResponse\":{\"type\":\"core.AddPermissionsResponseMessage\",\"id\":604},\"removePermissionsRequest\":{\"type\":\"core.RemovePermissionsRequestMessage\",\"id\":605},\"removePermissionsResponse\":{\"type\":\"core.RemovePermissionsResponseMessage\",\"id\":606},\"setPermissionsRequest\":{\"type\":\"core.SetPermissionsRequestMessage\",\"id\":607},\"setPermissionsResponse\":{\"type\":\"core.SetPermissionsResponseMessage\",\"id\":608},\"getWorldPermissionsRequest\":{\"type\":\"core.GetWorldPermissionsRequestMessage\",\"id\":609},\"getWorldPermissionsResponse\":{\"type\":\"core.GetWorldPermissionsResponseMessage\",\"id\":610},\"getAllUserPermissionsRequest\":{\"type\":\"core.GetAllUserPermissionsRequestMessage\",\"id\":611},\"getAllUserPermissionsResponse\":{\"type\":\"core.GetAllUserPermissionsResponseMessage\",\"id\":612},\"getUserPermissionsRequest\":{\"type\":\"core.GetUserPermissionsRequestMessage\",\"id\":613},\"getUserPermissionsResponse\":{\"type\":\"core.GetUserPermissionsResponseMessage\",\"id\":614},\"getAllGroupPermissionsRequest\":{\"type\":\"core.GetAllGroupPermissionsRequestMessage\",\"id\":615},\"getAllGroupPermissionsResponse\":{\"type\":\"core.GetAllGroupPermissionsResponseMessage\",\"id\":616},\"getGroupPermissionsRequest\":{\"type\":\"core.GetGroupPermissionsRequestMessage\",\"id\":617},\"getGroupPermissionsResponse\":{\"type\":\"core.GetGroupPermissionsResponseMessage\",\"id\":618},\"openRealTimeModelRequest\":{\"type\":\"model.OpenRealtimeModelRequestMessage\",\"id\":100},\"openRealTimeModelResponse\":{\"type\":\"model.OpenRealtimeModelResponseMessage\",\"id\":101},\"closeRealTimeModelRequest\":{\"type\":\"model.CloseRealtimeModelRequestMessage\",\"id\":102},\"closeRealTimeModelResponse\":{\"type\":\"model.CloseRealTimeModelResponseMessage\",\"id\":103},\"createRealTimeModelRequest\":{\"type\":\"model.CreateRealtimeModelRequestMessage\",\"id\":104},\"createRealTimeModelResponse\":{\"type\":\"model.CreateRealtimeModelResponseMessage\",\"id\":105},\"deleteRealtimeModelRequest\":{\"type\":\"model.DeleteRealtimeModelRequestMessage\",\"id\":106},\"deleteRealtimeModelResponse\":{\"type\":\"model.DeleteRealtimeModelResponseMessage\",\"id\":107},\"forceCloseRealTimeModel\":{\"type\":\"model.ModelForceCloseMessage\",\"id\":108},\"remoteClientOpenedModel\":{\"type\":\"model.RemoteClientOpenedMessage\",\"id\":109},\"remoteClientClosedModel\":{\"type\":\"model.RemoteClientClosedMessage\",\"id\":110},\"modelAutoCreateConfigRequest\":{\"type\":\"model.AutoCreateModelConfigRequestMessage\",\"id\":111},\"modelAutoCreateConfigResponse\":{\"type\":\"model.AutoCreateModelConfigResponseMessage\",\"id\":112},\"remoteOperation\":{\"type\":\"model.RemoteOperationMessage\",\"id\":113},\"operationSubmission\":{\"type\":\"model.OperationSubmissionMessage\",\"id\":114},\"operationAck\":{\"type\":\"model.OperationAcknowledgementMessage\",\"id\":115},\"shareReference\":{\"type\":\"model.ShareReferenceMessage\",\"id\":116},\"setReference\":{\"type\":\"model.SetReferenceMessage\",\"id\":117},\"clearReference\":{\"type\":\"model.ClearReferenceMessage\",\"id\":118},\"unshareReference\":{\"type\":\"model.UnshareReferenceMessage\",\"id\":119},\"referenceShared\":{\"type\":\"model.RemoteReferenceSharedMessage\",\"id\":120},\"referenceSet\":{\"type\":\"model.RemoteReferenceSetMessage\",\"id\":121},\"referenceCleared\":{\"type\":\"model.RemoteReferenceClearedMessage\",\"id\":122},\"referenceUnshared\":{\"type\":\"model.RemoteReferenceUnsharedMessage\",\"id\":123},\"modelsQueryRequest\":{\"type\":\"model.ModelsQueryRequestMessage\",\"id\":124},\"modelsQueryResponse\":{\"type\":\"model.ModelsQueryResponseMessage\",\"id\":125},\"getModelPermissionsRequest\":{\"type\":\"model.GetModelPermissionsRequestMessage\",\"id\":126},\"getModelPermissionsResponse\":{\"type\":\"model.GetModelPermissionsResponseMessage\",\"id\":127},\"setModelPermissionsRequest\":{\"type\":\"model.SetModelPermissionsRequestMessage\",\"id\":128},\"setModelPermissionsResponse\":{\"type\":\"model.SetModelPermissionsResponseMessage\",\"id\":129},\"modelPermissionsChanged\":{\"type\":\"model.ModelPermissionsChangedMessage\",\"id\":130},\"modelResyncRequest\":{\"type\":\"model.ModelResyncRequestMessage\",\"id\":131},\"modelResyncResponse\":{\"type\":\"model.ModelResyncResponseMessage\",\"id\":132},\"modelResyncCompleteRequest\":{\"type\":\"model.ModelResyncCompleteRequestMessage\",\"id\":133},\"modelResyncCompleteResponse\":{\"type\":\"model.ModelResyncCompleteResponseMessage\",\"id\":134},\"remoteClientResyncStarted\":{\"type\":\"model.RemoteClientResyncStartedMessage\",\"id\":135},\"remoteClientResyncCompleted\":{\"type\":\"model.RemoteClientResyncCompletedMessage\",\"id\":136},\"modelOfflineSubscriptionChange\":{\"type\":\"model.ModelOfflineSubscriptionChangeRequestMessage\",\"id\":137},\"modelOfflineUpdated\":{\"type\":\"model.OfflineModelUpdatedMessage\",\"id\":138},\"historicalDataRequest\":{\"type\":\"model.HistoricalDataRequestMessage\",\"id\":139},\"historicalDataResponse\":{\"type\":\"model.HistoricalDataResponseMessage\",\"id\":140},\"historicalOperationsRequest\":{\"type\":\"model.HistoricalOperationRequestMessage\",\"id\":141},\"historicalOperationsResponse\":{\"type\":\"model.HistoricalOperationsResponseMessage\",\"id\":142},\"identityCacheUpdate\":{\"type\":\"identity.IdentityCacheUpdateMessage\",\"id\":200},\"usersGetRequest\":{\"type\":\"identity.GetUsersMessage\",\"id\":201},\"userSearchRequest\":{\"type\":\"identity.UserSearchMessage\",\"id\":202},\"userListResponse\":{\"type\":\"identity.UserListMessage\",\"id\":203},\"userGroupsRequest\":{\"type\":\"identity.UserGroupsRequestMessage\",\"id\":204},\"userGroupsResponse\":{\"type\":\"identity.UserGroupsResponseMessage\",\"id\":205},\"userGroupsForUsersRequest\":{\"type\":\"identity.UserGroupsForUsersRequestMessage\",\"id\":206},\"userGroupsForUsersResponse\":{\"type\":\"identity.UserGroupsForUsersResponseMessage\",\"id\":207},\"activityParticipantsRequest\":{\"type\":\"activity.ActivityParticipantsRequestMessage\",\"id\":300},\"activityParticipantsResponse\":{\"type\":\"activity.ActivityParticipantsResponseMessage\",\"id\":301},\"activityJoinRequest\":{\"type\":\"activity.ActivityJoinRequestMessage\",\"id\":302},\"activityJoinResponse\":{\"type\":\"activity.ActivityJoinResponseMessage\",\"id\":303},\"activityLeaveRequest\":{\"type\":\"activity.ActivityLeaveMessage\",\"id\":304},\"activitySessionJoined\":{\"type\":\"activity.ActivitySessionJoinedMessage\",\"id\":306},\"activitySessionLeft\":{\"type\":\"activity.ActivitySessionLeftMessage\",\"id\":307},\"activityUpdateState\":{\"type\":\"activity.ActivityUpdateStateMessage\",\"id\":308},\"activityStateUpdated\":{\"type\":\"activity.ActivityStateUpdatedMessage\",\"id\":309},\"presenceSetState\":{\"type\":\"presence.PresenceSetStateMessage\",\"id\":400},\"presenceRemoveState\":{\"type\":\"presence.PresenceRemoveStateMessage\",\"id\":401},\"presenceClearState\":{\"type\":\"presence.PresenceClearStateMessage\",\"id\":402},\"presenceStateSet\":{\"type\":\"presence.PresenceStateSetMessage\",\"id\":403},\"presenceStateRemoved\":{\"type\":\"presence.PresenceStateRemovedMessage\",\"id\":404},\"presenceStateCleared\":{\"type\":\"presence.PresenceStateClearedMessage\",\"id\":405},\"presenceAvailabilityChanged\":{\"type\":\"presence.PresenceAvailabilityChangedMessage\",\"id\":406},\"presenceRequest\":{\"type\":\"presence.PresenceRequestMessage\",\"id\":407},\"presenceResponse\":{\"type\":\"presence.PresenceResponseMessage\",\"id\":408},\"presenceSubscribeRequest\":{\"type\":\"presence.SubscribePresenceRequestMessage\",\"id\":409},\"presenceSubscribeResponse\":{\"type\":\"presence.SubscribePresenceResponseMessage\",\"id\":410},\"presenceUnsubscribe\":{\"type\":\"presence.UnsubscribePresenceMessage\",\"id\":411},\"createChatRequest\":{\"type\":\"chat.CreateChatRequestMessage\",\"id\":500},\"createChatResponse\":{\"type\":\"chat.CreateChatResponseMessage\",\"id\":501},\"removeChatRequest\":{\"type\":\"chat.RemoveChatRequestMessage\",\"id\":502},\"removeChatResponse\":{\"type\":\"chat.RemoveChatResponseMessage\",\"id\":503},\"chatRemoved\":{\"type\":\"chat.ChatRemovedMessage\",\"id\":504},\"getChatsRequest\":{\"type\":\"chat.GetChatsRequestMessage\",\"id\":505},\"getChatsResponse\":{\"type\":\"chat.GetChatsResponseMessage\",\"id\":506},\"chatsExistRequest\":{\"type\":\"chat.ChatsExistRequestMessage\",\"id\":507},\"chatsExistResponse\":{\"type\":\"chat.ChatsExistResponseMessage\",\"id\":508},\"getDirectChatsRequest\":{\"type\":\"chat.GetDirectChatsRequestMessage\",\"id\":509},\"getDirectChatsResponse\":{\"type\":\"chat.GetDirectChatsResponseMessage\",\"id\":510},\"getJoinedChatsRequest\":{\"type\":\"chat.GetJoinedChatsRequestMessage\",\"id\":511},\"getJoinedChatsResponse\":{\"type\":\"chat.GetJoinedChatsResponseMessage\",\"id\":512},\"joinChatRequest\":{\"type\":\"chat.JoinChatRequestMessage\",\"id\":515},\"joinChatResponse\":{\"type\":\"chat.JoinChatResponseMessage\",\"id\":516},\"userJoinedChat\":{\"type\":\"chat.UserJoinedChatMessage\",\"id\":517},\"leaveChatRequest\":{\"type\":\"chat.LeaveChatRequestMessage\",\"id\":518},\"leaveChatResponse\":{\"type\":\"chat.LeaveChatResponseMessage\",\"id\":519},\"userLeftChat\":{\"type\":\"chat.UserLeftChatMessage\",\"id\":520},\"addUserToChatChannelRequest\":{\"type\":\"chat.AddUserToChatChannelRequestMessage\",\"id\":521},\"addUserToChatChannelResponse\":{\"type\":\"chat.AddUserToChatChannelResponseMessage\",\"id\":522},\"userAddedToChatChannel\":{\"type\":\"chat.UserAddedToChatChannelMessage\",\"id\":523},\"removeUserFromChatChannelRequest\":{\"type\":\"chat.RemoveUserFromChatChannelRequestMessage\",\"id\":524},\"removeUserFromChatChannelResponse\":{\"type\":\"chat.RemoveUserFromChatChannelResponseMessage\",\"id\":525},\"userRemovedFromChatChannel\":{\"type\":\"chat.UserRemovedFromChatChannelMessage\",\"id\":526},\"setChatNameRequest\":{\"type\":\"chat.SetChatNameRequestMessage\",\"id\":527},\"setChatNameResponse\":{\"type\":\"chat.SetChatNameResponseMessage\",\"id\":528},\"chatNameChanged\":{\"type\":\"chat.ChatNameSetMessage\",\"id\":529},\"setChatTopicRequest\":{\"type\":\"chat.SetChatTopicRequestMessage\",\"id\":530},\"setChatTopicResponse\":{\"type\":\"chat.SetChatTopicResponseMessage\",\"id\":531},\"chatTopicChanged\":{\"type\":\"chat.ChatTopicSetMessage\",\"id\":532},\"markChatEventsSeenRequest\":{\"type\":\"chat.MarkChatEventsSeenRequestMessage\",\"id\":533},\"markChatEventsSeenResponse\":{\"type\":\"chat.MarkChatEventsSeenResponseMessage\",\"id\":534},\"chatEventsMarkedSeen\":{\"type\":\"chat.ChatEventsMarkedSeenMessage\",\"id\":535},\"publishChatMessageRequest\":{\"type\":\"chat.PublishChatRequestMessage\",\"id\":536},\"publishChatMessageResponse\":{\"type\":\"chat.PublishChatResponseMessage\",\"id\":537},\"remoteChatMessage\":{\"type\":\"chat.RemoteChatMessageMessage\",\"id\":538},\"getChatHistoryRequest\":{\"type\":\"chat.ChatHistoryRequestMessage\",\"id\":539},\"getChatHistoryResponse\":{\"type\":\"chat.ChatHistoryResponseMessage\",\"id\":540}}},\"core\":{\"nested\":{\"AuthenticationRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"oneofs\":{\"auth\":{\"oneof\":[\"password\",\"jwt\",\"anonymous\",\"reconnect\"]}},\"fields\":{\"password\":{\"type\":\"PasswordAuthRequestData\",\"id\":1},\"jwt\":{\"type\":\"JwtAuthRequestData\",\"id\":2},\"anonymous\":{\"type\":\"AnonymousAuthRequestData\",\"id\":3},\"reconnect\":{\"type\":\"ReconnectTokenAuthRequestData\",\"id\":4}},\"nested\":{\"PasswordAuthRequestData\":{\"fields\":{\"username\":{\"type\":\"string\",\"id\":1},\"password\":{\"type\":\"string\",\"id\":2}}},\"JwtAuthRequestData\":{\"fields\":{\"jwt\":{\"type\":\"string\",\"id\":1}}},\"ReconnectTokenAuthRequestData\":{\"fields\":{\"token\":{\"type\":\"string\",\"id\":1}}},\"AnonymousAuthRequestData\":{\"fields\":{\"displayName\":{\"type\":\"google.protobuf.StringValue\",\"id\":1}}}}},\"AuthenticationResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"oneofs\":{\"response\":{\"oneof\":[\"success\",\"failure\"]}},\"fields\":{\"success\":{\"type\":\"AuthSuccessData\",\"id\":1},\"failure\":{\"type\":\"AuthFailureData\",\"id\":2}},\"nested\":{\"AuthSuccessData\":{\"fields\":{\"user\":{\"type\":\"DomainUserData\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2},\"reconnectToken\":{\"type\":\"string\",\"id\":3},\"presenceState\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":4}}},\"AuthFailureData\":{\"fields\":{\"message\":{\"type\":\"string\",\"id\":1}}}}},\"PingMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"PongMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"HandshakeRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"reconnect\":{\"type\":\"bool\",\"id\":1},\"reconnectToken\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"client\":{\"type\":\"string\",\"id\":3},\"clientVersion\":{\"type\":\"string\",\"id\":4}}},\"HandshakeResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"success\":{\"type\":\"bool\",\"id\":1},\"error\":{\"type\":\"ErrorData\",\"id\":2},\"retryOk\":{\"type\":\"bool\",\"id\":3},\"namespace\":{\"type\":\"string\",\"id\":4},\"id\":{\"type\":\"string\",\"id\":5},\"protocolConfig\":{\"type\":\"ProtocolConfigData\",\"id\":6}},\"nested\":{\"ErrorData\":{\"fields\":{\"code\":{\"type\":\"string\",\"id\":1},\"details\":{\"type\":\"string\",\"id\":2}}},\"ProtocolConfigData\":{\"fields\":{\"heartbeatEnabled\":{\"type\":\"bool\",\"id\":1}}}}},\"PermissionType\":{\"values\":{\"PERMISSION_TYPE_NOT_SET\":0,\"CHAT\":1}},\"UserPermissionsEntry\":{\"fields\":{\"user\":{\"type\":\"DomainUserIdData\",\"id\":1},\"permissions\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":2}}},\"PermissionsList\":{\"fields\":{\"values\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"AddPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2},\"world\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":3},\"user\":{\"rule\":\"repeated\",\"type\":\"UserPermissionsEntry\",\"id\":4},\"group\":{\"keyType\":\"string\",\"type\":\"PermissionsList\",\"id\":5}}},\"AddPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"RemovePermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2},\"world\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":3},\"user\":{\"rule\":\"repeated\",\"type\":\"UserPermissionsEntry\",\"id\":4},\"group\":{\"keyType\":\"string\",\"type\":\"PermissionsList\",\"id\":5}}},\"RemovePermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"SetPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2},\"world\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":3},\"user\":{\"rule\":\"repeated\",\"type\":\"UserPermissionsEntry\",\"id\":4},\"group\":{\"keyType\":\"string\",\"type\":\"PermissionsList\",\"id\":5}}},\"SetPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"GetClientPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2}}},\"GetClientPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"permissions\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"GetWorldPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2}}},\"GetWorldPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"permissions\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"GetAllUserPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2}}},\"GetAllUserPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"users\":{\"rule\":\"repeated\",\"type\":\"UserPermissionsEntry\",\"id\":1}}},\"GetAllGroupPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2}}},\"GetAllGroupPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"groups\":{\"keyType\":\"string\",\"type\":\"PermissionsList\",\"id\":1}}},\"GetUserPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2},\"user\":{\"type\":\"DomainUserIdData\",\"id\":3}}},\"GetUserPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"permissions\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"GetGroupPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"idType\":{\"type\":\"PermissionType\",\"id\":1},\"id\":{\"type\":\"string\",\"id\":2},\"groupId\":{\"type\":\"string\",\"id\":3}}},\"GetGroupPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"permissions\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"DomainUserTypeData\":{\"values\":{\"Normal\":0,\"Convergence\":1,\"Anonymous\":2}},\"DomainUserIdData\":{\"fields\":{\"userType\":{\"type\":\"DomainUserTypeData\",\"id\":1},\"username\":{\"type\":\"string\",\"id\":2}}},\"DomainUserIdList\":{\"fields\":{\"values\":{\"rule\":\"repeated\",\"type\":\"DomainUserIdData\",\"id\":1}}},\"DomainUserData\":{\"fields\":{\"userId\":{\"type\":\"DomainUserIdData\",\"id\":1},\"firstName\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"lastName\":{\"type\":\"google.protobuf.StringValue\",\"id\":3},\"displayName\":{\"type\":\"google.protobuf.StringValue\",\"id\":4},\"email\":{\"type\":\"google.protobuf.StringValue\",\"id\":5},\"disabled\":{\"type\":\"bool\",\"id\":6},\"deleted\":{\"type\":\"bool\",\"id\":7},\"deletedUsername\":{\"type\":\"google.protobuf.StringValue\",\"id\":8}}},\"ErrorMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"code\":{\"type\":\"string\",\"id\":1},\"message\":{\"type\":\"string\",\"id\":2},\"details\":{\"keyType\":\"string\",\"type\":\"string\",\"id\":3}}},\"OkResponse\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"StringList\":{\"fields\":{\"values\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"Int32List\":{\"fields\":{\"values\":{\"rule\":\"repeated\",\"type\":\"int32\",\"id\":1}}}}},\"activity\":{\"nested\":{\"ActivityJoinRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1},\"state\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":2}}},\"ActivityJoinResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"state\":{\"keyType\":\"string\",\"type\":\"ActivityStateData\",\"id\":1}}},\"ActivityLeaveMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1}}},\"ActivityParticipantsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1}}},\"ActivityParticipantsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"state\":{\"keyType\":\"string\",\"type\":\"ActivityStateData\",\"id\":1}}},\"ActivitySessionJoinedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2},\"state\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":3}}},\"ActivitySessionLeftMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2}}},\"ActivityUpdateStateMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1},\"set\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":2},\"complete\":{\"type\":\"bool\",\"id\":3},\"removed\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":4}}},\"ActivityStateUpdatedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"activityId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2},\"set\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":3},\"complete\":{\"type\":\"bool\",\"id\":4},\"removed\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":5}}},\"ActivityStateData\":{\"fields\":{\"state\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":1}}}}},\"chat\":{\"nested\":{\"PublishChatRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"message\":{\"type\":\"string\",\"id\":2}}},\"PublishChatResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"RemoteChatMessageMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"sessionId\":{\"type\":\"string\",\"id\":4},\"message\":{\"type\":\"string\",\"id\":5}}},\"CreateChatRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"google.protobuf.StringValue\",\"id\":1},\"chatType\":{\"type\":\"string\",\"id\":2},\"membership\":{\"type\":\"string\",\"id\":3},\"name\":{\"type\":\"string\",\"id\":4},\"topic\":{\"type\":\"string\",\"id\":5},\"members\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":6}}},\"CreateChatResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"RemoveChatRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"RemoveChatResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"ChatRemovedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"JoinChatRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"JoinChatResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatInfo\":{\"type\":\"ChatInfoData\",\"id\":1}}},\"UserJoinedChatMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4}}},\"AddUserToChatChannelRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"userToAdd\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":2}}},\"AddUserToChatChannelResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"UserAddedToChatChannelMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"addedUser\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":5}}},\"ChatJoinedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"LeaveChatRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"LeaveChatResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"UserLeftChatMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4}}},\"RemoveUserFromChatChannelRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"userToRemove\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":2}}},\"RemoveUserFromChatChannelResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"UserRemovedFromChatChannelMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"removedUser\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":5}}},\"ChatLeftMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1}}},\"SetChatNameRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"name\":{\"type\":\"string\",\"id\":2}}},\"SetChatNameResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"ChatNameSetMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"name\":{\"type\":\"string\",\"id\":5}}},\"SetChatTopicRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"topic\":{\"type\":\"string\",\"id\":2}}},\"SetChatTopicResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"ChatTopicSetMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"topic\":{\"type\":\"string\",\"id\":5}}},\"MarkChatEventsSeenRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2}}},\"MarkChatEventsSeenResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"ChatEventsMarkedSeenMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":2},\"eventNumber\":{\"type\":\"int64\",\"id\":3}}},\"GetJoinedChatsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{}},\"GetJoinedChatsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatInfo\":{\"rule\":\"repeated\",\"type\":\"ChatInfoData\",\"id\":1}}},\"GetChatsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatIds\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"GetChatsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatInfo\":{\"rule\":\"repeated\",\"type\":\"ChatInfoData\",\"id\":1}}},\"GetDirectChatsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"userLists\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdList\",\"id\":1}}},\"GetDirectChatsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"chatInfo\":{\"rule\":\"repeated\",\"type\":\"ChatInfoData\",\"id\":1}}},\"ChatHistoryRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"limit\":{\"type\":\"google.protobuf.Int32Value\",\"id\":2},\"startEvent\":{\"type\":\"google.protobuf.Int64Value\",\"id\":3},\"forward\":{\"type\":\"google.protobuf.BoolValue\",\"id\":4},\"eventFilter\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":5}}},\"ChatHistoryResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"eventData\":{\"rule\":\"repeated\",\"type\":\"ChatEventData\",\"id\":1}}},\"ChatsExistRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"chatIds\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"ChatsExistResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"exists\":{\"rule\":\"repeated\",\"type\":\"bool\",\"id\":1}}},\"ChatMemberData\":{\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"maxSeenEventNumber\":{\"type\":\"int64\",\"id\":2}}},\"ChatInfoData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"chatType\":{\"type\":\"string\",\"id\":2},\"membership\":{\"type\":\"string\",\"id\":3},\"name\":{\"type\":\"string\",\"id\":4},\"topic\":{\"type\":\"string\",\"id\":5},\"createdTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":6},\"lastEventTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":7},\"lastEventNumber\":{\"type\":\"int64\",\"id\":8},\"members\":{\"rule\":\"repeated\",\"type\":\"ChatMemberData\",\"id\":9}}},\"ChatCreatedEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"name\":{\"type\":\"string\",\"id\":5},\"topic\":{\"type\":\"string\",\"id\":6},\"members\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":7}}},\"ChatMessageEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"message\":{\"type\":\"string\",\"id\":5}}},\"ChatUserJoinedEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4}}},\"ChatUserLeftEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4}}},\"ChatUserAddedEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"addedUser\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":5}}},\"ChatUserRemovedEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"removedUser\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":5}}},\"ChatNameChangedEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"name\":{\"type\":\"string\",\"id\":5}}},\"ChatTopicChangedEventData\":{\"fields\":{\"chatId\":{\"type\":\"string\",\"id\":1},\"eventNumber\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":4},\"topic\":{\"type\":\"string\",\"id\":5}}},\"ChatEventData\":{\"oneofs\":{\"event\":{\"oneof\":[\"created\",\"message\",\"userJoined\",\"userLeft\",\"userAdded\",\"userRemoved\",\"nameChanged\",\"topicChanged\"]}},\"fields\":{\"created\":{\"type\":\"ChatCreatedEventData\",\"id\":1},\"message\":{\"type\":\"ChatMessageEventData\",\"id\":2},\"userJoined\":{\"type\":\"ChatUserJoinedEventData\",\"id\":3},\"userLeft\":{\"type\":\"ChatUserLeftEventData\",\"id\":4},\"userAdded\":{\"type\":\"ChatUserAddedEventData\",\"id\":5},\"userRemoved\":{\"type\":\"ChatUserRemovedEventData\",\"id\":6},\"nameChanged\":{\"type\":\"ChatNameChangedEventData\",\"id\":7},\"topicChanged\":{\"type\":\"ChatTopicChangedEventData\",\"id\":8}}}}},\"identity\":{\"nested\":{\"GetUsersMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"userIds\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1}}},\"UserSearchMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"fields\":{\"rule\":\"repeated\",\"type\":\"UserField\",\"id\":1},\"value\":{\"type\":\"string\",\"id\":2},\"offset\":{\"type\":\"google.protobuf.Int32Value\",\"id\":3},\"limit\":{\"type\":\"google.protobuf.Int32Value\",\"id\":4},\"orderField\":{\"type\":\"UserField\",\"id\":5},\"ascending\":{\"type\":\"bool\",\"id\":6}}},\"UserListMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"userData\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserData\",\"id\":1}}},\"UserGroupsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"ids\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"UserGroupsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"groupData\":{\"rule\":\"repeated\",\"type\":\"UserGroupData\",\"id\":1}}},\"UserGroupsForUsersRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"users\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1}}},\"UserGroupsForUsersResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"userGroups\":{\"rule\":\"repeated\",\"type\":\"UserGroupsEntry\",\"id\":1}}},\"IdentityCacheUpdateMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.IdentityMessage\"},\"fields\":{\"sessions\":{\"keyType\":\"string\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"users\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserData\",\"id\":2}}},\"UserField\":{\"values\":{\"FIELD_NOT_SET\":0,\"USERNAME\":1,\"EMAIL\":2,\"FIRST_NAME\":3,\"LAST_NAME\":4,\"DISPLAY_NAME\":5}},\"UserGroupData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"description\":{\"type\":\"string\",\"id\":2},\"members\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":3}}},\"UserGroupsEntry\":{\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"groups\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":2}}}}},\"model\":{\"nested\":{\"OpenRealtimeModelRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"google.protobuf.StringValue\",\"id\":1},\"autoCreateId\":{\"type\":\"google.protobuf.Int32Value\",\"id\":2}}},\"OpenRealtimeModelResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"modelId\":{\"type\":\"string\",\"id\":2},\"collection\":{\"type\":\"string\",\"id\":3},\"valueIdPrefix\":{\"type\":\"string\",\"id\":4},\"version\":{\"type\":\"int64\",\"id\":5},\"createdTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":6},\"modifiedTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":7},\"data\":{\"type\":\"ObjectValue\",\"id\":8},\"connectedClients\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":9},\"resyncingClients\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":10},\"references\":{\"rule\":\"repeated\",\"type\":\"ReferenceData\",\"id\":11},\"permissions\":{\"type\":\"ModelPermissionsData\",\"id\":12}}},\"CloseRealtimeModelRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1}}},\"CloseRealTimeModelResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"AutoCreateModelConfigRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"autoCreateId\":{\"type\":\"int32\",\"id\":1}}},\"AutoCreateModelConfigResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"collection\":{\"type\":\"string\",\"id\":1},\"data\":{\"type\":\"ObjectValue\",\"id\":2},\"overridePermissions\":{\"type\":\"bool\",\"id\":3},\"worldPermissions\":{\"type\":\"ModelPermissionsData\",\"id\":4},\"userPermissions\":{\"rule\":\"repeated\",\"type\":\"UserModelPermissionsData\",\"id\":5},\"ephemeral\":{\"type\":\"bool\",\"id\":6}}},\"RemoteClientClosedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2}}},\"RemoteClientOpenedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2}}},\"ModelForceCloseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"reason\":{\"type\":\"string\",\"id\":2},\"reasonCode\":{\"type\":\"int32\",\"id\":3}}},\"CreateRealtimeModelRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"collectionId\":{\"type\":\"string\",\"id\":1},\"modelId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"data\":{\"type\":\"ObjectValue\",\"id\":3},\"overrideWorldPermissions\":{\"type\":\"bool\",\"id\":4},\"worldPermissions\":{\"type\":\"ModelPermissionsData\",\"id\":5},\"userPermissions\":{\"rule\":\"repeated\",\"type\":\"UserModelPermissionsData\",\"id\":6}}},\"CreateRealtimeModelResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1}}},\"DeleteRealtimeModelRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1}}},\"DeleteRealtimeModelResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"ModelResyncRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1},\"contextVersion\":{\"type\":\"int64\",\"id\":2}}},\"ModelResyncResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"currentVersion\":{\"type\":\"int64\",\"id\":2},\"permissions\":{\"type\":\"ModelPermissionsData\",\"id\":3}}},\"ModelResyncCompleteRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"open\":{\"type\":\"bool\",\"id\":2}}},\"ModelResyncCompleteResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"connectedClients\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1},\"resyncingClients\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":2},\"references\":{\"rule\":\"repeated\",\"type\":\"ReferenceData\",\"id\":3}}},\"RemoteClientResyncStartedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2}}},\"RemoteClientResyncCompletedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2}}},\"GetModelPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1}}},\"GetModelPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"overridesCollection\":{\"type\":\"bool\",\"id\":1},\"worldPermissions\":{\"type\":\"ModelPermissionsData\",\"id\":2},\"userPermissions\":{\"rule\":\"repeated\",\"type\":\"UserModelPermissionsData\",\"id\":3}}},\"SetModelPermissionsRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1},\"overrideCollection\":{\"type\":\"google.protobuf.BoolValue\",\"id\":2},\"worldPermissions\":{\"type\":\"ModelPermissionsData\",\"id\":3},\"removeAllUserPermissionsBeforeSet\":{\"type\":\"bool\",\"id\":4},\"setUserPermissions\":{\"rule\":\"repeated\",\"type\":\"UserModelPermissionsData\",\"id\":5},\"removedUserPermissions\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":6}}},\"SetModelPermissionsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{}},\"ModelPermissionsChangedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"permissions\":{\"type\":\"ModelPermissionsData\",\"id\":2}}},\"ModelsQueryRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"query\":{\"type\":\"string\",\"id\":1}}},\"ModelsQueryResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"models\":{\"rule\":\"repeated\",\"type\":\"ModelResult\",\"id\":1},\"offset\":{\"type\":\"int64\",\"id\":2},\"totalResults\":{\"type\":\"int64\",\"id\":3}},\"nested\":{\"ModelResult\":{\"fields\":{\"collectionId\":{\"type\":\"string\",\"id\":1},\"modelId\":{\"type\":\"string\",\"id\":2},\"createdTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"modifiedTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":4},\"version\":{\"type\":\"int64\",\"id\":5},\"data\":{\"type\":\"google.protobuf.Struct\",\"id\":6}}}}},\"OperationSubmissionMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sequenceNumber\":{\"type\":\"int32\",\"id\":2},\"contextVersion\":{\"type\":\"int64\",\"id\":3},\"operation\":{\"type\":\"OperationData\",\"id\":4}}},\"OperationAcknowledgementMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sequenceNumber\":{\"type\":\"int32\",\"id\":2},\"version\":{\"type\":\"int64\",\"id\":3},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":4}}},\"RemoteOperationMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"sessionId\":{\"type\":\"string\",\"id\":2},\"contextVersion\":{\"type\":\"int64\",\"id\":3},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":4},\"operation\":{\"type\":\"OperationData\",\"id\":5}}},\"ShareReferenceMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"references\":{\"type\":\"ReferenceValues\",\"id\":4},\"version\":{\"type\":\"int64\",\"id\":5}}},\"RemoteReferenceSharedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"references\":{\"type\":\"ReferenceValues\",\"id\":4},\"sessionId\":{\"type\":\"string\",\"id\":5}}},\"UnshareReferenceMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3}}},\"RemoteReferenceUnsharedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"sessionId\":{\"type\":\"string\",\"id\":4}}},\"SetReferenceMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"references\":{\"type\":\"ReferenceValues\",\"id\":4},\"version\":{\"type\":\"int64\",\"id\":5}}},\"RemoteReferenceSetMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"references\":{\"type\":\"ReferenceValues\",\"id\":4},\"sessionId\":{\"type\":\"string\",\"id\":5}}},\"ClearReferenceMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3}}},\"RemoteReferenceClearedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"resourceId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"sessionId\":{\"type\":\"string\",\"id\":4}}},\"ModelOfflineSubscriptionChangeRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"subscribe\":{\"rule\":\"repeated\",\"type\":\"ModelOfflineSubscriptionData\",\"id\":1},\"unsubscribe\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":2},\"all\":{\"type\":\"bool\",\"id\":3}},\"nested\":{\"ModelOfflineSubscriptionData\":{\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1},\"currentVersion\":{\"type\":\"int64\",\"id\":2},\"currentPermissions\":{\"type\":\"ModelPermissionsData\",\"id\":3}}}}},\"OfflineModelUpdatedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"oneofs\":{\"action\":{\"oneof\":[\"deleted\",\"permissionRevoked\",\"updated\",\"initial\"]}},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1},\"deleted\":{\"type\":\"bool\",\"id\":2},\"permissionRevoked\":{\"type\":\"bool\",\"id\":3},\"updated\":{\"type\":\"OfflineModelUpdateData\",\"id\":4},\"initial\":{\"type\":\"OfflineModelInitialData\",\"id\":5}},\"nested\":{\"OfflineModelInitialData\":{\"fields\":{\"collection\":{\"type\":\"string\",\"id\":1},\"valueIdPrefix\":{\"type\":\"string\",\"id\":2},\"model\":{\"type\":\"ModelUpdateData\",\"id\":3},\"permissions\":{\"type\":\"ModelPermissionsData\",\"id\":4}}},\"OfflineModelUpdateData\":{\"fields\":{\"model\":{\"type\":\"ModelUpdateData\",\"id\":1},\"permissions\":{\"type\":\"ModelPermissionsData\",\"id\":2}}},\"ModelUpdateData\":{\"fields\":{\"version\":{\"type\":\"int64\",\"id\":1},\"createdTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":2},\"modifiedTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"data\":{\"type\":\"ObjectValue\",\"id\":4}}}}},\"HistoricalDataRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1}}},\"HistoricalDataResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"collectionId\":{\"type\":\"string\",\"id\":1},\"data\":{\"type\":\"ObjectValue\",\"id\":2},\"version\":{\"type\":\"int64\",\"id\":3},\"createdTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":4},\"modifiedTime\":{\"type\":\"google.protobuf.Timestamp\",\"id\":5}}},\"HistoricalOperationRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ClientMessage\"},\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1},\"first\":{\"type\":\"int64\",\"id\":2},\"last\":{\"type\":\"int64\",\"id\":3}}},\"HistoricalOperationsResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.ServerMessage\"},\"fields\":{\"operations\":{\"rule\":\"repeated\",\"type\":\"ModelOperationData\",\"id\":1}},\"nested\":{\"ModelOperationData\":{\"fields\":{\"modelId\":{\"type\":\"string\",\"id\":1},\"version\":{\"type\":\"int64\",\"id\":2},\"timestamp\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"sessionId\":{\"type\":\"string\",\"id\":4},\"operation\":{\"type\":\"AppliedOperationData\",\"id\":5}}}}},\"ObjectValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"children\":{\"keyType\":\"string\",\"type\":\"DataValue\",\"id\":2}}},\"ArrayValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"children\":{\"rule\":\"repeated\",\"type\":\"DataValue\",\"id\":2}}},\"BooleanValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"value\":{\"type\":\"bool\",\"id\":2}}},\"DoubleValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"value\":{\"type\":\"double\",\"id\":2}}},\"NullValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1}}},\"StringValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"value\":{\"type\":\"string\",\"id\":2}}},\"DateValue\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"value\":{\"type\":\"google.protobuf.Timestamp\",\"id\":2}}},\"DataValue\":{\"oneofs\":{\"value\":{\"oneof\":[\"objectValue\",\"arrayValue\",\"booleanValue\",\"doubleValue\",\"nullValue\",\"stringValue\",\"dateValue\"]}},\"fields\":{\"objectValue\":{\"type\":\"ObjectValue\",\"id\":1},\"arrayValue\":{\"type\":\"ArrayValue\",\"id\":2},\"booleanValue\":{\"type\":\"BooleanValue\",\"id\":3},\"doubleValue\":{\"type\":\"DoubleValue\",\"id\":4},\"nullValue\":{\"type\":\"NullValue\",\"id\":5},\"stringValue\":{\"type\":\"StringValue\",\"id\":6},\"dateValue\":{\"type\":\"DateValue\",\"id\":7}}},\"StringInsertOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"string\",\"id\":4}}},\"StringRemoveOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"string\",\"id\":4}}},\"StringSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"string\",\"id\":3}}},\"ArrayInsertOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4}}},\"ArrayRemoveOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3}}},\"ArrayReplaceOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4}}},\"ArrayMoveOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"fromIndex\":{\"type\":\"int32\",\"id\":3},\"toIndex\":{\"type\":\"int32\",\"id\":4}}},\"ArraySetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"values\":{\"rule\":\"repeated\",\"type\":\"DataValue\",\"id\":3}}},\"ObjectAddPropertyOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4}}},\"ObjectSetPropertyOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4}}},\"ObjectRemovePropertyOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3}}},\"ObjectSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"values\":{\"keyType\":\"string\",\"type\":\"DataValue\",\"id\":3}}},\"NumberDeltaOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"delta\":{\"type\":\"double\",\"id\":3}}},\"NumberSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"double\",\"id\":3}}},\"BooleanSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"bool\",\"id\":3}}},\"DateSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3}}},\"DiscreteOperationData\":{\"oneofs\":{\"operation\":{\"oneof\":[\"stringInsertOperation\",\"stringRemoveOperation\",\"stringSetOperation\",\"arrayInsertOperation\",\"arrayRemoveOperation\",\"arrayReplaceOperation\",\"arrayMoveOperation\",\"arraySetOperation\",\"objectAddPropertyOperation\",\"objectSetPropertyOperation\",\"objectRemovePropertyOperation\",\"objectSetOperation\",\"numberDeltaOperation\",\"numberSetOperation\",\"booleanSetOperation\",\"dateSetOperation\"]}},\"fields\":{\"stringInsertOperation\":{\"type\":\"StringInsertOperationData\",\"id\":1},\"stringRemoveOperation\":{\"type\":\"StringRemoveOperationData\",\"id\":2},\"stringSetOperation\":{\"type\":\"StringSetOperationData\",\"id\":3},\"arrayInsertOperation\":{\"type\":\"ArrayInsertOperationData\",\"id\":4},\"arrayRemoveOperation\":{\"type\":\"ArrayRemoveOperationData\",\"id\":5},\"arrayReplaceOperation\":{\"type\":\"ArrayReplaceOperationData\",\"id\":6},\"arrayMoveOperation\":{\"type\":\"ArrayMoveOperationData\",\"id\":7},\"arraySetOperation\":{\"type\":\"ArraySetOperationData\",\"id\":8},\"objectAddPropertyOperation\":{\"type\":\"ObjectAddPropertyOperationData\",\"id\":9},\"objectSetPropertyOperation\":{\"type\":\"ObjectSetPropertyOperationData\",\"id\":10},\"objectRemovePropertyOperation\":{\"type\":\"ObjectRemovePropertyOperationData\",\"id\":11},\"objectSetOperation\":{\"type\":\"ObjectSetOperationData\",\"id\":12},\"numberDeltaOperation\":{\"type\":\"NumberDeltaOperationData\",\"id\":13},\"numberSetOperation\":{\"type\":\"NumberSetOperationData\",\"id\":14},\"booleanSetOperation\":{\"type\":\"BooleanSetOperationData\",\"id\":15},\"dateSetOperation\":{\"type\":\"DateSetOperationData\",\"id\":16}}},\"CompoundOperationData\":{\"fields\":{\"operations\":{\"rule\":\"repeated\",\"type\":\"DiscreteOperationData\",\"id\":1}}},\"OperationData\":{\"oneofs\":{\"operation\":{\"oneof\":[\"discreteOperation\",\"compoundOperation\"]}},\"fields\":{\"discreteOperation\":{\"type\":\"DiscreteOperationData\",\"id\":1},\"compoundOperation\":{\"type\":\"CompoundOperationData\",\"id\":2}}},\"ModelPermissionsData\":{\"fields\":{\"read\":{\"type\":\"bool\",\"id\":1},\"write\":{\"type\":\"bool\",\"id\":2},\"remove\":{\"type\":\"bool\",\"id\":3},\"manage\":{\"type\":\"bool\",\"id\":4}}},\"UserModelPermissionsData\":{\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"permissions\":{\"type\":\"ModelPermissionsData\",\"id\":2}}},\"AppliedStringInsertOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"string\",\"id\":4}}},\"AppliedStringRemoveOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"length\":{\"type\":\"int32\",\"id\":4},\"oldValue\":{\"type\":\"string\",\"id\":5}}},\"AppliedStringSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"string\",\"id\":3},\"oldValue\":{\"type\":\"string\",\"id\":4}}},\"AppliedArrayInsertOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4}}},\"AppliedArrayRemoveOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"oldValue\":{\"type\":\"DataValue\",\"id\":4}}},\"AppliedArrayReplaceOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"index\":{\"type\":\"int32\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4},\"oldValue\":{\"type\":\"DataValue\",\"id\":5}}},\"AppliedArrayMoveOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"fromIndex\":{\"type\":\"int32\",\"id\":3},\"toIndex\":{\"type\":\"int32\",\"id\":4}}},\"AppliedArraySetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"values\":{\"rule\":\"repeated\",\"type\":\"DataValue\",\"id\":3},\"oldValues\":{\"rule\":\"repeated\",\"type\":\"DataValue\",\"id\":4}}},\"AppliedObjectAddPropertyOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4}}},\"AppliedObjectSetPropertyOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"value\":{\"type\":\"DataValue\",\"id\":4},\"oldValue\":{\"type\":\"DataValue\",\"id\":5}}},\"AppliedObjectRemovePropertyOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"oldValue\":{\"type\":\"DataValue\",\"id\":4}}},\"AppliedObjectSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"values\":{\"keyType\":\"string\",\"type\":\"DataValue\",\"id\":3},\"oldValues\":{\"keyType\":\"string\",\"type\":\"DataValue\",\"id\":4}}},\"AppliedNumberDeltaOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"delta\":{\"type\":\"double\",\"id\":3}}},\"AppliedNumberSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"double\",\"id\":3},\"oldValue\":{\"type\":\"double\",\"id\":4}}},\"AppliedBooleanSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"bool\",\"id\":3},\"oldValue\":{\"type\":\"bool\",\"id\":4}}},\"AppliedDateSetOperationData\":{\"fields\":{\"id\":{\"type\":\"string\",\"id\":1},\"noOp\":{\"type\":\"bool\",\"id\":2},\"value\":{\"type\":\"google.protobuf.Timestamp\",\"id\":3},\"oldValue\":{\"type\":\"google.protobuf.Timestamp\",\"id\":4}}},\"AppliedDiscreteOperationData\":{\"oneofs\":{\"operation\":{\"oneof\":[\"stringInsertOperation\",\"stringRemoveOperation\",\"stringSetOperation\",\"arrayInsertOperation\",\"arrayRemoveOperation\",\"arrayReplaceOperation\",\"arrayMoveOperation\",\"arraySetOperation\",\"objectAddPropertyOperation\",\"objectSetPropertyOperation\",\"objectRemovePropertyOperation\",\"objectSetOperation\",\"numberDeltaOperation\",\"numberSetOperation\",\"booleanSetOperation\",\"dateSetOperation\"]}},\"fields\":{\"stringInsertOperation\":{\"type\":\"AppliedStringInsertOperationData\",\"id\":1},\"stringRemoveOperation\":{\"type\":\"AppliedStringRemoveOperationData\",\"id\":2},\"stringSetOperation\":{\"type\":\"AppliedStringSetOperationData\",\"id\":3},\"arrayInsertOperation\":{\"type\":\"AppliedArrayInsertOperationData\",\"id\":4},\"arrayRemoveOperation\":{\"type\":\"AppliedArrayRemoveOperationData\",\"id\":5},\"arrayReplaceOperation\":{\"type\":\"AppliedArrayReplaceOperationData\",\"id\":6},\"arrayMoveOperation\":{\"type\":\"AppliedArrayMoveOperationData\",\"id\":7},\"arraySetOperation\":{\"type\":\"AppliedArraySetOperationData\",\"id\":8},\"objectAddPropertyOperation\":{\"type\":\"AppliedObjectAddPropertyOperationData\",\"id\":9},\"objectSetPropertyOperation\":{\"type\":\"AppliedObjectSetPropertyOperationData\",\"id\":10},\"objectRemovePropertyOperation\":{\"type\":\"AppliedObjectRemovePropertyOperationData\",\"id\":11},\"objectSetOperation\":{\"type\":\"AppliedObjectSetOperationData\",\"id\":12},\"numberDeltaOperation\":{\"type\":\"AppliedNumberDeltaOperationData\",\"id\":13},\"numberSetOperation\":{\"type\":\"AppliedNumberSetOperationData\",\"id\":14},\"booleanSetOperation\":{\"type\":\"AppliedBooleanSetOperationData\",\"id\":15},\"dateSetOperation\":{\"type\":\"AppliedDateSetOperationData\",\"id\":16}}},\"AppliedCompoundOperationData\":{\"fields\":{\"operations\":{\"rule\":\"repeated\",\"type\":\"AppliedDiscreteOperationData\",\"id\":1}}},\"AppliedOperationData\":{\"oneofs\":{\"operation\":{\"oneof\":[\"discreteOperation\",\"compoundOperation\"]}},\"fields\":{\"discreteOperation\":{\"type\":\"AppliedDiscreteOperationData\",\"id\":1},\"compoundOperation\":{\"type\":\"AppliedCompoundOperationData\",\"id\":2}}},\"IndexRange\":{\"fields\":{\"startIndex\":{\"type\":\"int32\",\"id\":1},\"endIndex\":{\"type\":\"int32\",\"id\":2}}},\"IndexRangeList\":{\"fields\":{\"values\":{\"rule\":\"repeated\",\"type\":\"IndexRange\",\"id\":1}}},\"ReferenceValues\":{\"oneofs\":{\"values\":{\"oneof\":[\"indices\",\"ranges\",\"properties\",\"elements\"]}},\"fields\":{\"indices\":{\"type\":\"com.convergencelabs.convergence.proto.core.Int32List\",\"id\":1},\"ranges\":{\"type\":\"IndexRangeList\",\"id\":2},\"properties\":{\"type\":\"com.convergencelabs.convergence.proto.core.StringList\",\"id\":3},\"elements\":{\"type\":\"com.convergencelabs.convergence.proto.core.StringList\",\"id\":4}}},\"ReferenceData\":{\"fields\":{\"sessionId\":{\"type\":\"string\",\"id\":1},\"valueId\":{\"type\":\"google.protobuf.StringValue\",\"id\":2},\"key\":{\"type\":\"string\",\"id\":3},\"reference\":{\"type\":\"ReferenceValues\",\"id\":4}}}}},\"presence\":{\"nested\":{\"PresenceRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"users\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1}}},\"PresenceResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"userPresences\":{\"rule\":\"repeated\",\"type\":\"UserPresenceData\",\"id\":1}}},\"SubscribePresenceRequestMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"users\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1}}},\"SubscribePresenceResponseMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"userPresences\":{\"rule\":\"repeated\",\"type\":\"UserPresenceData\",\"id\":1}}},\"UnsubscribePresenceMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"users\":{\"rule\":\"repeated\",\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1}}},\"PresenceSetStateMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"state\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":1}}},\"PresenceRemoveStateMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"keys\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":1}}},\"PresenceClearStateMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{}},\"PresenceStateSetMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"state\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":2}}},\"PresenceStateRemovedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"keys\":{\"rule\":\"repeated\",\"type\":\"string\",\"id\":2}}},\"PresenceStateClearedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1}}},\"PresenceAvailabilityChangedMessage\":{\"options\":{\"(scalapb.message).extends\":\"com.convergencelabs.convergence.proto.PresenceMessage\"},\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"available\":{\"type\":\"bool\",\"id\":2}}},\"UserPresenceData\":{\"fields\":{\"user\":{\"type\":\"com.convergencelabs.convergence.proto.core.DomainUserIdData\",\"id\":1},\"available\":{\"type\":\"bool\",\"id\":2},\"state\":{\"keyType\":\"string\",\"type\":\"google.protobuf.Value\",\"id\":3}}}}}}}}}}}}},\"google\":{\"nested\":{\"protobuf\":{\"nested\":{\"DoubleValue\":{\"fields\":{\"value\":{\"type\":\"double\",\"id\":1}}},\"FloatValue\":{\"fields\":{\"value\":{\"type\":\"float\",\"id\":1}}},\"Int64Value\":{\"fields\":{\"value\":{\"type\":\"int64\",\"id\":1}}},\"UInt64Value\":{\"fields\":{\"value\":{\"type\":\"uint64\",\"id\":1}}},\"Int32Value\":{\"fields\":{\"value\":{\"type\":\"int32\",\"id\":1}}},\"UInt32Value\":{\"fields\":{\"value\":{\"type\":\"uint32\",\"id\":1}}},\"BoolValue\":{\"fields\":{\"value\":{\"type\":\"bool\",\"id\":1}}},\"StringValue\":{\"fields\":{\"value\":{\"type\":\"string\",\"id\":1}}},\"BytesValue\":{\"fields\":{\"value\":{\"type\":\"bytes\",\"id\":1}}},\"Struct\":{\"fields\":{\"fields\":{\"keyType\":\"string\",\"type\":\"Value\",\"id\":1}}},\"Value\":{\"oneofs\":{\"kind\":{\"oneof\":[\"nullValue\",\"numberValue\",\"stringValue\",\"boolValue\",\"structValue\",\"listValue\"]}},\"fields\":{\"nullValue\":{\"type\":\"NullValue\",\"id\":1},\"numberValue\":{\"type\":\"double\",\"id\":2},\"stringValue\":{\"type\":\"string\",\"id\":3},\"boolValue\":{\"type\":\"bool\",\"id\":4},\"structValue\":{\"type\":\"Struct\",\"id\":5},\"listValue\":{\"type\":\"ListValue\",\"id\":6}}},\"NullValue\":{\"values\":{\"NULL_VALUE\":0}},\"ListValue\":{\"fields\":{\"values\":{\"rule\":\"repeated\",\"type\":\"Value\",\"id\":1}}},\"Timestamp\":{\"fields\":{\"seconds\":{\"type\":\"int64\",\"id\":1},\"nanos\":{\"type\":\"int32\",\"id\":2}}}}}}}}}");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// light library entry point.


module.exports = __webpack_require__(29);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var protobuf = module.exports = __webpack_require__(30);

protobuf.build = "light";

/**
 * A node-style callback as used by {@link load} and {@link Root#load}.
 * @typedef LoadCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Root} [root] Root, if there hasn't been an error
 * @returns {undefined}
 */

/**
 * Loads one or multiple .proto or preprocessed .json files into a common root namespace and calls the callback.
 * @param {string|string[]} filename One or multiple files to load
 * @param {Root} root Root namespace, defaults to create a new one if omitted.
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 * @see {@link Root#load}
 */
function load(filename, root, callback) {
    if (typeof root === "function") {
        callback = root;
        root = new protobuf.Root();
    } else if (!root)
        root = new protobuf.Root();
    return root.load(filename, callback);
}

/**
 * Loads one or multiple .proto or preprocessed .json files into a common root namespace and calls the callback.
 * @name load
 * @function
 * @param {string|string[]} filename One or multiple files to load
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 * @see {@link Root#load}
 * @variation 2
 */
// function load(filename:string, callback:LoadCallback):undefined

/**
 * Loads one or multiple .proto or preprocessed .json files into a common root namespace and returns a promise.
 * @name load
 * @function
 * @param {string|string[]} filename One or multiple files to load
 * @param {Root} [root] Root namespace, defaults to create a new one if omitted.
 * @returns {Promise<Root>} Promise
 * @see {@link Root#load}
 * @variation 3
 */
// function load(filename:string, [root:Root]):Promise<Root>

protobuf.load = load;

/**
 * Synchronously loads one or multiple .proto or preprocessed .json files into a common root namespace (node only).
 * @param {string|string[]} filename One or multiple files to load
 * @param {Root} [root] Root namespace, defaults to create a new one if omitted.
 * @returns {Root} Root namespace
 * @throws {Error} If synchronous fetching is not supported (i.e. in browsers) or if a file's syntax is invalid
 * @see {@link Root#loadSync}
 */
function loadSync(filename, root) {
    if (!root)
        root = new protobuf.Root();
    return root.loadSync(filename);
}

protobuf.loadSync = loadSync;

// Serialization
protobuf.encoder          = __webpack_require__(17);
protobuf.decoder          = __webpack_require__(22);
protobuf.verifier         = __webpack_require__(23);
protobuf.converter        = __webpack_require__(24);

// Reflection
protobuf.ReflectionObject = __webpack_require__(5);
protobuf.Namespace        = __webpack_require__(7);
protobuf.Root             = __webpack_require__(26);
protobuf.Enum             = __webpack_require__(3);
protobuf.Type             = __webpack_require__(18);
protobuf.Field            = __webpack_require__(6);
protobuf.OneOf            = __webpack_require__(11);
protobuf.MapField         = __webpack_require__(19);
protobuf.Service          = __webpack_require__(20);
protobuf.Method           = __webpack_require__(21);

// Runtime
protobuf.Message          = __webpack_require__(12);
protobuf.wrappers         = __webpack_require__(25);

// Utility
protobuf.types            = __webpack_require__(8);
protobuf.util             = __webpack_require__(1);

// Set up possibly cyclic reflection dependencies
protobuf.ReflectionObject._configure(protobuf.Root);
protobuf.Namespace._configure(protobuf.Type, protobuf.Service, protobuf.Enum);
protobuf.Root._configure(protobuf.Type);
protobuf.Field._configure(protobuf.Type);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = __webpack_require__(9);
protobuf.BufferWriter = __webpack_require__(38);
protobuf.Reader       = __webpack_require__(10);
protobuf.BufferReader = __webpack_require__(39);

// Utility
protobuf.util         = __webpack_require__(2);
protobuf.rpc          = __webpack_require__(15);
protobuf.roots        = __webpack_require__(16);
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.Reader._configure(protobuf.BufferReader);
    protobuf.util._configure();
}

// Set up buffer utility according to the environment
protobuf.Writer._configure(protobuf.BufferWriter);
configure();


/***/ }),
/* 31 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = LongBits;

var util = __webpack_require__(2);

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = BufferWriter;

// extends Writer
var Writer = __webpack_require__(9);
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = __webpack_require__(2);

var Buffer = util.Buffer;

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Buffer} Buffer
 */
BufferWriter.alloc = function alloc_buffer(size) {
    return (BufferWriter.alloc = util._Buffer_allocUnsafe)(size);
};

var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
    ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                           // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
    };

/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else
        buf.utf8Write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = BufferReader;

// extends Reader
var Reader = __webpack_require__(10);
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = __webpack_require__(2);

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

/* istanbul ignore else */
if (util.Buffer)
    BufferReader.prototype._slice = util.Buffer.prototype.slice;

/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Service;

var util = __webpack_require__(2);

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = codegen;

/**
 * Begins generating a function.
 * @memberof util
 * @param {string[]} functionParams Function parameter names
 * @param {string} [functionName] Function name if not anonymous
 * @returns {Codegen} Appender that appends code to the function's body
 */
function codegen(functionParams, functionName) {

    /* istanbul ignore if */
    if (typeof functionParams === "string") {
        functionName = functionParams;
        functionParams = undefined;
    }

    var body = [];

    /**
     * Appends code to the function's body or finishes generation.
     * @typedef Codegen
     * @type {function}
     * @param {string|Object.<string,*>} [formatStringOrScope] Format string or, to finish the function, an object of additional scope variables, if any
     * @param {...*} [formatParams] Format parameters
     * @returns {Codegen|Function} Itself or the generated function if finished
     * @throws {Error} If format parameter counts do not match
     */

    function Codegen(formatStringOrScope) {
        // note that explicit array handling below makes this ~50% faster

        // finish the function
        if (typeof formatStringOrScope !== "string") {
            var source = toString();
            if (codegen.verbose)
                console.log("codegen: " + source); // eslint-disable-line no-console
            source = "return " + source;
            if (formatStringOrScope) {
                var scopeKeys   = Object.keys(formatStringOrScope),
                    scopeParams = new Array(scopeKeys.length + 1),
                    scopeValues = new Array(scopeKeys.length),
                    scopeOffset = 0;
                while (scopeOffset < scopeKeys.length) {
                    scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                    scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
                }
                scopeParams[scopeOffset] = source;
                return Function.apply(null, scopeParams).apply(null, scopeValues); // eslint-disable-line no-new-func
            }
            return Function(source)(); // eslint-disable-line no-new-func
        }

        // otherwise append to body
        var formatParams = new Array(arguments.length - 1),
            formatOffset = 0;
        while (formatOffset < formatParams.length)
            formatParams[formatOffset] = arguments[++formatOffset];
        formatOffset = 0;
        formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
            var value = formatParams[formatOffset++];
            switch ($1) {
                case "d": case "f": return String(Number(value));
                case "i": return String(Math.floor(value));
                case "j": return JSON.stringify(value);
                case "s": return String(value);
            }
            return "%";
        });
        if (formatOffset !== formatParams.length)
            throw Error("parameter count mismatch");
        body.push(formatStringOrScope);
        return Codegen;
    }

    function toString(functionNameOverride) {
        return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
    }

    Codegen.toString = toString;
    return Codegen;
}

/**
 * Begins generating a function.
 * @memberof util
 * @function codegen
 * @param {string} [functionName] Function name if not anonymous
 * @returns {Codegen} Appender that appends code to the function's body
 * @variation 2
 */

/**
 * When set to `true`, codegen will log generated code to console. Useful for debugging.
 * @name util.codegen.verbose
 * @type {boolean}
 */
codegen.verbose = false;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = fetch;

var asPromise = __webpack_require__(13),
    inquire   = __webpack_require__(14);

var fs = inquire("fs");

/**
 * Node-style callback as used by {@link util.fetch}.
 * @typedef FetchCallback
 * @type {function}
 * @param {?Error} error Error, if any, otherwise `null`
 * @param {string} [contents] File contents, if there hasn't been an error
 * @returns {undefined}
 */

/**
 * Options as used by {@link util.fetch}.
 * @typedef FetchOptions
 * @type {Object}
 * @property {boolean} [binary=false] Whether expecting a binary response
 * @property {boolean} [xhr=false] If `true`, forces the use of XMLHttpRequest
 */

/**
 * Fetches the contents of a file.
 * @memberof util
 * @param {string} filename File path or url
 * @param {FetchOptions} options Fetch options
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 */
function fetch(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (!options)
        options = {};

    if (!callback)
        return asPromise(fetch, this, filename, options); // eslint-disable-line no-invalid-this

    // if a node-like filesystem is present, try it first but fall back to XHR if nothing is found.
    if (!options.xhr && fs && fs.readFile)
        return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
            return err && typeof XMLHttpRequest !== "undefined"
                ? fetch.xhr(filename, options, callback)
                : err
                ? callback(err)
                : callback(null, options.binary ? contents : contents.toString("utf8"));
        });

    // use the XHR version otherwise.
    return fetch.xhr(filename, options, callback);
}

/**
 * Fetches the contents of a file.
 * @name util.fetch
 * @function
 * @param {string} path File path or url
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 * @variation 2
 */

/**
 * Fetches the contents of a file.
 * @name util.fetch
 * @function
 * @param {string} path File path or url
 * @param {FetchOptions} [options] Fetch options
 * @returns {Promise<string|Uint8Array>} Promise
 * @variation 3
 */

/**/
fetch.xhr = function fetch_xhr(filename, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange /* works everywhere */ = function fetchOnReadyStateChange() {

        if (xhr.readyState !== 4)
            return undefined;

        // local cors security errors return status 0 / empty string, too. afaik this cannot be
        // reliably distinguished from an actually empty file for security reasons. feel free
        // to send a pull request if you are aware of a solution.
        if (xhr.status !== 0 && xhr.status !== 200)
            return callback(Error("status " + xhr.status));

        // if binary data is expected, make sure that some sort of array is returned, even if
        // ArrayBuffers are not supported. the binary string fallback, however, is unsafe.
        if (options.binary) {
            var buffer = xhr.response;
            if (!buffer) {
                buffer = [];
                for (var i = 0; i < xhr.responseText.length; ++i)
                    buffer.push(xhr.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
        }
        return callback(null, xhr.responseText);
    };

    if (options.binary) {
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Receiving_binary_data_in_older_browsers
        if ("overrideMimeType" in xhr)
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.responseType = "arraybuffer";
    }

    xhr.open("GET", filename);
    xhr.send();
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A minimal path module to resolve Unix, Windows and URL paths alike.
 * @memberof util
 * @namespace
 */
var path = exports;

var isAbsolute =
/**
 * Tests if the specified path is absolute.
 * @param {string} path Path to test
 * @returns {boolean} `true` if path is absolute
 */
path.isAbsolute = function isAbsolute(path) {
    return /^(?:\/|\w+:)/.test(path);
};

var normalize =
/**
 * Normalizes the specified path.
 * @param {string} path Path to normalize
 * @returns {string} Normalized path
 */
path.normalize = function normalize(path) {
    path = path.replace(/\\/g, "/")
               .replace(/\/{2,}/g, "/");
    var parts    = path.split("/"),
        absolute = isAbsolute(path),
        prefix   = "";
    if (absolute)
        prefix = parts.shift() + "/";
    for (var i = 0; i < parts.length;) {
        if (parts[i] === "..") {
            if (i > 0 && parts[i - 1] !== "..")
                parts.splice(--i, 2);
            else if (absolute)
                parts.splice(i, 1);
            else
                ++i;
        } else if (parts[i] === ".")
            parts.splice(i, 1);
        else
            ++i;
    }
    return prefix + parts.join("/");
};

/**
 * Resolves the specified include path against the specified origin path.
 * @param {string} originPath Path to the origin file
 * @param {string} includePath Include path relative to origin path
 * @param {boolean} [alreadyNormalized=false] `true` if both paths are already known to be normalized
 * @returns {string} Path to the include file
 */
path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
    if (!alreadyNormalized)
        includePath = normalize(includePath);
    if (isAbsolute(includePath))
        return includePath;
    if (!alreadyNormalized)
        originPath = normalize(originPath);
    return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
};


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/main/util/log/LogLevel.ts
var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "trace";
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["SILENT"] = "silent";
})(LogLevel || (LogLevel = {}));

// CONCATENATED MODULE: ./src/main/util/Immutable.ts
class Immutable {
    static make(source) {
        if (typeof source === "object") {
            Object.freeze(source);
            Object.keys(source).forEach((val, idx, array) => {
                Immutable.make(val);
            });
        }
    }
    static copy(source, updates) {
        const result = {};
        Object.keys(source).forEach((prop, idx, array) => {
            result[prop] = updates[prop] !== undefined ? updates[prop] : source[prop];
        });
        Object.freeze(result);
        return result;
    }
    static getOrDefault(value, defaultValue) {
        return value === undefined ? defaultValue : value;
    }
    static update(current, update) {
        return update !== undefined ? update : current;
    }
}

// CONCATENATED MODULE: ./src/main/util/log/LogEvent.ts

class LogEvent_LogEvent {
    constructor(timestamp, logger, level, message, error) {
        this.timestamp = timestamp;
        this.logger = logger;
        this.level = level;
        this.message = message;
        this.error = error;
        Immutable.make(this);
    }
}

// CONCATENATED MODULE: ./src/main/util/TypeChecker.ts
class TypeChecker {
    static isArray(value) {
        return Array.isArray(value);
    }
    static isBoolean(value) {
        return typeof value === "boolean";
    }
    static isDate(value) {
        return value instanceof Date || value.constructor.name === "Date";
    }
    static isError(value) {
        return value instanceof Error && typeof value.message !== "undefined";
    }
    static isFunction(value) {
        return typeof value === "function";
    }
    static isNull(value) {
        return value === null;
    }
    static isNumber(value) {
        return typeof value === "number" && isFinite(value);
    }
    static isObject(value) {
        return value && typeof value === "object" && value.constructor === Object;
    }
    static isString(value) {
        return typeof value === "string" || value instanceof String;
    }
    static isSymbol(value) {
        return typeof value === "symbol";
    }
    static isRegExp(value) {
        return value && typeof value === "object" && value.constructor === RegExp;
    }
    static isUndefined(value) {
        return typeof value === "undefined";
    }
    static isSet(value) {
        return !TypeChecker.isNull(value) && !TypeChecker.isUndefined(value);
    }
    static isNotSet(value) {
        return !TypeChecker.isSet(value);
    }
    static switch(value, matcher) {
        if (TypeChecker.isUndefined(matcher) || TypeChecker.isNull(matcher)) {
            throw new Error("matcher must be defined.");
        }
        if (TypeChecker.isArray(value) && !TypeChecker.isUndefined(matcher.array)) {
            matcher.array(value);
        }
        else if (TypeChecker.isBoolean(value) && !TypeChecker.isUndefined(matcher.boolean)) {
            matcher.boolean(value);
        }
        else if (TypeChecker.isError(value) && !TypeChecker.isUndefined(matcher.error)) {
            matcher.error(value);
        }
        else if (TypeChecker.isDate(value) && !TypeChecker.isUndefined(matcher.date)) {
            matcher.date(value);
        }
        else if (TypeChecker.isFunction(value) && !TypeChecker.isUndefined(matcher.function)) {
            matcher.function(value);
        }
        else if (TypeChecker.isNull(value) && !TypeChecker.isUndefined(matcher.null)) {
            matcher.null();
        }
        else if (TypeChecker.isNumber(value) && !TypeChecker.isUndefined(matcher.number)) {
            matcher.number(value);
        }
        else if (TypeChecker.isObject(value) && !TypeChecker.isUndefined(matcher.object)) {
            matcher.object(value);
        }
        else if (TypeChecker.isRegExp(value) && !TypeChecker.isUndefined(matcher.regexp)) {
            matcher.regexp(value);
        }
        else if (TypeChecker.isString(value) && !TypeChecker.isUndefined(matcher.string)) {
            matcher.string(value);
        }
        else if (TypeChecker.isSymbol(value) && !TypeChecker.isUndefined(matcher.symbol)) {
            matcher.symbol(value);
        }
        else if (TypeChecker.isUndefined(value) && !TypeChecker.isUndefined(matcher.undefined)) {
            matcher.undefined();
        }
        else {
            const customRule = TypeChecker.isArray(matcher.custom) ?
                matcher.custom.find(rule => {
                    return TypeChecker.isFunction(rule.test) &&
                        TypeChecker.isFunction(rule.callback) &&
                        rule.test(value);
                }) :
                undefined;
            if (!TypeChecker.isUndefined(customRule)) {
                customRule.callback(value);
            }
            else if (!TypeChecker.isUndefined(matcher.default)) {
                matcher.default(value);
            }
        }
    }
}

// CONCATENATED MODULE: ./src/main/util/log/Logger.ts



const LogLevelPriority = {
    SILENT: -1,
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4
};
class Logger_Logger {
    constructor(id, level, logWriters) {
        this._id = id;
        this._logWriters = logWriters;
        this.setLevel(level);
    }
    getId() {
        return this._id;
    }
    getLevel() {
        return this._level;
    }
    setLevel(logLevel) {
        this._level = logLevel;
        this._levelPriority = LogLevelPriority[this._level.toUpperCase()];
    }
    trace(message) {
        if (LogLevelPriority.TRACE >= this._levelPriority) {
            const event = new LogEvent_LogEvent(new Date(), this._id, LogLevel.TRACE, this._resolveLogMessage(message));
            this._log(event);
        }
    }
    debug(message) {
        if (LogLevelPriority.DEBUG >= this._levelPriority) {
            const event = new LogEvent_LogEvent(new Date(), this._id, LogLevel.DEBUG, this._resolveLogMessage(message));
            this._log(event);
        }
    }
    info(message) {
        if (LogLevelPriority.INFO >= this._levelPriority) {
            const event = new LogEvent_LogEvent(new Date(), this._id, LogLevel.INFO, this._resolveLogMessage(message));
            this._log(event);
        }
    }
    warn(message) {
        if (LogLevelPriority.WARN >= this._levelPriority) {
            const event = new LogEvent_LogEvent(new Date(), this._id, LogLevel.WARN, this._resolveLogMessage(message));
            this._log(event);
        }
    }
    error(message, e) {
        if (LogLevelPriority.ERROR >= this._levelPriority) {
            const event = new LogEvent_LogEvent(new Date(), this._id, LogLevel.ERROR, this._resolveLogMessage(message), e);
            this._log(event);
        }
    }
    _log(event) {
        this._logWriters.forEach(writer => writer.writeLog(event));
    }
    _resolveLogMessage(message) {
        if (TypeChecker.isFunction(message)) {
            return message();
        }
        else {
            return message;
        }
    }
}

// CONCATENATED MODULE: ./src/main/util/ObjectUtils.ts
function mapObjectValues(obj, mapFunc) {
    "use strict";
    return Object.keys(obj).reduce((newObj, value) => {
        newObj[value] = mapFunc(obj[value]);
        return newObj;
    }, {});
}
function objectForEach(obj, callback) {
    "use strict";
    return Object.keys(obj).forEach(key => {
        callback(key, obj[key]);
    });
}
function deepClone(from) {
    const type = typeof from;
    if (from === null || from === undefined || type === "string" || type === "number" || type === "boolean") {
        return from;
    }
    if (from instanceof Date) {
        return new Date(from.getTime());
    }
    if (Array.isArray(from)) {
        return from.map(e => deepClone(e));
    }
    if (from instanceof Map) {
        const result = new Map();
        from.forEach((v, k) => {
            result.set(k, deepClone(v));
        });
        return result;
    }
    if (from instanceof Set) {
        const result = new Set();
        from.forEach(v => result.add(deepClone(v)));
        return result;
    }
    if (from.constructor === Object) {
        const result = {};
        Object.keys(from).forEach(key => {
            result[key] = deepClone(from[key]);
        });
        return result;
    }
    const name = from.constructor.name || from.constructor.toString();
    throw new Error("Can not clone unknown type: " + name);
}

// CONCATENATED MODULE: ./src/main/util/Validation.ts

class Validation_Validation {
    static isSet(value) {
        return !Validation_Validation.isNotSet(value);
    }
    static isNotSet(value) {
        return value === undefined || value === null;
    }
    static nonEmptyString(value) {
        return typeof value === "string" && value.length > 0;
    }
    static assertNonEmptyString(value, name) {
        if (name === undefined) {
            name = "value";
        }
        if (!Validation_Validation.nonEmptyString(value)) {
            throw new Error(name + " must be a non-empty string: " + typeof value);
        }
    }
    static assertString(value, name) {
        if (typeof value !== "string") {
            throw new Error(`${Validation_Validation.getValueName(name)} must be a string: ${typeof value}`);
        }
    }
    static assertValidStringIndex(index, str, inclusiveEnd, name) {
        Validation_Validation.assertValidIndex(index, 0, inclusiveEnd ? str.length + 1 : str.length, name);
    }
    static assertNumber(value, name) {
        if (typeof value !== "number") {
            throw new Error(`${Validation_Validation.getValueName(name)} must be a number: ${typeof value}`);
        }
    }
    static assertArray(value, name) {
        if (!Array.isArray(value)) {
            throw new Error(`${Validation_Validation.getValueName(name)} must be an array: ${typeof value}`);
        }
    }
    static assertNonEmptyArray(value, name) {
        Validation_Validation.assertArray(value, name);
        if (value.length === 0) {
            throw new Error(`${Validation_Validation.getValueName(name)} must be a non-empty array: ${typeof value}`);
        }
    }
    static assertValidArrayIndex(index, array, name) {
        Validation_Validation.assertValidIndex(index, 0, array.length, name);
    }
    static assertValidIndex(index, lower, upper, name) {
        Validation_Validation.assertNumber(index, name);
        if (index < lower || index >= upper) {
            name = Validation_Validation.getValueName(name);
            throw new Error(`Index out of bounds. ${name} must be > 0 and <= ${upper}: ${index}`);
        }
    }
    static assertBoolean(value, name) {
        if (typeof value !== "boolean") {
            throw new Error(`${Validation_Validation.getValueName(name)} must be a boolean but was: ${typeof value}`);
        }
    }
    static assertDate(value, name) {
        if (!TypeChecker.isDate(value)) {
            throw new Error(`${Validation_Validation.getValueName(name)} must be a Date but was: ${value.constructor.name}`);
        }
    }
    static getValueName(name, defaultValue) {
        return name || defaultValue || "value";
    }
}

// CONCATENATED MODULE: ./src/main/util/log/LoggingConfig.ts



class LoggingConfig_LoggingConfig {
    constructor(config) {
        this._loggers = new Map();
        if (TypeChecker.isSet(config.loggers)) {
            objectForEach(config.loggers, (id, loggerConfig) => {
                if (!Validation_Validation.nonEmptyString(id)) {
                    throw new Error("A logger's id must be a non-empty string");
                }
                this._loggers.set(id, this._processLoggerConfig(loggerConfig));
            });
        }
        this._loggers.set(LoggingConfig_LoggingConfig.ROOT_LOGGER_ID, this._processLoggerConfig(config.root));
    }
    resolveLoggerConfig(loggerId) {
        let id = loggerId;
        let logger = this._loggers.get(id);
        while (logger === undefined && id !== "") {
            const dot = id.lastIndexOf(".");
            id = id.substring(0, dot);
            logger = this._loggers.get(id);
        }
        return logger !== undefined ?
            logger :
            this._loggers.get(LoggingConfig_LoggingConfig.ROOT_LOGGER_ID);
    }
    _processLoggerConfig(config) {
        if (TypeChecker.isString(config)) {
            return { level: config };
        }
        else {
            return config;
        }
    }
}
LoggingConfig_LoggingConfig.ROOT_LOGGER_ID = "";

// CONCATENATED MODULE: ./src/main/util/log/PatternLogWriter.ts
class PatternLogWriter {
    constructor(pattern) {
        this._pattern = pattern || PatternLogWriter.DEFAULT_PATTERN;
    }
    _formatMessage(event) {
        const level = this._pad(event.level.toUpperCase(), 5, " ", false);
        const time = this._formatTime(event);
        return `${level} ${time} ${event.message}`;
    }
    _formatTime(event) {
        const t = event.timestamp;
        return this._pad(t.getHours(), 2, "0") +
            ":" +
            this._pad(t.getMinutes(), 2, "0") +
            ":" +
            this._pad(t.getSeconds(), 2, "0") +
            "." +
            this._pad(t.getMilliseconds(), 3, "0");
    }
    _pad(value, minLen, char, left = true) {
        let str = String(value);
        while (str.length < minLen) {
            str = left ? char + str : str + char;
        }
        return str;
    }
}
PatternLogWriter.FIELDS = {
    LOG_NAME: "%l",
    MESSAGE: "%m",
    DATE_TIME: "%t",
    LOG_LEVEL: "%p"
};
PatternLogWriter.DEFAULT_PATTERN = "%t %p %m";

// CONCATENATED MODULE: ./src/main/util/log/ConsoleLogWriter.ts


class ConsoleLogWriter_ConsoleLogWriter extends PatternLogWriter {
    constructor(pattern) {
        super(pattern);
    }
    writeLog(event) {
        switch (event.level) {
            case LogLevel.TRACE:
                console.debug(this._formatMessage(event));
                break;
            case LogLevel.DEBUG:
                console.debug(this._formatMessage(event));
                break;
            case LogLevel.INFO:
                console.info(this._formatMessage(event));
                break;
            case LogLevel.WARN:
                console.warn(this._formatMessage(event));
                break;
            case LogLevel.ERROR:
                if (event.error) {
                    console.error(this._formatMessage(event) + "\n", event.error);
                }
                else {
                    console.error(this._formatMessage(event));
                }
                break;
            default:
        }
    }
}

// CONCATENATED MODULE: ./src/main/util/log/Logging.ts




const DEFAULT_CONFIG = {
    root: {
        level: LogLevel.WARN
    }
};
class Logging_ConvergenceLogging {
    constructor(config) {
        this.configure(config || {});
        this._writer = new ConsoleLogWriter_ConsoleLogWriter("");
    }
    configure(config) {
        const defaulted = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
        this._config = new LoggingConfig_LoggingConfig(defaulted);
        this._loggers = new Map();
    }
    root() {
        return this.logger();
    }
    logger(id) {
        if (id === null || id === undefined) {
            id = LoggingConfig_LoggingConfig.ROOT_LOGGER_ID;
        }
        if (!this._loggers.has(id)) {
            const config = this._config.resolveLoggerConfig(id);
            this._loggers.set(id, new Logger_Logger(id, config.level, [this._writer]));
        }
        return this._loggers.get(id);
    }
}
const Logging = new Logging_ConvergenceLogging();

// CONCATENATED MODULE: ./src/main/connection/HeartbeatHelper.ts

class HeartbeatHelper_HeartbeatHelper {
    constructor(handler, pingInterval, pongTimeout) {
        this._handler = handler;
        this._pingInterval = pingInterval;
        this._pongTimeout = pongTimeout;
        this._started = false;
        this._logger = Logging.logger("heartbeat");
    }
    setPingInterval(pingInterval) {
        this._pingInterval = pingInterval;
    }
    getPingInterval() {
        return this._pingInterval;
    }
    setPongTimeout(pongTimeout) {
        this._pongTimeout = pongTimeout;
    }
    getPongTimeout() {
        return this._pongTimeout;
    }
    messageReceived() {
        if (this._started) {
            this.cancelPongTimeout();
            this.restartPingTimeout();
        }
    }
    start() {
        if (this._handler == null) {
            throw new Error("Can't start the HeartbeatManager unless the callback is set.");
        }
        this._logger.debug(() => "HeartbeatHelper started with Ping Interval " + this._pingInterval +
            " and Pong Timeout " + this._pongTimeout);
        this._started = true;
        this.messageReceived();
    }
    stop() {
        this._started = false;
        this.stopPingTimer();
        this.cancelPongTimeout();
        this._logger.debug(() => "HeartbeatHelper stopped.");
    }
    get started() {
        return this._started;
    }
    get stopped() {
        return !this._started;
    }
    dispose() {
        this.stop();
    }
    sendPing() {
        this._handler.sendPing();
        this.schedulePongTimeout();
    }
    schedulePongTimeout() {
        this._timeoutFuture = setTimeout(() => {
            this._handler.onTimeout();
        }, this._pongTimeout * 1000);
    }
    cancelPongTimeout() {
        if (this._timeoutFuture != null) {
            clearTimeout(this._timeoutFuture);
            this._timeoutFuture = null;
        }
    }
    stopPingTimer() {
        if (this._pingFuture != null) {
            clearTimeout(this._pingFuture);
            this._pingFuture = null;
        }
    }
    restartPingTimeout() {
        this.stopPingTimer();
        this._pingFuture = setTimeout(() => {
            this.sendPing();
        }, this._pingInterval * 1000);
    }
}

// EXTERNAL MODULE: external "rxjs"
var external_rxjs_ = __webpack_require__(4);

// EXTERNAL MODULE: external "rxjs.operators"
var external_rxjs_operators_ = __webpack_require__(0);

// CONCATENATED MODULE: ./src/main/util/ConvergenceError.ts
class ConvergenceError extends Error {
    constructor(message, code, details) {
        super(message);
        this._code = code;
        this._details = details || {};
        this.name = "ConvergenceError";
        Object.setPrototypeOf(this, ConvergenceError.prototype);
    }
    get code() {
        return this._code;
    }
    get details() {
        return this._details;
    }
}

// CONCATENATED MODULE: ./src/main/util/ConvergenceEventEmitter.ts




class ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor() {
        this._defaultSubject = new external_rxjs_["Subject"]();
        this._observable = this._defaultSubject.asObservable().pipe(Object(external_rxjs_operators_["share"])());
        this._listeners = {};
    }
    static _resolveEventKey(event) {
        if (typeof event === "string") {
            return event.toLowerCase();
        }
        else {
            throw new Error("Event names must be strings");
        }
    }
    addListener(event, listener) {
        if (typeof listener !== "function") {
            throw new TypeError("Listeners must be functions");
        }
        event = ConvergenceEventEmitter_ConvergenceEventEmitter._resolveEventKey(event);
        let listeners = this._listeners[event];
        if (listeners === undefined) {
            listeners = [];
            this._listeners[event] = listeners;
        }
        else if (listeners.find(r => r.listener === listener) !== undefined) {
            return this;
        }
        const subscription = this._observable
            .pipe(Object(external_rxjs_operators_["filter"])((e) => e.name.toLowerCase() === event))
            .subscribe((e) => {
            listener(e);
        });
        listeners.push({ listener, subscription });
        return this;
    }
    on(event, listener) {
        return this.addListener(event, listener);
    }
    once(event, listener) {
        const wrapper = (e) => {
            this.removeListener(event, wrapper);
            listener(e);
        };
        return this.addListener(event, wrapper);
    }
    removeAllListeners() {
        Object.keys(this._listeners).forEach(event => this.removeListeners(event));
        return this;
    }
    removeListeners(event) {
        event = ConvergenceEventEmitter_ConvergenceEventEmitter._resolveEventKey(event);
        const registrations = this._listeners[event];
        registrations.forEach(r => r.subscription.unsubscribe());
        delete this._listeners[event];
        return this;
    }
    removeListener(event, listener) {
        event = ConvergenceEventEmitter_ConvergenceEventEmitter._resolveEventKey(event);
        const listeners = this._listeners[event];
        if (listeners !== undefined) {
            const index = listeners.findIndex(r => r.listener === listener);
            if (index !== -1) {
                const r = listeners[index];
                listeners.splice(index, 1);
                r.subscription.unsubscribe();
            }
        }
        return this;
    }
    off(event, listener) {
        return this.removeListener(event, listener);
    }
    events() {
        return this._observable;
    }
    _emitFrom(observable) {
        return observable.subscribe((value) => {
            this._defaultSubject.next(value);
        }, (error) => {
            this._defaultSubject.error(error);
        });
    }
    _emitEvent(value) {
        if (Validation_Validation.isNotSet(value.name)) {
            throw new ConvergenceError("An event must have a name.");
        }
        this._defaultSubject.next(value);
    }
    _completeEventStream() {
        this._defaultSubject.complete();
    }
}

// CONCATENATED MODULE: ./src/main/util/ConvergenceServerError.ts
class ConvergenceServerError extends Error {
    constructor(m, code, details) {
        super(m);
        this._code = code;
        this._details = details;
        Object.setPrototypeOf(this, ConvergenceServerError.prototype);
    }
    get code() {
        return this._code;
    }
    get details() {
        return this._details;
    }
}

// CONCATENATED MODULE: ./src/main/util/CancellationToken.ts
class CancellationToken {
    constructor() {
        this._callback = null;
        this._canceled = false;
    }
    static create() {
        return new CancellationToken();
    }
    cancel() {
        if (this._callback === null) {
            throw new Error("The cancellation token must be bound before calling cancel.");
        }
        if (this._canceled) {
            throw new Error("The cancellation token has already been cancelled.");
        }
        this._callback();
        this._canceled = true;
    }
    isBound() {
        return this._callback !== null;
    }
    _bind(callback) {
        if (typeof callback !== "function") {
            throw new Error("callback must be a function");
        }
        if (this._callback !== null) {
            throw new Error("The cancellation token was already bound");
        }
        this._callback = callback;
    }
}

// CONCATENATED MODULE: ./src/main/util/PagedData.ts
class PagedData {
    constructor(data, offset, totalResults) {
        this.data = data;
        this.offset = offset;
        this.totalResults = totalResults;
        Object.freeze(this);
        Object.freeze(data);
    }
}

// CONCATENATED MODULE: ./src/main/util/StringMap.ts
class StringMap {
    static objectToMap(obj) {
        const map = new Map();
        Object.keys(obj).forEach(k => map.set(k, obj[k]));
        return map;
    }
    static mapToObject(map) {
        const obj = {};
        map.forEach((v, k) => obj[k] = v);
        return obj;
    }
    static coerceToObject(map) {
        if (map === undefined) {
            return {};
        }
        else if (map instanceof Map) {
            return StringMap.mapToObject(map);
        }
        else {
            return map;
        }
    }
    static coerceToMap(map) {
        if (map === undefined) {
            return new Map();
        }
        else if (map instanceof Map) {
            return map;
        }
        else {
            return StringMap.objectToMap(map);
        }
    }
    static toStringMap(map) {
        if (!map) {
            return map;
        }
        if (map instanceof Map) {
            return map;
        }
        return StringMap.objectToMap(map);
    }
}

// CONCATENATED MODULE: ./src/main/util/log/index.ts


// CONCATENATED MODULE: ./src/main/util/index.ts








// CONCATENATED MODULE: ./src/main/util/AbstractDeferred.ts
class AbstractDeferred {
    constructor() {
        this._rejected = false;
        this._resolved = false;
    }
    isPending() {
        return !this._resolved && !this._rejected;
    }
    isRejected() {
        return this._rejected;
    }
    isResolved() {
        return this._resolved;
    }
    resolve(value) {
        this._rejected = false;
        this._resolved = true;
    }
    reject(error) {
        this._rejected = true;
        this._resolved = false;
    }
    resolveFromPromise(p) {
        p.then((r) => this.resolve(r)).catch((e) => this.reject(e));
    }
}

// CONCATENATED MODULE: ./src/main/util/Deferred.ts

class Deferred_Deferred extends AbstractDeferred {
    constructor() {
        super();
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    resolve(value) {
        super.resolve(value);
        this._resolve(value);
    }
    reject(error) {
        super.reject(error);
        this._reject(error);
    }
    promise() {
        return this._promise;
    }
}

// CONCATENATED MODULE: ./src/main/connection/ConvergenceSocket.ts



class ConvergenceSocket_ConvergenceSocket extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(url, webSocketClass, webSocketFactory) {
        super();
        this._logger = Logging.logger("socket");
        let tmp = url;
        tmp = tmp.replace(/https:/i, "wss:");
        tmp = tmp.replace(/http:/i, "ws:");
        this._url = tmp;
        this._socket = null;
        this._webSocketClass = webSocketClass !== null ? webSocketClass : WebSocket;
        this._webSocketFactory = webSocketFactory !== null ? webSocketFactory : (u) => new this._webSocketClass(u);
    }
    get url() {
        return this._url;
    }
    open() {
        this._openDeferred = new Deferred_Deferred();
        if (this._socket && this._socket.readyState === this._webSocketClass.CONNECTING) {
            throw new Error("Socket already in the process of opening.");
        }
        else if (this._socket && this._socket.readyState === this._webSocketClass.OPEN) {
            throw new Error("Can not call connect on a socket that is already connected.");
        }
        else if (this._socket && this._socket.readyState === this._webSocketClass.CLOSING) {
            throw new Error("Can not call connect on a socket that is in the process of closing.");
        }
        else {
            this._socket = this._webSocketFactory(this._url);
            this._socket.binaryType = "arraybuffer";
            this._attachToSocket(this._socket);
        }
        return this._openDeferred.promise();
    }
    close() {
        this._doClose(true);
    }
    terminate(reason) {
        this._doClose(false, reason);
    }
    isOpen() {
        return this._socket !== null && this._socket.readyState === this._webSocketClass.OPEN;
    }
    isConnecting() {
        return this._socket === null || this._socket.readyState === this._webSocketClass.CONNECTING;
    }
    isClosed() {
        return this._socket === null || this._socket.readyState === this._webSocketClass.CLOSED;
    }
    send(message) {
        if (!this.isOpen()) {
            throw new Error("Can't send messages because the WebSocket is not open.");
        }
        this._socket.send(message);
    }
    _doClose(clean, reason) {
        if (!this._socket || this._socket.readyState === this._webSocketClass.CLOSED) {
            this._logger.debug("Can't close a closed WebSocket.");
            throw new Error("Can not close on a WebSocket in the CLOSED state.");
        }
        else if (this._socket.readyState === this._webSocketClass.CLOSING) {
            this._logger.debug("Attempted to close a WebSocket that was already closing.");
            throw new Error("Connection is already closing.");
        }
        else {
            this._logger.debug("Closing a connecting Web Socket.");
            this._detachFromSocket(this._socket);
            const socket = this._socket;
            this._socket = null;
            if (clean) {
                this._logger.debug("Closing Web Socket normally.");
                socket.close(1000);
            }
            else {
                this._logger.debug("Closing Web Socket abnormally.");
                socket.close(4006, reason);
            }
            if (this._openDeferred !== null) {
                const tmp = this._openDeferred;
                this._openDeferred = null;
                tmp.reject(new Error("Web Socket connection closed while opening."));
            }
            const event = {
                name: ConvergenceSocket_ConvergenceSocket.Events.CLOSE,
                reason: "close requested by client"
            };
            this._emitEvent(event);
        }
    }
    _detachFromSocket(socket) {
        socket.onmessage = undefined;
        socket.onopen = undefined;
        socket.onerror = undefined;
        socket.onclose = undefined;
    }
    _attachToSocket(socket) {
        socket.onmessage = (evt) => {
            try {
                if (evt.data instanceof ArrayBuffer) {
                    const buffer = new Uint8Array(evt.data);
                    this._emitEvent({
                        name: ConvergenceSocket_ConvergenceSocket.Events.MESSAGE,
                        message: buffer
                    });
                }
                else {
                    throw new ConvergenceError("Convergence protocol does not accept text frames: " + evt.data);
                }
            }
            catch (e) {
                this._emitEvent({
                    name: ConvergenceSocket_ConvergenceSocket.Events.ERROR,
                    error: e
                });
                this._logger.error("Error handling  web socket frame", e);
            }
        };
        socket.onopen = (evt) => {
            if (this._openDeferred) {
                this._logger.debug("Web Socket connection opened");
                try {
                    this._openDeferred.resolve();
                }
                catch (e) {
                    this._logger.error("Error resolving WebSocket Open Promise.", e);
                }
                this._openDeferred = null;
            }
            else {
                const event = {
                    name: ConvergenceSocket_ConvergenceSocket.Events.ERROR,
                    error: new ConvergenceError("Received onOpen event while in state: " + this._socket.readyState)
                };
                this._emitEvent(event);
            }
        };
        socket.onerror = (evt) => {
            if (this._socket === undefined || this._socket.readyState === this._webSocketClass.CONNECTING) {
                this._logger.debug("Web Socket error.");
                try {
                    const event = {
                        name: ConvergenceSocket_ConvergenceSocket.Events.ERROR,
                        error: new ConvergenceError("Unknown web socket error")
                    };
                    this._emitEvent(event);
                }
                catch (e) {
                    this._logger.error("Error handling WebSocket error.", e);
                }
            }
        };
        socket.onclose = (evt) => {
            this._logger.debug(() => `Web Socket close event: {code: ${evt.code}, reason: "${evt.reason}"}`);
            this._detachFromSocket(socket);
            this._socket = null;
            try {
                if (this._openDeferred) {
                    this._logger.debug(() => `Web Socket connection failed: {code: ${evt.code}, reason: "${evt.reason}"}`);
                    this._openDeferred.reject(new Error(`Could not connect. The WebSocket closed while connecting: {code: ${evt.code}, reason: "${evt.reason}"}`));
                    this._openDeferred = null;
                }
                else {
                    this._logger.debug(() => `Web Socket connection unexpectedly closed: {code: ${evt.code}, reason: "${evt.reason}"}`);
                    const event = {
                        name: ConvergenceSocket_ConvergenceSocket.Events.CLOSE,
                        reason: "unexpected Web Socket closure."
                    };
                    this._emitEvent(event);
                }
            }
            catch (e) {
                this._logger.error("Error handling web socket close event.", e);
            }
        };
    }
}
ConvergenceSocket_ConvergenceSocket.Events = {
    MESSAGE: "message",
    ERROR: "error",
    CLOSE: "close"
};

// EXTERNAL MODULE: ./node_modules/@convergence/convergence-proto/convergence-proto.json
var convergence_proto = __webpack_require__(27);
var convergence_proto_namespaceObject = /*#__PURE__*/__webpack_require__.t(convergence_proto, 2);

// EXTERNAL MODULE: ./node_modules/protobufjs/light.js
var light = __webpack_require__(28);

// CONCATENATED MODULE: ./src/main/connection/ConvergenceMessageIO.ts


const ROOT = light["Root"].fromJSON(convergence_proto_namespaceObject);
const CONVERGENCE_MESSAGE_PATH = "com.convergencelabs.convergence.proto.ConvergenceMessage";
class ConvergenceMessageIO {
    static decode(bytes) {
        const protocolMessage = ConvergenceMessageIO._convergenceMessageType.decode(bytes);
        return ConvergenceMessageIO._convergenceMessageType.toObject(protocolMessage);
    }
    static encode(message) {
        const protocolMessage = ConvergenceMessageIO._convergenceMessageType.fromObject(message);
        return ConvergenceMessageIO._convergenceMessageType.encode(protocolMessage).finish();
    }
}
ConvergenceMessageIO._convergenceMessageType = ROOT.lookupType(CONVERGENCE_MESSAGE_PATH);

// CONCATENATED MODULE: ./src/main/connection/ProtocolConnection.ts






class ProtocolConnection_ProtocolConnection extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(socket, protocolConfig) {
        super();
        this._nextRequestId = 0;
        this._closeRequested = false;
        this._messageLogger = Logging.logger("protocol.messages");
        this._pingLogger = Logging.logger("protocol.ping");
        this._protocolConfig = protocolConfig;
        this._socket = socket;
        this._socket.on(ConvergenceSocket_ConvergenceSocket.Events.MESSAGE, (event) => {
            this._onSocketMessage(event.message);
        });
        this._socket.on(ConvergenceSocket_ConvergenceSocket.Events.ERROR, (event) => {
            this._onSocketError(event.error);
        });
        this._socket.on(ConvergenceSocket_ConvergenceSocket.Events.CLOSE, (event) => {
            if (this._closeRequested) {
                this._onSocketClosed(event.reason);
            }
            else {
                this._onSocketDropped();
            }
        });
        this._requests = new Map();
    }
    connect() {
        return this._socket.open();
    }
    handshake(reconnectToken) {
        const handshakeRequest = {
            reconnectToken: reconnectToken !== undefined ? { value: reconnectToken } : null,
            client: "JavaScript",
            clientVersion: "1.0.0-rc.4"
        };
        return this.request({ handshakeRequest }).then((response) => {
            const message = response.handshakeResponse;
            const heartbeatHandler = {
                sendPing: () => {
                    this.sendMessage({ ping: {} });
                },
                onTimeout: () => {
                    this.abort("pong timeout");
                }
            };
            this._heartbeatHelper = new HeartbeatHelper_HeartbeatHelper(heartbeatHandler, this._protocolConfig.heartbeatConfig.pingInterval, this._protocolConfig.heartbeatConfig.pongTimeout);
            if (this._protocolConfig.heartbeatConfig.enabled) {
                this._heartbeatHelper.start();
            }
            return message;
        });
    }
    send(message) {
        this.sendMessage(message);
    }
    request(message, timeout) {
        const reqId = this._nextRequestId;
        this._nextRequestId++;
        const replyDeferred = new Deferred_Deferred();
        const requestTimeout = (timeout !== undefined ? timeout : this._protocolConfig.defaultRequestTimeout) * 1000;
        const timeoutTask = setTimeout(() => {
            const req = this._requests.get(reqId);
            if (req) {
                req.replyDeferred.reject(new Error("A request timeout occurred."));
            }
        }, requestTimeout);
        this._requests.set(reqId, { reqId, replyDeferred, timeoutTask });
        this.sendMessage(Object.assign(Object.assign({}, message), { requestId: { value: reqId } }));
        return replyDeferred.promise();
    }
    abort(reason) {
        if (this._heartbeatHelper && this._heartbeatHelper.started) {
            this._heartbeatHelper.stop();
        }
        if (this._socket.isOpen() || this._socket.isConnecting()) {
            this._socket.terminate(reason);
        }
        this._onSocketDropped();
    }
    close() {
        this._closeRequested = true;
        this.removeAllListeners();
        if (this._heartbeatHelper !== undefined && this._heartbeatHelper.started) {
            this._heartbeatHelper.stop();
        }
        this._socket.close();
    }
    sendMessage(message) {
        const logger = !message.ping && !message.pong ? this._messageLogger : this._pingLogger;
        logger.debug(() => "SND: " + JSON.stringify(message));
        try {
            const bytes = ConvergenceMessageIO.encode(message);
            this._socket.send(bytes);
        }
        catch (e) {
            this._onSocketError(e);
            throw e;
        }
    }
    _onSocketMessage(data) {
        const convergenceMessage = ConvergenceMessageIO.decode(data);
        if (this._protocolConfig.heartbeatConfig.enabled && this._heartbeatHelper) {
            this._heartbeatHelper.messageReceived();
        }
        const logger = !convergenceMessage.ping && !convergenceMessage.pong ? this._messageLogger : this._pingLogger;
        logger.debug(() => "RCV: " + JSON.stringify(convergenceMessage));
        if (convergenceMessage.ping) {
            this._onPing();
        }
        else if (convergenceMessage.pong) {
        }
        else if (convergenceMessage.requestId !== undefined) {
            this._onRequest(convergenceMessage);
        }
        else if (convergenceMessage.responseId !== undefined) {
            this._onReply(convergenceMessage);
        }
        else {
            this._onNormalMessage(convergenceMessage);
        }
    }
    _onSocketClosed(reason) {
        if (this._heartbeatHelper && this._heartbeatHelper.started) {
            this._heartbeatHelper.stop();
        }
        const event = { name: ProtocolConnection_ProtocolConnection.Events.CLOSED, reason };
        this._emitEvent(event);
    }
    _onSocketDropped() {
        if (this._heartbeatHelper && this._heartbeatHelper.started) {
            this._heartbeatHelper.stop();
        }
        this._emitEvent({ name: ProtocolConnection_ProtocolConnection.Events.DROPPED });
    }
    _onSocketError(error) {
        const event = { name: ProtocolConnection_ProtocolConnection.Events.ERROR, error };
        this._emitEvent(event);
    }
    _onNormalMessage(message) {
        Promise.resolve().then(() => {
            const event = {
                name: "message",
                request: false,
                message
            };
            this._emitEvent(event);
        });
    }
    _onRequest(message) {
        const requestId = message.requestId.value || 0;
        const event = {
            name: "message",
            request: true,
            callback: new ReplyCallbackImpl(requestId, this),
            message
        };
        this._emitEvent(event);
    }
    _onReply(message) {
        const requestId = message.responseId.value || 0;
        const record = this._requests.get(requestId);
        this._requests.delete(requestId);
        if (record) {
            clearTimeout(record.timeoutTask);
            if (message.error) {
                const errorMessage = message.error;
                record.replyDeferred.reject(new ConvergenceServerError(errorMessage.message, errorMessage.code, errorMessage.details));
            }
            else {
                record.replyDeferred.resolve(message);
            }
        }
    }
    _onPing() {
        this.sendMessage({ pong: {} });
    }
}
ProtocolConnection_ProtocolConnection.Events = {
    MESSAGE: "message",
    ERROR: "error",
    CLOSED: "close",
    DROPPED: "dropped"
};
class ReplyCallbackImpl {
    constructor(reqId, protocolConnection) {
        this._reqId = reqId;
        this._protocolConnection = protocolConnection;
    }
    reply(message) {
        this._protocolConnection.sendMessage(Object.assign(Object.assign({}, message), { responseId: { value: this._reqId } }));
    }
    unknownError() {
        this.unexpectedError("An unknown error has occurred");
    }
    unexpectedError(message) {
        this.expectedError("unknown", message);
    }
    expectedError(code, message, details) {
        details = details || {};
        const error = {
            code,
            message,
            details
        };
        this._protocolConnection.sendMessage({ error, responseId: { value: this._reqId } });
    }
}

// CONCATENATED MODULE: ./src/main/util/ConvergenceErrorCodes.ts

const ConvergenceErrorCodes = {
    AUTHENTICATION_FAILED: "authentication_failed",
    OFFLINE: "offline",
    CHAT_NOT_JOINED: "chat_not_joined"
};
Immutable.make(ConvergenceErrorCodes);

// CONCATENATED MODULE: ./src/main/ConvergenceSession.ts


class ConvergenceSession_ConvergenceSession {
    constructor(domain, connection, user, sessionId, reconnectToken) {
        this._domain = domain;
        this._sessionId = sessionId;
        this._user = user;
        this._reconnectToken = reconnectToken;
        this._connection = connection;
    }
    domain() {
        return this._domain;
    }
    sessionId() {
        return this._sessionId;
    }
    user() {
        return this._user;
    }
    reconnectToken() {
        return this._reconnectToken;
    }
    isAuthenticated() {
        return this._connection.isAuthenticated();
    }
    isConnected() {
        return this._connection.isConnected();
    }
    assertOnline() {
        if (!this.isAuthenticated()) {
            const message = `Cannot perform this action while offline`;
            throw new ConvergenceError(message, ConvergenceErrorCodes.OFFLINE);
        }
    }
    _setSessionId(sessionId) {
        this._sessionId = sessionId;
    }
    _setUser(user) {
        this._user = user;
    }
    _setReconnectToken(reconnectToken) {
        this._reconnectToken = reconnectToken;
    }
}

// CONCATENATED MODULE: ./src/main/identity/DomainUserId.ts
var DomainUserType;
(function (DomainUserType) {
    DomainUserType["NORMAL"] = "normal";
    DomainUserType["CONVERGENCE"] = "convergence";
    DomainUserType["ANONYMOUS"] = "anonymous";
})(DomainUserType || (DomainUserType = {}));
class DomainUserId {
    constructor(userType, username) {
        this.userType = userType;
        this.username = username;
        this._guid = DomainUserId.guid(this.userType, this.username);
        Object.freeze(this);
    }
    static normal(username) {
        return new DomainUserId(DomainUserType.NORMAL, username);
    }
    static anonymous(username) {
        return new DomainUserId(DomainUserType.ANONYMOUS, username);
    }
    static guid(userType, username) {
        return `${userType}:${username}`;
    }
    static toDomainUserId(userId) {
        return (userId instanceof DomainUserId) ? userId : DomainUserId.normal(userId);
    }
    toGuid() {
        return this._guid;
    }
    equals(other) {
        return this.username === other.username && this.userType === other.userType;
    }
}

// CONCATENATED MODULE: ./src/main/identity/DomainUser.ts

class DomainUser_DomainUser {
    constructor(userType, username, firstName, lastName, displayName, email) {
        this.userType = userType;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.displayName = displayName;
        this.email = email;
        this.anonymous = userType === DomainUserType.ANONYMOUS;
        this.convergence = userType === DomainUserType.CONVERGENCE;
        this.normal = userType === DomainUserType.NORMAL;
        this.userId = new DomainUserId(this.userType, this.username);
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/identity/UserGroup.ts
class UserGroup {
    constructor(id, description, members) {
        this.id = id;
        this.description = description;
        this.members = members;
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/identity/IdentityMessageUtils.ts




function toUserFieldCode(field) {
    switch (field) {
        case "username":
            return 1;
        case "email":
            return 2;
        case "firstName":
            return 3;
        case "lastName":
            return 4;
        case "displayName":
            return 5;
        default:
            throw new ConvergenceError("Invalid user field: " + field);
    }
}
function toDomainUser(userData) {
    return new DomainUser_DomainUser(protoToDomainUserType(userData.userId.userType), userData.userId.username, fromOptional(userData.firstName), fromOptional(userData.lastName), fromOptional(userData.displayName), fromOptional(userData.email));
}
function toUserGroup(userData) {
    return new UserGroup(userData.id, userData.description, userData.members ? userData.members.map(m => protoToDomainUserId(m).username) : []);
}

// CONCATENATED MODULE: ./src/main/identity/IdentityService.ts




const validSearchFields = ["username", "email", "firstName", "lastName", "displayName"];
class IdentityService_IdentityService {
    constructor(connection) {
        this._connection = connection;
    }
    session() {
        return this._connection.session();
    }
    profile() {
        return this.user(this._connection.session().user().userId);
    }
    userExists(userId) {
        return this.user(userId).then((user) => user !== undefined);
    }
    user(userId) {
        if (Validation_Validation.isNotSet(userId)) {
            return Promise.reject("Must specify a user id.");
        }
        return this.users([userId]).then((users) => {
            if (users.length === 0) {
                return Promise.resolve(undefined);
            }
            else if (users.length === 1) {
                return Promise.resolve(users[0]);
            }
            else {
                return Promise.reject(new Error("Error getting user."));
            }
        });
    }
    users(users) {
        Validation_Validation.assertArray(users, "users");
        if (users.length === 0) {
            return Promise.resolve([]);
        }
        const guids = users.map((id) => {
            if (!(id instanceof DomainUserId)) {
                return DomainUserId.normal(id);
            }
            return id;
        });
        const unique = Array.from(new Set(guids));
        const message = {
            usersGetRequest: {
                userIds: unique.map(domainUserIdToProto)
            }
        };
        return this._connection
            .request(message)
            .then(mapUserResultList);
    }
    search(query) {
        if (query.fields === undefined || query.fields === null ||
            (Array.isArray(query.fields) && query.fields.length === 0)) {
            return Promise.reject(new Error("Must specify at least one field to search"));
        }
        else if (query.term === undefined || query.term === null) {
            return Promise.reject(new Error("Must specify a search term"));
        }
        else {
            const fields = Array.isArray(query.fields) ? query.fields : [query.fields];
            const orderBy = query.orderBy || {
                field: "username",
                ascending: true
            };
            const fieldCodes = this._processSearchFields(fields);
            const message = {
                userSearchRequest: {
                    fields: fieldCodes,
                    value: query.term,
                    offset: toOptional(query.offset),
                    limit: toOptional(query.limit),
                    orderField: toUserFieldCode(orderBy.field || "username"),
                    ascending: orderBy.ascending
                }
            };
            return this._connection.request(message).then(mapUserResultList);
        }
    }
    groups(ids) {
        Validation_Validation.assertNonEmptyArray(ids, "ids");
        const message = {
            userGroupsRequest: {
                ids
            }
        };
        return this._connection.request(message).then((response) => {
            const { userGroupsResponse } = response;
            return userGroupsResponse.groupData.map(d => toUserGroup(d));
        });
    }
    group(id) {
        return this.groups([id]).then(groups => groups[0]);
    }
    groupsForUser(username) {
        return this.groupsForUsers([username])
            .then(users => users[username]);
    }
    groupsForUsers(usernames) {
        const userIds = usernames.map(u => domainUserIdToProto(DomainUserId.normal(u)));
        const message = {
            userGroupsForUsersRequest: {
                users: userIds
            }
        };
        return this._connection.request(message).then((response) => {
            const { userGroupsForUsersResponse } = response;
            const groupsForUsers = {};
            userGroupsForUsersResponse.userGroups.forEach(userGroupsEntry => {
                if (userGroupsEntry.hasOwnProperty("user")) {
                    let domainUserId = protoToDomainUserId(userGroupsEntry.user);
                    groupsForUsers[domainUserId.username] = userGroupsEntry.groups;
                }
            });
            return groupsForUsers;
        });
    }
    _processSearchFields(fields) {
        const result = [];
        fields.forEach((field) => {
            if (validSearchFields.indexOf(field) < 0) {
                throw new Error("Invalid user search field: " + field);
            }
            const fieldCode = toUserFieldCode(field);
            if (result.indexOf(fieldCode) < 0) {
                result.push(fieldCode);
            }
        });
        return result;
    }
}
function mapUserResultList(response) {
    const { userListResponse } = response;
    const userData = getOrDefaultArray(userListResponse.userData);
    return userData.map(toDomainUser);
}

// CONCATENATED MODULE: ./src/main/identity/index.ts




// CONCATENATED MODULE: ./src/main/connection/ProtocolUtil.ts



function getOrDefaultNumber(val) {
    if (val === null || val === undefined) {
        return 0;
    }
    else if (typeof val === "number") {
        return val;
    }
    else {
        return val.toNumber();
    }
}
function getOrDefaultBoolean(val) {
    return val || false;
}
function getOrDefaultString(val) {
    return val || "";
}
function getOrDefaultArray(val) {
    return val || [];
}
function getOrDefaultObject(val) {
    return val || {};
}
function toOptional(value) {
    if (value === undefined) {
        return null;
    }
    else {
        return { value };
    }
}
function fromOptional(optional) {
    if (optional) {
        return optional.value;
    }
    else {
        return null;
    }
}
function timestampToDate(timestamp) {
    const seconds = getOrDefaultNumber(timestamp.seconds);
    const nanos = getOrDefaultNumber(timestamp.nanos);
    const nanosAsMillis = Math.round(nanos / 1000000);
    const millis = (seconds * 1000) + nanosAsMillis;
    return new Date(millis);
}
function dateToTimestamp(date) {
    const millis = date.getTime();
    const seconds = Math.floor(millis / 1000);
    const nanos = (millis - (seconds * 1000)) * 1000000;
    return { seconds, nanos };
}
function protoValueToJson(value) {
    if (typeof value.nullValue !== "undefined") {
        return null;
    }
    else if (typeof value.boolValue !== "undefined") {
        return getOrDefaultBoolean(value.boolValue);
    }
    else if (typeof value.stringValue !== "undefined") {
        return getOrDefaultString(value.stringValue);
    }
    else if (typeof value.numberValue !== "undefined") {
        return getOrDefaultNumber(value.numberValue);
    }
    else if (typeof value.structValue !== "undefined") {
        return mapObjectValues(getOrDefaultObject(value.structValue.fields), protoValueToJson);
    }
    else if (typeof value.listValue !== "undefined") {
        return getOrDefaultArray(value.listValue.values).map(protoValueToJson);
    }
    else {
        throw new ConvergenceError("Could not deserialize json value: " + JSON.stringify(value));
    }
}
function jsonToProtoValue(value) {
    if (value === null) {
        return { nullValue: 0 };
    }
    else if (typeof value === "boolean") {
        return { boolValue: value };
    }
    else if (typeof value === "string") {
        return { stringValue: value };
    }
    else if (typeof value === "number") {
        return { numberValue: value };
    }
    else if (Array.isArray(value)) {
        return { listValue: { values: value.map(jsonToProtoValue) } };
    }
    else if (value !== undefined && value.constructor === Object) {
        return { structValue: { fields: mapObjectValues(value, jsonToProtoValue) } };
    }
    else {
        throw new ConvergenceError("Can not serialize unknown data type: " + value);
    }
}
function protoToDomainUserId(data) {
    return new DomainUserId(protoToDomainUserType(data.userType), getOrDefaultString(data.username));
}
function domainUserIdToProto(domainUserId) {
    return { userType: domainUserTypeToProto(domainUserId.userType), username: domainUserId.username };
}
function protoToDomainUserType(data) {
    switch (data) {
        case 0:
        case undefined:
            return DomainUserType.NORMAL;
        case 1:
            return DomainUserType.CONVERGENCE;
        case 2:
            return DomainUserType.ANONYMOUS;
    }
}
function domainUserTypeToProto(type) {
    switch (type) {
        case DomainUserType.NORMAL:
            return 0;
        case DomainUserType.CONVERGENCE:
            return 1;
        case DomainUserType.ANONYMOUS:
            return 2;
    }
}

// CONCATENATED MODULE: ./src/main/connection/FallbackAuthCoordinator.ts


class FallbackAuthCoordinator_FallbackAuthCoordinator {
    constructor() {
        this._deferred = new Deferred_Deferred();
        this._canceled = false;
        this._password = null;
        this._jwt = null;
        this._displayName = null;
    }
    challenge() {
        return {
            password: (password) => {
                this._handlePassword(password);
            },
            jwt: (jwt) => {
                this._handleJwt(jwt);
            },
            anonymous: (displayName) => {
                this._handleAnonymous(displayName);
            },
            cancel: () => {
                this._cancel();
            }
        };
    }
    fulfilled() {
        return this._deferred.promise();
    }
    isCompleted() {
        return this._completed;
    }
    isPassword() {
        return this._password !== null;
    }
    isJwt() {
        return this._jwt !== null;
    }
    isAnonymous() {
        return this._displayName !== null;
    }
    isCanceled() {
        return this._canceled;
    }
    getPassword() {
        return this._password;
    }
    getJwt() {
        return this._jwt;
    }
    getDisplayName() {
        return this._displayName;
    }
    _handlePassword(password) {
        this._completed = true;
        this._resolveValue(password).then(p => {
            this._password = p;
            this._deferred.resolve();
        });
    }
    _handleJwt(jwt) {
        this._completed = true;
        this._resolveValue(jwt).then(j => {
            this._jwt = j;
            this._deferred.resolve();
        });
    }
    _handleAnonymous(displayName) {
        this._completed = true;
        this._resolveValue(displayName).then(d => {
            this._displayName = d;
            this._deferred.resolve();
        });
    }
    _cancel() {
        this._completed = true;
        this._canceled = true;
        this._deferred.resolve();
    }
    _resolveValue(val) {
        try {
            if (TypeChecker.isFunction(val)) {
                return Promise.resolve(val());
            }
            else if (TypeChecker.isFunction(val["then"])) {
                return val;
            }
            else {
                return Promise.resolve(val);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}

// CONCATENATED MODULE: ./src/main/connection/AuthenticationMethod.ts
var AuthenticationMethods;
(function (AuthenticationMethods) {
    AuthenticationMethods["ANONYMOUS"] = "anonymous";
    AuthenticationMethods["PASSWORD"] = "password";
    AuthenticationMethods["JWT"] = "jwt";
    AuthenticationMethods["RECONNECT"] = "reconnect";
})(AuthenticationMethods || (AuthenticationMethods = {}));

// CONCATENATED MODULE: ./src/main/util/RandomStringGenerator.ts
class RandomStringGenerator {
    constructor(length, symbols) {
        if (length < 1) {
            throw new Error();
        }
        if (symbols.length < 2) {
            throw new Error();
        }
        this._symbols = symbols;
        this._length = length;
    }
    nextString() {
        let result = "";
        for (let i = 0; i < this._length; i++) {
            result += this._symbols.charAt(Math.floor(Math.random() * this._length));
        }
        return result;
    }
}
RandomStringGenerator.UpperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
RandomStringGenerator.LowerCaseLetters = RandomStringGenerator.UpperCaseLetters.toLowerCase();
RandomStringGenerator.Digits = "0123456789";
RandomStringGenerator.AlphaNumeric = RandomStringGenerator.UpperCaseLetters + RandomStringGenerator.LowerCaseLetters + RandomStringGenerator.Digits;
RandomStringGenerator.Base64 = RandomStringGenerator.AlphaNumeric + "/" + "+";

// CONCATENATED MODULE: ./src/main/connection/ConvergenceConnection.ts














class ConvergenceConnection_ConvergenceConnection extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(url, domain, options) {
        super();
        this._logger = Logging.logger("connection");
        this._onWindowOnline = (_) => {
            this._logger.debug(() => `Browser connectivity changed, restarting connection schedule.`);
            if (this._connectionState === ConnectionState.CONNECTING) {
                this._connectionAttempts = 0;
                this._attemptConnection();
            }
        };
        this._url = url.trim().toLowerCase();
        const urlExpression = /^(https?|wss?):\/{2}.+\/.+\/.+/g;
        if (!urlExpression.test(this._url)) {
            throw new Error(`Invalid domain connection url: ${this._url}`);
        }
        this._options = options;
        this._url = url;
        this._authenticated = false;
        this._connectionAttempts = 0;
        this._connectionState = ConnectionState.DISCONNECTED;
        const initialSessionId = "offline:" + ConvergenceConnection_ConvergenceConnection._SessionIdGenerator.nextString();
        this._session = new ConvergenceSession_ConvergenceSession(domain, this, null, initialSessionId, null);
        if (typeof window !== "undefined") {
            window.addEventListener("online", this._onWindowOnline);
        }
    }
    url() {
        return this._url;
    }
    session() {
        return this._session;
    }
    connect() {
        if (this._connectionState !== ConnectionState.DISCONNECTED &&
            this._connectionState !== ConnectionState.INTERRUPTED) {
            throw new Error("Can only call connect on a disconnected or interrupted connection.");
        }
        this._connectionAttempts = 0;
        this._connectionDeferred = new Deferred_Deferred();
        this._connectionState = ConnectionState.CONNECTING;
        this._attemptConnection();
        return this._connectionDeferred.promise();
    }
    disconnect() {
        if (this._connectionTimeoutTask !== null) {
            clearTimeout(this._connectionTimeoutTask);
            this._connectionTimeoutTask = null;
        }
        if (this._connectionAttemptTask !== null) {
            clearTimeout(this._connectionAttemptTask);
            this._connectionAttemptTask = null;
        }
        if (this._connectionDeferred !== null) {
            this._connectionDeferred.reject(new Error("Connection canceled by user"));
            this._connectionDeferred = null;
        }
        if (this._connectionState === ConnectionState.DISCONNECTED) {
            throw new Error("Connection is already disconnected.");
        }
        else {
            this._connectionState = ConnectionState.DISCONNECTING;
            this._authenticated = false;
            this._protocolConnection.close();
            this._handleDisconnected();
            if (typeof window !== "undefined") {
                window.removeEventListener("online", this._onWindowOnline);
            }
        }
    }
    reconnect() {
        if (this._connectionState !== ConnectionState.INTERRUPTED &&
            this._connectionState !== ConnectionState.DISCONNECTED) {
            throw new Error("Can only call reconnect on an disconnected connection.");
        }
        return this
            .connect()
            .then(() => this.authenticateWithReconnectToken(this._session.reconnectToken()))
            .then(() => {
            return;
        });
    }
    isConnected() {
        return this._connectionState === ConnectionState.CONNECTED;
    }
    isDisconnected() {
        return this._connectionState === ConnectionState.DISCONNECTED;
    }
    isAuthenticated() {
        return this._authenticated;
    }
    isOnline() {
        return this.isAuthenticated();
    }
    send(message) {
        this._protocolConnection.send(message);
    }
    request(message, timeout) {
        return this._protocolConnection.request(message, timeout);
    }
    authenticateWithPassword(credentials) {
        const message = {
            username: credentials.username,
            password: credentials.password
        };
        return this._authenticate({ password: message });
    }
    authenticateWithJwt(jwt) {
        const message = { jwt };
        return this._authenticate({ jwt: message });
    }
    authenticateWithReconnectToken(token) {
        const message = { token };
        return this
            ._authenticate({ reconnect: message })
            .catch((e) => {
            if (e instanceof ConvergenceError && e.code === ConvergenceErrorCodes.AUTHENTICATION_FAILED) {
                if (TypeChecker.isFunction(this._options.fallbackAuth)) {
                    const authCoordinator = new FallbackAuthCoordinator_FallbackAuthCoordinator();
                    this._options.fallbackAuth(authCoordinator.challenge());
                    if (!authCoordinator.isCompleted()) {
                        return Promise.reject(new Error("You must call one of the auth challenge methods."));
                    }
                    authCoordinator.fulfilled().then(() => {
                        if (authCoordinator.isPassword()) {
                            const username = this.session().user().username;
                            const password = authCoordinator.getPassword();
                            return this.authenticateWithPassword({ username, password });
                        }
                        else if (authCoordinator.isJwt()) {
                            return this.authenticateWithJwt(authCoordinator.getJwt());
                        }
                        else if (authCoordinator.isAnonymous()) {
                            return this.authenticateAnonymously(authCoordinator.getDisplayName());
                        }
                        else if (authCoordinator.isCanceled()) {
                            return Promise.reject(e);
                        }
                        else {
                            return Promise.reject(e);
                        }
                    });
                }
                else {
                    return Promise.resolve(e);
                }
            }
            else {
                return Promise.resolve(e);
            }
        });
    }
    authenticateAnonymously(displayName) {
        const message = {
            displayName: toOptional(displayName)
        };
        return this._authenticate({ anonymous: message });
    }
    messages() {
        return this
            .events()
            .pipe(Object(external_rxjs_operators_["filter"])(e => e.name === "message"));
    }
    _authenticate(authRequest) {
        if (this._session.isAuthenticated()) {
            return Promise.reject(new ConvergenceError("User already authenticated."));
        }
        else if (this.isConnected()) {
            return this._sendAuthRequest(authRequest);
        }
        else if (this._connectionDeferred != null) {
            return this._connectionDeferred.promise().then(() => {
                return this._sendAuthRequest(authRequest);
            });
        }
        else {
            return Promise.reject(new ConvergenceError("Must be connected or connecting to authenticate."));
        }
    }
    _sendAuthRequest(authenticationRequest) {
        let method = null;
        if (authenticationRequest.anonymous) {
            method = AuthenticationMethods.ANONYMOUS;
        }
        else if (authenticationRequest.password) {
            method = AuthenticationMethods.PASSWORD;
        }
        else if (authenticationRequest.jwt) {
            method = AuthenticationMethods.JWT;
        }
        else if (authenticationRequest.reconnect) {
            method = AuthenticationMethods.RECONNECT;
        }
        const authenticatingEvent = { name: ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATING, method };
        this._emitEvent(authenticatingEvent);
        return this
            .request({ authenticationRequest })
            .then((response) => {
            const authResponse = response.authenticationResponse;
            if (authResponse.success) {
                const success = authResponse.success;
                this._session._setUser(toDomainUser(success.user));
                this._session._setSessionId(success.sessionId);
                this._session._setReconnectToken(success.reconnectToken);
                this._authenticated = true;
                const authenticatedEvent = {
                    name: ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATED,
                    method,
                    state: getOrDefaultObject(success.presenceState)
                };
                this._emitEvent(authenticatedEvent);
                return Promise.resolve();
            }
            else {
                const authenticationFailedEvent = {
                    name: ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATION_FAILED,
                    method
                };
                this._emitEvent(authenticationFailedEvent);
                return Promise.reject(new ConvergenceError("Authentication failed", ConvergenceErrorCodes.AUTHENTICATION_FAILED));
            }
        });
    }
    _attemptConnection() {
        if (this._connectionAttemptTask !== null) {
            clearTimeout(this._connectionAttemptTask);
            this._connectionAttemptTask = null;
        }
        this._connectionAttempts++;
        this._logger.debug(() => `Attempting to open web socket connection to: ${this._url}`);
        const timeoutTask = () => {
            this._protocolConnection.abort("connection timeout exceeded");
        };
        const timeout = this._options.connectionTimeout * 1000;
        this._connectionTimeoutTask = setTimeout(timeoutTask, timeout);
        this._emitEvent({ name: ConvergenceConnection_ConvergenceConnection.Events.CONNECTING });
        const socket = new ConvergenceSocket_ConvergenceSocket(this._url, this._options.webSocketClass, this._options.webSocketFactory);
        this._protocolConnection = new ProtocolConnection_ProtocolConnection(socket, {
            defaultRequestTimeout: this._options.defaultRequestTimeout,
            heartbeatConfig: {
                enabled: this._options.heartbeatEnabled,
                pingInterval: this._options.pingInterval,
                pongTimeout: this._options.pongTimeout
            }
        });
        this._protocolConnection
            .events()
            .subscribe(e => {
            switch (e.name) {
                case ProtocolConnection_ProtocolConnection.Events.ERROR: {
                    const errorEvent = e;
                    const event = { name: ConvergenceConnection_ConvergenceConnection.Events.ERROR, error: errorEvent.error };
                    this._emitEvent(event);
                    break;
                }
                case ProtocolConnection_ProtocolConnection.Events.DROPPED: {
                    this._handleInterrupted();
                    break;
                }
                case ProtocolConnection_ProtocolConnection.Events.CLOSED: {
                    this._handleDisconnected();
                    break;
                }
                case ProtocolConnection_ProtocolConnection.Events.MESSAGE: {
                    const messageEvent = e;
                    const event = {
                        name: ConvergenceConnection_ConvergenceConnection.Events.MESSAGE,
                        request: messageEvent.request,
                        callback: messageEvent.callback,
                        message: messageEvent.message
                    };
                    this._emitEvent(event);
                    break;
                }
            }
        });
        this._protocolConnection
            .connect()
            .then(() => {
            this._logger.debug("Connection succeeded, handshaking.");
            return this._protocolConnection
                .handshake()
                .then((handshakeResponse) => {
                clearTimeout(this._connectionTimeoutTask);
                if (this._connectionDeferred === null) {
                    return;
                }
                if (handshakeResponse.success) {
                    this._connectionState = ConnectionState.CONNECTED;
                    this._emitEvent({ name: ConvergenceConnection_ConvergenceConnection.Events.CONNECTED });
                    this._connectionDeferred.resolve();
                    this._connectionDeferred = null;
                    this._connectionAttempts = 0;
                }
                else {
                    this._emitEvent({ name: ConvergenceConnection_ConvergenceConnection.Events.CONNECTION_FAILED });
                    this._protocolConnection.close();
                    if (handshakeResponse.retryOk) {
                        this._scheduleConnection();
                    }
                    else {
                        this._handleDisconnected();
                        this._connectionDeferred.reject(new ConvergenceError(handshakeResponse.error.details, handshakeResponse.error.code));
                        this._connectionDeferred = null;
                    }
                }
            })
                .catch((e) => {
                this._logger.error("Handshake failed", e);
                this._protocolConnection.close();
                this._protocolConnection = null;
                return Promise.reject(e);
            });
        })
            .catch((_) => {
            clearTimeout(this._connectionTimeoutTask);
            this._emitEvent({ name: ConvergenceConnection_ConvergenceConnection.Events.CONNECTION_FAILED });
            this._scheduleConnection();
        });
    }
    _scheduleConnection() {
        if (this._connectionState === ConnectionState.CONNECTING) {
            const idx = Math.min(this._connectionAttempts, this._options.reconnectIntervals.length - 1);
            const delay = this._options.reconnectIntervals[idx];
            this._logger.debug(() => `Scheduling web socket connection in ${delay} seconds.`);
            const event = { name: ConvergenceConnection_ConvergenceConnection.Events.CONNECTION_SCHEDULED, delay };
            this._emitEvent(event);
            this._connectionAttemptTask = setTimeout(() => this._attemptConnection(), delay * 1000);
        }
    }
    _handleDisconnected() {
        this._connectionState = ConnectionState.DISCONNECTED;
        this._emitEvent({ name: ConvergenceConnection_ConvergenceConnection.Events.DISCONNECTED });
    }
    _handleInterrupted() {
        this._authenticated = false;
        this._connectionState = ConnectionState.INTERRUPTED;
        this._emitEvent({ name: ConvergenceConnection_ConvergenceConnection.Events.INTERRUPTED });
        if (this._options.autoReconnect && this._session.reconnectToken()) {
            this
                .reconnect()
                .catch(e => this._logger.error("Unexpected error reconnecting", e));
        }
    }
}
ConvergenceConnection_ConvergenceConnection.Events = {
    MESSAGE: "message",
    CONNECTION_SCHEDULED: "connection_scheduled",
    CONNECTING: "connecting",
    CONNECTED: "connected",
    CONNECTION_FAILED: "connection_failed",
    AUTHENTICATING: "authenticating",
    AUTHENTICATED: "authenticated",
    AUTHENTICATION_FAILED: "authentication_failed",
    INTERRUPTED: "interrupted",
    DISCONNECTED: "disconnected",
    ERROR: "error"
};
ConvergenceConnection_ConvergenceConnection._SessionIdGenerator = new RandomStringGenerator(32, RandomStringGenerator.AlphaNumeric);
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["DISCONNECTED"] = 0] = "DISCONNECTED";
    ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState[ConnectionState["CONNECTED"] = 2] = "CONNECTED";
    ConnectionState[ConnectionState["INTERRUPTED"] = 3] = "INTERRUPTED";
    ConnectionState[ConnectionState["DISCONNECTING"] = 4] = "DISCONNECTING";
})(ConnectionState || (ConnectionState = {}));

// CONCATENATED MODULE: ./src/main/model/ot/ops/Operation.ts
class Operation {
    constructor(type) {
        this.type = type;
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/OperationType.ts
const types = {
    COMPOUND: "Compound",
    ARRAY_INSERT: "ArrayInsert",
    ARRAY_REORDER: "ArrayReorder",
    ARRAY_REMOVE: "ArrayRemove",
    ARRAY_SET: "ArraySet",
    ARRAY_VALUE: "ArrayValue",
    BOOLEAN_VALUE: "BooleanValue",
    NUMBER_DELTA: "NumberDelta",
    NUMBER_VALUE: "NumberValue",
    OBJECT_ADD: "ObjectAdd",
    OBJECT_REMOVE: "ObjectRemove",
    OBJECT_SET: "ObjectSet",
    OBJECT_VALUE: "ObjectValue",
    STRING_INSERT: "StringInsert",
    STRING_REMOVE: "StringRemove",
    STRING_VALUE: "StringValue",
    DATE_VALUE: "DateValue"
};
Object.freeze(types);
const OperationType = types;

// CONCATENATED MODULE: ./src/main/model/ot/ops/CompoundOperation.ts



class CompoundOperation_CompoundOperation extends Operation {
    constructor(ops) {
        super(OperationType.COMPOUND);
        this.ops = ops;
        Object.freeze(this);
    }
    copy(updates) {
        return new CompoundOperation_CompoundOperation(Immutable.update(this.ops, updates.ops));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/OperationPair.ts
class OperationPair {
    constructor(serverOp, clientOp) {
        this.serverOp = serverOp;
        this.clientOp = clientOp;
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/OperationTransformer.ts


class OperationTransformer_OperationTransformer {
    constructor(tfr) {
        this._tfr = tfr;
    }
    transform(s, c) {
        if (s instanceof CompoundOperation_CompoundOperation) {
            return this.transformServerCompoundOperation(s, c);
        }
        else if (c instanceof CompoundOperation_CompoundOperation) {
            return this.transformClientCompoundOperation(s, c);
        }
        else {
            return this.transformTwoDiscreteOps(s, c);
        }
    }
    transformClientCompoundOperation(s, c) {
        let xFormedS = s;
        const newOps = c.ops.map((o) => {
            const opPair = this.transform(xFormedS, o);
            xFormedS = opPair.serverOp;
            return opPair.clientOp;
        });
        return new OperationPair(xFormedS, new CompoundOperation_CompoundOperation(newOps));
    }
    transformServerCompoundOperation(s, c) {
        let xFormedC = c;
        const newOps = s.ops.map((o) => {
            const opPair = this.transform(o, xFormedC);
            xFormedC = opPair.clientOp;
            return opPair.serverOp;
        });
        return new OperationPair(new CompoundOperation_CompoundOperation(newOps), xFormedC);
    }
    transformTwoDiscreteOps(s, c) {
        if (s.noOp || c.noOp) {
            return new OperationPair(s, c);
        }
        else if (s.id === c.id) {
            return this.transformIdenticalPathOperations(s, c);
        }
        else {
            return new OperationPair(s, c);
        }
    }
    transformIdenticalPathOperations(s, c) {
        const tf = this._tfr.getOperationTransformationFunction(s, c);
        if (tf) {
            return tf(s, c);
        }
        else {
            throw new Error(`No function found for: (${s.type},${s.type})`);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayInsertInsertOTF.ts

const ArrayInsertInsertOTF = (s, c) => {
    if (s.index <= c.index) {
        return new OperationPair(s, c.copy({ index: c.index + 1 }));
    }
    else {
        return new OperationPair(s.copy({ index: s.index + 1 }), c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayInsertRemoveOTF.ts

const ArrayInsertRemoveOTF = (s, c) => {
    if (s.index <= c.index) {
        return new OperationPair(s, c.copy({ index: c.index + 1 }));
    }
    else {
        return new OperationPair(s.copy({ index: s.index - 1 }), c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayInsertReplaceOTF.ts

const ArrayInsertReplaceOTF = (s, c) => {
    if (s.index <= c.index) {
        return new OperationPair(s, c.copy({ index: c.index + 1 }));
    }
    else {
        return new OperationPair(s, c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/util/RangeRelationshipUtil.ts
class RangeRelationshipUtil {
    static getRangeIndexRelationship(rStart, rEnd, index) {
        if (index < rStart) {
            return RangeIndexRelationship.Before;
        }
        else if (index > rEnd) {
            return RangeIndexRelationship.After;
        }
        else if (index === rStart) {
            return RangeIndexRelationship.Start;
        }
        else if (index === rEnd) {
            return RangeIndexRelationship.End;
        }
        else {
            return RangeIndexRelationship.Within;
        }
    }
    static getRangeRangeRelationship(sStart, sEnd, cStart, cEnd) {
        if (sStart === cStart) {
            if (sEnd === cEnd) {
                return RangeRangeRelationship.EqualTo;
            }
            else if (cEnd > sEnd) {
                return RangeRangeRelationship.Starts;
            }
            else {
                return RangeRangeRelationship.StartedBy;
            }
        }
        else if (sStart > cStart) {
            if (sStart > cEnd) {
                return RangeRangeRelationship.PrecededBy;
            }
            else if (cEnd === sEnd) {
                return RangeRangeRelationship.Finishes;
            }
            else if (sEnd < cEnd) {
                return RangeRangeRelationship.ContainedBy;
            }
            else if (sStart === cEnd) {
                return RangeRangeRelationship.MetBy;
            }
            else {
                return RangeRangeRelationship.OverlappedBy;
            }
        }
        else {
            if (sEnd < cStart) {
                return RangeRangeRelationship.Precedes;
            }
            else if (cEnd === sEnd) {
                return RangeRangeRelationship.FinishedBy;
            }
            else if (sEnd > cEnd) {
                return RangeRangeRelationship.Contains;
            }
            else if (sEnd === cStart) {
                return RangeRangeRelationship.Meets;
            }
            else {
                return RangeRangeRelationship.Overlaps;
            }
        }
    }
}
var RangeIndexRelationship;
(function (RangeIndexRelationship) {
    RangeIndexRelationship[RangeIndexRelationship["Before"] = 0] = "Before";
    RangeIndexRelationship[RangeIndexRelationship["Start"] = 1] = "Start";
    RangeIndexRelationship[RangeIndexRelationship["Within"] = 2] = "Within";
    RangeIndexRelationship[RangeIndexRelationship["End"] = 3] = "End";
    RangeIndexRelationship[RangeIndexRelationship["After"] = 4] = "After";
})(RangeIndexRelationship || (RangeIndexRelationship = {}));
var RangeRangeRelationship;
(function (RangeRangeRelationship) {
    RangeRangeRelationship[RangeRangeRelationship["Precedes"] = 0] = "Precedes";
    RangeRangeRelationship[RangeRangeRelationship["PrecededBy"] = 1] = "PrecededBy";
    RangeRangeRelationship[RangeRangeRelationship["Meets"] = 2] = "Meets";
    RangeRangeRelationship[RangeRangeRelationship["MetBy"] = 3] = "MetBy";
    RangeRangeRelationship[RangeRangeRelationship["Overlaps"] = 4] = "Overlaps";
    RangeRangeRelationship[RangeRangeRelationship["OverlappedBy"] = 5] = "OverlappedBy";
    RangeRangeRelationship[RangeRangeRelationship["Starts"] = 6] = "Starts";
    RangeRangeRelationship[RangeRangeRelationship["StartedBy"] = 7] = "StartedBy";
    RangeRangeRelationship[RangeRangeRelationship["Contains"] = 8] = "Contains";
    RangeRangeRelationship[RangeRangeRelationship["ContainedBy"] = 9] = "ContainedBy";
    RangeRangeRelationship[RangeRangeRelationship["Finishes"] = 10] = "Finishes";
    RangeRangeRelationship[RangeRangeRelationship["FinishedBy"] = 11] = "FinishedBy";
    RangeRangeRelationship[RangeRangeRelationship["EqualTo"] = 12] = "EqualTo";
})(RangeRangeRelationship || (RangeRangeRelationship = {}));

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayMoveHelper.ts

class ArrayMoveHelper_ArrayMoveHelper {
    static isForwardMove(op) {
        return op.fromIndex < op.toIndex;
    }
    static isBackwardMoveMove(op) {
        return op.fromIndex > op.toIndex;
    }
    static isIdentityMove(op) {
        return op.fromIndex === op.toIndex;
    }
    static getMoveDirection(op) {
        if (this.isForwardMove(op)) {
            return MoveDirection.Forward;
        }
        else if (this.isBackwardMoveMove(op)) {
            return MoveDirection.Backward;
        }
        else {
            return MoveDirection.Identity;
        }
    }
    static indexBeforeRange(op, index) {
        return index < this.getRangeMin(op);
    }
    static indexAfterRange(op, index) {
        return index > this.getRangeMax(op);
    }
    static indexWithinRange(op, index) {
        return index > this.getRangeMin(op) && index < this.getRangeMax(op);
    }
    static getRangeIndexRelationship(op, index) {
        return RangeRelationshipUtil.getRangeIndexRelationship(this.getRangeMin(op), this.getRangeMax(op), index);
    }
    static getRangeRelationship(op1, op2) {
        return RangeRelationshipUtil.getRangeRangeRelationship(this.getRangeMin(op1), this.getRangeMax(op1), this.getRangeMin(op2), this.getRangeMax(op2));
    }
    static getRangeMin(op) {
        return Math.min(op.fromIndex, op.toIndex);
    }
    static getRangeMax(op) {
        return Math.max(op.fromIndex, op.toIndex);
    }
}
var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["Forward"] = 0] = "Forward";
    MoveDirection[MoveDirection["Backward"] = 1] = "Backward";
    MoveDirection[MoveDirection["Identity"] = 2] = "Identity";
})(MoveDirection || (MoveDirection = {}));

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayInsertMoveOTF.ts



const ArrayInsertMoveOTF = (s, c) => {
    switch (ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(c)) {
        case MoveDirection.Forward:
            return transformAgainstForwardMove(s, c);
        case MoveDirection.Backward:
            return transformAgainstBackwardMove(s, c);
        case MoveDirection.Identity:
            return transformAgainstIdentityMove(s, c);
        default:
            throw new Error("Invalid move direction");
    }
};
function transformAgainstForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.Start:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ index: s.index - 1 }), c.copy({ toIndex: c.toIndex + 1 }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function transformAgainstBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.Start:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ index: s.index + 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function transformAgainstIdentityMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayInsertSetOTF.ts

const ArrayInsertSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayRemoveInsertOTF.ts

const ArrayRemoveInsertOTF = (s, c) => {
    if (s.index < c.index) {
        return new OperationPair(s, c.copy({ index: c.index - 1 }));
    }
    else {
        return new OperationPair(s.copy({ index: s.index + 1 }), c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayRemoveRemoveOTF.ts

const ArrayRemoveRemoveOTF = (s, c) => {
    if (s.index === c.index) {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
    else if (s.index < c.index) {
        return new OperationPair(s, c.copy({ index: c.index - 1 }));
    }
    else {
        return new OperationPair(s.copy({ index: s.index - 1 }), c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/ops/DiscreteOperation.ts

class DiscreteOperation_DiscreteOperation extends Operation {
    constructor(type, id, noOp) {
        super(type);
        this.id = id;
        this.noOp = noOp;
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/ArrayInsertOperation.ts



class ArrayInsertOperation_ArrayInsertOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.ARRAY_INSERT, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new ArrayInsertOperation_ArrayInsertOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.index, updates.index), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayRemoveReplaceOTF.ts


const ArrayRemoveReplaceOTF = (s, c) => {
    if (s.index < c.index) {
        return new OperationPair(s, c.copy({ index: c.index - 1 }));
    }
    else if (s.index === c.index) {
        return new OperationPair(s.copy({ noOp: true }), new ArrayInsertOperation_ArrayInsertOperation(c.id, c.noOp, c.index, c.value));
    }
    else {
        return new OperationPair(s, c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayRemoveMoveOTF.ts



const ArrayRemoveMoveOTF = (s, c) => {
    switch (ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(c)) {
        case MoveDirection.Forward:
            return ArrayRemoveMoveOTF_transformAgainstForwardMove(s, c);
        case MoveDirection.Backward:
            return ArrayRemoveMoveOTF_transformAgainstBackwardMove(s, c);
        case MoveDirection.Identity:
            return ArrayRemoveMoveOTF_transformAgainstIdentityMove(s, c);
        default:
            throw new Error("Invalid move direction");
    }
};
function ArrayRemoveMoveOTF_transformAgainstForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ index: c.toIndex }), c.copy({ noOp: true }));
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ index: s.index - 1 }), c.copy({ toIndex: c.toIndex - 1 }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayRemoveMoveOTF_transformAgainstBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
            return new OperationPair(s.copy({ index: s.index + 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ index: c.toIndex }), c.copy({ noOp: true }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayRemoveMoveOTF_transformAgainstIdentityMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s, c.copy({ noOp: true }));
        default:
            return new OperationPair(s, c);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayRemoveSetOTF.ts

const ArrayRemoveSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayReplaceInsertOTF.ts

const ArrayReplaceInsertOTF = (s, c) => {
    if (s.index < c.index) {
        return new OperationPair(s, c);
    }
    else {
        return new OperationPair(s.copy({ index: s.index + 1 }), c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayReplaceRemoveOTF.ts


const ArrayReplaceRemoveOTF = (s, c) => {
    if (s.index < c.index) {
        return new OperationPair(s, c);
    }
    else if (s.index === c.index) {
        return new OperationPair(new ArrayInsertOperation_ArrayInsertOperation(s.id, s.noOp, s.index, s.value), c.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s.copy({ index: s.index - 1 }), c);
    }
};

// CONCATENATED MODULE: ./src/main/util/EqualsUtil.ts
class EqualsUtil {
    static deepEquals(x, y) {
        let p;
        if (isNaN(x) && isNaN(y) && typeof x === "number" && typeof y === "number") {
            return true;
        }
        if (x === y) {
            return true;
        }
        if ((typeof x === "function" && typeof y === "function") ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }
        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }
        if (x.constructor !== y.constructor) {
            return false;
        }
        if (x.prototype !== y.prototype) {
            return false;
        }
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }
        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }
            else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
            switch (typeof (x[p])) {
                case "object":
                case "function":
                    if (!this.deepEquals(x[p], y[p])) {
                        return false;
                    }
                    break;
                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayReplaceReplaceOTF.ts


const ArrayReplaceReplaceOTF = (s, c) => {
    if (s.index !== c.index) {
        return new OperationPair(s, c);
    }
    else if (!EqualsUtil.deepEquals(s.value, c.value)) {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayReplaceMoveOTF.ts



const ArrayReplaceMoveOTF = (s, c) => {
    switch (ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(c)) {
        case MoveDirection.Forward:
            return ArrayReplaceMoveOTF_transformAgainstForwardMove(s, c);
        case MoveDirection.Backward:
            return ArrayReplaceMoveOTF_transformAgainstBackwardMove(s, c);
        case MoveDirection.Identity:
            return ArrayReplaceMoveOTF_transformAgainstIdentityMove(s, c);
        default:
            throw new Error("Invalid move direction");
    }
};
function ArrayReplaceMoveOTF_transformAgainstForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ index: c.toIndex }), c);
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ index: s.index - 1 }), c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayReplaceMoveOTF_transformAgainstBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ index: c.toIndex }), c);
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ index: s.index + 1 }), c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayReplaceMoveOTF_transformAgainstIdentityMove(s, c) {
    "use strict";
    return new OperationPair(s, c);
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayReplaceSetOTF.ts

const ArrayReplaceSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayMoveInsertOTF.ts



const ArrayMoveInsertOTF = (s, c) => {
    switch (ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(s)) {
        case MoveDirection.Forward:
            return ArrayMoveInsertOTF_transformAgainstForwardMove(s, c);
        case MoveDirection.Backward:
            return ArrayMoveInsertOTF_transformAgainstBackwardMove(s, c);
        case MoveDirection.Identity:
            return ArrayMoveInsertOTF_transformAgainstIdentityMove(s, c);
        default:
            throw new Error("Invalid move direction");
    }
};
function ArrayMoveInsertOTF_transformAgainstForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ toIndex: s.toIndex + 1 }), c.copy({ index: c.index - 1 }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayMoveInsertOTF_transformAgainstBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ index: c.index + 1 }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayMoveInsertOTF_transformAgainstIdentityMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayMoveRemoveOTF.ts



const ArrayMoveRemoveOTF = (s, c) => {
    switch (ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(s)) {
        case MoveDirection.Forward:
            return ArrayMoveRemoveOTF_transformAgainstForwardMove(s, c);
        case MoveDirection.Backward:
            return ArrayMoveRemoveOTF_transformAgainstBackwardMove(s, c);
        case MoveDirection.Identity:
            return ArrayMoveRemoveOTF_transformAgainstIdentityMove(s, c);
        default:
            throw new Error("Invalid move direction");
    }
};
function ArrayMoveRemoveOTF_transformAgainstForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ index: s.toIndex }));
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ toIndex: s.toIndex - 1 }), c.copy({ index: c.index - 1 }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayMoveRemoveOTF_transformAgainstBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ index: c.index + 1 }));
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ index: s.toIndex }));
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayMoveRemoveOTF_transformAgainstIdentityMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ noOp: true }), c);
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayMoveReplaceOTF.ts



const ArrayMoveReplaceOTF = (s, c) => {
    switch (ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(s)) {
        case MoveDirection.Forward:
            return ArrayMoveReplaceOTF_transformAgainstForwardMove(s, c);
        case MoveDirection.Backward:
            return ArrayMoveReplaceOTF_transformAgainstBackwardMove(s, c);
        case MoveDirection.Identity:
            return ArrayMoveReplaceOTF_transformAgainstIdentityMove(s, c);
        default:
            throw new Error("Invalid move direction");
    }
};
function ArrayMoveReplaceOTF_transformAgainstForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.Start:
            return new OperationPair(s, c.copy({ index: s.toIndex }));
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s, c.copy({ index: c.index - 1 }));
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayMoveReplaceOTF_transformAgainstBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.index)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.End:
            return new OperationPair(s, c.copy({ index: s.toIndex }));
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
            return new OperationPair(s, c.copy({ index: c.index + 1 }));
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function ArrayMoveReplaceOTF_transformAgainstIdentityMove(s, c) {
    "use strict";
    return new OperationPair(s, c);
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayMoveMoveOTF.ts



const ArrayMoveMoveOTF = (s, c) => {
    const sMoveType = ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(s);
    const cMoveType = ArrayMoveHelper_ArrayMoveHelper.getMoveDirection(c);
    if (sMoveType === MoveDirection.Forward) {
        if (cMoveType === MoveDirection.Forward) {
            return transformServerForwardMoveWithClientForwardMove(s, c);
        }
        else if (cMoveType === MoveDirection.Backward) {
            return transformServerForwardMoveWithClientBackwardMove(s, c);
        }
        else {
            return transformServerForwardMoveWithClientIdentityMove(s, c);
        }
    }
    else if (sMoveType === MoveDirection.Backward) {
        if (cMoveType === MoveDirection.Forward) {
            return transformServerBackwardMoveWithClientForwardMove(s, c);
        }
        else if (cMoveType === MoveDirection.Backward) {
            return transformServerBackwardMoveWithClientBackwardMove(s, c);
        }
        else {
            return transformServerBackwardMoveWithClientIdentityMove(s, c);
        }
    }
    else {
        if (cMoveType === MoveDirection.Forward) {
            return transformServerIdentityMoveWithClientForwardMove(s, c);
        }
        else if (cMoveType === MoveDirection.Backward) {
            return transformServerIdentityMoveWithClientBackwardMove(s, c);
        }
        else {
            return transformServerIdentityMoveWithClientIdentityMove(s, c);
        }
    }
};
function transformServerForwardMoveWithClientForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeRelationship(s, c)) {
        case RangeRangeRelationship.Precedes:
            return new OperationPair(s, c);
        case RangeRangeRelationship.PrecededBy:
            return new OperationPair(s, c);
        case RangeRangeRelationship.Meets:
            return new OperationPair(s.copy({ toIndex: s.toIndex - 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        case RangeRangeRelationship.MetBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.Overlaps:
            return new OperationPair(s.copy({ toIndex: s.toIndex - 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        case RangeRangeRelationship.OverlappedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.Starts:
            return new OperationPair(s.copy({ fromIndex: c.toIndex }), c.copy({ noOp: true }));
        case RangeRangeRelationship.StartedBy:
            return new OperationPair(s.copy({ fromIndex: c.toIndex }), c.copy({ noOp: true }));
        case RangeRangeRelationship.Contains:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.ContainedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        case RangeRangeRelationship.Finishes:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.FinishedBy:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.EqualTo:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
        default:
            throw new Error("Invalid range-range relationship");
    }
}
function transformServerForwardMoveWithClientBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeRelationship(s, c)) {
        case RangeRangeRelationship.Precedes:
            return new OperationPair(s, c);
        case RangeRangeRelationship.PrecededBy:
            return new OperationPair(s, c);
        case RangeRangeRelationship.Meets:
            return new OperationPair(s.copy({ toIndex: s.toIndex + 1 }), c.copy({ toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.MetBy:
            return new OperationPair(s.copy({ fromIndex: c.toIndex }), c.copy({ noOp: true }));
        case RangeRangeRelationship.Overlaps:
            return new OperationPair(s.copy({ toIndex: s.toIndex + 1 }), c.copy({ toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.OverlappedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        case RangeRangeRelationship.Starts:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeRangeRelationship.StartedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        case RangeRangeRelationship.Contains:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.ContainedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeRangeRelationship.Finishes:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        case RangeRangeRelationship.FinishedBy:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        case RangeRangeRelationship.EqualTo:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ fromIndex: c.fromIndex - 1 }));
        default:
            throw new Error("Invalid range-range relationship");
    }
}
function transformServerForwardMoveWithClientIdentityMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.fromIndex)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.Start:
            return new OperationPair(s, c.copy({ fromIndex: s.toIndex, toIndex: s.toIndex }));
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex - 1, toIndex: c.toIndex - 1 }));
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function transformServerBackwardMoveWithClientForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeRelationship(s, c)) {
        case RangeRangeRelationship.Precedes:
            return new OperationPair(s, c);
        case RangeRangeRelationship.PrecededBy:
            return new OperationPair(s, c);
        case RangeRangeRelationship.Meets:
            return new OperationPair(s.copy({ fromIndex: c.toIndex }), c.copy({ noOp: true }));
        case RangeRangeRelationship.MetBy:
            return new OperationPair(s.copy({ toIndex: s.toIndex - 1 }), c.copy({ toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.Overlaps:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        case RangeRangeRelationship.OverlappedBy:
            return new OperationPair(s.copy({ toIndex: s.toIndex - 1 }), c.copy({ toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.Starts:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        case RangeRangeRelationship.StartedBy:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.Contains:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.ContainedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        case RangeRangeRelationship.Finishes:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        case RangeRangeRelationship.FinishedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        case RangeRangeRelationship.EqualTo:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        default:
            throw new Error("Invalid range-range relationship");
    }
}
function transformServerBackwardMoveWithClientBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeRelationship(s, c)) {
        case RangeRangeRelationship.Precedes:
            return new OperationPair(s, c);
        case RangeRangeRelationship.PrecededBy:
            return new OperationPair(s, c);
        case RangeRangeRelationship.Meets:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.MetBy:
            return new OperationPair(s.copy({ toIndex: s.toIndex + 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        case RangeRangeRelationship.Overlaps:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1 }), c.copy({ toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.OverlappedBy:
            return new OperationPair(s.copy({ toIndex: s.toIndex + 1 }), c.copy({ fromIndex: c.fromIndex + 1 }));
        case RangeRangeRelationship.Starts:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeRangeRelationship.StartedBy:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.Contains:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeRangeRelationship.ContainedBy:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeRangeRelationship.Finishes:
            return new OperationPair(s.copy({ fromIndex: c.toIndex }), c.copy({ noOp: true }));
        case RangeRangeRelationship.FinishedBy:
            return new OperationPair(s.copy({ fromIndex: c.toIndex }), c.copy({ noOp: true }));
        case RangeRangeRelationship.EqualTo:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
        default:
            throw new Error("Invalid range-range relationship");
    }
}
function transformServerBackwardMoveWithClientIdentityMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(s, c.fromIndex)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
            return new OperationPair(s, c.copy({ fromIndex: c.fromIndex + 1, toIndex: c.toIndex + 1 }));
        case RangeIndexRelationship.End:
            return new OperationPair(s, c.copy({ fromIndex: s.toIndex, toIndex: s.toIndex }));
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function transformServerIdentityMoveWithClientForwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.fromIndex)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.Start:
            return new OperationPair(s.copy({ fromIndex: c.toIndex, toIndex: c.toIndex }), c);
        case RangeIndexRelationship.Within:
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex - 1, toIndex: s.toIndex - 1 }), c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function transformServerIdentityMoveWithClientBackwardMove(s, c) {
    "use strict";
    switch (ArrayMoveHelper_ArrayMoveHelper.getRangeIndexRelationship(c, s.fromIndex)) {
        case RangeIndexRelationship.Before:
        case RangeIndexRelationship.After:
            return new OperationPair(s, c);
        case RangeIndexRelationship.Start:
        case RangeIndexRelationship.Within:
            return new OperationPair(s.copy({ fromIndex: s.fromIndex + 1, toIndex: s.toIndex + 1 }), c);
        case RangeIndexRelationship.End:
            return new OperationPair(s.copy({ fromIndex: c.toIndex, toIndex: c.toIndex }), c);
        default:
            throw new Error("Invalid range-index relationship");
    }
}
function transformServerIdentityMoveWithClientIdentityMove(s, c) {
    "use strict";
    return new OperationPair(s, c);
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArrayMoveSetOTF.ts

const ArrayMoveSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArraySetInsertOTF.ts

const ArraySetInsertOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArraySetRemoveOTF.ts

const ArraySetRemoveOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArraySetReplaceOTF.ts

const ArraySetReplaceOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArraySetMoveOTF.ts

const ArraySetMoveOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/array/ArraySetSetOTF.ts


const ArraySetSetOTF = (s, c) => {
    if (!EqualsUtil.deepEquals(s.value, c.value)) {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringInsertInsertOTF.ts

const StringInsertInsertOTF = (s, c) => {
    if (s.index <= c.index) {
        return new OperationPair(s, c.copy({ index: c.index + s.value.length }));
    }
    else {
        return new OperationPair(s.copy({ index: s.index + c.value.length }), c);
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringInsertRemoveOTF.ts

const StringInsertRemoveOTF = (s, c) => {
    if (s.index <= c.index) {
        return new OperationPair(s, c.copy({ index: c.index + s.value.length }));
    }
    else if (s.index >= c.index + c.value.length) {
        return new OperationPair(s.copy({ index: s.index - c.value.length }), c);
    }
    else {
        const offsetDelta = s.index - c.index;
        return new OperationPair(s.copy({ noOp: true }), c.copy({
            value: c.value.substring(0, offsetDelta) +
                s.value +
                c.value.substring(offsetDelta, c.value.length)
        }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringInsertSetOTF.ts

const StringInsertSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringRemoveInsertOTF.ts

const StringRemoveInsertOTF = (s, c) => {
    if (c.index <= s.index) {
        return new OperationPair(s.copy({ index: s.index + c.value.length }), c);
    }
    else if (c.index >= s.index + s.value.length) {
        return new OperationPair(s, c.copy({ index: c.index - s.value.length }));
    }
    else {
        const offsetDelta = c.index - s.index;
        return new OperationPair(s.copy({
            value: s.value.substring(0, offsetDelta) +
                c.value +
                s.value.substring(offsetDelta, s.value.length)
        }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringRemoveRemoveOTF.ts


const StringRemoveRemoveOTF = (s, c) => {
    const cStart = c.index;
    const cEnd = c.index + c.value.length;
    const sStart = s.index;
    const sEnd = s.index + s.value.length;
    const rr = RangeRelationshipUtil.getRangeRangeRelationship(sStart, sEnd, cStart, cEnd);
    let offsetDelta;
    let overlapStart;
    let overlapEnd;
    switch (rr) {
        case RangeRangeRelationship.Precedes:
            return new OperationPair(s, c.copy({ index: c.index - s.value.length }));
        case RangeRangeRelationship.PrecededBy:
            return new OperationPair(s.copy({ index: s.index - c.value.length }), c);
        case RangeRangeRelationship.Meets:
        case RangeRangeRelationship.Overlaps:
            offsetDelta = c.index - s.index;
            return new OperationPair(s.copy({ value: s.value.substring(0, offsetDelta) }), c.copy({ index: s.index, value: c.value.substring(s.value.length - offsetDelta, c.value.length) }));
        case RangeRangeRelationship.MetBy:
        case RangeRangeRelationship.OverlappedBy:
            offsetDelta = s.index - c.index;
            return new OperationPair(s.copy({ index: c.index, value: s.value.substring(c.value.length - offsetDelta, s.value.length) }), c.copy({ value: c.value.substring(0, offsetDelta) }));
        case RangeRangeRelationship.Starts:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ value: c.value.substring(s.value.length, c.value.length) }));
        case RangeRangeRelationship.StartedBy:
            return new OperationPair(s.copy({ value: s.value.substring(c.value.length, s.value.length) }), c.copy({ noOp: true }));
        case RangeRangeRelationship.Contains:
            overlapStart = c.index - s.index;
            overlapEnd = overlapStart + c.value.length;
            return new OperationPair(s.copy({ value: s.value.substring(0, overlapStart) + s.value.substring(overlapEnd, s.value.length) }), c.copy({ noOp: true }));
        case RangeRangeRelationship.ContainedBy:
            overlapStart = s.index - c.index;
            overlapEnd = overlapStart + s.value.length;
            return new OperationPair(s.copy({ noOp: true }), c.copy({ value: c.value.substring(0, overlapStart) + c.value.substring(overlapEnd, c.value.length) }));
        case RangeRangeRelationship.Finishes:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ value: c.value.substring(0, c.value.length - s.value.length) }));
        case RangeRangeRelationship.FinishedBy:
            return new OperationPair(s.copy({ value: s.value.substring(0, s.value.length - c.value.length) }), c.copy({ noOp: true }));
        case RangeRangeRelationship.EqualTo:
            return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
        default:
            throw new Error("invalid range range relationship");
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringRemoveSetOTF.ts

const StringRemoveSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringSetInsertOTF.ts

const StringSetInsertOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringSetRemoveOTF.ts

const StringSetRemoveOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/string/StringSetSetOTF.ts

const StringSetSetOTF = (s, c) => {
    if (s.value === c.value) {
        return new OperationPair(s.copy({ noOp: true }), s.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/number/NumberAddAddOTF.ts

const NumberAddAddOTF = (s, c) => {
    return new OperationPair(s, c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/number/NumberAddSetOTF.ts

const NumberAddSetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/number/NumberSetAddOTF.ts

const NumberSetAddOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/number/NumberSetSetOTF.ts

const NumberSetSetOTF = (s, c) => {
    if (s.value === c.value) {
        return new OperationPair(s.copy({ noOp: true }), s.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/bool/BooleanSetSetOTF.ts

const BooleanSetSetOTF = (s, c) => {
    if (s.value === c.value) {
        return new OperationPair(s.copy({ noOp: true }), s.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/ops/ObjectSetPropertyOperation.ts



class ObjectSetPropertyOperation_ObjectSetPropertyOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, prop, value) {
        super(OperationType.OBJECT_SET, id, noOp);
        this.prop = prop;
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new ObjectSetPropertyOperation_ObjectSetPropertyOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.prop, updates.prop), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectAddPropertyAddPropertyOTF.ts


const ObjectAddPropertyAddPropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else if (s.value !== c.value) {
        return new OperationPair(new ObjectSetPropertyOperation_ObjectSetPropertyOperation(s.id, s.noOp, s.prop, s.value), c.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectAddPropertySetPropertyOTF.ts

const ObjectAddPropertySetPropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        throw new Error("Add property and set property can not target the same property");
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectAddPropertyRemovePropertyOTF.ts

const ObjectAddPropertyRemovePropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        throw new Error("Add property and Remove property can not target the same property");
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectRemovePropertyAddPropertyOTF.ts

const ObjectRemovePropertyAddPropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        throw new Error("Remove property and add property can not target the same property");
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/ops/ObjectAddPropertyOperation.ts



class ObjectAddPropertyOperation_ObjectAddPropertyOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, prop, value) {
        super(OperationType.OBJECT_ADD, id, noOp);
        this.prop = prop;
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new ObjectAddPropertyOperation_ObjectAddPropertyOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.prop, updates.prop), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectRemovePropertySetPropertyOTF.ts


const ObjectRemovePropertySetPropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), new ObjectAddPropertyOperation_ObjectAddPropertyOperation(c.id, c.noOp, c.prop, c.value));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectRemovePropertyRemovePropertyOTF.ts

const ObjectRemovePropertyRemovePropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectAddPropertySetOTF.ts

const ObjectAddPropertySetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectRemovePropertySetOTF.ts

const ObjectRemovePropertySetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetPropertyAddPropertyOTF.ts

const ObjectSetPropertyAddPropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        throw new Error("Set property and add property can not target the same property");
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetPropertySetPropertyOTF.ts

const ObjectSetPropertySetPropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else if (s.value !== c.value) {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetPropertyRemovePropertyOTF.ts


const ObjectSetPropertyRemovePropertyOTF = (s, c) => {
    if (s.prop !== c.prop) {
        return new OperationPair(s, c);
    }
    else {
        return new OperationPair(new ObjectAddPropertyOperation_ObjectAddPropertyOperation(s.id, s.noOp, s.prop, s.value), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetPropertySetOTF.ts

const ObjectSetPropertySetOTF = (s, c) => {
    return new OperationPair(s.copy({ noOp: true }), c);
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetAddPropertyOTF.ts

const ObjectSetAddPropertyOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetSetPropertyOTF.ts

const ObjectSetSetPropertyOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetRemovePropertyOTF.ts

const ObjectSetRemovePropertyOTF = (s, c) => {
    return new OperationPair(s, c.copy({ noOp: true }));
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/object/ObjectSetSetOTF.ts


const ObjectSetSetOTF = (s, c) => {
    if (!EqualsUtil.deepEquals(s.value, c.value)) {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s.copy({ noOp: true }), c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/reference/events/ReferenceChangedEvent.ts
class ReferenceChangedEvent {
    constructor(src, oldValues, addedValues, removedValues, synthetic) {
        this.src = src;
        this.oldValues = oldValues;
        this.addedValues = addedValues;
        this.removedValues = removedValues;
        this.synthetic = synthetic;
        this.name = ReferenceChangedEvent.NAME;
        if (oldValues.length > 0) {
            this.oldValue = oldValues[0];
        }
        Object.freeze(this);
    }
}
ReferenceChangedEvent.NAME = "set";

// CONCATENATED MODULE: ./src/main/model/reference/events/ReferenceClearedEvent.ts
class ReferenceClearedEvent {
    constructor(src, oldValues) {
        this.src = src;
        this.oldValues = oldValues;
        this.name = ReferenceClearedEvent.NAME;
        if (oldValues.length > 0) {
            this.oldValue = oldValues[0];
        }
        Object.freeze(this);
    }
}
ReferenceClearedEvent.NAME = "cleared";

// CONCATENATED MODULE: ./src/main/model/reference/events/ReferenceDisposedEvent.ts
class ReferenceDisposedEvent {
    constructor(src) {
        this.src = src;
        this.name = ReferenceDisposedEvent.NAME;
        Object.freeze(this);
    }
}
ReferenceDisposedEvent.NAME = "disposed";

// CONCATENATED MODULE: ./src/main/model/reference/events/index.ts




// CONCATENATED MODULE: ./src/main/model/reference/ModelReference.ts



class ModelReference_ModelReference extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(referenceManager, type, key, source, user, sessionId, local) {
        super();
        this._referenceManager = referenceManager;
        this._disposed = false;
        this._values = [];
        this._type = type;
        this._key = key;
        this._source = source;
        this._user = user;
        this._sessionId = sessionId;
        this._local = local;
    }
    type() {
        return this._type;
    }
    key() {
        return this._key;
    }
    source() {
        return this._source;
    }
    isLocal() {
        return this._local;
    }
    user() {
        return this._user;
    }
    sessionId() {
        return this._sessionId;
    }
    isDisposed() {
        return this._disposed;
    }
    _dispose() {
        this._disposed = true;
        const event = new ReferenceDisposedEvent(this);
        this._emitEvent(event);
        this.removeAllListeners();
        this._referenceManager._handleReferenceDisposed(this);
    }
    value() {
        return this._values[0];
    }
    values() {
        return this._values;
    }
    isSet() {
        return this._values.length > 0;
    }
    _set(values, synthetic) {
        const oldValues = this._values;
        this._values = values;
        const added = this._values.filter(v => !oldValues.includes(v));
        const removed = oldValues.filter(v => !this._values.includes(v));
        const event = new ReferenceChangedEvent(this, oldValues, added, removed, synthetic);
        this._emitEvent(event);
    }
    _clear() {
        const oldValues = this._values;
        this._values = [];
        const event = new ReferenceClearedEvent(this, oldValues);
        this._emitEvent(event);
    }
    _setIfChanged(values, synthetic) {
        if (!EqualsUtil.deepEquals(this._values, values)) {
            this._set(values, synthetic);
        }
    }
}
ModelReference_ModelReference.Events = {
    SET: ReferenceChangedEvent.NAME,
    CLEARED: ReferenceClearedEvent.NAME,
    DISPOSED: ReferenceDisposedEvent.NAME
};
ModelReference_ModelReference.Types = {
    INDEX: "index",
    RANGE: "range",
    PROPERTY: "property",
    ELEMENT: "element"
};
Object.freeze(ModelReference_ModelReference.Events);
Object.freeze(ModelReference_ModelReference.Types);

// CONCATENATED MODULE: ./src/main/model/ot/xform/reference/IndexTransformer.ts
class IndexTransformer {
    static handleInsert(indices, insertIndex, length) {
        return indices.map((index) => {
            if (index >= insertIndex) {
                return index + length;
            }
            else {
                return index;
            }
        });
    }
    static handleReorder(indices, fromIndex, toIndex) {
        return indices.map((index) => {
            if (index >= toIndex && index < fromIndex) {
                return index + 1;
            }
            else if (index >= fromIndex && index < toIndex) {
                return index - 1;
            }
            else {
                return index;
            }
        });
    }
    static handleRemove(indices, removeIndex, length) {
        return indices.map((index) => {
            if (index > removeIndex) {
                return index - Math.min(index - removeIndex, length);
            }
            else {
                return index;
            }
        });
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/reference/IndexTransformationFunctions.ts


const StringInsertIndexTransformationFunction = (o, r) => {
    const values = IndexTransformer.handleInsert(r.values, o.index, o.value.length);
    return Immutable.copy(r, { values });
};
const StringRemoveIndexTransformationFunction = (o, r) => {
    const values = IndexTransformer.handleRemove(r.values, o.index, o.value.length);
    return Immutable.copy(r, { values });
};
const StringSetIndexTransformationFunction = (o, r) => {
    return null;
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/reference/RangeTransformer.ts

class RangeTransformer_RangeTransformer {
    static handleInsert(ranges, insertIndex, length) {
        return ranges.map(range => {
            const indices = RangeTransformer_RangeTransformer._rangeToTuple(range);
            const xFormed = IndexTransformer.handleInsert(indices, insertIndex, length);
            return RangeTransformer_RangeTransformer._tupleToRange(xFormed);
        });
    }
    static handleReorder(ranges, fromIndex, toIndex) {
        return ranges.map(range => {
            const indices = RangeTransformer_RangeTransformer._rangeToTuple(range);
            const xFormed = IndexTransformer.handleReorder(indices, fromIndex, toIndex);
            return RangeTransformer_RangeTransformer._tupleToRange(xFormed);
        });
    }
    static handleRemove(ranges, removeIndex, length) {
        return ranges.map(range => {
            const indices = RangeTransformer_RangeTransformer._rangeToTuple(range);
            const xFormed = IndexTransformer.handleRemove(indices, removeIndex, length);
            return RangeTransformer_RangeTransformer._tupleToRange(xFormed);
        });
    }
    static _rangeToTuple(range) {
        return [range.start, range.end];
    }
    static _tupleToRange(tuple) {
        return { start: tuple[0], end: tuple[1] };
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/xform/reference/RangeTransformationFunctions.ts


const StringInsertRangeTransformationFunction = (o, r) => {
    const values = RangeTransformer_RangeTransformer.handleInsert(r.values, o.index, o.value.length);
    return Immutable.copy(r, { values });
};
const StringRemoveRangeTransformationFunction = (o, r) => {
    const values = RangeTransformer_RangeTransformer.handleRemove(r.values, o.index, o.value.length);
    return Immutable.copy(r, { values });
};
const StringSetRangeTransformationFunction = (o, r) => {
    return null;
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/date/DateSetSetOTF.ts

const DateSetSetOTF = (s, c) => {
    if (s.value.getTime() === c.value.getTime()) {
        return new OperationPair(s.copy({ noOp: true }), s.copy({ noOp: true }));
    }
    else {
        return new OperationPair(s, c.copy({ noOp: true }));
    }
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/TransformationFunctionRegistry.ts




























































class TransformationFunctionRegistry_TransformationFunctionRegistry {
    constructor() {
        this._otfs = {};
        this._rtfs = {};
        this.registerOtf(OperationType.STRING_INSERT, OperationType.STRING_INSERT, StringInsertInsertOTF);
        this.registerOtf(OperationType.STRING_INSERT, OperationType.STRING_REMOVE, StringInsertRemoveOTF);
        this.registerOtf(OperationType.STRING_INSERT, OperationType.STRING_VALUE, StringInsertSetOTF);
        this.registerOtf(OperationType.STRING_REMOVE, OperationType.STRING_INSERT, StringRemoveInsertOTF);
        this.registerOtf(OperationType.STRING_REMOVE, OperationType.STRING_REMOVE, StringRemoveRemoveOTF);
        this.registerOtf(OperationType.STRING_REMOVE, OperationType.STRING_VALUE, StringRemoveSetOTF);
        this.registerOtf(OperationType.STRING_VALUE, OperationType.STRING_INSERT, StringSetInsertOTF);
        this.registerOtf(OperationType.STRING_VALUE, OperationType.STRING_REMOVE, StringSetRemoveOTF);
        this.registerOtf(OperationType.STRING_VALUE, OperationType.STRING_VALUE, StringSetSetOTF);
        this.registerOtf(OperationType.OBJECT_ADD, OperationType.OBJECT_ADD, ObjectAddPropertyAddPropertyOTF);
        this.registerOtf(OperationType.OBJECT_ADD, OperationType.OBJECT_SET, ObjectAddPropertySetPropertyOTF);
        this.registerOtf(OperationType.OBJECT_ADD, OperationType.OBJECT_REMOVE, ObjectAddPropertyRemovePropertyOTF);
        this.registerOtf(OperationType.OBJECT_ADD, OperationType.OBJECT_VALUE, ObjectAddPropertySetOTF);
        this.registerOtf(OperationType.OBJECT_REMOVE, OperationType.OBJECT_ADD, ObjectRemovePropertyAddPropertyOTF);
        this.registerOtf(OperationType.OBJECT_REMOVE, OperationType.OBJECT_SET, ObjectRemovePropertySetPropertyOTF);
        this.registerOtf(OperationType.OBJECT_REMOVE, OperationType.OBJECT_REMOVE, ObjectRemovePropertyRemovePropertyOTF);
        this.registerOtf(OperationType.OBJECT_REMOVE, OperationType.OBJECT_VALUE, ObjectRemovePropertySetOTF);
        this.registerOtf(OperationType.OBJECT_SET, OperationType.OBJECT_ADD, ObjectSetPropertyAddPropertyOTF);
        this.registerOtf(OperationType.OBJECT_SET, OperationType.OBJECT_SET, ObjectSetPropertySetPropertyOTF);
        this.registerOtf(OperationType.OBJECT_SET, OperationType.OBJECT_REMOVE, ObjectSetPropertyRemovePropertyOTF);
        this.registerOtf(OperationType.OBJECT_SET, OperationType.OBJECT_VALUE, ObjectSetPropertySetOTF);
        this.registerOtf(OperationType.OBJECT_VALUE, OperationType.OBJECT_ADD, ObjectSetAddPropertyOTF);
        this.registerOtf(OperationType.OBJECT_VALUE, OperationType.OBJECT_SET, ObjectSetSetPropertyOTF);
        this.registerOtf(OperationType.OBJECT_VALUE, OperationType.OBJECT_REMOVE, ObjectSetRemovePropertyOTF);
        this.registerOtf(OperationType.OBJECT_VALUE, OperationType.OBJECT_VALUE, ObjectSetSetOTF);
        this.registerOtf(OperationType.ARRAY_INSERT, OperationType.ARRAY_INSERT, ArrayInsertInsertOTF);
        this.registerOtf(OperationType.ARRAY_INSERT, OperationType.ARRAY_REMOVE, ArrayInsertRemoveOTF);
        this.registerOtf(OperationType.ARRAY_INSERT, OperationType.ARRAY_SET, ArrayInsertReplaceOTF);
        this.registerOtf(OperationType.ARRAY_INSERT, OperationType.ARRAY_REORDER, ArrayInsertMoveOTF);
        this.registerOtf(OperationType.ARRAY_INSERT, OperationType.ARRAY_VALUE, ArrayInsertSetOTF);
        this.registerOtf(OperationType.ARRAY_REMOVE, OperationType.ARRAY_INSERT, ArrayRemoveInsertOTF);
        this.registerOtf(OperationType.ARRAY_REMOVE, OperationType.ARRAY_REMOVE, ArrayRemoveRemoveOTF);
        this.registerOtf(OperationType.ARRAY_REMOVE, OperationType.ARRAY_SET, ArrayRemoveReplaceOTF);
        this.registerOtf(OperationType.ARRAY_REMOVE, OperationType.ARRAY_REORDER, ArrayRemoveMoveOTF);
        this.registerOtf(OperationType.ARRAY_REMOVE, OperationType.ARRAY_VALUE, ArrayRemoveSetOTF);
        this.registerOtf(OperationType.ARRAY_SET, OperationType.ARRAY_INSERT, ArrayReplaceInsertOTF);
        this.registerOtf(OperationType.ARRAY_SET, OperationType.ARRAY_REMOVE, ArrayReplaceRemoveOTF);
        this.registerOtf(OperationType.ARRAY_SET, OperationType.ARRAY_SET, ArrayReplaceReplaceOTF);
        this.registerOtf(OperationType.ARRAY_SET, OperationType.ARRAY_REORDER, ArrayReplaceMoveOTF);
        this.registerOtf(OperationType.ARRAY_SET, OperationType.ARRAY_VALUE, ArrayReplaceSetOTF);
        this.registerOtf(OperationType.ARRAY_REORDER, OperationType.ARRAY_INSERT, ArrayMoveInsertOTF);
        this.registerOtf(OperationType.ARRAY_REORDER, OperationType.ARRAY_REMOVE, ArrayMoveRemoveOTF);
        this.registerOtf(OperationType.ARRAY_REORDER, OperationType.ARRAY_SET, ArrayMoveReplaceOTF);
        this.registerOtf(OperationType.ARRAY_REORDER, OperationType.ARRAY_REORDER, ArrayMoveMoveOTF);
        this.registerOtf(OperationType.ARRAY_REORDER, OperationType.ARRAY_VALUE, ArrayMoveSetOTF);
        this.registerOtf(OperationType.ARRAY_VALUE, OperationType.ARRAY_INSERT, ArraySetInsertOTF);
        this.registerOtf(OperationType.ARRAY_VALUE, OperationType.ARRAY_REMOVE, ArraySetRemoveOTF);
        this.registerOtf(OperationType.ARRAY_VALUE, OperationType.ARRAY_SET, ArraySetReplaceOTF);
        this.registerOtf(OperationType.ARRAY_VALUE, OperationType.ARRAY_REORDER, ArraySetMoveOTF);
        this.registerOtf(OperationType.ARRAY_VALUE, OperationType.ARRAY_VALUE, ArraySetSetOTF);
        this.registerOtf(OperationType.NUMBER_DELTA, OperationType.NUMBER_DELTA, NumberAddAddOTF);
        this.registerOtf(OperationType.NUMBER_DELTA, OperationType.NUMBER_VALUE, NumberAddSetOTF);
        this.registerOtf(OperationType.NUMBER_VALUE, OperationType.NUMBER_DELTA, NumberSetAddOTF);
        this.registerOtf(OperationType.NUMBER_VALUE, OperationType.NUMBER_VALUE, NumberSetSetOTF);
        this.registerOtf(OperationType.BOOLEAN_VALUE, OperationType.BOOLEAN_VALUE, BooleanSetSetOTF);
        this.registerOtf(OperationType.DATE_VALUE, OperationType.DATE_VALUE, DateSetSetOTF);
        this.registerRtf(ModelReference_ModelReference.Types.INDEX, OperationType.STRING_INSERT, StringInsertIndexTransformationFunction);
        this.registerRtf(ModelReference_ModelReference.Types.INDEX, OperationType.STRING_REMOVE, StringRemoveIndexTransformationFunction);
        this.registerRtf(ModelReference_ModelReference.Types.INDEX, OperationType.STRING_VALUE, StringSetIndexTransformationFunction);
        this.registerRtf(ModelReference_ModelReference.Types.RANGE, OperationType.STRING_INSERT, StringInsertRangeTransformationFunction);
        this.registerRtf(ModelReference_ModelReference.Types.RANGE, OperationType.STRING_REMOVE, StringRemoveRangeTransformationFunction);
        this.registerRtf(ModelReference_ModelReference.Types.RANGE, OperationType.STRING_VALUE, StringSetRangeTransformationFunction);
    }
    registerOtf(s, c, otf) {
        const key = s + c;
        if (this._otfs[key]) {
            throw new Error("Function already registered for " + s + ", " + c);
        }
        else {
            this._otfs[key] = otf;
        }
    }
    registerRtf(r, s, rtf) {
        const key = s + r;
        if (this._rtfs[key]) {
            throw new Error("Function already registered for " + s + ", " + r);
        }
        else {
            this._rtfs[key] = rtf;
        }
    }
    getOperationTransformationFunction(s, c) {
        const key = s.type + c.type;
        return this._otfs[key];
    }
    getReferenceTransformationFunction(o, r) {
        const key = o.type + r.type;
        return this._rtfs[key];
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ClientOperationEvent.ts

class ClientOperationEvent_ClientOperationEvent {
    constructor(sessionId, seqNo, contextVersion, timestamp, operation) {
        this.sessionId = sessionId;
        this.seqNo = seqNo;
        this.contextVersion = contextVersion;
        this.timestamp = timestamp;
        this.operation = operation;
        Object.freeze(this);
    }
    copy(mods) {
        mods = Immutable.getOrDefault(mods, {});
        return new ClientOperationEvent_ClientOperationEvent(Immutable.getOrDefault(mods.sessionId, this.sessionId), Immutable.getOrDefault(mods.seqNo, this.seqNo), Immutable.getOrDefault(mods.contextVersion, this.contextVersion), Immutable.getOrDefault(mods.timestamp, this.timestamp), Immutable.getOrDefault(mods.operation, this.operation));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ClientConcurrencyControl.ts




class ClientConcurrencyControl_ClientConcurrencyControl extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(sessionId, contextVersion, lastSequenceNumber, transformer, referenceTransformer) {
        super();
        this._sessionId = sessionId;
        this._lastSequenceNumber = lastSequenceNumber;
        this._contextVersion = contextVersion;
        this._unappliedOperations = [];
        this._inflightOperations = [];
        this._transformer = transformer;
        this._referenceTransformer = referenceTransformer;
        this._compoundOpInProgress = false;
        this._pendingCompoundOperation = [];
    }
    lastSequenceNumber() {
        return this._lastSequenceNumber;
    }
    setState(contextVersion, lastSequenceNumber, inFlight) {
        this._contextVersion = contextVersion;
        this._lastSequenceNumber = lastSequenceNumber;
        this._inflightOperations.length = 0;
        this._inflightOperations.push(...inFlight);
    }
    contextVersion() {
        return this._contextVersion;
    }
    isCommitted() {
        return !this.hasInflightOperation();
    }
    hasInflightOperation() {
        return this._inflightOperations.length > 0;
    }
    firstInFlightOperation() {
        return this._inflightOperations[0];
    }
    getInFlightOperations() {
        return this._inflightOperations.slice(0);
    }
    hasNextIncomingOperation() {
        return this._unappliedOperations.length !== 0;
    }
    getNextIncomingOperation() {
        if (this._unappliedOperations.length === 0) {
            return null;
        }
        else {
            return this._unappliedOperations.shift();
        }
    }
    hasNextRemoteReference() {
        return this._unappliedOperations.length !== 0;
    }
    getNextRemoteReferenceSetEvent() {
        if (this._unappliedOperations.length === 0) {
            return null;
        }
        else {
            return this._unappliedOperations.shift();
        }
    }
    startBatchOperation() {
        if (this._compoundOpInProgress) {
            throw new Error("Batch operation already in progress.");
        }
        this._pendingCompoundOperation = [];
        this._compoundOpInProgress = true;
    }
    cancelBatchOperation() {
        if (!this._compoundOpInProgress) {
            throw new Error("Batch operation not in progress.");
        }
        if (this._pendingCompoundOperation.length !== 0) {
            throw new Error("Can not cancel a batch operation if operations have been issued.");
        }
        this._compoundOpInProgress = false;
    }
    completeBatchOperation() {
        if (!this._compoundOpInProgress) {
            throw new Error("Batch operation not in progress.");
        }
        this._compoundOpInProgress = false;
        if (this._pendingCompoundOperation.length === 0) {
            throw new Error("A Batch operation must have at least one operation.");
        }
        const compoundOp = new CompoundOperation_CompoundOperation(this._pendingCompoundOperation);
        this._pendingCompoundOperation = [];
        const seqNo = ++this._lastSequenceNumber;
        const outgoingOperation = new ClientOperationEvent_ClientOperationEvent(this._sessionId(), seqNo, this._contextVersion, new Date(), compoundOp);
        this._inflightOperations.push(outgoingOperation);
        return outgoingOperation;
    }
    batchSize() {
        return this._pendingCompoundOperation.length;
    }
    isBatchOperationInProgress() {
        return this._compoundOpInProgress;
    }
    processOutgoingOperation(operation) {
        if (this._compoundOpInProgress && !(operation instanceof DiscreteOperation_DiscreteOperation)) {
            throw new Error("Can't process a compound operation that is in progress");
        }
        const outgoingOperation = this.transformOutgoing(this._unappliedOperations, operation);
        if (this._inflightOperations.length === 0 && this._pendingCompoundOperation.length === 0) {
            const evt = {
                name: ClientConcurrencyControl_ClientConcurrencyControl.Events.COMMIT_STATE_CHANGED,
                committed: false
            };
            this._emitEvent(evt);
        }
        if (this._compoundOpInProgress) {
            this._pendingCompoundOperation.push(outgoingOperation);
            return null;
        }
        else {
            const outgoingEvent = new ClientOperationEvent_ClientOperationEvent(this._sessionId(), ++this._lastSequenceNumber, this._contextVersion, new Date(), outgoingOperation);
            this._inflightOperations.push(outgoingEvent);
            return outgoingEvent;
        }
    }
    processOutgoingSetReference(r) {
        for (let i = 0; i < this._unappliedOperations.length && r; i++) {
            r = this._referenceTransformer.transform(this._unappliedOperations[i].operation, r);
        }
        return r;
    }
    dispose() {
    }
    processAcknowledgement(version, seqNo) {
        if (this._inflightOperations.length === 0) {
            throw new Error("Received an acknowledgment, but had no uncommitted operations.");
        }
        if (this._contextVersion !== version) {
            throw new Error(`Acknowledgement did not meet expected context version of ${this._contextVersion}: ${version}`);
        }
        const acked = this._inflightOperations.shift();
        if (seqNo !== undefined) {
            if (acked.seqNo !== seqNo) {
                throw new Error(`Acknowledgement did not meet expected sequence number of ${acked.seqNo}: ${seqNo}`);
            }
        }
        this._contextVersion++;
        if (this._inflightOperations.length === 0 && this._pendingCompoundOperation.length === 0) {
            const evt = {
                name: ClientConcurrencyControl_ClientConcurrencyControl.Events.COMMIT_STATE_CHANGED,
                committed: true
            };
            this._emitEvent(evt);
        }
        return acked;
    }
    processRemoteOperation(incomingOperation) {
        if (incomingOperation.version !== this._contextVersion) {
            throw new Error(`Invalid version of ${incomingOperation.version}, expected ${this._contextVersion}.`);
        }
        incomingOperation = this.transformInflightOperations(incomingOperation);
        incomingOperation = this.transformPendingCompoundOperations(incomingOperation);
        this._contextVersion++;
        this._unappliedOperations.push(incomingOperation);
    }
    processRemoteReferenceSet(r) {
        for (let i = 0; i < this._inflightOperations.length && r; i++) {
            r = this._referenceTransformer.transform(this._inflightOperations[i].operation, r);
        }
        return r;
    }
    transformInflightOperations(serverOp) {
        let sPrime = serverOp.operation;
        for (let i = 0; i < this._inflightOperations.length; i++) {
            const opEvent = this._inflightOperations[i];
            const opPair = this._transformer.transform(sPrime, opEvent.operation);
            sPrime = opPair.serverOp;
            this._inflightOperations[i] = opEvent.copy({ contextVersion: serverOp.version + 1, operation: opPair.clientOp });
        }
        return serverOp.copy({ operation: sPrime });
    }
    transformPendingCompoundOperations(serverOp) {
        let sPrime = serverOp.operation;
        for (let i = 0; i < this._pendingCompoundOperation.length; i++) {
            const op = this._pendingCompoundOperation[i];
            const opPair = this._transformer.transform(sPrime, op);
            sPrime = opPair.serverOp;
            this._pendingCompoundOperation[i] = opPair.clientOp;
        }
        return serverOp.copy({ operation: sPrime });
    }
    transformOutgoing(serverOps, clientOp) {
        let cPrime = clientOp;
        for (let i = 0; i < serverOps.length; i++) {
            const serverOp = serverOps[i];
            const opPair = this._transformer.transform(serverOp.operation, cPrime);
            serverOps[i] = serverOp.copy({ operation: opPair.serverOp });
            cPrime = opPair.clientOp;
        }
        return cPrime;
    }
}
ClientConcurrencyControl_ClientConcurrencyControl.Events = {
    COMMIT_STATE_CHANGED: "commitStateChanged"
};

// CONCATENATED MODULE: ./src/main/model/ot/xform/ReferenceTransformer.ts

class ReferenceTransformer_ReferenceTransformer {
    constructor(tfr) {
        this._tfr = tfr;
    }
    transform(o, r) {
        if (o instanceof CompoundOperation_CompoundOperation) {
            return this.transformCompoundOperation(o, r);
        }
        else {
            return this.transformDiscreteOperation(o, r);
        }
    }
    transformCompoundOperation(o, r) {
        let result = r;
        for (let i = 0; i < o.ops.length && result; i++) {
            result = this.transform(o.ops[i], result);
        }
        return result;
    }
    transformDiscreteOperation(s, r) {
        if (s.noOp) {
            return r;
        }
        else if (s.id === r.valueId) {
            return this.transformWithIdenticalPathOperation(s, r);
        }
        else {
            return r;
        }
    }
    transformWithIdenticalPathOperation(o, r) {
        const tf = this._tfr.getReferenceTransformationFunction(o, r);
        if (tf) {
            return tf(o, r);
        }
        else {
            throw new Error(`No function found for: (${o.type},${r.type})`);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/DataValueFactory.ts
class DataValueFactory {
    constructor(idGenerator) {
        this.idGenerator = idGenerator;
    }
    createDataValue(data) {
        const id = this.idGenerator();
        const type = typeof data;
        if (data === null) {
            const nullValue = { id, type: "null", value: null };
            return nullValue;
        }
        else if (type === "string") {
            const stringValue = { id, type, value: data };
            return stringValue;
        }
        else if (data instanceof Date) {
            const dateValue = { id, type: "date", value: data };
            return dateValue;
        }
        else if (Array.isArray(data)) {
            const list = data.map((child) => {
                return this.createDataValue(child);
            });
            const arrayValue = { id, type: "array", value: list };
            return arrayValue;
        }
        else if (type === "object") {
            if (data.hasOwnProperty("$convergenceType")) {
                const convergenceType = data["$convergenceType"];
                if (convergenceType === "date") {
                    if (data.hasOwnProperty("value")) {
                        const dateValue = { id, type: "date", value: new Date(data["delta"]) };
                        return dateValue;
                    }
                    else {
                        throw new Error("Invalid convergence data type: " + type + " delta field missing.");
                    }
                }
                else {
                    throw new Error("Invalid convergence data type: " + type + " supported types are [date].");
                }
            }
            else {
                const props = {};
                Object.getOwnPropertyNames(data).forEach((prop) => {
                    props[prop] = this.createDataValue(data[prop]);
                });
                const objectValue = { id, type, value: props };
                return objectValue;
            }
        }
        else if (type === "number") {
            const numberValue = { id, type, value: data };
            return numberValue;
        }
        else if (type === "boolean") {
            const booleanValue = { id, type, value: data };
            return booleanValue;
        }
        else {
            throw new Error("Invalid data type: " + type);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/events/ArrayInsertEvent.ts
class ArrayInsertEvent {
    constructor(element, user, sessionId, local, index, value) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.index = index;
        this.value = value;
        this.name = ArrayInsertEvent.NAME;
        Object.freeze(this);
    }
}
ArrayInsertEvent.NAME = "insert";

// CONCATENATED MODULE: ./src/main/model/events/ArrayRemoveEvent.ts
class ArrayRemoveEvent {
    constructor(element, user, sessionId, local, index, oldValue) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.index = index;
        this.oldValue = oldValue;
        this.name = ArrayRemoveEvent.NAME;
        Object.freeze(this);
    }
}
ArrayRemoveEvent.NAME = "remove";

// CONCATENATED MODULE: ./src/main/model/events/ArrayReorderEvent.ts
class ArrayReorderEvent {
    constructor(element, user, sessionId, local, fromIndex, toIndex) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        this.name = ArrayReorderEvent.NAME;
        Object.freeze(this);
    }
}
ArrayReorderEvent.NAME = "reorder";

// CONCATENATED MODULE: ./src/main/model/events/ArraySetEvent.ts
class ArraySetEvent {
    constructor(element, user, sessionId, local, index, value, oldValue) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.index = index;
        this.value = value;
        this.oldValue = oldValue;
        this.name = ArraySetEvent.NAME;
        Object.freeze(this);
    }
}
ArraySetEvent.NAME = "set";

// CONCATENATED MODULE: ./src/main/model/events/ArraySetValueEvent.ts
class ArraySetValueEvent {
    constructor(element, user, sessionId, local) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = ArraySetValueEvent.NAME;
        Object.freeze(this);
    }
}
ArraySetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/events/ObjectRemoveEvent.ts
class ObjectRemoveEvent {
    constructor(element, user, sessionId, local, key, oldValue) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.key = key;
        this.oldValue = oldValue;
        this.name = ObjectRemoveEvent.NAME;
        Object.freeze(this);
    }
}
ObjectRemoveEvent.NAME = "remove";

// CONCATENATED MODULE: ./src/main/model/events/ObjectSetEvent.ts
class ObjectSetEvent {
    constructor(element, user, sessionId, local, key, value, oldValue) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.key = key;
        this.value = value;
        this.oldValue = oldValue;
        this.name = ObjectSetEvent.NAME;
        Object.freeze(this);
    }
}
ObjectSetEvent.NAME = "set";

// CONCATENATED MODULE: ./src/main/model/events/ObjectSetValueEvent.ts
class ObjectSetValueEvent {
    constructor(element, user, sessionId, local) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = ObjectSetValueEvent.NAME;
        Object.freeze(this);
    }
}
ObjectSetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/events/BooleanSetValueEvent.ts
class BooleanSetValueEvent {
    constructor(element, user, sessionId, local) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = BooleanSetValueEvent.NAME;
        Object.freeze(this);
    }
}
BooleanSetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/events/DateSetValueEvent.ts
class DateSetValueEvent {
    constructor(element, user, sessionId, local) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = DateSetValueEvent.NAME;
        Object.freeze(this);
    }
}
DateSetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/events/NumberSetValueEvent.ts
class NumberSetValueEvent {
    constructor(element, user, sessionId, local) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = NumberSetValueEvent.NAME;
        Object.freeze(this);
    }
}
NumberSetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/events/NumberDeltaEvent.ts
class NumberDeltaEvent {
    constructor(element, user, sessionId, local, value) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.value = value;
        this.name = NumberDeltaEvent.NAME;
        Object.freeze(this);
    }
}
NumberDeltaEvent.NAME = "delta";

// CONCATENATED MODULE: ./src/main/model/events/StringInsertEvent.ts
class StringInsertEvent {
    constructor(element, user, sessionId, local, index, value) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.index = index;
        this.value = value;
        this.name = StringInsertEvent.NAME;
        Object.freeze(this);
    }
}
StringInsertEvent.NAME = "insert";

// CONCATENATED MODULE: ./src/main/model/events/StringRemoveEvent.ts
class StringRemoveEvent {
    constructor(element, user, sessionId, local, index, value) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.index = index;
        this.value = value;
        this.name = StringRemoveEvent.NAME;
        Object.freeze(this);
    }
}
StringRemoveEvent.NAME = "remove";

// CONCATENATED MODULE: ./src/main/model/events/StringSetValueEvent.ts
class StringSetValueEvent {
    constructor(element, user, sessionId, local) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = StringSetValueEvent.NAME;
        Object.freeze(this);
    }
}
StringSetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/events/ElementDetachedEvent.ts
class ElementDetachedEvent {
    constructor(src) {
        this.src = src;
        this.name = ElementDetachedEvent.NAME;
    }
}
ElementDetachedEvent.NAME = "detached";

// CONCATENATED MODULE: ./src/main/model/events/ModelChangedEvent.ts
class ModelChangedEvent {
    constructor(element, user, sessionId, local, relativePath, childEvent) {
        this.element = element;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.relativePath = relativePath;
        this.childEvent = childEvent;
        this.name = ModelChangedEvent.NAME;
        Object.freeze(this);
    }
}
ModelChangedEvent.NAME = "model_changed";

// CONCATENATED MODULE: ./src/main/model/events/ModelClosedEvent.ts
class ModelClosedEvent {
    constructor(src, local, reason) {
        this.src = src;
        this.local = local;
        this.reason = reason;
        this.name = ModelClosedEvent.NAME;
        Object.freeze(this);
    }
}
ModelClosedEvent.NAME = "closed";

// CONCATENATED MODULE: ./src/main/model/events/ModelDeletedEvent.ts
class ModelDeletedEvent {
    constructor(src, local, reason) {
        this.src = src;
        this.local = local;
        this.reason = reason;
        this.name = ModelDeletedEvent.NAME;
        Object.freeze(this);
    }
}
ModelDeletedEvent.NAME = "deleted";

// CONCATENATED MODULE: ./src/main/model/events/ModelPermissionsChangedEvent.ts
class ModelPermissionsChangedEvent {
    constructor(model, permissions, changes) {
        this.model = model;
        this.permissions = permissions;
        this.changes = changes;
        this.name = ModelPermissionsChangedEvent.NAME;
        Object.freeze(this);
    }
}
ModelPermissionsChangedEvent.NAME = "permissions_changed";

// CONCATENATED MODULE: ./src/main/model/events/VersionChangedEvent.ts
class VersionChangedEvent {
    constructor(src, version) {
        this.src = src;
        this.version = version;
        this.name = VersionChangedEvent.NAME;
        Object.freeze(this);
    }
}
VersionChangedEvent.NAME = "version_changed";

// CONCATENATED MODULE: ./src/main/model/events/ModelOnlineEvent.ts
class ModelOnlineEvent {
    constructor(src) {
        this.src = src;
        this.name = ModelOnlineEvent.NAME;
        Object.freeze(this);
    }
}
ModelOnlineEvent.NAME = "online";

// CONCATENATED MODULE: ./src/main/model/events/ModelOfflineEvent.ts
class ModelOfflineEvent {
    constructor(src) {
        this.src = src;
        this.name = ModelOfflineEvent.NAME;
        Object.freeze(this);
    }
}
ModelOfflineEvent.NAME = "offline";

// CONCATENATED MODULE: ./src/main/model/events/ModelReconnectingEvent.ts
class ModelReconnectingEvent {
    constructor(src) {
        this.src = src;
        this.name = ModelReconnectingEvent.NAME;
        Object.freeze(this);
    }
}
ModelReconnectingEvent.NAME = "reconnecting";

// CONCATENATED MODULE: ./src/main/model/events/ResyncStartedEvent.ts
class ResyncStartedEvent {
    constructor(src) {
        this.src = src;
        this.name = ResyncStartedEvent.NAME;
        Object.freeze(this);
    }
}
ResyncStartedEvent.NAME = "resync_started";

// CONCATENATED MODULE: ./src/main/model/events/ResyncCompletedEvent.ts
class ResyncCompletedEvent {
    constructor(src) {
        this.src = src;
        this.name = ResyncCompletedEvent.NAME;
        Object.freeze(this);
    }
}
ResyncCompletedEvent.NAME = "resync_completed";

// CONCATENATED MODULE: ./src/main/model/events/ResyncErrorEvent.ts
class ResyncErrorEvent {
    constructor(src, message) {
        this.src = src;
        this.message = message;
        this.name = ResyncErrorEvent.NAME;
        Object.freeze(this);
    }
}
ResyncErrorEvent.NAME = "resync_error";

// CONCATENATED MODULE: ./src/main/model/events/RemoteReferenceCreatedEvent.ts
class RemoteReferenceCreatedEvent {
    constructor(reference, model, element) {
        this.reference = reference;
        this.model = model;
        this.element = element;
        this.name = RemoteReferenceCreatedEvent.NAME;
        Object.freeze(this);
    }
}
RemoteReferenceCreatedEvent.NAME = "reference";

// CONCATENATED MODULE: ./src/main/model/events/RemoteResyncStartedEvent.ts
class RemoteResyncStartedEvent {
    constructor(model, sessionId, user) {
        this.model = model;
        this.sessionId = sessionId;
        this.user = user;
        this.name = RemoteResyncStartedEvent.NAME;
        Object.freeze(this);
    }
}
RemoteResyncStartedEvent.NAME = "remote_resync_started";

// CONCATENATED MODULE: ./src/main/model/events/RemoteResyncCompletedEvent.ts
class RemoteResyncCompletedEvent {
    constructor(model, sessionId, user) {
        this.model = model;
        this.sessionId = sessionId;
        this.user = user;
        this.name = RemoteResyncCompletedEvent.NAME;
        Object.freeze(this);
    }
}
RemoteResyncCompletedEvent.NAME = "remote_resync_completed";

// CONCATENATED MODULE: ./src/main/model/events/CollaboratorOpenedEvent.ts
class CollaboratorOpenedEvent {
    constructor(src, collaborator) {
        this.src = src;
        this.collaborator = collaborator;
        this.name = CollaboratorOpenedEvent.NAME;
        Object.freeze(this);
    }
}
CollaboratorOpenedEvent.NAME = "collaborator_opened";

// CONCATENATED MODULE: ./src/main/model/events/CollaboratorClosedEvent.ts
class CollaboratorClosedEvent {
    constructor(src, collaborator) {
        this.src = src;
        this.collaborator = collaborator;
        this.name = CollaboratorClosedEvent.NAME;
        Object.freeze(this);
    }
}
CollaboratorClosedEvent.NAME = "collaborator_closed";

// CONCATENATED MODULE: ./src/main/model/events/ModelCommittedEvent.ts
class ModelCommittedEvent {
    constructor(src) {
        this.src = src;
        this.name = ModelCommittedEvent.NAME;
        Object.freeze(this);
    }
}
ModelCommittedEvent.NAME = "committed";

// CONCATENATED MODULE: ./src/main/model/events/ModelModifiedEvent.ts
class ModelModifiedEvent {
    constructor(src) {
        this.src = src;
        this.name = ModelModifiedEvent.NAME;
        Object.freeze(this);
    }
}
ModelModifiedEvent.NAME = "modified";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelDownloadPendingEvent.ts
class OfflineModelDownloadPendingEvent {
    constructor() {
        this.name = OfflineModelDownloadPendingEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelDownloadPendingEvent.NAME = "offline_model_download_pending";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelDownloadCompletedEvent.ts
class OfflineModelDownloadCompletedEvent {
    constructor() {
        this.name = OfflineModelDownloadCompletedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelDownloadCompletedEvent.NAME = "offline_model_download_completed";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelSyncStartedEvent.ts
class OfflineModelSyncStartedEvent {
    constructor() {
        this.name = OfflineModelSyncStartedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelSyncStartedEvent.NAME = "offline_model_sync_started";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelSyncCompletedEvent.ts
class OfflineModelSyncCompletedEvent {
    constructor() {
        this.name = OfflineModelSyncCompletedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelSyncCompletedEvent.NAME = "offline_model_sync_completed";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelSyncErrorEvent.ts
class OfflineModelSyncErrorEvent {
    constructor(modelId, message, model) {
        this.modelId = modelId;
        this.message = message;
        this.model = model;
        this.name = OfflineModelSyncErrorEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelSyncErrorEvent.NAME = "offline_model_sync_error";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelDeletedEvent.ts
class OfflineModelDeletedEvent {
    constructor(id) {
        this.id = id;
        this.name = OfflineModelDeletedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelDeletedEvent.NAME = "offline_model_deleted";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelPermissionsRevokedEvent.ts
class OfflineModelPermissionsRevokedEvent {
    constructor(id) {
        this.id = id;
        this.name = OfflineModelPermissionsRevokedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelPermissionsRevokedEvent.NAME = "offline_model_permissions_revoked";

// CONCATENATED MODULE: ./src/main/model/events/index.ts










































// CONCATENATED MODULE: ./src/main/model/internal/events.ts
class NodeDetachedEvent {
    constructor(src, local) {
        this.src = src;
        this.local = local;
        this.name = NodeDetachedEvent.NAME;
    }
}
NodeDetachedEvent.NAME = "detached";
class NodeChangedEvent {
    constructor(src, local, relativePath, childEvent, sessionId, user) {
        this.src = src;
        this.local = local;
        this.relativePath = relativePath;
        this.childEvent = childEvent;
        this.sessionId = sessionId;
        this.user = user;
        this.name = NodeChangedEvent.NAME;
        Object.freeze(this);
    }
}
NodeChangedEvent.NAME = "node_changed";
class ArrayNodeInsertEvent {
    constructor(src, local, index, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.index = index;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ArrayNodeInsertEvent.NAME;
        Object.freeze(this);
    }
}
ArrayNodeInsertEvent.NAME = "insert";
class ArrayNodeRemoveEvent {
    constructor(src, local, index, oldValue, sessionId, user) {
        this.src = src;
        this.local = local;
        this.index = index;
        this.oldValue = oldValue;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ArrayNodeRemoveEvent.NAME;
        Object.freeze(this);
    }
}
ArrayNodeRemoveEvent.NAME = "remove";
class ArrayNodeSetEvent {
    constructor(src, local, index, value, oldValue, sessionId, user) {
        this.src = src;
        this.local = local;
        this.index = index;
        this.value = value;
        this.oldValue = oldValue;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ArrayNodeSetEvent.NAME;
        Object.freeze(this);
    }
}
ArrayNodeSetEvent.NAME = "set";
class ArrayNodeReorderEvent {
    constructor(src, local, fromIndex, toIndex, sessionId, user) {
        this.src = src;
        this.local = local;
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ArrayNodeReorderEvent.NAME;
        Object.freeze(this);
    }
}
ArrayNodeReorderEvent.NAME = "reorder";
class ArrayNodeSetValueEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ArrayNodeSetValueEvent.NAME;
        Object.freeze(this);
    }
}
ArrayNodeSetValueEvent.NAME = "value";
class BooleanNodeSetValueEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = BooleanNodeSetValueEvent.NAME;
        Object.freeze(this);
    }
}
BooleanNodeSetValueEvent.NAME = "value";
class NumberNodeSetValueEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = NumberNodeSetValueEvent.NAME;
        Object.freeze(this);
    }
}
NumberNodeSetValueEvent.NAME = "value";
class NumberNodeDeltaEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = NumberNodeDeltaEvent.NAME;
        Object.freeze(this);
    }
}
NumberNodeDeltaEvent.NAME = "delta";
class ObjectNodeSetEvent {
    constructor(src, local, key, value, oldValue, sessionId, user) {
        this.src = src;
        this.local = local;
        this.key = key;
        this.value = value;
        this.oldValue = oldValue;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ObjectNodeSetEvent.NAME;
        Object.freeze(this);
    }
}
ObjectNodeSetEvent.NAME = "set";
class ObjectNodeRemoveEvent {
    constructor(src, local, key, oldValue, sessionId, user) {
        this.src = src;
        this.local = local;
        this.key = key;
        this.oldValue = oldValue;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ObjectNodeRemoveEvent.NAME;
        Object.freeze(this);
    }
}
ObjectNodeRemoveEvent.NAME = "remove";
class ObjectNodeSetValueEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = ObjectNodeSetValueEvent.NAME;
        Object.freeze(this);
    }
}
ObjectNodeSetValueEvent.NAME = "value";
class StringNodeInsertEvent {
    constructor(src, local, index, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.index = index;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = StringNodeInsertEvent.NAME;
        Object.freeze(this);
    }
}
StringNodeInsertEvent.NAME = "insert";
class StringNodeRemoveEvent {
    constructor(src, local, index, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.index = index;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = StringNodeRemoveEvent.NAME;
        Object.freeze(this);
    }
}
StringNodeRemoveEvent.NAME = "remove";
class StringNodeSetValueEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = StringNodeSetValueEvent.NAME;
        Object.freeze(this);
    }
}
StringNodeSetValueEvent.NAME = "value";
class DateNodeSetValueEvent {
    constructor(src, local, value, sessionId, user) {
        this.src = src;
        this.local = local;
        this.value = value;
        this.sessionId = sessionId;
        this.user = user;
        this.name = DateNodeSetValueEvent.NAME;
        Object.freeze(this);
    }
}
DateNodeSetValueEvent.NAME = "value";

// CONCATENATED MODULE: ./src/main/model/ModelEventConverter.ts


class ModelEventConverter_ModelEventConverter {
    static convertEvent(event, wrapperFactory) {
        if (event instanceof NodeDetachedEvent) {
            return new ElementDetachedEvent(wrapperFactory.wrap(event.src));
        }
        else if (event instanceof NodeChangedEvent) {
            return new ModelChangedEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.relativePath, this.convertEvent(event.childEvent, wrapperFactory));
        }
        else if (event instanceof ArrayNodeInsertEvent) {
            return new ArrayInsertEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.index, wrapperFactory.wrap(event.value));
        }
        else if (event instanceof ArrayNodeRemoveEvent) {
            return new ArrayRemoveEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.index, wrapperFactory.wrap(event.oldValue));
        }
        else if (event instanceof ArrayNodeReorderEvent) {
            return new ArrayReorderEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.fromIndex, event.toIndex);
        }
        else if (event instanceof ArrayNodeSetEvent) {
            return new ArraySetEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.index, wrapperFactory.wrap(event.value), wrapperFactory.wrap(event.oldValue));
        }
        else if (event instanceof ArrayNodeSetValueEvent) {
            return new ArraySetValueEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local);
        }
        else if (event instanceof BooleanNodeSetValueEvent) {
            return new BooleanSetValueEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local);
        }
        else if (event instanceof NumberNodeSetValueEvent) {
            return new NumberSetValueEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local);
        }
        else if (event instanceof NumberNodeDeltaEvent) {
            return new NumberDeltaEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.value);
        }
        else if (event instanceof ObjectNodeSetValueEvent) {
            return new ObjectSetValueEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local);
        }
        else if (event instanceof ObjectNodeRemoveEvent) {
            return new ObjectRemoveEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.key, wrapperFactory.wrap(event.oldValue));
        }
        else if (event instanceof ObjectNodeSetEvent) {
            return new ObjectSetEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.key, wrapperFactory.wrap(event.value), wrapperFactory.wrap(event.oldValue));
        }
        else if (event instanceof StringNodeInsertEvent) {
            return new StringInsertEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.index, event.value);
        }
        else if (event instanceof StringNodeRemoveEvent) {
            return new StringRemoveEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local, event.index, event.value);
        }
        else if (event instanceof StringNodeSetValueEvent) {
            return new StringSetValueEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local);
        }
        else if (event instanceof DateNodeSetValueEvent) {
            return new DateSetValueEvent(wrapperFactory.wrap(event.src), event.user, event.sessionId, event.local);
        }
        else {
            throw new Error("Unable to convert event: " + event.name);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/ReferenceMap.ts

class ReferenceMap_ReferenceMap {
    constructor() {
        this._referencesBySessionId = new Map();
    }
    put(reference) {
        const sessionId = reference.sessionId();
        const key = reference.key();
        let sessionReferences = this._referencesBySessionId.get(sessionId);
        if (TypeChecker.isUndefined(sessionReferences)) {
            sessionReferences = new Map();
            this._referencesBySessionId.set(sessionId, sessionReferences);
        }
        if (sessionReferences.has(key)) {
            throw new Error(`Reference with key "${key}" already exists for session "${sessionId}".`);
        }
        sessionReferences.set(key, reference);
    }
    get(sessionId, key) {
        const sessionReferences = this._referencesBySessionId.get(sessionId);
        if (!TypeChecker.isUndefined(sessionReferences)) {
            return sessionReferences.get(key);
        }
        else {
            return;
        }
    }
    getAll(filter) {
        if (TypeChecker.isUndefined(filter)) {
            filter = {};
        }
        const refs = [];
        const sessionIds = TypeChecker.isSet(filter.sessionId) ?
            [filter.sessionId] :
            Array.from(this._referencesBySessionId.keys());
        sessionIds.forEach((sid) => {
            const sessionRefs = this._referencesBySessionId.get(sid);
            const keys = TypeChecker.isSet(filter.key) ? [filter.key] : Array.from(sessionRefs.keys());
            keys.forEach((k) => {
                const r = sessionRefs.get(k);
                if (!TypeChecker.isUndefined(r)) {
                    refs.push(r);
                }
            });
        });
        return refs;
    }
    removeAll() {
        this._referencesBySessionId.clear();
    }
    remove(sessionId, key) {
        const sessionReferences = this._referencesBySessionId.get(sessionId);
        if (sessionReferences !== undefined) {
            const current = sessionReferences.get(key);
            sessionReferences.delete(key);
            return current;
        }
        else {
            return;
        }
    }
    removeBySession(sessionId) {
        this._referencesBySessionId.delete(sessionId);
    }
    removeByKey(key) {
        this._referencesBySessionId.forEach(referencesForSession => {
            referencesForSession.delete(key);
        });
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/IndexReference.ts


class IndexReference_IndexReference extends ModelReference_ModelReference {
    constructor(referenceManager, key, source, user, sessionId, local) {
        super(referenceManager, ModelReference_ModelReference.Types.INDEX, key, source, user, sessionId, local);
    }
    _handleInsert(index, length) {
        this._setIfChanged(IndexTransformer.handleInsert(this._values, index, length), true);
    }
    _handleRemove(index, length) {
        this._setIfChanged(IndexTransformer.handleRemove(this._values, index, length), true);
    }
    _handleReorder(fromIndex, toIndex) {
        this._setIfChanged(IndexTransformer.handleReorder(this._values, fromIndex, toIndex), true);
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/RangeReference.ts


class RangeReference_RangeReference extends ModelReference_ModelReference {
    constructor(referenceManager, key, source, user, sessionId, local) {
        super(referenceManager, ModelReference_ModelReference.Types.RANGE, key, source, user, sessionId, local);
    }
    _handleInsert(index, length) {
        this._setIfChanged(RangeTransformer_RangeTransformer.handleInsert(this._values, index, length), true);
    }
    _handleRemove(index, length) {
        this._setIfChanged(RangeTransformer_RangeTransformer.handleRemove(this._values, index, length), true);
    }
    _handleReorder(fromIndex, toIndex) {
        this._setIfChanged(RangeTransformer_RangeTransformer.handleReorder(this._values, fromIndex, toIndex), true);
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/ElementReference.ts


class ElementReference_ElementReference extends ModelReference_ModelReference {
    constructor(referenceManager, key, source, user, sessionId, local) {
        super(referenceManager, ModelReference_ModelReference.Types.ELEMENT, key, source, user, sessionId, local);
        this._detachedListener = (event) => {
            this._handleElementRemoved(event.src);
        };
    }
    _set(values, synthetic) {
        for (const oldElement of this.values()) {
            oldElement.removeListener(RealTimeElement_RealTimeElement.Events.DETACHED, this._detachedListener);
        }
        for (const newElement of values) {
            newElement.addListener(RealTimeElement_RealTimeElement.Events.DETACHED, this._detachedListener);
        }
        super._set(values, synthetic);
    }
    _clear() {
        for (const oldElement of this.values()) {
            oldElement.removeListener(RealTimeElement_RealTimeElement.Events.DETACHED, this._detachedListener);
        }
        super._clear();
    }
    _handleElementRemoved(element) {
        const index = this._values.indexOf(element, 0);
        if (index > -1) {
            const newElements = this._values.slice(0);
            newElements.splice(index, 1);
            this._set(newElements, true);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/PropertyReference.ts

class PropertyReference_PropertyReference extends ModelReference_ModelReference {
    constructor(referenceManager, key, source, user, sessionId, local) {
        super(referenceManager, ModelReference_ModelReference.Types.PROPERTY, key, source, user, sessionId, local);
    }
    _handlePropertyRemoved(property) {
        const index = this._values.indexOf(property, 0);
        if (index > -1) {
            const newElements = this._values.slice(0);
            newElements.splice(index, 1);
            this._set(newElements, true);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/RemoteReferenceEvent.ts
class RemoteReferenceEvent {
    constructor(sessionId, resourceId, valueId, key) {
        this.sessionId = sessionId;
        this.resourceId = resourceId;
        this.valueId = valueId;
        this.key = key;
    }
}
class RemoteReferenceShared extends RemoteReferenceEvent {
    constructor(sessionId, resourceId, valueId, key, referenceType, values) {
        super(sessionId, resourceId, valueId, key);
        this.referenceType = referenceType;
        this.values = values;
    }
}
class RemoteReferenceUnshared extends RemoteReferenceEvent {
    constructor(sessionId, resourceId, valueId, key) {
        super(sessionId, resourceId, valueId, key);
    }
}
class RemoteReferenceSet extends RemoteReferenceEvent {
    constructor(sessionId, resourceId, valueId, key, values) {
        super(sessionId, resourceId, valueId, key);
        this.values = values;
    }
}
class RemoteReferenceCleared extends RemoteReferenceEvent {
    constructor(sessionId, resourceId, valueId, key) {
        super(sessionId, resourceId, valueId, key);
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/ReferenceManager.ts








class ReferenceManager_ReferenceManager {
    constructor(source, validTypes, onRemoteReference, identityCache) {
        this._referenceMap = new ReferenceMap_ReferenceMap();
        this._localReferences = new Map();
        this._validTypes = validTypes;
        this._source = source;
        this._onRemoteReference = onRemoteReference;
        this._identityCache = identityCache;
    }
    get(sessionId, key) {
        return this._referenceMap.get(sessionId, key);
    }
    getAll(filter) {
        return this._referenceMap.getAll(filter);
    }
    removeAll() {
        this.getAll().forEach(ref => ref._dispose());
    }
    addLocalReference(reference) {
        const key = reference.reference().key();
        if (this._localReferences.has(key)) {
            throw new Error(`Local reference already set for key: ${key}`);
        }
        this._localReferences.set(key, reference);
        this._referenceMap.put(reference.reference());
    }
    removeLocalReference(key) {
        const current = this._localReferences.get(key);
        if (current !== undefined) {
            current.dispose();
        }
    }
    removeAllLocalReferences() {
        this._localReferences.forEach((reference, key) => {
            this.removeLocalReference(key);
        });
    }
    getLocalReference(key) {
        return this._localReferences.get(key);
    }
    localReferences() {
        return new Map(this._localReferences);
    }
    handleRemoteReferenceEvent(event) {
        if (event instanceof RemoteReferenceShared) {
            this._handleRemoteReferenceShared(event);
        }
        else if (event instanceof RemoteReferenceSet) {
            this._handleRemoteReferenceSet(event);
        }
        else if (event instanceof RemoteReferenceCleared) {
            this._handleRemoteReferenceCleared(event);
        }
        else if (event instanceof RemoteReferenceUnshared) {
            this._handleRemoteReferenceUnshared(event);
        }
        else {
            throw new Error("Invalid reference event.");
        }
    }
    reshare() {
        this._localReferences.forEach(reference => {
            if (reference.isShared()) {
                reference.share();
            }
        });
    }
    _handleReferenceDisposed(reference) {
        this._referenceMap.remove(reference.sessionId(), reference.key());
        if (reference.isLocal()) {
            this._localReferences.delete(reference.key());
        }
    }
    _handleRemoteReferenceShared(event) {
        const user = this._identityCache.getUserForSession(event.sessionId);
        let reference;
        const values = event.values;
        this._assertValidType(event.referenceType);
        if (event.referenceType === "index") {
            reference = new IndexReference_IndexReference(this, event.key, this._source, user, event.sessionId, false);
        }
        else if (event.referenceType === "range") {
            reference = new RangeReference_RangeReference(this, event.key, this._source, user, event.sessionId, false);
        }
        else if (event.referenceType === "element") {
            reference = new ElementReference_ElementReference(this, event.key, this._source, user, event.sessionId, false);
        }
        else if (event.referenceType === "property") {
            reference = new PropertyReference_PropertyReference(this, event.key, this._source, user, event.sessionId, false);
        }
        else {
            throw new ConvergenceError("Invalid reference message: " + event);
        }
        if (values !== null) {
            this._setReferenceValues(reference, values);
        }
        this._referenceMap.put(reference);
        this._onRemoteReference(reference);
    }
    _assertValidType(referenceType) {
        if (!this._validTypes.includes(referenceType)) {
            throw new Error(`Invalid reference type: ${referenceType}`);
        }
    }
    _handleRemoteReferenceUnshared(event) {
        const reference = this._referenceMap.remove(event.sessionId, event.key);
        reference._dispose();
    }
    _handleRemoteReferenceCleared(event) {
        const reference = this._referenceMap.get(event.sessionId, event.key);
        reference._clear();
    }
    _handleRemoteReferenceSet(event) {
        const reference = this._referenceMap.get(event.sessionId, event.key);
        this._setReferenceValues(reference, event.values);
    }
    _setReferenceValues(reference, values) {
        if (reference.type() === ModelReference_ModelReference.Types.ELEMENT) {
            const rtvs = [];
            for (const id of values) {
                const value = this._source._getRegisteredValue(id);
                if (value !== undefined) {
                    rtvs.push(value);
                }
            }
            reference._set(rtvs, false);
        }
        else {
            reference._set(values, false);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableElement.ts
const ObservableElementEventConstants = {
    VALUE: "value",
    DETACHED: "detached",
    REFERENCE: "reference",
    MODEL_CHANGED: "model_changed"
};
Object.freeze(ObservableElementEventConstants);

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeElement.ts







class RealTimeElement_RealTimeElement extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(delegate, callbacks, wrapperFactory, model, referenceTypes, identityCache) {
        super();
        this._delegate = delegate;
        this._callbacks = callbacks;
        this._wrapperFactory = wrapperFactory;
        this._model = model;
        const onRemoteReference = (ref) => {
            this._fireReferenceCreated(ref);
        };
        this._referenceManager = new ReferenceManager_ReferenceManager(this, referenceTypes, onRemoteReference, identityCache);
        this._delegate.events().pipe(Object(external_rxjs_operators_["filter"])(event => {
            return this._model.emitLocalEvents() || !event.local ||
                event instanceof NodeDetachedEvent;
        })).subscribe(event => {
            const convertedEvent = ModelEventConverter_ModelEventConverter.convertEvent(event, this._wrapperFactory);
            this._emitEvent(convertedEvent);
        });
    }
    model() {
        return this._model;
    }
    id() {
        return this._delegate.id();
    }
    type() {
        return this._delegate.type();
    }
    path() {
        return this._delegate.path();
    }
    parent() {
        const parentPath = this._delegate.path().slice(0);
        parentPath.pop();
        const parent = this._model.elementAt(parentPath);
        return parent;
    }
    relativePath() {
        const parentPath = this._delegate.path().slice(0);
        if (parentPath.length > 0) {
            return parentPath.pop();
        }
        else {
            return null;
        }
    }
    removeFromParent() {
        this._assertWritable();
        const parentPath = this._delegate.path().slice(0);
        if (parentPath.length === 0) {
            throw new Error("Can not remove the root object from the model");
        }
        const relPath = parentPath.pop();
        const parent = this._model.elementAt(parentPath);
        parent._removeChild(relPath);
    }
    isDetached() {
        return this._delegate.isDetached();
    }
    isAttached() {
        return !this._delegate.isDetached();
    }
    value(value) {
        if (arguments.length === 0) {
            return this._delegate.data();
        }
        else {
            this._assertWritable();
            this._delegate.data(value);
            return;
        }
    }
    toJSON() {
        return this._delegate.toJson();
    }
    reference(sessionId, key) {
        return this._referenceManager.get(sessionId, key);
    }
    references(referenceFilter) {
        return this._referenceManager.getAll(referenceFilter);
    }
    _handleRemoteReferenceEvent(event) {
        this._referenceManager.handleRemoteReferenceEvent(event);
    }
    _sendOperation(operation) {
        this._callbacks.sendOperationCallback(operation);
    }
    _assertWritable() {
        if (!this._model.permissions().write) {
            throw new Error("The user does not have write permissions for the model.");
        }
        this._assertAttached();
    }
    _assertAttached() {
        if (this.isDetached()) {
            throw Error("Can not perform actions on a detached RealTimeElement.");
        }
    }
    _fireReferenceCreated(reference) {
        this._emitEvent(new RemoteReferenceCreatedEvent(reference, this.model(), this));
    }
}
RealTimeElement_RealTimeElement.Events = ObservableElementEventConstants;
Object.freeze(RealTimeElement_RealTimeElement.Events);

// CONCATENATED MODULE: ./src/main/model/ot/ops/ArrayReplaceOperation.ts



class ArrayReplaceOperation_ArrayReplaceOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.ARRAY_SET, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new ArrayReplaceOperation_ArrayReplaceOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.index, updates.index), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/ArrayRemoveOperation.ts



class ArrayRemoveOperation_ArrayRemoveOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, index) {
        super(OperationType.ARRAY_REMOVE, id, noOp);
        this.index = index;
        Object.freeze(this);
    }
    copy(updates) {
        return new ArrayRemoveOperation_ArrayRemoveOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.index, updates.index));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/ArrayMoveOperation.ts



class ArrayMoveOperation_ArrayMoveOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, fromIndex, toIndex) {
        super(OperationType.ARRAY_REORDER, id, noOp);
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        Object.freeze(this);
    }
    copy(updates) {
        return new ArrayMoveOperation_ArrayMoveOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.fromIndex, updates.fromIndex), Immutable.update(this.toIndex, updates.toIndex));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/ArraySetOperation.ts



class ArraySetOperation_ArraySetOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, value) {
        super(OperationType.ARRAY_VALUE, id, noOp);
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new ArraySetOperation_ArraySetOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableArray.ts

const ObservableArrayEventConstants = Object.assign(Object.assign({}, ObservableElementEventConstants), { INSERT: "insert", REMOVE: "remove", SET: "set", REORDER: "reorder" });
Object.freeze(ObservableArrayEventConstants);

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeArray.ts








class RealTimeArray_RealTimeArray extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [], identityCache);
        this._delegate.events().subscribe((event) => {
            if (event.local) {
                if (event instanceof ArrayNodeInsertEvent) {
                    this._sendOperation(new ArrayInsertOperation_ArrayInsertOperation(this.id(), false, event.index, event.src.get(event.index).dataValue()));
                }
                else if (event instanceof ArrayNodeRemoveEvent) {
                    this._sendOperation(new ArrayRemoveOperation_ArrayRemoveOperation(this.id(), false, event.index));
                }
                else if (event instanceof ArrayNodeReorderEvent) {
                    this._sendOperation(new ArrayMoveOperation_ArrayMoveOperation(this.id(), false, event.fromIndex, event.toIndex));
                }
                else if (event instanceof ArrayNodeSetEvent) {
                    const index = event.index;
                    this._sendOperation(new ArrayReplaceOperation_ArrayReplaceOperation(this.id(), false, index, event.src.get(index).dataValue()));
                }
                else if (event instanceof ArrayNodeSetValueEvent) {
                    this._sendOperation(new ArraySetOperation_ArraySetOperation(this.id(), false, event.src.dataValue().value));
                }
            }
        });
    }
    get(index) {
        return this._wrapperFactory.wrap(this._delegate.get(index));
    }
    set(index, value) {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.set(index, value));
    }
    insert(index, value) {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.insert(index, value));
    }
    remove(index) {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.remove(index));
    }
    reorder(fromIndex, toIndex) {
        this._assertWritable();
        this._delegate.reorder(fromIndex, toIndex);
    }
    push(value) {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.push(value));
    }
    pop() {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.pop());
    }
    unshift(value) {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.unshift(value));
    }
    shift() {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.shift());
    }
    length() {
        return this._delegate.length();
    }
    some(callback) {
        return this._delegate.some((modelNode, index) => {
            return callback(this._wrapperFactory.wrap(modelNode), index);
        });
    }
    every(callback) {
        return this._delegate.every((modelNode, index) => {
            return callback(this._wrapperFactory.wrap(modelNode), index);
        });
    }
    find(callback) {
        const node = this._delegate.find((modelNode, index) => {
            return callback(this._wrapperFactory.wrap(modelNode), index);
        });
        if (node === undefined) {
            return undefined;
        }
        else {
            return this._wrapperFactory.wrap(node);
        }
    }
    findIndex(callback) {
        return this._delegate.findIndex((modelNode, index) => {
            return callback(this._wrapperFactory.wrap(modelNode), index);
        });
    }
    forEach(callback) {
        this._delegate.forEach((modelNode, index) => {
            callback(this._wrapperFactory.wrap(modelNode), index);
        });
    }
    elementAt(...path) {
        return this._wrapperFactory.wrap(this._delegate.valueAt(...path));
    }
    _removeChild(relPath) {
        if (typeof relPath !== "number") {
            throw new Error("The relative path of a child must be a number: " + (typeof relPath));
        }
        this.remove(relPath);
    }
    _handleRemoteReferenceEvent(event) {
        throw new Error("Arrays to do have references yet.");
    }
}
RealTimeArray_RealTimeArray.Events = ObservableArrayEventConstants;

// CONCATENATED MODULE: ./src/main/model/ot/ops/BooleanSetOperation.ts



class BooleanSetOperation_BooleanSetOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, value) {
        super(OperationType.BOOLEAN_VALUE, id, noOp);
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new BooleanSetOperation_BooleanSetOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableBoolean.ts


// CONCATENATED MODULE: ./src/main/model/rt/RealTimeBoolean.ts




class RealTimeBoolean_RealTimeBoolean extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [], identityCache);
        this._delegate.events().subscribe((event) => {
            if (event.local) {
                if (event instanceof BooleanNodeSetValueEvent) {
                    this._sendOperation(new BooleanSetOperation_BooleanSetOperation(this.id(), false, event.value));
                }
            }
        });
    }
    _handleRemoteReferenceEvent(event) {
        throw new Error("Boolean values do not process references");
    }
}
RealTimeBoolean_RealTimeBoolean.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/reference/LocalModelReference.ts


class LocalModelReference_LocalModelReference extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(reference, callbacks) {
        super();
        this._emitFrom(reference.events());
        this._reference = reference;
        this._shared = false;
        this._callbacks = callbacks;
    }
    type() {
        return this._reference.type();
    }
    key() {
        return this._reference.key();
    }
    source() {
        return this._reference.source();
    }
    isLocal() {
        return true;
    }
    user() {
        return this._reference.user();
    }
    sessionId() {
        return this._reference.sessionId();
    }
    isDisposed() {
        return this._reference.isDisposed();
    }
    value() {
        return this._reference.value();
    }
    values() {
        return this._reference.values();
    }
    reference() {
        return this._reference;
    }
    share() {
        this._ensureAttached();
        this._shared = true;
        this._callbacks.onShare(this);
    }
    unshare() {
        this._ensureAttached();
        this._shared = false;
        this._callbacks.onUnShare(this);
    }
    isShared() {
        return this._shared;
    }
    set(value) {
        this._ensureAttached();
        if (value instanceof Array) {
            this._reference._set(value, false);
        }
        else {
            this._reference._set([value], false);
        }
        if (this.isShared()) {
            this._callbacks.onSet(this);
        }
    }
    clear() {
        this._ensureAttached();
        this._reference._clear();
        this._callbacks.onClear(this);
    }
    isSet() {
        return this._reference.isSet();
    }
    dispose() {
        this._ensureAttached();
        this.unshare();
        this._reference._dispose();
        this._callbacks = null;
    }
    _ensureAttached() {
        if (this.type() !== ModelReference_ModelReference.Types.ELEMENT) {
            if (this.reference().source().isDetached()) {
                throw new Error("The source model is detached");
            }
        }
    }
}
LocalModelReference_LocalModelReference.Events = ModelReference_ModelReference.Events;

// CONCATENATED MODULE: ./src/main/model/reference/LocalElementReference.ts

class LocalElementReference_LocalElementReference extends LocalModelReference_LocalModelReference {
    constructor(reference, referenceCallbacks) {
        super(reference, referenceCallbacks);
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/LocalPropertyReference.ts

class LocalPropertyReference_LocalPropertyReference extends LocalModelReference_LocalModelReference {
    constructor(reference, referenceCallbacks) {
        super(reference, referenceCallbacks);
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/LocalRangeReference.ts

class LocalRangeReference_LocalRangeReference extends LocalModelReference_LocalModelReference {
    constructor(reference, referenceCallbacks) {
        super(reference, referenceCallbacks);
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/index.ts











// CONCATENATED MODULE: ./src/main/model/ModelElementType.ts
class ModelElementType {
}
ModelElementType.OBJECT = "object";
ModelElementType.ARRAY = "array";
ModelElementType.STRING = "string";
ModelElementType.NUMBER = "number";
ModelElementType.BOOLEAN = "boolean";
ModelElementType.NULL = "null";
ModelElementType.UNDEFINED = "undefined";
ModelElementType.DATE = "date";

// CONCATENATED MODULE: ./src/main/model/internal/ModelNode.ts


class ModelNode_ModelNode extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(modelType, id, path, model, session) {
        super();
        this._id = id;
        this._session = session;
        this._modelType = modelType;
        this._model = model;
        this._path = path;
        if (this._model) {
            this._model._registerValue(this);
        }
    }
    session() {
        return this._session;
    }
    id() {
        return this._id;
    }
    type() {
        return this._modelType;
    }
    path() {
        return this._path();
    }
    model() {
        return this._model;
    }
    isDetached() {
        return this._model === null;
    }
    _detach(local) {
        this._model._unregisterValue(this);
        this._model = null;
        const event = new NodeDetachedEvent(this, local);
        this._emitEvent(event);
    }
    data(value) {
        if (arguments.length === 0) {
            return this._getData();
        }
        else {
            this._setData(value);
            return;
        }
    }
    _emitValueEvent(event) {
        this._emitEvent(event);
        this._emitEvent(new NodeChangedEvent(this, event.local, [], event, this._session.sessionId(), this._session.user()));
    }
    _exceptionIfDetached() {
        if (this.isDetached()) {
            throw Error("Can not perform actions on a detached ModelNode.");
        }
    }
}
ModelNode_ModelNode.Events = {
    DETACHED: "detached",
    NODE_CHANGED: "node_changed",
    OPERATION: "operation"
};

// CONCATENATED MODULE: ./src/main/model/internal/UndefinedNode.ts


class UndefinedNode_UndefinedNode extends ModelNode_ModelNode {
    constructor(id, path, session) {
        super(ModelElementType.UNDEFINED, id, path, undefined, session);
    }
    dataValue() {
        return undefined;
    }
    toJson() {
        return undefined;
    }
    _handleModelOperationEvent(operationEvent) {
        throw new Error("Undefined values do not process operations");
    }
    _getData() {
        return undefined;
    }
    _setData(data) {
        throw new Error("Can not set the delta on a Undefined type.");
    }
}
UndefinedNode_UndefinedNode.Events = {
    DETACHED: ModelNode_ModelNode.Events.DETACHED
};

// CONCATENATED MODULE: ./src/main/model/internal/NullNode.ts


class NullNode_NullNode extends ModelNode_ModelNode {
    constructor(id, path, model, session) {
        super(ModelElementType.NULL, id, path, model, session);
    }
    dataValue() {
        return {
            id: this.id(),
            type: "null",
            value: this.data()
        };
    }
    toJson() {
        return null;
    }
    _handleModelOperationEvent(operationEvent) {
        throw new Error("Null values do not process operations");
    }
    _getData() {
        return null;
    }
    _setData(data) {
        throw new Error("Can not set the delta on a Null type.");
    }
}
NullNode_NullNode.Events = {
    DETACHED: ModelNode_ModelNode.Events.DETACHED
};

// CONCATENATED MODULE: ./src/main/model/internal/StringNode.ts





class StringNode_StringNode extends ModelNode_ModelNode {
    constructor(data, path, model, session) {
        super(ModelElementType.STRING, data.id, path, model, session);
        this._data = data.value;
    }
    dataValue() {
        return {
            id: this.id(),
            type: "string",
            value: this.data()
        };
    }
    toJson() {
        return this._data;
    }
    insert(index, value) {
        this._applyInsert(index, value, true, this._session.sessionId(), this._session.user());
    }
    remove(index, length) {
        this._applyRemove(index, length, true, this._session.sessionId(), this._session.user());
    }
    length() {
        return this._data.length;
    }
    _handleModelOperationEvent(operationEvent) {
        const type = operationEvent.operation.type;
        if (type === OperationType.STRING_INSERT) {
            this._handleInsertOperation(operationEvent);
        }
        else if (type === OperationType.STRING_REMOVE) {
            this._handleRemoveOperation(operationEvent);
        }
        else if (type === OperationType.STRING_VALUE) {
            this._handleSetOperation(operationEvent);
        }
        else {
            throw new Error("Invalid operation!");
        }
    }
    _setData(data) {
        this._applySetValue(data, true, this._session.sessionId(), this._session.user());
    }
    _getData() {
        return this._data;
    }
    _applyInsert(index, value, local, sessionId, user) {
        Validation_Validation.assertValidStringIndex(index, this._data, true, "index");
        this._data = this._data.slice(0, index) + value + this._data.slice(index, this._data.length);
        const event = new StringNodeInsertEvent(this, local, index, value, sessionId, user);
        this._emitValueEvent(event);
    }
    _applyRemove(index, length, local, sessionId, user) {
        Validation_Validation.assertValidStringIndex(index, this._data, false, "index");
        Validation_Validation.assertValidStringIndex(index + length, this._data, true);
        const removedVal = this._data.slice(index, index + length);
        this._data = this._data.slice(0, index) + this._data.slice(index + length, this._data.length);
        const event = new StringNodeRemoveEvent(this, local, index, removedVal, sessionId, user);
        this._emitValueEvent(event);
    }
    _applySetValue(value, local, sessionId, user) {
        Validation_Validation.assertString(value);
        this._data = value;
        const event = new StringNodeSetValueEvent(this, local, value, sessionId, user);
        this._emitValueEvent(event);
    }
    _handleInsertOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyInsert(operation.index, operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleRemoveOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyRemove(operation.index, operation.value.length, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleSetOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySetValue(operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
}
StringNode_StringNode.Events = {
    INSERT: "insert",
    REMOVE: "remove",
    VALUE: "value",
    DETACHED: ModelNode_ModelNode.Events.DETACHED,
    MODEL_CHANGED: ModelNode_ModelNode.Events.MODEL_CHANGED
};

// CONCATENATED MODULE: ./src/main/model/internal/ContainerNode.ts



class ContainerNode_ContainerNode extends ModelNode_ModelNode {
    constructor(modelType, id, path, model, session) {
        super(modelType, id, path, model, session);
        this._nodeChangedHandler = (event) => {
            const newPath = event.relativePath.slice(0);
            newPath.unshift(this._idToPathElement.get(event.src.id()));
            const newEvent = new NodeChangedEvent(this, event.local, newPath, event.childEvent, this._session.sessionId(), this._session.user());
            this._emitEvent(newEvent);
        };
        this._idToPathElement = new Map();
    }
    valueAt(...path) {
        const resolved = (path.length === 1 && Array.isArray(path[0])) ?
            path[0] :
            path;
        if (path.length === 0) {
            return this;
        }
        return this._valueAt(resolved);
    }
    _detach(local) {
        this._detachChildren(local);
        super._detach(local);
    }
    _createUndefinedNode() {
        return ModelNodeFactory_ModelNodeFactory.create(undefined, () => null, undefined, this._session);
    }
}
ContainerNode_ContainerNode.Events = {
    NODE_CHANGED: ModelNode_ModelNode.Events.NODE_CHANGED
};

// CONCATENATED MODULE: ./src/main/model/internal/ArrayNode.ts







class ArrayNode_ArrayNode extends ContainerNode_ContainerNode {
    constructor(data, path, model, session, dataValueFactory) {
        super(ModelElementType.ARRAY, data.id, path, model, session);
        this._children = [];
        this._dataValueFactory = dataValueFactory;
        for (let i = 0; i < data.value.length; i++) {
            const child = data.value[i];
            this._idToPathElement.set(child.id, i);
            this._children.push(ModelNodeFactory_ModelNodeFactory.create(child, this._pathCB(child.id), model, session, dataValueFactory));
        }
        this._children.forEach((child) => {
            child.on(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        });
    }
    dataValue() {
        const values = this._children.map((node) => {
            return node.dataValue();
        });
        return {
            id: this.id(),
            type: "array",
            value: values
        };
    }
    toJson() {
        const jsonArray = [];
        this.forEach(node => {
            jsonArray.push(node.toJson());
        });
        return jsonArray;
    }
    get(index) {
        this._validateIndex(index, false);
        return this._children[index];
    }
    set(index, value) {
        this._validateIndex(index, false);
        const dataValue = this._dataValueFactory.createDataValue(value);
        this._applySet(index, dataValue, true, this._session.sessionId(), this._session.user());
        return this.get(index);
    }
    insert(index, value) {
        this._validateIndex(index, true);
        const dataValue = this._dataValueFactory.createDataValue(value);
        this._applyInsert(index, dataValue, true, this._session.sessionId(), this._session.user());
        return this.get(index);
    }
    remove(index) {
        this._validateIndex(index, false);
        const oldValue = this.get(index);
        this._applyRemove(index, true, this._session.sessionId(), this._session.user());
        return oldValue;
    }
    reorder(fromIndex, toIndex) {
        this._validateIndex(fromIndex, false, "fromIndex");
        this._validateIndex(toIndex, false, "toIndex");
        this._applyReorder(fromIndex, toIndex, true, this._session.sessionId(), this._session.user());
    }
    push(value) {
        return this.insert(this._children.length, value);
    }
    pop() {
        return this.remove(this._children.length - 1);
    }
    unshift(value) {
        return this.insert(0, value);
    }
    shift() {
        return this.remove(0);
    }
    length() {
        return this._children.length;
    }
    some(callback) {
        return this._children.some(callback);
    }
    every(callback) {
        return this._children.every(callback);
    }
    find(callback) {
        return this._children.find(callback);
    }
    findIndex(callback) {
        return this._children.findIndex(callback);
    }
    forEach(callback) {
        this._children.forEach(callback);
    }
    _handleModelOperationEvent(operationEvent) {
        const type = operationEvent.operation.type;
        if (type === OperationType.ARRAY_INSERT) {
            this._handleInsertOperation(operationEvent);
        }
        else if (type === OperationType.ARRAY_REORDER) {
            this._handleReorderOperation(operationEvent);
        }
        else if (type === OperationType.ARRAY_REMOVE) {
            this._handleRemoveOperation(operationEvent);
        }
        else if (type === OperationType.ARRAY_SET) {
            this._handleSetOperation(operationEvent);
        }
        else if (type === OperationType.ARRAY_VALUE) {
            this._handleSetValueOperation(operationEvent);
        }
        else {
            throw new Error("Invalid operation!");
        }
    }
    _getData() {
        const returnVal = [];
        this.forEach((child) => {
            returnVal.push(child.data());
        });
        return returnVal;
    }
    _setData(data) {
        const dataValues = data.map((value) => {
            return this._dataValueFactory.createDataValue(value);
        });
        this._applySetValue(dataValues, true, this._session.sessionId(), this._session.user());
    }
    _detachChildren(local) {
        this._idToPathElement.clear();
        this.forEach((child) => {
            child._detach(local);
            child.removeListener(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        });
    }
    _valueAt(pathArgs) {
        if (pathArgs.length === 0) {
            return this;
        }
        const index = pathArgs[0];
        const child = this._children[index];
        if (child === undefined) {
            return this._createUndefinedNode();
        }
        if (pathArgs.length > 1) {
            if (child.type() === ModelElementType.OBJECT || child.type() === ModelElementType.ARRAY) {
                return child.valueAt(pathArgs.slice(1, pathArgs.length));
            }
            else {
                return this._createUndefinedNode();
            }
        }
        else {
            return child;
        }
    }
    _validateIndex(index, includeEnd, name) {
        if (index < 0) {
            const iName = name ? name : "index";
            throw new Error(`${iName} must be >= 0: ${index}`);
        }
        if ((!includeEnd && index >= this._children.length) || (includeEnd && index > this._children.length)) {
            const iName = name ? name : "index";
            const comparison = includeEnd ? "<=" : "<";
            throw new Error(`${iName} must be ${comparison} the length of the array: ${index}`);
        }
    }
    _applyInsert(index, value, local, sessionId, user) {
        this._validateInsert(index, value);
        this._idToPathElement.set(value.id, index);
        const child = ModelNodeFactory_ModelNodeFactory.create(value, this._pathCB(value.id), this._model, this._session, this._dataValueFactory);
        child.on(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        this._children.splice(index, 0, child);
        this._updateIdToPathElementMap(index);
        const event = new ArrayNodeInsertEvent(this, local, index, child, sessionId, user);
        this._emitValueEvent(event);
    }
    _applySet(index, value, local, sessionId, user) {
        this._validateReplace(index, value);
        const oldChild = this._valueAt([index]);
        if (oldChild.type() !== ModelElementType.UNDEFINED) {
            oldChild.removeListener(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
            oldChild._detach(local);
        }
        this._idToPathElement.set(value.id, index);
        const newChild = ModelNodeFactory_ModelNodeFactory.create(value, this._pathCB(value.id), this.model(), this._session, this._dataValueFactory);
        newChild.on(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        this._children[index] = newChild;
        this._updateIdToPathElementMap(index);
        const event = new ArrayNodeSetEvent(this, local, index, newChild, oldChild, sessionId, user);
        this._emitValueEvent(event);
    }
    _applyRemove(index, local, sessionId, user) {
        this._validateRemove(index);
        const oldChild = this._valueAt([index]);
        if (oldChild.type() !== ModelElementType.UNDEFINED) {
            oldChild.removeListener(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
            oldChild._detach(local);
        }
        this._children.splice(index, 1);
        this._updateIdToPathElementMap(index);
        const event = new ArrayNodeRemoveEvent(this, local, index, oldChild, sessionId, user);
        this._emitValueEvent(event);
    }
    _applySetValue(data, local, sessionId, user) {
        Validation_Validation.assertArray(data, "data");
        this._detachChildren(local);
        this._children = data.map((value, i) => {
            this._idToPathElement.set(value.id, i);
            return ModelNodeFactory_ModelNodeFactory.create(value, this._pathCB(value.id), this.model(), this._session, this._dataValueFactory);
        });
        this._children.forEach((child) => {
            child.on(ArrayNode_ArrayNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        });
        const event = new ArrayNodeSetValueEvent(this, local, this.data(), sessionId, user);
        this._emitValueEvent(event);
    }
    _applyReorder(fromIndex, toIndex, local, sessionId, user) {
        this._validateMove(fromIndex, toIndex);
        const child = this._children[fromIndex];
        this._children.splice(fromIndex, 1);
        this._children.splice(toIndex, 0, child);
        this._updateIdToPathElementMap(Math.min(fromIndex, toIndex));
        const event = new ArrayNodeReorderEvent(this, local, fromIndex, toIndex, sessionId, user);
        this._emitValueEvent(event);
    }
    _handleInsertOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyInsert(operation.index, operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleReorderOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyReorder(operation.fromIndex, operation.toIndex, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleRemoveOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyRemove(operation.index, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleSetOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySet(operation.index, operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleSetValueOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySetValue(operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _pathCB(id) {
        return () => {
            const path = this.path();
            path.push(this._idToPathElement.get(id));
            return path;
        };
    }
    _validateInsert(index, value) {
        if (this._children.length < index || index < 0) {
            throw new Error("Index out of bounds!");
        }
        if (typeof value === "undefined" || typeof value === "function") {
            throw new Error("Invalid value for insert!");
        }
    }
    _validateMove(fromIndex, toIndex) {
        if (this._children.length <= fromIndex || fromIndex < 0 || this._children.length <= toIndex || toIndex < 0) {
            throw new Error("Index out of bounds!");
        }
    }
    _validateRemove(index) {
        if (this._children.length <= index || index < 0) {
            throw new Error("Index out of bounds!");
        }
    }
    _validateReplace(index, value) {
        if (this._children.length <= index || index < 0) {
            throw new Error("Index out of bounds!");
        }
        if (typeof value === "undefined" || typeof value === "function") {
            throw new Error("Illegal argument!");
        }
    }
    _updateIdToPathElementMap(start) {
        for (let i = start; i < this._children.length; i++) {
            const child = this._children[i];
            this._idToPathElement.set(child.id(), i);
        }
    }
}
ArrayNode_ArrayNode.Events = {
    INSERT: "insert",
    REMOVE: "remove",
    SET: "set",
    REORDER: "reorder",
    VALUE: "value",
    DETACHED: ModelNode_ModelNode.Events.DETACHED,
    NODE_CHANGED: ContainerNode_ContainerNode.Events.NODE_CHANGED
};

// CONCATENATED MODULE: ./src/main/model/internal/NumberNode.ts




class NumberNode_NumberNode extends ModelNode_ModelNode {
    constructor(data, path, model, session) {
        super(ModelElementType.NUMBER, data.id, path, model, session);
        this._data = data.value;
    }
    dataValue() {
        return {
            id: this.id(),
            type: "number",
            value: this.data()
        };
    }
    toJson() {
        return this._data;
    }
    add(value) {
        this._applyDelta(value, true, this._session.sessionId(), this._session.user());
    }
    subtract(value) {
        this.add(-value);
    }
    increment() {
        this.add(1);
    }
    decrement() {
        this.add(-1);
    }
    _handleModelOperationEvent(operationEvent) {
        const type = operationEvent.operation.type;
        if (type === OperationType.NUMBER_DELTA) {
            this._handleAddOperation(operationEvent);
        }
        else if (type === OperationType.NUMBER_VALUE) {
            this._handleSetOperation(operationEvent);
        }
        else {
            throw new Error("Invalid operation!");
        }
    }
    _setData(data) {
        this._applySet(data, true, this._session.sessionId(), this._session.user());
    }
    _getData() {
        return this._data;
    }
    _applyDelta(delta, local, sessionId, user) {
        this._validateNumber(delta);
        if (delta !== 0) {
            this._data += delta;
            const event = new NumberNodeDeltaEvent(this, local, delta, sessionId, user);
            this._emitValueEvent(event);
        }
    }
    _applySet(value, local, sessionId, user) {
        this._validateNumber(value);
        this._data = value;
        const event = new NumberNodeSetValueEvent(this, local, value, sessionId, user);
        this._emitValueEvent(event);
    }
    _handleAddOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyDelta(operation.delta, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleSetOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySet(operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _validateNumber(value) {
        if (typeof value !== "number") {
            throw new Error(`The value must be a number but was: ${typeof value}`);
        }
        if (isNaN(value)) {
            throw new Error("The delta must not be NaN");
        }
    }
}
NumberNode_NumberNode.Events = {
    DELTA: "delta",
    VALUE: "value",
    DETACHED: ModelNode_ModelNode.Events.DETACHED,
    MODEL_CHANGED: ModelNode_ModelNode.Events.MODEL_CHANGED
};

// CONCATENATED MODULE: ./src/main/model/internal/BooleanNode.ts





class BooleanNode_BooleanNode extends ModelNode_ModelNode {
    constructor(data, path, model, session) {
        super(ModelElementType.BOOLEAN, data.id, path, model, session);
        this._data = data.value;
    }
    dataValue() {
        return {
            id: this.id(),
            type: "boolean",
            value: this.data()
        };
    }
    toJson() {
        return this._data;
    }
    _handleModelOperationEvent(operationEvent) {
        const type = operationEvent.operation.type;
        if (type === OperationType.BOOLEAN_VALUE) {
            this._handleSetOperation(operationEvent);
        }
        else {
            throw new Error("Invalid operation!");
        }
    }
    _setData(value) {
        this._applySetValue(value, true, this._session.sessionId(), this._session.user());
    }
    _getData() {
        return this._data;
    }
    _applySetValue(value, local, sessionId, user) {
        Validation_Validation.assertBoolean(value);
        this._data = value;
        const event = new BooleanNodeSetValueEvent(this, local, value, sessionId, user);
        this._emitValueEvent(event);
    }
    _handleSetOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySetValue(operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
}
BooleanNode_BooleanNode.Events = {
    VALUE: "value",
    DETACHED: ModelNode_ModelNode.Events.DETACHED,
    MODEL_CHANGED: ModelNode_ModelNode.Events.MODEL_CHANGED
};

// CONCATENATED MODULE: ./src/main/model/internal/DateNode.ts





class DateNode_DateNode extends ModelNode_ModelNode {
    constructor(data, path, model, session) {
        super(ModelElementType.DATE, data.id, path, model, session);
        this._data = data.value;
    }
    dataValue() {
        return {
            id: this.id(),
            type: "date",
            value: this.data()
        };
    }
    toJson() {
        return {
            $convergenceType: "date",
            value: this._data.toISOString()
        };
    }
    _handleModelOperationEvent(operationEvent) {
        const type = operationEvent.operation.type;
        if (type === OperationType.DATE_VALUE) {
            this._handleSetOperation(operationEvent);
        }
        else {
            throw new Error("Invalid operation!");
        }
    }
    _setData(value) {
        this._applySetValue(value, true, this._session.sessionId(), this._session.user());
    }
    _getData() {
        return this._data;
    }
    _applySetValue(value, local, sessionId, user) {
        Validation_Validation.assertDate(value);
        this._data = value;
        const event = new DateNodeSetValueEvent(this, local, value, sessionId, user);
        this._emitValueEvent(event);
    }
    _handleSetOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySetValue(operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
}
DateNode_DateNode.Events = {
    VALUE: "value",
    DETACHED: ModelNode_ModelNode.Events.DETACHED,
    MODEL_CHANGED: ModelNode_ModelNode.Events.MODEL_CHANGED
};

// CONCATENATED MODULE: ./src/main/model/internal/ModelNodeFactory.ts








class ModelNodeFactory_ModelNodeFactory {
    static create(data, path, model, session, dataValueFactory) {
        if (data === undefined) {
            return new UndefinedNode_UndefinedNode(undefined, path, session);
        }
        const type = data.type;
        if (type === "null") {
            return new NullNode_NullNode(data.id, path, model, session);
        }
        else if (type === "string") {
            return new StringNode_StringNode(data, path, model, session);
        }
        else if (type === "array") {
            return new ArrayNode_ArrayNode(data, path, model, session, dataValueFactory);
        }
        else if (type === "object") {
            return new ObjectNode_ObjectNode(data, path, model, session, dataValueFactory);
        }
        else if (type === "number") {
            return new NumberNode_NumberNode(data, path, model, session);
        }
        else if (type === "boolean") {
            return new BooleanNode_BooleanNode(data, path, model, session);
        }
        else if (type === "date") {
            return new DateNode_DateNode(data, path, model, session);
        }
        else {
            throw new Error("Invalid data type: " + type);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/internal/ObjectNode.ts







class ObjectNode_ObjectNode extends ContainerNode_ContainerNode {
    constructor(data, path, model, session, dataValueFactory) {
        super(ModelElementType.OBJECT, data.id, path, model, session);
        this.dataValueFactory = dataValueFactory;
        this._children = new Map();
        Object.getOwnPropertyNames(data.value).forEach((prop) => {
            const child = data.value[prop];
            this._idToPathElement.set(child.id, prop);
            this._children.set(prop, ModelNodeFactory_ModelNodeFactory.create(child, this._pathCB(child.id), model, this._session, this.dataValueFactory));
        });
        this._children.forEach((child) => {
            child.on(ObjectNode_ObjectNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        });
    }
    dataValue() {
        const values = {};
        this._children.forEach((value, key) => {
            values[key] = value.dataValue();
        });
        return {
            id: this.id(),
            type: "object",
            value: values
        };
    }
    toJson() {
        const jsonObject = {};
        this.forEach((node, key) => {
            jsonObject[key] = node.toJson();
        });
        return jsonObject;
    }
    get(key) {
        Validation_Validation.assertString(key, "key");
        return this._valueAt([key]);
    }
    set(key, value) {
        const dataValue = this.dataValueFactory.createDataValue(value);
        this._applySet(key, dataValue, true, this._session.sessionId(), this._session.user());
        return this.get(key);
    }
    remove(key) {
        const oldValue = this._valueAt([key]);
        this._applyRemove(key, true, this._session.sessionId(), this._session.user());
        return oldValue;
    }
    keys() {
        const keys = [];
        this._children.forEach((v, k) => {
            keys.push(k);
        });
        return keys;
    }
    hasKey(key) {
        return this._children.has(key);
    }
    forEach(callback) {
        this._children.forEach((value, key) => {
            callback(value, key);
        });
    }
    _handleModelOperationEvent(operationEvent) {
        switch (operationEvent.operation.type) {
            case OperationType.OBJECT_ADD:
                this._handleAddPropertyOperation(operationEvent);
                break;
            case OperationType.OBJECT_SET:
                this._handleSetPropertyOperation(operationEvent);
                break;
            case OperationType.OBJECT_REMOVE:
                this._handleRemovePropertyOperation(operationEvent);
                break;
            case OperationType.OBJECT_VALUE:
                this._handleSetOperation(operationEvent);
                break;
            default:
                throw new Error("Invalid operation for RealTimeObject");
        }
    }
    _getData() {
        const returnObject = {};
        this.forEach((model, key) => {
            returnObject[key] = model.data();
        });
        return returnObject;
    }
    _setData(data) {
        const values = {};
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                values[prop] = this.dataValueFactory.createDataValue(data[prop]);
            }
        }
        this._applySetValue(values, true, this._session.sessionId(), this._session.user());
    }
    _valueAt(pathArgs) {
        if (pathArgs.length === 0) {
            return this;
        }
        const prop = pathArgs[0];
        const child = this._children.get(prop);
        if (child === undefined) {
            return this._createUndefinedNode();
        }
        if (pathArgs.length > 1) {
            if (child.type() === ModelElementType.OBJECT || child.type() === ModelElementType.ARRAY) {
                return child.valueAt(pathArgs.slice(1, pathArgs.length));
            }
            else {
                return this._createUndefinedNode();
            }
        }
        else {
            return child;
        }
    }
    _detachChildren(local) {
        this.forEach((child) => {
            child._detach(local);
            child.removeListener(ObjectNode_ObjectNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        });
    }
    _pathCB(id) {
        return () => {
            const path = this.path();
            path.push(this._idToPathElement.get(id));
            return path;
        };
    }
    _applySet(key, value, local, sessionId, user) {
        Validation_Validation.assertString(key, "key");
        const oldValue = this._valueAt([key]);
        if (oldValue.type() !== ModelElementType.UNDEFINED) {
            oldValue.removeListener(ObjectNode_ObjectNode.Events.NODE_CHANGED, this._nodeChangedHandler);
            oldValue._detach(local);
        }
        const child = ModelNodeFactory_ModelNodeFactory.create(value, this._pathCB(value.id), this._model, this._session, this.dataValueFactory);
        child.on(ObjectNode_ObjectNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        this._children.set(key, child);
        this._idToPathElement.set(child.id(), key);
        const event = new ObjectNodeSetEvent(this, local, key, child, oldValue, sessionId, user);
        this._emitValueEvent(event);
    }
    _applyRemove(key, local, sessionId, user) {
        Validation_Validation.assertString(key, "key");
        if (this._children.has(key)) {
            this._idToPathElement.delete(key);
            const oldChild = this._children.get(key);
            oldChild.removeListener(ObjectNode_ObjectNode.Events.NODE_CHANGED, this._nodeChangedHandler);
            oldChild._detach(local);
            this._children.delete(key);
            const event = new ObjectNodeRemoveEvent(this, local, key, oldChild, sessionId, user);
            this._emitValueEvent(event);
        }
    }
    _applySetValue(values, local, sessionId, user) {
        this._detachChildren(local);
        this._children = new Map();
        for (const prop in values) {
            if (values.hasOwnProperty(prop)) {
                const dataValue = values[prop];
                this._idToPathElement.set(dataValue.id, prop);
                this._children.set(prop, ModelNodeFactory_ModelNodeFactory.create(dataValue, this._pathCB(dataValue.id), this.model(), this._session, this.dataValueFactory));
            }
        }
        this._children.forEach((child) => {
            child.on(ObjectNode_ObjectNode.Events.NODE_CHANGED, this._nodeChangedHandler);
        });
        const event = new ObjectNodeSetValueEvent(this, local, this.data(), sessionId, user);
        this._emitValueEvent(event);
    }
    _handleAddPropertyOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySet(operation.prop, operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleSetPropertyOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySet(operation.prop, operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleRemovePropertyOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applyRemove(operation.prop, false, operationEvent.sessionId, operationEvent.user);
    }
    _handleSetOperation(operationEvent) {
        const operation = operationEvent.operation;
        this._applySetValue(operation.value, false, operationEvent.sessionId, operationEvent.user);
    }
}
ObjectNode_ObjectNode.Events = {
    SET: "set",
    REMOVE: "remove",
    VALUE: "value",
    DETACHED: ModelNode_ModelNode.Events.DETACHED,
    NODE_CHANGED: ModelNode_ModelNode.Events.NODE_CHANGED,
    OPERATION: ModelNode_ModelNode.Events.OPERATION
};

// CONCATENATED MODULE: ./src/main/model/internal/Model.ts



const VALUE_SEPARATOR = ":";
class Model_Model extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(session, valueIdPrefix, data) {
        super();
        this._session = session;
        this._valueIdPrefix = valueIdPrefix;
        this._idToValue = new Map();
        this._vidCounter = 0;
        const dataValueFactory = new DataValueFactory(() => {
            return this._valueIdPrefix + VALUE_SEPARATOR + this._vidCounter++;
        });
        this._data = new ObjectNode_ObjectNode(data, () => {
            return [];
        }, this, session, dataValueFactory);
    }
    root() {
        return this._data;
    }
    valueAt(...path) {
        return this._data.valueAt(...path);
    }
    setValueIdPrefix(prefix) {
        this._valueIdPrefix = prefix;
    }
    _getRegisteredValue(id) {
        return this._idToValue.get(id);
    }
    _registerValue(value) {
        this._idToValue.set(value.id(), value);
    }
    _unregisterValue(value) {
        this._idToValue.delete(value.id());
    }
    handleModelOperationEvent(modelEvent) {
        const child = this._idToValue.get(modelEvent.operation.id);
        if (child) {
            child._handleModelOperationEvent(modelEvent);
        }
    }
    valueIdPrefix() {
        return this._valueIdPrefix;
    }
}
Model_Model.Events = {
    DELETED: "deleted",
    MODIFIED: "modified"
};
Object.freeze(Model_Model.Events);
var ModelForcedCloseReasonCodes;
(function (ModelForcedCloseReasonCodes) {
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["UNKNOWN"] = 0] = "UNKNOWN";
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["DELETED"] = 2] = "DELETED";
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["ERROR_APPLYING_OPERATION"] = 3] = "ERROR_APPLYING_OPERATION";
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["INVALID_REFERENCE_EVENT"] = 4] = "INVALID_REFERENCE_EVENT";
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["PERMISSION_ERROR"] = 5] = "PERMISSION_ERROR";
    ModelForcedCloseReasonCodes[ModelForcedCloseReasonCodes["UNEXPECTED_COMMITTED_VERSION"] = 6] = "UNEXPECTED_COMMITTED_VERSION";
})(ModelForcedCloseReasonCodes || (ModelForcedCloseReasonCodes = {}));

// CONCATENATED MODULE: ./src/main/model/internal/NodeWrapperFactory.ts

class NodeWrapperFactory_NodeWrapperFactory {
    constructor() {
        this._wrappers = new Map();
    }
    wrap(node) {
        let wrapper = this._wrappers.get(node.id());
        if (wrapper === undefined) {
            wrapper = this._createWrapper(node);
            this._wrappers.set(node.id(), wrapper);
            node.on(ModelNode_ModelNode.Events.DETACHED, () => {
                this._wrappers.delete(node.id());
            });
        }
        return wrapper;
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/ObjectRemovePropertyOperation.ts



class ObjectRemovePropertyOperation_ObjectRemovePropertyOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, prop) {
        super(OperationType.OBJECT_REMOVE, id, noOp);
        this.prop = prop;
        Object.freeze(this);
    }
    copy(updates) {
        return new ObjectRemovePropertyOperation_ObjectRemovePropertyOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.prop, updates.prop));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/ObjectSetOperation.ts



class ObjectSetOperation_ObjectSetOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, value) {
        super(OperationType.OBJECT_VALUE, id, noOp);
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new ObjectSetOperation_ObjectSetOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableObject.ts

const ObservableObjectEventConstants = Object.assign({ SET: "set", REMOVE: "remove" }, ObservableElementEventConstants);
Object.freeze(ObservableObjectEventConstants);

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeObject.ts








class RealTimeObject_RealTimeObject extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [ModelReference_ModelReference.Types.PROPERTY], identityCache);
        this._delegate.events().subscribe(event => this._handleReferenceEvents(event));
    }
    get(key) {
        return this._wrapperFactory.wrap(this._delegate.get(key));
    }
    set(key, value) {
        this._assertWritable();
        const propSet = this._delegate.hasKey(key);
        const delegateChild = this._delegate.set(key, value);
        const operation = propSet ?
            new ObjectSetPropertyOperation_ObjectSetPropertyOperation(this.id(), false, key, delegateChild.dataValue()) :
            new ObjectAddPropertyOperation_ObjectAddPropertyOperation(this.id(), false, key, delegateChild.dataValue());
        this._sendOperation(operation);
        return this._wrapperFactory.wrap(delegateChild);
    }
    remove(key) {
        this._assertWritable();
        return this._wrapperFactory.wrap(this._delegate.remove(key));
    }
    keys() {
        return this._delegate.keys();
    }
    hasKey(key) {
        return this._delegate.hasKey(key);
    }
    forEach(callback) {
        this._delegate.forEach((modelNode, key) => {
            callback(this._wrapperFactory.wrap(modelNode), key);
        });
    }
    elementAt(...path) {
        return this._wrapperFactory.wrap(this._delegate.valueAt(...path));
    }
    propertyReference(key) {
        const existing = this._referenceManager.getLocalReference(key);
        if (existing !== undefined) {
            if (existing.reference().type() !== ModelReference_ModelReference.Types.PROPERTY) {
                throw new Error("A reference with this key already exists, but is not an index reference");
            }
            else {
                return existing;
            }
        }
        else {
            const reference = new PropertyReference_PropertyReference(this._referenceManager, key, this, this._delegate.session().user(), this._delegate.session().sessionId(), true);
            const local = new LocalPropertyReference_LocalPropertyReference(reference, this._callbacks.referenceEventCallbacks);
            this._referenceManager.addLocalReference(local);
            return local;
        }
    }
    _removeChild(relPath) {
        if (typeof relPath !== "string") {
            throw new Error("The relative path of a child must be a string: " + (typeof relPath));
        }
        this.remove(relPath);
    }
    _handleReferenceEvents(event) {
        if (event instanceof ObjectNodeSetValueEvent) {
            if (event.local) {
                this._sendOperation(new ObjectSetOperation_ObjectSetOperation(this.id(), false, this._delegate.dataValue().value));
            }
            this._referenceManager.getAll().forEach((ref) => {
                ref._dispose();
            });
            this._referenceManager.removeAll();
            this._referenceManager.removeAllLocalReferences();
        }
        else if (event instanceof ObjectNodeRemoveEvent) {
            if (event.local) {
                this._sendOperation(new ObjectRemovePropertyOperation_ObjectRemovePropertyOperation(this.id(), false, event.key));
            }
            this._referenceManager.getAll().forEach((ref) => {
                if (ref instanceof PropertyReference_PropertyReference) {
                    ref._handlePropertyRemoved(event.key);
                }
            });
        }
        else if (event instanceof ObjectNodeSetEvent) {
            if (event.local) {
            }
            this._referenceManager.getAll().forEach((ref) => {
                if (ref instanceof PropertyReference_PropertyReference) {
                    ref._handlePropertyRemoved(event.key);
                }
            });
        }
    }
}
RealTimeObject_RealTimeObject.Events = ObservableObjectEventConstants;

// CONCATENATED MODULE: ./src/main/model/observable/ObservableNull.ts


// CONCATENATED MODULE: ./src/main/model/rt/RealTimeNull.ts


class RealTimeNull_RealTimeNull extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [], identityCache);
    }
    handleRemoteReferenceEvent(event) {
        throw new Error("Null values do not process references");
    }
}
RealTimeNull_RealTimeNull.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/ot/ops/NumberSetOperation.ts



class NumberSetOperation_NumberSetOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, value) {
        super(OperationType.NUMBER_VALUE, id, noOp);
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new NumberSetOperation_NumberSetOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/NumberDeltaOperation.ts



class NumberDeltaOperation_NumberDeltaOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, delta) {
        super(OperationType.NUMBER_DELTA, id, noOp);
        this.delta = delta;
        Object.freeze(this);
    }
    copy(updates) {
        return new NumberDeltaOperation_NumberDeltaOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.delta, updates.delta));
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableNumber.ts

const ObservableNumberEventConstants = Object.assign({ DELTA: "delta" }, ObservableElementEventConstants);
Object.freeze(ObservableNumberEventConstants);

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeNumber.ts





class RealTimeNumber_RealTimeNumber extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [], identityCache);
        this._delegate.events().subscribe((event) => {
            if (event.local) {
                if (event instanceof NumberNodeSetValueEvent) {
                    this._sendOperation(new NumberSetOperation_NumberSetOperation(this.id(), false, event.value));
                }
                else if (event instanceof NumberNodeDeltaEvent) {
                    this._sendOperation(new NumberDeltaOperation_NumberDeltaOperation(this.id(), false, event.value));
                }
            }
        });
    }
    add(value) {
        this._assertWritable();
        this._delegate.add(value);
    }
    subtract(value) {
        this._assertWritable();
        this._delegate.subtract(value);
    }
    increment() {
        this._assertWritable();
        this._delegate.increment();
    }
    decrement() {
        this._assertWritable();
        this._delegate.decrement();
    }
    _handleRemoteReferenceEvent(event) {
        throw new Error("Number values do not process references");
    }
}
RealTimeNumber_RealTimeNumber.Events = ObservableNumberEventConstants;

// CONCATENATED MODULE: ./src/main/model/ot/ops/StringInsertOperation.ts



class StringInsertOperation_StringInsertOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.STRING_INSERT, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new StringInsertOperation_StringInsertOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.index, updates.index), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/StringRemoveOperation.ts



class StringRemoveOperation_StringRemoveOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.STRING_REMOVE, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new StringRemoveOperation_StringRemoveOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.index, updates.index), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/LocalIndexReference.ts

class LocalIndexReference_LocalIndexReference extends LocalModelReference_LocalModelReference {
    constructor(reference, referenceCallbacks) {
        super(reference, referenceCallbacks);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ops/StringSetOperation.ts



class StringSetOperation_StringSetOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, value) {
        super(OperationType.STRING_VALUE, id, noOp);
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new StringSetOperation_StringSetOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableString.ts

const ObservableStringEventConstants = Object.assign({ INSERT: "insert", REMOVE: "remove" }, ObservableElementEventConstants);
Object.freeze(ObservableStringEventConstants);

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeString.ts








class RealTimeString_RealTimeString extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [ModelReference_ModelReference.Types.INDEX, ModelReference_ModelReference.Types.RANGE], identityCache);
        this._delegate.events().subscribe(e => this._handleReferenceModelEvents(e));
    }
    insert(index, value) {
        this._assertWritable();
        this._delegate.insert(index, value);
    }
    remove(index, length) {
        this._assertWritable();
        this._delegate.remove(index, length);
    }
    length() {
        return this._delegate.length();
    }
    indexReference(key) {
        const existing = this._referenceManager.getLocalReference(key);
        if (existing !== undefined) {
            if (existing.reference().type() !== ModelReference_ModelReference.Types.INDEX) {
                throw new Error("A reference with this key already exists, but is not an index reference");
            }
            else {
                return existing;
            }
        }
        else {
            const reference = new IndexReference_IndexReference(this._referenceManager, key, this, this._delegate.session().user(), this._delegate.session().sessionId(), true);
            const local = new LocalIndexReference_LocalIndexReference(reference, this._callbacks.referenceEventCallbacks);
            this._referenceManager.addLocalReference(local);
            return local;
        }
    }
    rangeReference(key) {
        const existing = this._referenceManager.getLocalReference(key);
        if (existing !== undefined) {
            if (existing.reference().type() !== ModelReference_ModelReference.Types.RANGE) {
                throw new Error("A reference with this key already exists, but is not a range reference");
            }
            else {
                return existing;
            }
        }
        else {
            const reference = new RangeReference_RangeReference(this._referenceManager, key, this, this._delegate.session().user(), this._delegate.session().sessionId(), true);
            const local = new LocalRangeReference_LocalRangeReference(reference, this._callbacks.referenceEventCallbacks);
            this._referenceManager.addLocalReference(local);
            return local;
        }
    }
    _handleReferenceModelEvents(event) {
        if (event instanceof StringNodeInsertEvent) {
            if (event.local) {
                this._sendOperation(new StringInsertOperation_StringInsertOperation(this.id(), false, event.index, event.value));
            }
            this._referenceManager.getAll().forEach((ref) => {
                if (ref instanceof IndexReference_IndexReference) {
                    ref._handleInsert(event.index, event.value.length);
                }
                else if (ref instanceof RangeReference_RangeReference) {
                    ref._handleInsert(event.index, event.value.length);
                }
            });
        }
        else if (event instanceof StringNodeRemoveEvent) {
            if (event.local) {
                this._sendOperation(new StringRemoveOperation_StringRemoveOperation(this.id(), false, event.index, event.value));
            }
            this._referenceManager.getAll().forEach((ref) => {
                if (ref instanceof IndexReference_IndexReference) {
                    ref._handleRemove(event.index, event.value.length);
                }
                else if (ref instanceof RangeReference_RangeReference) {
                    ref._handleRemove(event.index, event.value.length);
                }
            });
        }
        else if (event instanceof StringNodeSetValueEvent) {
            if (event.local) {
                this._sendOperation(new StringSetOperation_StringSetOperation(this.id(), false, event.value));
            }
            this._referenceManager.getAll().forEach((ref) => {
                ref._dispose();
            });
            this._referenceManager.removeAll();
        }
    }
}
RealTimeString_RealTimeString.Events = ObservableStringEventConstants;
Object.freeze(RealTimeString_RealTimeString.Events);

// CONCATENATED MODULE: ./src/main/model/observable/ObservableUndefined.ts


// CONCATENATED MODULE: ./src/main/model/rt/RealTimeUndefined.ts


class RealTimeUndefined_RealTimeUndefined extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [], identityCache);
    }
    path() {
        return null;
    }
    relativePath() {
        return null;
    }
    parent() {
        return null;
    }
    removeFromParent() {
    }
    handleRemoteReferenceEvent(event) {
        throw new Error("Undefined values do not process references");
    }
    setData(data) {
        throw new Error("Can not set the delta on a Undefined type.");
    }
}
RealTimeUndefined_RealTimeUndefined.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/ot/ops/DateSetOperation.ts



class DateSetOperation_DateSetOperation extends DiscreteOperation_DiscreteOperation {
    constructor(id, noOp, value) {
        super(OperationType.DATE_VALUE, id, noOp);
        this.value = value;
        Object.freeze(this);
    }
    copy(updates) {
        return new DateSetOperation_DateSetOperation(Immutable.update(this.id, updates.id), Immutable.update(this.noOp, updates.noOp), Immutable.update(this.value, updates.value));
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableDate.ts


// CONCATENATED MODULE: ./src/main/model/rt/RealTimeDate.ts




class RealTimeDate_RealTimeDate extends RealTimeElement_RealTimeElement {
    constructor(delegate, callbacks, wrapperFactory, model, identityCache) {
        super(delegate, callbacks, wrapperFactory, model, [], identityCache);
        this._delegate.events().subscribe((event) => {
            if (event.local) {
                if (event instanceof DateNodeSetValueEvent) {
                    this._sendOperation(new DateSetOperation_DateSetOperation(this.id(), false, event.value));
                }
            }
        });
    }
    _handleRemoteReferenceEvent(event) {
        throw new Error("Date values do not process references");
    }
}
RealTimeDate_RealTimeDate.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeWrapperFactory.ts










class RealTimeWrapperFactory_RealTimeWrapperFactory extends NodeWrapperFactory_NodeWrapperFactory {
    constructor(_callbacks, _model, _identityCache) {
        super();
        this._callbacks = _callbacks;
        this._model = _model;
        this._identityCache = _identityCache;
    }
    _createWrapper(node) {
        switch (node.type()) {
            case ModelElementType.ARRAY:
                return new RealTimeArray_RealTimeArray(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.OBJECT:
                return new RealTimeObject_RealTimeObject(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.BOOLEAN:
                return new RealTimeBoolean_RealTimeBoolean(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.NULL:
                return new RealTimeNull_RealTimeNull(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.NUMBER:
                return new RealTimeNumber_RealTimeNumber(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.STRING:
                return new RealTimeString_RealTimeString(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.UNDEFINED:
                return new RealTimeUndefined_RealTimeUndefined(node, this._callbacks, this, this._model, this._identityCache);
            case ModelElementType.DATE:
                return new RealTimeDate_RealTimeDate(node, this._callbacks, this, this._model, this._identityCache);
            default:
                return null;
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/ServerOperationEvent.ts

class ServerOperationEvent_ServerOperationEvent {
    constructor(clientId, version, timestamp, operation) {
        this.clientId = clientId;
        this.version = version;
        this.timestamp = timestamp;
        this.operation = operation;
        Object.freeze(this);
    }
    copy(mods) {
        mods = Immutable.getOrDefault(mods, {});
        return new ServerOperationEvent_ServerOperationEvent(Immutable.getOrDefault(mods.clientId, this.clientId), Immutable.getOrDefault(mods.version, this.version), Immutable.getOrDefault(mods.timestamp, this.timestamp), Immutable.getOrDefault(mods.operation, this.operation));
    }
}

// CONCATENATED MODULE: ./src/main/model/ModelOperationEvent.ts
class ModelOperationEvent {
    constructor(sessionId, user, version, timestamp, operation) {
        this.sessionId = sessionId;
        this.user = user;
        this.version = version;
        this.timestamp = timestamp;
        this.operation = operation;
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/model/rt/ModelCollaborator.ts
class ModelCollaborator {
    constructor(user, sessionId) {
        this.user = user;
        this.sessionId = sessionId;
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/model/observable/ObservableModel.ts
const ObservableModelEventConstants = {
    CLOSED: "closed",
    DELETED: "deleted",
    VERSION_CHANGED: "version_changed"
};
Object.freeze(ObservableModelEventConstants);

// CONCATENATED MODULE: ./src/main/model/ModelPermissions.ts
class ModelPermissions {
    constructor(read, write, remove, manage) {
        this.read = read;
        this.write = write;
        this.remove = remove;
        this.manage = manage;
        Object.freeze(this);
    }
    static fromJSON(json) {
        return new ModelPermissions(json.read, json.write, json.remove, json.manage);
    }
    toJSON() {
        return { read: this.read, write: this.write, remove: this.remove, manage: this.manage };
    }
}

// CONCATENATED MODULE: ./src/main/model/query/ModelResult.ts
class ModelResult {
    constructor(data, collectionId, modelId, created, modified, version) {
        this.data = data;
        this.collectionId = collectionId;
        this.modelId = modelId;
        this.created = created;
        this.modified = modified;
        this.version = version;
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/model/query/index.ts


// CONCATENATED MODULE: ./src/main/model/ModelMessageConverter.ts







function toDataValue(val) {
    if (val.arrayValue) {
        const { id, children } = val.arrayValue;
        return {
            type: "array",
            id,
            value: getOrDefaultArray(children).map(toDataValue)
        };
    }
    else if (val.objectValue) {
        return toObjectValue(val.objectValue);
    }
    else if (val.booleanValue) {
        const { id, value } = val.booleanValue;
        return { type: "boolean", id, value: getOrDefaultBoolean(value) };
    }
    else if (val.dateValue) {
        const { id, value } = val.dateValue;
        return { type: "date", id, value: timestampToDate(value) };
    }
    else if (val.doubleValue) {
        const { id, value } = val.doubleValue;
        return { type: "number", id, value: getOrDefaultNumber(value) };
    }
    else if (val.stringValue) {
        const { id, value } = val.stringValue;
        return { type: "string", id, value: getOrDefaultString(value) };
    }
    else if (val.nullValue) {
        const { id } = val.nullValue;
        return { type: "null", id, value: null };
    }
    else {
        throw new ConvergenceError("Invalid data delta type: " + JSON.stringify(val));
    }
}
function toIDataValue(val) {
    if (val.type === "array") {
        const { id, value } = val;
        return { arrayValue: { id, children: value.map(toIDataValue) } };
    }
    else if (val.type === "object") {
        const { id, value } = val;
        return { objectValue: { id, children: mapObjectValues(value, toIDataValue) } };
    }
    else if (val.type === "boolean") {
        const { id, value } = val;
        return { booleanValue: { id, value } };
    }
    else if (val.type === "date") {
        const { id, value } = val;
        return { dateValue: { id, value: dateToTimestamp(value) } };
    }
    else if (val.type === "number") {
        const { id, value } = val;
        return { doubleValue: { id, value } };
    }
    else if (val.type === "null") {
        const { id } = val;
        return { nullValue: { id } };
    }
    else if (val.type === "string") {
        const { id, value } = val;
        return { stringValue: { id, value } };
    }
    else {
        throw new ConvergenceError("Invalid data delta type: " + JSON.stringify(val));
    }
}
function toIObjectValue(objectValue) {
    return {
        id: objectValue.id,
        children: mapObjectValues(objectValue.value, toIDataValue)
    };
}
function toObjectValue(objectValue) {
    return {
        type: "object",
        id: objectValue.id,
        value: mapObjectValues(getOrDefaultObject(objectValue.children), toDataValue)
    };
}
function toModelPermissions(permissionsData) {
    return permissionsData === undefined ?
        undefined :
        new ModelPermissions(getOrDefaultBoolean(permissionsData.read), getOrDefaultBoolean(permissionsData.write), getOrDefaultBoolean(permissionsData.remove), getOrDefaultBoolean(permissionsData.manage));
}
function toModelResult(result) {
    return new ModelResult(mapObjectValues(result.data.fields, protoValueToJson), result.collectionId, result.modelId, timestampToDate(result.createdTime), timestampToDate(result.modifiedTime), getOrDefaultNumber(result.version));
}
function modelUserPermissionMapToProto(perms) {
    if (perms === undefined || perms === null) {
        return [];
    }
    else {
        const mapped = [];
        objectForEach(perms, (username, permissions) => {
            mapped.push({
                user: domainUserIdToProto(DomainUserId.normal(username)),
                permissions
            });
        });
        return mapped;
    }
}
function protoToModelUserPermissionMap(perms) {
    const map = new Map();
    if (TypeChecker.isArray(perms)) {
        perms.forEach(entry => {
            map.set(entry.user.username, toModelPermissions(entry.permissions));
        });
    }
    return map;
}
function getModelMessageResourceId(message) {
    const modelMessage = toModelMessage(message);
    return modelMessage ? modelMessage.resourceId : null;
}
function toModelMessage(message) {
    return message.forceCloseRealTimeModel ||
        message.remoteOperation ||
        message.referenceShared ||
        message.referenceSet ||
        message.referenceCleared ||
        message.referenceUnshared ||
        message.operationAck ||
        message.remoteClientOpenedModel ||
        message.remoteClientClosedModel ||
        message.modelPermissionsChanged ||
        message.remoteClientResyncStarted ||
        message.remoteClientResyncCompleted;
}

// CONCATENATED MODULE: ./src/main/model/ModelPermissionManager.ts




class ModelPermissionManager_ModelPermissionManager {
    constructor(modelId, connection) {
        this._modelId = modelId;
        this._connection = connection;
    }
    get modelId() {
        return this._modelId;
    }
    getPermissions() {
        const request = {
            getModelPermissionsRequest: {
                modelId: this._modelId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getModelPermissionsResponse } = response;
            const permissionsData = getModelPermissionsResponse.userPermissions[this._connection.session().user().username];
            return toModelPermissions(permissionsData);
        });
    }
    setOverridesCollection(overrideCollection) {
        const request = {
            setModelPermissionsRequest: {
                modelId: this._modelId,
                overrideCollection: { value: overrideCollection },
                removeAllUserPermissionsBeforeSet: false,
                setUserPermissions: [],
                removedUserPermissions: []
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    getOverridesCollection() {
        const request = {
            getModelPermissionsRequest: {
                modelId: this._modelId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getModelPermissionsResponse } = response;
            return getModelPermissionsResponse.overridesCollection;
        });
    }
    getWorldPermissions() {
        const request = {
            getModelPermissionsRequest: {
                modelId: this._modelId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getModelPermissionsResponse } = response;
            return toModelPermissions(getModelPermissionsResponse.worldPermissions);
        });
    }
    setWorldPermissions(worldPermissions) {
        const request = {
            setModelPermissionsRequest: {
                modelId: this._modelId,
                worldPermissions,
                removeAllUserPermissionsBeforeSet: false,
                setUserPermissions: [],
                removedUserPermissions: []
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    getAllUserPermissions() {
        const request = {
            getModelPermissionsRequest: {
                modelId: this._modelId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getModelPermissionsResponse } = response;
            return protoToModelUserPermissionMap(getModelPermissionsResponse.userPermissions);
        });
    }
    setAllUserPermissions(permissions) {
        if (!(permissions instanceof Map)) {
            const permsObject = permissions;
            const map = new Map();
            Object.keys(permsObject).forEach(key => {
                map.set(key, permsObject[key]);
            });
            permissions = map;
        }
        const request = {
            setModelPermissionsRequest: {
                modelId: this._modelId,
                setUserPermissions: modelUserPermissionMapToProto(StringMap.mapToObject(permissions)),
                removeAllUserPermissionsBeforeSet: true
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    getUserPermissions(username) {
        const request = {
            getModelPermissionsRequest: {
                modelId: this._modelId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getModelPermissionsResponse } = response;
            return toModelPermissions(getModelPermissionsResponse.userPermissions[username]);
        });
    }
    setUserPermissions(user, permissions) {
        const userId = DomainUserId.toDomainUserId(user);
        const request = {
            setModelPermissionsRequest: {
                modelId: this._modelId,
                worldPermissions: null,
                setUserPermissions: [{ user: domainUserIdToProto(userId), permissions }],
                removeAllUserPermissionsBeforeSet: false,
                removedUserPermissions: []
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    removeUserPermissions(user) {
        const userId = DomainUserId.toDomainUserId(user);
        const request = {
            setModelPermissionsRequest: {
                modelId: this._modelId,
                removeAllUserPermissionsBeforeSet: false,
                removedUserPermissions: [domainUserIdToProto(userId)]
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
}

// CONCATENATED MODULE: ./src/main/model/OperationMapper.ts






















function toOperation(operationData) {
    if (operationData.compoundOperation) {
        return toCompoundOperation(operationData.compoundOperation);
    }
    else if (operationData.discreteOperation) {
        return toDiscreteOperation(operationData.discreteOperation);
    }
    else {
        throw new ConvergenceError("Invalid operation data: " + JSON.stringify(operationData));
    }
}
function toCompoundOperation(compoundOperationData) {
    const discreteOps = getOrDefaultArray(compoundOperationData.operations).map(toDiscreteOperation);
    return new CompoundOperation_CompoundOperation(discreteOps);
}
function toDiscreteOperation(discreteOperationData) {
    if (discreteOperationData.arrayInsertOperation) {
        const { id, noOp, index, value } = discreteOperationData.arrayInsertOperation;
        return new ArrayInsertOperation_ArrayInsertOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), toDataValue(value));
    }
    else if (discreteOperationData.arrayRemoveOperation) {
        const { id, noOp, index } = discreteOperationData.arrayRemoveOperation;
        return new ArrayRemoveOperation_ArrayRemoveOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index));
    }
    else if (discreteOperationData.arrayMoveOperation) {
        const { id, noOp, fromIndex, toIndex } = discreteOperationData.arrayMoveOperation;
        return new ArrayMoveOperation_ArrayMoveOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(fromIndex), getOrDefaultNumber(toIndex));
    }
    else if (discreteOperationData.arrayReplaceOperation) {
        const { id, noOp, index, value } = discreteOperationData.arrayReplaceOperation;
        return new ArrayReplaceOperation_ArrayReplaceOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), toDataValue(value));
    }
    else if (discreteOperationData.arraySetOperation) {
        const { id, noOp, values } = discreteOperationData.arraySetOperation;
        return new ArraySetOperation_ArraySetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultArray(values).map(toDataValue));
    }
    else if (discreteOperationData.objectAddPropertyOperation) {
        const { id, noOp, key, value } = discreteOperationData.objectAddPropertyOperation;
        return new ObjectAddPropertyOperation_ObjectAddPropertyOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(key), toDataValue(value));
    }
    else if (discreteOperationData.objectSetPropertyOperation) {
        const { id, noOp, key, value } = discreteOperationData.objectSetPropertyOperation;
        return new ObjectSetPropertyOperation_ObjectSetPropertyOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(key), toDataValue(value));
    }
    else if (discreteOperationData.objectRemovePropertyOperation) {
        const { id, noOp, key } = discreteOperationData.objectRemovePropertyOperation;
        return new ObjectRemovePropertyOperation_ObjectRemovePropertyOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(key));
    }
    else if (discreteOperationData.objectSetOperation) {
        const { id, noOp, values } = discreteOperationData.objectSetOperation;
        return new ObjectSetOperation_ObjectSetOperation(id, getOrDefaultBoolean(noOp), mapObjectValues(values, toDataValue));
    }
    else if (discreteOperationData.stringInsertOperation) {
        const { id, noOp, index, value } = discreteOperationData.stringInsertOperation;
        return new StringInsertOperation_StringInsertOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), getOrDefaultString(value));
    }
    else if (discreteOperationData.stringRemoveOperation) {
        const { id, noOp, index, value } = discreteOperationData.stringRemoveOperation;
        return new StringRemoveOperation_StringRemoveOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), getOrDefaultString(value));
    }
    else if (discreteOperationData.stringSetOperation) {
        const { id, noOp, value } = discreteOperationData.stringSetOperation;
        return new StringSetOperation_StringSetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(value));
    }
    else if (discreteOperationData.numberDeltaOperation) {
        const { id, noOp, delta } = discreteOperationData.numberDeltaOperation;
        return new NumberDeltaOperation_NumberDeltaOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(delta));
    }
    else if (discreteOperationData.numberSetOperation) {
        const { id, noOp, value } = discreteOperationData.numberSetOperation;
        return new NumberSetOperation_NumberSetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(value));
    }
    else if (discreteOperationData.booleanSetOperation) {
        const { id, noOp, value } = discreteOperationData.booleanSetOperation;
        return new BooleanSetOperation_BooleanSetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultBoolean(value));
    }
    else if (discreteOperationData.dateSetOperation) {
        const { id, noOp, value } = discreteOperationData.dateSetOperation;
        return new DateSetOperation_DateSetOperation(id, getOrDefaultBoolean(noOp), timestampToDate(value));
    }
}
function toIOperationData(operation) {
    if (operation instanceof CompoundOperation_CompoundOperation) {
        return { compoundOperation: toICompoundOperationData(operation) };
    }
    else if (operation instanceof DiscreteOperation_DiscreteOperation) {
        return { discreteOperation: toIDiscreteOperationData(operation) };
    }
    else {
        throw new ConvergenceError("Invalid operation data: " + JSON.stringify(operation));
    }
}
function toICompoundOperationData(compoundOperation) {
    const operations = compoundOperation.ops.map(toIDiscreteOperationData);
    return { operations };
}
function toIDiscreteOperationData(op) {
    if (op instanceof ArrayInsertOperation_ArrayInsertOperation) {
        const { id, noOp, index, value } = op;
        return { arrayInsertOperation: { id, noOp, index, value: toIDataValue(value) } };
    }
    else if (op instanceof ArrayRemoveOperation_ArrayRemoveOperation) {
        const { id, noOp, index } = op;
        return { arrayRemoveOperation: { id, noOp, index } };
    }
    else if (op instanceof ArrayMoveOperation_ArrayMoveOperation) {
        const { id, noOp, fromIndex, toIndex } = op;
        return { arrayMoveOperation: { id, noOp, fromIndex, toIndex } };
    }
    else if (op instanceof ArrayReplaceOperation_ArrayReplaceOperation) {
        const { id, noOp, index, value } = op;
        return { arrayReplaceOperation: { id, noOp, index, value: toIDataValue(value) } };
    }
    else if (op instanceof ArraySetOperation_ArraySetOperation) {
        const { id, noOp, value } = op;
        return { arraySetOperation: { id, noOp, values: value.map(toIDataValue) } };
    }
    else if (op instanceof ObjectAddPropertyOperation_ObjectAddPropertyOperation) {
        const { id, noOp, prop, value } = op;
        return { objectAddPropertyOperation: { id, noOp, key: prop, value: toIDataValue(value) } };
    }
    else if (op instanceof ObjectSetPropertyOperation_ObjectSetPropertyOperation) {
        const { id, noOp, prop, value } = op;
        return { objectSetPropertyOperation: { id, noOp, key: prop, value: toIDataValue(value) } };
    }
    else if (op instanceof ObjectRemovePropertyOperation_ObjectRemovePropertyOperation) {
        const { id, noOp, prop } = op;
        return { objectRemovePropertyOperation: { id, noOp, key: prop } };
    }
    else if (op instanceof ObjectSetOperation_ObjectSetOperation) {
        const { id, noOp, value } = op;
        return { objectSetOperation: { id, noOp, values: mapObjectValues(value, toIDataValue) } };
    }
    else if (op instanceof StringInsertOperation_StringInsertOperation) {
        const { id, noOp, index, value } = op;
        return { stringInsertOperation: { id, noOp, index, value } };
    }
    else if (op instanceof StringRemoveOperation_StringRemoveOperation) {
        const { id, noOp, index, value } = op;
        return { stringRemoveOperation: { id, noOp, index, value } };
    }
    else if (op instanceof StringSetOperation_StringSetOperation) {
        const { id, noOp, value } = op;
        return { stringSetOperation: { id, noOp, value } };
    }
    else if (op instanceof NumberDeltaOperation_NumberDeltaOperation) {
        const { id, noOp, delta } = op;
        return { numberDeltaOperation: { id, noOp, delta } };
    }
    else if (op instanceof NumberSetOperation_NumberSetOperation) {
        const { id, noOp, value } = op;
        return { numberSetOperation: { id, noOp, value } };
    }
    else if (op instanceof BooleanSetOperation_BooleanSetOperation) {
        const { id, noOp, value } = op;
        return { booleanSetOperation: { id, noOp, value } };
    }
    else if (op instanceof DateSetOperation_DateSetOperation) {
        const { id, noOp, value } = op;
        return { dateSetOperation: { id, noOp, value: dateToTimestamp(value) } };
    }
}

// CONCATENATED MODULE: ./src/main/model/reference/ReferenceMessageUtils.ts



function toRemoteReferenceEvent(message) {
    if (message.referenceShared) {
        const { sessionId, key, references, valueId, resourceId } = message.referenceShared;
        const { referenceType, values } = extractValueAndType(references);
        return new RemoteReferenceShared(sessionId, resourceId, fromOptional(valueId), key, referenceType, values);
    }
    else if (message.referenceSet) {
        const { sessionId, key, references, valueId, resourceId } = message.referenceSet;
        const { values } = extractValueAndType(references);
        return new RemoteReferenceSet(sessionId, resourceId, fromOptional(valueId), key, values);
    }
    else if (message.referenceCleared) {
        const { sessionId, key, valueId, resourceId } = message.referenceCleared;
        return new RemoteReferenceCleared(sessionId, resourceId, fromOptional(valueId), key);
    }
    else if (message.referenceUnshared) {
        const { sessionId, key, valueId, resourceId } = message.referenceUnshared;
        return new RemoteReferenceUnshared(sessionId, resourceId, fromOptional(valueId), key);
    }
}
function extractValueAndType(values) {
    if (values.indices) {
        const vals = getOrDefaultArray(values.indices.values);
        return { referenceType: "index", values: vals.map(getOrDefaultNumber) };
    }
    else if (values.ranges) {
        const ranges = getOrDefaultArray(values.ranges.values);
        const val = ranges.map(({ startIndex, endIndex }) => {
            return { start: getOrDefaultNumber(startIndex), end: getOrDefaultNumber(endIndex) };
        });
        return { referenceType: "range", values: val };
    }
    else if (values.properties) {
        const vals = getOrDefaultArray(values.properties.values);
        return { referenceType: "property", values: vals.map(getOrDefaultString) };
    }
    else if (values.elements) {
        const vals = getOrDefaultArray(values.elements.values);
        return { referenceType: "element", values: vals.map(getOrDefaultString) };
    }
}
function toIReferenceValues(type, values) {
    switch (type) {
        case ModelReference_ModelReference.Types.INDEX:
            return { indices: { values } };
        case ModelReference_ModelReference.Types.PROPERTY:
            return { properties: { values } };
        case ModelReference_ModelReference.Types.RANGE:
            const ranges = values.map((r) => {
                return { startIndex: r.start, endIndex: r.end };
            });
            return { ranges: { values: ranges } };
        case ModelReference_ModelReference.Types.ELEMENT:
            const elementIds = [];
            for (const element of values) {
                elementIds.push(element.id());
            }
            return { elements: { values: elementIds } };
        default:
            throw new Error("Invalid reference type");
    }
}

// CONCATENATED MODULE: ./src/main/storage/OfflineOperationMapper.ts

















function toOfflineOperationData(op) {
    if (op instanceof CompoundOperation_CompoundOperation) {
        const opData = op.ops.map(o => toOfflineOperationData(o));
        return { type: "compound", ops: opData };
    }
    else if (op instanceof ArrayInsertOperation_ArrayInsertOperation) {
        return {
            type: "array_insert",
            id: op.id,
            noOp: op.noOp,
            index: op.index,
            value: op.value
        };
    }
    else if (op instanceof ArrayReplaceOperation_ArrayReplaceOperation) {
        return {
            type: "array_replace",
            id: op.id,
            noOp: op.noOp,
            index: op.index,
            value: op.value
        };
    }
    else if (op instanceof ArrayRemoveOperation_ArrayRemoveOperation) {
        return {
            type: "array_remove",
            id: op.id,
            noOp: op.noOp,
            index: op.index
        };
    }
    else if (op instanceof ArrayMoveOperation_ArrayMoveOperation) {
        return {
            type: "array_move",
            id: op.id,
            noOp: op.noOp,
            fromIndex: op.fromIndex,
            toIndex: op.toIndex
        };
    }
    else if (op instanceof ArraySetOperation_ArraySetOperation) {
        return {
            type: "array_set",
            id: op.id,
            noOp: op.noOp,
            value: op.value
        };
    }
    else if (op instanceof ObjectAddPropertyOperation_ObjectAddPropertyOperation) {
        return {
            type: "object_add_property",
            id: op.id,
            noOp: op.noOp,
            key: op.prop,
            value: op.value
        };
    }
    else if (op instanceof ObjectSetPropertyOperation_ObjectSetPropertyOperation) {
        return {
            type: "object_set_property",
            id: op.id,
            noOp: op.noOp,
            key: op.prop,
            value: op.value
        };
    }
    else if (op instanceof ObjectRemovePropertyOperation_ObjectRemovePropertyOperation) {
        return {
            type: "object_remove_property",
            id: op.id,
            noOp: op.noOp,
            key: op.prop
        };
    }
    else if (op instanceof ObjectSetOperation_ObjectSetOperation) {
        return {
            type: "object_set",
            id: op.id,
            noOp: op.noOp,
            value: op.value
        };
    }
    else if (op instanceof StringInsertOperation_StringInsertOperation) {
        return {
            type: "string_insert",
            id: op.id,
            noOp: op.noOp,
            index: op.index,
            value: op.value
        };
    }
    else if (op instanceof StringRemoveOperation_StringRemoveOperation) {
        return {
            type: "string_remove",
            id: op.id,
            noOp: op.noOp,
            index: op.index,
            value: op.value
        };
    }
    else if (op instanceof StringSetOperation_StringSetOperation) {
        return {
            type: "string_set",
            id: op.id,
            noOp: op.noOp,
            value: op.value
        };
    }
    else if (op instanceof NumberDeltaOperation_NumberDeltaOperation) {
        return {
            type: "number_delta",
            id: op.id,
            noOp: op.noOp,
            value: op.delta
        };
    }
    else if (op instanceof NumberSetOperation_NumberSetOperation) {
        return {
            type: "number_set",
            id: op.id,
            noOp: op.noOp,
            value: op.value
        };
    }
    else if (op instanceof BooleanSetOperation_BooleanSetOperation) {
        return {
            type: "boolean_set",
            id: op.id,
            noOp: op.noOp,
            value: op.value
        };
    }
    else if (op instanceof DateSetOperation_DateSetOperation) {
        return {
            type: "date_set",
            id: op.id,
            noOp: op.noOp,
            value: op.value
        };
    }
}
function fromOfflineOperationData(op) {
    switch (op.type) {
        case "array_insert":
            const ai = op;
            return new ArrayInsertOperation_ArrayInsertOperation(ai.id, ai.noOp, ai.index, ai.value);
        case "array_remove":
            const ar = op;
            return new ArrayRemoveOperation_ArrayRemoveOperation(ar.id, ar.noOp, ar.index);
        case "array_replace":
            const ap = op;
            return new ArrayReplaceOperation_ArrayReplaceOperation(ap.id, ap.noOp, ap.index, ap.value);
        case "array_move":
            const am = op;
            return new ArrayMoveOperation_ArrayMoveOperation(am.id, am.noOp, am.fromIndex, am.toIndex);
        case "array_set":
            const as = op;
            return new ArraySetOperation_ArraySetOperation(as.id, as.noOp, as.value);
        case "object_add_property":
            const oap = op;
            return new ObjectAddPropertyOperation_ObjectAddPropertyOperation(oap.id, oap.noOp, oap.key, oap.value);
        case "object_set_property":
            const osp = op;
            return new ObjectSetPropertyOperation_ObjectSetPropertyOperation(osp.id, osp.noOp, osp.key, osp.value);
        case "object_remove_property":
            const orp = op;
            return new ObjectRemovePropertyOperation_ObjectRemovePropertyOperation(orp.id, orp.noOp, orp.key);
        case "object_set":
            const os = op;
            return new ObjectSetOperation_ObjectSetOperation(os.id, os.noOp, os.value);
        case "string_insert":
            const si = op;
            return new StringInsertOperation_StringInsertOperation(si.id, si.noOp, si.index, si.value);
        case "string_remove":
            const sr = op;
            return new StringRemoveOperation_StringRemoveOperation(sr.id, sr.noOp, sr.index, sr.value);
        case "string_set":
            const ss = op;
            return new StringSetOperation_StringSetOperation(ss.id, ss.noOp, ss.value);
        case "number_delta":
            const nd = op;
            return new NumberDeltaOperation_NumberDeltaOperation(nd.id, nd.noOp, nd.value);
        case "number_set":
            const ns = op;
            return new NumberSetOperation_NumberSetOperation(ns.id, ns.noOp, ns.value);
        case "boolean_set":
            const bs = op;
            return new BooleanSetOperation_BooleanSetOperation(bs.id, bs.noOp, bs.value);
        case "date_set":
            const ds = op;
            return new DateSetOperation_DateSetOperation(ds.id, ds.noOp, ds.value);
        case "compound":
            const co = op;
            const ops = co.ops.map(o => fromOfflineOperationData(o));
            return new CompoundOperation_CompoundOperation(ops);
    }
}

// CONCATENATED MODULE: ./src/main/util/ReplayDeferred.ts


class ReplayDeferred_ReplayDeferred extends AbstractDeferred {
    constructor() {
        super();
        this._deferreds = [];
        this._value = undefined;
        this._error = undefined;
    }
    static resolved(value) {
        const d = new ReplayDeferred_ReplayDeferred();
        d.resolve(value);
        return d;
    }
    resolve(value) {
        super.resolve(value);
        this._value = value;
        this._deferreds.forEach(d => d.resolve(value));
    }
    reject(error) {
        super.reject(error);
        this._error = error;
        this._deferreds.forEach(d => d.reject(error));
    }
    promise() {
        if (this.isPending()) {
            const d = new Deferred_Deferred();
            this._deferreds.push(d);
            return d.promise();
        }
        else if (this.isRejected()) {
            return Promise.reject(this._error);
        }
        else {
            return Promise.resolve(this._value);
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/rt/RealTimeModel.ts
























const RealTimeModelEventConstants = Object.assign(Object.assign({}, ObservableModelEventConstants), { MODIFIED: ModelModifiedEvent.NAME, COMMITTED: ModelCommittedEvent.NAME, RESYNC_STARTED: ResyncStartedEvent.NAME, RESYNC_COMPLETED: ResyncCompletedEvent.NAME, RESYNC_ERROR: ResyncErrorEvent.NAME, REMOTE_RESYNC_STARTED: RemoteResyncStartedEvent.NAME, REMOTE_RESYNC_COMPLETED: RemoteResyncCompletedEvent.NAME, OFFLINE: ModelOfflineEvent.NAME, ONLINE: ModelOnlineEvent.NAME, RECONNECTING: ModelReconnectingEvent.NAME, COLLABORATOR_OPENED: CollaboratorOpenedEvent.NAME, COLLABORATOR_CLOSED: CollaboratorClosedEvent.NAME, REFERENCE: RemoteReferenceCreatedEvent.NAME, PERMISSIONS_CHANGED: ModelPermissionsChangedEvent.NAME });
class RealTimeModel_RealTimeModel extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(resourceId, valueIdPrefix, data, local, resyncOnly, sessions, resyncingSessions, references, permissions, createdTime, modifiedTime, modelId, collectionId, concurrencyControl, connection, identityCache, modelService, modelOfflineManager) {
        super();
        this._log = Logging.logger("models");
        this._emitLocal = false;
        this._resourceId = resourceId;
        this._local = local;
        this._createdTime = createdTime;
        this._time = modifiedTime;
        this._modelId = modelId;
        this._collectionId = collectionId;
        this._concurrencyControl = concurrencyControl;
        this._connection = connection;
        this._modelService = modelService;
        this._permissions = permissions;
        this._identityCache = identityCache;
        this._offlineManager = modelOfflineManager;
        this._resyncOnly = resyncOnly;
        this._offline = false;
        this._resyncData = null;
        this._closingData = {
            deferred: new ReplayDeferred_ReplayDeferred(),
            closing: false
        };
        this._model = new Model_Model(this.session(), valueIdPrefix, data);
        this._referencesBySession = new Map();
        this._sessions = [...sessions];
        this._resyncingSessions = [...resyncingSessions];
        this._collaboratorsSubject = new external_rxjs_["BehaviorSubject"](this.collaborators());
        const onRemoteReference = (ref) => this._onRemoteReferenceShared(ref);
        this._referenceManager = new ReferenceManager_ReferenceManager(this, [ModelReference_ModelReference.Types.ELEMENT], onRemoteReference, this._identityCache);
        this._concurrencyControl
            .on(ClientConcurrencyControl_ClientConcurrencyControl.Events.COMMIT_STATE_CHANGED, (event) => {
            this._committed = event.committed;
            const evt = this._committed ?
                new ModelCommittedEvent(this) : new ModelModifiedEvent(this);
            this._emitEvent(evt);
        });
        const referenceCallbacks = {
            onShare: this._onShareReference.bind(this),
            onUnShare: this._onUnshareReference.bind(this),
            onSet: this._onSetReference.bind(this),
            onClear: this._onClearReference.bind(this)
        };
        this._callbacks = {
            sendOperationCallback: (operation) => {
                const opEvent = this._concurrencyControl.processOutgoingOperation(operation);
                if (!this._concurrencyControl.isBatchOperationInProgress()) {
                    this._handleLocalOperation(opEvent);
                }
            },
            referenceEventCallbacks: referenceCallbacks
        };
        this._wrapperFactory = new RealTimeWrapperFactory_RealTimeWrapperFactory(this._callbacks, this, this._identityCache);
        this._open = true;
        this._committed = true;
        this._initializeReferences(references);
        this._storeOffline = this._offlineManager.isOfflineEnabled();
    }
    permissions() {
        return this._permissions;
    }
    permissionsManager() {
        return new ModelPermissionManager_ModelPermissionManager(this._modelId, this._connection);
    }
    session() {
        return this._connection.session();
    }
    emitLocalEvents(emit) {
        if (arguments.length === 0) {
            return this._emitLocal;
        }
        else {
            this._emitLocal = emit;
            return;
        }
    }
    collaborators() {
        return this._sessions.map((sessionId) => {
            const user = this._identityCache.getUserForSession(sessionId);
            return new ModelCollaborator(user, sessionId);
        });
    }
    resynchronizingCollaborators() {
        return this._resyncingSessions.map((sessionId) => {
            const user = this._identityCache.getUserForSession(sessionId);
            return new ModelCollaborator(user, sessionId);
        });
    }
    collaboratorsAsObservable() {
        return this._collaboratorsSubject.asObservable();
    }
    collectionId() {
        return this._collectionId;
    }
    modelId() {
        return this._modelId;
    }
    time() {
        return this._time;
    }
    minTime() {
        return this._createdTime;
    }
    maxTime() {
        return this.time();
    }
    createdTime() {
        return this._createdTime;
    }
    version() {
        return this._concurrencyControl.contextVersion();
    }
    minVersion() {
        return 0;
    }
    maxVersion() {
        return this.version();
    }
    isCommitted() {
        return this._concurrencyControl.isCommitted();
    }
    root() {
        return this._wrapperFactory.wrap(this._model.root());
    }
    elementAt(...path) {
        return this._wrapperFactory.wrap(this._model.valueAt(...path));
    }
    isOpen() {
        return this._open;
    }
    isLocal() {
        return this._local;
    }
    close() {
        if (this._closingData.closing) {
            return Promise.reject(new ConvergenceError(`The model '${this._modelId}' is already closing`));
        }
        if (!this._open) {
            return Promise.reject(new ConvergenceError(`The model '${this._modelId}' has already been closed`));
        }
        if (this._resyncData !== null) {
            this._resyncOnly = true;
            return Promise.resolve();
        }
        else {
            const event = new ModelClosedEvent(this, true);
            this._initiateClose(true, event);
            return this._closingData.deferred.promise();
        }
    }
    isClosing() {
        return this._closingData.closing;
    }
    whenClosed() {
        return this._closingData.deferred.promise();
    }
    startBatch() {
        this._concurrencyControl.startBatchOperation();
    }
    endBatch() {
        this.completeBatch();
    }
    completeBatch() {
        const opEvent = this._concurrencyControl.completeBatchOperation();
        this._handleLocalOperation(opEvent);
    }
    batchSize() {
        return this._concurrencyControl.batchSize();
    }
    cancelBatch() {
        return this._concurrencyControl.cancelBatchOperation();
    }
    isBatchStarted() {
        return this._concurrencyControl.isBatchOperationInProgress();
    }
    elementReference(key) {
        const existing = this._referenceManager.getLocalReference(key);
        if (existing !== undefined) {
            if (existing.reference().type() !== ModelReference_ModelReference.Types.ELEMENT) {
                throw new Error("A reference with this key already exists, but is not an observable reference");
            }
            else {
                return existing;
            }
        }
        else {
            const session = this.session();
            const reference = new ElementReference_ElementReference(this._referenceManager, key, this, session.user(), session.sessionId(), true);
            const local = new LocalElementReference_LocalElementReference(reference, this._callbacks.referenceEventCallbacks);
            this._referenceManager.addLocalReference(local);
            return local;
        }
    }
    reference(sessionId, key) {
        return this._referenceManager.get(sessionId, key);
    }
    references(filter) {
        return this._referenceManager.getAll(filter);
    }
    subscribeOffline() {
        return this._offlineManager.subscribe([this._modelId]);
    }
    unsubscribeOffline() {
        return this._offlineManager.unsubscribe([this._modelId]);
    }
    isSubscribedOffline() {
        return this._offlineManager.isModelStoredOffline(this._modelId);
    }
    _initiateClose(closeWithServer, event) {
        if (this._closingData.closing) {
            throw new ConvergenceError(`The model '${this._modelId}' is already closing.`);
        }
        this._closingData.closing = true;
        this._closingData.event = event;
        if (this._connection.isOnline() && closeWithServer) {
            const request = {
                closeRealTimeModelRequest: {
                    resourceId: this._resourceId
                }
            };
            this._connection
                .request(request)
                .then(() => {
                this._checkIfCanClose();
            })
                .catch(err => {
                this._log.error(`Unexpected error closing a model: ${this._modelId}`, err);
                this._closingData.deferred.reject(err);
            });
        }
        else {
            this._checkIfCanClose();
        }
    }
    _valueIdPrefix() {
        return this._model.valueIdPrefix();
    }
    _checkIfCanClose() {
        if (this._closingData.closing &&
            (this._concurrencyControl.isCommitted() || !this._connection.isOnline())) {
            this._close();
        }
    }
    _openAfterResync() {
        this._resyncOnly = false;
    }
    _isResyncOnly() {
        return this._resyncOnly;
    }
    _getConcurrencyControlStateSnapshot() {
        return {
            data: this._model.root().dataValue(),
            lastSequenceNumber: this._concurrencyControl.lastSequenceNumber(),
            uncommittedOperations: [...this._concurrencyControl.getInFlightOperations()]
        };
    }
    _rehydrateFromOfflineState(targetVersion, serverOps, localOps) {
        const serverEvents = serverOps.map(serverOp => {
            const op = fromOfflineOperationData(serverOp.operation);
            return new ServerOperationEvent_ServerOperationEvent(serverOp.sessionId, serverOp.version, serverOp.timestamp, op);
        }).sort((a, b) => a.version - b.version);
        const clientEvents = localOps.map(localOp => {
            const op = fromOfflineOperationData(localOp.operation);
            return new ClientOperationEvent_ClientOperationEvent(localOp.sessionId, localOp.sequenceNumber, localOp.contextVersion, localOp.timestamp, op);
        }).sort((a, b) => {
            if (a.contextVersion === b.contextVersion) {
                return a.seqNo - b.seqNo;
            }
            else {
                return a.contextVersion - b.contextVersion;
            }
        });
        let contextVersion = this._concurrencyControl.contextVersion();
        let lastSequenceNumber = this._concurrencyControl.lastSequenceNumber();
        let inFlight = [];
        while (clientEvents.length > 0 && clientEvents[0].seqNo <= lastSequenceNumber) {
            clientEvents.shift();
        }
        const canApplyServerEvent = () => {
            return serverEvents.length > 0 &&
                (clientEvents.length === 0 || serverEvents[0].version <= clientEvents[0].contextVersion);
        };
        const canApplyClientEvent = () => {
            return clientEvents.length > 0 && clientEvents[0].contextVersion === contextVersion;
        };
        while (canApplyServerEvent() || canApplyClientEvent()) {
            while (canApplyServerEvent()) {
                const serverEvent = serverEvents.shift();
                this._applyOperation(serverEvent.operation, serverEvent.clientId, serverEvent.version, serverEvent.timestamp);
                contextVersion++;
            }
            while (canApplyClientEvent()) {
                const clientEvent = clientEvents.shift();
                this._applyOperation(clientEvent.operation, this._connection.session().sessionId(), clientEvent.contextVersion, clientEvent.timestamp);
                lastSequenceNumber = clientEvent.seqNo;
                inFlight.push(clientEvent);
            }
        }
        if (serverEvents.length > 0 || clientEvents.length > 0) {
            throw new Error(`Unable to apply all events while rehydrating model "${this._modelId}" from offline state.`);
        }
        if (contextVersion !== targetVersion) {
            throw new Error(`Did not arrive at the proper version (${targetVersion}) when rehydrating model: ${contextVersion}`);
        }
        this._concurrencyControl.setState(contextVersion, lastSequenceNumber, inFlight);
    }
    _getRegisteredValue(id) {
        return this._wrapperFactory.wrap(this._model._getRegisteredValue(id));
    }
    _handleMessage(event) {
        const { forceCloseRealTimeModel, remoteOperation, referenceShared, referenceSet, referenceCleared, referenceUnshared, operationAck, remoteClientOpenedModel, remoteClientClosedModel, modelPermissionsChanged, remoteClientResyncStarted, remoteClientResyncCompleted, } = event.message;
        if (forceCloseRealTimeModel) {
            this._handleForceClose(forceCloseRealTimeModel);
        }
        else if (remoteOperation) {
            this._handleRemoteOperation(remoteOperation);
            this._emitVersionChanged();
        }
        else if (operationAck) {
            this._handelOperationAck(operationAck);
            this._emitVersionChanged();
        }
        else if (referenceShared || referenceSet || referenceCleared || referenceUnshared) {
            const remoteRefEvent = toRemoteReferenceEvent(event.message);
            this._handleRemoteReferenceEvent(remoteRefEvent);
        }
        else if (remoteClientOpenedModel) {
            this._handleClientOpen(getOrDefaultString(remoteClientOpenedModel.sessionId));
        }
        else if (remoteClientClosedModel) {
            this._handleClientClosed(getOrDefaultString(remoteClientClosedModel.sessionId));
        }
        else if (modelPermissionsChanged) {
            this._handleModelPermissionsChanged(modelPermissionsChanged);
        }
        else if (remoteClientResyncStarted) {
            this._handleRemoteClientResyncStarted(remoteClientResyncStarted);
        }
        else if (remoteClientResyncCompleted) {
            this._handleRemoteClientResyncCompleted(remoteClientResyncCompleted);
        }
        else {
            throw new Error("Unexpected message" + JSON.stringify(event.message));
        }
    }
    _isOffline() {
        return this._offline;
    }
    _setOffline() {
        this._debug("Offline");
        this._offline = true;
        this._emitEvent(new ModelOfflineEvent(this));
        this._sessions.forEach(sessionId => this._handleClientClosed(sessionId));
        this._sessions = [];
        this._resyncData = null;
        if (this._closingData.closing) {
            this._close();
        }
    }
    _setOnline() {
        this._offline = false;
        this._resyncData = {
            bufferedOperations: [],
            upToDate: false
        };
        if (this._local) {
            this._offlineManager.getModelMetaData(this._modelId).then(metaData => {
                if (metaData.deleted) {
                    return this._modelService.remove(this._modelId)
                        .catch((e) => {
                        console.log(e);
                    }).then(() => {
                        return this._offlineManager.modelDeleted(this._modelId);
                    });
                }
                else {
                    return Promise.resolve();
                }
            }).then(() => {
                return this._offlineManager.getModelCreationData(this._modelId);
            }).then(creation => {
                this._debug("Creating offline model at the server");
                const options = {
                    id: creation.modelId,
                    collection: creation.collection,
                    overrideCollectionWorldPermissions: creation.overrideCollectionWorldPermissions,
                    worldPermissions: creation.worldPermissions,
                    userPermissions: creation.userPermissions
                };
                return this._modelService._create(options, creation.initialData);
            }).then(() => {
                this._local = false;
                return this._offlineManager.modelCreated(this._modelId);
            }).then(() => {
                this._resynchronize();
            }).catch((e) => {
                this._resyncError(e.message);
                this._log.error("Error synchronizing offline model on reconnect.", e);
            });
        }
        else {
            this._resynchronize();
        }
    }
    _handleLocallyDeleted() {
        this._storeOffline = false;
        const event = new ModelClosedEvent(this, true, "The model was locally deleted");
        this._initiateClose(true, event);
        const message = `The model '${this._modelId}' was locally deleted while offline.`;
        const deletedEvent = new ModelDeletedEvent(this, true, message);
        this._emitEvent(deletedEvent);
    }
    _resynchronize() {
        this._debug("Requesting model resynchronization");
        this._emitEvent(new ModelReconnectingEvent(this));
        const request = {
            modelResyncRequest: {
                modelId: this._modelId,
                contextVersion: this._concurrencyControl.contextVersion()
            }
        };
        this._connection.request(request).then((response) => {
            this._debug("Starting model resynchronization");
            this._emitEvent(new ResyncStartedEvent(this));
            const { modelResyncResponse } = response;
            this._permissions = toModelPermissions(modelResyncResponse.permissions);
            this._resyncData.reconnectVersion = getOrDefaultNumber(modelResyncResponse.currentVersion);
            const oldResourceId = this._resourceId;
            this._resourceId = getOrDefaultString(modelResyncResponse.resourceId);
            this._modelService._resourceIdChanged(this._modelId, oldResourceId, this._resourceId);
            this._checkForReconnectUpToDate();
        }).catch((e) => this._resyncError(e.message));
    }
    _resyncError(message) {
        this._emitEvent(new ResyncErrorEvent(this, message));
        this._modelService._resyncError(this._modelId, message, this);
    }
    _handleModelPermissionsChanged(message) {
        const oldPermissions = this._permissions;
        this._permissions = toModelPermissions(message.permissions);
        const changes = [];
        if (this._permissions.read !== oldPermissions.read) {
            changes.push("read");
        }
        if (this._permissions.write !== oldPermissions.write) {
            changes.push("write");
        }
        if (this._permissions.remove !== oldPermissions.remove) {
            changes.push("remove");
        }
        if (this._permissions.manage !== oldPermissions.manage) {
            changes.push("manage");
        }
        const event = new ModelPermissionsChangedEvent(this, this._permissions, changes);
        this._emitEvent(event);
    }
    _handleRemoteClientResyncStarted(message) {
        const sessionId = getOrDefaultString(message.sessionId);
        this._resyncingSessions.push(sessionId);
        const user = this._identityCache.getUserForSession(sessionId);
        const event = new RemoteResyncStartedEvent(this, sessionId, user);
        this._emitEvent(event);
    }
    _handleRemoteClientResyncCompleted(message) {
        const sessionId = getOrDefaultString(message.sessionId);
        this._resyncingSessions.push(sessionId);
        const index = this._resyncingSessions.indexOf(sessionId);
        if (index >= 0) {
            this._resyncingSessions.splice(index, 1);
        }
        const user = this._identityCache.getUserForSession(sessionId);
        const event = new RemoteResyncCompletedEvent(this, sessionId, user);
        this._emitEvent(event);
    }
    _handleClientOpen(sessionId) {
        this._sessions.push(sessionId);
        this._referencesBySession.set(sessionId, []);
        const user = this._identityCache.getUserForSession(sessionId);
        const event = new CollaboratorOpenedEvent(this, new ModelCollaborator(user, sessionId));
        this._emitEvent(event);
        this._collaboratorsSubject.next(this.collaborators());
    }
    _handleClientClosed(sessionId) {
        this._sessions = this._sessions.filter(s => s !== sessionId);
        const refs = this._referencesBySession.get(sessionId);
        this._referencesBySession.delete(sessionId);
        refs.forEach((ref) => {
            ref._dispose();
        });
        const user = this._identityCache.getUserForSession(sessionId);
        const event = new CollaboratorClosedEvent(this, new ModelCollaborator(user, sessionId));
        this._emitEvent(event);
        this._collaboratorsSubject.next(this.collaborators());
    }
    _handleRemoteReferenceEvent(event) {
        if (event.valueId === null) {
            this._modelReferenceEvent(event);
        }
        else {
            const value = this._getRegisteredValue(event.valueId);
            if (!value) {
                return;
            }
            if (event instanceof RemoteReferenceShared) {
                if (event.values) {
                    let data = {
                        type: event.referenceType,
                        valueId: event.valueId,
                        values: event.values
                    };
                    data = this._concurrencyControl.processRemoteReferenceSet(data);
                    event = new RemoteReferenceShared(event.sessionId, event.resourceId, event.valueId, event.key, event.referenceType, data.values);
                }
            }
            else if (event instanceof RemoteReferenceSet) {
                const reference = value.reference(event.sessionId, event.key);
                if (!reference) {
                    this._log.warn("received an update for a non-existent reference.");
                    return;
                }
                const type = reference.type();
                let data = {
                    type,
                    valueId: event.valueId,
                    values: event.values
                };
                data = this._concurrencyControl.processRemoteReferenceSet(data);
                event = new RemoteReferenceSet(event.sessionId, event.resourceId, event.valueId, event.key, data.values);
            }
            if (event instanceof RemoteReferenceUnshared) {
                const r = value.reference(event.sessionId, event.key);
                const index = this._referencesBySession.get(event.sessionId).indexOf(r);
                this._referencesBySession.get(event.sessionId).splice(index, 1);
            }
            value._handleRemoteReferenceEvent(event);
            if (event instanceof RemoteReferenceShared) {
                const r = value.reference(event.sessionId, event.key);
                this._referencesBySession.get(event.sessionId).push(r);
            }
        }
    }
    _handleForceClose(message) {
        if (this.isClosing()) {
            return;
        }
        const event = new ModelClosedEvent(this, false, message.reason);
        this._initiateClose(false, event);
        if (message.reasonCode === ModelForcedCloseReasonCodes.DELETED) {
            const deletedEvent = new ModelDeletedEvent(this, false, message.reason);
            this._emitEvent(deletedEvent);
        }
        else {
            this._log.error(`The model with id '${this._modelId}' was forcefully closed by the server: ${message.reason}`);
        }
    }
    _close() {
        const { deferred, event } = this._closingData;
        this._modelService._close(this._resourceId);
        if (this._offlineManager.isOfflineEnabled()) {
            this._offlineManager.modelClosed(this);
        }
        this._model.root()._detach(false);
        this._open = false;
        this._connection = null;
        this._closingData.closing = false;
        deferred.resolve();
        if (event) {
            this._emitEvent(event);
        }
    }
    _handelOperationAck(message) {
        const version = getOrDefaultNumber(message.version);
        const sequenceNumber = getOrDefaultNumber(message.sequenceNumber);
        const acknowledgedOperation = this._concurrencyControl.processAcknowledgement(version, sequenceNumber);
        this._time = timestampToDate(message.timestamp);
        if (this._storeOffline) {
            const operation = toOfflineOperationData(acknowledgedOperation.operation);
            const serverOp = {
                modelId: this._modelId,
                sessionId: this._connection.session().sessionId(),
                version,
                timestamp: this._time,
                operation
            };
            this._offlineManager
                .processOperationAck(this.modelId(), sequenceNumber, serverOp)
                .catch(e => {
                this._log.error(e);
            });
        }
        this._checkIfCanClose();
    }
    _handleRemoteOperation(message) {
        if (this._resyncData !== null) {
            if (getOrDefaultNumber(message.contextVersion) > this._resyncData.reconnectVersion) {
                this._resyncData.bufferedOperations.push(message);
            }
            else if (this._concurrencyControl.hasInflightOperation() &&
                this._concurrencyControl.firstInFlightOperation().sessionId === message.sessionId) {
                const syntheticAck = {
                    resourceId: message.resourceId,
                    version: message.contextVersion,
                    timestamp: message.timestamp
                };
                this._handelOperationAck(syntheticAck);
                this._checkForReconnectUpToDate();
            }
            else {
                this._processRemoteOperation(message);
                this._checkForReconnectUpToDate();
            }
        }
        else {
            this._processRemoteOperation(message);
        }
    }
    _processRemoteOperation(message) {
        const unprocessed = new ServerOperationEvent_ServerOperationEvent(getOrDefaultString(message.sessionId), getOrDefaultNumber(message.contextVersion), timestampToDate(message.timestamp), toOperation(message.operation));
        this._processServerOperationEvent(unprocessed);
    }
    _processServerOperationEvent(unprocessed) {
        this._concurrencyControl.processRemoteOperation(unprocessed);
        const processed = this._concurrencyControl.getNextIncomingOperation();
        const operation = processed.operation;
        const clientId = processed.clientId;
        const contextVersion = processed.version;
        const timestamp = processed.timestamp;
        this._time = new Date(timestamp);
        this._applyOperation(operation, clientId, contextVersion, timestamp);
        if (this._storeOffline) {
            const inflight = this._concurrencyControl.getInFlightOperations();
            this._offlineManager
                .processServerOperationEvent(this._modelId, processed, inflight)
                .catch(e => this._log.error(e));
        }
    }
    _applyOperation(operation, sessionId, version, timestamp) {
        const user = this._identityCache.getUserForSession(sessionId);
        if (operation.type === OperationType.COMPOUND) {
            const compoundOp = operation;
            compoundOp.ops.forEach((discreteOp) => {
                this._applyDiscreteOperation(discreteOp, user, sessionId, version, timestamp);
            });
        }
        else {
            const discreteOp = operation;
            this._applyDiscreteOperation(discreteOp, user, sessionId, version, timestamp);
        }
    }
    _applyDiscreteOperation(discreteOp, user, sessionId, version, timestamp) {
        if (!discreteOp.noOp) {
            const modelEvent = new ModelOperationEvent(sessionId, user, version, timestamp, discreteOp);
            this._deliverToChild(modelEvent);
        }
    }
    _checkForReconnectUpToDate() {
        if (this._resyncData &&
            !this._resyncData.upToDate &&
            this._resyncData.reconnectVersion === this._concurrencyControl.contextVersion()) {
            this._resyncData.bufferedOperations.forEach(m => {
                this._processRemoteOperation(m);
            });
            this._resyncData.upToDate = true;
            this._debug("All server operations applied during resynchronization");
            const resend = this._concurrencyControl.getInFlightOperations();
            resend.forEach(op => this._sendOperation(op));
            this._debug("All local operations resent during resynchronization");
            const openAfterSync = !this._resyncOnly;
            const completeRequest = {
                modelResyncCompleteRequest: {
                    resourceId: this._resourceId,
                    open: openAfterSync
                }
            };
            this._connection.request(completeRequest).then((response) => {
                const { modelResyncCompleteResponse } = response;
                this._debug("Resynchronization completed");
                this._emitEvent(new ResyncCompletedEvent(this));
                if (openAfterSync) {
                    const sessions = getOrDefaultArray(modelResyncCompleteResponse.connectedClients);
                    sessions.forEach(sessionId => this._handleClientOpen(sessionId));
                    this._initializeReferences(getOrDefaultArray(modelResyncCompleteResponse.references));
                    this._referenceManager.reshare();
                    this._debug(`Online`);
                    this._emitEvent(new ModelOnlineEvent(this));
                }
            });
            this._resyncData = null;
            if (!openAfterSync) {
                this._initiateClose(false);
            }
            else {
                this._modelService._resyncComplete(this._modelId);
            }
        }
    }
    _debug(message) {
        this._log.debug(`Model("${this._modelId}"): ${message}`);
    }
    _deliverToChild(modelEvent) {
        this._model.handleModelOperationEvent(modelEvent);
    }
    _handleLocalOperation(opEvent) {
        if (this._storeOffline) {
            this._offlineManager.processLocalOperation(this._modelId, opEvent)
                .catch(e => this._log.error(`Error storing local operation: ${this._modelId}`, e));
        }
        this._sendOperation(opEvent);
    }
    _sendOperation(opEvent) {
        if (this._sendEvents()) {
            const opSubmission = {
                operationSubmission: {
                    resourceId: this._resourceId,
                    sequenceNumber: opEvent.seqNo,
                    contextVersion: opEvent.contextVersion,
                    operation: toIOperationData(opEvent.operation)
                }
            };
            this._connection.send(opSubmission);
        }
    }
    _emitVersionChanged() {
        const event = new VersionChangedEvent(this, this._concurrencyControl.contextVersion());
        this._emitEvent(event);
    }
    _modelReferenceEvent(message) {
        this._referenceManager.handleRemoteReferenceEvent(message);
    }
    _onRemoteReferenceShared(reference) {
        this._referencesBySession.get(reference.sessionId()).push(reference);
        this._emitEvent(new RemoteReferenceCreatedEvent(reference, this));
    }
    _initializeReferences(references) {
        this._referencesBySession.clear();
        this._sessions.forEach(sessionId => {
            this._referencesBySession.set(sessionId, []);
        });
        references.forEach((ref) => {
            let element;
            const valueId = fromOptional(ref.valueId);
            if (valueId !== null) {
                element = this._wrapperFactory.wrap(this._model._getRegisteredValue(valueId));
            }
            const { referenceType, values } = extractValueAndType(ref.reference);
            const shared = new RemoteReferenceShared(ref.sessionId, this._resourceId, valueId, ref.key, referenceType, values);
            if (element !== undefined) {
                element._handleRemoteReferenceEvent(shared);
                const r = element.reference(ref.sessionId, ref.key);
                this._referencesBySession.get(ref.sessionId).push(r);
            }
            else {
                this._modelReferenceEvent(shared);
            }
        });
    }
    _onShareReference(reference) {
        if (this._sendEvents()) {
            const source = reference.reference().source();
            const vid = (source instanceof RealTimeElement_RealTimeElement) ? source.id() : null;
            let refData = {
                type: reference.reference().type(),
                valueId: vid,
                values: reference.reference().values()
            };
            if (vid !== undefined) {
                refData = this._concurrencyControl.processOutgoingSetReference(refData);
            }
            const event = {
                shareReference: {
                    resourceId: this._resourceId,
                    key: reference.reference().key(),
                    valueId: toOptional(vid),
                    references: toIReferenceValues(reference.reference().type(), refData.values),
                    version: this._concurrencyControl.contextVersion()
                }
            };
            this._connection.send(event);
        }
    }
    _onUnshareReference(reference) {
        if (this._sendEvents()) {
            const source = reference.reference().source();
            const vid = (source instanceof RealTimeElement_RealTimeElement) ? source.id() : null;
            const event = {
                unshareReference: {
                    resourceId: this._resourceId,
                    valueId: toOptional(vid),
                    key: reference.reference().key(),
                }
            };
            this._connection.send(event);
        }
    }
    _onSetReference(reference) {
        if (this._sendEvents()) {
            const source = reference.reference().source();
            const vid = (source instanceof RealTimeElement_RealTimeElement) ? source.id() : null;
            let refData = {
                type: reference.reference().type(),
                valueId: vid,
                values: reference.reference().values()
            };
            if (vid !== undefined) {
                refData = this._concurrencyControl.processOutgoingSetReference(refData);
            }
            if (refData) {
                const event = {
                    setReference: {
                        resourceId: this._resourceId,
                        key: reference.reference().key(),
                        valueId: toOptional(refData.valueId),
                        references: toIReferenceValues(reference.reference().type(), refData.values),
                        version: this._concurrencyControl.contextVersion()
                    }
                };
                this._connection.send(event);
            }
        }
    }
    _onClearReference(reference) {
        if (this._sendEvents()) {
            const source = reference.reference().source();
            const vid = (source instanceof RealTimeElement_RealTimeElement) ? source.id() : null;
            const event = {
                clearReference: {
                    resourceId: this._resourceId,
                    key: reference.reference().key(),
                    valueId: toOptional(vid)
                }
            };
            this._connection.send(event);
        }
    }
    _sendEvents() {
        return this._connection.isOnline() && !this._offline && (this._resyncData === null || this._resyncData.upToDate);
    }
}
RealTimeModel_RealTimeModel.Events = RealTimeModelEventConstants;
Object.freeze(RealTimeModel_RealTimeModel.Events);

// CONCATENATED MODULE: ./src/main/model/rt/index.ts












// CONCATENATED MODULE: ./src/main/model/historical/HistoricalElement.ts



class HistoricalElement_HistoricalElement extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(delegate, wrapperFactory, model) {
        super();
        this._delegate = delegate;
        this._wrapperFactory = wrapperFactory;
        this._model = model;
        this._delegate.events().subscribe((event) => {
            const convertedEvent = ModelEventConverter_ModelEventConverter.convertEvent(event, this._wrapperFactory);
            this._emitEvent(convertedEvent);
        });
    }
    id() {
        return this._delegate.id();
    }
    type() {
        return this._delegate.type();
    }
    path() {
        return this._delegate.path();
    }
    relativePath() {
        const parentPath = this._delegate.path().slice(0);
        if (parentPath.length > 0) {
            return parentPath.pop();
        }
        else {
            return null;
        }
    }
    parent() {
        const parentPath = this._delegate.path().slice(0);
        parentPath.pop();
        const parent = this._model.elementAt(parentPath);
        return parent;
    }
    isAttached() {
        return !this._delegate.isDetached();
    }
    isDetached() {
        return this._delegate.isDetached();
    }
    value() {
        return this._delegate.data();
    }
    toJSON() {
        return this._delegate.toJson();
    }
    model() {
        return this._model;
    }
}
HistoricalElement_HistoricalElement.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalArray.ts


class HistoricalArray_HistoricalArray extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
    get(index) {
        return this._wrapperFactory.wrap(this._delegate.get(index));
    }
    length() {
        return this._delegate.length();
    }
    forEach(callback) {
        this._delegate.forEach((modelNode, index) => {
            callback(this._wrapperFactory.wrap(modelNode), index);
        });
    }
    elementAt(...path) {
        return this._wrapperFactory.wrap(this._delegate.valueAt(...path));
    }
}
HistoricalArray_HistoricalArray.Events = ObservableArrayEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalBoolean.ts


class HistoricalBoolean_HistoricalBoolean extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
}
HistoricalBoolean_HistoricalBoolean.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalObject.ts


class HistoricalObject_HistoricalObject extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
    get(key) {
        return this._wrapperFactory.wrap(this._delegate.get(key));
    }
    keys() {
        return this._delegate.keys();
    }
    hasKey(key) {
        return this._delegate.hasKey(key);
    }
    forEach(callback) {
        this._delegate.forEach((modelNode, key) => {
            callback(this._wrapperFactory.wrap(modelNode), key);
        });
    }
    elementAt(...path) {
        return this._wrapperFactory.wrap(this._delegate.valueAt(...path));
    }
}
HistoricalObject_HistoricalObject.Events = ObservableObjectEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalNull.ts


class HistoricalNull_HistoricalNull extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
}
HistoricalNull_HistoricalNull.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalNumber.ts


class HistoricalNumber_HistoricalNumber extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
}
HistoricalNumber_HistoricalNumber.Events = ObservableNumberEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalString.ts


class HistoricalString_HistoricalString extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
    length() {
        return this._delegate.length();
    }
}
HistoricalString_HistoricalString.Events = ObservableStringEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalUndefined.ts


class HistoricalUndefined_HistoricalUndefined extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
}
HistoricalUndefined_HistoricalUndefined.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalDate.ts


class HistoricalDate_HistoricalDate extends HistoricalElement_HistoricalElement {
    constructor(delegate, wrapperFactory, model) {
        super(delegate, wrapperFactory, model);
    }
}
HistoricalDate_HistoricalDate.Events = ObservableElementEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalWrapperFactory.ts










class HistoricalWrapperFactory_HistoricalWrapperFactory extends NodeWrapperFactory_NodeWrapperFactory {
    constructor(_model) {
        super();
        this._model = _model;
    }
    _createWrapper(node) {
        switch (node.type()) {
            case ModelElementType.ARRAY:
                return new HistoricalArray_HistoricalArray(node, this, this._model);
            case ModelElementType.OBJECT:
                return new HistoricalObject_HistoricalObject(node, this, this._model);
            case ModelElementType.BOOLEAN:
                return new HistoricalBoolean_HistoricalBoolean(node, this, this._model);
            case ModelElementType.NULL:
                return new HistoricalNull_HistoricalNull(node, this, this._model);
            case ModelElementType.NUMBER:
                return new HistoricalNumber_HistoricalNumber(node, this, this._model);
            case ModelElementType.STRING:
                return new HistoricalString_HistoricalString(node, this, this._model);
            case ModelElementType.UNDEFINED:
                return new HistoricalUndefined_HistoricalUndefined(node, this, this._model);
            case ModelElementType.DATE:
                return new HistoricalDate_HistoricalDate(node, this, this._model);
            default:
                return null;
        }
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/ModelOperation.ts
class ModelOperation {
    constructor(modelId, version, timestamp, user, sessionId, operation) {
        this.modelId = modelId;
        this.version = version;
        this.timestamp = timestamp;
        this.user = user;
        this.sessionId = sessionId;
        this.operation = operation;
        Object.freeze(this);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedOperation.ts
class AppliedOperation {
    constructor(type) {
        this.type = type;
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedCompoundOperation.ts


class AppliedCompoundOperation_AppliedCompoundOperation extends AppliedOperation {
    constructor(ops) {
        super(OperationType.COMPOUND);
        this.ops = ops;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedCompoundOperation_AppliedCompoundOperation(this.ops.map((op) => {
            return op.inverse();
        }));
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedDiscreteOperation.ts

class AppliedDiscreteOperation_AppliedDiscreteOperation extends AppliedOperation {
    constructor(type, id, noOp) {
        super(type);
        this.id = id;
        this.noOp = noOp;
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedArrayRemoveOperation.ts



class AppliedArrayRemoveOperation_AppliedArrayRemoveOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, index, oldValue) {
        super(OperationType.ARRAY_REMOVE, id, noOp);
        this.index = index;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedArrayInsertOperation_AppliedArrayInsertOperation(this.id, this.noOp, this.index, this.oldValue);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedArrayInsertOperation.ts



class AppliedArrayInsertOperation_AppliedArrayInsertOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.ARRAY_INSERT, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedArrayRemoveOperation_AppliedArrayRemoveOperation(this.id, this.noOp, this.index, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedArrayMoveOperation.ts


class AppliedArrayMoveOperation_AppliedArrayMoveOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, fromIndex, toIndex) {
        super(OperationType.ARRAY_REORDER, id, noOp);
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedArrayMoveOperation_AppliedArrayMoveOperation(this.id, this.noOp, this.toIndex, this.fromIndex);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedArrayReplaceOperation.ts


class AppliedArrayReplaceOperation_AppliedArrayReplaceOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, index, value, oldValue) {
        super(OperationType.ARRAY_SET, id, noOp);
        this.index = index;
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedArrayReplaceOperation_AppliedArrayReplaceOperation(this.id, this.noOp, this.index, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedArraySetOperation.ts


class AppliedArraySetOperation_AppliedArraySetOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, value, oldValue) {
        super(OperationType.ARRAY_VALUE, id, noOp);
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedArraySetOperation_AppliedArraySetOperation(this.id, this.noOp, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedObjectRemovePropertyOperation.ts



class AppliedObjectRemovePropertyOperation_AppliedObjectRemovePropertyOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, prop, oldValue) {
        super(OperationType.OBJECT_REMOVE, id, noOp);
        this.prop = prop;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedObjectAddPropertyOperation_AppliedObjectAddPropertyOperation(this.id, this.noOp, this.prop, this.oldValue);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedObjectAddPropertyOperation.ts



class AppliedObjectAddPropertyOperation_AppliedObjectAddPropertyOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, prop, value) {
        super(OperationType.OBJECT_ADD, id, noOp);
        this.prop = prop;
        this.value = value;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedObjectRemovePropertyOperation_AppliedObjectRemovePropertyOperation(this.id, this.noOp, this.prop, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedObjectSetPropertyOperation.ts


class AppliedObjectSetPropertyOperation_AppliedObjectSetPropertyOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, prop, value, oldValue) {
        super(OperationType.OBJECT_SET, id, noOp);
        this.prop = prop;
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedObjectSetPropertyOperation_AppliedObjectSetPropertyOperation(this.id, this.noOp, this.prop, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedObjectSetOperation.ts


class AppliedObjectSetOperation_AppliedObjectSetOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, value, oldValue) {
        super(OperationType.OBJECT_VALUE, id, noOp);
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedObjectSetOperation_AppliedObjectSetOperation(this.id, this.noOp, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedStringRemoveOperation.ts



class AppliedStringRemoveOperation_AppliedStringRemoveOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.STRING_REMOVE, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedStringInsertOperation_AppliedStringInsertOperation(this.id, this.noOp, this.index, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedStringInsertOperation.ts



class AppliedStringInsertOperation_AppliedStringInsertOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, index, value) {
        super(OperationType.STRING_INSERT, id, noOp);
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedStringRemoveOperation_AppliedStringRemoveOperation(this.id, this.noOp, this.index, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedStringSetOperation.ts


class AppliedStringSetOperation_AppliedStringSetOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, value, oldValue) {
        super(OperationType.STRING_VALUE, id, noOp);
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedStringSetOperation_AppliedStringSetOperation(this.id, this.noOp, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedNumberDeltaOperation.ts


class AppliedNumberDeltaOperation_AppliedNumberDeltaOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, delta) {
        super(OperationType.NUMBER_DELTA, id, noOp);
        this.delta = delta;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedNumberDeltaOperation_AppliedNumberDeltaOperation(this.id, this.noOp, -this.delta);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedNumberSetOperation.ts


class AppliedNumberSetOperation_AppliedNumberSetOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, value, oldValue) {
        super(OperationType.NUMBER_VALUE, id, noOp);
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedNumberSetOperation_AppliedNumberSetOperation(this.id, this.noOp, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedBooleanSetOperation.ts


class AppliedBooleanSetOperation_AppliedBooleanSetOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, value, oldValue) {
        super(OperationType.BOOLEAN_VALUE, id, noOp);
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedBooleanSetOperation_AppliedBooleanSetOperation(this.id, this.noOp, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/ot/applied/AppliedDateSetOperation.ts


class AppliedDateSetOperation_AppliedDateSetOperation extends AppliedDiscreteOperation_AppliedDiscreteOperation {
    constructor(id, noOp, value, oldValue) {
        super(OperationType.DATE_VALUE, id, noOp);
        this.value = value;
        this.oldValue = oldValue;
        Object.freeze(this);
    }
    inverse() {
        return new AppliedDateSetOperation_AppliedDateSetOperation(this.id, this.noOp, this.oldValue, this.value);
    }
}

// CONCATENATED MODULE: ./src/main/model/historical/ModelOperationMapper.ts






















function toModelOperation(operationData, identityCache) {
    let appliedOp;
    if (operationData.operation.compoundOperation) {
        appliedOp = ModelOperationMapper_toCompoundOperation(operationData.operation.compoundOperation);
    }
    else if (operationData.operation.discreteOperation) {
        appliedOp = ModelOperationMapper_toDiscreteOperation(operationData.operation.discreteOperation);
    }
    else {
        throw new ConvergenceError("Invalid model operation: " + JSON.stringify(operationData));
    }
    return new ModelOperation(operationData.modelId, getOrDefaultNumber(operationData.version), timestampToDate(operationData.timestamp), identityCache.getUserForSession(operationData.sessionId), operationData.sessionId, appliedOp);
}
function ModelOperationMapper_toCompoundOperation(compoundOperationData) {
    const discreteOps = getOrDefaultArray(compoundOperationData.operations).map(ModelOperationMapper_toDiscreteOperation);
    return new AppliedCompoundOperation_AppliedCompoundOperation(discreteOps);
}
function ModelOperationMapper_toDiscreteOperation(discreteOperationData) {
    if (discreteOperationData.arrayInsertOperation) {
        const { id, noOp, index, value } = discreteOperationData.arrayInsertOperation;
        return new AppliedArrayInsertOperation_AppliedArrayInsertOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), toDataValue(value));
    }
    else if (discreteOperationData.arrayRemoveOperation) {
        const { id, noOp, index, oldValue } = discreteOperationData.arrayRemoveOperation;
        return new AppliedArrayRemoveOperation_AppliedArrayRemoveOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), toDataValue(oldValue));
    }
    else if (discreteOperationData.arrayMoveOperation) {
        const { id, noOp, fromIndex, toIndex } = discreteOperationData.arrayMoveOperation;
        return new AppliedArrayMoveOperation_AppliedArrayMoveOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(fromIndex), getOrDefaultNumber(toIndex));
    }
    else if (discreteOperationData.arrayReplaceOperation) {
        const { id, noOp, index, value, oldValue } = discreteOperationData.arrayReplaceOperation;
        return new AppliedArrayReplaceOperation_AppliedArrayReplaceOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), toDataValue(value), toDataValue(oldValue));
    }
    else if (discreteOperationData.arraySetOperation) {
        const { id, noOp, values, oldValues } = discreteOperationData.arraySetOperation;
        return new AppliedArraySetOperation_AppliedArraySetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultArray(values).map(toDataValue), getOrDefaultArray(oldValues).map(toDataValue));
    }
    else if (discreteOperationData.objectAddPropertyOperation) {
        const { id, noOp, key, value } = discreteOperationData.objectAddPropertyOperation;
        return new AppliedObjectAddPropertyOperation_AppliedObjectAddPropertyOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(key), toDataValue(value));
    }
    else if (discreteOperationData.objectSetPropertyOperation) {
        const { id, noOp, key, value, oldValue } = discreteOperationData.objectSetPropertyOperation;
        return new AppliedObjectSetPropertyOperation_AppliedObjectSetPropertyOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(key), toDataValue(value), toDataValue(oldValue));
    }
    else if (discreteOperationData.objectRemovePropertyOperation) {
        const { id, noOp, key, oldValue } = discreteOperationData.objectSetPropertyOperation;
        return new AppliedObjectRemovePropertyOperation_AppliedObjectRemovePropertyOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(key), toDataValue(oldValue));
    }
    else if (discreteOperationData.objectSetOperation) {
        const { id, noOp, values, oldValues } = discreteOperationData.objectSetOperation;
        return new AppliedObjectSetOperation_AppliedObjectSetOperation(id, getOrDefaultBoolean(noOp), mapObjectValues(getOrDefaultObject(values), toDataValue), mapObjectValues(getOrDefaultObject(oldValues), toDataValue));
    }
    else if (discreteOperationData.stringInsertOperation) {
        const { id, noOp, index, value } = discreteOperationData.stringInsertOperation;
        return new AppliedStringInsertOperation_AppliedStringInsertOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), getOrDefaultString(value));
    }
    else if (discreteOperationData.stringRemoveOperation) {
        const { id, noOp, index, oldValue } = discreteOperationData.stringRemoveOperation;
        return new AppliedStringRemoveOperation_AppliedStringRemoveOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(index), getOrDefaultString(oldValue));
    }
    else if (discreteOperationData.stringSetOperation) {
        const { id, noOp, value, oldValue } = discreteOperationData.stringSetOperation;
        return new AppliedStringSetOperation_AppliedStringSetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultString(value), getOrDefaultString(oldValue));
    }
    else if (discreteOperationData.numberDeltaOperation) {
        const { id, noOp, delta } = discreteOperationData.numberDeltaOperation;
        return new AppliedNumberDeltaOperation_AppliedNumberDeltaOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(delta));
    }
    else if (discreteOperationData.numberSetOperation) {
        const { id, noOp, value, oldValue } = discreteOperationData.numberSetOperation;
        return new AppliedNumberSetOperation_AppliedNumberSetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultNumber(value), getOrDefaultNumber(oldValue));
    }
    else if (discreteOperationData.booleanSetOperation) {
        const { id, noOp, value, oldValue } = discreteOperationData.booleanSetOperation;
        return new AppliedBooleanSetOperation_AppliedBooleanSetOperation(id, getOrDefaultBoolean(noOp), getOrDefaultBoolean(value), getOrDefaultBoolean(oldValue));
    }
    else if (discreteOperationData.dateSetOperation) {
        const { id, noOp, value, oldValue } = discreteOperationData.dateSetOperation;
        return new AppliedDateSetOperation_AppliedDateSetOperation(id, getOrDefaultBoolean(noOp), timestampToDate(value), timestampToDate(oldValue));
    }
}

// CONCATENATED MODULE: ./src/main/model/historical/HistoricalModel.ts







const HistoricalModelEventConstants = Object.assign(Object.assign({}, ObservableModelEventConstants), { TARGET_VERSION_CHANGED: "target_changed", TRANSITION_START: "transition_start", TRANSITION_END: "transition_end" });
Object.freeze(HistoricalModelEventConstants);
class HistoricalModel_HistoricalModel {
    constructor(data, version, modifiedTime, createdTime, modelId, collectionId, connection, session, identityCache) {
        this._session = session;
        this._connection = connection;
        this._identityCache = identityCache;
        this._modelId = modelId;
        this._collectionId = collectionId;
        this._model = new Model_Model(this.session(), null, data);
        this._wrapperFactory = new HistoricalWrapperFactory_HistoricalWrapperFactory(this);
        this._version = version;
        this._targetVersion = version;
        this._maxVersion = version;
        this._currentTime = modifiedTime;
        this._modifiedTime = modifiedTime;
        this._createdTime = createdTime;
        this._opRequests = [];
    }
    session() {
        return this._session;
    }
    collectionId() {
        return this._collectionId;
    }
    modelId() {
        return this._modelId;
    }
    time() {
        return this._currentTime;
    }
    minTime() {
        return this.createdTime();
    }
    maxTime() {
        return this._modifiedTime;
    }
    createdTime() {
        return this._createdTime;
    }
    version() {
        return this._version;
    }
    minVersion() {
        return 0;
    }
    maxVersion() {
        return this._maxVersion;
    }
    targetVersion() {
        return this._targetVersion;
    }
    isTransitioning() {
        return this._targetVersion === this._version;
    }
    root() {
        return this._wrapperFactory.wrap(this._model.root());
    }
    elementAt(...path) {
        return this._wrapperFactory.wrap(this._model.valueAt(...path));
    }
    playTo(version) {
        if (version < 0) {
            throw new Error(`Version must be >= 0: ${version}`);
        }
        else if (version > this._maxVersion) {
            throw new Error(`Version must be <= maxVersion: ${version}`);
        }
        let firstVersion;
        let lastVersion;
        let forward = null;
        if (version === this._targetVersion) {
            return Promise.resolve();
        }
        else if (version > this._targetVersion) {
            firstVersion = this._targetVersion + 1;
            lastVersion = version;
            forward = true;
        }
        else {
            firstVersion = version + 1;
            lastVersion = this._targetVersion;
            forward = false;
        }
        this._targetVersion = version;
        const request = {
            historicalOperationsRequest: {
                modelId: this._modelId,
                first: firstVersion,
                last: lastVersion
            }
        };
        const opRequest = {
            forward,
            completed: false,
            operations: null
        };
        this._opRequests.push(opRequest);
        return this._connection.request(request).then((response) => {
            const { historicalOperationsResponse } = response;
            opRequest.completed = true;
            opRequest.operations = getOrDefaultArray(historicalOperationsResponse.operations).map(op => toModelOperation(op, this._identityCache));
            this._checkAndProcess();
            return;
        });
    }
    forward(delta = 1) {
        if (delta < 1) {
            throw new Error("delta must be > 0");
        }
        else if (this._targetVersion + delta > this._maxVersion) {
            throw new Error(`Cannot move forward by ${delta}, because that would exceed the model's maxVersion.`);
        }
        const desiredVersion = this._targetVersion + delta;
        return this.playTo(desiredVersion);
    }
    backward(delta = 1) {
        if (delta < 1) {
            throw new Error("delta must be > 0");
        }
        else if (this._targetVersion - delta < 0) {
            throw new Error(`Cannot move backawrd by ${delta}, because that would move beyond version 0.`);
        }
        const desiredVersion = this._targetVersion - delta;
        return this.playTo(desiredVersion);
    }
    _checkAndProcess() {
        if (this._opRequests.length === 0) {
            throw new Error("There are no operation requests to process");
        }
        while (this._opRequests.length > 0 && this._opRequests[0].completed) {
            this._playOperations(this._opRequests[0].operations, this._opRequests[0].forward);
            this._opRequests.shift();
        }
    }
    _playOperations(operations, forward) {
        if (!forward) {
            operations.reverse().forEach((op) => {
                if (op.operation.type === OperationType.COMPOUND) {
                    const compoundOp = op.operation;
                    compoundOp.ops.reverse().forEach((discreteOp) => {
                        this._playDiscreteOp(op, discreteOp, true);
                    });
                }
                else {
                    this._playDiscreteOp(op, op.operation, true);
                }
            });
        }
        else {
            operations.forEach((op) => {
                if (op.operation.type === OperationType.COMPOUND) {
                    const compoundOp = op.operation;
                    compoundOp.ops.forEach((discreteOp) => {
                        this._playDiscreteOp(op, discreteOp, false);
                    });
                }
                else {
                    this._playDiscreteOp(op, op.operation, false);
                }
            });
        }
    }
    _playDiscreteOp(op, discreteOp, inverse) {
        if (!discreteOp.noOp) {
            const dOp = inverse ?
                discreteOp.inverse() :
                discreteOp;
            this._model.handleModelOperationEvent(new ModelOperationEvent(op.sessionId, op.user, op.version, op.timestamp, dOp));
        }
        if (inverse) {
            this._version = op.version - 1;
        }
        else {
            this._version = op.version;
        }
        this._currentTime = new Date(op.timestamp);
    }
}
HistoricalModel_HistoricalModel.Events = HistoricalModelEventConstants;

// CONCATENATED MODULE: ./src/main/model/historical/index.ts











// CONCATENATED MODULE: ./src/main/events/ConnectedEvent.ts
class ConnectedEvent {
    constructor(domain) {
        this.domain = domain;
        this.name = ConnectedEvent.NAME;
        Object.freeze(this);
    }
}
ConnectedEvent.NAME = "connected";

// CONCATENATED MODULE: ./src/main/events/ConnectionFailedEvent.ts
class ConnectionFailedEvent {
    constructor(domain) {
        this.domain = domain;
        this.name = ConnectionFailedEvent.NAME;
        Object.freeze(this);
    }
}
ConnectionFailedEvent.NAME = "connection_failed";

// CONCATENATED MODULE: ./src/main/events/ConnectionScheduledEvent.ts
class ConnectionScheduledEvent {
    constructor(domain, delay) {
        this.domain = domain;
        this.delay = delay;
        this.name = ConnectionScheduledEvent.NAME;
        Object.freeze(this);
    }
}
ConnectionScheduledEvent.NAME = "connection_scheduled";

// CONCATENATED MODULE: ./src/main/events/ConnectingEvent.ts
class ConnectingEvent {
    constructor(domain) {
        this.domain = domain;
        this.name = ConnectingEvent.NAME;
        Object.freeze(this);
    }
}
ConnectingEvent.NAME = "connecting";

// CONCATENATED MODULE: ./src/main/events/AuthenticatingEvent.ts
class AuthenticatingEvent {
    constructor(domain, method) {
        this.domain = domain;
        this.method = method;
        this.name = AuthenticatingEvent.NAME;
        Object.freeze(this);
    }
}
AuthenticatingEvent.NAME = "authenticating";

// CONCATENATED MODULE: ./src/main/events/AuthenticatedEvent.ts
class AuthenticatedEvent {
    constructor(domain, method) {
        this.domain = domain;
        this.method = method;
        this.name = AuthenticatedEvent.NAME;
        Object.freeze(this);
    }
}
AuthenticatedEvent.NAME = "authenticated";

// CONCATENATED MODULE: ./src/main/events/AuthenticationFailedEvent.ts
class AuthenticationFailedEvent {
    constructor(domain, method) {
        this.domain = domain;
        this.method = method;
        this.name = AuthenticationFailedEvent.NAME;
        Object.freeze(this);
    }
}
AuthenticationFailedEvent.NAME = "authentication_failed";

// CONCATENATED MODULE: ./src/main/events/DisconnectedEvent.ts
class DisconnectedEvent {
    constructor(domain) {
        this.domain = domain;
        this.name = DisconnectedEvent.NAME;
        Object.freeze(this);
    }
}
DisconnectedEvent.NAME = "disconnected";

// CONCATENATED MODULE: ./src/main/events/InterruptedEvent.ts
class InterruptedEvent {
    constructor(domain) {
        this.domain = domain;
        this.name = InterruptedEvent.NAME;
        Object.freeze(this);
    }
}
InterruptedEvent.NAME = "interrupted";

// CONCATENATED MODULE: ./src/main/events/ErrorEvent.ts
class ErrorEvent {
    constructor(domain, error) {
        this.domain = domain;
        this.error = error;
        this.name = ErrorEvent.NAME;
        Object.freeze(this);
    }
}
ErrorEvent.NAME = "error";

// CONCATENATED MODULE: ./src/main/events/index.ts











// CONCATENATED MODULE: ./src/main/model/ModelService.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};























const ModelServiceEventConstants = {
    OFFLINE_MODEL_STATUS_CHANGED: "offline_model_status_changed",
    OFFLINE_MODEL_UPDATED: "offline_model_updated",
    OFFLINE_MODEL_DOWNLOAD_PENDING: "offline_model_download_pending",
    OFFLINE_MODEL_DOWNLOAD_COMPLETED: "offline_model_download_completed",
    OFFLINE_MODEL_SYNC_STARTED: "offline_model_sync_started",
    OFFLINE_MODEL_SYNC_COMPLETED: "offline_model_sync_completed",
    OFFLINE_MODEL_DELETED: "offline_model_deleted",
    OFFLINE_MODEL_PERMISSIONS_REVOKED: "offline_model_permissions_revoked",
    OFFLINE_MODEL_SYNC_ERROR: "offline_model_sync_error"
};
Object.freeze(ModelServiceEventConstants);
class ModelService_ModelService extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(connection, identityCache, modelOfflineManager) {
        super();
        this._openModelRequests = new Map();
        this._openModels = new Map();
        this._resourceIdToModelId = new Map();
        this._resyncingModels = new Map();
        this._setOffline = () => {
            this._openModels.forEach((model) => {
                model._setOffline();
                if (this._resyncingModels.has(model.modelId())) {
                    this._resyncingModels.delete(model.modelId());
                }
            });
            this._resyncingModels.forEach(entry => {
                if (entry.resyncModel) {
                    entry.resyncModel._setOffline();
                    entry.resyncModel._initiateClose(false);
                }
            });
            this._resyncingModels.clear();
            this._modelResyncQueue.length = 0;
            this._checkResyncQueue();
        };
        this._setOnline = () => {
            this._openModels.forEach((model) => {
                this._resyncOpenModel(model);
            });
            if (this._resyncingModels.size !== 0) {
                this._syncCompletedDeferred = new Deferred_Deferred();
            }
            if (this._modelOfflineManager.isOfflineEnabled()) {
                this._offlineSyncStartedDeferred = new ReplayDeferred_ReplayDeferred();
                this._modelOfflineManager
                    .ready()
                    .then(() => {
                    if (this._connection.isOnline()) {
                        this._emitEvent(new OfflineModelSyncStartedEvent());
                        return this._syncDirtyModelsToServer();
                    }
                })
                    .then(() => {
                    if (this._connection.isOnline()) {
                        this._emitEvent(new OfflineModelSyncCompletedEvent());
                        return this._modelOfflineManager.resubscribe();
                    }
                    else {
                        return Promise.resolve();
                    }
                })
                    .catch((e) => this._log.error("Error resynchronizing models after reconnect", e));
            }
        };
        this._connection = connection;
        this._identityCache = identityCache;
        this._connection
            .messages()
            .subscribe(message => this._handleMessage(message));
        this._autoRequestId = 0;
        this._autoCreateRequests = new Map();
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.INTERRUPTED, this._setOffline);
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.DISCONNECTED, this._setOffline);
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATED, this._setOnline);
        this._modelResyncQueue = [];
        this._syncCompletedDeferred = null;
        this._offlineSyncStartedDeferred = null;
        this._modelOfflineManager = modelOfflineManager;
        this._emitFrom(modelOfflineManager.events());
        this._modelIdGenerator = new RandomStringGenerator(32, RandomStringGenerator.AlphaNumeric);
        this._log = Logging.logger("models");
    }
    session() {
        return this._connection.session();
    }
    isResyncing() {
        return this._syncCompletedDeferred !== null;
    }
    query(query) {
        Validation_Validation.assertNonEmptyString(query, "query");
        const request = {
            modelsQueryRequest: {
                query
            }
        };
        return this._connection
            .request(request)
            .then((response) => {
            const { modelsQueryResponse } = response;
            const data = getOrDefaultArray(modelsQueryResponse.models).map(toModelResult);
            const offset = getOrDefaultNumber(modelsQueryResponse.offset);
            const totalResults = getOrDefaultNumber(modelsQueryResponse.totalResults);
            return new PagedData(data, offset, totalResults);
        });
    }
    isOpen(id) {
        Validation_Validation.assertNonEmptyString(id, "id");
        return this._openModels.has(id);
    }
    isOpening(id) {
        Validation_Validation.assertNonEmptyString(id, "id");
        return this._openModelRequests.has(id);
    }
    open(id) {
        Validation_Validation.assertNonEmptyString(id, "id");
        return this._checkAndOpen(id);
    }
    openAutoCreate(options) {
        if (Validation_Validation.isNotSet(options)) {
            throw new ConvergenceError("'options' is a required parameter");
        }
        if (options.id === "") {
            throw new ConvergenceError("'options.id' can not be an empty string");
        }
        if (!Validation_Validation.nonEmptyString(options.collection)) {
            return Promise.reject(new Error("options.collection must be a non-null, non empty string."));
        }
        return this._checkAndOpen(undefined, options);
    }
    create(options) {
        if (Validation_Validation.isNotSet(options)) {
            throw new ConvergenceError("'options' is a required parameter");
        }
        if (!Validation_Validation.nonEmptyString(options.collection)) {
            return Promise.reject(new Error("options.collection must be a non-null, non empty string."));
        }
        return this._checkAndCreate(options);
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            Validation_Validation.assertNonEmptyString(id, "id");
            if (this._openModels.get(id)) {
                const model = this._openModels.get(id);
                model._handleLocallyDeleted();
                yield model.whenClosed();
            }
            if (this._offlineSyncStartedDeferred !== null) {
                yield this._offlineSyncStartedDeferred.promise();
            }
            if (this._resyncingModels.has(id)) {
                const entry = this._resyncingModels.get(id);
                yield entry.ready;
                if (entry.action === "resync") {
                    const model = entry.resyncModel;
                    model._handleLocallyDeleted();
                    yield model.whenClosed();
                }
            }
            if (this._connection.isOnline()) {
                return this._removeOnline(id);
            }
            else if (this._modelOfflineManager.isOfflineEnabled()) {
                return this._removeOffline(id);
            }
            else {
                throw new ConvergenceError("Can not delete a model while not connected and without offline support enabled.");
            }
        });
    }
    history(id) {
        Validation_Validation.assertNonEmptyString(id, "id");
        const request = {
            historicalDataRequest: {
                modelId: id
            }
        };
        return this._connection.request(request).then((response) => {
            const { historicalDataResponse } = response;
            return new HistoricalModel_HistoricalModel(toObjectValue(historicalDataResponse.data), getOrDefaultNumber(historicalDataResponse.version), timestampToDate(historicalDataResponse.modifiedTime), timestampToDate(historicalDataResponse.createdTime), id, historicalDataResponse.collectionId, this._connection, this.session(), this._identityCache);
        });
    }
    permissions(id) {
        Validation_Validation.assertNonEmptyString(id, "id");
        return new ModelPermissionManager_ModelPermissionManager(id, this._connection);
    }
    subscribeOffline(modelId) {
        const modelIds = TypeChecker.isArray(modelId) ? modelId : [modelId];
        return this._modelOfflineManager.subscribe(modelIds);
    }
    unsubscribeOffline(modelId) {
        const modelIds = TypeChecker.isArray(modelId) ? modelId : [modelId];
        return this._modelOfflineManager.unsubscribe(modelIds);
    }
    setOfflineSubscription(modelIds) {
        return this._modelOfflineManager.setSubscriptions(modelIds);
    }
    getOfflineSubscriptions() {
        return this._modelOfflineManager.ready().then(() => this._modelOfflineManager.getSubscribedModelIds());
    }
    getOfflineModelMetaData() {
        return this._modelOfflineManager.ready().then(() => this._modelOfflineManager.getAllModelMetaData());
    }
    _create(options, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = options.collection;
            if (this._connection.isOnline()) {
                const userPermissions = modelUserPermissionMapToProto(options.userPermissions);
                const dataValue = data || this._getDataFromCreateOptions(options);
                const request = {
                    createRealTimeModelRequest: {
                        collectionId: collection,
                        modelId: toOptional(options.id),
                        data: toIObjectValue(dataValue),
                        overrideWorldPermissions: options.overrideCollectionWorldPermissions,
                        worldPermissions: options.worldPermissions,
                        userPermissions
                    }
                };
                return this._connection.request(request).then((response) => {
                    const { createRealTimeModelResponse } = response;
                    return createRealTimeModelResponse.modelId;
                });
            }
            else if (this._modelOfflineManager.isOfflineEnabled()) {
                const id = options.id || this._modelIdGenerator.nextString();
                return this._modelOfflineManager
                    .getModelMetaData(id)
                    .then(metaData => {
                    if (TypeChecker.isSet(metaData) && metaData.available) {
                        return Promise.reject(new Error(`An offline model with the specified id already exists: ${id}`));
                    }
                    else {
                        const dataValue = data || this._getDataFromCreateOptions(options);
                        const creationData = {
                            modelId: id,
                            collection: options.collection,
                            initialData: dataValue,
                            overrideCollectionWorldPermissions: options.overrideCollectionWorldPermissions,
                            worldPermissions: options.worldPermissions,
                            userPermissions: options.userPermissions
                        };
                        return this._modelOfflineManager.createOfflineModel(creationData).then(() => id);
                    }
                });
            }
            else {
                throw new ConvergenceError("Can not create a model while not connected and without offline support enabled.");
            }
        });
    }
    _close(resourceId) {
        if (this._resourceIdToModelId.has(resourceId)) {
            const modelId = this._resourceIdToModelId.get(resourceId);
            this._log.debug("Model closed: " + modelId);
            this._resourceIdToModelId.delete(resourceId);
            this._openModels.delete(modelId);
            if (this._resyncingModels.has(modelId)) {
                this._resyncComplete(modelId);
            }
        }
        else {
            this._log.warn("Asked to close a model for unknown resource id: " + resourceId);
        }
    }
    _resyncComplete(modelId) {
        this._log.debug(`Resync completed for model: "${modelId}"`);
        this._resyncingModels.delete(modelId);
        this._checkResyncQueue();
    }
    _resyncError(modelId, message, model) {
        this._log.debug(`Resync error for model: "${modelId}"... ${message}`);
        const event = new OfflineModelSyncErrorEvent(modelId, message, model);
        this._emitEvent(event);
        const entry = this._resyncingModels.get(modelId);
        entry.ready.reject(new Error(message));
        this._resyncComplete(modelId);
    }
    _resourceIdChanged(modelId, oldResourceId, newResourceId) {
        if (this._resourceIdToModelId.has(oldResourceId)) {
            this._resourceIdToModelId.set(newResourceId, modelId);
        }
        this._resourceIdToModelId.delete(oldResourceId);
    }
    _dispose() {
        this._openModels.forEach(model => model
            .close()
            .catch(err => this._log.error(err)));
    }
    _checkAndOpen(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === undefined && options === undefined) {
                throw new Error("Internal error, id or options must be defined.");
            }
            if (this._offlineSyncStartedDeferred !== null) {
                yield this._offlineSyncStartedDeferred.promise();
            }
            if (TypeChecker.isNotSet(id)) {
                id = options.id;
            }
            if (id && this._openModels.has(id)) {
                const model = this._openModels.get(id);
                if (model.isClosing()) {
                    return model.whenClosed().then(() => this._open(id, options));
                }
                else {
                    this._log.debug(`Opening model '${id}' that is already open`);
                    return Promise.resolve(model);
                }
            }
            if (id && this._openModelRequests.has(id)) {
                this._log.debug(`Opening model '${id}' that is already opening`);
                return this._openModelRequests.get(id).promise();
            }
            const resyncEntry = this._resyncingModels.get(id);
            if (resyncEntry && resyncEntry.resyncModel) {
                this._log.debug(`Opening model '${id}' that is resyncing`);
                if (resyncEntry.resyncModel.isClosing()) {
                    return resyncEntry.resyncModel.whenClosed().then(() => this._open(id, options));
                }
                else {
                    resyncEntry.resyncModel._openAfterResync();
                    return Promise.resolve(resyncEntry.resyncModel);
                }
            }
            return this._open(id, options);
        });
    }
    _open(id, options) {
        const autoRequestId = options ? this._autoRequestId++ : undefined;
        if (options !== undefined) {
            this._autoCreateRequests.set(autoRequestId, options);
        }
        const deferred = new Deferred_Deferred();
        if (id !== undefined) {
            this._openModelRequests.set(id, deferred);
        }
        let open;
        if (this._connection.isOnline()) {
            open = this._openOnline(id, autoRequestId);
        }
        else if (this._modelOfflineManager.isOfflineEnabled()) {
            open = this._openOffline(id, autoRequestId);
        }
        else {
            open = Promise.reject(new ConvergenceError("Can not open a model while not online and without offline enabled."));
        }
        const result = open.then(model => {
            this._clearOpenRequestRecords(id, autoRequestId);
            this._openModels.set(model.modelId(), model);
            if (model._isOffline() && this._connection.isOnline()) {
                this._resyncOpenModel(model);
            }
            return model;
        }).catch((error) => {
            this._clearOpenRequestRecords(id, autoRequestId);
            return Promise.reject(error);
        });
        deferred.resolveFromPromise(result);
        return deferred.promise();
    }
    _resyncOpenModel(model) {
        this._resyncingModels.set(model.modelId(), {
            action: "resync",
            inProgress: true,
            modelId: model.modelId(),
            ready: ReplayDeferred_ReplayDeferred.resolved(),
            resyncModel: model
        });
        model._setOnline();
    }
    _clearOpenRequestRecords(id, autoRequestId) {
        if (id !== undefined) {
            this._openModelRequests.delete(id);
        }
        if (autoRequestId !== undefined) {
            this._autoCreateRequests.delete(autoRequestId);
        }
    }
    _openOnline(id, autoRequestId) {
        if (TypeChecker.isString(id) && this._modelOfflineManager.isOfflineEnabled()) {
            this._log.debug(`Opening model '${id}' while online`);
            return this._openOnlineWithOfflineEnabled(id, autoRequestId);
        }
        else {
            return this._requestOpenFromServer(id, autoRequestId);
        }
    }
    _openOnlineWithOfflineEnabled(id, autoRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this._modelResyncQueue.findIndex(entry => entry.modelId === id);
            if (index >= 0) {
                const [entry] = this._modelResyncQueue.splice(index, 1);
                yield this._initiateModelResync(entry.modelId);
            }
            if (this._resyncingModels.has(id)) {
                const entry = this._resyncingModels.get(id);
                yield entry.ready.promise();
                if (entry.action === "resync") {
                    return entry.resyncModel;
                }
                else {
                    this._requestOpenFromServer(id, autoRequestId);
                }
            }
            else {
                return this._requestOpenFromServer(id, autoRequestId);
            }
        });
    }
    _requestOpenFromServer(id, autoRequestId) {
        const request = {
            openRealTimeModelRequest: {
                modelId: toOptional(id),
                autoCreateId: toOptional(autoRequestId)
            }
        };
        return this._connection.request(request)
            .then((response) => {
            const { openRealTimeModelResponse } = response;
            const data = toObjectValue(openRealTimeModelResponse.data);
            const model = this._createModel(getOrDefaultString(openRealTimeModelResponse.resourceId), getOrDefaultString(openRealTimeModelResponse.modelId), getOrDefaultString(openRealTimeModelResponse.collection), false, false, getOrDefaultNumber(openRealTimeModelResponse.version), 0, timestampToDate(openRealTimeModelResponse.createdTime), timestampToDate(openRealTimeModelResponse.modifiedTime), getOrDefaultString(openRealTimeModelResponse.valueIdPrefix), getOrDefaultArray(openRealTimeModelResponse.connectedClients), getOrDefaultArray(openRealTimeModelResponse.resyncingClients), getOrDefaultArray(openRealTimeModelResponse.references), toModelPermissions(openRealTimeModelResponse.permissions), data);
            this._resourceIdToModelId.set(openRealTimeModelResponse.resourceId, model.modelId());
            if (this._modelOfflineManager.isOfflineEnabled()) {
                return this._modelOfflineManager
                    .storeOpenModelOffline(model)
                    .then(() => {
                    this._modelOfflineManager.modelOpened(model, 0);
                    return model;
                });
            }
            else {
                return model;
            }
        });
    }
    _openOffline(id, autoRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (TypeChecker.isUndefined(id)) {
                id = this._modelIdGenerator.nextString();
            }
            this._log.debug(`Opening model '${id}' while offline`);
            const modelState = yield this._modelOfflineManager.getOfflineModelState(id);
            if (TypeChecker.isSet(modelState)) {
                const vidPrefix = yield this._modelOfflineManager.claimValueIdPrefix(id);
                const model = this._creteModelFromOfflineState(modelState, vidPrefix, false);
                return Promise.resolve(model);
            }
            else if (this._autoCreateRequests.has(autoRequestId)) {
                const options = this._autoCreateRequests.get(autoRequestId);
                const model = this._createNewModelOffline(id, options);
                const snapshot = model._getConcurrencyControlStateSnapshot();
                const creationData = {
                    modelId: id,
                    collection: options.collection,
                    initialData: snapshot.data,
                    overrideCollectionWorldPermissions: options.overrideCollectionWorldPermissions,
                    worldPermissions: options.worldPermissions,
                    userPermissions: options.userPermissions
                };
                return this._modelOfflineManager.createOfflineModel(creationData).then(() => model);
            }
            else {
                return Promise.reject(new Error("Model not available offline, and not auto create options were provided"));
            }
        });
    }
    _creteModelFromOfflineState(state, valueIdPrefix, resyncOnly) {
        this._log.debug(`Creating model '${state.modelId}' from offline state`);
        const resourceId = `offline:${state.modelId}`;
        const model = this._createModel(resourceId, state.modelId, state.collection, state.local, resyncOnly, state.snapshot.version, state.snapshot.sequenceNumber, state.createdTime, state.modifiedTime, `${valueIdPrefix.prefix}-${valueIdPrefix.increment}`, [], [], [], state.permissions, state.snapshot.data);
        this._resourceIdToModelId.set(resourceId, model.modelId());
        model._setOffline();
        model._rehydrateFromOfflineState(state.version, state.snapshot.serverOperations, state.snapshot.localOperations);
        const opsSinceSnapshot = (state.version - state.snapshot.version) + (state.lastSequenceNumber - state.snapshot.sequenceNumber);
        this._modelOfflineManager.modelOpened(model, opsSinceSnapshot);
        return model;
    }
    _removeOnline(id) {
        this._log.debug(`Removing model online: "${id}"`);
        const request = {
            deleteRealtimeModelRequest: {
                modelId: id
            }
        };
        return this._connection.request(request).then(() => {
            if (this._modelOfflineManager.isOfflineEnabled()) {
                this._modelOfflineManager
                    .getModelMetaData(id)
                    .then(meta => {
                    if (meta) {
                        return this._modelOfflineManager.modelDeleted(id);
                    }
                })
                    .catch((e) => {
                    this._emitEvent(new ErrorEvent(this._connection.session().domain(), `There was an error removing the model with id '${id}' from the offline store: ${e.message}`));
                    this._log.error("Error removing model from offline store.", e);
                });
            }
        });
    }
    _removeOffline(id) {
        this._log.debug(`Removing model offline: "${id}"`);
        return this._modelOfflineManager
            .getModelMetaData(id)
            .then(meta => {
            if (meta) {
                return this._modelOfflineManager.markModelForDeletion(id);
            }
        })
            .catch(e => {
            this._log.error("Could not mark model for deletion", e);
        });
    }
    _createNewModelOffline(id, options) {
        this._log.debug(`Creating new offline model '${id}' using auto-create options.`);
        const dataValue = this._getDataFromCreateOptions(options);
        const resourceId = `offline:${id}`;
        const valueIdPrefix = "0";
        const currentTime = new Date();
        const permissions = new ModelPermissions(true, true, true, true);
        const version = 1;
        const local = true;
        const resyncOnly = false;
        const model = this._createModel(resourceId, id, options.collection, local, resyncOnly, version, 0, currentTime, currentTime, valueIdPrefix, [], [], [], permissions, dataValue);
        this._resourceIdToModelId.set(resourceId, model.modelId());
        model._setOffline();
        this._modelOfflineManager.modelOpened(model, 0);
        return model;
    }
    _createModel(resourceId, modelId, collection, local, resyncModel, version, sequenceNumber, createdTime, modifiedTime, valueIdPrefix, connectedClients, resyncingClients, references, permissions, data) {
        const transformer = new OperationTransformer_OperationTransformer(new TransformationFunctionRegistry_TransformationFunctionRegistry());
        const referenceTransformer = new ReferenceTransformer_ReferenceTransformer(new TransformationFunctionRegistry_TransformationFunctionRegistry());
        const clientConcurrencyControl = new ClientConcurrencyControl_ClientConcurrencyControl(() => this._connection.session().sessionId(), version, sequenceNumber, transformer, referenceTransformer);
        const model = new RealTimeModel_RealTimeModel(resourceId, valueIdPrefix, data, local, resyncModel, connectedClients, resyncingClients, references, permissions, createdTime, modifiedTime, modelId, collection, clientConcurrencyControl, this._connection, this._identityCache, this, this._modelOfflineManager);
        return model;
    }
    _handleMessage(messageEvent) {
        const message = messageEvent.message;
        const resourceId = getModelMessageResourceId(message);
        if (resourceId) {
            const model = this._getModelForResourceId(resourceId);
            if (model) {
                model._handleMessage(messageEvent);
            }
            else {
                this._log.warn("Received a message for a model that is not open or resynchronizing: " + JSON.stringify(message));
            }
        }
        else if (message.modelAutoCreateConfigRequest) {
            this._handleModelDataRequest(message.modelAutoCreateConfigRequest, messageEvent.callback);
        }
    }
    _getModelForResourceId(resourceId) {
        const modelId = this._resourceIdToModelId.get(resourceId);
        if (modelId === undefined) {
            this._log.warn("Received a message for an unknown resourceId: " + resourceId);
            return null;
        }
        const openModel = this._openModels.get(modelId);
        if (openModel !== undefined) {
            return openModel;
        }
        const resyncModel = this._resyncingModels.get(modelId);
        if (resyncModel !== null) {
            if (resyncModel.resyncModel) {
                return resyncModel.resyncModel;
            }
            else {
                this._log.warn("Received a message for model that is resyncing but not ready: " + modelId);
                return null;
            }
        }
        return null;
    }
    _handleModelDataRequest(request, replyCallback) {
        const autoCreateId = request.autoCreateId || 0;
        if (!this._autoCreateRequests.has(autoCreateId)) {
            const message = `Received a request for an auto create id that was not expected: ${autoCreateId}`;
            this._log.error(message);
            replyCallback.expectedError("unknown_model", message);
        }
        else {
            const options = this._autoCreateRequests.get(autoCreateId);
            this._autoCreateRequests.delete(autoCreateId);
            const dataValue = this._getDataFromCreateOptions(options);
            const userPermissions = modelUserPermissionMapToProto(options.userPermissions);
            const response = {
                modelAutoCreateConfigResponse: {
                    data: toIObjectValue(dataValue),
                    ephemeral: options.ephemeral,
                    collection: options.collection,
                    overridePermissions: options.overrideCollectionWorldPermissions,
                    worldPermissions: options.worldPermissions,
                    userPermissions
                }
            };
            replyCallback.reply(response);
        }
    }
    _getDataFromCreateOptions(options) {
        let data = options.data;
        if (TypeChecker.isFunction(data)) {
            data = data();
        }
        else if (TypeChecker.isNotSet(data)) {
            data = {};
        }
        data = Object.assign({}, data);
        const idGen = new InitialIdGenerator();
        const dataValueFactory = new DataValueFactory(() => {
            return idGen.id();
        });
        return dataValueFactory.createDataValue(data);
    }
    _syncDirtyModelsToServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._syncCompletedDeferred === null) {
                this._syncCompletedDeferred = new Deferred_Deferred();
            }
            const syncNeeded = yield this._modelOfflineManager.getModelsRequiringSync();
            syncNeeded.forEach(metaData => {
                if (!this._openModels.has(metaData.modelId) &&
                    !this._openModelRequests.has(metaData.modelId) &&
                    !this._resyncingModels.has(metaData.modelId)) {
                    const entry = {
                        modelId: metaData.modelId,
                        action: metaData.available ? "resync" : "delete",
                        inProgress: false,
                        ready: new ReplayDeferred_ReplayDeferred(),
                        resyncModel: null
                    };
                    this._resyncingModels.set(metaData.modelId, entry);
                    this._modelResyncQueue.push(entry);
                }
            });
            const promise = this._syncCompletedDeferred.promise();
            this._offlineSyncStartedDeferred.resolve();
            this._offlineSyncStartedDeferred = null;
            this._checkResyncQueue();
            return promise;
        });
    }
    _checkResyncQueue() {
        const inProgress = Array.from(this._resyncingModels.values()).filter(m => m.inProgress);
        this._log.debug("Checking resync status");
        this._log.debug(() => {
            const modelIds = inProgress.map(e => e.modelId);
            return `In Progress Resync Models (${inProgress.length}): ${JSON.stringify(modelIds)}`;
        });
        this._log.debug(() => {
            const modelIds = this._modelResyncQueue.map(e => e.modelId);
            return `Queued Resync Models (${this._modelResyncQueue.length}): ${JSON.stringify(modelIds)}`;
        });
        if (inProgress.length === 0) {
            if (this._modelResyncQueue.length === 0) {
                if (this._offlineSyncStartedDeferred !== null) {
                    this._log.debug(`Resync queue is empty, but waiting for offline sync to start.`);
                    this._offlineSyncStartedDeferred.promise().then(() => this._checkResyncQueue());
                }
                else if (this._syncCompletedDeferred !== null) {
                    this._log.debug(`Resync queue is empty, completing resync process`);
                    this._syncCompletedDeferred.resolve();
                    this._syncCompletedDeferred = null;
                }
            }
            else {
                const entry = this._modelResyncQueue.pop();
                this._initiateModelResync(entry.modelId).catch((e) => {
                    this._log.error("Error resyncing models", e);
                });
            }
        }
    }
    _initiateModelResync(modelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._log.debug(`Initiating sync for model: "${modelId}"`);
            const entry = this._resyncingModels.get(modelId);
            if (entry.action === "resync") {
                const modelState = yield this._modelOfflineManager.getOfflineModelState(entry.modelId);
                if (TypeChecker.isSet(modelState)) {
                    const prefix = yield this._modelOfflineManager.claimValueIdPrefix(entry.modelId);
                    const model = this._createAndSyncModel(modelState, prefix);
                    entry.resyncModel = model;
                    entry.ready.resolve();
                }
                else {
                    const message = `The state for model "${modelId}" could not be found to resynchronize the model`;
                    this._resyncError(modelId, message);
                    return Promise.reject(new Error(message));
                }
            }
            else {
                return this._deleteResyncModel(entry.modelId)
                    .then(() => entry.ready.resolve())
                    .catch((e) => {
                    this._resyncError(modelId, e.message);
                    return Promise.reject(new Error(e.message));
                });
            }
        });
    }
    _deleteResyncModel(modelId) {
        this._log.debug(`Deleting resync model from the server: "${modelId}"`);
        return this._removeOnline(modelId)
            .then(() => this._resyncComplete(modelId))
            .catch((e) => {
            if (e instanceof ConvergenceServerError && e.code === "model_not_found") {
                this._resyncComplete(modelId);
                return Promise.resolve();
            }
            else {
                return Promise.reject(e);
            }
        });
    }
    _createAndSyncModel(modelState, valueIdPrefix) {
        this._log.debug(`Creating and resynchronizing model: ${modelState.modelId}`);
        const model = this._creteModelFromOfflineState(modelState, valueIdPrefix, true);
        model._setOnline();
        return model;
    }
    _checkAndCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._openModels.has(options.id)) {
                const message = `A model with id '${options.id}' is open locally.`;
                return Promise.reject(new ConvergenceError(message));
            }
            if (this._offlineSyncStartedDeferred !== null) {
                yield this._offlineSyncStartedDeferred.promise();
            }
            if (this._resyncingModels.has(options.id)) {
                const entry = this._resyncingModels.get(options.id);
                if (entry.action === "resync") {
                    const message = `A model with id '${options.id}' is resynchronizing.`;
                    return Promise.reject(new ConvergenceError(message));
                }
                else {
                    yield entry.ready;
                }
            }
            return this._create(options);
        });
    }
}
ModelService_ModelService.Events = ModelServiceEventConstants;
class InitialIdGenerator {
    constructor() {
        this._prefix = "@";
        this._id = 0;
    }
    id() {
        return this._prefix + ":" + this._id++;
    }
}

// CONCATENATED MODULE: ./src/main/model/index.ts









// CONCATENATED MODULE: ./src/main/activity/ActivityParticipant.ts

class ActivityParticipant_ActivityParticipant {
    constructor(activity, user, sessionId, local, state) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this._state = deepClone(state);
        Object.freeze(this);
    }
    get state() {
        return deepClone(this._state);
    }
    clone(modifications = {}) {
        return new ActivityParticipant_ActivityParticipant(modifications.activity !== undefined ? modifications.activity : this.activity, modifications.user !== undefined ? modifications.user : this.user, modifications.sessionId !== undefined ? modifications.sessionId : this.sessionId, modifications.local !== undefined ? modifications.local : this.local, modifications.state !== undefined ? modifications.state : this.state);
    }
}

// CONCATENATED MODULE: ./src/main/activity/events/ActivitySessionJoinedEvent.ts
class ActivitySessionJoinedEvent {
    constructor(activity, user, sessionId, local, participant) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.participant = participant;
        this.name = ActivitySessionJoinedEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivitySessionJoinedEvent.EVENT_NAME = "session_joined";

// CONCATENATED MODULE: ./src/main/activity/events/ActivitySessionLeftEvent.ts
class ActivitySessionLeftEvent {
    constructor(activity, user, sessionId, local) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = ActivitySessionLeftEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivitySessionLeftEvent.EVENT_NAME = "session_left";

// CONCATENATED MODULE: ./src/main/activity/events/ActivityStateSetEvent.ts
class ActivityStateSetEvent {
    constructor(activity, user, sessionId, local, key, value, oldValue) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.key = key;
        this.value = value;
        this.oldValue = oldValue;
        this.name = ActivityStateSetEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivityStateSetEvent.EVENT_NAME = "state_set";

// CONCATENATED MODULE: ./src/main/activity/events/ActivityStateRemovedEvent.ts
class ActivityStateRemovedEvent {
    constructor(activity, user, sessionId, local, key, oldValue) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.key = key;
        this.oldValue = oldValue;
        this.name = ActivityStateRemovedEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivityStateRemovedEvent.EVENT_NAME = "state_removed";

// CONCATENATED MODULE: ./src/main/activity/events/ActivityStateClearedEvent.ts
class ActivityStateClearedEvent {
    constructor(activity, user, sessionId, local, oldValues) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.oldValues = oldValues;
        this.name = ActivityStateClearedEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivityStateClearedEvent.EVENT_NAME = "state_cleared";

// CONCATENATED MODULE: ./src/main/activity/events/ActivityStateDeltaEvent.ts
class ActivityStateDeltaEvent {
    constructor(activity, user, sessionId, local, values, complete, removed, oldValues) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.values = values;
        this.complete = complete;
        this.removed = removed;
        this.oldValues = oldValues;
        this.name = ActivityStateDeltaEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivityStateDeltaEvent.EVENT_NAME = "state_delta";

// CONCATENATED MODULE: ./src/main/activity/events/index.ts







// CONCATENATED MODULE: ./src/main/activity/events/ActivityLeftEvent.ts
class ActivityLeftEvent {
    constructor(activity, user, sessionId, local) {
        this.activity = activity;
        this.user = user;
        this.sessionId = sessionId;
        this.local = local;
        this.name = ActivityLeftEvent.EVENT_NAME;
        Object.freeze(this);
    }
}
ActivityLeftEvent.EVENT_NAME = "left";

// CONCATENATED MODULE: ./src/main/activity/Activity.ts














class Activity_Activity extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(id, identityCache, connection) {
        super();
        this._setOnline = () => {
            this._logger.debug(() => `Activity '${this._id}' is online`);
            const initialState = this._localParticipant.state;
            const deferred = new Deferred_Deferred();
            this._joinWhileOnline(deferred, initialState);
        };
        this._setOffline = () => {
            this._logger.debug(() => `Activity '${this._id}' is offline`);
            this._mutateParticipants((participants) => {
                for (const [sessionId, participant] of participants) {
                    if (sessionId !== this._localParticipant.sessionId) {
                        participants.delete(sessionId);
                        const event = new ActivitySessionLeftEvent(this, participant.user, participant.sessionId, false);
                        this._emitEvent(event);
                    }
                }
            });
        };
        this._identityCache = identityCache;
        this._id = id;
        this._participants = new external_rxjs_["BehaviorSubject"](new Map());
        this._joined = true;
        this._connection = connection;
        this._logger = Logging.logger("activities.activity");
        this._joinPromise = null;
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.INTERRUPTED, this._setOffline);
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.DISCONNECTED, this._setOffline);
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATED, this._setOnline);
        this._connectionMessageSubscription = this._connection
            .messages()
            .subscribe((event) => {
            const message = event.message;
            if (message.activitySessionJoined && message.activitySessionJoined.activityId === this._id) {
                this._onSessionJoined(message.activitySessionJoined);
            }
            else if (message.activitySessionLeft && message.activitySessionLeft.activityId === this._id) {
                this._onSessionLeft(message.activitySessionLeft);
            }
            else if (message.activityStateUpdated && message.activityStateUpdated.activityId === this._id) {
                this._onRemoteStateUpdated(message.activityStateUpdated);
            }
            else {
            }
        });
    }
    session() {
        return this._connection.session();
    }
    id() {
        return this._id;
    }
    leave() {
        if (this.isJoined()) {
            this._joined = false;
            this._connection.send({
                activityLeaveRequest: { activityId: this._id }
            });
            const user = this._connection.session().user();
            const sessionId = this._connection.session().sessionId();
            const event = new ActivityLeftEvent(this, user, sessionId, true);
            this._emitEvent(event);
            this._connectionMessageSubscription.unsubscribe();
            this._completeEventStream();
        }
    }
    isJoined() {
        return this._joined;
    }
    state() {
        return this._localParticipant.state;
    }
    setState() {
        if (this.isJoined()) {
            let state;
            if (arguments.length === 1) {
                state = StringMap.coerceToMap(arguments[0]);
            }
            else if (arguments.length === 2) {
                state = new Map();
                state.set(arguments[0], arguments[1]);
            }
            if (state.size > 0) {
                this._sendStateUpdate(state, false, []);
                const oldValues = new Map();
                const newState = this.state();
                state.forEach((value, key) => {
                    oldValues.set(key, newState.get(key));
                    newState.set(key, value);
                });
                this._mutateLocalParticipant((local) => local.clone({ state: newState }));
                const session = this._connection.session();
                const deltaEvent = new ActivityStateDeltaEvent(this, session.user(), session.sessionId(), true, state, false, [], oldValues);
                this._emitEvent(deltaEvent);
                state.forEach((v, k) => {
                    const oldValue = oldValues.get(k);
                    const event = new ActivityStateSetEvent(this, session.user(), session.sessionId(), true, k, v, oldValue);
                    this._emitEvent(event);
                });
            }
        }
    }
    removeState(keys) {
        if (this.isJoined()) {
            if (TypeChecker.isString(keys)) {
                keys = [keys];
            }
            if (keys.length > 0) {
                this._sendStateUpdate(null, false, keys);
                const newState = this.state();
                const oldValues = new Map();
                keys.forEach(key => {
                    oldValues.set(key, newState.get(key));
                    newState.delete(key);
                });
                this._mutateLocalParticipant((local) => local.clone({ state: newState }));
                const session = this._connection.session();
                const deltaEvent = new ActivityStateDeltaEvent(this, session.user(), session.sessionId(), true, new Map(), false, keys, oldValues);
                this._emitEvent(deltaEvent);
                keys.forEach(key => {
                    const oldValue = oldValues.get(key);
                    const event = new ActivityStateRemovedEvent(this, session.user(), session.sessionId(), true, key, oldValue);
                    this._emitEvent(event);
                });
            }
        }
    }
    clearState() {
        if (this.isJoined()) {
            if (this._localParticipant.state.size > 0) {
                this._sendStateUpdate(new Map(), true, null);
                const oldValues = this.state();
                this._mutateLocalParticipant((local) => local.clone({ state: new Map() }));
                const session = this._connection.session();
                const deltaEvent = new ActivityStateDeltaEvent(this, session.user(), session.sessionId(), true, new Map(), true, [], oldValues);
                this._emitEvent(deltaEvent);
                const clearedEvent = new ActivityStateClearedEvent(this, session.user(), session.sessionId(), true, oldValues);
                this._emitEvent(clearedEvent);
            }
        }
    }
    participant(sessionId) {
        return this._participants.getValue().get(sessionId);
    }
    participants() {
        return Array.from(this._participants.getValue().values());
    }
    participantsAsObservable() {
        return this._participants
            .asObservable()
            .pipe(Object(external_rxjs_operators_["map"])(mappedValues => Array.from(mappedValues.values())));
    }
    _join(options) {
        if (this._joinPromise === null) {
            options = options || {};
            const deferred = new Deferred_Deferred();
            const initialState = options.state ?
                StringMap.coerceToMap(options.state) :
                new Map();
            if (this._connection.isOnline()) {
                this._joinWhileOnline(deferred, initialState);
            }
            else {
                this._joinWhileOffline(deferred, initialState);
            }
            this._joinPromise = deferred.promise();
        }
    }
    _whenJoined() {
        return this._joinPromise;
    }
    _onSessionJoined(joined) {
        const user = this._identityCache.getUserForSession(joined.sessionId);
        const state = mapObjectValues(getOrDefaultObject(joined.state), protoValueToJson);
        const participant = new ActivityParticipant_ActivityParticipant(this, user, joined.sessionId, false, StringMap.objectToMap(state));
        this._mutateParticipants((participants) => participants.set(participant.sessionId, participant));
        this._emitParticipantJoined(participant);
    }
    _emitParticipantJoined(participant) {
        const event = new ActivitySessionJoinedEvent(this, participant.user, participant.sessionId, false, participant);
        this._emitEvent(event);
    }
    _onSessionLeft(left) {
        const participant = this._participants.getValue().get(left.sessionId);
        this._emitParticipantLeft(participant);
        this._mutateParticipants((participants) => participants.delete(participant.sessionId));
    }
    _emitParticipantLeft(participant) {
        const event = new ActivitySessionLeftEvent(this, participant.user, participant.sessionId, participant.local);
        this._emitEvent(event);
    }
    _onRemoteStateUpdated(updated) {
        const sessionId = getOrDefaultString(updated.sessionId);
        const set = StringMap.objectToMap(getOrDefaultObject(updated.set));
        const complete = getOrDefaultBoolean(updated.complete);
        const removedKeys = getOrDefaultArray(updated.removed);
        if (complete) {
            if (set.size === 0) {
                this._handleStateCleared(sessionId);
            }
            else {
                this._handleStateReplaced(sessionId, set);
            }
        }
        else {
            if (removedKeys.length > 0) {
                this._handleStateRemoved(sessionId, removedKeys);
            }
            if (set.size > 0) {
                this._handleStateSet(sessionId, set);
            }
        }
    }
    _handleStateSet(sessionId, stateSet) {
        const user = this._identityCache.getUserForSession(sessionId);
        const mapped = new Map();
        stateSet.forEach((protoValue, key) => {
            const value = protoValueToJson(protoValue);
            mapped.set(key, value);
        });
        const oldValues = new Map();
        this._mutateParticipants((participants) => {
            const existing = participants.get(sessionId);
            const state = new Map(existing.state);
            mapped.forEach((value, key) => {
                oldValues.set(key, state.get(key));
                state.set(key, value);
            });
            participants.set(sessionId, existing.clone({ state }));
        });
        const deltaEvent = new ActivityStateDeltaEvent(this, user, sessionId, true, mapped, false, [], oldValues);
        this._emitEvent(deltaEvent);
        mapped.forEach((v, k) => {
            const oldValue = oldValues.get(k);
            const event = new ActivityStateSetEvent(this, user, sessionId, false, k, v, oldValue);
            this._emitEvent(event);
        });
    }
    _handleStateReplaced(sessionId, state) {
        const user = this._identityCache.getUserForSession(sessionId);
        const newState = new Map();
        Object.keys(state).forEach(key => {
            const value = protoValueToJson(state[key]);
            newState.set(key, value);
        });
        const oldValues = this._participants.getValue().get(sessionId).state;
        this._mutateParticipants((participants) => {
            const existing = participants.get(sessionId);
            participants.set(sessionId, existing.clone({ state: newState }));
        });
        const removed = [];
        oldValues.forEach((value, key) => {
            if (!newState.has(key)) {
                removed.push(key);
            }
        });
        const deltaEvent = new ActivityStateDeltaEvent(this, user, sessionId, true, newState, false, removed, oldValues);
        this._emitEvent(deltaEvent);
        removed.forEach((key) => {
            const oldValue = oldValues.get(key);
            const event = new ActivityStateRemovedEvent(this, user, sessionId, false, key, oldValue);
            this._emitEvent(event);
        });
        newState.forEach((v, k) => {
            const oldValue = oldValues.get(k);
            const event = new ActivityStateSetEvent(this, user, sessionId, false, k, v, oldValue);
            this._emitEvent(event);
        });
    }
    _handleStateCleared(sessionId) {
        const user = this._identityCache.getUserForSession(sessionId);
        const oldValues = this._participants.getValue().get(sessionId).state;
        this._mutateParticipants((participants) => {
            const existing = participants.get(sessionId);
            const state = new Map();
            participants.set(sessionId, existing.clone({ state }));
        });
        const deltaEvent = new ActivityStateDeltaEvent(this, user, sessionId, true, new Map(), true, [], oldValues);
        this._emitEvent(deltaEvent);
        const event = new ActivityStateClearedEvent(this, user, sessionId, false, oldValues);
        this._emitEvent(event);
    }
    _handleStateRemoved(sessionId, keys) {
        const user = this._identityCache.getUserForSession(sessionId);
        const oldValues = new Map();
        this._mutateParticipants((participants) => {
            const existing = participants.get(sessionId);
            const state = new Map(existing.state);
            keys.forEach((key) => {
                oldValues.set(key, state.get(key));
                state.delete(key);
            });
            participants.set(sessionId, existing.clone({ state }));
        });
        const deltaEvent = new ActivityStateDeltaEvent(this, user, sessionId, true, new Map(), false, keys, oldValues);
        this._emitEvent(deltaEvent);
        keys.forEach((key) => {
            const oldValue = oldValues.get(key);
            const event = new ActivityStateRemovedEvent(this, user, sessionId, false, key, oldValue);
            this._emitEvent(event);
        });
    }
    _mutateParticipants(mutator) {
        const participants = new Map(this._participants.getValue());
        mutator(participants);
        this._participants.next(participants);
    }
    _mutateLocalParticipant(mutator) {
        this._mutateParticipants(participants => {
            this._localParticipant = mutator(this._localParticipant);
            participants.set(this._localParticipant.sessionId, this._localParticipant);
        });
    }
    _joinWhileOnline(deferred, initialState) {
        const mappedState = mapObjectValues(StringMap.mapToObject(initialState), jsonToProtoValue);
        const message = {
            activityJoinRequest: {
                activityId: this._id,
                state: mappedState
            }
        };
        this._connection
            .request(message)
            .then((response) => {
            const joinResponse = response.activityJoinResponse;
            const localSessionId = this._connection.session().sessionId();
            const participants = new Map();
            const responseState = getOrDefaultObject(joinResponse.state);
            objectForEach(responseState, (sessionId) => {
                const activityState = responseState[sessionId] || {};
                const user = this._identityCache.getUserForSession(sessionId);
                const local = sessionId === localSessionId;
                const rawState = getOrDefaultObject(activityState.state);
                const jsonState = mapObjectValues(rawState, protoValueToJson);
                const stateMap = StringMap.objectToMap(jsonState);
                const participant = new ActivityParticipant_ActivityParticipant(this, user, sessionId, local, stateMap);
                participants.set(sessionId, participant);
            });
            if (this._localParticipant !== undefined) {
                this._emitParticipantLeft(this._localParticipant);
                const joinedLocalParticipant = participants.get(localSessionId);
                const updatedJoinedLocalParticipant = joinedLocalParticipant.clone({ state: this._localParticipant.state });
                this._syncStateAfterJoinOnline(joinedLocalParticipant.state, this._localParticipant.state);
                participants.set(localSessionId, updatedJoinedLocalParticipant);
            }
            this._localParticipant = participants.get(localSessionId);
            participants.forEach(p => this._emitParticipantJoined(p));
            this._participants.next(participants);
            deferred.resolve();
        })
            .catch(e => {
            deferred.reject(e);
        });
    }
    _syncStateAfterJoinOnline(serverState, localState) {
        const removedKeys = [];
        serverState.forEach((value, key) => {
            if (!localState.has(key)) {
                removedKeys.push(key);
            }
        });
        const updated = new Map();
        localState.forEach((value, key) => {
            if (!EqualsUtil.deepEquals(!serverState.get(key), value)) {
                updated.set(key, value);
            }
        });
        if (removedKeys.length > 0 || updated.size > 0) {
            this._sendStateUpdate(updated, false, removedKeys);
        }
    }
    _joinWhileOffline(deferred, initialState) {
        const session = this._connection.session();
        this._localParticipant =
            new ActivityParticipant_ActivityParticipant(undefined, session.user(), session.sessionId(), true, initialState);
        const participants = new Map();
        participants.set(this._localParticipant.sessionId, this._localParticipant);
        this._participants.next(participants);
        deferred.resolve();
    }
    _sendStateUpdate(state, complete, removedKeys) {
        const set = state !== null ? mapObjectValues(StringMap.mapToObject(state), jsonToProtoValue) : {};
        const removed = removedKeys !== null ? removedKeys : [];
        if (this._connection.isOnline()) {
            const message = {
                activityUpdateState: { activityId: this._id, set, complete, removed }
            };
            this._connection.send(message);
        }
    }
}
Activity_Activity.Events = {
    SESSION_JOINED: ActivitySessionJoinedEvent.EVENT_NAME,
    SESSION_LEFT: ActivitySessionLeftEvent.EVENT_NAME,
    STATE_SET: ActivityStateSetEvent.EVENT_NAME,
    STATE_CLEARED: ActivityStateClearedEvent.EVENT_NAME,
    STATE_REMOVED: ActivityStateRemovedEvent.EVENT_NAME,
    STATE_DELTA: ActivityStateRemovedEvent.EVENT_NAME,
    LEFT: ActivityLeftEvent.EVENT_NAME
};
Object.freeze(Activity_Activity.Events);

// CONCATENATED MODULE: ./src/main/activity/ActivityService.ts





class ActivityService_ActivityService extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(connection, identityCache) {
        super();
        this._logger = Logging.logger("activities.service");
        this._connection = connection;
        this._identityCache = identityCache;
        this._joinedActivities = new Map();
    }
    session() {
        return this._connection.session();
    }
    join(id, options) {
        let activity = this._joinedActivities.get(id);
        if (activity === undefined) {
            activity = new Activity_Activity(id, this._identityCache, this._connection);
            this._joinedActivities.set(id, activity);
            const activityEvents = activity
                .events()
                .pipe(Object(external_rxjs_operators_["filter"])((evt) => evt.name === ActivityLeftEvent.EVENT_NAME), Object(external_rxjs_operators_["tap"])(() => this._onActivityLeave(id)));
            activity._join(options);
            activity._whenJoined()
                .then(() => {
                this._emitFrom(activityEvents);
                return Promise.resolve(activity);
            })
                .catch(error => {
                this._joinedActivities.delete(id);
                return Promise.reject(error);
            });
        }
        return activity._whenJoined().then(() => activity);
    }
    joined() {
        return new Map(this._joinedActivities);
    }
    isJoined(id) {
        return this._joinedActivities.has(id);
    }
    _onActivityLeave(id) {
        this._joinedActivities.delete(id);
    }
}

// CONCATENATED MODULE: ./src/main/activity/index.ts





// CONCATENATED MODULE: ./src/main/presence/UserPresence.ts

class UserPresence_UserPresence {
    constructor(user, available, state) {
        this.user = user;
        this.available = available;
        this._state = deepClone(state);
        Object.freeze(this);
    }
    get state() {
        return deepClone(this._state);
    }
}

// CONCATENATED MODULE: ./src/main/presence/events/PresenceAvailabilityChangedEvent.ts
class PresenceAvailabilityChangedEvent {
    constructor(user, available) {
        this.user = user;
        this.available = available;
        this.name = PresenceAvailabilityChangedEvent.NAME;
        Object.freeze(this);
    }
}
PresenceAvailabilityChangedEvent.NAME = "availability_changed";

// CONCATENATED MODULE: ./src/main/presence/events/PresenceStateClearedEvent.ts
class PresenceStateClearedEvent {
    constructor(user) {
        this.user = user;
        this.name = PresenceStateClearedEvent.NAME;
        Object.freeze(this);
    }
}
PresenceStateClearedEvent.NAME = "state_cleared";

// CONCATENATED MODULE: ./src/main/presence/events/PresenceStateRemovedEvent.ts
class PresenceStateRemovedEvent {
    constructor(user, keys) {
        this.user = user;
        this.keys = keys;
        this.name = PresenceStateRemovedEvent.NAME;
        Object.freeze(this);
    }
}
PresenceStateRemovedEvent.NAME = "state_removed";

// CONCATENATED MODULE: ./src/main/presence/events/PresenceStateSetEvent.ts
class PresenceStateSetEvent {
    constructor(user, state) {
        this.user = user;
        this.state = state;
        this.name = PresenceStateSetEvent.NAME;
        Object.freeze(this);
    }
}
PresenceStateSetEvent.NAME = "state_set";

// CONCATENATED MODULE: ./src/main/presence/events/index.ts





// CONCATENATED MODULE: ./src/main/presence/UserPresenceSubscription.ts


class UserPresenceSubscription_UserPresenceSubscription extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(delegate) {
        super();
        this._manager = delegate;
        this._emitFrom(delegate.events());
    }
    get user() {
        return this._manager.user();
    }
    get available() {
        return this._manager.isAvailable();
    }
    get state() {
        return this._manager.state();
    }
    asObservable() {
        return this._manager.asObservable();
    }
    unsubscribe() {
        if (this._manager !== null) {
            this._manager.unsubscribe(this);
        }
        this._manager = null;
    }
}
UserPresenceSubscription_UserPresenceSubscription.Events = {
    STATE_SET: PresenceStateSetEvent.NAME,
    STATE_REMOVED: PresenceStateRemovedEvent.NAME,
    STATE_CLEARED: PresenceStateClearedEvent.NAME,
    AVAILABILITY_CHANGED: PresenceAvailabilityChangedEvent.NAME,
};

// CONCATENATED MODULE: ./src/main/presence/UserPresenceManager.ts








class UserPresenceManager_UserPresenceManager extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(initialPresence, eventStream, onUnsubscribe) {
        super();
        this._presence = new UserPresence_UserPresence(initialPresence.user, initialPresence.available, initialPresence.state);
        this._subscriptions = [];
        this._onUnsubscribe = onUnsubscribe;
        this._setStream(eventStream);
        this._subject = new external_rxjs_["BehaviorSubject"](this._presence);
    }
    user() {
        return this._presence.user;
    }
    isAvailable() {
        return this._presence.available;
    }
    state() {
        return this._presence.state;
    }
    asObservable() {
        return this._subject.asObservable();
    }
    subscribe() {
        const subscription = new UserPresenceSubscription_UserPresenceSubscription(this);
        this._subscriptions.push(subscription);
        return subscription;
    }
    unsubscribe(subscription) {
        this._subscriptions = this._subscriptions.filter(s => s !== subscription);
        if (this._subscriptions.length === 0) {
            this._messageSubscription.unsubscribe();
            this._subject.complete();
            this._onUnsubscribe(this.user().userId);
        }
    }
    availability(availability, emitSubject = true) {
        this._presence =
            new UserPresence_UserPresence(this._presence.user, availability, this._presence.state);
        const event = new PresenceAvailabilityChangedEvent(this._presence.user, availability);
        this._emitEvent(event);
        if (emitSubject) {
            this._subject.next(this._presence);
        }
    }
    set(state, emitSubject = true) {
        const newState = this._presence.state;
        state.forEach((v, k) => newState.set(k, deepClone(v)));
        this._presence = new UserPresence_UserPresence(this._presence.user, this._presence.available, newState);
        const event = new PresenceStateSetEvent(this._presence.user, newState);
        this._emitEvent(event);
        if (emitSubject) {
            this._subject.next(this._presence);
        }
    }
    remove(keys, emitSubject = true) {
        const newState = this._presence.state;
        keys.forEach(k => newState.delete(k));
        this._presence = new UserPresence_UserPresence(this._presence.user, this._presence.available, newState);
        const event = new PresenceStateRemovedEvent(this._presence.user, keys);
        this._emitEvent(event);
        if (emitSubject) {
            this._subject.next(this._presence);
        }
    }
    clear(emitSubject = true) {
        this._presence = new UserPresence_UserPresence(this._presence.user, this._presence.available, new Map());
        const event = new PresenceStateClearedEvent(this._presence.user);
        this._emitEvent(event);
        if (emitSubject) {
            this._subject.next(this._presence);
        }
    }
    hasKey(key) {
        return this._presence.state.has(key);
    }
    _setOnline(newPresence) {
        this.availability(newPresence.available, false);
        this.clear(false);
        this.set(newPresence.state);
        this._subject.next(newPresence);
    }
    _setStream(stream) {
        if (this._messageSubscription) {
            this._messageSubscription.unsubscribe();
        }
        this._messageSubscription = stream.subscribe(message => this._handleMessage(message));
    }
    _setOffline() {
        this.availability(false, false);
    }
    _handleMessage(messageEvent) {
        const message = messageEvent.message;
        if (message.presenceAvailabilityChanged) {
            const { available } = message.presenceAvailabilityChanged;
            this.availability(getOrDefaultBoolean(available));
        }
        else if (message.presenceStateSet) {
            const { state } = message.presenceStateSet;
            const jsonState = StringMap.objectToMap(mapObjectValues(getOrDefaultObject(state), protoValueToJson));
            this.set(jsonState);
        }
        else if (message.presenceStateCleared) {
            this.clear();
        }
        else if (message.presenceStateRemoved) {
            const { keys } = message.presenceStateRemoved;
            this.remove(getOrDefaultArray(keys));
        }
    }
}

// CONCATENATED MODULE: ./src/main/presence/PresenceService.ts











class PresenceService_PresenceService extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(connection, identityCache, localUser) {
        super();
        this._logger = Logging.logger("connection");
        this._setOnline = () => {
            const localUser = this.session().user();
            const localStream = this._streamForUsername(localUser.userId);
            this._localManager._setStream(localStream);
            const resubscribe = [];
            this._subscribedManagers.forEach(manager => {
                resubscribe.push(manager.user().userId);
            });
            this._subscribeToServer(resubscribe)
                .then((userPresences) => {
                userPresences.forEach(userPresence => {
                    const manager = this._getManager(userPresence.user.userId);
                    if (manager) {
                        manager._setOnline(userPresence);
                    }
                });
            })
                .catch((error) => {
                this._logger.error("Error resubscribing to presence", error);
            });
        };
        this._setOffline = () => {
            this._localManager._setOffline();
            this._subscribedManagers.forEach((manager) => {
                manager._setOffline();
            });
        };
        this._connection = connection;
        this._identityCache = identityCache;
        this._subscribedManagers = new Map();
        this._messageStream = this._connection.messages().pipe(Object(external_rxjs_operators_["share"])());
        const user = localUser !== undefined ? localUser : new DomainUser_DomainUser(DomainUserType.ANONYMOUS, "");
        const localStream = this._streamForUsername(user.userId);
        const initialPresence = new UserPresence_UserPresence(user, false, new Map());
        this._localManager = new UserPresenceManager_UserPresenceManager(initialPresence, localStream, () => {
        });
        this._localPresence = this._localManager.subscribe();
        this._emitFrom(this._localPresence.events());
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.INTERRUPTED, this._setOffline);
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.DISCONNECTED, this._setOffline);
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATED, this._setOnline);
    }
    session() {
        return this._connection.session();
    }
    isAvailable() {
        return this._localPresence.available;
    }
    setState() {
        let state;
        if (arguments.length === 1) {
            state = StringMap.objectToMap(arguments[0]);
        }
        else if (arguments.length === 2) {
            state = new Map();
            state.set(arguments[0], arguments[1]);
        }
        else if (arguments.length === 0) {
            return;
        }
        this._localManager.set(state);
        if (this._connection.isOnline()) {
            const message = {
                presenceSetState: {
                    state: mapObjectValues(StringMap.mapToObject(state), jsonToProtoValue)
                }
            };
            this._connection.send(message);
        }
    }
    removeState(keys) {
        const stateKeys = typeof keys === "string" ? [keys] : keys;
        const existingKeys = stateKeys.filter(k => this._localManager.hasKey(k));
        if (existingKeys.length > 0) {
            this._localManager.remove(existingKeys);
            if (this._connection.isOnline()) {
                const message = {
                    presenceRemoveState: {
                        keys: existingKeys
                    }
                };
                this._connection.send(message);
            }
        }
    }
    clearState() {
        this._localManager.clear();
        if (this._connection.isOnline()) {
            const message = {
                presenceClearState: {}
            };
            this._connection.send(message);
        }
    }
    state() {
        return this._localPresence.state;
    }
    presence(users) {
        this._connection.session().assertOnline();
        if (!Array.isArray(users)) {
            return this._get([DomainUserId.toDomainUserId(users)]).then(result => {
                return result[0];
            });
        }
        else {
            return this._get(users.map(DomainUserId.toDomainUserId));
        }
    }
    subscribe(users) {
        const requested = Array.isArray(users) ?
            users.map(DomainUserId.toDomainUserId) :
            [DomainUserId.toDomainUserId(users)];
        return this._subscribe(requested).then(() => {
            const subscriptions = requested.map(userId => this._subscribedManagers.get(userId.toGuid()).subscribe());
            if (!Array.isArray(users)) {
                return subscriptions[0];
            }
            else {
                return subscriptions;
            }
        });
    }
    _setInternalState(state) {
        this._localManager.clear(false);
        this._localManager.set(state);
    }
    _get(userIds) {
        const users = userIds.map(domainUserIdToProto);
        const message = {
            presenceRequest: {
                users
            }
        };
        return this._connection.request(message).then((response) => {
            const { userPresences } = response.presenceResponse;
            return getOrDefaultArray(userPresences).map(p => {
                return this._mapUserPresence(p);
            });
        });
    }
    _streamForUsername(user) {
        return this._messageStream.pipe(Object(external_rxjs_operators_["filter"])(e => {
            const message = e.message;
            const incomingUserIdData = (message.presenceAvailabilityChanged && message.presenceAvailabilityChanged.user) ||
                (message.presenceStateSet && message.presenceStateSet.user) ||
                (message.presenceStateRemoved && message.presenceStateRemoved.user) ||
                (message.presenceStateCleared && message.presenceStateCleared.user);
            return incomingUserIdData && protoToDomainUserId(incomingUserIdData).equals(user);
        }));
    }
    _subscribe(users) {
        const notSubscribed = users.filter(userId => {
            return this._subscribedManagers.get(userId.toGuid()) === undefined;
        });
        if (notSubscribed.length > 0) {
            return this._subscribeToServer(notSubscribed).then(userPresences => {
                userPresences.forEach(userPresence => {
                    const guid = userPresence.user.userId.toGuid();
                    const stream = this._streamForUsername(userPresence.user.userId);
                    const unsubscribe = (userId) => this._unsubscribe(userId);
                    const manager = new UserPresenceManager_UserPresenceManager(userPresence, stream, unsubscribe);
                    this._subscribedManagers.set(guid, manager);
                });
                return;
            });
        }
        else {
            return Promise.resolve();
        }
    }
    _subscribeToServer(users) {
        const message = {
            presenceSubscribeRequest: {
                users: users.map(domainUserIdToProto)
            }
        };
        return this._connection.request(message).then((response) => {
            const { userPresences } = response.presenceSubscribeResponse;
            return getOrDefaultArray(userPresences).map(presence => this._mapUserPresence(presence));
        });
    }
    _unsubscribe(userId) {
        if (this._connection.isOnline()) {
            const message = {
                presenceUnsubscribe: {
                    users: [domainUserIdToProto(userId)]
                }
            };
            this._connection.send(message);
        }
        const guid = userId.toGuid();
        this._subscribedManagers.delete(guid);
    }
    _mapUserPresence(p) {
        const user = this._identityCache.getUser(protoToDomainUserId(p.user));
        const available = getOrDefaultBoolean(p.available);
        const state = StringMap.objectToMap(mapObjectValues(getOrDefaultObject(p.state), protoValueToJson));
        return new UserPresence_UserPresence(user, available, state);
    }
    _getManager(userId) {
        return userId.equals(this._localManager.user().userId) ?
            this._localManager :
            this._subscribedManagers.get(userId.toGuid());
    }
}
PresenceService_PresenceService.Events = {
    STATE_SET: PresenceStateSetEvent.NAME,
    STATE_REMOVED: PresenceStateRemovedEvent.NAME,
    STATE_CLEARED: PresenceStateClearedEvent.NAME,
    AVAILABILITY_CHANGED: PresenceAvailabilityChangedEvent.NAME
};
Object.freeze(PresenceService_PresenceService.Events);

// CONCATENATED MODULE: ./src/main/presence/index.ts





// CONCATENATED MODULE: ./src/main/chat/events/ChatEvent.ts
class ChatEvent {
    constructor(_chatId, _eventNumber, _timestamp, _user) {
        this.chatId = _chatId;
        this.eventNumber = _eventNumber;
        this.timestamp = _timestamp;
        this.user = _user;
    }
}

// CONCATENATED MODULE: ./src/main/chat/events/ChatJoinedEvent.ts
class ChatJoinedEvent {
    constructor(chatId) {
        this.chatId = chatId;
        this.name = ChatJoinedEvent.NAME;
        Object.freeze(this);
    }
}
ChatJoinedEvent.NAME = "joined";

// CONCATENATED MODULE: ./src/main/chat/events/ChatLeftEvent.ts
class ChatLeftEvent {
    constructor(chatId) {
        this.chatId = chatId;
        this.name = ChatLeftEvent.NAME;
        Object.freeze(this);
    }
}
ChatLeftEvent.NAME = "left";

// CONCATENATED MODULE: ./src/main/chat/events/ChatMessageEvent.ts

class ChatMessageEvent_ChatMessageEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user, sessionId, message) {
        super(chatId, eventNumber, timestamp, user);
        this.sessionId = sessionId;
        this.message = message;
        this.name = ChatMessageEvent_ChatMessageEvent.NAME;
        Object.freeze(this);
    }
}
ChatMessageEvent_ChatMessageEvent.NAME = "message";

// CONCATENATED MODULE: ./src/main/chat/events/ChatNameChangedEvent.ts

class ChatNameChangedEvent_ChatNameChangedEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user, chatName) {
        super(chatId, eventNumber, timestamp, user);
        this.chatName = chatName;
        this.name = ChatNameChangedEvent_ChatNameChangedEvent.NAME;
        Object.freeze(this);
    }
}
ChatNameChangedEvent_ChatNameChangedEvent.NAME = "name_changed";

// CONCATENATED MODULE: ./src/main/chat/events/ChatRemovedEvent.ts
class ChatRemovedEvent {
    constructor(chatId) {
        this.chatId = chatId;
        this.name = ChatRemovedEvent.NAME;
        Object.freeze(this);
    }
}
ChatRemovedEvent.NAME = "removed";

// CONCATENATED MODULE: ./src/main/chat/events/ChatTopicChangedEvent.ts

class ChatTopicChangedEvent_ChatTopicChangedEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user, topic) {
        super(chatId, eventNumber, timestamp, user);
        this.topic = topic;
        this.name = ChatTopicChangedEvent_ChatTopicChangedEvent.NAME;
        Object.freeze(this);
    }
}
ChatTopicChangedEvent_ChatTopicChangedEvent.NAME = "topic_changed";

// CONCATENATED MODULE: ./src/main/chat/events/UserAddedEvent.ts

class UserAddedEvent_UserAddedEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user, addedUser) {
        super(chatId, eventNumber, timestamp, user);
        this.addedUser = addedUser;
        this.name = UserAddedEvent_UserAddedEvent.NAME;
        Object.freeze(this);
    }
}
UserAddedEvent_UserAddedEvent.NAME = "user_added";

// CONCATENATED MODULE: ./src/main/chat/events/UserJoinedEvent.ts

class UserJoinedEvent_UserJoinedEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user) {
        super(chatId, eventNumber, timestamp, user);
        this.name = UserJoinedEvent_UserJoinedEvent.NAME;
        Object.freeze(this);
    }
}
UserJoinedEvent_UserJoinedEvent.NAME = "user_joined";

// CONCATENATED MODULE: ./src/main/chat/events/UserLeftEvent.ts

class UserLeftEvent_UserLeftEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user) {
        super(chatId, eventNumber, timestamp, user);
        this.name = UserLeftEvent_UserLeftEvent.NAME;
        Object.freeze(this);
    }
}
UserLeftEvent_UserLeftEvent.NAME = "user_left";

// CONCATENATED MODULE: ./src/main/chat/events/UserRemovedEvent.ts

class UserRemovedEvent_UserRemovedEvent extends ChatEvent {
    constructor(chatId, eventNumber, timestamp, user, removedUser) {
        super(chatId, eventNumber, timestamp, user);
        this.removedUser = removedUser;
        this.name = UserRemovedEvent_UserRemovedEvent.NAME;
        Object.freeze(this);
    }
}
UserRemovedEvent_UserRemovedEvent.NAME = "user_removed";

// CONCATENATED MODULE: ./src/main/chat/events/index.ts












// CONCATENATED MODULE: ./src/main/chat/ChatMessageProcessor.ts



function isChatMessage(message) {
    return !!message.remoteChatMessage ||
        !!message.userJoinedChat ||
        !!message.userLeftChat ||
        !!message.userAddedToChatChannel ||
        !!message.userRemovedFromChatChannel ||
        !!message.chatRemoved ||
        !!message.chatNameChanged ||
        !!message.chatTopicChanged;
}
function processChatMessage(message, identityCache) {
    if (message.userJoinedChat) {
        const userJoined = message.userJoinedChat;
        return new UserJoinedEvent_UserJoinedEvent(userJoined.chatId, getOrDefaultNumber(userJoined.eventNumber), timestampToDate(userJoined.timestamp), identityCache.getUser(protoToDomainUserId(userJoined.user)));
    }
    else if (message.userLeftChat) {
        const userLeft = message.userLeftChat;
        return new UserLeftEvent_UserLeftEvent(userLeft.chatId, getOrDefaultNumber(userLeft.eventNumber), timestampToDate(userLeft.timestamp), identityCache.getUser(protoToDomainUserId(userLeft.user)));
    }
    else if (message.userAddedToChatChannel) {
        const userAdded = message.userAddedToChatChannel;
        return new UserAddedEvent_UserAddedEvent(userAdded.chatId, getOrDefaultNumber(userAdded.eventNumber), timestampToDate(userAdded.timestamp), identityCache.getUser(protoToDomainUserId(userAdded.user)), identityCache.getUser(protoToDomainUserId(userAdded.addedUser)));
    }
    else if (message.userRemovedFromChatChannel) {
        const userRemoved = message.userRemovedFromChatChannel;
        return new UserRemovedEvent_UserRemovedEvent(userRemoved.chatId, getOrDefaultNumber(userRemoved.eventNumber), timestampToDate(userRemoved.timestamp), identityCache.getUser(protoToDomainUserId(userRemoved.user)), identityCache.getUser(protoToDomainUserId(userRemoved.removedUser)));
    }
    else if (message.chatRemoved) {
        const removedMsg = message.chatRemoved;
        return new ChatRemovedEvent(removedMsg.chatId);
    }
    else if (message.chatNameChanged) {
        const nameSet = message.chatNameChanged;
        return new ChatNameChangedEvent_ChatNameChangedEvent(nameSet.chatId, getOrDefaultNumber(nameSet.eventNumber), timestampToDate(nameSet.timestamp), identityCache.getUser(protoToDomainUserId(nameSet.user)), getOrDefaultString(nameSet.name));
    }
    else if (message.chatTopicChanged) {
        const topicSet = message.chatTopicChanged;
        return new ChatTopicChangedEvent_ChatTopicChangedEvent(topicSet.chatId, getOrDefaultNumber(topicSet.eventNumber), timestampToDate(topicSet.timestamp), identityCache.getUser(protoToDomainUserId(topicSet.user)), getOrDefaultString(topicSet.topic));
    }
    else if (message.remoteChatMessage) {
        const chatMsg = message.remoteChatMessage;
        return new ChatMessageEvent_ChatMessageEvent(chatMsg.chatId, getOrDefaultNumber(chatMsg.eventNumber), timestampToDate(chatMsg.timestamp), identityCache.getUserForSession(chatMsg.sessionId), chatMsg.sessionId, getOrDefaultString(chatMsg.message));
    }
    else {
        throw new ConvergenceError("Invalid chat event");
    }
}

// CONCATENATED MODULE: ./src/main/chat/history/ChatHistoryEntry.ts

class ChatHistoryEntry {
    constructor(_type, _chatId, _eventNumber, _timestamp, _user) {
        this.type = _type;
        this.chatId = _chatId;
        this.eventNumber = _eventNumber;
        this.timestamp = _timestamp;
        this.user = _user;
    }
}
ChatHistoryEntry.TYPES = {
    CREATED: "created",
    MESSAGE: "message",
    USER_JOINED: "user_joined",
    USER_LEFT: "user_left",
    USER_ADDED: "user_added",
    USER_REMOVED: "user_removed",
    NAME_CHANGED: "name_changed",
    TOPIC_CHANGED: "topic_changed"
};
Immutable.make(ChatHistoryEntry.TYPES);

// CONCATENATED MODULE: ./src/main/chat/history/ChannelCreatedHistoryEntry.ts


class ChannelCreatedHistoryEntry_ChannelCreatedHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user, name, topic, members) {
        super(ChannelCreatedHistoryEntry_ChannelCreatedHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        this.name = name;
        this.topic = topic;
        this.members = members;
        Immutable.make(this);
    }
}
ChannelCreatedHistoryEntry_ChannelCreatedHistoryEntry.TYPE = ChatHistoryEntry.TYPES.CREATED;

// CONCATENATED MODULE: ./src/main/chat/history/MessageChatHistoryEntry.ts


class MessageChatHistoryEntry_MessageChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user, message) {
        super(MessageChatHistoryEntry_MessageChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        this.message = message;
        Immutable.make(this);
    }
}
MessageChatHistoryEntry_MessageChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.MESSAGE;

// CONCATENATED MODULE: ./src/main/chat/history/UserAddedChatHistoryEntry.ts


class UserAddedChatHistoryEntry_UserAddedChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user, addedUser) {
        super(UserAddedChatHistoryEntry_UserAddedChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        this.addedUser = addedUser;
        Immutable.make(this);
    }
}
UserAddedChatHistoryEntry_UserAddedChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.USER_ADDED;

// CONCATENATED MODULE: ./src/main/chat/history/UserRemovedChatHistoryEntry.ts


class UserRemovedChatHistoryEntry_UserRemovedChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user, removedUser) {
        super(UserRemovedChatHistoryEntry_UserRemovedChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        this.removedUser = removedUser;
        Immutable.make(this);
    }
}
UserRemovedChatHistoryEntry_UserRemovedChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.USER_REMOVED;

// CONCATENATED MODULE: ./src/main/chat/history/UserJoinedChatHistoryEntry.ts


class UserJoinedChatHistoryEntry_UserJoinedChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user) {
        super(UserJoinedChatHistoryEntry_UserJoinedChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        Immutable.make(this);
    }
}
UserJoinedChatHistoryEntry_UserJoinedChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.USER_JOINED;

// CONCATENATED MODULE: ./src/main/chat/history/UserLeftChatHistoryEntry.ts


class UserLeftChatHistoryEntry_UserLeftChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user) {
        super(UserLeftChatHistoryEntry_UserLeftChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        Immutable.make(this);
    }
}
UserLeftChatHistoryEntry_UserLeftChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.USER_LEFT;

// CONCATENATED MODULE: ./src/main/chat/history/NameChangedChatHistoryEntry.ts


class NameChangedChatHistoryEntry_NameChangedChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user, name) {
        super(NameChangedChatHistoryEntry_NameChangedChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        this.name = name;
        Immutable.make(this);
    }
}
NameChangedChatHistoryEntry_NameChangedChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.NAME_CHANGED;

// CONCATENATED MODULE: ./src/main/chat/history/TopicChangedChatHistoryEntry.ts


class TopicChangedChatHistoryEntry_TopicChangedChatHistoryEntry extends ChatHistoryEntry {
    constructor(chatId, eventNumber, timestamp, user, topic) {
        super(TopicChangedChatHistoryEntry_TopicChangedChatHistoryEntry.TYPE, chatId, eventNumber, timestamp, user);
        this.topic = topic;
        Immutable.make(this);
    }
}
TopicChangedChatHistoryEntry_TopicChangedChatHistoryEntry.TYPE = ChatHistoryEntry.TYPES.TOPIC_CHANGED;

// CONCATENATED MODULE: ./src/main/chat/history/ChatHistoryEventMapper.ts










class ChatHistoryEventMapper_ChatHistoryEventMapper {
    static toChatHistoryEntry(data, identityCache) {
        if (data.created) {
            const { chatId, eventNumber, timestamp, user, name, topic, members } = data.created;
            const memberUsers = getOrDefaultArray(members).map(userId => identityCache.getUser(protoToDomainUserId(userId)));
            return new ChannelCreatedHistoryEntry_ChannelCreatedHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)), name, topic, memberUsers);
        }
        else if (data.message) {
            const { chatId, eventNumber, timestamp, user, message } = data.message;
            return new MessageChatHistoryEntry_MessageChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)), message);
        }
        else if (data.userAdded) {
            const { chatId, eventNumber, timestamp, user, addedUser } = data.userAdded;
            return new UserAddedChatHistoryEntry_UserAddedChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)), identityCache.getUser(protoToDomainUserId(addedUser)));
        }
        else if (data.userRemoved) {
            const { chatId, eventNumber, timestamp, user, removedUser } = data.userRemoved;
            return new UserRemovedChatHistoryEntry_UserRemovedChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)), identityCache.getUser(protoToDomainUserId(removedUser)));
        }
        else if (data.userJoined) {
            const { chatId, eventNumber, timestamp, user } = data.userJoined;
            return new UserJoinedChatHistoryEntry_UserJoinedChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)));
        }
        else if (data.userLeft) {
            const { chatId, eventNumber, timestamp, user } = data.userLeft;
            return new UserLeftChatHistoryEntry_UserLeftChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)));
        }
        else if (data.topicChanged) {
            const { chatId, eventNumber, timestamp, user, topic } = data.topicChanged;
            return new TopicChangedChatHistoryEntry_TopicChangedChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)), getOrDefaultString(topic));
        }
        else if (data.nameChanged) {
            const { chatId, eventNumber, timestamp, user, name } = data.nameChanged;
            return new NameChangedChatHistoryEntry_NameChangedChatHistoryEntry(chatId, getOrDefaultNumber(eventNumber), timestampToDate(timestamp), identityCache.getUser(protoToDomainUserId(user)), getOrDefaultString(name));
        }
        else {
            throw new ConvergenceError("Invalid chat event: " + JSON.stringify(data));
        }
    }
}

// CONCATENATED MODULE: ./src/main/chat/ChatInfo.ts

var ChatTypes;
(function (ChatTypes) {
    ChatTypes["DIRECT"] = "direct";
    ChatTypes["CHANNEL"] = "channel";
    ChatTypes["ROOM"] = "room";
})(ChatTypes || (ChatTypes = {}));
function createChatInfo(session, identityCache, chatData) {
    let maxEvent = -1;
    const localUserId = session.user().userId;
    const members = chatData.members.map(member => {
        const userId = protoToDomainUserId(member.user);
        if (userId.equals(localUserId)) {
            maxEvent = getOrDefaultNumber(member.maxSeenEventNumber);
        }
        const user = identityCache.getUser(userId);
        return { user, maxSeenEventNumber: getOrDefaultNumber(member.maxSeenEventNumber) };
    });
    return {
        chatId: chatData.id,
        chatType: chatData.chatType,
        membership: chatData.membership,
        name: chatData.name,
        topic: chatData.topic,
        createdTime: timestampToDate(chatData.createdTime),
        lastEventTime: timestampToDate(chatData.lastEventTime),
        lastEventNumber: getOrDefaultNumber(chatData.lastEventNumber),
        maxSeenEventNumber: maxEvent,
        members
    };
}

// CONCATENATED MODULE: ./src/main/chat/Chat.ts







const Events = {
    MESSAGE: ChatMessageEvent_ChatMessageEvent.NAME,
    USER_JOINED: UserJoinedEvent_UserJoinedEvent.NAME,
    USER_LEFT: UserLeftEvent_UserLeftEvent.NAME,
    USER_ADDED: UserAddedEvent_UserAddedEvent.NAME,
    USER_REMOVED: UserRemovedEvent_UserRemovedEvent.NAME,
};
Object.freeze(Events);
class Chat_Chat extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(connection, identityCache, messageStream, chatInfo) {
        super();
        this._connection = connection;
        this._identityCache = identityCache;
        this._info = chatInfo;
        this._calculateJoinedState();
        messageStream.subscribe(event => {
            this._processEvent(event);
            this._emitEvent(event);
        });
    }
    session() {
        return this._connection.session();
    }
    info() {
        return Object.assign({}, this._info);
    }
    isJoined() {
        return this._joined;
    }
    send(message) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            publishChatMessageRequest: {
                chatId: this._info.chatId,
                message
            }
        }).then(() => undefined);
    }
    setName(name) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            setChatNameRequest: {
                chatId: this._info.chatId,
                name
            }
        }).then(() => undefined);
    }
    setTopic(topic) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            setChatTopicRequest: {
                chatId: this._info.chatId,
                topic
            }
        }).then(() => undefined);
    }
    markSeen(eventNumber) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            markChatEventsSeenRequest: {
                chatId: this._info.chatId,
                eventNumber
            }
        }).then(() => undefined);
    }
    getHistory(options) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            getChatHistoryRequest: {
                chatId: this._info.chatId,
                startEvent: toOptional(options.startEvent),
                limit: toOptional(options.limit),
                forward: toOptional(options.forward),
                eventFilter: options.eventFilter
            }
        }).then((message) => {
            const response = message.getChatHistoryResponse;
            return getOrDefaultArray(response.eventData)
                .map(data => ChatHistoryEventMapper_ChatHistoryEventMapper.toChatHistoryEntry(data, this._identityCache));
        });
    }
    _updateWithData(chatData) {
        this._info = createChatInfo(this._connection.session(), this._identityCache, chatData);
        this._calculateJoinedState();
    }
    _join() {
        return this._connection.request({
            joinChatRequest: {
                chatId: this._info.chatId
            }
        }).then((response) => {
            const { joinChatResponse } = response;
            this._updateWithData(joinChatResponse.chatInfo);
        });
    }
    _assertJoined() {
        if (!this.isJoined()) {
            const message = `Chat channel not joined: ${this._info.chatId}`;
            throw new ConvergenceError(message, ConvergenceErrorCodes.CHAT_NOT_JOINED);
        }
    }
    _processEvent(event) {
        if (event instanceof ChatEvent) {
            this._info = Object.assign(Object.assign({}, this._info), { lastEventNumber: event.eventNumber, lastEventTime: event.timestamp });
        }
        if (event instanceof UserJoinedEvent_UserJoinedEvent || event instanceof UserAddedEvent_UserAddedEvent) {
            const user = (event instanceof UserJoinedEvent_UserJoinedEvent) ? event.user : event.addedUser;
            const members = this._info.members.slice(0);
            const member = { user, maxSeenEventNumber: -1 };
            members.push(member);
            if (event.user.username === this.session().user().username) {
                this._joined = true;
            }
            this._info = Object.assign(Object.assign({}, this._info), { members });
        }
        else if (event instanceof UserLeftEvent_UserLeftEvent || event instanceof UserRemovedEvent_UserRemovedEvent) {
            const removedUser = (event instanceof UserLeftEvent_UserLeftEvent) ? event.user : event.removedUser;
            if (this.session().user().userId.equals(removedUser.userId)) {
                this._joined = false;
            }
            const members = this._info.members.filter(member => !member.user.userId.equals(removedUser.userId));
            this._info = Object.assign(Object.assign({}, this._info), { members });
        }
        else if (event instanceof ChatNameChangedEvent_ChatNameChangedEvent) {
            this._info = Object.assign(Object.assign({}, this._info), { name: event.chatName });
        }
        else if (event instanceof ChatTopicChangedEvent_ChatTopicChangedEvent) {
            this._info = Object.assign(Object.assign({}, this._info), { topic: event.topic });
        }
        Immutable.make(this._info);
    }
    _calculateJoinedState() {
        this._joined = this._info.members
            .map(m => m.user.userId)
            .findIndex(userId => this.session().user().userId.equals(userId)) >= 0;
    }
}
Chat_Chat.Events = Events;

// CONCATENATED MODULE: ./src/main/chat/DirectChat.ts

class DirectChat_DirectChat extends Chat_Chat {
    constructor(connection, identityCache, messageStream, info) {
        super(connection, identityCache, messageStream, info);
    }
    info() {
        const info = super.info();
        const localUserId = this.session().user().userId;
        const otherUsers = info.members.filter(member => !member.user.userId.equals(localUserId));
        return Object.assign(Object.assign({}, info), { otherUsers });
    }
}

// CONCATENATED MODULE: ./src/main/chat/MembershipChat.ts



class MembershipChat_MembershipChat extends Chat_Chat {
    constructor(connection, identityCache, messageStream, info) {
        super(connection, identityCache, messageStream, info);
    }
    info() {
        return super.info();
    }
    leave() {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            leaveChatRequest: {
                chatId: this._info.chatId
            }
        }).then(() => undefined);
    }
    remove(user) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            removeUserFromChatChannelRequest: {
                chatId: this._info.chatId,
                userToRemove: domainUserIdToProto(DomainUserId.toDomainUserId(user))
            }
        }).then(() => undefined);
    }
}

// CONCATENATED MODULE: ./src/main/chat/ChatChannel.ts



class ChatChannel_ChatChannel extends MembershipChat_MembershipChat {
    constructor(connection, identityCache, messageStream, info) {
        super(connection, identityCache, messageStream, info);
    }
    add(user) {
        this._connection.session().assertOnline();
        this._assertJoined();
        return this._connection.request({
            addUserToChatChannelRequest: {
                chatId: this._info.chatId,
                userToAdd: domainUserIdToProto(DomainUserId.toDomainUserId(user))
            }
        }).then(() => undefined);
    }
}

// CONCATENATED MODULE: ./src/main/chat/ChatRoom.ts


class ChatRoom_ChatRoom extends MembershipChat_MembershipChat {
    constructor(connection, identityCache, messageStream, info) {
        super(connection, identityCache, messageStream, info);
        this._setOnline = () => {
            this._join();
        };
        this._setOffline = () => {
            this._joined = false;
        };
        connection.on(ConvergenceConnection_ConvergenceConnection.Events.INTERRUPTED, this._setOffline);
        connection.on(ConvergenceConnection_ConvergenceConnection.Events.DISCONNECTED, this._setOffline);
        connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATED, this._setOnline);
    }
}

// CONCATENATED MODULE: ./src/main/chat/ChatPermissionManager.ts




const CHAT_PERMISSION_IDENTIFIER = 1;
class ChatPermissionManager_ChatPermissionManager {
    constructor(chatId, connection) {
        this._chatId = chatId;
        this._connection = connection;
    }
    get chatId() {
        return this._chatId;
    }
    getPermissions() {
        this._connection.session().assertOnline();
        const request = {
            getClientPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getClientPermissionsResponse } = response;
            return getOrDefaultArray(getClientPermissionsResponse.permissions);
        });
    }
    addWorldPermissions(permissions) {
        this._connection.session().assertOnline();
        const request = {
            addPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                world: permissions
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    removeWorldPermissions(permissions) {
        this._connection.session().assertOnline();
        const request = {
            removePermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                world: permissions
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    setWorldPermissions(permissions) {
        this._connection.session().assertOnline();
        const request = {
            setPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                world: permissions
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    getWorldPermissions() {
        this._connection.session().assertOnline();
        const request = {
            getWorldPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getWorldPermissionsResponse } = response;
            return getOrDefaultArray(getWorldPermissionsResponse.permissions);
        });
    }
    addUserPermissions(permissions) {
        this._connection.session().assertOnline();
        let map = StringMap.coerceToMap(permissions);
        const request = {
            addPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                user: this._permissionsMapToPermissionEntries(map)
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    removeUserPermissions(permissions) {
        this._connection.session().assertOnline();
        let map = StringMap.coerceToMap(permissions);
        const request = {
            removePermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                user: this._permissionsMapToPermissionEntries(map)
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    setUserPermissions(permissions) {
        this._connection.session().assertOnline();
        let map = StringMap.coerceToMap(permissions);
        const request = {
            setPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                user: this._permissionsMapToPermissionEntries(map)
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    getAllUserPermissions() {
        this._connection.session().assertOnline();
        const request = {
            getAllUserPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getAllUserPermissionsResponse } = response;
            return this._permissionsEntriesToUserMap(getAllUserPermissionsResponse.users);
        });
    }
    getUserPermissions(username) {
        this._connection.session().assertOnline();
        const request = {
            getUserPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                user: domainUserIdToProto(DomainUserId.normal(username))
            }
        };
        return this._connection.request(request).then((response) => {
            const { getUserPermissionsResponse } = response;
            return getOrDefaultArray(getUserPermissionsResponse.permissions);
        });
    }
    addGroupPermissions(permissions) {
        this._connection.session().assertOnline();
        let permissionsByGroup = this._coercePermissionsToGroupedProtoPermissionList(permissions);
        const request = {
            addPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                group: permissionsByGroup
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    removeGroupPermissions(permissions) {
        this._connection.session().assertOnline();
        let permissionsByGroup = this._coercePermissionsToGroupedProtoPermissionList(permissions);
        const request = {
            removePermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                group: permissionsByGroup
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    setGroupPermissions(permissions) {
        this._connection.session().assertOnline();
        let permissionsByGroup = this._coercePermissionsToGroupedProtoPermissionList(permissions);
        const request = {
            setPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                group: permissionsByGroup
            }
        };
        return this._connection.request(request).then(() => {
            return;
        });
    }
    getAllGroupPermissions() {
        this._connection.session().assertOnline();
        const request = {
            getAllGroupPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getAllGroupPermissionsResponse } = response;
            let permissions = mapObjectValues(getAllGroupPermissionsResponse.groups, permissionsList => {
                return getOrDefaultArray(permissionsList.values);
            });
            return StringMap.objectToMap(permissions);
        });
    }
    getGroupPermissions(groupId) {
        this._connection.session().assertOnline();
        const request = {
            getGroupPermissionsRequest: {
                idType: CHAT_PERMISSION_IDENTIFIER,
                id: this._chatId,
                groupId
            }
        };
        return this._connection.request(request).then((response) => {
            const { getGroupPermissionsResponse } = response;
            return getOrDefaultArray(getGroupPermissionsResponse.permissions);
        });
    }
    _permissionsMapToPermissionEntries(map) {
        const userPermissions = [];
        map.forEach((userPerms, username) => {
            userPermissions.push({
                user: { userType: domainUserTypeToProto(DomainUserType.NORMAL), username },
                permissions: userPerms
            });
        });
        return userPermissions;
    }
    _permissionsEntriesToUserMap(entries) {
        const userPermissions = new Map();
        entries.forEach((entry) => {
            const username = entry.user.username;
            let permissions = getOrDefaultArray(entry.permissions);
            userPermissions.set(username, permissions);
        });
        return userPermissions;
    }
    _coercePermissionsToGroupedProtoPermissionList(permissions) {
        let groupedPermissions = StringMap.coerceToObject(permissions);
        return mapObjectValues(groupedPermissions, permissionsArr => {
            return {
                values: permissionsArr
            };
        });
    }
}

// CONCATENATED MODULE: ./src/main/chat/ChatService.ts












const ChatService_Events = {
    MESSAGE: ChatMessageEvent_ChatMessageEvent.NAME,
    USER_JOINED: UserJoinedEvent_UserJoinedEvent.NAME,
    USER_LEFT: UserLeftEvent_UserLeftEvent.NAME,
    USER_ADDED: UserAddedEvent_UserAddedEvent.NAME,
    USER_REMOVED: UserRemovedEvent_UserRemovedEvent.NAME,
    CHANNEL_JOINED: ChatJoinedEvent.NAME,
    CHANNEL_LEFT: ChatLeftEvent.NAME
};
Object.freeze(ChatService_Events);
class ChatService_ChatService extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(connection, identityCache) {
        super();
        this._connection = connection;
        this._identityCache = identityCache;
        this._messageStream = this._connection
            .messages()
            .pipe(Object(external_rxjs_operators_["filter"])(message => isChatMessage(message.message)), Object(external_rxjs_operators_["map"])(message => processChatMessage(message.message, this._identityCache)), Object(external_rxjs_operators_["tap"])(event => {
            if (event instanceof UserJoinedEvent_UserJoinedEvent && event.user.username === this.session().user().username) {
                const joined = new ChatJoinedEvent(event.chatId);
                this._emitEvent(joined);
            }
            else if (event instanceof UserLeftEvent_UserLeftEvent && event.user.username === this.session().user().username) {
                const left = new ChatLeftEvent(event.chatId);
                this._emitEvent(left);
            }
        }), Object(external_rxjs_operators_["share"])());
        this._emitFrom(this._messageStream);
    }
    session() {
        return this._connection.session();
    }
    exists(chatId) {
        Validation_Validation.assertNonEmptyString(chatId, "chatId");
        this.session().assertOnline();
        return this._connection.request({
            chatsExistRequest: {
                chatIds: [chatId]
            }
        }).then((response) => {
            const { chatsExistResponse } = response;
            return chatsExistResponse.exists[0];
        });
    }
    get(chatId) {
        Validation_Validation.assertNonEmptyString(chatId, "chatId");
        this.session().assertOnline();
        return this._connection
            .request({
            getChatsRequest: {
                chatIds: [chatId]
            }
        })
            .then((response) => {
            const { getChatsResponse } = response;
            const chatData = getChatsResponse.chatInfo[0];
            const chatInfo = createChatInfo(this._connection.session(), this._identityCache, chatData);
            return this._createChat(chatInfo);
        });
    }
    joined() {
        if (!this.session().isAuthenticated()) {
            return Promise.resolve([]);
        }
        return this._connection
            .request({
            getJoinedChatsRequest: {}
        })
            .then((response) => {
            const { getJoinedChatsResponse } = response;
            return getJoinedChatsResponse.chatInfo.map(chatInfo => {
                return createChatInfo(this._connection.session(), this._identityCache, chatInfo);
            });
        });
    }
    create(options) {
        if (!options) {
            throw new Error("create options must be supplied");
        }
        if (options.type !== "channel" && options.type !== "room") {
            throw new Error(`type must be 'channel' or 'room': ${options.type}`);
        }
        if (options.membership !== "public" && options.membership !== "private") {
            throw new Error(`membership must be 'public' or 'private': ${options.membership}`);
        }
        if (options.type === "room" && options.membership === "private") {
            throw new Error(`membership must be 'public' for a 'room': ${options.membership}`);
        }
        if (options.id !== undefined) {
            Validation_Validation.assertNonEmptyString(options.id, "id");
        }
        this.session().assertOnline();
        const { id, type: chatType, name, topic, membership, members } = options;
        const memberIds = (members || []).map(member => {
            if (member instanceof DomainUserId) {
                return domainUserIdToProto(member);
            }
            else {
                return domainUserIdToProto(DomainUserId.normal(member));
            }
        });
        return this._connection
            .request({
            createChatRequest: {
                chatId: toOptional(id),
                chatType,
                membership,
                name,
                topic,
                members: memberIds
            }
        })
            .then((response) => {
            const { createChatResponse } = response;
            return createChatResponse.chatId;
        })
            .catch(error => {
            if (error instanceof ConvergenceServerError &&
                error.code === "chat_already_exists" &&
                options.ignoreExistsError) {
                return Promise.resolve(id);
            }
            else {
                return Promise.reject(error);
            }
        });
    }
    remove(chatId) {
        Validation_Validation.assertNonEmptyString(chatId, "chatId");
        this.session().assertOnline();
        return this._connection.request({
            removeChatRequest: {
                chatId
            }
        }).then(() => undefined);
    }
    join(chatId) {
        Validation_Validation.assertNonEmptyString(chatId, "chatId");
        this.session().assertOnline();
        return this._connection.request({
            joinChatRequest: {
                chatId
            }
        }).then((response) => {
            const { joinChatResponse } = response;
            const chatInfo = createChatInfo(this._connection.session(), this._identityCache, joinChatResponse.chatInfo);
            return this._createChat(chatInfo);
        });
    }
    leave(chatId) {
        Validation_Validation.assertNonEmptyString(chatId, "chatId");
        this.session().assertOnline();
        return this._connection.request({
            leaveChatRequest: {
                chatId
            }
        }).then(() => undefined);
    }
    direct(users) {
        this.session().assertOnline();
        if (typeof users === "string" || users instanceof DomainUserId) {
            users = [users];
        }
        const userIds = users.map(user => {
            if (user instanceof DomainUserId) {
                return domainUserIdToProto(user);
            }
            else {
                return domainUserIdToProto(DomainUserId.normal(user));
            }
        });
        return this._connection.request({
            getDirectChatsRequest: {
                userLists: [{ values: userIds }]
            }
        }).then((response) => {
            const { getDirectChatsResponse } = response;
            const chatData = getDirectChatsResponse.chatInfo[0];
            const chatInfo = createChatInfo(this._connection.session(), this._identityCache, chatData);
            return this._createChat(chatInfo);
        });
    }
    permissions(chatId) {
        return new ChatPermissionManager_ChatPermissionManager(chatId, this._connection);
    }
    _createChat(chatInfo) {
        const messageStream = this._messageStream.pipe(Object(external_rxjs_operators_["filter"])(msg => msg.chatId === chatInfo.chatId));
        switch (chatInfo.chatType) {
            case ChatTypes.DIRECT:
                return new DirectChat_DirectChat(this._connection, this._identityCache, messageStream, chatInfo);
            case ChatTypes.CHANNEL:
                return new ChatChannel_ChatChannel(this._connection, this._identityCache, messageStream, chatInfo);
            case ChatTypes.ROOM:
                return new ChatRoom_ChatRoom(this._connection, this._identityCache, messageStream, chatInfo);
            default:
                throw new Error(`Invalid chat chat type: ${chatInfo.chatType}`);
        }
    }
}
ChatService_ChatService.Events = ChatService_Events;

// CONCATENATED MODULE: ./src/main/chat/history/index.ts










// CONCATENATED MODULE: ./src/main/chat/index.ts











// CONCATENATED MODULE: ./src/main/identity/IdentityCache.ts
var IdentityCache_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class IdentityCache_IdentityCache {
    constructor(connection, storage) {
        this._users = new Map();
        this._sessions = new Map();
        connection.messages().subscribe((event) => {
            if (event.message.identityCacheUpdate) {
                this._processIdentityUpdate(event.message.identityCacheUpdate);
            }
        });
        this._storage = storage;
        this._log = Logging.logger("identity");
    }
    init() {
        return IdentityCache_awaiter(this, void 0, void 0, function* () {
            if (this._storage.isEnabled()) {
                const users = yield this._storage.identityStore().getUsers();
                users.forEach(user => {
                    this._users.set(user.userId.toGuid(), user);
                });
                const sessions = yield this._storage.identityStore().getSessions();
                sessions.forEach((userId, sessionId) => {
                    const user = this._users.get(userId.toGuid());
                    this._sessions.set(sessionId, user);
                });
            }
        });
    }
    getUserForSession(sessionId) {
        return this._sessions.get(sessionId);
    }
    getUser(userId) {
        return this._users.get(userId.toGuid());
    }
    _processIdentityUpdate(message) {
        getOrDefaultArray(message.users).forEach(userData => {
            const domainUser = toDomainUser(userData);
            this._users.set(domainUser.userId.toGuid(), domainUser);
            if (this._storage.isEnabled()) {
                this._storage.identityStore().putUser(domainUser)
                    .catch(e => this._log.error("Error storing user", e));
            }
        });
        objectForEach(getOrDefaultObject(message.sessions), (sessionId, user) => {
            const userType = protoToDomainUserType(user.userType);
            const username = getOrDefaultString(user.username);
            const domainUser = this._users.get(DomainUserId.guid(userType, username));
            this._sessions.set(sessionId, domainUser);
            if (this._storage.isEnabled()) {
                this._storage.identityStore().putSession(sessionId, domainUser.userId)
                    .catch(e => this._log.error("Error storing session", e));
            }
        });
    }
}

// CONCATENATED MODULE: ./src/main/ConvergenceOptions.ts


class ConvergenceOptions_ConvergenceOptions {
    constructor(options) {
        ConvergenceOptions_ConvergenceOptions.validate(options);
        const defaultConnectionOptions = {
            timeout: ConvergenceOptions_ConvergenceOptions.DEFAULT_CONNECTION_TIMEOUT,
            handshakeTimeout: ConvergenceOptions_ConvergenceOptions.DEFAULT_HANDSHAKE_TIMEOUT
        };
        const { timeout, handshakeTimeout } = Object.assign(Object.assign({}, defaultConnectionOptions), options.connection);
        this.connectionTimeout = timeout;
        this.handshakeTimeout = handshakeTimeout;
        const defaultReconnectOptions = {
            autoReconnect: ConvergenceOptions_ConvergenceOptions.DEFAULT_AUTO_RECONNECT,
            reconnectIntervals: ConvergenceOptions_ConvergenceOptions.DEFAULT_RECONNECT_INTERVALS,
            fallbackAuth: { jwt: null, password: null, anonymous: null }
        };
        const { autoReconnect, reconnectIntervals, fallbackAuth } = Object.assign(Object.assign({}, defaultReconnectOptions), options.reconnect);
        this.autoReconnect = autoReconnect;
        this.reconnectIntervals = reconnectIntervals;
        this.fallbackAuth = null;
        if (TypeChecker.isFunction(fallbackAuth)) {
            this.fallbackAuth = fallbackAuth;
        }
        const defaultProtocolOptions = {
            defaultRequestTimeout: ConvergenceOptions_ConvergenceOptions.DEFAULT_REQUEST_TIMEOUT,
            heartbeat: {
                enabled: ConvergenceOptions_ConvergenceOptions.DEFAULT_HEARTBEAT_ENABLED,
                pingInterval: ConvergenceOptions_ConvergenceOptions.DEFAULT_PING_INTERVAL,
                pongTimeout: ConvergenceOptions_ConvergenceOptions.DEFAULT_PONG_TIMEOUT
            }
        };
        const { defaultRequestTimeout, heartbeat } = Object.assign(Object.assign({}, defaultProtocolOptions), options.protocol);
        this.defaultRequestTimeout = defaultRequestTimeout;
        this.heartbeatEnabled = heartbeat.enabled !== undefined ?
            heartbeat.enabled : ConvergenceOptions_ConvergenceOptions.DEFAULT_HEARTBEAT_ENABLED;
        this.pingInterval = heartbeat.pingInterval !== undefined ?
            heartbeat.pingInterval : ConvergenceOptions_ConvergenceOptions.DEFAULT_PING_INTERVAL;
        this.pongTimeout = heartbeat.pongTimeout !== undefined ?
            heartbeat.pongTimeout : ConvergenceOptions_ConvergenceOptions.DEFAULT_PONG_TIMEOUT;
        const defaultWebSocketOptions = {
            factory: ConvergenceOptions_ConvergenceOptions.DEFAULT_WEBSOCKET_FACTORY,
            constructor: ConvergenceOptions_ConvergenceOptions.DEFAULT_WEBSOCKET_CONSTRUCTOR
        };
        const wsOpts = Object.assign(Object.assign({}, defaultWebSocketOptions), options.webSocket);
        this.webSocketFactory = wsOpts.factory || null;
        this.webSocketClass = wsOpts.class || null;
        const offlineOpts = Object.assign({}, options.offline);
        this.storageAdapter = offlineOpts.storage || null;
        this.offlineStorageEnabled = this.storageAdapter !== null;
        this.offlineModelOperationSnapshotInterval = offlineOpts.modelSnapshotInterval || 100;
    }
    static validate(options) {
        let webSockets = false;
        try {
            webSockets = WebSocket.CLOSING === 2;
        }
        catch (e) {
        }
        if (!webSockets && (!options.webSocket || !options.webSocket.class)) {
            const message = "Convergence depends on the WebSockets API. " +
                "If Convergence is not being run in a browser, you must set the " +
                "'webSocket.class' property in the connection options.";
            throw new ConvergenceError(message, "websockets_not_supported");
        }
    }
    getOptions() {
        return {
            connection: {
                timeout: this.connectionTimeout,
                handshakeTimeout: this.handshakeTimeout
            },
            protocol: {
                defaultRequestTimeout: this.defaultRequestTimeout,
                heartbeat: {
                    enabled: this.heartbeatEnabled,
                    pingInterval: this.pingInterval,
                    pongTimeout: this.pongTimeout
                }
            },
            reconnect: {
                autoReconnect: this.autoReconnect,
                reconnectIntervals: this.reconnectIntervals,
                fallbackAuth: this.fallbackAuth
            },
            offline: {
                storage: this.storageAdapter
            },
            webSocket: {
                factory: this.webSocketFactory,
                class: this.webSocketClass
            }
        };
    }
}
ConvergenceOptions_ConvergenceOptions.DEFAULT_CONNECTION_TIMEOUT = 5;
ConvergenceOptions_ConvergenceOptions.DEFAULT_HANDSHAKE_TIMEOUT = 5;
ConvergenceOptions_ConvergenceOptions.DEFAULT_AUTO_RECONNECT = true;
ConvergenceOptions_ConvergenceOptions.DEFAULT_RECONNECT_INTERVALS = [0, 5, 10, 20, 30];
ConvergenceOptions_ConvergenceOptions.DEFAULT_REQUEST_TIMEOUT = 10;
ConvergenceOptions_ConvergenceOptions.DEFAULT_HEARTBEAT_ENABLED = true;
ConvergenceOptions_ConvergenceOptions.DEFAULT_PING_INTERVAL = 5;
ConvergenceOptions_ConvergenceOptions.DEFAULT_PONG_TIMEOUT = 10;
ConvergenceOptions_ConvergenceOptions.DEFAULT_WEBSOCKET_FACTORY = null;
ConvergenceOptions_ConvergenceOptions.DEFAULT_WEBSOCKET_CONSTRUCTOR = null;

// CONCATENATED MODULE: ./src/main/storage/StorageEngine.ts

class StorageEngine_StorageEngine {
    constructor() {
        this._log = Logging.logger("storage");
        this._storage = null;
    }
    configure(storage) {
        this._log.debug("Initializing storage engine: " + storage.adapterId());
        if (!storage) {
            throw new Error("storage must be specified");
        }
        this._storage = storage;
    }
    openStore(namespace, domainId, username) {
        return this._storage.initialize(namespace, domainId, username);
    }
    isEnabled() {
        return this._storage !== null;
    }
    isInitialized() {
        return this._storage !== null && this._storage.isInitialized();
    }
    dispose() {
        if (!this.isInitialized()) {
            throw new Error("Can not disposed a storage adapter that is not initialized");
        }
        if (this.isDisposed()) {
            throw new Error("Already disposed");
        }
        this._storage.dispose();
    }
    isDisposed() {
        return this._storage !== null && this._storage.isDisposed();
    }
    modelStore() {
        return this._storage.modelStore();
    }
    identityStore() {
        return this._storage.identityStore();
    }
}

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelUpdatedEvent.ts
class OfflineModelUpdatedEvent {
    constructor(id, version, permissions) {
        this.id = id;
        this.version = version;
        this.permissions = permissions;
        this.name = OfflineModelUpdatedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelUpdatedEvent.NAME = "offline_model_updated";

// CONCATENATED MODULE: ./src/main/model/events/OfflineModelStatusChangedEvent.ts
class OfflineModelStatusChangedEvent {
    constructor(id, subscribed, available, uncommitted, local) {
        this.id = id;
        this.subscribed = subscribed;
        this.available = available;
        this.uncommitted = uncommitted;
        this.local = local;
        this.name = OfflineModelStatusChangedEvent.NAME;
        Object.freeze(this);
    }
}
OfflineModelStatusChangedEvent.NAME = "offline_model_status_changed";

// CONCATENATED MODULE: ./src/main/model/ModelOfflineManager.ts
var ModelOfflineManager_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











class ModelOfflineManager_ModelOfflineManager extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(connection, snapshotInterval, storage) {
        super();
        this._log = Logging.logger("models.offline");
        this._modelCommitted = (event) => {
            this._onCommitStateChanged(event.src);
        };
        this._modelModified = (event) => {
            this._onCommitStateChanged(event.src);
        };
        this._connection = connection;
        this._storage = storage;
        this._subscribedModels = new Map();
        this._openModels = new Map();
        this._ready = new ReplayDeferred_ReplayDeferred();
        this._snapshotInterval = snapshotInterval;
        this._connection
            .messages()
            .subscribe((messageEvent) => {
            const message = messageEvent.message;
            if (message.modelOfflineUpdated) {
                this._handleModelOfflineUpdated(message.modelOfflineUpdated);
            }
        });
    }
    static _mapClientOperationEvent(modelId, opEvent) {
        const opData = toOfflineOperationData(opEvent.operation);
        return {
            sessionId: opEvent.sessionId,
            modelId,
            sequenceNumber: opEvent.seqNo,
            contextVersion: opEvent.contextVersion,
            timestamp: opEvent.timestamp,
            operation: opData
        };
    }
    init() {
        this._log.debug("Initializing offline model manager");
        this._storage.modelStore().getSubscribedModels().then(modelSubscriptions => {
            modelSubscriptions.forEach(modelMetaData => {
                this._subscribedModels.set(modelMetaData.modelId, {
                    version: modelMetaData.details ? modelMetaData.details.version : 0,
                    permissions: modelMetaData.details ?
                        ModelPermissions.fromJSON(modelMetaData.details.permissions) : undefined
                });
            });
            this._ready.resolve();
        }).catch(e => {
            this._log.error("Error initializing offline model manager", e);
            this._ready.reject(e);
        });
    }
    isOfflineEnabled() {
        return this._storage.isEnabled();
    }
    ready() {
        return this._ready.promise();
    }
    modelOpened(model, opsSinceSnapshot) {
        const record = { model, opsSinceSnapshot };
        this._openModels.set(model.modelId(), record);
        model.on(RealTimeModel_RealTimeModel.Events.MODIFIED, this._modelModified);
        model.on(RealTimeModel_RealTimeModel.Events.COMMITTED, this._modelCommitted);
    }
    modelClosed(model) {
        this._openModels.delete(model.modelId());
        this._deleteIfNotNeeded(model.modelId())
            .catch(e => this._log.error("Error cleaning up model after close", e));
        model.off(RealTimeModel_RealTimeModel.Events.MODIFIED, this._modelModified);
        model.off(RealTimeModel_RealTimeModel.Events.COMMITTED, this._modelCommitted);
    }
    isModelStoredOffline(modelId) {
        return this._subscribedModels.has(modelId);
    }
    getSubscribedModelIds() {
        return Array.from(this._subscribedModels.keys());
    }
    getModelsRequiringSync() {
        return this._storage.modelStore().getModelsRequiringSync();
    }
    subscribe(modelIds) {
        const notSubscribed = modelIds.filter(id => !this._subscribedModels.has(id));
        if (notSubscribed.length > 0) {
            const event = new OfflineModelDownloadPendingEvent();
            this._emitEvent(event);
        }
        return this._storage
            .modelStore()
            .addSubscriptions(notSubscribed)
            .then(() => {
            notSubscribed.forEach((modelId) => this._handleNewSubscriptions(modelId));
            return this._sendSubscriptionRequest(notSubscribed.map(m => {
                return { modelId: m, version: 0 };
            }), [], false);
        });
    }
    unsubscribe(modelIds) {
        const allBeforeUnsubscribe = this._allDownloaded();
        const subscribed = modelIds.filter(id => this._subscribedModels.has(id));
        return this._storage
            .modelStore()
            .removeSubscriptions(modelIds)
            .then(() => {
            subscribed.forEach(modelId => this._handleUnsubscribed(modelId));
            if (!allBeforeUnsubscribe && this._allDownloaded()) {
                this._emitEvent(new OfflineModelDownloadCompletedEvent());
            }
            return this._sendSubscriptionRequest([], subscribed, false);
        });
    }
    setSubscriptions(modelIds) {
        const allBeforeUnsubscribe = this._allDownloaded();
        const subscribe = modelIds.filter(id => !this._subscribedModels.has(id));
        subscribe.forEach(modelId => this._handleNewSubscriptions(modelId));
        const unsubscribe = Array.from(this._subscribedModels.keys()).filter(id => !modelIds.includes(id));
        unsubscribe.forEach(modelId => this._handleUnsubscribed(modelId));
        const subscriptions = Array.from(this._subscribedModels.keys());
        const requests = subscriptions.map(modelId => {
            const record = this._subscribedModels.get(modelId);
            return {
                modelId,
                currentVersion: record.version,
                currentPermissions: record.permissions
            };
        });
        if (subscribe.length > 0) {
            const event = new OfflineModelDownloadPendingEvent();
            this._emitEvent(event);
        }
        else {
            if (!allBeforeUnsubscribe && this._allDownloaded()) {
                this._emitEvent(new OfflineModelDownloadCompletedEvent());
            }
        }
        return this._storage
            .modelStore()
            .setModelSubscriptions(subscriptions)
            .then(() => {
            return this._sendSubscriptionRequest(requests, [], true);
        });
    }
    resubscribe() {
        return this._storage
            .modelStore()
            .getSubscribedModels()
            .then(subscriptions => subscriptions.map(metaData => {
            return {
                modelId: metaData.modelId,
                currentPermissions: metaData.details ? metaData.details.permissions.toJSON() : undefined,
                currentVersion: metaData.details ? metaData.details.version : 0
            };
        }))
            .then((subscriptions) => {
            return this._sendSubscriptionRequest(subscriptions, [], true);
        });
    }
    getModelCreationData(modelId) {
        return this._storage.modelStore().getModelCreationData(modelId);
    }
    modelCreated(modelId) {
        return this._storage.modelStore().modelCreated(modelId)
            .then(() => this._deleteIfNotNeeded(modelId));
    }
    createOfflineModel(creationData) {
        return this._storage
            .modelStore()
            .createModelOffline(creationData);
    }
    getOfflineModelState(modelId) {
        return this._storage.modelStore().getModelState(modelId);
    }
    claimValueIdPrefix(modelId) {
        return this._storage.modelStore().claimValueIdPrefix(modelId);
    }
    getModelMetaData(modelId) {
        return this._storage.modelStore().getModelMetaData(modelId);
    }
    getAllModelMetaData() {
        return this._storage.modelStore().getAllModelMetaData();
    }
    processLocalOperation(modelId, clientEvent) {
        const localOpData = ModelOfflineManager_ModelOfflineManager._mapClientOperationEvent(modelId, clientEvent);
        return this._storage.modelStore()
            .processLocalOperation(localOpData)
            .then(() => this._handleOperation(modelId));
    }
    processOperationAck(modelId, seqNo, serverOp) {
        return this._storage.modelStore()
            .processOperationAck(modelId, seqNo, serverOp);
    }
    processServerOperationEvent(modelId, serverOperation, transformedLocalOps) {
        const opData = toOfflineOperationData(serverOperation.operation);
        const serverOp = {
            modelId,
            sessionId: serverOperation.clientId,
            version: serverOperation.version,
            timestamp: serverOperation.timestamp,
            operation: opData
        };
        const currentLocalOps = transformedLocalOps
            .map(clientEvent => ModelOfflineManager_ModelOfflineManager._mapClientOperationEvent(modelId, clientEvent));
        return this._storage.modelStore()
            .processServerOperation(serverOp, currentLocalOps)
            .then(() => this._handleOperation(modelId));
    }
    markModelForDeletion(modelId) {
        this._subscribedModels.delete(modelId);
        return this._storage.modelStore().deleteModel(modelId)
            .then(() => this._deleteIfNotNeeded(modelId));
    }
    modelDeleted(modelId) {
        return this._storage.modelStore().modelDeleted(modelId)
            .then(() => this._deleteIfNotNeeded(modelId));
    }
    storeOpenModelOffline(model) {
        const snapshot = this._getSnapshot(model);
        const version = model.version();
        const state = {
            modelId: model.modelId(),
            collection: model.collectionId(),
            valueIdPrefix: {
                prefix: model._valueIdPrefix(),
                increment: 0
            },
            version,
            lastSequenceNumber: snapshot.sequenceNumber,
            createdTime: model.createdTime(),
            modifiedTime: model.time(),
            local: model.isLocal(),
            permissions: model.permissions(),
            snapshot
        };
        return this._storage.modelStore().putModelState(state);
    }
    _handleNewSubscriptions(modelId) {
        this._subscribedModels.set(modelId, { version: 0 });
    }
    _handleUnsubscribed(modelId) {
        this._subscribedModels.delete(modelId);
    }
    _sendSubscriptionRequest(subscribe, unsubscribe, all) {
        const change = all || subscribe.length > 0 || unsubscribe.length > 0;
        if (this._connection.isOnline() && change) {
            const message = {
                modelOfflineSubscriptionChange: {
                    subscribe,
                    unsubscribe,
                    all
                }
            };
            return this._connection.request(message).then(() => undefined);
        }
        else {
            return Promise.resolve();
        }
    }
    _handleModelOfflineUpdated(message) {
        const modelId = getOrDefaultString(message.modelId);
        if (!this._openModels.has(modelId)) {
            if (getOrDefaultBoolean(message.deleted)) {
                this._storage.modelStore().removeSubscriptions([modelId])
                    .then(() => {
                    this._subscribedModels.delete(modelId);
                    const deletedEvent = new OfflineModelDeletedEvent(modelId);
                    this._emitEvent(deletedEvent);
                    const statusEvent = new OfflineModelStatusChangedEvent(modelId, false, false, false, false);
                    this._emitEvent(statusEvent);
                })
                    .catch(e => {
                    this._log.error("Could not delete offline model.", e);
                });
            }
            else if (getOrDefaultBoolean(message.permissionRevoked)) {
                this._storage.modelStore()
                    .removeSubscriptions([modelId])
                    .then(() => {
                    this._subscribedModels.delete(modelId);
                    const revokedEvent = new OfflineModelPermissionsRevokedEvent(modelId);
                    this._emitEvent(revokedEvent);
                    const statusEvent = new OfflineModelStatusChangedEvent(modelId, false, false, false, false);
                    this._emitEvent(statusEvent);
                })
                    .catch(e => {
                    this._log.error("Could not delete offline model after permissions revoked.", e);
                });
            }
            else if (message.initial) {
                if (this._subscribedModels.has(modelId)) {
                    const { collection, model, permissions, valueIdPrefix } = message.initial;
                    const modelPermissions = toModelPermissions(permissions);
                    const version = getOrDefaultNumber(model.version);
                    const modelState = {
                        modelId,
                        collection,
                        valueIdPrefix: { prefix: valueIdPrefix, increment: 0 },
                        version,
                        lastSequenceNumber: 0,
                        createdTime: timestampToDate(model.createdTime),
                        modifiedTime: timestampToDate(model.modifiedTime),
                        local: false,
                        permissions: modelPermissions,
                        snapshot: {
                            version: getOrDefaultNumber(model.version),
                            sequenceNumber: 0,
                            data: toObjectValue(model.data),
                            serverOperations: [],
                            localOperations: []
                        }
                    };
                    this._storage.modelStore().putModelState(modelState).catch(e => {
                        this._log.error("Error synchronizing subscribed model from server", e);
                    }).then(() => {
                        this._subscribedModels.set(modelId, { version, permissions: modelPermissions });
                        const statusEvent = new OfflineModelStatusChangedEvent(modelId, true, true, false, false);
                        this._emitEvent(statusEvent);
                        const updateEvent = new OfflineModelUpdatedEvent(modelId, version, modelPermissions);
                        this._emitEvent(updateEvent);
                        if (this._allDownloaded()) {
                            const event = new OfflineModelDownloadCompletedEvent();
                            this._emitEvent(event);
                        }
                    });
                }
            }
            else if (message.updated) {
                const { model, permissions } = message.updated;
                const dataUpdate = model ? {
                    version: getOrDefaultNumber(model.version),
                    createdTime: timestampToDate(model.createdTime),
                    modifiedTime: timestampToDate(model.modifiedTime),
                    data: toObjectValue(model.data)
                } : undefined;
                const permissionsUpdate = toModelPermissions(permissions);
                const update = {
                    modelId,
                    dataUpdate,
                    permissionsUpdate
                };
                this._storage.modelStore()
                    .updateOfflineModel(update)
                    .catch(e => {
                    this._log.error("Error synchronizing subscribed model from server", e);
                })
                    .then(() => {
                    if (dataUpdate) {
                        this._subscribedModels.set(modelId, {
                            version: getOrDefaultNumber(model.version),
                            permissions: permissionsUpdate
                        });
                    }
                    const modelPermissions = permissionsUpdate ? ModelPermissions.fromJSON(permissionsUpdate) : null;
                    const version = dataUpdate ? dataUpdate.version : null;
                    const updateEvent = new OfflineModelUpdatedEvent(modelId, version, modelPermissions);
                    this._emitEvent(updateEvent);
                });
            }
        }
    }
    _handleOperation(modelId) {
        return ModelOfflineManager_awaiter(this, void 0, void 0, function* () {
            if (this._openModels.has(modelId)) {
                let { model, opsSinceSnapshot } = this._openModels.get(modelId);
                opsSinceSnapshot++;
                if (opsSinceSnapshot >= this._snapshotInterval) {
                    const snapshot = this._getSnapshot(model);
                    yield this._storage.modelStore()
                        .snapshotModel(modelId, snapshot.version, snapshot.sequenceNumber, snapshot.data)
                        .then(() => {
                        opsSinceSnapshot = 0;
                    })
                        .catch(e => this._log.error("Error snapshotting model", e));
                }
                this._openModels.set(modelId, { model, opsSinceSnapshot });
            }
        });
    }
    _getSnapshot(model) {
        const modelStateSnapshot = model._getConcurrencyControlStateSnapshot();
        const localOperations = modelStateSnapshot.uncommittedOperations
            .map(op => ModelOfflineManager_ModelOfflineManager._mapClientOperationEvent(model.modelId(), op));
        const serverOperations = [];
        return {
            version: model.version(),
            sequenceNumber: modelStateSnapshot.lastSequenceNumber,
            data: modelStateSnapshot.data,
            localOperations,
            serverOperations
        };
    }
    _allDownloaded() {
        let allDownloaded = true;
        this._subscribedModels.forEach(record => {
            if (record.version === 0) {
                allDownloaded = false;
            }
        });
        return allDownloaded;
    }
    _deleteIfNotNeeded(modelId) {
        return this._storage.modelStore().deleteIfNotNeeded(modelId)
            .then(removed => {
            if (removed) {
                this._subscribedModels.delete(modelId);
                const event = new OfflineModelStatusChangedEvent(modelId, false, false, false, false);
                this._emitEvent(event);
            }
        });
    }
    _onCommitStateChanged(model) {
        const e = new OfflineModelStatusChangedEvent(model.modelId(), this._subscribedModels.has(model.modelId()), true, !model.isCommitted(), model.isLocal());
        this._emitEvent(e);
    }
}

// CONCATENATED MODULE: ./src/main/ConvergenceDomain.ts
var ConvergenceDomain_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


















class ConvergenceDomain_ConvergenceDomain extends ConvergenceEventEmitter_ConvergenceEventEmitter {
    constructor(url, options) {
        super();
        this._log = Logging.logger("domain");
        Validation_Validation.assertString(url, "url");
        const urlExpression = /^(https?|wss?):\/{2}(.+)\/(.+)\/(.+)/;
        const urlParts = urlExpression.exec(url.trim());
        if (!urlParts || urlParts.length !== 5) {
            throw new Error(`Invalid url: ${url}`);
        }
        this._namespace = urlParts[3];
        this._domainId = urlParts[4];
        this._options = new ConvergenceOptions_ConvergenceOptions(options || {});
        this._disposed = false;
        this._initialized = false;
        this._connection = new ConvergenceConnection_ConvergenceConnection(url, this, this._options);
        this._storage = new StorageEngine_StorageEngine();
        this._identityCache = new IdentityCache_IdentityCache(this._connection, this._storage);
        this._modelOfflineManager = new ModelOfflineManager_ModelOfflineManager(this._connection, this._options.offlineModelOperationSnapshotInterval, this._storage);
        this._modelService = new ModelService_ModelService(this._connection, this._identityCache, this._modelOfflineManager);
        this._identityService = new IdentityService_IdentityService(this._connection);
        this._activityService = new ActivityService_ActivityService(this._connection, this._identityCache);
        this._presenceService = new PresenceService_PresenceService(this._connection, this._identityCache, undefined);
        this._chatService = new ChatService_ChatService(this._connection, this._identityCache);
        this._bindConnectionEvents();
    }
    static _toPromiseCallback(value) {
        if (value === undefined) {
            return () => Promise.resolve(undefined);
        }
        else {
            return typeof value === "function" ?
                value :
                () => Promise.resolve(value);
        }
    }
    url() {
        return this._connection.url();
    }
    options() {
        return this._options.getOptions();
    }
    namespace() {
        return this._namespace;
    }
    id() {
        return this._domainId;
    }
    session() {
        return this._connection.session();
    }
    models() {
        return this._modelService;
    }
    identity() {
        return this._identityService;
    }
    activities() {
        return this._activityService;
    }
    presence() {
        return this._presenceService;
    }
    chat() {
        return this._chatService;
    }
    dispose() {
        this._disposed = true;
        if (this._modelService !== undefined) {
            this._modelService._dispose();
        }
        this._connection.disconnect();
    }
    isDisposed() {
        return this._disposed;
    }
    connectWithPassword(credentials) {
        const promiseCallback = ConvergenceDomain_ConvergenceDomain._toPromiseCallback(credentials);
        return this._connection
            .connect()
            .then(() => promiseCallback())
            .then((creds) => {
            Validation_Validation.assertNonEmptyString(creds.username, "username");
            Validation_Validation.assertNonEmptyString(creds.password, "password");
            return this._authenticateWithPassword(creds);
        })
            .then(() => this._init(this._connection.session().user().username));
    }
    connectAnonymously(displayName) {
        const promiseCallback = ConvergenceDomain_ConvergenceDomain._toPromiseCallback(displayName);
        return this._connection
            .connect()
            .then(() => promiseCallback())
            .then((d) => this._authenticateAnonymously(d))
            .then(() => this._init(this._connection.session().user().username));
    }
    connectWithJwt(jwt) {
        const promiseCallback = ConvergenceDomain_ConvergenceDomain._toPromiseCallback(jwt);
        return this._connection
            .connect()
            .then(() => promiseCallback())
            .then((j) => {
            Validation_Validation.assertNonEmptyString(j, "jwt");
            return this._authenticateWithJwt(j);
        })
            .then(() => this._init(this._connection.session().user().username));
    }
    reconnect(token) {
        token = token || this._connection.session().reconnectToken();
        if (!TypeChecker.isSet(token)) {
            return Promise.reject(new Error("No reconnect token was provided, and there is not one in memory"));
        }
        else {
            const promiseCallback = ConvergenceDomain_ConvergenceDomain._toPromiseCallback(token);
            return this._connection
                .connect()
                .then(() => promiseCallback())
                .then((t) => {
                Validation_Validation.assertNonEmptyString(t, "token");
                return this._authenticateWithReconnectToken(t);
            })
                .then(() => this._init(this._connection.session().user().username));
        }
    }
    initializeOffline(username) {
        const promiseCallback = ConvergenceDomain_ConvergenceDomain._toPromiseCallback(username);
        if (TypeChecker.isNotSet(username)) {
            throw new Error("An username must be provided to initialize the domain offline.");
        }
        if (TypeChecker.isNotSet(this._options.storageAdapter)) {
            throw new Error("'options.offline.storage' must be set to initialize the domain offline.");
        }
        return promiseCallback().then(u => this._init(u));
    }
    disconnect() {
        if (!this._connection.isDisconnected()) {
            this._connection.disconnect();
        }
    }
    isDisconnected() {
        return this._connection.isDisconnected();
    }
    isConnected() {
        return this._connection.isConnected();
    }
    _authenticateWithPassword(credentials) {
        return this._connection
            .authenticateWithPassword(credentials)
            .then(() => undefined);
    }
    _authenticateWithJwt(jwt) {
        return this._connection
            .authenticateWithJwt(jwt)
            .then(() => undefined);
    }
    _authenticateWithReconnectToken(token) {
        return this._connection
            .authenticateWithReconnectToken(token)
            .then(() => undefined);
    }
    _authenticateAnonymously(displayName) {
        return this._connection
            .authenticateAnonymously(displayName)
            .then(() => undefined);
    }
    _bindConnectionEvents() {
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.CONNECTING, () => this._emitEvent(new ConnectingEvent(this)));
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.CONNECTED, () => this._emitEvent(new ConnectedEvent(this)));
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.CONNECTION_SCHEDULED, (e) => this._emitEvent(new ConnectionScheduledEvent(this, e.delay)));
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.CONNECTION_FAILED, () => this._emitEvent(new ConnectionFailedEvent(this)));
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATING, (e) => this._emitEvent(new AuthenticatingEvent(this, e.method)));
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATED, (e) => {
            this._emitEvent(new AuthenticatedEvent(this, e.method));
            this._onAuthenticated(e);
        });
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.AUTHENTICATION_FAILED, (e) => this._emitEvent(new AuthenticationFailedEvent(this, e.method)));
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.INTERRUPTED, () => {
            this._emitEvent(new InterruptedEvent(this));
        });
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.DISCONNECTED, () => {
            this._emitEvent(new DisconnectedEvent(this));
        });
        this._connection.on(ConvergenceConnection_ConvergenceConnection.Events.ERROR, (evt) => this._emitEvent(new ErrorEvent(this, evt.error.message)));
    }
    _init(username) {
        if (this._initialized) {
            return Promise.resolve();
        }
        this._log.debug("Initializing domain");
        if (this._options.storageAdapter) {
            this._log.debug("options.offline.storage is set, initializing offline storage");
            this._storage.configure(this._options.storageAdapter);
            return this._storage.openStore(this._namespace, this._domainId, username)
                .then(() => ConvergenceDomain_awaiter(this, void 0, void 0, function* () {
                this._initialized = true;
                yield this._modelOfflineManager.init();
                yield this._identityCache.init();
            }));
        }
        else {
            this._initialized = true;
            return Promise.resolve();
        }
    }
    _onAuthenticated(authEvent) {
        const state = mapObjectValues(getOrDefaultObject(authEvent.state), protoValueToJson);
        this._presenceService._setInternalState(StringMap.objectToMap(state));
    }
}
ConvergenceDomain_ConvergenceDomain.Events = {
    CONNECTION_SCHEDULED: ConnectionScheduledEvent.NAME,
    CONNECTING: ConnectingEvent.NAME,
    CONNECTED: ConnectedEvent.NAME,
    CONNECTION_FAILED: ConnectionFailedEvent.NAME,
    AUTHENTICATING: AuthenticatingEvent.NAME,
    AUTHENTICATED: AuthenticatedEvent.NAME,
    AUTHENTICATION_FAILED: AuthenticationFailedEvent.NAME,
    INTERRUPTED: InterruptedEvent.NAME,
    DISCONNECTED: DisconnectedEvent.NAME,
    ERROR: ErrorEvent.NAME
};
Object.freeze(ConvergenceDomain_ConvergenceDomain.Events);

// CONCATENATED MODULE: ./src/main/Convergence.ts


class Convergence_Convergence {
    static connect(url, username, password, options, cancellationToken) {
        return Convergence_Convergence.connectWithPassword(url, { username, password }, options, cancellationToken);
    }
    static connectWithPassword(url, credentials, options, cancellationToken) {
        const domain = Convergence_Convergence._createDomain(url, options, cancellationToken);
        return domain.connectWithPassword(credentials).then(() => domain);
    }
    static connectAnonymously(url, displayName, options, cancellationToken) {
        const domain = Convergence_Convergence._createDomain(url, options, cancellationToken);
        return domain.connectAnonymously(displayName).then(() => domain);
    }
    static connectWithJwt(url, jwt, options, cancellationToken) {
        const domain = Convergence_Convergence._createDomain(url, options, cancellationToken);
        return domain.connectWithJwt(jwt).then(() => domain);
    }
    static reconnect(url, token, options, cancellationToken) {
        const domain = Convergence_Convergence._createDomain(url, options, cancellationToken);
        return domain.reconnect(token).then(() => domain);
    }
    static configureLogging(config) {
        Logging.configure(config);
    }
    static _createDomain(url, options, cancellationToken) {
        const domain = new ConvergenceDomain_ConvergenceDomain(url, options);
        if (typeof cancellationToken === "object") {
            cancellationToken._bind(() => domain.dispose());
        }
        return domain;
    }
}
const connect = Convergence_Convergence.connect;
const connectWithPassword = Convergence_Convergence.connectWithPassword;
const connectAnonymously = Convergence_Convergence.connectAnonymously;
const connectWithJwt = Convergence_Convergence.connectWithJwt;
const reconnect = Convergence_Convergence.reconnect;
const configureLogging = Convergence_Convergence.configureLogging;

// CONCATENATED MODULE: ./src/main/storage/idb/promise.ts
function toPromise(req) {
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = () => {
            reject(req.error);
        };
    });
}
function toVoidPromise(req) {
    return toPromise(req).then(() => undefined);
}
function txToPromise(tx) {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
            resolve();
        };
        tx.onerror = () => {
            reject(tx.error);
        };
        tx.onabort = () => {
            reject(tx.error);
        };
    });
}

// CONCATENATED MODULE: ./src/main/storage/idb/IdbPersistenceStore.ts

const READONLY = "readonly";
const READWRITE = "readwrite";
class IdbPersistenceStore_IdbPersistenceStore {
    constructor(db) {
        this._db = db;
    }
    static deleteFromIndex(store, index, range) {
        const idx = store.index(index);
        return toPromise(idx.openCursor(range)).then(cursor => {
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        });
    }
    _withWriteStore(store, body) {
        return this._withStores([store], READWRITE, (stores) => body(stores[0]));
    }
    _withReadStore(store, body) {
        return this._withStores([store], READONLY, (stores) => body(stores[0]));
    }
    _withWriteStores(stores, body) {
        return this._withStores(stores, READWRITE, body);
    }
    _withReadStores(stores, body) {
        return this._withStores(stores, READONLY, body);
    }
    _withStores(stores, mode, body) {
        const tx = this._db.transaction(stores, mode);
        const objectStores = stores.map(storeName => tx.objectStore(storeName));
        const result = body(objectStores)
            .catch(e => {
            tx.abort();
            return Promise.reject(e);
        });
        return Promise.all([result, txToPromise(tx)]).then(([r, t]) => r);
    }
    put(storeName, data) {
        return this._withWriteStore(storeName, (store) => {
            return toVoidPromise(store.put(data));
        });
    }
    add(storeName, data) {
        return this._withWriteStore(storeName, (store) => {
            return toVoidPromise(store.add(data));
        });
    }
    _getAll(storeName, query) {
        const results = [];
        return this._readIterator(storeName, (value) => {
            results.push(value);
        }, query).then(() => results);
    }
    _readIterator(storeName, onNext, query, direction) {
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction(storeName, READONLY);
            const objectStore = tx.objectStore(storeName);
            const request = objectStore.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    onNext(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve();
                }
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// CONCATENATED MODULE: ./src/main/storage/idb/IdbSchema.ts
const IdbSchema = {
    ModelCreation: {
        Store: "ModelCreation",
        Fields: {
            ModelId: "modelId"
        },
        Indices: {
            ModelId: "ModelCreation.modelId"
        }
    },
    ModelMetaData: {
        Store: "ModelMetaData",
        Fields: {
            ModelId: "modelId",
            Subscribed: "subscribed",
            Created: "created",
            Deleted: "deleted",
            SyncRequired: "syncRequired",
            Uncommitted: "uncommitted"
        },
        Indices: {
            ModelId: "ModelMetaData.modelId",
            Created: "ModelMetaData.created",
            Deleted: "ModelMetaData.deleted",
            Uncommitted: "ModelMetaData.uncommitted",
            SyncRequired: "ModelMetaData.syncRequired",
            Subscribed: "ModelMetaData.subscribed"
        }
    },
    ModelData: {
        Store: "ModelData",
        Fields: {
            ModelId: "modelId"
        },
        Indices: {
            ModelId: "ModelData.modelId"
        }
    },
    ModelServerOperation: {
        Store: "ModelServerOperation",
        Fields: {
            ModelId: "modelId",
            Version: "version"
        },
        Indices: {
            ModelId: "ModelServerOperation.modelId",
            ModelId_Version: "ModelServerOperation.modelId_version"
        }
    },
    ModelLocalOperation: {
        Store: "ModelLocalOperation",
        Fields: {
            ModelId: "modelId",
            SequenceNumber: "sequenceNumber"
        },
        Indices: {
            ModelId: "ModelLocalOperation.modelId",
            ModelId_SequenceNumber: "ModelLocalOperation.modelId_sequenceNumber"
        }
    },
    DomainUser: {
        Store: "DomainUser",
        Fields: {
            Username: "username",
            UserType: "userType"
        },
        Indices: {
            UserType_Username: "DomainUser.userType_username"
        }
    },
    Session: {
        Store: "Session",
        Fields: {
            SessionId: "sessionId",
            Username: "username",
            UserType: "userType"
        },
        Indices: {
            UserType_Username: "DomainUser.userType_username",
            SessionId: "Session.sessionId"
        }
    }
};

// CONCATENATED MODULE: ./src/main/storage/idb/IdbModelStore.ts
var IdbModelStore_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class IdbModelStore_IdbModelStore extends IdbPersistenceStore_IdbPersistenceStore {
    static _deleteServerOperationsForModel(store, modelId) {
        return IdbPersistenceStore_IdbPersistenceStore.deleteFromIndex(store, IdbSchema.ModelServerOperation.Indices.ModelId, IDBKeyRange.only(modelId));
    }
    static _deleteLocalOperationsForModel(store, modelId) {
        return IdbPersistenceStore_IdbPersistenceStore.deleteFromIndex(store, IdbSchema.ModelLocalOperation.Indices.ModelId, IDBKeyRange.only(modelId));
    }
    static _putLocalOperationsForModel(store, operations) {
        return IdbModelStore_awaiter(this, void 0, void 0, function* () {
            for (const op of operations) {
                yield toVoidPromise(store.add(op));
            }
        });
    }
    static _putServerOperationsForModel(store, operations) {
        return IdbModelStore_awaiter(this, void 0, void 0, function* () {
            for (const op of operations) {
                yield toVoidPromise(store.add(op));
            }
        });
    }
    static _metaDataDocToMetaData(doc) {
        const metaData = {
            modelId: doc.modelId,
            subscribed: doc.subscribed === 1,
            available: doc.available === 1,
            deleted: doc.deleted === 1,
            created: doc.created === 1,
            uncommitted: doc.uncommitted === 1,
            syncRequired: doc.syncRequired === 1,
        };
        if (doc.details) {
            metaData.details = {
                collection: doc.details.collection,
                valueIdPrefix: doc.details.valueIdPrefix,
                version: doc.details.version,
                lastSequenceNumber: doc.details.lastSequenceNumber,
                createdTime: doc.details.createdTime,
                modifiedTime: doc.details.modifiedTime,
                permissions: new ModelPermissions(doc.details.permissions.read, doc.details.permissions.write, doc.details.permissions.remove, doc.details.permissions.manage),
                snapshotVersion: doc.details.snapshotVersion,
                snapshotSequenceNumber: doc.details.snapshotSequenceNumber
            };
        }
        return metaData;
    }
    static _putModelState(modelState, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore) {
        return IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const currentMetaData = yield toPromise(modelMetaDataStore.get(modelState.modelId));
            const valueIdPrefix = {
                prefix: modelState.valueIdPrefix.prefix,
                increment: modelState.valueIdPrefix.increment || 0
            };
            const meta = {
                modelId: modelState.modelId,
                available: 1,
                details: {
                    collection: modelState.collection,
                    valueIdPrefix,
                    createdTime: modelState.createdTime,
                    modifiedTime: modelState.modifiedTime,
                    permissions: {
                        read: modelState.permissions.read,
                        write: modelState.permissions.write,
                        remove: modelState.permissions.remove,
                        manage: modelState.permissions.manage,
                    },
                    lastSequenceNumber: modelState.lastSequenceNumber,
                    version: modelState.version,
                    snapshotVersion: modelState.snapshot.version,
                    snapshotSequenceNumber: modelState.snapshot.sequenceNumber
                }
            };
            if (modelState.local) {
                meta.created = 1;
            }
            meta.available = 1;
            if (currentMetaData) {
                meta.subscribed = currentMetaData.subscribed;
                meta.deleted = currentMetaData.deleted;
            }
            IdbModelStore_IdbModelStore._setSyncRequired(meta);
            yield toVoidPromise(modelMetaDataStore.put(meta));
            const data = {
                modelId: modelState.modelId,
                data: modelState.snapshot.data,
            };
            yield toVoidPromise(modelDataStore.put(data));
            yield IdbModelStore_IdbModelStore._deleteServerOperationsForModel(serverOpStore, meta.modelId);
            yield IdbModelStore_IdbModelStore._deleteLocalOperationsForModel(localOpStore, meta.modelId);
            yield IdbModelStore_IdbModelStore._putLocalOperationsForModel(localOpStore, modelState.snapshot.localOperations);
            yield IdbModelStore_IdbModelStore._putServerOperationsForModel(serverOpStore, modelState.snapshot.serverOperations);
        });
    }
    static _removeSubscriptions(modelIds, createStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore) {
        return IdbModelStore_awaiter(this, void 0, void 0, function* () {
            for (const modelId of modelIds) {
                const metaData = yield toPromise(modelMetaDataStore.get(modelId));
                if (!metaData) {
                    continue;
                }
                delete metaData.subscribed;
                IdbModelStore_IdbModelStore._setSyncRequired(metaData);
                if (!IdbModelStore_IdbModelStore._isMetaDataNeeded(metaData)) {
                    yield this._deleteModel(modelId, createStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore);
                }
                else {
                    yield modelMetaDataStore.put(metaData);
                }
            }
        });
    }
    static _deleteModel(modelId, modelCreateStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore) {
        return IdbModelStore_awaiter(this, void 0, void 0, function* () {
            yield modelCreateStore.delete(modelId);
            yield modelMetaDataStore.delete(modelId);
            yield modelDataStore.delete(modelId);
            yield IdbModelStore_IdbModelStore._deleteServerOperationsForModel(serverOpStore, modelId);
            yield IdbModelStore_IdbModelStore._deleteLocalOperationsForModel(localOpStore, modelId);
        });
    }
    static _addSubscriptions(modelIds, metaDataStore) {
        return IdbModelStore_awaiter(this, void 0, void 0, function* () {
            for (const modelId of modelIds) {
                const current = yield toPromise(metaDataStore.get(modelId));
                let updated;
                if (current !== undefined) {
                    updated = current;
                    updated.subscribed = 1;
                }
                else {
                    updated = {
                        modelId,
                        subscribed: 1,
                    };
                }
                yield toVoidPromise(metaDataStore.put(updated));
            }
        });
    }
    static _setSyncRequired(meta) {
        if (meta.deleted === 1 || meta.created === 1 || meta.uncommitted === 1) {
            meta.syncRequired = 1;
        }
        else {
            delete meta.syncRequired;
        }
    }
    static _isMetaDataNeeded(meta) {
        return meta.subscribed === 1 || meta.syncRequired === 1;
    }
    createModelOffline(modelCreation) {
        const stores = [
            IdbSchema.ModelCreation.Store,
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(stores, ([creationStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            yield toVoidPromise(creationStore.put(modelCreation));
            const version = 1;
            const lastSequenceNumber = 0;
            const now = new Date();
            const permissions = new ModelPermissions(true, true, true, true);
            const modelState = {
                modelId: modelCreation.modelId,
                collection: modelCreation.collection,
                valueIdPrefix: { prefix: "0", increment: 0 },
                version,
                lastSequenceNumber,
                createdTime: now,
                modifiedTime: now,
                permissions,
                local: true,
                snapshot: {
                    version,
                    sequenceNumber: lastSequenceNumber,
                    data: modelCreation.initialData,
                    localOperations: [],
                    serverOperations: []
                },
            };
            yield IdbModelStore_IdbModelStore._putModelState(modelState, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore);
        }));
    }
    deleteModel(modelId) {
        const stores = [
            IdbSchema.ModelCreation.Store,
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(stores, ([creationStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const metaData = yield toPromise(modelMetaDataStore.get(modelId));
            if (!metaData) {
                throw new Error(`Can't delete model '${modelId}' because it doesn't exist.`);
            }
            delete metaData.details;
            delete metaData.subscribed;
            delete metaData.available;
            delete metaData.uncommitted;
            if (metaData.created === 1) {
                delete metaData.created;
            }
            else {
                metaData.deleted = 1;
            }
            IdbModelStore_IdbModelStore._setSyncRequired(metaData);
            yield toVoidPromise(modelMetaDataStore.put(metaData));
            yield toVoidPromise(creationStore.delete(modelId));
            yield IdbModelStore_IdbModelStore._deleteLocalOperationsForModel(localOpStore, modelId);
            yield IdbModelStore_IdbModelStore._deleteServerOperationsForModel(serverOpStore, modelId);
            yield toVoidPromise(modelDataStore.delete(modelId));
        }));
    }
    modelDeleted(modelId) {
        const stores = [
            IdbSchema.ModelMetaData.Store
        ];
        return this._withWriteStores(stores, ([modelMetaDataStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const metaData = yield toPromise(modelMetaDataStore.get(modelId));
            if (metaData) {
                delete metaData.deleted;
                IdbModelStore_IdbModelStore._setSyncRequired(metaData);
                yield toVoidPromise(modelMetaDataStore.put(metaData));
            }
        }));
    }
    modelCreated(modelId) {
        const stores = [
            IdbSchema.ModelCreation.Store,
            IdbSchema.ModelMetaData.Store
        ];
        return this._withWriteStores(stores, ([creationStore, modelMetaDataStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            creationStore.delete(modelId);
            const metaData = yield toPromise(modelMetaDataStore.get(modelId));
            metaData.available = 1;
            delete metaData.created;
            IdbModelStore_IdbModelStore._setSyncRequired(metaData);
            yield toVoidPromise(modelMetaDataStore.put(metaData));
        }));
    }
    deleteIfNotNeeded(modelId) {
        const storeNames = [
            IdbSchema.ModelCreation.Store,
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(storeNames, ([createStore, metaDataStore, dataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const metaData = yield toPromise(metaDataStore.get(modelId));
            if (metaData && !IdbModelStore_IdbModelStore._isMetaDataNeeded(metaData)) {
                yield IdbModelStore_IdbModelStore._deleteModel(modelId, createStore, metaDataStore, dataStore, localOpStore, serverOpStore);
                return true;
            }
            else {
                return false;
            }
        }));
    }
    getModelCreationData(modelId) {
        return this._withReadStore(IdbSchema.ModelCreation.Store, (store) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            return toPromise(store.get(modelId));
        }));
    }
    putModelState(modelState) {
        const stores = [
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(stores, ([modelMetaData, modelDataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            yield IdbModelStore_IdbModelStore._putModelState(modelState, modelMetaData, modelDataStore, localOpStore, serverOpStore);
        }));
    }
    updateOfflineModel(update) {
        const stores = [
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelServerOperation.Store,
        ];
        return this._withWriteStores(stores, ([modelMetaDataStore, modelDataStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const { modelId, dataUpdate, permissionsUpdate } = update;
            const modelMetaData = yield toPromise(modelMetaDataStore.get(modelId));
            if (modelMetaData === undefined) {
                return;
            }
            if (modelMetaData.uncommitted) {
                throw new Error(`A model update was received for an model ('${modelId}')with uncommitted operations.`);
            }
            yield IdbModelStore_IdbModelStore._deleteServerOperationsForModel(serverOpStore, modelId);
            if (dataUpdate) {
                modelMetaData.details.version = dataUpdate.version;
                modelMetaData.details.createdTime = dataUpdate.createdTime;
                modelMetaData.details.modifiedTime = dataUpdate.modifiedTime;
                modelMetaData.details.snapshotSequenceNumber = modelMetaData.details.lastSequenceNumber;
                modelMetaData.details.snapshotVersion = dataUpdate.version;
                const data = {
                    modelId,
                    data: dataUpdate.data
                };
                yield toVoidPromise(modelDataStore.put(data));
            }
            if (permissionsUpdate) {
                modelMetaData.details.permissions = permissionsUpdate;
            }
            return toVoidPromise(modelMetaDataStore.put(modelMetaData));
        }));
    }
    modelExists(modelId) {
        if (modelId === undefined || modelId === null) {
            throw new Error("modelId must be defined");
        }
        return this._withReadStore(IdbSchema.ModelMetaData.Store, (store) => {
            const idx = store.index(IdbSchema.ModelMetaData.Indices.ModelId);
            return toPromise(idx.count(modelId)).then((count => count > 0));
        });
    }
    getModelsRequiringSync() {
        return this._withReadStore(IdbSchema.ModelMetaData.Store, (store) => {
            const idx = store.index(IdbSchema.ModelMetaData.Indices.SyncRequired);
            return toPromise(idx.getAll()).then((docs) => docs.map(IdbModelStore_IdbModelStore._metaDataDocToMetaData));
        });
    }
    processServerOperation(serverOp) {
        if (!serverOp) {
            throw new Error("serverOp was undefined.");
        }
        const stores = [
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(stores, ([modelMetaDataStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const metaData = yield toPromise(modelMetaDataStore.get(serverOp.modelId));
            if (!metaData) {
                throw new Error(`Model meta data for model '${serverOp.modelId}' not found when processing a server operation.`);
            }
            if (!metaData.details) {
                throw new Error(`Can't store server operation for Model '${serverOp.modelId}' because the model details are missing from storage.`);
            }
            metaData.details.version = serverOp.version + 1;
            metaData.details.modifiedTime = serverOp.timestamp;
            yield toVoidPromise(serverOpStore.add(serverOp));
            yield toVoidPromise(modelMetaDataStore.put(metaData));
        }));
    }
    processLocalOperation(localOp) {
        if (!localOp) {
            throw new Error("localOp was undefined.");
        }
        const stores = [
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelLocalOperation.Store
        ];
        return this._withWriteStores(stores, ([modelMetaDataStore, localOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const metaData = yield toPromise(modelMetaDataStore.get(localOp.modelId));
            if (!metaData) {
                throw new Error(`Model meta data for model '${localOp.modelId}' not found when processing a local operation.`);
            }
            if (!metaData.details) {
                throw new Error(`Can't store local operation for Model '${localOp.modelId}' because the model details are missing from storage.`);
            }
            metaData.uncommitted = 1;
            metaData.details.lastSequenceNumber = localOp.sequenceNumber;
            IdbModelStore_IdbModelStore._setSyncRequired(metaData);
            yield toVoidPromise(localOpStore.add(localOp));
            yield toVoidPromise(modelMetaDataStore.put(metaData));
        }));
    }
    processOperationAck(modelId, seqNo, serverOp) {
        const stores = [
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store,
            IdbSchema.ModelMetaData.Store
        ];
        return this._withWriteStores(stores, ([localOpStore, serverOpStore, modelMetaDataStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const metaData = yield toPromise(modelMetaDataStore.get(modelId));
            if (!metaData) {
                throw new Error(`Model meta data for model '${modelId}' not found when processing a local operation acknowledgement.`);
            }
            if (!metaData.details) {
                throw new Error(`Can't store operation ack for Model '${modelId}' because the model details are missing from storage.`);
            }
            metaData.details.version = serverOp.version + 1;
            metaData.details.modifiedTime = serverOp.timestamp;
            yield toVoidPromise(localOpStore.delete([modelId, seqNo]));
            yield toVoidPromise(serverOpStore.add(serverOp));
            const idx = localOpStore.index(IdbSchema.ModelLocalOperation.Indices.ModelId);
            const dirty = yield toPromise(idx.count(modelId)).then((count => count > 0));
            if (dirty) {
                metaData.uncommitted = 1;
            }
            else {
                delete metaData.uncommitted;
            }
            IdbModelStore_IdbModelStore._setSyncRequired(metaData);
            yield toVoidPromise(modelMetaDataStore.put(metaData));
        }));
    }
    getModelState(modelId) {
        if (modelId === undefined || modelId === null) {
            throw new Error("modelId must be defined");
        }
        const stores = [
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withReadStores(stores, ([modelMetaDataStore, modelDataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const meta = yield toPromise(modelMetaDataStore.get(modelId));
            const data = yield toPromise(modelDataStore.get(modelId));
            if (meta && data) {
                const localOpsIndex = localOpStore.index(IdbSchema.ModelLocalOperation.Indices.ModelId);
                const localOperations = yield toPromise(localOpsIndex.getAll(modelId));
                const serverOpsIndex = serverOpStore.index(IdbSchema.ModelServerOperation.Indices.ModelId);
                const serverOperations = yield toPromise(serverOpsIndex.getAll(modelId));
                const snapshot = {
                    version: meta.details.snapshotVersion,
                    sequenceNumber: meta.details.snapshotSequenceNumber,
                    data: data.data,
                    localOperations,
                    serverOperations
                };
                const version = meta.details.version;
                const lastSequenceNumber = meta.details.lastSequenceNumber;
                return {
                    modelId: meta.modelId,
                    collection: meta.details.collection,
                    createdTime: meta.details.createdTime,
                    modifiedTime: meta.details.modifiedTime,
                    version,
                    lastSequenceNumber,
                    valueIdPrefix: Object.assign({}, meta.details.valueIdPrefix),
                    permissions: new ModelPermissions(meta.details.permissions.read, meta.details.permissions.write, meta.details.permissions.remove, meta.details.permissions.manage),
                    local: meta.created === 1,
                    snapshot
                };
            }
            else {
                return;
            }
        }));
    }
    getAllModelMetaData() {
        return this._getAll(IdbSchema.ModelMetaData.Store)
            .then(results => results.map(IdbModelStore_IdbModelStore._metaDataDocToMetaData));
    }
    getModelMetaData(modelId) {
        return this._withReadStore(IdbSchema.ModelMetaData.Store, (store) => {
            return toPromise(store.get(modelId))
                .then(doc => {
                if (doc) {
                    return IdbModelStore_IdbModelStore._metaDataDocToMetaData(doc);
                }
            });
        });
    }
    setModelSubscriptions(modelIds) {
        const storeNames = [
            IdbSchema.ModelCreation.Store,
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(storeNames, ([createStore, metaDataStore, dataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const index = metaDataStore.index(IdbSchema.ModelMetaData.Indices.Subscribed);
            const subscribed = yield toPromise(index.getAll());
            const subscribedModelIds = subscribed.map(s => s.modelId);
            const toAdd = modelIds.filter(id => !subscribedModelIds.includes(id));
            const toRemove = subscribedModelIds.filter(id => !modelIds.includes(id));
            yield IdbModelStore_IdbModelStore._removeSubscriptions(toRemove, createStore, metaDataStore, dataStore, localOpStore, serverOpStore);
            yield IdbModelStore_IdbModelStore._addSubscriptions(toAdd, metaDataStore);
        }));
    }
    getSubscribedModels() {
        const storeName = IdbSchema.ModelMetaData.Store;
        return this._withReadStore(storeName, (store) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const index = store.index(IdbSchema.ModelMetaData.Indices.Subscribed);
            const subscribed = yield toPromise(index.getAll());
            return subscribed.map(IdbModelStore_IdbModelStore._metaDataDocToMetaData);
        }));
    }
    addSubscriptions(modelIds) {
        const storeName = IdbSchema.ModelMetaData.Store;
        return this._withWriteStore(storeName, (store) => IdbModelStore_IdbModelStore._addSubscriptions(modelIds, store));
    }
    removeSubscriptions(modelIds) {
        const stores = [
            IdbSchema.ModelCreation.Store,
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelLocalOperation.Store,
            IdbSchema.ModelServerOperation.Store,
        ];
        return this._withWriteStores(stores, ([createStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            return IdbModelStore_IdbModelStore._removeSubscriptions(modelIds, createStore, modelMetaDataStore, modelDataStore, localOpStore, serverOpStore);
        }));
    }
    snapshotModel(modelId, version, sequenceNumber, modelData) {
        const stores = [
            IdbSchema.ModelMetaData.Store,
            IdbSchema.ModelData.Store,
            IdbSchema.ModelServerOperation.Store
        ];
        return this._withWriteStores(stores, ([metaDataStore, modelDataStore, serverOpStore]) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const meta = yield toPromise(metaDataStore.get(modelId));
            meta.details.snapshotVersion = version;
            meta.details.snapshotSequenceNumber = sequenceNumber;
            yield toVoidPromise(metaDataStore.put(meta));
            const data = {
                modelId,
                data: modelData
            };
            yield toVoidPromise(modelDataStore.put(data));
            yield IdbModelStore_IdbModelStore._deleteServerOperationsForModel(serverOpStore, modelId);
        }));
    }
    claimValueIdPrefix(modelId) {
        return this._withWriteStore(IdbSchema.ModelMetaData.Store, (store) => IdbModelStore_awaiter(this, void 0, void 0, function* () {
            const meta = yield toPromise(store.get(modelId));
            if (!meta || !meta.details) {
                throw new ConvergenceError("No such offline model available: " + modelId);
            }
            const result = Object.assign({}, meta.details.valueIdPrefix);
            meta.details.valueIdPrefix.increment = meta.details.valueIdPrefix.increment + 1;
            yield toVoidPromise(store.put(meta));
            return result;
        }));
    }
}

// CONCATENATED MODULE: ./src/main/storage/idb/IdbSchemaVersion1.ts

class IdbSchemaVersion1_IdbSchemaVersion1 {
    static upgrade(db) {
        const localModelStore = db.createObjectStore(IdbSchema.ModelCreation.Store, { keyPath: IdbSchema.ModelCreation.Fields.ModelId });
        localModelStore.createIndex(IdbSchema.ModelCreation.Indices.ModelId, IdbSchema.ModelCreation.Fields.ModelId, { unique: true });
        const modelMetaData = db.createObjectStore(IdbSchema.ModelMetaData.Store, { keyPath: IdbSchema.ModelMetaData.Fields.ModelId });
        modelMetaData.createIndex(IdbSchema.ModelMetaData.Indices.ModelId, IdbSchema.ModelMetaData.Fields.ModelId, { unique: true });
        modelMetaData.createIndex(IdbSchema.ModelMetaData.Indices.Created, IdbSchema.ModelMetaData.Fields.Created, { unique: false });
        modelMetaData.createIndex(IdbSchema.ModelMetaData.Indices.Deleted, IdbSchema.ModelMetaData.Fields.Deleted, { unique: false });
        modelMetaData.createIndex(IdbSchema.ModelMetaData.Indices.Uncommitted, IdbSchema.ModelMetaData.Fields.Uncommitted, { unique: false });
        modelMetaData.createIndex(IdbSchema.ModelMetaData.Indices.SyncRequired, IdbSchema.ModelMetaData.Fields.SyncRequired, { unique: false });
        modelMetaData.createIndex(IdbSchema.ModelMetaData.Indices.Subscribed, IdbSchema.ModelMetaData.Fields.Subscribed, { unique: false });
        const modelData = db.createObjectStore(IdbSchema.ModelData.Store, { keyPath: IdbSchema.ModelData.Fields.ModelId });
        modelData.createIndex(IdbSchema.ModelData.Indices.ModelId, IdbSchema.ModelData.Fields.ModelId, { unique: true });
        const serverOperationStore = db.createObjectStore(IdbSchema.ModelServerOperation.Store, { keyPath: [IdbSchema.ModelServerOperation.Fields.ModelId, IdbSchema.ModelServerOperation.Fields.Version] });
        serverOperationStore.createIndex(IdbSchema.ModelServerOperation.Indices.ModelId, IdbSchema.ModelServerOperation.Fields.ModelId, { unique: false });
        serverOperationStore.createIndex(IdbSchema.ModelServerOperation.Indices.ModelId_Version, [IdbSchema.ModelServerOperation.Fields.ModelId, IdbSchema.ModelServerOperation.Fields.Version], { unique: true });
        const localOperationStore = db.createObjectStore(IdbSchema.ModelLocalOperation.Store, {
            keyPath: [
                IdbSchema.ModelLocalOperation.Fields.ModelId,
                IdbSchema.ModelLocalOperation.Fields.SequenceNumber
            ]
        });
        localOperationStore.createIndex(IdbSchema.ModelLocalOperation.Indices.ModelId, IdbSchema.ModelLocalOperation.Fields.ModelId, { unique: false });
        localOperationStore.createIndex(IdbSchema.ModelLocalOperation.Indices.ModelId_SequenceNumber, [
            IdbSchema.ModelLocalOperation.Fields.ModelId,
            IdbSchema.ModelLocalOperation.Fields.SequenceNumber
        ], { unique: true });
        const userStore = db.createObjectStore(IdbSchema.DomainUser.Store, {
            keyPath: [
                IdbSchema.DomainUser.Fields.UserType,
                IdbSchema.DomainUser.Fields.Username,
            ]
        });
        userStore.createIndex(IdbSchema.DomainUser.Indices.UserType_Username, [
            IdbSchema.DomainUser.Fields.UserType,
            IdbSchema.DomainUser.Fields.Username,
        ], { unique: true });
        const sessionStore = db.createObjectStore(IdbSchema.Session.Store, {
            keyPath: [
                IdbSchema.Session.Fields.SessionId
            ]
        });
        sessionStore.createIndex(IdbSchema.Session.Indices.UserType_Username, [
            IdbSchema.Session.Fields.UserType,
            IdbSchema.Session.Fields.Username,
        ], { unique: false });
        sessionStore.createIndex(IdbSchema.Session.Indices.SessionId, [
            IdbSchema.Session.Fields.SessionId
        ], { unique: true });
    }
}

// CONCATENATED MODULE: ./src/main/storage/idb/IdbSchemaManager.ts

class IdbSchemaManager_IdbSchemaManager {
    static upgrade(db, targetVersion) {
        switch (targetVersion) {
            case 1:
                IdbSchemaVersion1_IdbSchemaVersion1.upgrade(db);
            default:
        }
    }
}

// CONCATENATED MODULE: ./src/main/storage/idb/IdbIdentityStore.ts
var IdbIdentityStore_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class IdbIdentityStore_IdbIdentityStore extends IdbPersistenceStore_IdbPersistenceStore {
    putUser(user) {
        const store = IdbSchema.DomainUser.Store;
        return this._withWriteStore(store, (userStore) => IdbIdentityStore_awaiter(this, void 0, void 0, function* () {
            const userData = {
                userType: user.userId.userType,
                username: user.userId.username,
                displayName: user.displayName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            yield toVoidPromise(userStore.put(userData));
        }));
    }
    getUsers() {
        return IdbIdentityStore_awaiter(this, void 0, void 0, function* () {
            const store = IdbSchema.DomainUser.Store;
            const userData = yield this._getAll(store);
            return userData.map(user => new DomainUser_DomainUser(user.userType, user.username, user.firstName, user.lastName, user.displayName, user.email));
        });
    }
    putSession(sessionId, userId) {
        const store = IdbSchema.Session.Store;
        return this._withWriteStore(store, (sessionStore) => IdbIdentityStore_awaiter(this, void 0, void 0, function* () {
            const data = {
                sessionId,
                userType: userId.userType,
                username: userId.username
            };
            yield toVoidPromise(sessionStore.put(data));
        }));
    }
    getSessions() {
        return IdbIdentityStore_awaiter(this, void 0, void 0, function* () {
            const store = IdbSchema.Session.Store;
            const entries = yield this._getAll(store);
            const sessions = new Map();
            entries.forEach(entry => {
                sessions.set(entry.sessionId, new DomainUserId(entry.userType, entry.username));
            });
            return sessions;
        });
    }
}

// CONCATENATED MODULE: ./src/main/storage/idb/IdbStorageAdapter.ts




class IdbStorageAdapter_IdbStorageAdapter {
    constructor() {
        this._db = null;
        this._disposed = false;
    }
    adapterId() {
        return "Indexed DB Storage";
    }
    initialize(namespace, domainId, username) {
        if (!namespace) {
            throw new Error("namespace must be a non-empty string");
        }
        if (!domainId) {
            throw new Error("domain must be a non-empty string");
        }
        if (!username) {
            throw new Error("username must be a non-empty string");
        }
        const dbName = `${IdbStorageAdapter_IdbStorageAdapter._DATABASE_NAME}:${namespace}/${domainId}/${username}`;
        const openRequest = indexedDB.open(dbName, IdbStorageAdapter_IdbStorageAdapter._VERSION);
        let exists = true;
        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            const version = openRequest.result.version;
            exists = version === 1;
            IdbSchemaManager_IdbSchemaManager.upgrade(db, version);
        };
        return toPromise(openRequest).then((db) => {
            this._db = db;
            this._modelStore = new IdbModelStore_IdbModelStore(this._db);
            this._identityStore = new IdbIdentityStore_IdbIdentityStore(this._db);
        });
    }
    isInitialized() {
        return this._db !== null;
    }
    modelStore() {
        return this._modelStore;
    }
    identityStore() {
        return this._identityStore;
    }
    destroy() {
        const name = this._db.name;
        this.dispose();
        indexedDB.deleteDatabase(name);
    }
    dispose() {
        if (!this.isInitialized()) {
            throw new Error("Can not disposed a storage adapter that is not initialized");
        }
        if (this.isDisposed()) {
            throw new Error("Already disposed");
        }
        this._db.close();
        this._db = null;
        this._disposed = true;
    }
    isDisposed() {
        return this._disposed;
    }
}
IdbStorageAdapter_IdbStorageAdapter._DATABASE_NAME = "convergence.offline.storage";
IdbStorageAdapter_IdbStorageAdapter._VERSION = 1;

// CONCATENATED MODULE: ./src/main/storage/idb/index.ts


// CONCATENATED MODULE: ./src/main/storage/index.ts


// CONCATENATED MODULE: ./src/main/index.ts
/* concated harmony reexport Convergence */__webpack_require__.d(__webpack_exports__, "Convergence", function() { return Convergence_Convergence; });
/* concated harmony reexport connect */__webpack_require__.d(__webpack_exports__, "connect", function() { return connect; });
/* concated harmony reexport connectWithPassword */__webpack_require__.d(__webpack_exports__, "connectWithPassword", function() { return connectWithPassword; });
/* concated harmony reexport connectAnonymously */__webpack_require__.d(__webpack_exports__, "connectAnonymously", function() { return connectAnonymously; });
/* concated harmony reexport connectWithJwt */__webpack_require__.d(__webpack_exports__, "connectWithJwt", function() { return connectWithJwt; });
/* concated harmony reexport reconnect */__webpack_require__.d(__webpack_exports__, "reconnect", function() { return reconnect; });
/* concated harmony reexport configureLogging */__webpack_require__.d(__webpack_exports__, "configureLogging", function() { return configureLogging; });
/* concated harmony reexport ConvergenceSession */__webpack_require__.d(__webpack_exports__, "ConvergenceSession", function() { return ConvergenceSession_ConvergenceSession; });
/* concated harmony reexport ConvergenceDomain */__webpack_require__.d(__webpack_exports__, "ConvergenceDomain", function() { return ConvergenceDomain_ConvergenceDomain; });
/* concated harmony reexport ActivityParticipant */__webpack_require__.d(__webpack_exports__, "ActivityParticipant", function() { return ActivityParticipant_ActivityParticipant; });
/* concated harmony reexport Activity */__webpack_require__.d(__webpack_exports__, "Activity", function() { return Activity_Activity; });
/* concated harmony reexport ActivityService */__webpack_require__.d(__webpack_exports__, "ActivityService", function() { return ActivityService_ActivityService; });
/* concated harmony reexport ActivitySessionJoinedEvent */__webpack_require__.d(__webpack_exports__, "ActivitySessionJoinedEvent", function() { return ActivitySessionJoinedEvent; });
/* concated harmony reexport ActivitySessionLeftEvent */__webpack_require__.d(__webpack_exports__, "ActivitySessionLeftEvent", function() { return ActivitySessionLeftEvent; });
/* concated harmony reexport ActivityStateSetEvent */__webpack_require__.d(__webpack_exports__, "ActivityStateSetEvent", function() { return ActivityStateSetEvent; });
/* concated harmony reexport ActivityStateRemovedEvent */__webpack_require__.d(__webpack_exports__, "ActivityStateRemovedEvent", function() { return ActivityStateRemovedEvent; });
/* concated harmony reexport ActivityStateClearedEvent */__webpack_require__.d(__webpack_exports__, "ActivityStateClearedEvent", function() { return ActivityStateClearedEvent; });
/* concated harmony reexport ActivityStateDeltaEvent */__webpack_require__.d(__webpack_exports__, "ActivityStateDeltaEvent", function() { return ActivityStateDeltaEvent; });
/* concated harmony reexport ChatService */__webpack_require__.d(__webpack_exports__, "ChatService", function() { return ChatService_ChatService; });
/* concated harmony reexport Chat */__webpack_require__.d(__webpack_exports__, "Chat", function() { return Chat_Chat; });
/* concated harmony reexport ChatChannel */__webpack_require__.d(__webpack_exports__, "ChatChannel", function() { return ChatChannel_ChatChannel; });
/* concated harmony reexport ChatTypes */__webpack_require__.d(__webpack_exports__, "ChatTypes", function() { return ChatTypes; });
/* concated harmony reexport createChatInfo */__webpack_require__.d(__webpack_exports__, "createChatInfo", function() { return createChatInfo; });
/* concated harmony reexport ChatPermissionManager */__webpack_require__.d(__webpack_exports__, "ChatPermissionManager", function() { return ChatPermissionManager_ChatPermissionManager; });
/* concated harmony reexport ChatRoom */__webpack_require__.d(__webpack_exports__, "ChatRoom", function() { return ChatRoom_ChatRoom; });
/* concated harmony reexport DirectChat */__webpack_require__.d(__webpack_exports__, "DirectChat", function() { return DirectChat_DirectChat; });
/* concated harmony reexport MembershipChat */__webpack_require__.d(__webpack_exports__, "MembershipChat", function() { return MembershipChat_MembershipChat; });
/* concated harmony reexport ChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "ChatHistoryEntry", function() { return ChatHistoryEntry; });
/* concated harmony reexport ChannelCreatedHistoryEntry */__webpack_require__.d(__webpack_exports__, "ChannelCreatedHistoryEntry", function() { return ChannelCreatedHistoryEntry_ChannelCreatedHistoryEntry; });
/* concated harmony reexport MessageChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "MessageChatHistoryEntry", function() { return MessageChatHistoryEntry_MessageChatHistoryEntry; });
/* concated harmony reexport NameChangedChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "NameChangedChatHistoryEntry", function() { return NameChangedChatHistoryEntry_NameChangedChatHistoryEntry; });
/* concated harmony reexport TopicChangedChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "TopicChangedChatHistoryEntry", function() { return TopicChangedChatHistoryEntry_TopicChangedChatHistoryEntry; });
/* concated harmony reexport UserAddedChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "UserAddedChatHistoryEntry", function() { return UserAddedChatHistoryEntry_UserAddedChatHistoryEntry; });
/* concated harmony reexport UserJoinedChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "UserJoinedChatHistoryEntry", function() { return UserJoinedChatHistoryEntry_UserJoinedChatHistoryEntry; });
/* concated harmony reexport UserLeftChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "UserLeftChatHistoryEntry", function() { return UserLeftChatHistoryEntry_UserLeftChatHistoryEntry; });
/* concated harmony reexport UserRemovedChatHistoryEntry */__webpack_require__.d(__webpack_exports__, "UserRemovedChatHistoryEntry", function() { return UserRemovedChatHistoryEntry_UserRemovedChatHistoryEntry; });
/* concated harmony reexport ChatEvent */__webpack_require__.d(__webpack_exports__, "ChatEvent", function() { return ChatEvent; });
/* concated harmony reexport ChatJoinedEvent */__webpack_require__.d(__webpack_exports__, "ChatJoinedEvent", function() { return ChatJoinedEvent; });
/* concated harmony reexport ChatLeftEvent */__webpack_require__.d(__webpack_exports__, "ChatLeftEvent", function() { return ChatLeftEvent; });
/* concated harmony reexport ChatMessageEvent */__webpack_require__.d(__webpack_exports__, "ChatMessageEvent", function() { return ChatMessageEvent_ChatMessageEvent; });
/* concated harmony reexport ChatNameChangedEvent */__webpack_require__.d(__webpack_exports__, "ChatNameChangedEvent", function() { return ChatNameChangedEvent_ChatNameChangedEvent; });
/* concated harmony reexport ChatRemovedEvent */__webpack_require__.d(__webpack_exports__, "ChatRemovedEvent", function() { return ChatRemovedEvent; });
/* concated harmony reexport ChatTopicChangedEvent */__webpack_require__.d(__webpack_exports__, "ChatTopicChangedEvent", function() { return ChatTopicChangedEvent_ChatTopicChangedEvent; });
/* concated harmony reexport UserAddedEvent */__webpack_require__.d(__webpack_exports__, "UserAddedEvent", function() { return UserAddedEvent_UserAddedEvent; });
/* concated harmony reexport UserJoinedEvent */__webpack_require__.d(__webpack_exports__, "UserJoinedEvent", function() { return UserJoinedEvent_UserJoinedEvent; });
/* concated harmony reexport UserLeftEvent */__webpack_require__.d(__webpack_exports__, "UserLeftEvent", function() { return UserLeftEvent_UserLeftEvent; });
/* concated harmony reexport UserRemovedEvent */__webpack_require__.d(__webpack_exports__, "UserRemovedEvent", function() { return UserRemovedEvent_UserRemovedEvent; });
/* concated harmony reexport DomainUser */__webpack_require__.d(__webpack_exports__, "DomainUser", function() { return DomainUser_DomainUser; });
/* concated harmony reexport IdentityService */__webpack_require__.d(__webpack_exports__, "IdentityService", function() { return IdentityService_IdentityService; });
/* concated harmony reexport DomainUserType */__webpack_require__.d(__webpack_exports__, "DomainUserType", function() { return DomainUserType; });
/* concated harmony reexport DomainUserId */__webpack_require__.d(__webpack_exports__, "DomainUserId", function() { return DomainUserId; });
/* concated harmony reexport ModelServiceEventConstants */__webpack_require__.d(__webpack_exports__, "ModelServiceEventConstants", function() { return ModelServiceEventConstants; });
/* concated harmony reexport ModelService */__webpack_require__.d(__webpack_exports__, "ModelService", function() { return ModelService_ModelService; });
/* concated harmony reexport ModelPermissionManager */__webpack_require__.d(__webpack_exports__, "ModelPermissionManager", function() { return ModelPermissionManager_ModelPermissionManager; });
/* concated harmony reexport ModelPermissions */__webpack_require__.d(__webpack_exports__, "ModelPermissions", function() { return ModelPermissions; });
/* concated harmony reexport ArrayInsertEvent */__webpack_require__.d(__webpack_exports__, "ArrayInsertEvent", function() { return ArrayInsertEvent; });
/* concated harmony reexport ArrayRemoveEvent */__webpack_require__.d(__webpack_exports__, "ArrayRemoveEvent", function() { return ArrayRemoveEvent; });
/* concated harmony reexport ArrayReorderEvent */__webpack_require__.d(__webpack_exports__, "ArrayReorderEvent", function() { return ArrayReorderEvent; });
/* concated harmony reexport ArraySetEvent */__webpack_require__.d(__webpack_exports__, "ArraySetEvent", function() { return ArraySetEvent; });
/* concated harmony reexport ArraySetValueEvent */__webpack_require__.d(__webpack_exports__, "ArraySetValueEvent", function() { return ArraySetValueEvent; });
/* concated harmony reexport ObjectRemoveEvent */__webpack_require__.d(__webpack_exports__, "ObjectRemoveEvent", function() { return ObjectRemoveEvent; });
/* concated harmony reexport ObjectSetEvent */__webpack_require__.d(__webpack_exports__, "ObjectSetEvent", function() { return ObjectSetEvent; });
/* concated harmony reexport ObjectSetValueEvent */__webpack_require__.d(__webpack_exports__, "ObjectSetValueEvent", function() { return ObjectSetValueEvent; });
/* concated harmony reexport BooleanSetValueEvent */__webpack_require__.d(__webpack_exports__, "BooleanSetValueEvent", function() { return BooleanSetValueEvent; });
/* concated harmony reexport DateSetValueEvent */__webpack_require__.d(__webpack_exports__, "DateSetValueEvent", function() { return DateSetValueEvent; });
/* concated harmony reexport NumberSetValueEvent */__webpack_require__.d(__webpack_exports__, "NumberSetValueEvent", function() { return NumberSetValueEvent; });
/* concated harmony reexport NumberDeltaEvent */__webpack_require__.d(__webpack_exports__, "NumberDeltaEvent", function() { return NumberDeltaEvent; });
/* concated harmony reexport StringInsertEvent */__webpack_require__.d(__webpack_exports__, "StringInsertEvent", function() { return StringInsertEvent; });
/* concated harmony reexport StringRemoveEvent */__webpack_require__.d(__webpack_exports__, "StringRemoveEvent", function() { return StringRemoveEvent; });
/* concated harmony reexport StringSetValueEvent */__webpack_require__.d(__webpack_exports__, "StringSetValueEvent", function() { return StringSetValueEvent; });
/* concated harmony reexport ElementDetachedEvent */__webpack_require__.d(__webpack_exports__, "ElementDetachedEvent", function() { return ElementDetachedEvent; });
/* concated harmony reexport ModelChangedEvent */__webpack_require__.d(__webpack_exports__, "ModelChangedEvent", function() { return ModelChangedEvent; });
/* concated harmony reexport ModelClosedEvent */__webpack_require__.d(__webpack_exports__, "ModelClosedEvent", function() { return ModelClosedEvent; });
/* concated harmony reexport ModelDeletedEvent */__webpack_require__.d(__webpack_exports__, "ModelDeletedEvent", function() { return ModelDeletedEvent; });
/* concated harmony reexport ModelPermissionsChangedEvent */__webpack_require__.d(__webpack_exports__, "ModelPermissionsChangedEvent", function() { return ModelPermissionsChangedEvent; });
/* concated harmony reexport VersionChangedEvent */__webpack_require__.d(__webpack_exports__, "VersionChangedEvent", function() { return VersionChangedEvent; });
/* concated harmony reexport ModelOnlineEvent */__webpack_require__.d(__webpack_exports__, "ModelOnlineEvent", function() { return ModelOnlineEvent; });
/* concated harmony reexport ModelOfflineEvent */__webpack_require__.d(__webpack_exports__, "ModelOfflineEvent", function() { return ModelOfflineEvent; });
/* concated harmony reexport ModelReconnectingEvent */__webpack_require__.d(__webpack_exports__, "ModelReconnectingEvent", function() { return ModelReconnectingEvent; });
/* concated harmony reexport ResyncStartedEvent */__webpack_require__.d(__webpack_exports__, "ResyncStartedEvent", function() { return ResyncStartedEvent; });
/* concated harmony reexport ResyncCompletedEvent */__webpack_require__.d(__webpack_exports__, "ResyncCompletedEvent", function() { return ResyncCompletedEvent; });
/* concated harmony reexport ResyncErrorEvent */__webpack_require__.d(__webpack_exports__, "ResyncErrorEvent", function() { return ResyncErrorEvent; });
/* concated harmony reexport RemoteReferenceCreatedEvent */__webpack_require__.d(__webpack_exports__, "RemoteReferenceCreatedEvent", function() { return RemoteReferenceCreatedEvent; });
/* concated harmony reexport RemoteResyncStartedEvent */__webpack_require__.d(__webpack_exports__, "RemoteResyncStartedEvent", function() { return RemoteResyncStartedEvent; });
/* concated harmony reexport RemoteResyncCompletedEvent */__webpack_require__.d(__webpack_exports__, "RemoteResyncCompletedEvent", function() { return RemoteResyncCompletedEvent; });
/* concated harmony reexport CollaboratorOpenedEvent */__webpack_require__.d(__webpack_exports__, "CollaboratorOpenedEvent", function() { return CollaboratorOpenedEvent; });
/* concated harmony reexport CollaboratorClosedEvent */__webpack_require__.d(__webpack_exports__, "CollaboratorClosedEvent", function() { return CollaboratorClosedEvent; });
/* concated harmony reexport ModelCommittedEvent */__webpack_require__.d(__webpack_exports__, "ModelCommittedEvent", function() { return ModelCommittedEvent; });
/* concated harmony reexport ModelModifiedEvent */__webpack_require__.d(__webpack_exports__, "ModelModifiedEvent", function() { return ModelModifiedEvent; });
/* concated harmony reexport OfflineModelDownloadPendingEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelDownloadPendingEvent", function() { return OfflineModelDownloadPendingEvent; });
/* concated harmony reexport OfflineModelDownloadCompletedEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelDownloadCompletedEvent", function() { return OfflineModelDownloadCompletedEvent; });
/* concated harmony reexport OfflineModelSyncStartedEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelSyncStartedEvent", function() { return OfflineModelSyncStartedEvent; });
/* concated harmony reexport OfflineModelSyncCompletedEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelSyncCompletedEvent", function() { return OfflineModelSyncCompletedEvent; });
/* concated harmony reexport OfflineModelSyncErrorEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelSyncErrorEvent", function() { return OfflineModelSyncErrorEvent; });
/* concated harmony reexport OfflineModelDeletedEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelDeletedEvent", function() { return OfflineModelDeletedEvent; });
/* concated harmony reexport OfflineModelPermissionsRevokedEvent */__webpack_require__.d(__webpack_exports__, "OfflineModelPermissionsRevokedEvent", function() { return OfflineModelPermissionsRevokedEvent; });
/* concated harmony reexport HistoricalArray */__webpack_require__.d(__webpack_exports__, "HistoricalArray", function() { return HistoricalArray_HistoricalArray; });
/* concated harmony reexport HistoricalBoolean */__webpack_require__.d(__webpack_exports__, "HistoricalBoolean", function() { return HistoricalBoolean_HistoricalBoolean; });
/* concated harmony reexport HistoricalElement */__webpack_require__.d(__webpack_exports__, "HistoricalElement", function() { return HistoricalElement_HistoricalElement; });
/* concated harmony reexport HistoricalModel */__webpack_require__.d(__webpack_exports__, "HistoricalModel", function() { return HistoricalModel_HistoricalModel; });
/* concated harmony reexport HistoricalNull */__webpack_require__.d(__webpack_exports__, "HistoricalNull", function() { return HistoricalNull_HistoricalNull; });
/* concated harmony reexport HistoricalNumber */__webpack_require__.d(__webpack_exports__, "HistoricalNumber", function() { return HistoricalNumber_HistoricalNumber; });
/* concated harmony reexport HistoricalObject */__webpack_require__.d(__webpack_exports__, "HistoricalObject", function() { return HistoricalObject_HistoricalObject; });
/* concated harmony reexport HistoricalString */__webpack_require__.d(__webpack_exports__, "HistoricalString", function() { return HistoricalString_HistoricalString; });
/* concated harmony reexport HistoricalUndefined */__webpack_require__.d(__webpack_exports__, "HistoricalUndefined", function() { return HistoricalUndefined_HistoricalUndefined; });
/* concated harmony reexport HistoricalDate */__webpack_require__.d(__webpack_exports__, "HistoricalDate", function() { return HistoricalDate_HistoricalDate; });
/* concated harmony reexport ModelResult */__webpack_require__.d(__webpack_exports__, "ModelResult", function() { return ModelResult; });
/* concated harmony reexport ElementReference */__webpack_require__.d(__webpack_exports__, "ElementReference", function() { return ElementReference_ElementReference; });
/* concated harmony reexport IndexReference */__webpack_require__.d(__webpack_exports__, "IndexReference", function() { return IndexReference_IndexReference; });
/* concated harmony reexport LocalElementReference */__webpack_require__.d(__webpack_exports__, "LocalElementReference", function() { return LocalElementReference_LocalElementReference; });
/* concated harmony reexport LocalModelReference */__webpack_require__.d(__webpack_exports__, "LocalModelReference", function() { return LocalModelReference_LocalModelReference; });
/* concated harmony reexport LocalPropertyReference */__webpack_require__.d(__webpack_exports__, "LocalPropertyReference", function() { return LocalPropertyReference_LocalPropertyReference; });
/* concated harmony reexport LocalRangeReference */__webpack_require__.d(__webpack_exports__, "LocalRangeReference", function() { return LocalRangeReference_LocalRangeReference; });
/* concated harmony reexport ModelReference */__webpack_require__.d(__webpack_exports__, "ModelReference", function() { return ModelReference_ModelReference; });
/* concated harmony reexport PropertyReference */__webpack_require__.d(__webpack_exports__, "PropertyReference", function() { return PropertyReference_PropertyReference; });
/* concated harmony reexport RangeReference */__webpack_require__.d(__webpack_exports__, "RangeReference", function() { return RangeReference_RangeReference; });
/* concated harmony reexport RealTimeArray */__webpack_require__.d(__webpack_exports__, "RealTimeArray", function() { return RealTimeArray_RealTimeArray; });
/* concated harmony reexport RealTimeBoolean */__webpack_require__.d(__webpack_exports__, "RealTimeBoolean", function() { return RealTimeBoolean_RealTimeBoolean; });
/* concated harmony reexport RealTimeElement */__webpack_require__.d(__webpack_exports__, "RealTimeElement", function() { return RealTimeElement_RealTimeElement; });
/* concated harmony reexport RealTimeModel */__webpack_require__.d(__webpack_exports__, "RealTimeModel", function() { return RealTimeModel_RealTimeModel; });
/* concated harmony reexport RealTimeNull */__webpack_require__.d(__webpack_exports__, "RealTimeNull", function() { return RealTimeNull_RealTimeNull; });
/* concated harmony reexport RealTimeNumber */__webpack_require__.d(__webpack_exports__, "RealTimeNumber", function() { return RealTimeNumber_RealTimeNumber; });
/* concated harmony reexport RealTimeObject */__webpack_require__.d(__webpack_exports__, "RealTimeObject", function() { return RealTimeObject_RealTimeObject; });
/* concated harmony reexport RealTimeString */__webpack_require__.d(__webpack_exports__, "RealTimeString", function() { return RealTimeString_RealTimeString; });
/* concated harmony reexport RealTimeDate */__webpack_require__.d(__webpack_exports__, "RealTimeDate", function() { return RealTimeDate_RealTimeDate; });
/* concated harmony reexport RealTimeUndefined */__webpack_require__.d(__webpack_exports__, "RealTimeUndefined", function() { return RealTimeUndefined_RealTimeUndefined; });
/* concated harmony reexport ModelCollaborator */__webpack_require__.d(__webpack_exports__, "ModelCollaborator", function() { return ModelCollaborator; });
/* concated harmony reexport ReferenceChangedEvent */__webpack_require__.d(__webpack_exports__, "ReferenceChangedEvent", function() { return ReferenceChangedEvent; });
/* concated harmony reexport ReferenceClearedEvent */__webpack_require__.d(__webpack_exports__, "ReferenceClearedEvent", function() { return ReferenceClearedEvent; });
/* concated harmony reexport ReferenceDisposedEvent */__webpack_require__.d(__webpack_exports__, "ReferenceDisposedEvent", function() { return ReferenceDisposedEvent; });
/* concated harmony reexport PresenceService */__webpack_require__.d(__webpack_exports__, "PresenceService", function() { return PresenceService_PresenceService; });
/* concated harmony reexport UserPresence */__webpack_require__.d(__webpack_exports__, "UserPresence", function() { return UserPresence_UserPresence; });
/* concated harmony reexport UserPresenceSubscription */__webpack_require__.d(__webpack_exports__, "UserPresenceSubscription", function() { return UserPresenceSubscription_UserPresenceSubscription; });
/* concated harmony reexport PresenceAvailabilityChangedEvent */__webpack_require__.d(__webpack_exports__, "PresenceAvailabilityChangedEvent", function() { return PresenceAvailabilityChangedEvent; });
/* concated harmony reexport PresenceStateClearedEvent */__webpack_require__.d(__webpack_exports__, "PresenceStateClearedEvent", function() { return PresenceStateClearedEvent; });
/* concated harmony reexport PresenceStateRemovedEvent */__webpack_require__.d(__webpack_exports__, "PresenceStateRemovedEvent", function() { return PresenceStateRemovedEvent; });
/* concated harmony reexport PresenceStateSetEvent */__webpack_require__.d(__webpack_exports__, "PresenceStateSetEvent", function() { return PresenceStateSetEvent; });
/* concated harmony reexport ConvergenceEventEmitter */__webpack_require__.d(__webpack_exports__, "ConvergenceEventEmitter", function() { return ConvergenceEventEmitter_ConvergenceEventEmitter; });
/* concated harmony reexport ConvergenceServerError */__webpack_require__.d(__webpack_exports__, "ConvergenceServerError", function() { return ConvergenceServerError; });
/* concated harmony reexport ConvergenceError */__webpack_require__.d(__webpack_exports__, "ConvergenceError", function() { return ConvergenceError; });
/* concated harmony reexport CancellationToken */__webpack_require__.d(__webpack_exports__, "CancellationToken", function() { return CancellationToken; });
/* concated harmony reexport PagedData */__webpack_require__.d(__webpack_exports__, "PagedData", function() { return PagedData; });
/* concated harmony reexport StringMap */__webpack_require__.d(__webpack_exports__, "StringMap", function() { return StringMap; });
/* concated harmony reexport LogLevel */__webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/* concated harmony reexport ConnectedEvent */__webpack_require__.d(__webpack_exports__, "ConnectedEvent", function() { return ConnectedEvent; });
/* concated harmony reexport ConnectionFailedEvent */__webpack_require__.d(__webpack_exports__, "ConnectionFailedEvent", function() { return ConnectionFailedEvent; });
/* concated harmony reexport ConnectionScheduledEvent */__webpack_require__.d(__webpack_exports__, "ConnectionScheduledEvent", function() { return ConnectionScheduledEvent; });
/* concated harmony reexport ConnectingEvent */__webpack_require__.d(__webpack_exports__, "ConnectingEvent", function() { return ConnectingEvent; });
/* concated harmony reexport AuthenticatingEvent */__webpack_require__.d(__webpack_exports__, "AuthenticatingEvent", function() { return AuthenticatingEvent; });
/* concated harmony reexport AuthenticatedEvent */__webpack_require__.d(__webpack_exports__, "AuthenticatedEvent", function() { return AuthenticatedEvent; });
/* concated harmony reexport AuthenticationFailedEvent */__webpack_require__.d(__webpack_exports__, "AuthenticationFailedEvent", function() { return AuthenticationFailedEvent; });
/* concated harmony reexport DisconnectedEvent */__webpack_require__.d(__webpack_exports__, "DisconnectedEvent", function() { return DisconnectedEvent; });
/* concated harmony reexport InterruptedEvent */__webpack_require__.d(__webpack_exports__, "InterruptedEvent", function() { return InterruptedEvent; });
/* concated harmony reexport ErrorEvent */__webpack_require__.d(__webpack_exports__, "ErrorEvent", function() { return ErrorEvent; });
/* concated harmony reexport IdbStorageAdapter */__webpack_require__.d(__webpack_exports__, "IdbStorageAdapter", function() { return IdbStorageAdapter_IdbStorageAdapter; });

/* harmony default export */ var main = __webpack_exports__["default"] = (Convergence_Convergence);













/***/ })
/******/ ]);
//# sourceMappingURL=convergence.global.js.map