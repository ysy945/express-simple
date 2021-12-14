const toString = function(arg){
    return Object.prototype.toString.call(arg)
}
const slice = Array.prototype.slice

const setPrototypeOf = Object.setPrototypeOf

function isObject(obj){
    return toString.call(obj) === "[object Object]"
}

function isFunction(fun){
    return typeof fun === "function"
}

function isArray(arr){
    return Array.isArray(arr)
}

function getType(arg){
    return typeof arg
}

function createError(err){
    throw new Error(err)
}

function mixin(obj,proto){
    if(!obj){
        const err = "arguments of obj is required in mixin()"
        createError(err)
    }
    if(!proto){
        const err = "arguments of proto is required in mixin()"
        createError(err)
    }
    Object.getOwnPropertyNames(proto).forEach(key=>{
        const descriptor = Object.getOwnPropertyDescriptor(proto,key)
        Object.defineProperty(obj,key,descriptor)
    })
}

function flatten(arr,initArr=[]){
    if(isArray(arr)){
        arr.forEach(one=>{
            if(isArray){
                flatten(one,initArr)
            }
            else{
                initArr.push(one)
            }
        })
    }
    else{
        initArr.push(arr)
    }
    return initArr
}

function parseUrl(req){
    const ret = {}
    const url = req.url
    if(url.includes("?")){
        const pathname = url.split("?")[0]
        ret.pathname = pathname
    }
    else{
        ret.pathname = url
    }
    return ret
}

function finalHandler(){
    return 1
}


module.exports = {
    flatten,
    mixin,
    createError,
    getType,
    isObject,
    isFunction,
    isArray,
    slice,
    toString,
    setPrototypeOf,
    parseUrl,
    finalHandler
}