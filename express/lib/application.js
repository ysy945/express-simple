const { slice, finalHandler, getType, createError ,isArray} = require("./utils")
const METHODS = require("./METHODS")
const Router = require("./router")
const http = require("http")


const app = module.exports = {}

app.lazyrouter = function () {
    if (!this._router) {
        this._router = new Router()
    }
    return this
}

app.listen = function () {
    const server = http.createServer(this)
    return server.listen.apply(
        server,
        slice.call(arguments)
    )
}

app.handle = function (req, res, callback) {
    const done = callback || finalHandler

    if (!this._router) {
        done()
        return
    }
   
    this._router.handle(req, res, done)
}

app.use = function (fn, ...rest) {
    let path = "/"
    let resultFns = []
    const self = this
    
    if (getType(fn) === "string") {
        path = fn
        resultFns = rest
    }

    if (getType(fn) === "function") {
       resultFns = [fn,...rest]
    }

    this.lazyrouter()
    resultFns.forEach(fn=>{
        if(getType(fn) !== "function"){
             const err = "app.use() required callback function"
             createError(err)
        }
        else{
            self._router.use(path,fn)
        }
    })
    return this
}

app.all = function(path){

    this.lazyrouter()

    const fn =slice.call(arguments,1)

    METHODS.forEach(method=>{
        const route = this._router.route(path)
        route[method].apply(route,fn)
    })
    return this
    
}

app.params = function(name,fn){

    this.lazyrouter()

   if(isArray(name)){
      for(let i = 0,j=name.length;i<j;i++){
          const oneName = name[i]
          this._router.param(oneName,fn)
      }
      return this
   }
   
   this._router.param(name,fn)
   return this
}


METHODS.forEach(method => {
    app[method] = function (path) {
        //如果不存在this._router就创建它
        this.lazyrouter()
        const route = this._router.route(path)
        route[method].apply(route, slice.call(arguments, 1))
        // console.log(this._router.stack);
    }
})
