(function() {
    /**
     * Export setup
     */
    let root = this;
    
    // Export Object
    const _ = {};

    if(typeof exports != 'undefined' && !exports.nodeType) {
        if(typeof module != 'undefined' && !module.nodeType && module.exports)
            exports = module.exports = _;
        exports._ = _;
    } else {
        root._ = _;
    }


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
            return keys.reduce(function(last, curr, i) {
                last[curr] = props[i];
                return last;
            }, {});
        }
    }

    const createConsts = _.createConsts = function() {
        const mainArgs = Array.from(arguments);
        return mainArgs.reduce(function(last, curr) {
            curr = curr.trim();
            last[curr] = curr;
            return last;
        }, {});
    }

    // For hashing purposes
    const arrToString = _.arrToString = function(arr, separator = '') {
        const args = Array.from(arguments);

        return arr.reduce(function(last, curr, i) {
            let str;

            if(!Array.isArray(curr) && typeof curr == 'object')
                str = JSON.stringify(curr);
            else if(Array.isArray(curr))
                str = '[' + arrToString(curr, separator) + ']';
            else
                str = curr;

            last += str + (arr.length - 1 == i ? '' : separator);
            
            return last;
        }, '');
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
     * Currying functions
     */
    
    const makeCurry = _.makeCurry = function makeCurry(functor) {
        return function curry(f) {
            const arity = f.length;
            let fArgs = [].slice.call(arguments, 1);
    
            const getArgs = function() {
                let scopedArgs = fArgs;
    
                if(arguments.length > 0)
                    scopedArgs = scopedArgs.concat([].slice.call(arguments));
    
                if(scopedArgs.length >= arity)
                    return f.apply(this, functor(scopedArgs));
                else
                    return curry.apply(this, [f].concat(scopedArgs));
            }
    
            return fArgs.length >= arity ? getArgs() : getArgs;
        }
    }
    
    const makeCurryExplicit = _.makeCurryExplicit = function makeCurryExplicit(functor) {
        return function curryExplicit(f, airty) {
            let fArgs = [].slice.call(arguments, 2);
    
            const getArgs = function() {
                let scopedArgs = fArgs;
    
                if(arguments.length > 0) 
                    scopedArgs = scopedArgs.concat([].slice.call(arguments));
    
                if(scopedArgs.length >= airty)
                    return f.apply(this, functor(scopedArgs));
                else
                    return curryExplicit.apply(this, [f, airty].concat(scopedArgs));
            }
    
            return fArgs.length >= airty ? getArgs() : getArgs;
        }
    }

    const curry = _.curry = makeCurry(id);
    const curryRev = _.curryRev = makeCurry(args => args.reverse());

    const curryExplicit = _.curryExplicit = makeCurryExplicit(id);
    const curryExplicitRev = _.curryExplicitRev = makeCurryExplicit(args => args.reverse());

    const nCurry = _.nCurry = function nCurry(arity) {
        return function(fn) {
            return curryExplicit(fn, arity);
        }
    }

    const nCurryRev = _.nCurryRev = function nCurryRev(arity) {
        return function(fn) {
            return curryExplicitRev(fn, arity);
        }
    }

    const curry2 = _.curry2 = nCurry(2); 
    const curry2rev = _.curry2rev = nCurryRev(2);

    const curry3 = _.curry2 = nCurry(3); 
    const curry3rev = _.curry2rev = nCurryRev(3);

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

    const equals = _.equals = function(a, b) {
        return a == b;
    }

    const equalsC = _.equalsC = curry2(equals);

    const typeEquals = _.typeEquals = function(a, b) {
        return a === b;
    }

    const typeEqualsC = _.typeEqualsC = curry2(typeEquals)

    const fnNegate = _.fnNegate = function(fn) {
        return function() {
            const args = Array.from(arguments);
            const res = fn.apply(this, args);
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

    const STRING_TYPES = _.STRING_TYPES = {
        STRING : 'string',
        NUMBER : 'number',
        FUNCTION : 'function',
        BOOL : 'boolean',
        OBJECT : 'object',
        SYMBOL : 'symbol',
        UNDEFINED : 'undefined'
    }

    const isTypeOf = _.isTypeOf = function(type, x) {
        return typeof x === type;
    }

    const isTypeOfC = _.isTypeOfC = curry2(isTypeOf);

    const isTypeOfCR = _.isTypeOfCR = curry2rev(isTypeOf);

    const isUndefined = _.isUndefined = typeEqualsC(undefined);

    const isNULL = _.isNULL = equalsC(null);

    const isValid = _.isValid = fnConcatOr(
        toBool,
        fnNegate(isNULL)
    )

    const isNum = _.isNum = isTypeOfC(STRING_TYPES.NUMBER);

    const isString = _.isString = isTypeOfC(STRING_TYPES.STRING);

    const isAlphaNum = _.isAlphaNum = fnConcatOr(isNum, isString);

    const isFn = _.isFn = isTypeOfC(STRING_TYPES.FUNCTION);

    const isArr = _.isArr = function(arr) {
        return Array.isArray(arr);
    }

    const isObj = _.isObj = fnConcatAnd(
        isTypeOfC(STRING_TYPES.OBJECT),
        toBool,
        fnNegate(isArr)
    )

    /**
     * Function manipulation
     */

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
        const funcs = Array.from(arguments).reverse();
        return function(v) {
            return pipeCore(v, funcs);
        }
    }

    const once = _.once = function(fn) {
        let hasRan = false;
        let result = null;
        
        return function() {
            const args = Array.from(arguments);

            if(!hasRan) {
                hasRan = true;
                result = fn.apply(this, args);
            }

            return result;
        }
    }

    const memoize = _.memoize = function(fn) {
        let cache = {};

        return function() {
            const args  = [].slice.call(arguments);
            
            const argsStr = arrToString(args);
            
            if(argsStr in cache)
                return cache[argsStr];
            else
                return (cache[argsStr] = fn.apply(this, args));
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


    const getArr = _.getArr = function(arr) {
        return Array.from(arr);
    }

    const size = _.size = function(arr) {

        if(Array.isArray(arr))
            return arr.length;

        if(!!arr && typeof arr === 'object')
            return Object.keys(arr).length;
        
        return null;
    }

    const reverse = _.reverse = function(arr) {
        return arr.reverse();
    }

    const fillArr = _.fillArr = function(len, fn = id) {
        const element = fn(--len);
        return len === 0
            ? [element]
            : fillArr(len, fn).concat(element);
    }

    const fillArrC = _.fillArrC = curry2(fillArr);

    const fillArrCR = _.fillArrCR = curry2rev(fillArr);

    const copyArr = _.copyArr = function(arr) {
        return [].slice.call(arr);
    }

    const each = _.each = function(arr, fn) {
        arr.forEach(fn);
    }

    const eachC = _.eachC = curry2(each);

    const eachCR = _.eachCR = curry2(each);

    const map = _.map = function(arr, fn) {
        return arr.map(fn);
    }

    const mapC = _.mapC = curry2(map);

    const mapCR = _.mapCR = curry2rev(map);

    const filter = _.filter = function(arr, fn) {
        return arr.filter(fn);
    }

    const filterC = _.filterC = curry2(filter);

    const filterCR = _.filterCR = curry2rev(filter);

    const pluck = _.pluck = function(arr, prop) {
        return arr.map(obj => {

            if(obj.hasOwnProperty(prop))
                return obj[prop];

            return obj;
        });
    }

    const pluckC = _.pluckC = curry2(pluck);

    const pluckCR = _.pluckCR = curry2rev(pluck);

    const reduce = _.reduce = function(arr, fn, v) {
        return arr.reduce(fn, v);
    }
    
    const reduceC = _.reduceC = curry3(reduce);

    const removeFirst = _.removeFirst = function(arr) {
        return arr.shift();
    }

    const constRemoveFirst = _.constRemoveFirst = function(arr) {
        const marr = [].slice.call(arr);
        marr.shift();
        return marr;
    }

    const getFirstValue = _.getFirstValue = function(arr) {
        return arr[0];
    }

    const getLastValue = _.getLastValue = function(arr) {
        return arr[arr.length - 1];
    }

    const getProp = _.getProp = function(arr, el_prop) {
        return arr[el_prop];
    }

    const getPropC = _.getPropC = curry2(getProp);

    const getPropCR = _.getPropCR = curry2rev(getProp);

    const reject = _.reject = function(arr, fn) {
        const a = [].slice.call(arr);

        a.forEach(function(el, i) {
            if(!fn(el))
                a.splice(i, 1);
        });

        return a;
    }

    const rejectC = _.rejectC = curry2(reject);

    const rejectCR = _.rejectCR = curry2rev(reject);

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
        }, arr1);
    }

    const concatC = _.concatC = curry2(concat);

    const concatCR = _.concatCR = curry2rev(concat);

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

    const partitionC = _.partitionC = curry2(partition);

    const partitionCR = _.partitionCR = curry2rev(partition);

    /**
     * Strings
     */

    const split = _.strSplit = function(str, where) {
        return str.split(where || '');
    }

    const splitC = _.strSplitC = curry2(split);

    const splitCR = _.strSplitCR = curry2rev(split);

    const match = _.strMatch = function(str, regEx) {
        return str.match(regEx);
    }

    const matchC = _.strMatchC = curry2(match);

    const matchCR = _.strMatchCR = curry2rev(match);

    const deleteFromString = _.deleteFromString = function(str, srch) {
        return str
            .split(srch)
            .join('');
    }

    const deleteFromStringC = _.deleteFromStringC = curry2(deleteFromString);

    const deleteFromStringCR = _.deleteFromStringCR = curry2rev(deleteFromString);

})();