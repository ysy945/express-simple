const METHODS = require("../METHODS")
const {flatten,slice,createError,toString,isFunction, getType} = require("../utils")
const Layer = require("./layer")

function Route(path){
    this.path = path
    this.methods = {}
    this.stack = []
}

METHODS.forEach(method=>{
    Route.prototype[method] = function(){
      const handlers = flatten(slice.call(arguments))//[...arguments]
      const len = handlers.length
      for(let i=0;i<len;i++){
          const handler = handlers[i]

          if(!isFunction(handler)){
              const type = toString(handler)
              const err = `Route.${method} required type of function but got type of ${type}`
              createError(err)
          }

          const routeLayer = new Layer("/",{},handler)
          routeLayer.method = method
          this.methods[method] = true
          this.stack.push(routeLayer)
      }
      return this
    }
})

Route.prototype.dispatch = function(req,res,done){
    let idx = 0
    let layer
    const stack = this.stack

    next()
    function next(err){
        layer = stack[idx++]

        //如果layer不存在了则退出
        if(!layer){
            return done(err)
        }

        if(req.method.toLowerCase() !== layer.method){
           next(err)
           return 
        }

        if(err){
            layer.handle_error(err,req,res,next)
        }
        else{
            layer.handle_request(req,res,next)
        }
       
    }
}

Route.prototype.handle_method = function(method){
    const methods = this.methods
    method = method.toLowerCase()
    return Boolean(methods[method])
}

Route.prototype.all = function(){
   const handlers = flatten(slice.call(arguments))

   handlers.forEach(handler=>{
       if(!isFunction(handler)){
           const type = getType(handler)
           const err = "route.all() required type of function but got type of " + type
           createError(err)
       }
       const routeLayer = new Layer("/",{},handler)
       routeLayer.method = undefined
       this.methods.all = true
       this.stack.push(routeLayer)
   })
   return this
}

module.exports = Route