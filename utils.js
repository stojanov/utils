/**
 * TODO: Add a curried version of every funcion.
 */


/**
 * A very bare bones set of functional tools
 */

// Export Object
const _ = {};

/**
 * Various helpful functions
 */

const id = _.id = function(x) {
    return x;
}

const times = _.times = function(len, fn) {
    for(var i = 0; i < len; fn(i++));
}

const createObj = _.createObj = function() {
    const keys = Array.from(arguments);
    return function() {
        const props = Array.from(arguments);
        return keys.reduce((last, curr, i) => {
            last[curr] = props[i];
            return last;
        }, {});
    }
}

const newPromise = _.newPromise = function(fn) {
    return new Promise(function(resolve, reject) {
        fn(
            function(err, data) {
                if(err)
                    reject(err);
                resolve(data);
            }
        )
    });
}

/**
 * Logical operations
 */

const logicalOr = _.logicalOr = function(a, b) {
    return a || b;
}

const logicalAnd = _.logicalAnd = function(a, b) {
    return a && b;
}

const logicalNegate = _.logicalNegate = function(x) {
    return !x;
}

const logicalGrt = _.logicalGrt = function(a, b) {
    return a > b;
}

const logicalLess = _.logicalLess = function(a, b) {
    return a < b;
}

const logicalXOR = _.logicalXOR = function(a, b) {
    return (a || b) && !(a && b);
}

const fnNegate = _.fnNegate = function(fn) {
    return function() {
        const args = arrFrom(arguments);
        const res = fn.apply(fn, args);
        return !res;
    }
}

const toBool = _.toBool = function(x) {
    return !!x;
}

const concatOr = _.concatOr = function() {
    const args = Array.from(arguments);
    return args.reduce(logicalOr, false);
}

const concatAnd = _.concatAnd = function() {
    const args = Array.from(arguments);
    return args.reduce(logicalAnd, true);
}

const fnConcat = _.fnConcat = function(mapFn) {
    return function() {
        const args = Array.from(arguments);
        return function(x) {
            const res = args.map(fn => fn(x));
            return mapFn.apply(null, res)
        }
    }
}

const fnConcatOr = _.fnConcatOr = fnConcat(concatOr);
const fnConcatAnd = _.fnConcatAnd = fnConcat(concatAnd);

/**
 * Type checking
 */

const isTypeOf = _.isTypeOf = function(type) {
    return function(x) {
        return typeof x === type;
    }
}

const isNum = _.isNum = isTypeOf('number');

const isString = _.isString = isTypeOf('string');

const isAlphaNum = _.isAlphaNum = fnConcatOr(isNum, isString);

const isFn = _.isFn = isTypeOf('function');

const isArr = _.isArr = function(arr) {
    return Array.isArray(arr);
}

const isObj = _.isObj = function(obj) {
    return fnConcatAnd(
        toBool,
        fnNegate(isArr)
    )
}

/**
 * Function manipulation
 */

// Curry done the manual way
const curry2 = _.curry2 = function(fn) {
    return function(arg1) {
        return function(arg2) {
            return fn(arg1, arg2);
        }
    }
}

const curry2rev = _.curry2rev = function(fn) {
    return function(arg2) {
        return function(arg1) {
            return fn(arg1, arg2);
        }
    }
}

const pipeCore = function(v, funcs) {
    return funcs.reduce(function(last, curr) {
        return curr(last);
    }, v);
}

// Curried versions of pipe done manually
const pipe = _.pipe = function(v) {
    return function() {
        const funcs = Array.from(arguments);
        return pipeCore(v, funcs);
    }
}

const rpipe = _.rpipe = function() {
    const funcs = Array.from(arguments).reverse;
    return function(v) {
        return pipeCore(v, funcs);
    }
}

const once = _.once = function(fn) {
    let hasRan = false;
    let result = null;
    
    return function() {
        const args = Array.from(arguments);

        if(hasRan)
            return result;

        else {
            hasRan = true
            result = fn.apply(fn, args);
        }

    }
}


const bind = _.bind = function() {
    const args = Array.from(arguments);
    return args[0].bind(args[1], args.slice(2));
}

const bindArr = _.bindArr = function(fn, obj, args) {
    return fn.bind(obj, args);
}

const apply = _.apply = function() {
    const args = Array.from(arguments);
    return args[0].apply(args[1], args.slice(2));
}

/**
 * Arrays, lists, collections
 */

const size = _.size = function(arr) {

    if(Array.isArray(arr))
        return arr.length;

    if(!!arr && typeof arr === 'object')
        return Object.keys(arr).length;
    
    return null;
}

const fillArr = _.fillArr = function(len, fn = id) {
    const element = fn(len);
    return len === 0
        ? [element]
        : fillArr(--len, fn).concat(element);
}

const copyArr = _.copyArr = function(arr) {
    return [].slice.call(arr);
}

const each = _.each = function(arr, fn) {
    arr.forEach(fn);
}

const map = _.map = function(arr, fn) {
    return arr.map(fn);
}

const mapc = _.mapc = curry2(map);

const filter = _.filter = function(arr, fn) {
    return arr.filter(fn);
}

const filterc = _.filterc = curry2(filter);

const pluck = _.pluck = function(arr, prop) {
    return arr.map(obj => {

        if(obj.hasOwnProperty(prop))
            return obj[prop];

        return obj;
    });
}

const reduce = _.reduce = function(arr, fn, v) {
    return arr.reduce(fn, v);
}

const reducec = _.reducec = function(arr) {
    return function(fn, v) {
        return reduce(arr, fn, v);
    }
}

const removeFirst = _.removeFirst = function(arr) {
    const marr = [].slice.call(arr);
    marr.shift();
    return marr;
}

// TODO: Add support for objects
const getFirstValue = _.getFirstValue = function(arr) {
    return arr[0];
}

const getLastValue = _.getLastValue = function(arr) {
    return arr[arr.length - 1];
}

const getProp = _.getProp = function(arr, el_prop) {
    return arr[el_prop];
}

const reject = _.reject = function(arr, fn) {
    const a = [].slice.call(arr);

    a.forEach(function(el, i) {
        if(!fn(el))
            a.splice(i, 1);
    });

    return a;
}

/**
 * Arrays passed by reference get modified
 */
const concat = _.concat = function(arr1, arr2) {

    if(!isArr(arr2)) {
        arr1.push(arr2);
        return arr1;
    }
    
    return arr2.reduce(function(arr, curr) {
        arr.push(curr);
        return arr;
    }, a);
}


/**
 * Concats the arrays without modifying the original 
 * and returns a new array
 */
const constConcat = _.constConcat = function(arr1, arr2) {
    const a = [].slice.call(arr1);

    if(!isArr(arr2)) {
        a.push(arr2);
        return a;        
    }

    return Array.from(arr2)
        .reduce(function(arr, curr) {
            arr.push(curr);
            return arr;
        }, a);
}

const concatAll = _.concatAll = function(arr) {
    return arr.reduce(function(last, curr) {
        const res = isArr(curr)
            ? concatAll(curr)
            : curr;
        return concat(last, res);
    }, []);
}

const partition = _.partition = function(arr, fn) {
    return arr.reduce((last, curr) => {
        if(fn(curr))
            last[0].push(curr);
        else
            last[1].push(curr);
        return last;
    }, [[], []]);
}

/**
 * Strings
 */

const split = _.strSplit = function(str, where) {
    return str.split(where || '');
}

const match = _.strMatch = function(str, regEx) {
    return str.match(regEx);
}

const deleteFromString = _.deleteFromString = function(str, srch) {
    return str
        .split(srch)
        .join('');
}

module.exports = _;